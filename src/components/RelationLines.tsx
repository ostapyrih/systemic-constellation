import React from 'react';
import { Relation, Element, DrawingState, RelationTypeKey } from '../types';
import RelationTypes from '../types/RelationTypes';

interface RelationLinesProps {
  relations: Relation[];
  elements: Element[];
  drawingState: DrawingState;
}

const RelationLines: React.FC<RelationLinesProps> = ({
  relations,
  elements,
  drawingState,
}) => {
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
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {relations.map(renderRelationLine)}
      {renderDrawingLine()}
    </svg>
  );
};

export default RelationLines;