import React, { useState, useRef, useEffect } from "react";
import CreateElementModal from "./components/CreateElementModal";
import ElementTypes from "./types/ElementTypes";
import Relation from "./types/Relation";
import Element from "./types/Element";
import RelationTypes from "./types/RelationTypes";

export type ElementTypeKey = keyof typeof ElementTypes;
export type RelationTypeKey = keyof typeof RelationTypes;

const SystemicConstellationsApp = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [relations, setRelations] = useState<Relation[]>([]);
  const [drawingFrom, setDrawingFrom] = useState<string | null>(null);
  const [relationType, setRelationType] = useState<RelationTypeKey>("neutral");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const addElement = (name: string, type: ElementTypeKey, color: string) => {
    if (!name.trim()) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    const centerX = Number(containerRect?.width) / 2;
    const centerY = Number(containerRect?.height) / 2;

    const randomOffset = () => Math.random() * 150 - 75;

    const newElement: Element = {
      id: Date.now(),
      name: name,
      type: type,
      color: color,
      x: centerX + randomOffset(),
      y: centerY + randomOffset(),
    };

    setElements([...elements, newElement]);
    setShowAddModal(false);
  };

  const deleteElement = (id: number) => {
    setElements(elements.filter((element) => element.id !== id));
    setRelations(
      relations.filter(
        (relation) => relation.from !== String(id) && relation.to !== String(id)
      )
    );
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
  };

  const startDrawingRelation = (id: string) => {
    setIsDrawing(true);
    setDrawingFrom(id);
  };

  const finishDrawingRelation = (toId: number) => {
    if (isDrawing && drawingFrom !== String(toId)) {
      setRelations((prev: Relation[]) => {
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
        } else {
          return [
            ...prev,
            { from: String(drawingFrom), to: String(toId), type: relationType },
          ];
        }
      });
    }
    setIsDrawing(false);
    setDrawingFrom(null);
  };

  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (e.shiftKey) {
      const containerRect = containerRef?.current?.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - Number(containerRect?.left),
        y: e.clientY - Number(containerRect?.top),
      });
      startDrawingRelation(String(id));
    } else {
      setSelectedElement(elements.find((el) => el.id === id) || null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (selectedElement !== null) {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const x = e.clientX - Number(containerRect?.left);
      const y = e.clientY - Number(containerRect?.top);

      setElements(
        elements.map((element) =>
          element.id === selectedElement.id ? { ...element, x, y } : element
        )
      );
    }

    // Track mouse position for drawing lines
    if (isDrawing) {
      const containerRect = containerRef.current?.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - Number(containerRect?.left),
        y: e.clientY - Number(containerRect?.top),
      });
    }
  };

  const handleMouseUp = () => {
    setSelectedElement(null);
  };

  const resetConstellation = () => {
    if (window.confirm("Ви впевнені, що хочете очистити всі елементи?")) {
      setElements([]);
      setRelations([]);
      setNotes("");
    }
  };

  const renderElementShape = (element: Element) => {
    const size = 40;
    const halfSize = size / 2;
    const shapeType = ElementTypes[element.type as ElementTypeKey]?.shape;

    switch (shapeType) {
      case "square":
        return (
          <rect
            x={-halfSize}
            y={-halfSize}
            width={size}
            height={size}
            fill={element.color}
            rx="5"
          />
        );
      case "triangle":
        return (
          <polygon
            points={`0,${-halfSize} ${halfSize},${halfSize} ${-halfSize},${halfSize}`}
            fill={element.color}
          />
        );
      case "star":
        const spikes = 5;
        const outerRadius = halfSize;
        const innerRadius = halfSize / 2;
        let points = "";

        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI / spikes) * i;
          points += `${radius * Math.sin(angle)},${-radius * Math.cos(angle)} `;
        }

        return <polygon points={points} fill={element.color} />;
      case "circle":
      default:
        return <circle r={halfSize} fill={element.color} />;
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setSelectedElement(null);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  const renderRelationLine = (relation: Relation) => {
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
  };

  const renderDrawingLine = () => {
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
  };

  // Компонент для іконки плюс (+)
  const PlusIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  // Компонент для іконки оновлення
  const RefreshIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 4v6h-6"></path>
      <path d="M1 20v-6h6"></path>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
      <path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  );

  // Компонент для іконки видалення
  const TrashIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Системні розстановки</h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-gray-200 p-4 flex flex-col">
          <div className="mb-4">
            <h2 className="font-bold mb-2">Елементи ({elements.length})</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded p-2 flex items-center justify-center"
            >
              <PlusIcon /> <span className="ml-1">Додати елемент</span>
            </button>

            <div className="mt-2 max-h-40 overflow-y-auto">
              {elements.map((element: Element) => (
                <div
                  key={element.id}
                  className="flex items-center justify-between bg-white p-2 mb-1 rounded shadow-sm"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: element.color }}
                    ></div>
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
          </div>

          <div className="mb-4">
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
          </div>

          <div className="mt-auto">
            <button
              onClick={resetConstellation}
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded p-2 flex items-center justify-center"
            >
              <RefreshIcon /> <span className="ml-1">Очистити розстановку</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
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
                  if (isDrawing) {
                    finishDrawingRelation(element.id);
                  }
                }}
              >
                <svg width="80" height="80" className="pointer-events-none">
                  <g transform="translate(40,40)">
                    {renderElementShape(element)}
                    {element.type === "emotion" && (
                      <text
                        y="5"
                        textAnchor="middle"
                        className="text-xs"
                        fill="white"
                        style={{ pointerEvents: "none" }}
                      >
                        {element.name.substring(0, 1)}
                      </text>
                    )}
                  </g>
                </svg>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow-sm text-xs whitespace-nowrap">
                  {element.name}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-200 p-4">
            <div className="mb-2 font-bold">Нотатки</div>
            <textarea
              className="w-full p-2 rounded border"
              placeholder="Запишіть свої спостереження та інсайти..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
      {showAddModal && (
        <CreateElementModal
          setShowAddModal={setShowAddModal}
          addElement={addElement}
        />
      )}
    </div>
  );
};

export default SystemicConstellationsApp;
