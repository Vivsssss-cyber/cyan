'use client';

import React from 'react';
import {
  LayoutGrid, FileText, Box, Sliders, BarChart3, Calendar, Layers, Play, PieChart, Cpu, Settings, Search,
} from '../PixelIcons';
import type { NavItem } from './SimShell';
import {
  CARD, SUBCARD, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, negative, warning, positive,
  cyanTint, whisper, surfaceSoft,
} from './sim-ui';

/* ── Admin sidebar nav ───────────────────────────────────────────────── */
export const ADMIN_NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid, to: '/sim/admin' },
  { key: 'scenarios', label: 'Scenarios', icon: FileText, to: '/sim/admin/scenarios' },
  { key: 'blocks', label: 'Business Blocks', icon: Box, to: '/sim/admin/blocks' },
  { key: 'decisions', label: 'Decisions', icon: Sliders, to: '/sim/admin/decisions' },
  { key: 'kpis', label: 'KPIs', icon: BarChart3, to: '/sim/admin/kpis' },
  { key: 'timelines', label: 'Timelines', icon: Calendar, to: '/sim/admin/timeline' },
  { key: 'recipes', label: 'Recipes', icon: Layers, to: '/sim/admin/recipe' },
  { key: 'simulations', label: 'Simulations', icon: Play, to: '/sim/admin/balance' },
  { key: 'reports', label: 'Reports', icon: PieChart },
  { key: 'datahub', label: 'Data Hub', icon: Cpu },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export const ADMIN_USER = { name: 'Daria Sokolova', role: 'Game Designer · CYAN' };

/* ── Search input ────────────────────────────────────────────────────── */
export function SearchInput({ value, onChange, placeholder = 'Search…', width }: { value: string; onChange: (v: string) => void; placeholder?: string; width?: number | string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--game-surface-solid)', border: '1.4px solid var(--sv-border)', borderRadius: 10, padding: '9px 13px', width }}>
      <Search size={16} color={faint} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: DATA, fontSize: 13.5, color: ink, minWidth: 0 }} />
    </div>
  );
}

/* ── Filter tabs (pill) ──────────────────────────────────────────────── */
export function FilterTabs({ tabs, active, onChange }: { tabs: { id: string; label: string; count?: number }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: 'var(--game-surface)', border: '1px solid #fff', borderRadius: 70, padding: '4px 6px' }}>
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            fontFamily: DISPLAY, fontSize: 13, fontWeight: on ? 700 : 600, padding: '8px 16px', borderRadius: 30, border: 'none', cursor: 'pointer',
            background: on ? 'var(--game-cta-gradient)' : 'transparent', color: on ? '#fff' : muted, transition: 'all .15s', whiteSpace: 'nowrap',
          }}>
            {t.label}{t.count != null && <span style={{ marginLeft: 6, opacity: 0.8, fontVariantNumeric: 'tabular-nums' }}>{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ── Form primitives ─────────────────────────────────────────────────── */
export function Field({ label, hint, children, required }: { label: string; hint?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: DATA, fontSize: 13, fontWeight: 600, color: body, marginBottom: 7 }}>
        {label}{required && <span style={{ color: negative, marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

const fieldBase: React.CSSProperties = {
  width: '100%', fontFamily: DATA, fontSize: 14, color: ink, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 8, padding: '11px 12px', outline: 'none',
};
export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...fieldBase, ...props.style }} />;
}
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...fieldBase, minHeight: 90, resize: 'vertical', lineHeight: 1.55, ...props.style }} />;
}
export function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...fieldBase, cursor: 'pointer', appearance: 'none' }}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} aria-pressed={on} style={{ width: 42, height: 24, borderRadius: 999, background: on ? cyan : 'var(--switch-background)', position: 'relative', border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'background .15s ease' }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .15s ease' }} />
    </button>
  );
}

export function Segmented({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'inline-flex', background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 999, padding: 3 }}>
      {options.map((o) => {
        const on = o === value;
        return <button key={o} onClick={() => onChange(o)} style={{ fontFamily: DATA, fontSize: 13, fontWeight: 600, padding: '7px 15px', borderRadius: 999, border: 'none', cursor: 'pointer', background: on ? cyan : 'transparent', color: on ? '#fff' : muted }}>{o}</button>;
      })}
    </div>
  );
}

/* ── Data table ──────────────────────────────────────────────────────── */
export interface Col<T> { key: string; label: string; align?: 'left' | 'right' | 'center'; width?: string; render: (row: T) => React.ReactNode }
export function DataTable<T>({ columns, rows, getKey, onRow }: { columns: Col<T>[]; rows: T[]; getKey: (r: T, i: number) => string; onRow?: (r: T) => void }) {
  return (
    <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: surfaceSoft }}>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: c.align ?? 'left', width: c.width, fontFamily: DATA, fontSize: 11, fontWeight: 700, color: faint, textTransform: 'uppercase', letterSpacing: '0.6px', padding: '11px 16px' }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={getKey(r, i)} onClick={() => onRow?.(r)} style={{ borderTop: '1px solid var(--sv-border)', cursor: onRow ? 'pointer' : 'default' }}>
              {columns.map((c) => (
                <td key={c.key} style={{ textAlign: c.align ?? 'left', fontFamily: DATA, fontSize: 13.5, color: body, padding: '13px 16px', verticalAlign: 'middle' }}>{c.render(r)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Health / progress pill ──────────────────────────────────────────── */
export function HealthBadge({ pct }: { pct: number }) {
  const c = pct >= 80 ? positive : pct >= 60 ? warning : negative;
  return <span style={{ fontFamily: DATA, fontSize: 12.5, fontWeight: 700, color: c, fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>;
}

/* ── Mini cyan line chart (smooth area) ──────────────────────────────── */
function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return pts.length ? `M${pts[0][0]},${pts[0][1]}` : '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d;
}
export function LineChart({ values, labels, height = 150 }: { values: number[]; labels?: string[]; height?: number }) {
  const W = 520, padX = 14, padTop = 14, padBot = labels ? 26 : 12;
  const max = Math.max(...values) * 1.12, min = Math.min(...values, 0);
  const x = (i: number) => padX + (i / Math.max(1, values.length - 1)) * (W - padX * 2);
  const y = (v: number) => padTop + (1 - (v - min) / (max - min || 1)) * (height - padTop - padBot);
  const pts = values.map((v, i) => [x(i), y(v)] as [number, number]);
  const d = smoothPath(pts);
  return (
    <svg viewBox={`0 0 ${W} ${height}`} width="100%" style={{ overflow: 'visible' }}>
      {[0, 0.5, 1].map((g) => { const yy = padTop + g * (height - padTop - padBot); return <line key={g} x1={padX} y1={yy} x2={W - padX} y2={yy} stroke="var(--sv-border)" strokeWidth="1" strokeDasharray="1,5" />; })}
      <path d={`${d} L${pts[pts.length - 1][0]},${height - padBot} L${pts[0][0]},${height - padBot} Z`} fill="var(--game-cyan)" fillOpacity="0.12" />
      <path d={d} fill="none" stroke="var(--game-cyan)" strokeWidth="2.5" strokeLinecap="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="var(--game-cyan)" stroke="#fff" strokeWidth="2" />)}
      {labels && labels.map((l, i) => <text key={l + i} x={x(i)} y={height - 8} textAnchor="middle" fontFamily={DATA} fontSize="10.5" fill="var(--game-text-muted)">{l}</text>)}
    </svg>
  );
}

/* ── Mini cyan bar chart (gradient bars, +/- supported) ──────────────── */
export function BarChart({ data, height = 180 }: { data: { label: string; value: number }[]; height?: number }) {
  const W = 520, padX = 16, padBot = 30, padTop = 18, mid = (height - padBot + padTop) / 2;
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.value)), 1) * 1.1;
  const bw = (W - padX * 2) / data.length;
  const zeroY = padTop + (height - padTop - padBot) / 2;
  const scale = (height - padTop - padBot) / 2 / maxAbs;
  return (
    <svg viewBox={`0 0 ${W} ${height}`} width="100%" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="adminBarPos" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00C1EB" /><stop offset="100%" stopColor="#00C1EB" stopOpacity="0.45" /></linearGradient>
        <linearGradient id="adminBarNeg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c65252" stopOpacity="0.55" /><stop offset="100%" stopColor="#c65252" /></linearGradient>
      </defs>
      <line x1={padX} y1={zeroY} x2={W - padX} y2={zeroY} stroke="var(--sv-border)" strokeWidth="1" />
      {data.map((d, i) => {
        const h = Math.abs(d.value) * scale;
        const cx = padX + i * bw + bw / 2;
        const barW = Math.min(46, bw * 0.5);
        const yTop = d.value >= 0 ? zeroY - h : zeroY;
        return (
          <g key={d.label}>
            <rect x={cx - barW / 2} y={yTop} width={barW} height={Math.max(2, h)} rx="5" fill={d.value >= 0 ? 'url(#adminBarPos)' : 'url(#adminBarNeg)'} />
            <text x={cx} y={d.value >= 0 ? yTop - 6 : yTop + h + 14} textAnchor="middle" fontFamily={DATA} fontSize="11" fontWeight="700" fill="var(--game-text)">{d.value >= 0 ? '' : '-'}${Math.abs(d.value).toLocaleString()}</text>
            <text x={cx} y={height - 8} textAnchor="middle" fontFamily={DATA} fontSize="10.5" fill="var(--game-text-muted)">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Small icon-tile (for block catalog etc.) ────────────────────────── */
export function IconTile({ icon, tone = 'cyan', size = 38 }: { icon: React.ReactNode; tone?: 'cyan' | 'neutral'; size?: number }) {
  return (
    <span style={{ width: size, height: size, borderRadius: 10, background: tone === 'cyan' ? cyanTint : surfaceSoft, color: tealMid, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{icon}</span>
  );
}
