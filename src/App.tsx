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
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  const isMovingRef = useRef<boolean>(false);
  const mobileScrollRef = useRef<HTMLElement>(null);

  // Apply saved or OS-preferred theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('portfolio_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved === 'dark' || (!saved && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('portfolio_theme', next ? 'dark' : 'light');
  };

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    // On mobile, also programmatically scroll the snap container to the target section
    if (mobileScrollRef.current && window.innerWidth < 768) {
      mobileScrollRef.current.scrollTo({
        top: nextIdx * mobileScrollRef.current.clientHeight,
        behavior: 'smooth',
      });
    }
  };

  // On mobile: keep currentSection in sync with native scroll position
  useEffect(() => {
    if (!isMobile) return;
    const el = mobileScrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const idx = Math.round(el.scrollTop / el.clientHeight);
      setCurrentSection(idx);
      localStorage.setItem('portfolio_active_idx', idx.toString());
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

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

  // Touch handlers for mobile users — disabled on mobile in favour of CSS scroll-snap
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // On mobile, CSS scroll-snap handles section navigation natively
      if (window.innerWidth < 768) return;
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
    <div className="relative w-full h-dvh overflow-hidden bg-[var(--c-bg)] select-none text-[var(--c-text)] transition-colors duration-400">
      {/* Navigation Headers */}
      <Header currentSection={currentSection} onToggleTheme={toggleTheme} isDark={isDark} />
      <Sidebar currentSection={currentSection} onSectionJump={jump} />

      {/* Main viewport — CSS scroll-snap on mobile, JS translateY on desktop */}
      {isMobile ? (
        <main
          ref={mobileScrollRef}
          className="w-full h-full overflow-y-scroll"
          style={{
            scrollSnapType: 'y mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* SCREEN 01: MANIFESTO */}
          <section className="w-full h-dvh px-6 pt-[80px] pb-6 flex flex-col justify-between shrink-0 overflow-y-auto" style={{ scrollSnapAlign: 'start' }}>
            <ManifestoScreen />
          </section>

          {/* SCREEN 02: OUTCOMES */}
          <section className="w-full h-dvh px-6 pt-[80px] pb-6 flex flex-col justify-between shrink-0 overflow-y-auto" style={{ scrollSnapAlign: 'start' }}>
            <SelectedWorkScreen onSelectProject={setSelectedProject} />
          </section>

          {/* SCREEN 03: THE LAB */}
          <section className="w-full h-dvh px-6 pt-[80px] pb-6 flex flex-col justify-between shrink-0 overflow-y-auto" style={{ scrollSnapAlign: 'start' }}>
            <LabScreen />
          </section>

          {/* SCREEN 04: STUDENT BIO */}
          <section className="w-full h-dvh px-6 pt-[80px] pb-6 flex flex-col justify-between shrink-0 overflow-y-auto" style={{ scrollSnapAlign: 'start' }}>
            <BioScreen />
          </section>

          {/* SCREEN 05: INQUIRY */}
          <section className="w-full h-dvh px-6 pt-[80px] pb-6 flex flex-col justify-between shrink-0 overflow-y-auto" style={{ scrollSnapAlign: 'start' }}>
            <ConnectScreen />
          </section>
        </main>
      ) : (
        <main className="w-full h-full overflow-hidden">
          <div
            className="w-full h-full transition-transform duration-[900ms] will-change-transform"
            style={{
              transform: `translateY(-${currentSection * 100}dvh)`,
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* SCREEN 01: MANIFESTO */}
            <section className="w-full h-dvh px-6 md:px-16 pt-[80px] md:pt-[104px] pb-6 md:pb-8 flex flex-col justify-between shrink-0 overflow-y-auto">
              <ManifestoScreen />
            </section>

            {/* SCREEN 02: OUTCOMES */}
            <section className="w-full h-dvh px-6 md:px-16 pt-[80px] md:pt-[104px] pb-6 md:pb-8 flex flex-col justify-between shrink-0 overflow-y-auto">
              <SelectedWorkScreen onSelectProject={setSelectedProject} />
            </section>

            {/* SCREEN 03: THE LAB */}
            <section className="w-full h-dvh px-6 md:px-16 pt-[80px] md:pt-[104px] pb-6 md:pb-8 flex flex-col justify-between shrink-0 overflow-y-auto">
              <LabScreen />
            </section>

            {/* SCREEN 04: STUDENT BIO */}
            <section className="w-full h-dvh px-6 md:px-16 pt-[80px] md:pt-[104px] pb-6 md:pb-8 flex flex-col justify-between shrink-0 overflow-y-auto">
              <BioScreen />
            </section>

            {/* SCREEN 05: INQUIRY */}
            <section className="w-full h-dvh px-6 md:px-16 pt-[80px] md:pt-[104px] pb-6 md:pb-8 flex flex-col justify-between shrink-0 overflow-y-auto">
              <ConnectScreen />
            </section>
          </div>
        </main>
      )}

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
