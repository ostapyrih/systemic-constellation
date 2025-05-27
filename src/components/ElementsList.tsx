import React from 'react';
import { Element } from '../types';
import TrashIcon from './TrashIcon';

interface ElementsListProps {
  elements: Element[];
  onDelete: (id: number) => void;
}

const ElementsList: React.FC<ElementsListProps> = ({ elements, onDelete }) => {
  return (
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
                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block";
              }}
            />
            <div
              className="w-6 h-6 rounded-full mr-2 hidden"
              style={{ backgroundColor: element.color }}
            />
            <span className="truncate">{element.name}</span>
          </div>
          <button
            onClick={() => onDelete(element.id)}
            className="text-red-500 hover:text-red-700"
          >
            <TrashIcon />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ElementsList;