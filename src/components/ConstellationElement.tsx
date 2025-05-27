import React from 'react';
import { Element, DrawingState } from '../types';

interface ConstellationElementProps {
  element: Element;
  drawingState: DrawingState;
  onMouseDown: (e: React.MouseEvent, id: number) => void;
  onFinishDrawingRelation: (id: number) => void;
}

const ConstellationElement: React.FC<ConstellationElementProps> = ({
  element,
  drawingState,
  onMouseDown,
  onFinishDrawingRelation,
}) => {
  return (
    <div
      className="absolute select-none cursor-move"
      style={{
        left: element.x,
        top: element.y,
        transform: "translate(-50%, -50%)",
      }}
      onMouseDown={(e) => onMouseDown(e, element.id)}
      onClick={(e) => {
        e.stopPropagation();
        if (drawingState.isDrawing) {
          onFinishDrawingRelation(element.id);
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
            (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "flex";
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
  );
};

export default ConstellationElement;