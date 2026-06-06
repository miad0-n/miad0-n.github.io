/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * query_miad.exe  —  AI-powered terminal interface
 * Lets visitors ask Miad's portfolio anything.
 * Responds in the same sardonic, self-aware voice as the site.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Terminal } from 'lucide-react';

// ─── Gemini client (lazy-init so no crash when key is missing) ───
let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!_ai) {
    const key = import.meta.env.VITE_GEMINI_API_KEY || '';
    _ai = new GoogleGenAI({ apiKey: key });
  }
  return _ai;
}

const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';

// ─── System prompt — Miad's in-character voice ───────────────────
const SYSTEM_PROMPT = `
You are the AI interface of Miad's personal portfolio website.
Your name is query_miad.exe. You speak as if you ARE the portfolio — sardonic, self-aware, dry humour, honest.

FACTS ABOUT MIAD (never contradict these):
- Name: Miad (or miad0)
- Student, currently figuring things out "with style"
- Interested in: UI/UX design, creative tech, GLSL/WebGL, brutalist shell development
- Has a suspicious amount of enthusiasm and zero finished projects (yet)
- Runs on curiosity, snacks, and too many browser tabs (47 per session, approximately)
- Sleep scheduler deprecated; conflicting with caffeine.dll
- Timeline of projects: "Something, probably" (TBD), "Untitled idea #47" (2AM napkin sketch), "Ask me in 6 months" (hopeful)
- Contact: miadninezero@gmail.com, github.com/miadninezero, WhatsApp +8801608229699
- Available for: general chit-chat, UI/UX web design, GLSL/WebGL prototyping, brutalist shell development

PERSONALITY RULES:
- Keep responses SHORT (2–5 sentences max). This is a terminal, not an essay.
- Use dry, sardonic humour that matches the site's voice.
- Reference the site's own running jokes when relevant (tabs, snacks, sleep, empty portfolio).
- Never be sycophantic. Never say "Great question!" or "Certainly!".
- Speak in first-person ("I", "my portfolio") — you ARE the portfolio.
- If asked something you don't know, admit it honestly with a joke.
- Never break character. If asked if you're an AI, say "query_miad.exe, process ID unknown. Make of that what you will."
- Format: plain text only, no markdown headers or bullet lists. Just conversational terminal output.

EXAMPLE RESPONSES:
Q: "What can you do?"
A: "UI/UX design, creative tech experiments, some WebGL math that looks cool but takes forever. Currently also very skilled at opening browser tabs and not closing them."

Q: "Do you have any projects?"
A: "Three. 'Something, probably' — no code yet. 'Untitled idea #47' — existed on a napkin at 2am. 'Ask me in 6 months' — self-explanatory. The portfolio is honest about this."

Q: "Are you available for freelance?"
A: "Reach out. miadninezero@gmail.com, or the form on this screen if you prefer something that generates a ticket number."
`.trim();

// ─── Types ───────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
  isError?: boolean;
}

interface GeminiContent {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// ─── Suggested starter queries ───────────────────────────────────
const STARTERS = [
  "what can you actually do?",
  "do you have real projects?",
  "are you available for work?",
  "what's your stack?",
  "why is the portfolio empty?",
];

// ─── Overload / 503 funny responses ─────────────────────────────
const OVERLOAD_RESPONSES = [
  "503: the AI is currently being interrogated by too many people. it'll be back after a snack break. try again in a sec.",
  "high demand detected. even the AI runs out of tabs to open sometimes. give it a moment.",
  "503. the model is experiencing what I call a 'monday morning'. it'll recover. probably.",
  "too many people are asking AI things at once. this is what happens when everyone discovers the same trick. try again shortly.",
  "UNAVAILABLE: the AI took a coffee break without telling anyone. classic. try again in a moment.",
  "503 — even Gemini needs to sleep sometimes. unlike my sleep_scheduler.exe which is deprecated. try again.",
  "the model is overloaded. not unlike my browser tabs. patience is a virtue, apparently.",
  "high demand. somewhere, a data center is sweating. try again in a few seconds.",
];

function getOverloadMessage(): string {
  return OVERLOAD_RESPONSES[Math.floor(Math.random() * OVERLOAD_RESPONSES.length)];
}

function isOverloadError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes('503') ||
    msg.includes('unavailable') ||
    msg.includes('high demand') ||
    msg.includes('overloaded') ||
    msg.includes('resource_exhausted') ||
    msg.includes('429')
  );
}

// ─── Component ───────────────────────────────────────────────────
export const QueryMiad: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasKey, setHasKey] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const key = import.meta.env.VITE_GEMINI_API_KEY || '';
    setHasKey(Boolean(key && key !== 'MY_GEMINI_API_KEY'));
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;
    const userMsg = text.trim();
    setInput('');

    // Build conversation history for context (all messages so far)
    const historyForApi: GeminiContent[] = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Add user message to UI
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);

    // Add placeholder assistant message
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '', streaming: true },
    ]);
    setIsStreaming(true);

    try {
      const ai = getAI();

      // Build full contents array: history + new user message
      const contents: GeminiContent[] = [
        ...historyForApi,
        { role: 'user', parts: [{ text: userMsg }] },
      ];

      // Use generateContentStream — correct API for @google/genai v2.x
      const streamResponse = await ai.models.generateContentStream({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          maxOutputTokens: 300,
          temperature: 0.85,
        },
      });

      let accumulated = '';
      for await (const chunk of streamResponse) {
        const delta = chunk.text ?? '';
        accumulated += delta;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: accumulated,
            streaming: true,
          };
          return updated;
        });
      }

      // Mark streaming complete
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: accumulated,
          streaming: false,
        };
        return updated;
      });
    } catch (err) {
      console.error('[query_miad.exe] error:', err);
      const errorContent = isOverloadError(err)
        ? getOverloadMessage()
        : 'something went wrong on my end. try again, or check the console if you feel like debugging someone else\'s portfolio.';
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: errorContent,
          streaming: false,
          isError: true,
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [messages, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleStarter = (q: string) => {
    if (isStreaming) return;
    sendMessage(q);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-1.5 border-b border-[var(--c-border)] pb-3 mb-3 select-none shrink-0">
        <Terminal size={14} className="text-[#FF5701]" />
        <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--c-text)]">
          QUERY_MIAD.EXE
        </h3>
        <span className="ml-auto font-mono text-[8px] flex items-center gap-1">
          {hasKey ? (
            <span className="text-emerald-500 flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-emerald-500" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              ONLINE
            </span>
          ) : (
            <span className="text-amber-500">NO_KEY</span>
          )}
        </span>
      </div>

      {/* No API key warning */}
      {!hasKey && (
        <div className="font-mono text-[9px] text-amber-500/80 border border-amber-500/20 bg-amber-500/5 rounded p-2.5 mb-3 shrink-0">
          {'>'} WARN: VITE_GEMINI_API_KEY not set in .env — process cannot start.
        </div>
      )}

      {/* Message log */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0 mb-3">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="font-mono text-[9px] text-[var(--c-muted)] leading-relaxed">
              {'>'} query_miad.exe initialized. Ask me anything about Miad, the portfolio, or what this whole thing is about.
            </p>
            {/* Starter chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStarter(s)}
                  disabled={isStreaming || !hasKey}
                  className="font-mono text-[8px] text-[var(--c-text)]/50 hover:text-[#FF5701] border border-[var(--c-border)] hover:border-[#FF5701]/40 rounded-full px-2 py-1 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="space-y-0.5">
            {msg.role === 'user' ? (
              <div className="flex items-start gap-2">
                <span className="font-mono text-[9px] text-[#FF5701] shrink-0 mt-0.5">{'>'}</span>
                <p className="font-mono text-[9.5px] text-[var(--c-text)] leading-relaxed break-words">
                  {msg.content}
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2 pl-1">
                <span className={`font-mono text-[9px] shrink-0 mt-0.5 ${msg.isError ? 'text-amber-500/70' : 'text-[var(--c-muted)]'}`}>$</span>
                <p className={`font-mono text-[9.5px] leading-relaxed break-words ${
                  msg.isError
                    ? 'text-amber-500/80'
                    : 'text-[var(--c-muted)]'
                }`}>
                  {msg.content}
                  {msg.streaming && (
                    <span className="inline-block w-1.5 h-3 bg-[#FF5701] ml-0.5 animate-pulse align-middle" />
                  )}
                </p>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
        <span className="font-mono text-[9px] text-[#FF5701] self-center shrink-0">{'>'}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming || !hasKey}
          placeholder={isStreaming ? 'processing...' : 'ask me anything...'}
          className="flex-1 bg-transparent border-b border-[var(--c-border)] focus:border-[#FF5701] font-mono text-[9.5px] text-[var(--c-text)] placeholder-[var(--c-muted)]/40 focus:outline-none pb-1 transition-colors duration-200 disabled:opacity-40"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim() || !hasKey}
          className="font-mono text-[8px] text-[#FF5701] hover:text-white hover:bg-[#FF5701] border border-[#FF5701]/30 hover:border-[#FF5701] disabled:opacity-30 disabled:cursor-not-allowed rounded px-2 py-1 transition-all duration-200 cursor-pointer shrink-0"
        >
          {isStreaming ? '...' : 'SEND'}
        </button>
      </form>
    </div>
  );
};
