/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 170 }}
        className="w-full max-w-2xl h-full bg-[#0C0C0C] shadow-2xl flex flex-col overflow-y-auto border-l border-[#FF5701]/20 text-[#F5F5F5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky detail header */}
        <div className="sticky top-0 z-10 flex justify-between items-center px-6 md:px-10 py-6 bg-[#0C0C0C]/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-[#FF5701] tracking-widest font-bold uppercase">
              {project.category}
            </span>
            <span className="font-mono text-[10px] text-white/40 mt-0.5">
              STATUS: {project.year} / {project.role}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-[#FF5701] hover:text-[#FF5701] transition-all duration-300 bg-white/5 text-white/70"
            aria-label="Close panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 px-6 md:px-10 py-8 select-text">
          <span className="font-mono text-[70px] font-bold text-[#FF5701]/5 leading-none select-none block">
            {project.index}
          </span>
          <h3 className="font-serif font-bold text-4xl md:text-5xl tracking-tight text-white -mt-6 mb-6 uppercase">
            {project.title}
          </h3>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-wider text-[#FF5701] px-3 py-1 bg-[#FF5701]/10 border border-[#FF5701]/30 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="font-mono text-sm leading-relaxed text-white/90 mb-10 border-l-2 border-[#FF5701] pl-4 italic bg-[#FF5701]/5 py-3 pr-3 text-justify">
            "{project.description}"
          </p>

          <div className="space-y-10">
            {/* Challenge module */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] tracking-widest font-bold text-[#FF5701] uppercase block">
                01 / THE CONFLICT
              </span>
              <h4 className="font-serif font-bold text-xl text-white">
                What challenges did this pose?
              </h4>
              <p className="font-mono text-xs leading-relaxed text-white/70 text-justify">
                {project.challenge}
              </p>
            </div>

            {/* Solution module */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] tracking-widest font-bold text-[#FF5701] uppercase block">
                02 / THE ARCHITECTURE
              </span>
              <h4 className="font-serif font-bold text-xl text-white">
                How was this structured?
              </h4>
              <p className="font-mono text-xs leading-relaxed text-white/70 text-justify">
                {project.solution}
              </p>
            </div>

            {/* Metrics and indicators */}
            <div className="space-y-4 border-t border-white/10 pt-8 pb-4">
              <span className="font-mono text-[10px] tracking-widest font-bold text-[#FF5701] uppercase block">
                03 / THE EXPECTATIONS
              </span>
              <h4 className="font-serif font-bold text-xl text-white">
                Measurable outcomes & impact
              </h4>
              <ul className="space-y-3.5">
                {project.metrics.map((metric, i) => (
                  <li key={i} className="flex gap-3 items-start">
                     <CheckCircle2 size={15} className="text-[#FF5701] mt-0.5 shrink-0" />
                     <span className="font-mono text-xs text-white/85 leading-tight">
                      {metric}
                     </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className="p-6 md:p-10 border-t border-white/10 bg-white/5 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col">
            <span className="font-mono text-[8px] text-white/50 uppercase">Current State</span>
            <span className="font-mono text-[10px] text-[#FF5701] font-semibold">PROCASTINATED SECURELY</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 font-mono text-[10px] font-bold text-white bg-[#FF5701] hover:bg-[#e04c00] px-5 py-3 transition-colors duration-300 rounded cursor-pointer uppercase tracking-widest"
          >
            Acknowledge The Void <ArrowRight size={12} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
