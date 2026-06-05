/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';

// ==========================================
// 1. WEBGL WAVES (Procedural Fluid Field)
// ==========================================
export const WaveFieldWidget: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 300);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 300;
      height = canvas.height = canvas.parentElement?.clientHeight || 300;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let phase = 0;
    const size = 12; // Wave grid resolution
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      phase += 0.02;

      ctx.strokeStyle = 'rgba(255, 87, 1, 0.04)';
      ctx.fillStyle = '#FF5701';

      for (let x = 15; x < width - 15; x += size) {
        for (let y = 15; y < height - 15; y += size) {
          // Compute distance to mouse
          const dx = mouseRef.current.x - x;
          const dy = mouseRef.current.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 80;

          // Compute deformation
          let force = 0;
          let angle = 0;
          if (dist < maxDist) {
            force = (1 - dist / maxDist) * 12;
            angle = Math.atan2(dy, dx);
          }

          // Ambient noise wave formula
          const nVal = Math.sin(x * 0.01 + y * 0.01 + phase) * 4;
          const posX = x + Math.cos(angle) * -force + nVal;
          const posY = y + Math.sin(angle) * -force + nVal;

          // Render wave node point
          const dotSize = dist < maxDist ? 1.5 + (1 - dist / maxDist) * 2 : 1;
          ctx.beginPath();
          ctx.arc(posX, posY, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = dist < maxDist ? `rgba(255, 87, 1, ${0.4 + (1 - dist / maxDist) * 0.6})` : 'rgba(255, 87, 1, 0.15)';
          ctx.fill();

          // Sub-grid lines connecting responsive nodes
          if (dist < maxDist - 20) {
            ctx.beginPath();
            ctx.moveTo(posX, posY);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.strokeStyle = `rgba(255, 87, 1, ${(1 - dist / maxDist) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#141414] border border-white/10 flex flex-col justify-between overflow-hidden p-4 group select-none">
      <div className="absolute inset-0 pointer-events-none z-10 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider font-semibold">01 / SHADERS</span>
          <span className="font-mono text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">INTERACTIVE CANVAS</span>
        </div>
        <div>
          <h4 className="font-sans font-bold text-lg leading-tight text-white">WAVE DEFLECTION</h4>
          <p className="font-mono text-[9.5px] text-white/50 mt-1 max-w-[180px]">Procedural particles reacting to coordinate drag vectors. Also known as: moving dots around to look busy.</p>
        </div>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

// ==========================================
// 2. 3D WIRE SPHERE (Matrix Math projection)
// ==========================================
interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const WireSphereWidget: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0 });
  const rotRef = useRef({ rX: 0.5, rY: 0.5, rZ: 0, vX: 0.005, vY: 0.005 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 300);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 300;
      height = canvas.height = canvas.parentElement?.clientHeight || 300;
    };
    window.addEventListener('resize', handleResize);

    // Generate 3D sphere point vertices
    const points: Point3D[] = [];
    const bands = 9;
    const pointsPerBand = 18;
    const radius = 64;

    for (let i = 0; i < bands; i++) {
      const theta = (i * Math.PI) / (bands - 1);
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let j = 0; j < pointsPerBand; j++) {
        const phi = (j * 2 * Math.PI) / pointsPerBand;
        const x = radius * sinTheta * Math.cos(phi);
        const y = radius * sinTheta * Math.sin(phi);
        const z = radius * cosTheta;
        points.push({ x, y, z });
      }
    }

    // Handles Rotations
    const rotateX = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x,
        y: p.y * cos - p.z * sin,
        z: p.y * sin + p.z * cos,
      };
    };

    const rotateY = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x * cos + p.z * sin,
        y: p.y,
        z: -p.x * sin + p.z * cos,
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Automatic spin if no mouse drag
      if (!dragRef.current.isDragging) {
        rotRef.current.rX += rotRef.current.vX;
        rotRef.current.rY += rotRef.current.vY;
        // Damp speeds
        rotRef.current.vX *= 0.98;
        rotRef.current.vY *= 0.98;
        // Keep baseline spin
        if (Math.abs(rotRef.current.vX) < 0.002) rotRef.current.vX = 0.002;
        if (Math.abs(rotRef.current.vY) < 0.002) rotRef.current.vY = 0.002;
      }

      ctx.strokeStyle = 'rgba(255, 87, 1, 0.4)';
      ctx.lineWidth = 0.6;

      const projected: { x: number; y: number; originalZ: number }[] = [];

      // Project vertices to 2D
      const fov = 170; // Perspective zoom
      const centerX = width / 2;
      const centerY = height / 2 + 10;

      points.forEach((p) => {
        let r = rotateX(p, rotRef.current.rX);
        r = rotateY(r, rotRef.current.rY);

        const dist = 140; // Camera distance
        const projZ = r.z + dist;
        const scale = fov / projZ;
        const pX = centerX + r.x * scale;
        const pY = centerY + r.y * scale;

        projected.push({ x: pX, y: pY, originalZ: r.z });
      });

      // Draw sphere latticework (bands and rings)
      for (let i = 0; i < bands; i++) {
        ctx.beginPath();
        for (let j = 0; j < pointsPerBand; j++) {
          const idx = i * pointsPerBand + j;
          const nextIdx = i * pointsPerBand + ((j + 1) % pointsPerBand);
          const p = projected[idx];
          const np = projected[nextIdx];

          // Compute opacity based on depth coordinate Z to create real spatial depth
          const opacity = Math.max(0.06, Math.min(0.65, (p.originalZ + 64) / 128));
          ctx.strokeStyle = `rgba(255, 87, 1, ${opacity})`;

          if (j === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Draw longitudinal ribs
      for (let j = 0; j < pointsPerBand; j++) {
        ctx.beginPath();
        for (let i = 0; i < bands; i++) {
          const idx = i * pointsPerBand + j;
          const p = projected[idx];
          const opacity = Math.max(0.06, Math.min(0.65, (p.originalZ + 64) / 128));
          ctx.strokeStyle = `rgba(255, 87, 1, ${opacity * 0.4})`;

          if (i === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Points on intersection
      projected.forEach((p) => {
        if (p.originalZ > 0) { // Only front side dots
          const opacity = (p.originalZ + 64) / 128;
          ctx.fillStyle = `rgba(255, 87, 1, ${opacity * 0.95})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleMouseDown = (e: MouseEvent) => {
      dragRef.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
      };
    };

    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (!dragRef.current.isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      rotRef.current.rY += dx * 0.007;
      rotRef.current.rX -= dy * 0.007;

      rotRef.current.vY = dx * 0.003;
      rotRef.current.vX = -dy * 0.003;

      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    };

    const handleMouseUpGlobal = () => {
      dragRef.current.isDragging = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMoveGlobal);
    window.addEventListener('mouseup', handleMouseUpGlobal);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#141414] border border-white/10 flex flex-col justify-between overflow-hidden p-4 group select-none cursor-grab active:cursor-grabbing">
      <div className="absolute inset-0 pointer-events-none z-10 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider font-semibold">02 / THREE.JS</span>
          <span className="font-mono text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">CLICK-AND-DRAG SPIN</span>
        </div>
        <div>
          <h4 className="font-sans font-bold text-lg leading-tight text-white">VECTOR SPHERE</h4>
          <p className="font-mono text-[9.5px] text-white/50 mt-1 max-w-[180px]">Simulated spatial mathematics utilizing linear rendering. In other words, a spinning cage of math.</p>
        </div>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

// ==========================================
// 3. FIGMA PLUGINS (Live Contrast Auditor)
// ==========================================
export const ContrastPluginWidget: React.FC = () => {
  const [bgColor, setBgColor] = useState<string>('#0A0A0A');
  const [fgColor, setFgColor] = useState<string>('#FFFFFF');
  const [sampleTextSize, setSampleTextSize] = useState<number>(14);

  // Math helper for color relative luminance
  const getLuminance = (hex: string) => {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const getContrastRatio = (hex1: string, hex2: string) => {
    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);
    const bright = Math.max(lum1, lum2);
    const dark = Math.min(lum1, lum2);
    return parseFloat(((bright + 0.05) / (dark + 0.05)).toFixed(2));
  };

  const ratio = getContrastRatio(fgColor, bgColor);

  // Criteria validation
  const passesAA_Normal = ratio >= 4.5;
  const passesAA_Large = ratio >= 3.0;
  const passesAAA_Normal = ratio >= 7.0;
  const passesAAA_Large = ratio >= 4.5;

  const getStatusLabel = () => {
    if (ratio >= 7) return { label: 'PASS - AAA', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (ratio >= 4.5) return { label: 'PASS - AA', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    if (ratio >= 3.0) return { label: 'PASS - ADAPTIVE', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
    return { label: 'FAIL', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
  };

  const status = getStatusLabel();

  return (
    <div className="w-full h-full bg-[#141414] border border-white/10 flex flex-col justify-between p-4 group select-none">
      <div className="flex justify-between items-start">
        <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider font-semibold">03 / UTILITIES</span>
        <span className="font-mono text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">LIVE LAB FORM</span>
      </div>

      {/* Interactive Controls & Live Panel */}
      <div className="my-3 flex flex-col gap-2.5">
        {/* Sample text block that adapts live */}
        <div
          className="p-3 border border-white/10 rounded flex items-center justify-center transition-all duration-300 min-h-[56px] text-center"
          style={{ backgroundColor: bgColor, color: fgColor }}
        >
          <span style={{ fontSize: `${sampleTextSize}px` }} className="font-mono font-medium tracking-tight">
            Design is active execution.
          </span>
        </div>

        {/* Sliders for hex manipulation */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[8.5px] text-white/50 uppercase font-semibold">FG (TEXT)</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border-0 p-0"
              />
              <span className="font-mono text-[10px] text-white uppercase self-center">{fgColor}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-mono text-[8.5px] text-white/50 uppercase font-semibold">BG (BACK)</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border-0 p-0"
              />
              <span className="font-mono text-[10px] text-white uppercase self-center">{bgColor}</span>
            </div>
          </div>
        </div>

        {/* Text size control */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between font-mono text-[8.5px] text-white/50">
            <span className="font-semibold uppercase">FONT SIZE</span>
            <span>{sampleTextSize}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="24"
            step="1"
            value={sampleTextSize}
            onChange={(e) => setSampleTextSize(Number(e.target.value))}
            className="w-full accent-[#FF5701]"
          />
        </div>

        {/* Metrics readout */}
        <div className="flex justify-between items-center border-t border-white/10 pt-2.5">
          <div className="flex flex-col">
            <span className="font-mono text-[8px] text-white/50 uppercase">WCAG Ratio</span>
            <span className="font-sans font-bold text-base text-[#FF5701]">{ratio}:1</span>
          </div>
          <span className={`font-mono text-[8px] tracking-wider px-2 py-0.5 border rounded-full ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div>
        <h4 className="font-sans font-bold text-lg leading-tight text-white">CONTRAST AUDITOR</h4>
        <p className="font-mono text-[9.5px] text-white/50 mt-1">Checking if my color choices are legally compliant, so the contrast police don\'t arrest me.</p>
      </div>
    </div>
  );
};

// ==========================================
// 4. RAW MATH (Fourier Series Assembler)
// ==========================================
export const FourierAssemblerWidget: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [harmonics, setHarmonics] = useState<number>(3); // Number of harmonics
  const [waveType, setWaveType] = useState<'square' | 'sawtooth'>('square');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 300;
      height = canvas.height = canvas.parentElement?.clientHeight || 200;
    };
    window.addEventListener('resize', handleResize);

    let t = 0;
    const samples: number[] = [];
    const maxSamples = 180;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.04;

      const centerY = height / 2 - 10;
      const originX = width / 2.8;

      // Draw baseline axis limits
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Computing live Fourier summing loops
      let x = 0;
      let y = 0;

      // Circles for harmonics modeling (classic spatial phasor breakdown)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < harmonics; i++) {
        let prevX = x;
        let prevY = y;

        let n = 0;
        let radius = 0;

        if (waveType === 'square') {
          n = i * 2 + 1; // 1, 3, 5, 7, ...
          radius = (40 * (4 / (Math.PI * n)));
        } else {
          n = i + 1; // 1, 2, 3, 4, ...
          radius = (25 * (2 / (Math.PI * n))) * (i % 2 === 0 ? 1 : -1);
        }

        x += radius * Math.cos(n * t);
        y += radius * Math.sin(n * t);

        // Draw phasor circle
        ctx.strokeStyle = i === 0 ? 'rgba(255, 87, 1, 0.25)' : 'rgba(255, 87, 1, 0.08)';
        ctx.beginPath();
        ctx.arc(originX + prevX, centerY + prevY, Math.abs(radius), 0, Math.PI * 2);
        ctx.stroke();

        // Draw radial line
        ctx.strokeStyle = i === 0 ? 'rgba(255, 87, 1, 0.5)' : '#FF5701';
        ctx.beginPath();
        ctx.moveTo(originX + prevX, centerY + prevY);
        ctx.lineTo(originX + x, centerY + y);
        ctx.stroke();
      }

      // Append phasor output to signal log
      samples.unshift(y);
      if (samples.length > maxSamples) {
        samples.pop();
      }

      // Draw reference laser indicator
      ctx.strokeStyle = 'rgba(255, 87, 1, 0.35)';
      ctx.lineWidth = 0.7;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(originX + x, centerY + y);
      ctx.lineTo(originX + 60, centerY + y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw synthesized output signal wave
      ctx.strokeStyle = '#FF5701';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i < samples.length; i++) {
        const sweepX = originX + 60 + i * 1.1;
        if (sweepX > width - 10) break;
        if (i === 0) {
          ctx.moveTo(sweepX, centerY + samples[i]);
        } else {
          ctx.lineTo(sweepX, centerY + samples[i]);
        }
      }
      ctx.stroke();

      // Draw small glowing laser head
      if (samples.length > 0) {
        ctx.fillStyle = '#FF5701';
        ctx.beginPath();
        ctx.arc(originX + 60, centerY + samples[0], 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [harmonics, waveType]);

  return (
    <div className="w-full h-full bg-[#141414] border border-white/10 flex flex-col justify-between p-4 group select-none">
      <div className="flex justify-between items-start">
        <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider font-semibold">04 / FOURIER LAB</span>
        <div className="flex gap-2">
          <button
            onClick={() => setWaveType('square')}
            className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 border rounded ${
              waveType === 'square' ? 'bg-[#FF5701] text-white font-bold border-transparent' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'
            }`}
          >
            SQUARE
          </button>
          <button
            onClick={() => setWaveType('sawtooth')}
            className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 border rounded ${
              waveType === 'sawtooth' ? 'bg-[#FF5701] text-white font-bold border-transparent' : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'
            }`}
          >
            SAWTOOTH
          </button>
        </div>
      </div>

      {/* Control panel and visual canvas */}
      <div className="my-2.5 relative flex flex-col gap-2">
        <div className="relative w-full h-[100px] border border-white/10 rounded overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-white/5" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between font-mono text-[8.5px] text-white/50">
            <span className="font-semibold uppercase">HARMONIC ITERATIONS</span>
            <span>{harmonics} WAVS</span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            step="1"
            value={harmonics}
            onChange={(e) => setHarmonics(Number(e.target.value))}
            className="w-full accent-[#FF5701]"
          />
        </div>
      </div>

      <div>
        <h4 className="font-sans font-bold text-lg leading-tight text-white">WAVE ASSEMBLER</h4>
        <p className="font-mono text-[9.5px] text-white/50 mt-1">Interlinked radial sines synthesizing waveforms. Generating waves because it looks cool.</p>
      </div>
    </div>
  );
};
