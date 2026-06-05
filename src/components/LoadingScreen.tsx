/**
 * LoadingScreen — "The Orange Flood"
 *
 * Sequence (≈2.5s total):
 *   0.00s → 0.80s  Orange rises from bottom   (clip-path flood)
 *   0.85s → 1.40s  "MIAD" visible             (AnimatePresence fade)
 *   1.50s → 2.25s  Orange recedes downward    (clip-path recession)
 *   2.25s → 2.50s  Entire loader fades to 0   (clean handoff — no site opacity tricks)
 *   2.50s          onComplete → loader unmounts
 *
 * The site is always at full opacity underneath. The loader simply
 * fades away on top — works identically in both light and dark mode.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const FLOOD_MS   = 800;
const HOLD_MS    = 700;
const RECEDE_MS  = 750;
const FADEOUT_MS = 250;

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [recedeStarted, setRecedeStarted] = useState(false);
  const [fadingOut, setFadingOut]         = useState(false);
  const [showText, setShowText]           = useState(false);

  useEffect(() => {
    // Show text just after flood finishes
    const t1 = setTimeout(() => setShowText(true), FLOOD_MS + 50);
    // Hide text and begin recession
    const t2 = setTimeout(() => {
      setShowText(false);
      setRecedeStarted(true);
    }, FLOOD_MS + HOLD_MS);
    // Start fading out the entire loader overlay
    const t3 = setTimeout(() => setFadingOut(true), FLOOD_MS + HOLD_MS + RECEDE_MS);
    // Signal complete — loader can unmount
    const t4 = setTimeout(onComplete, FLOOD_MS + HOLD_MS + RECEDE_MS + FADEOUT_MS);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <motion.div
      animate={{ opacity: fadingOut ? 0 : 1 }}
      transition={{ duration: FADEOUT_MS / 1000, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        /* Transparent — site shows through during loader fade-out.
           No background needed: the orange panel covers everything
           during the animation, and we fade the whole overlay out at
           the end instead of fading the site in. */
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: fadingOut ? 'none' : 'all',
      }}
    >
      {/* Dark backdrop — only visible in the brief moment before
          the orange arrives (matches dark bg; negligible in light mode). */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'var(--c-bg)',
          zIndex: 0,
        }}
      />

      {/* ── Orange flood panel ──────────────────────────────────────────
          Flood   : inset(100% 0 0 0) → inset(0 0 0% 0)  (rises from bottom)
          Recession: inset(0 0 0% 0) → inset(100% 0 0 0)  (recedes downward)
      ───────────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ clipPath: 'inset(100% 0 0% 0)' }}
        animate={{
          clipPath: recedeStarted
            ? 'inset(100% 0 0% 0)'
            : 'inset(0% 0 0% 0)',
        }}
        transition={
          recedeStarted
            ? { duration: RECEDE_MS / 1000, ease: [0.7, 0, 0.84, 0] }
            : { duration: FLOOD_MS / 1000,  ease: [0.16, 1, 0.3, 1]  }
        }
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#FF5701',
          zIndex: 1,
          willChange: 'clip-path',
        }}
      />

      {/* ── "MIAD" — stark white, Playfair Display, centred ────────── */}
      <AnimatePresence>
        {showText && (
          <motion.div
            key="miad-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'relative',
              zIndex: 2,
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(5rem, 14vw, 10rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            MIAD
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
