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
    timestamp: '2026-06-01 14:32',
    content: 'THESIS: Standard dashboard grids look stiff. Explored responsive variable dimensions where modules expand by 15% when mouse dwell times exceed 800ms. Tested smooth cubic-bezier transitions for ease.',
  },
  {
    id: '2',
    timestamp: '2026-06-03 09:15',
    content: 'FEEDBACK: Tested three.js wireframe sphere on layout modules. Discovered viewport dimension changes cause layout jumps. Integrated a ResizeObserver on parent container elements to dynamically recalibrate canvas boundaries.',
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
    <div className="w-full h-full flex flex-col bg-[#141414] border border-white/10 p-5 rounded-lg shadow-sm select-none">
      <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <PenTool size={13} className="text-white" />
          <h4 className="font-mono text-[10px] tracking-wider text-white uppercase font-bold">
            RESEARCH_PAD.LOG
          </h4>
        </div>
        {notes.length > 0 && (
          <button
            onClick={handleClearAll}
            className="font-mono text-[8px] text-white/50 hover:text-white uppercase tracking-widest border border-dashed border-white/20 hover:border-white/40 transition-all duration-300 px-2 py-0.5"
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
          className="w-full h-20 bg-white/5 hover:bg-white/10 focus:bg-white/5 font-mono text-[10px] p-2.5 border border-white/10 rounded placeholder-white/30 focus:outline-none focus:border-white transition-all resize-none leading-relaxed text-[#F5F5F5]"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 font-mono text-[9px] uppercase tracking-widest bg-white hover:bg-[#EAEAEA] text-[#0A0A0A] py-2 rounded font-bold transition-colors duration-300 shadow-sm cursor-pointer"
        >
          <Plus size={11} /> APP_LOG_RECORD
        </button>
      </form>

      {/* Note scrolling list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[190px] md:max-h-[220px]">
        {notes.length === 0 ? (
          <div className="h-28 flex flex-col items-center justify-center border border-dashed border-white/10 rounded bg-white/5">
            <span className="font-mono text-[9px] text-white/40">NOTEBOOK EMPTY</span>
            <span className="font-mono text-[8px] text-white/20 mt-1">NO OBSERVED OBSERVATIONS</span>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="group p-3 border border-white/5 hover:border-white/15 rounded bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-mono text-[8px] text-white/40 font-bold">
                  {note.timestamp}
                </span>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-white transition-all duration-300"
                  title="Delete log entry"
                >
                  <Trash2 size={11} />
                </button>
              </div>
              <p className="font-mono text-[9.5px] leading-relaxed text-white/85 whitespace-pre-line text-left">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
