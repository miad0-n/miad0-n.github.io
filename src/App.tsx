/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header, Sidebar } from './components/Navigation';
import {
  ManifestoScreen,
  SelectedWorkScreen,
  LabScreen,
  BioScreen,
  ConnectScreen,
} from './components/Screens';
import { ProjectDetail } from './components/ProjectDetail';
import { Project } from './types';

export default function App() {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const isMovingRef = useRef<boolean>(false);

  // Restore active user position from localStorage on hydrate
  useEffect(() => {
    const saved = localStorage.getItem('portfolio_active_idx');
    if (saved) {
      const idx = parseInt(saved, 10);
      if (!isNaN(idx) && idx >= 0 && idx < 5) {
        setCurrentSection(idx);
      }
    }
  }, []);

  const jump = (idx: number) => {
    const nextIdx = Math.max(0, Math.min(4, idx));
    setCurrentSection(nextIdx);
    localStorage.setItem('portfolio_active_idx', nextIdx.toString());
  };

  // Safe vertical keyboard/wheel listener hooks
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (selectedProject) return;

      // Check if target is inside an internally scrollable notebook or CV logs list
      const target = e.target as HTMLElement;
      const scrollable = target.closest('.overflow-y-auto, textarea, input');
      if (scrollable) {
        const container = scrollable as HTMLElement;
        const isAtTop = container.scrollTop === 0;
        const isAtBottom = Math.ceil(container.scrollHeight - container.scrollTop) <= container.clientHeight + 1;

        if (e.deltaY > 0 && !isAtBottom) return; // scroll down internally
        if (e.deltaY < 0 && !isAtTop) return; // scroll up internally
      }

      if (isMovingRef.current) return;
      if (Math.abs(e.deltaY) < 25) return; // wheel displacement threshold

      isMovingRef.current = true;
      if (e.deltaY > 0) {
        jump(currentSection + 1);
      } else {
        jump(currentSection - 1);
      }

      // Reset scroll lock velocity limiters
      setTimeout(() => {
        isMovingRef.current = false;
      }, 950);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentSection, selectedProject]);

  // Touch handlers for mobile users with drift prevention
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (selectedProject) return;

      const target = e.target as HTMLElement;
      // Safeguard: allow normal touch navigation inside text pads
      if (target.closest('.overflow-y-auto, textarea, input')) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      // Threshold to trigger page translations
      if (Math.abs(diff) > 60) {
        if (isMovingRef.current) return;
        isMovingRef.current = true;
        
        if (diff > 0) {
          jump(currentSection + 1);
        } else {
          jump(currentSection - 1);
        }

        setTimeout(() => {
          isMovingRef.current = false;
        }, 950);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentSection, selectedProject]);

  // Standard keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProject) return;

      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') return;

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        jump(currentSection + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        jump(currentSection - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, selectedProject]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F6F6F1] select-none text-[#111827]">
      {/* Navigation Headers */}
      <Header currentSection={currentSection} />
      <Sidebar currentSection={currentSection} onSectionJump={jump} />

      {/* Main Animated Translating viewport */}
      <main className="w-full h-full overflow-hidden">
        <div
          className="w-full h-full transition-transform duration-[900ms] will-change-transform"
          style={{
            transform: `translateY(-${currentSection * 100}vh)`,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* SCREEN 01: MANIFESTO */}
          <section className="w-screen h-screen px-6 md:px-16 pt-[104px] pb-8 flex flex-col justify-between shrink-0">
            <ManifestoScreen />
          </section>

          {/* SCREEN 02: OUTCOMES */}
          <section className="w-screen h-screen px-6 md:px-16 pt-[104px] pb-8 flex flex-col justify-between shrink-0">
            <SelectedWorkScreen onSelectProject={setSelectedProject} />
          </section>

          {/* SCREEN 03: THE LAB */}
          <section className="w-screen h-screen px-6 md:px-16 pt-[104px] pb-8 flex flex-col justify-between shrink-0">
            <LabScreen />
          </section>

          {/* SCREEN 04: STUDENT BIO */}
          <section className="w-screen h-screen px-6 md:px-16 pt-[104px] pb-8 flex flex-col justify-between shrink-0">
            <BioScreen />
          </section>

          {/* SCREEN 05: INQUIRY */}
          <section className="w-screen h-screen px-6 md:px-16 pt-[104px] pb-8 flex flex-col justify-between shrink-0">
            <ConnectScreen />
          </section>
        </div>
      </main>

      {/* Slide-over Detailed Case Studies Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
