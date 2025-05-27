import { useState, useRef, useCallback } from 'react';
import { Element, Relation, DrawingState, MousePosition, RelationTypeKey } from '../types';

const useConstellationLogic = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
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
    }
  }, []);

  return {
    elements,
    relations,
    relationType,
    drawingState,
    containerRef,
    addElement,
    deleteElement,
    finishDrawingRelation,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetConstellation,
    setRelationType,
  };
};

export default useConstellationLogic;