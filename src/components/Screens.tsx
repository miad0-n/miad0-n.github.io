/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS, EXPERIENCE } from '../data';
import { Project, ContactFormModel } from '../types';
import {
  CuriosityPlugin,
  SnackDaemonPlugin,
  CssDebuggerPlugin,
  SleepSchedulerPlugin,
} from './LabWidgets';
import { ResearchNotebook } from './ResearchNotebook';
import { BookOpen, ChevronDown, ChevronUp, Check, Send, Sparkles } from 'lucide-react';

// ==========================================
// SCREEN 1: MANIFESTO (Introduction)
// ==========================================
export const ManifestoScreen: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const keyPrinciples = [
    { num: '01', title: 'TABS MULTIPLICATION', body: 'Creating a new browser tab for every Stack Overflow page, until the laptop fans sound like a jet engine.' },
    { num: '02', title: 'THE SNACK INTERACTION', body: 'Glucose levels are directly correlated with visual design performance. Eating snacks is a core engineering process.' },
    { num: '03', title: 'STABLE PROXYING', body: 'If it compiles, it\'s a miracle. If it doesn\'t, we rename the folder to \'legacy\' and start a new project.' }
  ];

  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-6xl mx-auto py-4 text-[#111827]">
      <div className="space-y-4">
        <span className="font-mono text-[10px] text-[#FF5701] uppercase tracking-[0.25em] font-bold block">
          Hi, I'm Miad
        </span>
        <h1 className="font-serif font-bold text-[clamp(2.5rem,11vw,7rem)] leading-[0.85] tracking-tight text-[#111827] uppercase">
          NOT A PRO.<br />
          NOT A PRODIGY.<br />
          <span className="font-serif italic font-normal text-[#FF5701]">
            just curious.
          </span>
        </h1>
        <p className="font-mono text-xs md:text-sm leading-relaxed text-[#4B5563] max-w-[480px] text-justify mt-4">
          A student with zero projects, infinite browser tabs, and a suspicious amount of enthusiasm. Currently exploring new possibilities — also: snacks.
        </p>
      </div>

      {/* Accordion expand block for core protocols */}
      <div className="mt-8 border border-[#111827]/10 bg-white rounded-lg p-5 max-w-xl shadow-sm transition-colors duration-300 hover:border-[#FF5701]/30">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between font-mono text-[9.5px] uppercase tracking-widest text-[#111827] font-bold focus:outline-none cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <BookOpen size={12} className="text-[#FF5701]" />
            {expanded ? 'HIDE CORE BLUEPRINTS' : 'EXPLORE CORE BLUEPRINTS'}
          </span>
          {expanded ? <ChevronUp size={14} className="text-[#111827]/60" /> : <ChevronDown size={14} className="text-[#111827]/60" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden mt-4 pt-4 border-t border-[#111827]/10"
            >
              <div className="space-y-4 pr-1">
              {keyPrinciples.map((p) => (
                <div key={p.num} className="grid grid-cols-[30px_1fr] gp-3 gap-3">
                  <span className="font-mono text-[10px] text-[#FF5701] font-bold">{p.num}</span>
                  <div>
                    <h4 className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#111827]">
                      {p.title}
                    </h4>
                    <p className="font-mono text-[9.5px] leading-relaxed text-[#4B5563] mt-1 text-justify">
                      {p.body}
                    </p>
                  </div>
                </div>
              ))}
              </div>
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
    <div className="w-full flex-1 flex flex-col justify-between max-w-6xl mx-auto py-4 text-[#111827]">
      <div className="mb-4">
        <span className="font-mono text-[10px] text-[#FF5701] uppercase tracking-[0.25em] font-bold block">
          Selected Work
        </span>
        <h2 className="font-serif font-bold text-[clamp(2.2rem,7vw,4rem)] leading-none tracking-tight text-[#111827] mt-2 select-none uppercase">
          THE VOID.
        </h2>
        <p className="font-mono text-xs text-[#4B5563] mt-2">
          Honest portfolio section. Nothing here yet. Refresh in a few months.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 mt-4 md:mt-6">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group relative bg-white border border-[#111827]/10 p-6 md:p-8 flex flex-col justify-between min-h-[190px] md:min-h-[240px] cursor-pointer shadow-sm hover:bg-[#FF5701] hover:text-white hover:border-transparent hover:-rotate-1 hover:-translate-y-0.5 transition-all duration-300 rounded-lg select-none"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[10.5px] text-[#111827]/45 group-hover:text-white/60 font-semibold">
                  {project.index} // {project.year}
                </span>
                <span className="font-mono text-[8.5px] uppercase text-[#111827] border border-[#111827]/20 group-hover:text-white group-hover:border-white/40 rounded-full px-2 py-0.5 tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  CASE STUDY
                </span>
              </div>
              <p className="font-serif font-bold text-2xl md:text-3xl text-[#111827] group-hover:text-white group-hover:opacity-90 transition-opacity duration-300 leading-tight">
                {project.title}
              </p>
              <p className="font-mono text-[9px] text-[#4B5563] group-hover:text-white/80 uppercase tracking-wider mt-1 border-b border-[#111827]/10 group-hover:border-white/20 pb-3">
                {project.category}
              </p>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <span className="font-mono text-[9px] text-[#111827]/60 group-hover:text-white transition-colors uppercase">
                READ SPECIFICATION
              </span>
              <span className="font-mono text-base md:text-lg text-[#111827]/30 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300">
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
    <div className="w-full flex-1 flex flex-col justify-between max-w-6xl mx-auto py-4 text-[#111827]">
      <div className="mb-2">
        <span className="font-mono text-[10px] text-[#FF5701] uppercase tracking-[0.25em] font-bold block">
          Currently Installed
        </span>
        <h2 className="font-serif font-bold text-[clamp(2.2rem,7vw,4rem)] leading-none tracking-tight text-[#111827] mt-1 select-none uppercase">
          SYSTEM<br />
          <span className="font-serif italic font-normal text-[#FF5701]">plugins.</span>
        </h2>
      </div>

      {/* Grid of four plugin cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <CuriosityPlugin />
        <SnackDaemonPlugin />
        <CssDebuggerPlugin />
        <SleepSchedulerPlugin />
      </div>

      <p className="font-mono text-[9px] text-[#4B5563] uppercase tracking-wider text-right block mt-3 select-none">
        ▲ All plugins running without permission. Uninstall attempts will be ignored.
      </p>
    </div>
  );
};

// ==========================================
// SCREEN 4: STUDENT BIO
// ==========================================
export const BioScreen: React.FC = () => {
  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-6xl mx-auto py-4 text-[#111827]">
      <div className="mb-4">
        <span className="font-mono text-[10px] text-[#FF5701] uppercase tracking-[0.25em] font-bold block">
          About
        </span>
        <h2 className="font-serif font-bold text-[clamp(2.2rem,7vw,4rem)] leading-[0.9] tracking-tight text-[#111827] mt-2 select-none uppercase">
          STUDENT.<br />
          EXPLORER.<br />
          <span className="font-serif italic font-normal text-[#FF5701]">professional beginner.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-3">
        {/* Left column: Academic profile timeline */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-4 border-t border-[#111827]/10 pt-4">
            <span className="font-mono text-[9.5px] uppercase tracking-widest text-[#111827]/80 font-bold block">
              PROCRASTINATION_LOG
            </span>
            <div className="space-y-4 max-h-[190px] md:max-h-[220px] overflow-y-auto pr-2">
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-[#111827]/10 hover:border-[#FF5701] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1.5 mb-1.5">
                    <span className="font-mono text-[9px] text-[#111827] font-bold uppercase">
                      {exp.role}
                    </span>
                    <span className="font-mono text-[8px] tracking-wider text-[#FF5701] px-2 py-0.5 border border-[#FF5701]/20 bg-[#FF5701]/5 rounded-full">
                      {exp.year}
                    </span>
                  </div>
                  <span className="font-serif text-xs text-[#4B5563] italic block mb-1">
                    {exp.institution}
                  </span>
                  <p className="font-mono text-[9.5px] leading-relaxed text-[#4B5563] text-justify">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row border-t border-[#111827]/10 pt-4 gap-4">
            <p className="font-mono text-[10.5px] leading-relaxed text-[#4B5563] w-full sm:w-1/2 text-justify">
              Status: figuring it out, with style.
            </p>
            <p className="font-mono text-[10.5px] leading-relaxed text-[#4B5563] w-full sm:w-1/2 text-justify">
              ETA on having it all together: unknown. Possibly never. We'll see.
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
    projectType: 'General Chit-Chat',
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert('Must populate all inquiry constraints.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY || '',
          subject: `Portfolio Inquiry — ${form.projectType}`,
          from_name: form.name,
          name: form.name,
          email: form.email,
          project_type: form.projectType,
          message: form.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const generatedTicket = 'VOID-' + Math.floor(100000 + Math.random() * 900000);
        setTicketId(generatedTicket);
        setIsSubmitted(true);
      } else {
        alert('Transmission failed. The void rejected your message. Try again.');
      }
    } catch {
      alert('Network error. The carrier pigeon got lost. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      projectType: 'General Chit-Chat',
      message: '',
    });
    setIsSubmitted(false);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-6xl mx-auto py-4 text-[#111827]">
      <div>
        <span className="font-mono text-[10px] text-[#FF5701] uppercase tracking-[0.25em] font-bold block select-none">
          Say hi (or don't, no pressure)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch mt-4">
        {/* Left: Giant action anchors */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="space-y-3">
            <a
              href="mailto:miadninezero@gmail.com?subject=Inquiry"
              className="group font-serif font-bold text-[clamp(2.5rem,7vw,5.5rem)] leading-none text-[#111827] hover:text-[#FF5701] transition-all block select-none uppercase"
            >
              EMAIL{' '}
              <span className="inline-block text-xl md:text-3xl font-mono text-[#111827]/20 group-hover:text-[#FF5701] group-hover:translate-x-1.5 duration-300">
                ↗
              </span>
            </a>
            <a
              href="https://github.com/miadninezero"
              target="_blank"
              rel="noopener noreferrer"
              className="group font-serif font-bold text-[clamp(2.5rem,7vw,5.5rem)] leading-none text-[#111827] hover:text-[#FF5701] transition-all block select-none uppercase"
            >
              GITHUB{' '}
              <span className="inline-block text-xl md:text-3xl font-mono text-[#111827]/20 group-hover:text-[#FF5701] group-hover:translate-x-1.5 duration-300">
                ↗
              </span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 border-t border-[#111827]/10 pt-4 mt-6 select-none opacity-40">
            <span className="font-mono text-[9px] uppercase tracking-wider">EST. RECENTLY</span>
            <span className="font-mono text-[9px] uppercase tracking-wider">POWERED BY CURIOSITY</span>
          </div>
        </div>

        {/* Right: Functional Inquiry Form Box */}
        <div className="lg:col-span-6 bg-white border border-[#111827]/10 p-6 md:p-8 rounded-xl shadow-sm flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleFormSubmit}
                className="space-y-4 text-[#111827]"
              >
                <div className="flex items-center gap-1.5 border-b border-[#111827]/10 pb-3 mb-2 select-none">
                  <Sparkles size={14} className="text-[#FF5701]" />
                  <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#111827]">
                    SECURE_INQUIRY_FORM
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-[#111827]/50 uppercase font-bold">NAME</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Alexis Scribe"
                      className="w-full bg-[#111827]/5 focus:bg-white font-mono text-[10.5px] p-2.5 border border-[#111827]/10 rounded focus:outline-none focus:border-[#FF5701] text-[#111827]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-[#111827]/50 uppercase font-bold">EMAIL</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="scribe@example.com"
                      className="w-full bg-[#111827]/5 focus:bg-white font-mono text-[10.5px] p-2.5 border border-[#111827]/10 rounded focus:outline-none focus:border-[#FF5701] text-[#111827]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] text-[#111827]/50 uppercase font-bold">PROJECT TYPE</label>
                  <select
                    name="projectType"
                    value={form.projectType}
                    onChange={handleInputChange}
                    className="w-full bg-[#111827]/5 focus:bg-white font-mono text-[10.5px] p-2.5 border border-[#111827]/10 rounded focus:outline-none focus:border-[#FF5701] text-[#111827]"
                  >
                    <option value="General Chit-Chat">General Chit-Chat (snacks and coffee)</option>
                    <option value="UI/UX Design">UI/UX Web Design (making things pretty)</option>
                    <option value="Creative Tech Dev">GLSL / WebGL Prototyping (spinning math)</option>
                    <option value="Custom Shell Architecture">Brutalist Shell Development (bloatware-free)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] text-[#111827]/50 uppercase font-bold">INQUIRY MEMORANDUM</label>
                  <textarea
                    name="message"
                    required
                    value={form.message}
                    onChange={handleInputChange}
                    placeholder="e.g. 'Hey, I love your empty portfolio! Can you build me an app that does nothing?'"
                    className="w-full h-24 bg-[#111827]/5 focus:bg-white font-mono text-[10.5px] p-2.5 border border-[#111827]/10 rounded focus:outline-none focus:border-[#FF5701] resize-none text-[#111827] leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-[#FF5701] hover:bg-[#e04c00] disabled:bg-[#FF5701]/30 text-white flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest font-bold uppercase rounded cursor-pointer transition-colors duration-300"
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
                className="text-center py-6 flex flex-col items-center gap-4 text-[#111827]"
              >
                <div className="w-14 h-14 bg-[#FF5701]/10 border border-[#FF5701]/30 text-[#FF5701] rounded-full flex items-center justify-center mb-2 animate-bounce">
                  <Check size={26} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-2xl text-[#111827]">
                    TRANSMISSION SUCCESSFUL
                  </h4>
                  <p className="font-mono text-[10px] text-[#4B5563] mt-1 uppercase tracking-wider">
                    INBOX QUEUED - SEATTLE TIME APPRECIATED
                  </p>
                </div>

                {/* Printed mock index ticket */}
                <div className="w-full bg-[#111827]/5 border border-[#111827]/10 rounded p-4 text-left font-mono text-[10px] space-y-1.5 my-3 relative shadow-sm select-all">
                  <div className="flex justify-between border-b border-[#111827]/10 pb-1.5 mb-2">
                    <span className="font-bold text-[#111827]">VOID ID INDEXER</span>
                    <span className="text-[#FF5701] font-bold">{ticketId}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-x-2 text-[#4B5563]">
                    <span>SENDER_VAL:</span> <span className="text-[#111827] font-semibold">{form.name}</span>
                    <span>ORIGIN_EM:</span> <span className="text-[#111827] font-semibold">{form.email}</span>
                    <span>DEPT_CHG:</span> <span className="text-[#111827] font-semibold">{form.projectType}</span>
                    <span>TIMESTAMP:</span> <span className="text-[#111827] font-semibold">2026-06-05 UTC</span>
                  </div>
                </div>

                <button
                  onClick={resetForm}
                  className="font-mono text-[9px] uppercase tracking-widest text-[#4B5563] hover:text-[#FF5701] border-b border-dashed border-[#111827]/20 hover:border-[#FF5701] pb-0.5 mt-2 transition-all cursor-pointer"
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
