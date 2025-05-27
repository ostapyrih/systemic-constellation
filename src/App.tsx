import React, { useState, useEffect } from "react";
import CreateElementModal from "./components/CreateElementModal";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import NotesSection from "./components/NotesSection";
import useConstellationLogic from "./hooks/useConstellationLogic";

const AVAILABLE_ICONS = [
  "wizard.png",
  "knight.png",
  "healer.png",
  "archer.png",
  "warrior.png",
  "mage.png",
  "rogue.png",
  "priest.png",
];

const SystemicConstellationsApp = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [notes, setNotes] = useState("");

  const {
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
  } = useConstellationLogic();

  const handleAddElement = (name: string, icon: string, color: string) => {
    addElement(name, icon, color);
    setShowAddModal(false);
  };

  const handleResetConstellation = () => {
    resetConstellation();
    setNotes("");
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [handleMouseUp]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header title="Системні розстановки" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          elements={elements}
          relationType={relationType}
          onShowAddModal={() => setShowAddModal(true)}
          onDeleteElement={deleteElement}
          onRelationTypeChange={setRelationType}
          onResetConstellation={handleResetConstellation}
        />

        <main className="flex-1 flex flex-col">
          <Canvas
            ref={containerRef}
            elements={elements}
            relations={relations}
            drawingState={drawingState}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onElementMouseDown={handleMouseDown}
            onFinishDrawingRelation={finishDrawingRelation}
          />

          <NotesSection notes={notes} onNotesChange={setNotes} />
        </main>
      </div>

      {showAddModal && (
        <CreateElementModal
          setShowAddModal={setShowAddModal}
          addElement={handleAddElement}
          availableIcons={AVAILABLE_ICONS}
        />
      )}
    </div>
  );
};

export default SystemicConstellationsApp;
