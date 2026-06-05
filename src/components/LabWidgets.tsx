/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

// ==========================================
// Plugin card data
// ==========================================
interface PluginData {
  name: string;
  version: string;
  stability: string;
  description: string;
  stats: { label: string; value: string; percent: number }[];
  status: string;
  statusType: 'running' | 'warning' | 'error' | 'idle';
  uptime?: string;
}

const PLUGINS: PluginData[] = [
  {
    name: 'curiosity.exe',
    version: 'v0.0.1-alpha',
    stability: 'unstable',
    description: 'Opens 47 browser tabs per session. No known fix. Memory leak suspected but honestly who cares.',
    stats: [
      { label: 'RAM', value: '89%', percent: 89 },
      { label: 'TABS', value: '∞', percent: 100 },
    ],
    status: 'RUNNING (always)',
    statusType: 'running',
    uptime: '∞ days',
  },
  {
    name: 'snack_daemon',
    version: 'v3.2.0',
    stability: 'stable (unfortunately)',
    description: 'Background process that triggers every 45 minutes. Cannot be killed. Has root access to the fridge.',
    stats: [
      { label: 'HUNGER', value: '94%', percent: 94 },
      { label: 'SNACKS LEFT', value: '2', percent: 15 },
    ],
    status: 'ACTIVE',
    statusType: 'warning',
    uptime: 'since birth',
  },
  {
    name: 'css-debugger',
    version: 'v0.0.3-beta',
    stability: 'chaotic',
    description: 'Attempts to center divs. Success rate: 12%. Currently stuck in an infinite flexbox loop.',
    stats: [
      { label: 'DIVS CENTERED', value: '3', percent: 12 },
      { label: 'SANITY', value: 'LOW', percent: 8 },
    ],
    status: 'LOOP DETECTED',
    statusType: 'error',
    uptime: '3 yrs (no progress)',
  },
  {
    name: 'sleep_scheduler',
    version: 'v1.0.0',
    stability: 'deprecated',
    description: 'Last successful execution: unknown. Conflicting with caffeine.dll. Uninstall recommended but ignored.',
    stats: [
      { label: 'SLEEP', value: '0hrs', percent: 0 },
      { label: 'COFFEE', value: 'MAX', percent: 100 },
    ],
    status: 'DEPRECATED',
    statusType: 'idle',
    uptime: 'N/A',
  },
];

// ==========================================
// Animated progress bar
// ==========================================
const ProgressBar: React.FC<{ percent: number; color?: string }> = ({ percent, color }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percent), 200);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="w-full h-1.5 bg-[var(--c-text)]/5 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-[1200ms] ease-out"
        style={{
          width: `${width}%`,
          backgroundColor: color || '#FF5701',
        }}
      />
    </div>
  );
};

// ==========================================
// Blinking status dot
// ==========================================
const StatusDot: React.FC<{ type: PluginData['statusType'] }> = ({ type }) => {
  const colors: Record<PluginData['statusType'], string> = {
    running: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    idle: 'bg-[var(--c-text)]/20',
  };

  return (
    <span className="relative flex h-2 w-2">
      {type !== 'idle' && (
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${colors[type]}`}
        />
      )}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${colors[type]}`} />
    </span>
  );
};

// ==========================================
// Individual Plugin Card
// ==========================================
const PluginCard: React.FC<{ plugin: PluginData; index: number }> = ({ plugin, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-full h-full bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg p-5 flex flex-col justify-between group select-none hover:border-[#FF5701]/30 transition-all duration-300 shadow-sm hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <StatusDot type={plugin.statusType} />
            <span className="font-mono text-[9px] text-[var(--c-text)]/40 uppercase tracking-wider font-semibold">
              {String(index + 1).padStart(2, '0')} / PLUGIN
            </span>
          </div>
          <span
            className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 border rounded-full transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            } ${
              plugin.statusType === 'running'
                ? 'text-emerald-700 border-emerald-300 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950 dark:border-emerald-800'
                : plugin.statusType === 'warning'
                ? 'text-amber-700 border-amber-300 bg-amber-100 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800'
                : plugin.statusType === 'error'
                ? 'text-rose-700 border-rose-300 bg-rose-100 dark:text-rose-400 dark:bg-rose-950 dark:border-rose-800'
                : 'text-[var(--c-text)]/50 border-[var(--c-border)] bg-[var(--c-text)]/5'
            }`}
          >
            {plugin.status}
          </span>
        </div>

        {/* Plugin name & version */}
        <h4 className="font-mono font-bold text-sm md:text-base text-[var(--c-text)] leading-tight">
          {plugin.name}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-[9px] text-[#FF5701] font-semibold">
            {plugin.version}
          </span>
          <span className="font-mono text-[8px] text-[var(--c-text)]/30">
            ({plugin.stability})
          </span>
        </div>

        {/* Description */}
        <p className="font-mono text-[9.5px] leading-relaxed text-[var(--c-muted)] mt-3 text-justify">
          {plugin.description}
        </p>
      </div>

      {/* Stats & Progress */}
      <div className="mt-4 space-y-2.5 border-t border-[var(--c-border)] pt-3">
        {plugin.stats.map((stat) => (
          <div key={stat.label}>
            <div className="flex justify-between font-mono text-[8px] text-[var(--c-text)]/50 uppercase tracking-wider mb-1">
              <span className="font-semibold">{stat.label}</span>
              <span className="text-[var(--c-text)] font-bold">{stat.value}</span>
            </div>
            <ProgressBar
              percent={stat.percent}
              color={
                stat.percent > 80
                  ? '#FF5701'
                  : stat.percent > 40
                  ? 'var(--c-text)'
                  : stat.percent > 0
                  ? '#9CA3AF'
                  : '#E5E7EB'
              }
            />
          </div>
        ))}

        {/* Uptime footer */}
        {plugin.uptime && (
          <div className="flex justify-between items-center pt-1">
            <span className="font-mono text-[8px] text-[var(--c-text)]/30 uppercase tracking-wider">
              UPTIME
            </span>
            <span className="font-mono text-[8px] text-[var(--c-text)]/50 font-semibold">
              {plugin.uptime}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// Exported Plugin Grid (replaces old widgets)
// ==========================================
export const CuriosityPlugin: React.FC = () => <PluginCard plugin={PLUGINS[0]} index={0} />;
export const SnackDaemonPlugin: React.FC = () => <PluginCard plugin={PLUGINS[1]} index={1} />;
export const CssDebuggerPlugin: React.FC = () => <PluginCard plugin={PLUGINS[2]} index={2} />;
export const SleepSchedulerPlugin: React.FC = () => <PluginCard plugin={PLUGINS[3]} index={3} />;
