/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS, EXPERIENCE } from '../data';
import { Project, ContactFormModel } from '../types';
import {
  WaveFieldWidget,
  WireSphereWidget,
  ContrastPluginWidget,
  FourierAssemblerWidget,
} from './LabWidgets';
import { ResearchNotebook } from './ResearchNotebook';
import { ExternalLink, Check, Send, Sparkles, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

// ==========================================
// SCREEN 1: MANIFESTO (Introduction)
// ==========================================
export const ManifestoScreen: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const keyPrinciples = [
    { num: '01', title: 'CODE AS ACTIVE MATERIAL', body: 'Software is not a containment vessel; it is dynamic kinetic paper. Every contour, line, and delay should convey purpose.' },
    { num: '02', title: 'PRECISION OVER DECORATION', body: 'Reject mock details and simulated system noise. True confidence lives in elegant high-contrast margins and exact typographic size pairings.' },
    { num: '03', title: 'EXPERIMENT IN STABLE SPACES', body: 'Design frameworks to tolerate friction, and then smooth it out using robust lerp equations and rigorous constraint validation.' }
  ];

  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-6xl mx-auto py-4">
      <div className="space-y-4">
        <span className="font-mono text-[10px] text-white/50 uppercase tracking-[0.25em] font-bold block">
          Introduction / Manifesto
        </span>
        <h1 className="font-sans font-bold text-[clamp(2.5rem,11vw,7rem)] leading-[0.85] tracking-tight text-white uppercase">
          NOT A <br />
          <span className="font-serif italic stroke-text">
            STUDENT.
          </span>{' '}
          <br />
          A BUILDER.
        </h1>
        <p className="font-mono text-xs md:text-sm leading-relaxed text-white/60 max-w-[480px] text-justify mt-4">
          I don't wait for assignments. I construct cohesive interface logics, procedural rendering tools, and custom web blueprints designed to redefine modern visual execution.
        </p>
      </div>

      {/* Accordion expand block for core protocols */}
      <div className="mt-8 border border-white/10 bg-white/5 rounded-lg p-5 max-w-xl shadow-sm transition-colors duration-300 hover:border-white/30">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between font-mono text-[9.5px] uppercase tracking-widest text-white font-bold focus:outline-none cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <BookOpen size={12} className="text-white" />
            {expanded ? 'HIDE CORE BLUEPRINTS' : 'EXPLORE CORE BLUEPRINTS'}
          </span>
          {expanded ? <ChevronUp size={14} className="text-white/60" /> : <ChevronDown size={14} className="text-white/60" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden mt-4 space-y-4 pt-4 border-t border-white/10"
            >
              {keyPrinciples.map((p) => (
                <div key={p.num} className="grid grid-cols-[30px_1fr] gp-3 gap-3">
                  <span className="font-mono text-[10px] text-white font-bold">{p.num}</span>
                  <div>
                    <h4 className="font-mono text-[9px] uppercase tracking-wider font-bold text-white">
                      {p.title}
                    </h4>
                    <p className="font-mono text-[9.5px] leading-relaxed text-white/50 mt-1 text-justify">
                      {p.body}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 2: SELECTED WORK (Outcomes)
// ==========================================
interface SelectedWorkScreenProps {
  onSelectProject: (project: Project) => void;
}

export const SelectedWorkScreen: React.FC<SelectedWorkScreenProps> = ({ onSelectProject }) => {
  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-6xl mx-auto py-4 text-[#F5F5F5]">
      <div className="mb-4">
        <span className="font-mono text-[10px] text-white/50 uppercase tracking-[0.25em] font-bold block">
          Selected Work
        </span>
        <h2 className="font-sans font-bold text-[clamp(2.2rem,7vw,4rem)] leading-none tracking-tight text-white mt-2 select-none uppercase">
          OUTCOMES
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 mt-6">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group relative bg-[#141414] border border-white/10 p-6 md:p-8 flex flex-col justify-between min-h-[190px] md:min-h-[240px] cursor-pointer shadow-sm hover:border-white hover:bg-[#1E1E1E] transition-all duration-300 rounded-lg select-none"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[10.5px] text-white/40 font-semibold">
                  {project.index} // {project.year}
                </span>
                <span className="font-mono text-[8.5px] uppercase text-white border border-white/20 rounded-full px-2 py-0.5 tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  CASE STUDY
                </span>
              </div>
              <p className="font-sans font-bold text-2xl md:text-3xl text-white group-hover:opacity-90 transition-opacity duration-300 leading-tight">
                {project.title}
              </p>
              <p className="font-mono text-[9px] text-white/55 uppercase tracking-wider mt-1 border-b border-white/10 pb-3">
                {project.category}
              </p>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <span className="font-mono text-[9px] text-white/50 group-hover:text-white transition-colors">
                VIEW METRIC REPORTS
              </span>
              <span className="font-mono text-base md:text-lg text-white/30 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300">
                →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 3: EXPERIMENTAL RESEARCH (The Lab)
// ==========================================
export const LabScreen: React.FC = () => {
  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-6xl mx-auto py-4">
      <div className="mb-2">
        <span className="font-mono text-[10px] text-white/50 uppercase tracking-[0.25em] font-bold block">
          Experimental Lab
        </span>
        <h2 className="font-sans font-bold text-[clamp(2.2rem,7vw,4rem)] leading-none tracking-tight text-white mt-1 select-none">
          THE LAB
        </h2>
      </div>

      {/* Grid of four live interactive widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <WaveFieldWidget />
        <WireSphereWidget />
        <ContrastPluginWidget />
        <FourierAssemblerWidget />
      </div>

      <p className="font-mono text-[9px] text-white/40 uppercase tracking-wider text-right block mt-3 select-none">
        ▲ Interlinked procedural modules. Designed to test WebGL fragment buffers & spatial constraints.
      </p>
    </div>
  );
};

// ==========================================
// SCREEN 4: STUDENT BIO
// ==========================================
export const BioScreen: React.FC = () => {
  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-6xl mx-auto py-4 text-white">
      <div className="mb-4">
        <span className="font-mono text-[10px] text-white/50 uppercase tracking-[0.25em] font-bold block">
          Student Bio
        </span>
        <h2 className="font-sans font-bold text-[clamp(2.2rem,7vw,4rem)] leading-[0.9] tracking-tight text-white mt-2 select-none">
          CURIOUS <br />
          BY DESIGN.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-3">
        {/* Left column: Academic profile timeline */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-4 border-t border-white/10 pt-4">
            <span className="font-mono text-[9.5px] uppercase tracking-widest text-white/80 font-bold block">
              ACADEMIC_TIMELINE
            </span>
            <div className="space-y-4 max-h-[190px] md:max-h-[220px] overflow-y-auto pr-2">
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-white/10 hover:border-white transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1.5 mb-1.5">
                    <span className="font-mono text-[9px] text-white font-bold uppercase">
                      {exp.role}
                    </span>
                    <span className="font-mono text-[8px] tracking-wider text-white px-2 py-0.5 border border-white/20 bg-white/5 rounded-full">
                      {exp.year}
                    </span>
                  </div>
                  <span className="font-serif text-xs text-white/80 italic block mb-1">
                    {exp.institution}
                  </span>
                  <p className="font-mono text-[9.5px] leading-relaxed text-white/60 text-justify">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex border-t border-white/10 pt-4 gap-4">
            <p className="font-mono text-[10.5px] leading-relaxed text-white/50 w-1/2 text-justify">
              BFA Interaction Design Candidate. Class of 2025. Academic focus centers around responsive canvas matrices.
            </p>
            <p className="font-mono text-[10.5px] leading-relaxed text-white/50 w-1/2 text-justify">
               Seeking collaborative engineering opportunities. Aiming to pioneer friction-free developer frameworks.
            </p>
          </div>
        </div>

        {/* Right column: Dynamic local storage notebook */}
        <div className="lg:col-span-5">
          <ResearchNotebook />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 5: CONNECT (Inquiry Form)
// ==========================================
export const ConnectScreen: React.FC = () => {
  const [form, setForm] = useState<ContactFormModel>({
    name: '',
    email: '',
    projectType: 'UI/UX Design',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert('Must populate all inquiry constraints.');
      return;
    }

    setIsLoading(true);

    // Simulate reliable micro-server submission delay
    setTimeout(() => {
      const generatedTicket = 'REF-' + Math.floor(100000 + Math.random() * 900000);
      setTicketId(generatedTicket);
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      projectType: 'UI/UX Design',
      message: '',
    });
    setIsSubmitted(false);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-6xl mx-auto py-4 text-white">
      <div>
        <span className="font-mono text-[10px] text-white/50 uppercase tracking-[0.25em] font-bold block select-none">
          Inquiry Link
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mt-4">
        {/* Left: Giant action anchors */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="space-y-3">
            <a
              href="mailto:nnyad90@gmail.com?subject=Inquiry"
              className="group font-sans font-bold text-[clamp(2.5rem,7vw,5.5rem)] leading-none text-white hover:opacity-85 transition-opacity block select-none uppercase"
            >
              EMAIL{' '}
              <span className="inline-block text-xl md:text-3xl font-mono text-white/20 group-hover:text-white group-hover:translate-x-1.5 duration-300">
                ↗
              </span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group font-sans font-bold text-[clamp(2.5rem,7vw,5.5rem)] leading-none text-white hover:opacity-85 transition-opacity block select-none uppercase"
            >
              LINKEDIN{' '}
              <span className="inline-block text-xl md:text-3xl font-mono text-white/20 group-hover:text-white group-hover:translate-x-1.5 duration-300">
                ↗
              </span>
            </a>
            <a
              href="https://are.na"
              target="_blank"
              rel="noopener noreferrer"
              className="group font-sans font-bold text-[clamp(2.5rem,7vw,5.5rem)] leading-none text-white hover:opacity-85 transition-opacity block select-none uppercase"
            >
              ARE.NA{' '}
              <span className="inline-block text-xl md:text-3xl font-mono text-white/20 group-hover:text-white group-hover:translate-x-1.5 duration-300">
                ↗
              </span>
            </a>
          </div>

          <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-6 select-none opacity-40">
            <span className="font-mono text-[9px] uppercase tracking-wider">EST. 2026 // SEOUL LABS</span>
            <span className="font-mono text-[9px] uppercase tracking-wider">PORTFOLIO PROTOCOL V.2</span>
          </div>
        </div>

        {/* Right: Functional Inquiry Form Box */}
        <div className="lg:col-span-6 bg-[#141414] border border-white/10 p-6 md:p-8 rounded-xl shadow-sm flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleFormSubmit}
                className="space-y-4"
              >
                <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 mb-2 select-none">
                  <Sparkles size={14} className="text-white" />
                  <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-white">
                    SECURE_INQUIRY_FORM
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-white/50 uppercase font-bold">NAME</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Alexis Scribe"
                      className="w-full bg-white/5 focus:bg-white/10 font-mono text-[10.5px] p-2.5 border border-white/10 rounded focus:outline-none focus:border-white text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-white/50 uppercase font-bold">EMAIL</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="scribe@example.com"
                      className="w-full bg-white/5 focus:bg-white/10 font-mono text-[10.5px] p-2.5 border border-white/10 rounded focus:outline-none focus:border-white text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] text-white/50 uppercase font-bold">PROJECT TYPE</label>
                  <select
                    name="projectType"
                    value={form.projectType}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 focus:bg-white/10 font-mono text-[10.5px] p-2.5 border border-white/10 rounded focus:outline-none focus:border-white text-white"
                  >
                    <option value="UI/UX Design">UI/UX Web Design</option>
                    <option value="Generative Brand Suite">Generative Brand Identity</option>
                    <option value="Creative Tech Dev">Creative GLSL / WebGL Prototyping</option>
                    <option value="Custom Shell Architecture">Brutalist Shell Development</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] text-white/50 uppercase font-bold">INQUIRY MEMORANDUM</label>
                  <textarea
                    name="message"
                    required
                    value={form.message}
                    onChange={handleInputChange}
                    placeholder="Provide specific parameters, scope, and target timeframe."
                    className="w-full h-24 bg-white/5 focus:bg-white/10 font-mono text-[10.5px] p-2.5 border border-white/10 rounded focus:outline-none focus:border-white resize-none text-white leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-white hover:bg-[#EAEAEA] disabled:bg-white/20 disabled:text-white/50 text-[#0A0A0A] flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest font-bold uppercase rounded cursor-pointer transition-colors duration-300"
                >
                  {isLoading ? (
                    'SUBMITTING ENTRANCE LOG...'
                  ) : (
                    <>
                      TRANSMIT DISCOVERY RECORD <Send size={11} />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="submission-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6 flex flex-col items-center gap-4"
              >
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mb-2 animate-bounce">
                  <Check size={26} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-2xl text-white">
                    TRANSMISSION SUCCESSFUL
                  </h4>
                  <p className="font-mono text-[10px] text-white/60 mt-1 uppercase tracking-wider">
                    INBOX QUEUED - SEATTLE TIME APPRECIATED
                  </p>
                </div>

                {/* Printed mock index ticket */}
                <div className="w-full bg-white/5 border border-white/10 rounded p-4 text-left font-mono text-[10px] space-y-1.5 my-3 relative shadow-sm select-all">
                  <div className="flex justify-between border-b border-white/10 pb-1.5 mb-2">
                    <span className="font-bold text-white">METRO ID INDEXER</span>
                    <span className="text-white font-bold">{ticketId}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-x-2 text-white/50">
                    <span>SENDER_VAL:</span> <span className="text-white font-semibold">{form.name}</span>
                    <span>ORIGIN_EM:</span> <span className="text-white font-semibold">{form.email}</span>
                    <span>DEPT_CHG:</span> <span className="text-white font-semibold">{form.projectType}</span>
                    <span>TIMESTAMP:</span> <span className="text-white font-semibold">2026-06-05 UTC</span>
                  </div>
                </div>

                <button
                  onClick={resetForm}
                  className="font-mono text-[9px] uppercase tracking-widest text-[#4B5563] hover:text-[#FF5701] border-b border-dashed border-[#111827]/25 hover:border-[#FF5701] pb-0.5 mt-2 transition-all cursor-pointer"
                >
                  Transmit fresh query
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
