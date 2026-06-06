/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────
type GameState = 'idle' | 'playing' | 'dead';

const GameShell: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <div className="w-full h-full flex flex-col font-mono">
    {/* terminal title bar */}
    <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-[var(--c-border)]">
      <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
      <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
      <span className="font-mono text-[8.5px] text-[var(--c-text)]/40 uppercase tracking-widest ml-2">
        {title}
      </span>
    </div>
    <div className="font-mono text-[8px] text-[var(--c-muted)] uppercase tracking-wider mb-2 select-none">
      {subtitle}
    </div>
    {children}
  </div>
);

const StartBtn: React.FC<{ onStart: () => void; label?: string }> = ({
  onStart,
  label = 'RUN PROCESS',
}) => (
  <button
    onClick={onStart}
    className="mt-2 w-full h-8 bg-[#FF5701]/10 hover:bg-[#FF5701]/20 border border-[#FF5701]/30 hover:border-[#FF5701]/60 text-[#FF5701] font-mono text-[9px] uppercase tracking-widest rounded transition-all duration-200 cursor-pointer"
  >
    {'>'} {label}
  </button>
);

const ScoreLine: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between font-mono text-[8.5px] text-[var(--c-text)]/60">
    <span className="uppercase tracking-wider">{label}</span>
    <span className="text-[#FF5701] font-bold">{value}</span>
  </div>
);

// ─────────────────────────────────────────────────
// 1.  TAB_KILLER.EXE  –  Whack-a-tab
// ─────────────────────────────────────────────────
interface Tab {
  id: number;
  label: string;
  x: number; // % from left
  y: number; // % from top
  alive: boolean;
}

const TAB_LABELS = [
  'Stack Overflow',
  'npm install',
  'MDN Docs',
  'How to center div',
  'ChatGPT',
  'localhost:3000',
  'GitHub Issues',
  'CSS Tricks',
  'Can I use?',
  'Reddit r/webdev',
  'YouTube',
  'Dribbble',
];

export const TabKillerGame: React.FC = () => {
  const [state, setState] = useState<GameState>('idle');
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const counterRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(clearInterval);
    timersRef.current = [];
  };

  const spawnTab = useCallback(() => {
    const id = ++counterRef.current;
    const label = TAB_LABELS[Math.floor(Math.random() * TAB_LABELS.length)];
    const newTab: Tab = {
      id,
      label,
      x: 5 + Math.random() * 80,
      y: 10 + Math.random() * 70,
      alive: true,
    };
    setTabs((prev) => [...prev.slice(-14), newTab]);

    // auto-expire after 2.2s → adds to missed count
    const expireTimer = setTimeout(() => {
      setTabs((prev) =>
        prev.map((t) => (t.id === id && t.alive ? { ...t, alive: false } : t))
      );
      setMissed((m) => {
        const next = m + 1;
        if (next >= 5) endGame();
        return next;
      });
    }, 2200);
    timersRef.current.push(expireTimer as unknown as ReturnType<typeof setInterval>);
  }, []);

  const endGame = useCallback(() => {
    clearAllTimers();
    setState('dead');
  }, []);

  const startGame = () => {
    clearAllTimers();
    setTabs([]);
    setScore(0);
    setMissed(0);
    setTimeLeft(20);
    counterRef.current = 0;
    setState('playing');
  };

  useEffect(() => {
    if (state !== 'playing') return;

    // Countdown clock
    const clock = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(clock);
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Spawn tabs with increasing frequency
    let interval = 900;
    const spawnLoop = setInterval(() => {
      spawnTab();
      interval = Math.max(400, interval - 20);
    }, interval);

    timersRef.current.push(clock, spawnLoop);

    return () => clearAllTimers();
  }, [state]);

  const killTab = (id: number) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, alive: false } : t))
    );
    setScore((s) => s + 1);
  };

  return (
    <GameShell
      title="tab_killer.exe"
      subtitle={
        state === 'playing'
          ? `TIME: ${timeLeft}s   MISSED: ${missed}/5`
          : state === 'dead'
          ? 'PROCESS_TERMINATED — HEAP OVERFLOW'
          : 'v0.1.0 · CLICK TABS BEFORE THEY ESCAPE'
      }
    >
      {state === 'idle' && (
        <div className="flex-1 flex flex-col justify-between">
          <p className="font-mono text-[9px] text-[var(--c-muted)] leading-relaxed">
            Browser tabs are spawning out of control. Click them before they escape.
            5 escaped tabs = heap overflow = you lose.
          </p>
          <StartBtn onStart={startGame} label="KILL SOME TABS" />
        </div>
      )}

      {state === 'playing' && (
        <div
          className="flex-1 relative bg-[var(--c-text)]/3 rounded border border-[var(--c-border)] overflow-hidden select-none"
          style={{ minHeight: 130 }}
        >
          {tabs
            .filter((t) => t.alive)
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => killTab(tab.id)}
                className="absolute flex items-center gap-1 bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[#FF5701] hover:bg-[#FF5701] hover:text-white text-[var(--c-text)] px-2 py-1 rounded text-[7.5px] font-mono cursor-pointer transition-all duration-100 shadow-sm whitespace-nowrap animate-[fadeIn_0.15s_ease]"
                style={{ left: `${tab.x}%`, top: `${tab.y}%`, transform: 'translate(-50%,-50%)' }}
              >
                <span className="text-[#FF5701] group-hover:text-white">×</span>
                {tab.label}
              </button>
            ))}
          {/* score live */}
          <div className="absolute bottom-1 right-2 font-mono text-[8px] text-[#FF5701]/60 select-none">
            CLOSED: {score}
          </div>
        </div>
      )}

      {state === 'dead' && (
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-1.5 py-2">
            <ScoreLine label="TABS CLOSED" value={score} />
            <ScoreLine label="TABS ESCAPED" value={missed} />
            <ScoreLine
              label="RAM FREED"
              value={`${Math.round(score * 47)}mb`}
            />
            <div className="font-mono text-[8px] text-rose-500/80 mt-2 border-t border-[var(--c-border)] pt-2">
              {missed >= 5
                ? 'CRITICAL: browser.exe has crashed. Try again.'
                : `TIMEOUT: ${score} tabs closed before heat death.`}
            </div>
          </div>
          <StartBtn onStart={startGame} label="RESTART PROCESS" />
        </div>
      )}
    </GameShell>
  );
};

// ─────────────────────────────────────────────────
// 2.  SNACK_RUNNER.EXE  –  Endless runner
// ─────────────────────────────────────────────────
const SNACKS = ['🍕', '🍪', '☕', '🍩', '🧃', '🥐'];
const RUNNER_H = 130; // px height of game area
const GROUND = 24;    // px from bottom — ground level
const PLAYER_W = 24;
const PLAYER_H = 16;
const OBSTACLE_W = 22;
const OBSTACLE_H = 22;

interface Obstacle {
  id: number;
  x: number;
  emoji: string;
}

export const SnackRunnerGame: React.FC = () => {
  const [state, setState] = useState<GameState>('idle');
  const [playerY, setPlayerY] = useState(0); // offset above ground
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const obsIdRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const jumpVelRef = useRef(0);
  const playerYRef = useRef(0);
  const isJumpingRef = useRef(false);
  const stateRef = useRef<GameState>('idle');
  const speedRef = useRef(3);
  const scoreRef = useRef(0);
  const containerWidth = 280; // approximate card content width

  const jump = useCallback(() => {
    if (stateRef.current !== 'playing') return;
    if (isJumpingRef.current) return;
    isJumpingRef.current = true;
    setIsJumping(true);
    jumpVelRef.current = 7.5;
  }, []);

  const startGame = () => {
    setObstacles([]);
    setScore(0);
    scoreRef.current = 0;
    setPlayerY(0);
    playerYRef.current = 0;
    isJumpingRef.current = false;
    setIsJumping(false);
    jumpVelRef.current = 0;
    speedRef.current = 3;
    obsIdRef.current = 0;
    stateRef.current = 'playing';
    setState('playing');
  };

  // Physics loop
  useEffect(() => {
    if (state !== 'playing') return;

    let lastObstacle = 0;
    let frame = 0;

    const tick = () => {
      frame++;

      // Player physics
      if (isJumpingRef.current) {
        jumpVelRef.current -= 0.52;
        playerYRef.current = Math.max(0, playerYRef.current + jumpVelRef.current);
        setPlayerY(playerYRef.current);
        if (playerYRef.current <= 0 && jumpVelRef.current < 0) {
          playerYRef.current = 0;
          isJumpingRef.current = false;
          setIsJumping(false);
          jumpVelRef.current = 0;
        }
      }

      // Move obstacles + collision
      setObstacles((prev) => {
        const updated = prev
          .map((o) => ({ ...o, x: o.x - speedRef.current }))
          .filter((o) => o.x > -OBSTACLE_W);

        // Collision check
        const playerLeft = 28;
        const playerRight = playerLeft + PLAYER_W - 4;
        const playerTop = GROUND + playerYRef.current;
        const playerBottom = playerTop + PLAYER_H;

        for (const obs of updated) {
          const obsLeft = obs.x;
          const obsRight = obs.x + OBSTACLE_W;
          const obsTop = GROUND;
          const obsBottom = obsTop + OBSTACLE_H;

          if (
            playerRight > obsLeft &&
            playerLeft < obsRight &&
            playerBottom > obsTop &&
            playerTop < obsBottom
          ) {
            stateRef.current = 'dead';
            setState('dead');
            return updated;
          }
        }
        return updated;
      });

      // Spawn obstacle
      if (frame - lastObstacle > Math.max(55, 90 - scoreRef.current / 2)) {
        lastObstacle = frame;
        obsIdRef.current++;
        setObstacles((prev) => [
          ...prev,
          {
            id: obsIdRef.current,
            x: containerWidth + 30,
            emoji: SNACKS[Math.floor(Math.random() * SNACKS.length)],
          },
        ]);
      }

      // Score
      scoreRef.current += 0.07;
      if (frame % 6 === 0) setScore(Math.floor(scoreRef.current));

      // Speed ramp
      speedRef.current = 3 + scoreRef.current * 0.018;

      if (stateRef.current === 'playing') {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [state]);

  // Keyboard + touch jump
  useEffect(() => {
    if (state !== 'playing') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state, jump]);

  const groundTop = RUNNER_H - GROUND - PLAYER_H;
  const playerBottom = groundTop - playerY;

  return (
    <GameShell
      title="snack_runner.exe"
      subtitle={
        state === 'playing'
          ? `KM FROM FRIDGE: ${score}`
          : state === 'dead'
          ? 'SNACK_DAEMON CAUGHT YOU'
          : 'v3.2.0 · SPACE / TAP TO JUMP'
      }
    >
      {state === 'idle' && (
        <div className="flex-1 flex flex-col justify-between">
          <p className="font-mono text-[9px] text-[var(--c-muted)] leading-relaxed">
            The snack_daemon has root access and is chasing you. Run, jump, survive.
            Colliding with a snack ends the process immediately.
          </p>
          <StartBtn onStart={startGame} label="BEGIN ESCAPE SEQUENCE" />
        </div>
      )}

      {(state === 'playing' || state === 'dead') && (
        <div
          className="flex-1 flex flex-col justify-between"
          onPointerDown={state === 'playing' ? jump : undefined}
        >
          {/* Game arena */}
          <div
            className="relative w-full bg-[var(--c-text)]/3 rounded border border-[var(--c-border)] overflow-hidden select-none"
            style={{ height: RUNNER_H }}
          >
            {/* Ground line */}
            <div
              className="absolute left-0 right-0 border-t border-dashed border-[var(--c-border)]"
              style={{ bottom: GROUND }}
            />

            {/* Player — the `>_` cursor character */}
            <div
              className="absolute font-mono font-bold text-[13px] leading-none transition-none"
              style={{
                left: 28,
                bottom: GROUND + playerY,
                color: state === 'dead' ? '#ef4444' : '#FF5701',
                width: PLAYER_W,
                height: PLAYER_H,
                lineHeight: `${PLAYER_H}px`,
              }}
            >
              {'>_'}
            </div>

            {/* Obstacles */}
            {obstacles.map((obs) => (
              <div
                key={obs.id}
                className="absolute text-base leading-none select-none"
                style={{
                  left: obs.x,
                  bottom: GROUND,
                  width: OBSTACLE_W,
                  height: OBSTACLE_H,
                  lineHeight: `${OBSTACLE_H}px`,
                }}
              >
                {obs.emoji}
              </div>
            ))}

            {/* Score overlay */}
            <div className="absolute top-1.5 right-2 font-mono text-[8px] text-[var(--c-text)]/30 select-none">
              {score} km
            </div>

            {/* Dead overlay */}
            {state === 'dead' && (
              <div className="absolute inset-0 bg-[var(--c-bg)]/60 flex items-center justify-center">
                <span className="font-mono text-[9px] text-rose-500 uppercase tracking-wider animate-pulse">
                  PROCESS TERMINATED
                </span>
              </div>
            )}
          </div>

          {state === 'dead' && (
            <div className="mt-2 space-y-1">
              <ScoreLine label="DISTANCE RUN" value={`${score} km`} />
              <ScoreLine label="SNACKS DODGED" value={Math.max(0, obsIdRef.current - 1)} />
              <StartBtn onStart={startGame} label="RETRY ESCAPE" />
            </div>
          )}
        </div>
      )}
    </GameShell>
  );
};

// ─────────────────────────────────────────────────
// 3.  VOID_TYPER.EXE  –  Typing speed test
// ─────────────────────────────────────────────────
const PROMPTS = [
  `git commit -m "fixed it (it broke again)"`,
  `npm install && hope_for_the_best`,
  `rm -rf node_modules && cry`,
  `// TODO: fix this before the heat death of the universe`,
  `const x = undefined; // it works, don't touch it`,
  `git push origin main --force`,
  `console.log("why is this undefined???")`,
  `while (true) { drinkCoffee(); }`,
  `if (!working) { google(); stackoverflow(); cry(); }`,
  `// center a div: the final frontier`,
];

export const VoidTyperGame: React.FC = () => {
  const [state, setState] = useState<GameState>('idle');
  const [promptIndex, setPromptIndex] = useState(0);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [round, setRound] = useState(0);
  const [totalWpm, setTotalWpm] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const prompt = PROMPTS[promptIndex % PROMPTS.length];

  const startGame = () => {
    const idx = Math.floor(Math.random() * PROMPTS.length);
    setPromptIndex(idx);
    setInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setRound(0);
    setTotalWpm(0);
    setState('playing');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const nextRound = () => {
    setPromptIndex((i) => (i + 1) % PROMPTS.length);
    setInput('');
    setStartTime(null);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Start timer on first keystroke
    if (!startTime && val.length === 1) {
      setStartTime(Date.now());
    }

    setInput(val);

    // Accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === prompt[i]) correct++;
    }
    const acc = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
    setAccuracy(acc);

    // WPM
    if (startTime && val.length > 0) {
      const mins = (Date.now() - startTime) / 60000;
      const words = val.trim().split(/\s+/).length;
      setWpm(Math.round(words / mins));
    }

    // Completed?
    if (val === prompt) {
      const finalMins = startTime ? (Date.now() - startTime) / 60000 : 1;
      const words = val.trim().split(/\s+/).length;
      const finalWpm = Math.round(words / finalMins);
      setWpm(finalWpm);
      setTotalWpm((prev) => prev + finalWpm);
      setRound((r) => r + 1);
      setState('dead'); // use 'dead' as "round complete"
    }
  };

  // Render the prompt with character-level colouring
  const renderPrompt = () =>
    prompt.split('').map((char, i) => {
      let color = 'text-[var(--c-muted)]';
      if (i < input.length) {
        color = input[i] === char ? 'text-emerald-500' : 'text-rose-500';
      } else if (i === input.length) {
        color = 'text-[#FF5701] underline';
      }
      return (
        <span key={i} className={color}>
          {char}
        </span>
      );
    });

  const commitReady = accuracy >= 90;

  return (
    <GameShell
      title="void_typer.exe"
      subtitle={
        state === 'playing'
          ? `WPM: ${wpm}   ACC: ${accuracy}%`
          : state === 'dead'
          ? commitReady
            ? 'COMMIT READY ✓'
            : 'LOW ACCURACY — MERGE CONFLICTS IMMINENT'
          : 'v2.0.1 · TYPE THE PROMPT EXACTLY'
      }
    >
      {state === 'idle' && (
        <div className="flex-1 flex flex-col justify-between">
          <p className="font-mono text-[9px] text-[var(--c-muted)] leading-relaxed">
            A line of code appears. You must type it exactly. Speed and accuracy
            are logged. Commit message quality is judged harshly.
          </p>
          <StartBtn onStart={startGame} label="INIT TYPING TEST" />
        </div>
      )}

      {state === 'playing' && (
        <div className="flex-1 flex flex-col gap-3">
          {/* Prompt display */}
          <div className="bg-[var(--c-text)]/4 rounded p-2.5 font-mono text-[9px] leading-relaxed break-all border border-[var(--c-border)]">
            {renderPrompt()}
          </div>

          {/* Hidden input */}
          <input
            ref={inputRef}
            value={input}
            onChange={handleInput}
            className="w-full bg-[var(--c-surface)] border border-[var(--c-border)] focus:border-[#FF5701] rounded px-2.5 py-2 font-mono text-[9.5px] text-[var(--c-text)] focus:outline-none"
            placeholder="Type here..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />

          {/* Live bar */}
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="flex justify-between font-mono text-[7.5px] text-[var(--c-text)]/40 mb-1">
                <span>ACCURACY</span>
                <span>{accuracy}%</span>
              </div>
              <div className="h-1 bg-[var(--c-text)]/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${accuracy}%`,
                    backgroundColor: accuracy > 80 ? '#10b981' : accuracy > 60 ? '#FF5701' : '#ef4444',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {state === 'dead' && (
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-1.5 py-1">
            <ScoreLine label="SPEED" value={`${wpm} WPM`} />
            <ScoreLine label="ACCURACY" value={`${accuracy}%`} />
            <ScoreLine label="ROUNDS" value={round} />
            <ScoreLine
              label="STATUS"
              value={commitReady ? 'COMMIT READY' : 'NEEDS REVIEW'}
            />
            <div
              className={`font-mono text-[8px] mt-2 border-t border-[var(--c-border)] pt-2 ${
                commitReady ? 'text-emerald-500/80' : 'text-amber-500/80'
              }`}
            >
              {commitReady
                ? `> git commit -m "actually works" ✓`
                : '> merge conflicts detected. type faster.'}
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={nextRound}
              className="flex-1 h-7 bg-[var(--c-text)]/5 hover:bg-[var(--c-text)]/10 border border-[var(--c-border)] text-[var(--c-text)] font-mono text-[8px] uppercase tracking-widest rounded transition-all cursor-pointer"
              onPointerDown={() => {
                nextRound();
                setState('playing');
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
            >
              NEXT PROMPT
            </button>
            <button
              onClick={startGame}
              className="flex-1 h-7 bg-[#FF5701]/10 hover:bg-[#FF5701]/20 border border-[#FF5701]/30 text-[#FF5701] font-mono text-[8px] uppercase tracking-widest rounded transition-all cursor-pointer"
            >
              RESTART
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
};
