import React from 'react';

interface NotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes, onNotesChange }) => {
  return (
    <section className="bg-gray-200 p-4">
      <div className="mb-2 font-bold">Нотатки</div>
      <textarea
        className="w-full p-2 rounded border"
        placeholder="Запишіть свої спостереження та інсайти..."
        rows={3}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
      />
    </section>
  );
};

export default NotesSection;