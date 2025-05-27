import React, { useState, useRef, useEffect, useCallback } from "react";
import CreateElementModal from "./components/CreateElementModal";
import Relation from "./types/Relation";
import Element from "./types/Element";
import RelationTypes from "./types/RelationTypes";
import PlusIcon from "./components/PlusIcon";
import TrashIcon from "./components/TrashIcon";
import RefreshIcon from "./components/RefreshIcon";

export type RelationTypeKey = keyof typeof RelationTypes;

interface MousePosition {
  x: number;
  y: number;
}

interface DrawingState {
  isDrawing: boolean;
  drawingFrom: string | null;
  mousePosition: MousePosition;
}

const AVAILABLE_ICONS = [
  "wizard.png",
  "knight.png",
  "healer.png",
  "archer.png",
  "warrior.png",
  "mage.png",
  "rogue.png",
  "priest.png",
];

const SystemicConstellationsApp = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [relations, setRelations] = useState<Relation[]>([]);
  const [relationType, setRelationType] = useState<RelationTypeKey>("neutral");

  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    drawingFrom: null,
    mousePosition: { x: 0, y: 0 },
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  const getContainerRect = useCallback(() => {
    return containerRef.current?.getBoundingClientRect();
  }, []);

  const getRandomPosition = useCallback(() => {
    const containerRect = getContainerRect();
    const centerX = Number(containerRect?.width) / 2;
    const centerY = Number(containerRect?.height) / 2;
    const randomOffset = () => Math.random() * 150 - 75;

    return {
      x: centerX + randomOffset(),
      y: centerY + randomOffset(),
    };
  }, [getContainerRect]);

  const getMousePosition = useCallback(
    (e: React.MouseEvent): MousePosition => {
      const containerRect = getContainerRect();
      return {
        x: e.clientX - Number(containerRect?.left),
        y: e.clientY - Number(containerRect?.top),
      };
    },
    [getContainerRect]
  );

  const addElement = useCallback(
    (name: string, icon: string, color: string) => {
      if (!name.trim() || !icon) return;

      const position = getRandomPosition();
      const newElement: Element = {
        id: Date.now(),
        name: name,
        icon: icon,
        color: color,
        ...position,
      };

      setElements((prev) => [...prev, newElement]);
      setShowAddModal(false);
    },
    [getRandomPosition]
  );

  const deleteElement = useCallback(
    (id: number) => {
      setElements((prev) => prev.filter((element) => element.id !== id));
      setRelations((prev) =>
        prev.filter(
          (relation) =>
            relation.from !== String(id) && relation.to !== String(id)
        )
      );

      if (selectedElement?.id === id) {
        setSelectedElement(null);
      }
    },
    [selectedElement]
  );

  const startDrawingRelation = useCallback((id: string) => {
    setDrawingState((prev) => ({
      ...prev,
      isDrawing: true,
      drawingFrom: id,
    }));
  }, []);

  const finishDrawingRelation = useCallback(
    (toId: number) => {
      const { isDrawing, drawingFrom } = drawingState;

      if (!isDrawing || drawingFrom === String(toId)) {
        setDrawingState((prev) => ({
          ...prev,
          isDrawing: false,
          drawingFrom: null,
        }));
        return;
      }

      setRelations((prev) => {
        const exists = prev.some(
          (r) =>
            (r.from === drawingFrom && r.to === String(toId)) ||
            (r.from === String(toId) && r.to === drawingFrom)
        );

        if (exists) {
          return prev.map((r) =>
            (r.from === drawingFrom && r.to === String(toId)) ||
            (r.from === String(toId) && r.to === drawingFrom)
              ? { ...r, type: relationType }
              : r
          );
        }

        return [
          ...prev,
          {
            from: String(drawingFrom),
            to: String(toId),
            type: relationType,
          },
        ];
      });

      setDrawingState((prev) => ({
        ...prev,
        isDrawing: false,
        drawingFrom: null,
      }));
    },
    [drawingState, relationType]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, id: number) => {
      e.stopPropagation();

      if (e.shiftKey) {
        const mousePosition = getMousePosition(e);
        setDrawingState((prev) => ({ ...prev, mousePosition }));
        startDrawingRelation(String(id));
      } else {
        const element = elements.find((el) => el.id === id) || null;
        setSelectedElement(element);
      }
    },
    [elements, getMousePosition, startDrawingRelation]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (selectedElement !== null) {
        const position = getMousePosition(e);
        setElements((prev) =>
          prev.map((element) =>
            element.id === selectedElement.id
              ? { ...element, ...position }
              : element
          )
        );
      }

      if (drawingState.isDrawing) {
        const mousePosition = getMousePosition(e);
        setDrawingState((prev) => ({ ...prev, mousePosition }));
      }
    },
    [selectedElement, drawingState.isDrawing, getMousePosition]
  );

  const handleMouseUp = useCallback(() => {
    setSelectedElement(null);
  }, []);

  const resetConstellation = useCallback(() => {
    if (window.confirm("Ви впевнені, що хочете очистити всі елементи?")) {
      setElements([]);
      setRelations([]);
      setNotes("");
    }
  }, []);

  const renderRelationLine = useCallback(
    (relation: Relation) => {
      const fromElement = elements.find(
        (e) => String(e.id) === String(relation.from)
      );
      const toElement = elements.find(
        (e) => String(e.id) === String(relation.to)
      );

      if (!fromElement || !toElement) return null;

      const relationStyle = RelationTypes[relation.type as RelationTypeKey];

      return (
        <line
          key={`${relation.from}-${relation.to}`}
          x1={fromElement.x}
          y1={fromElement.y}
          x2={toElement.x}
          y2={toElement.y}
          stroke={"color" in relationStyle ? relationStyle.color : "#000"}
          strokeWidth={relationStyle.width || 2}
          strokeDasharray={relationStyle.style === "dashed" ? "5,5" : ""}
        />
      );
    },
    [elements]
  );

  const renderDrawingLine = useCallback(() => {
    const { isDrawing, drawingFrom, mousePosition } = drawingState;

    if (!isDrawing || !drawingFrom) return null;

    const fromElement = elements.find((e) => e.id === Number(drawingFrom));
    if (!fromElement) return null;

    return (
      <line
        x1={fromElement.x}
        y1={fromElement.y}
        x2={mousePosition.x}
        y2={mousePosition.y}
        stroke="#000"
        strokeWidth={2}
        strokeDasharray="5,5"
      />
    );
  }, [drawingState, elements]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setSelectedElement(null);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Системні розстановки</h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-gray-200 p-4 flex flex-col">
          <section className="mb-4">
            <h2 className="font-bold mb-2">Елементи ({elements.length})</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded p-2 flex items-center justify-center"
            >
              <PlusIcon />
              <span className="ml-1">Додати елемент</span>
            </button>

            <div className="mt-2 max-h-40 overflow-y-auto">
              {elements.map((element: Element) => (
                <div
                  key={element.id}
                  className="flex items-center justify-between bg-white p-2 mb-1 rounded shadow-sm"
                >
                  <div className="flex items-center">
                    <img
                      src={`/icons/${element.icon}`}
                      alt={element.name}
                      className="w-6 h-6 mr-2 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        (e.currentTarget
                          .nextElementSibling as HTMLElement)!.style.display =
                          "block";
                      }}
                    />
                    <div
                      className="w-6 h-6 rounded-full mr-2 hidden"
                      style={{ backgroundColor: element.color }}
                    />
                    <span className="truncate">{element.name}</span>
                  </div>
                  <button
                    onClick={() => deleteElement(element.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-4">
            <h2 className="font-bold mb-2">Зв'язки</h2>
            <div className="bg-white p-2 rounded">
              <select
                value={relationType}
                onChange={(e) =>
                  setRelationType(e.target.value as RelationTypeKey)
                }
                className="w-full p-1 border rounded"
              >
                {Object.entries(RelationTypes).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <div className="text-xs mt-1 text-gray-600">
                <strong>Щоб створити зв'язок:</strong> клацніть на першому
                елементі, утримуючи Shift, потім клацніть на другому елементі
              </div>
            </div>
          </section>

          <div className="mt-auto">
            <button
              onClick={resetConstellation}
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded p-2 flex items-center justify-center"
            >
              <RefreshIcon />
              <span className="ml-1">Очистити розстановку</span>
            </button>
          </div>
        </aside>
        <main className="flex-1 flex flex-col">
          <div
            ref={containerRef}
            className="flex-1 relative border border-gray-300 bg-white"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {relations.map(renderRelationLine)}
              {renderDrawingLine()}
            </svg>

            {elements.map((element) => (
              <div
                key={element.id}
                className="absolute select-none cursor-move"
                style={{
                  left: element.x,
                  top: element.y,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (drawingState.isDrawing) {
                    finishDrawingRelation(element.id);
                  }
                }}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={`/icons/${element.icon}`}
                    alt={element.name}
                    className="w-16 h-16 object-contain pointer-events-none"
                    style={{
                      filter: `drop-shadow(2px 2px 4px ${element.color}40)`,
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      (e.currentTarget
                        .nextElementSibling as HTMLElement)!.style.display =
                        "flex";
                    }}
                  />
                  <div
                    className="w-16 h-16 rounded-full hidden items-center justify-center text-white font-bold pointer-events-none"
                    style={{ backgroundColor: element.color }}
                  >
                    {element.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="mt-1 bg-white px-2 py-1 rounded shadow-sm text-xs whitespace-nowrap">
                    {element.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="bg-gray-200 p-4">
            <div className="mb-2 font-bold">Нотатки</div>
            <textarea
              className="w-full p-2 rounded border"
              placeholder="Запишіть свої спостереження та інсайти..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </section>
        </main>
      </div>

      {showAddModal && (
        <CreateElementModal
          setShowAddModal={setShowAddModal}
          addElement={addElement}
          availableIcons={AVAILABLE_ICONS}
        />
      )}
    </div>
  );
};

export default SystemicConstellationsApp;