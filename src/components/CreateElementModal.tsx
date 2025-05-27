import { useState } from "react";
import ElementTypes from "../types/ElementTypes";

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CreateElementModal = ({
  setShowAddModal,
  addElement,
}: {
  setShowAddModal: (show: boolean) => void;
  addElement: (name: string, type: string, color: string) => void;
}) => {
  const [newElementName, setNewElementName] = useState("");
  const [newElementType, setNewElementType] = useState("person");
  const [newElementColor, setNewElementColor] = useState("#3498db");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Додати новий елемент</h2>
          <button onClick={() => setShowAddModal(false)}>
            <CloseIcon />
          </button>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Назва</label>
          <input
            type="text"
            value={newElementName}
            onChange={(e) => setNewElementName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ім'я або назва елемента"
            autoFocus
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Тип</label>
          <select
            value={newElementType}
            onChange={(e) => setNewElementType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {Object.entries(ElementTypes).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Колір</label>
          <input
            type="color"
            value={newElementColor}
            onChange={(e) => setNewElementColor(e.target.value)}
            className="w-full h-10 p-0 border rounded"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowAddModal(false)}
            className="bg-gray-300 hover:bg-gray-400 rounded px-4 py-2 mr-2"
          >
            Скасувати
          </button>
          <button
            onClick={() =>
              addElement(newElementName, newElementType, newElementColor)
            }
            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
          >
            Додати
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateElementModal;
