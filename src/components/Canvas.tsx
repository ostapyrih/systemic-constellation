import React, { forwardRef } from 'react';
import { Element, Relation, DrawingState } from '../types';
import ConstellationElement from './ConstellationElement';
import RelationLines from './RelationLines';

interface CanvasProps {
  elements: Element[];
  relations: Relation[];
  drawingState: DrawingState;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onElementMouseDown: (e: React.MouseEvent, id: number) => void;
  onFinishDrawingRelation: (id: number) => void;
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(({
  elements,
  relations,
  drawingState,
  onMouseMove,
  onMouseUp,
  onElementMouseDown,
  onFinishDrawingRelation,
}, ref) => {
  return (
    <div
      ref={ref}
      className="flex-1 relative border border-gray-300 bg-white"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <RelationLines
        relations={relations}
        elements={elements}
        drawingState={drawingState}
      />

      {elements.map((element) => (
        <ConstellationElement
          key={element.id}
          element={element}
          drawingState={drawingState}
          onMouseDown={onElementMouseDown}
          onFinishDrawingRelation={onFinishDrawingRelation}
        />
      ))}
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;