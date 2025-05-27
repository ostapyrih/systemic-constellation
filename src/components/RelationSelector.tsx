import React from 'react';
import { RelationTypeKey } from '../types';
import RelationTypes from '../types/RelationTypes';

interface RelationSelectorProps {
  relationType: RelationTypeKey;
  onRelationTypeChange: (type: RelationTypeKey) => void;
}

const RelationSelector: React.FC<RelationSelectorProps> = ({
  relationType,
  onRelationTypeChange,
}) => {
  return (
    <section className="mb-4">
      <h2 className="font-bold mb-2">Зв'язки</h2>
      <div className="bg-white p-2 rounded">
        <select
          value={relationType}
          onChange={(e) => onRelationTypeChange(e.target.value as RelationTypeKey)}
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
  );
};

export default RelationSelector;
