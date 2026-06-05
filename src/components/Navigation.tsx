/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SECTIONS } from '../data';
import { NavSection } from '../types';

interface HeaderProps {
  currentSection: number;
}

export const Header: React.FC<HeaderProps> = ({ currentSection }) => {
  const [time, setTime] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full h-[72px] z-50 flex items-center justify-between px-6 md:px-12 bg-[#0A0A0A]/70 backdrop-blur-xl border-b border-white/10 transition-colors duration-500 text-[#F5F5F5]">
      <div className="flex items-center gap-6">
        <span className="font-sans font-bold text-base md:text-lg tracking-tight select-none uppercase">
          CREATIVE_STUDENT / 2026
        </span>
        <span className="hidden sm:inline-block font-mono text-xs opacity-40 px-3 py-1 border border-white/10 rounded-full">
          {time || '00:00:00'}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full shadow-sm select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="font-mono text-[9px] font-semibold tracking-wider text-white/80">
            OPEN FOR WORK
          </span>
        </div>
      </div>
    </header>
  );
};

interface SidebarProps {
  currentSection: number;
  onSectionJump: (index: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentSection, onSectionJump }) => {
  return (
    <aside className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-6 items-end">
      {SECTIONS.map((section) => {
        const isActive = currentSection === section.index;
        return (
          <button
            key={section.index}
            onClick={() => onSectionJump(section.index)}
            className="group flex items-center gap-4 cursor-pointer text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-white py-1 pl-4"
            aria-label={`Jump to section ${section.label}`}
          >
            <span
              className={`font-mono text-[9.5px] font-semibold tracking-widest text-white opacity-0 -translate-x-2 transition-all duration-300 ease-custom group-hover:opacity-60 group-hover:translate-x-0 ${
                isActive ? '!opacity-100 !translate-x-0 text-white font-bold' : ''
              }`}
            >
              {section.label}
            </span>
            <div className="relative flex items-center justify-center w-4 h-10">
              <motion.div
                layout
                className={`w-[2px] transition-all duration-500 ease-custom ${
                  isActive ? 'bg-white h-10 opacity-100' : 'bg-white h-5 opacity-15'
                }`}
              />
            </div>
          </button>
        );
      })}
    </aside>
  );
};
