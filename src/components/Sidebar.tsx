import React from 'react';
import { Element, RelationTypeKey } from '../types';
import PlusIcon from './PlusIcon';
import RefreshIcon from './RefreshIcon';
import ElementsList from './ElementsList';
import RelationSelector from './RelationSelector';

interface SidebarProps {
  elements: Element[];
  relationType: RelationTypeKey;
  onShowAddModal: () => void;
  onDeleteElement: (id: number) => void;
  onRelationTypeChange: (type: RelationTypeKey) => void;
  onResetConstellation: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  elements,
  relationType,
  onShowAddModal,
  onDeleteElement,
  onRelationTypeChange,
  onResetConstellation,
}) => {
  return (
    <aside className="w-64 bg-gray-200 p-4 flex flex-col">
      <section className="mb-4">
        <h2 className="font-bold mb-2">Елементи ({elements.length})</h2>
        <button
          onClick={onShowAddModal}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded p-2 flex items-center justify-center"
        >
          <PlusIcon />
          <span className="ml-1">Додати елемент</span>
        </button>

        <ElementsList elements={elements} onDelete={onDeleteElement} />
      </section>

      <RelationSelector
        relationType={relationType}
        onRelationTypeChange={onRelationTypeChange}
      />

      <div className="mt-auto">
        <button
          onClick={onResetConstellation}
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded p-2 flex items-center justify-center"
        >
          <RefreshIcon />
          <span className="ml-1">Очистити розстановку</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;