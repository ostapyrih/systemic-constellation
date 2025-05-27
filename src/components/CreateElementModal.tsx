import React, { useState } from "react";

interface CreateElementModalProps {
  setShowAddModal: (show: boolean) => void;
  addElement: (name: string, icon: string, color: string) => void;
  availableIcons: string[];
}

const CreateElementModal: React.FC<CreateElementModalProps> = ({
  setShowAddModal,
  addElement,
  availableIcons,
}) => {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [color, setColor] = useState("#3B82F6");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedIcon) {
      addElement(name.trim(), selectedIcon, color);
      setName("");
      setSelectedIcon("");
      setColor("#3B82F6");
    }
  };

  const handleCancel = () => {
    setName("");
    setSelectedIcon("");
    setColor("#3B82F6");
    setShowAddModal(false);
  };

  const getIconDisplayName = (iconFilename: string) => {
    return iconFilename
      .replace(".png", "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Додати новий елемент</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Назва елемента
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введіть назву..."
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Виберіть іконку
            </label>

            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto border rounded p-2">
              {availableIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`p-2 rounded border-2 flex flex-col items-center transition-colors ${
                    selectedIcon === icon
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={`/icons/${icon}`}
                    alt={getIconDisplayName(icon)}
                    className="w-8 h-8 object-contain mb-1"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      (e.currentTarget
                        .nextElementSibling as HTMLElement)!.style.display =
                        "block";
                    }}
                  />
                  <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600 mb-1 hidden">
                    ?
                  </div>
                  <span className="text-xs text-center leading-tight">
                    {getIconDisplayName(icon)}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-2 md:hidden">
              <select
                value={selectedIcon}
                onChange={(e) => setSelectedIcon(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Виберіть іконку...</option>
                {availableIcons.map((icon) => (
                  <option key={icon} value={icon}>
                    {getIconDisplayName(icon)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Колір акценту
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 border rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">
                Використовується для тіні та оформлення
              </span>
            </div>
          </div>

          {selectedIcon && (
            <div className="border-t pt-4">
              <label className="block text-sm font-medium mb-2">
                Попередній перегляд
              </label>
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded">
                <div className="flex flex-col items-center">
                  <img
                    src={`/icons/${selectedIcon}`}
                    alt={name || "Preview"}
                    className="w-16 h-16 object-contain"
                    style={{
                      filter: `drop-shadow(2px 2px 4px ${color}40)`,
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      (e.currentTarget
                        .nextElementSibling as HTMLElement)!.style.display =
                        "flex";
                    }}
                  />
                  <div
                    className="w-16 h-16 rounded-full hidden items-center justify-center text-white font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {name.substring(0, 2).toUpperCase() || "??"}
                  </div>
                  <div className="mt-1 bg-white px-2 py-1 rounded shadow-sm text-xs">
                    {name || "Element Name"}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !selectedIcon}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Додати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateElementModal;
