/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, PenTool } from 'lucide-react';

interface Note {
  id: string;
  timestamp: string;
  content: string;
}

const DEFAULT_NOTES: Note[] = [
  {
    id: '1',
    timestamp: '2026-06-05 14:32',
    content: 'Tried to decide if I should learn Rust or just make another sandwich. The sandwich seems more immediately rewarding.',
  },
  {
    id: '2',
    timestamp: '2026-06-03 09:15',
    content: 'Discovered that if you delete node_modules and run npm install, it solves 90% of your problems. The other 10% requires overthinking.',
  }
];

export const ResearchNotebook: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newContent, setNewContent] = useState<string>('');

  // Hydrate notes from localStorage or default notes
  useEffect(() => {
    const saved = localStorage.getItem('portfolio_research_notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        setNotes(DEFAULT_NOTES);
      }
    } else {
      setNotes(DEFAULT_NOTES);
    }
  }, []);

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem('portfolio_research_notes', JSON.stringify(updated));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const now = new Date();
    const ts = now.toISOString().replace('T', ' ').substring(0, 16);
    const added: Note = {
      id: Date.now().toString(),
      timestamp: ts,
      content: newContent.trim(),
    };

    saveNotes([added, ...notes]);
    setNewContent('');
  };

  const handleDeleteNote = (id: string) => {
    const filtered = notes.filter((n) => n.id !== id);
    saveNotes(filtered);
  };

  const handleClearAll = () => {
    if (window.confirm('Delete all laboratory scratchpad logs?')) {
      saveNotes([]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[var(--c-surface)] border border-[var(--c-border)] p-5 rounded-lg shadow-sm select-none text-[var(--c-text)]">
      <div className="flex justify-between items-center border-b border-[var(--c-border)] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <PenTool size={13} className="text-[#FF5701]" />
          <h4 className="font-mono text-[10px] tracking-wider text-[var(--c-text)] uppercase font-bold">
            SCRATCHPAD.LOG
          </h4>
        </div>
        {notes.length > 0 && (
          <button
            onClick={handleClearAll}
            className="font-mono text-[8px] text-[var(--c-muted)] hover:text-[#FF5701] uppercase tracking-widest border border-dashed border-[var(--c-border)] hover:border-[#FF5701]/30 transition-all duration-300 px-2 py-0.5"
          >
            CLEAR ALL
          </button>
        )}
      </div>

      {/* Persistent Note input form */}
      <form onSubmit={handleAddNote} className="mb-4 flex flex-col gap-2">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Append live research observations here..."
          className="w-full h-20 bg-[var(--c-text)]/5 hover:bg-[var(--c-text)]/10 focus:bg-[var(--c-text)]/5 font-mono text-[10px] p-2.5 border border-[var(--c-border)] rounded placeholder-[var(--c-muted)]/60 focus:outline-none focus:border-[#FF5701] transition-all resize-none leading-relaxed text-[var(--c-text)]"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 font-mono text-[9px] uppercase tracking-widest bg-[#FF5701] hover:bg-[#e04c00] text-white py-2 rounded font-bold transition-colors duration-300 shadow-sm cursor-pointer"
        >
          <Plus size={11} /> APP_LOG_RECORD
        </button>
      </form>

      {/* Note scrolling list */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
        {notes.length === 0 ? (
          <div className="h-28 flex flex-col items-center justify-center border border-dashed border-[var(--c-border)] rounded bg-[var(--c-text)]/5">
            <span className="font-mono text-[9px] text-[var(--c-muted)]/70">NOTEBOOK EMPTY</span>
            <span className="font-mono text-[8px] text-[var(--c-muted)]/40 mt-1">NO OBSERVED OBSERVATIONS</span>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="group p-3 border border-[var(--c-border)] hover:border-[#FF5701]/20 rounded bg-[var(--c-text)]/5 hover:bg-[var(--c-text)]/10 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-mono text-[8px] text-[var(--c-muted)]/70 font-bold">
                  {note.timestamp}
                </span>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="opacity-60 md:opacity-0 md:group-hover:opacity-100 text-[var(--c-muted)]/50 hover:text-[#FF5701] transition-all duration-300 p-2 -m-2"
                  title="Delete log entry"
                >
                  <Trash2 size={11} />
                </button>
              </div>
              <p className="font-mono text-[9.5px] leading-relaxed text-[var(--c-text)]/90 whitespace-pre-line text-left">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
