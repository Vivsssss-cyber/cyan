import React, { useState } from 'react';
import { GridBackground } from './GridBackground';
import { PageTransition } from './PageTransition';
import { GameButton } from './GameButton';
import { PageActionBar } from './PageActionBar';
import { TabBar } from './TabBar';
import {
  ArrowUpRight, ArrowDownRight, ChevronRight, Download,
  AlertTriangle, Info, Heart, AlertCircle, Zap, Clock,
  Check, Copy, ExternalLink, Layers, Type, Palette,
  Box, Sliders, Play, Code2, LayoutGrid,
  // icons used in the game
  Users, Settings, Lightbulb, Package, Landmark, UserPlus, BarChart3,
  DollarSign, TrendingUp, TrendingDown, ShoppingCart, Truck,
  Coffee, Star, Bell, Home, Map, Phone, Mail, Search,
  Calendar, FileText, BarChart2, PieChart, Activity,
  Wifi, Battery, Cpu, Monitor, Smartphone, Tablet,
  Globe, Lock, Unlock, Eye, EyeOff, Share2, Upload,
  Trash2, Edit2, Plus, Minus, RefreshCw, RotateCcw,
  ChevronUp, ChevronDown, ChevronLeft, X, Menu,
  Sun, Cloud, Wind, Droplets, ThumbsUp, Award,
} from './PixelIcons';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from 'recharts';

const F = "'Outfit', sans-serif";

// ─── Tab navigation ───────────────────────────────────────────────
type Tab = 'foundations' | 'components' | 'motion' | 'tokens' | 'icons';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'foundations', label: 'Foundations', icon: <Layers size={14} /> },
  { id: 'components', label: 'Components', icon: <Box size={14} /> },
  { id: 'motion', label: 'Motion', icon: <Play size={14} /> },
  { id: 'tokens', label: 'Token Reference', icon: <Code2 size={14} /> },
  { id: 'icons', label: 'Icons', icon: <Zap size={14} /> },
];

// ─── Helpers ──────────────────────────────────────────────────────
function DSCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/60 rounded-2xl p-5 ${className}`} style={{ border: '1.4px solid white' }}>
      {children}
    </div>
  );
}

function SectionHead({ label, title, desc }: { label: string; title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="px-2 py-0.5 rounded bg-[#E0F7FF] text-[#006E85]"
          style={{ fontFamily: F, fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em' }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily: F, fontSize: '22px', fontWeight: 700, color: '#202326' }}>{title}</div>
      {desc && <p style={{ fontFamily: F, fontSize: '13px', color: '#606569', marginTop: 4 }}>{desc}</p>}
    </div>
  );
}

function CodeTag({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center gap-1.5 group">
      <code style={{
        fontFamily: "'Courier New', monospace", fontSize: '11px',
        background: '#F0F6FA', color: '#006E85', padding: '2px 6px',
        borderRadius: 5, border: '1px solid #C8DDE6',
      }}>{children}</code>
      <button onClick={copy} className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
        {copied ? <Check size={10} color="#156162" /> : <Copy size={10} color="#94A3B8" />}
      </button>
    </div>
  );
}

// ─── Color swatch ─────────────────────────────────────────────────
function Swatch({ hex, name, token, textDark = true }: { hex: string; name: string; token: string; textDark?: boolean }) {
  const [tip, setTip] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-14 rounded-xl cursor-pointer hover:scale-105 transition-transform relative"
        style={{ background: hex, border: '1px solid rgba(0,0,0,0.06)' }}
        onClick={() => { navigator.clipboard.writeText(hex); setTip(true); setTimeout(() => setTip(false), 1200); }}
      >
        {tip && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <Check size={16} color="white" />
          </div>
        )}
      </div>
      <div style={{ fontFamily: F, fontSize: '12px', fontWeight: 600, color: '#202326' }}>{name}</div>
      <div style={{ fontFamily: F, fontSize: '10px', color: '#606569', fontVariantNumeric: 'tabular-nums' }}>{hex}</div>
      <CodeTag>{token}</CodeTag>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// FOUNDATIONS TAB
// ─────────────────────────────────────────────────────────────────
function FoundationsTab() {
  const sparkData = [
    { x: 0, y: 40 }, { x: 1, y: 55 }, { x: 2, y: 45 }, { x: 3, y: 70 }, { x: 4, y: 60 }, { x: 5, y: 85 },
  ];

  const BRAND_COLORS = [
    { hex: '#00D2FF', name: 'Cyan Bright', token: '--cyan-primary' },
    { hex: '#00C1EB', name: 'Cyan Primary', token: '--cyan-mid' },
    { hex: '#00A0C2', name: 'Cyan Deep', token: '--cyan-deep' },
    { hex: '#006E85', name: 'Teal Mid', token: '--game-teal-mid' },
    { hex: '#005F58', name: 'Teal', token: '--game-teal' },
    { hex: '#003C49', name: 'Teal Dark', token: '--game-teal-dark' },
    { hex: '#002C33', name: 'Ink Dark', token: '--game-dark' },
  ];
  const SEMANTIC_COLORS = [
    { hex: '#156162', name: 'Positive', token: '--game-positive' },
    { hex: '#166534', name: 'Success', token: '--game-success' },
    { hex: '#c65252', name: 'Negative', token: '--game-negative' },
    { hex: '#C0392B', name: 'Destructive', token: '--destructive' },
    { hex: '#B45309', name: 'Warning', token: '--game-warning' },
    { hex: '#7C3AED', name: 'Purple Accent', token: '--chart-3' },
    { hex: '#4DB5B6', name: 'Teal Soft', token: 'retention' },
  ];
  const SURFACE_COLORS = [
    { hex: '#eff2f4', name: 'Canvas BG', token: '--background (grid)' },
    { hex: '#F0F6FA', name: 'Surface Muted', token: '--muted' },
    { hex: '#E0F7FF', name: 'Cyan Tint', token: '--cyan-tint' },
    { hex: '#C8DDE6', name: 'Border', token: '--border' },
    { hex: '#FFFFFF', name: 'Surface White', token: '--card' },
    { hex: 'rgba(255,255,255,0.6)', name: 'Glass Surface', token: '--game-surface' },
  ];
  const CHART_COLORS = [
    { hex: '#00C1EB', name: 'Chart 1', token: '--chart-1' },
    { hex: '#003D47', name: 'Chart 2', token: '--chart-2' },
    { hex: '#7C3AED', name: 'Chart 3', token: '--chart-3' },
    { hex: '#B45309', name: 'Chart 4', token: '--chart-4' },
    { hex: '#C0392B', name: 'Chart 5', token: '--chart-5' },
  ];

  const TYPE_SCALE = [
    { role: 'Page Display', size: '32px', weight: '700', lh: '1.2', ls: '-0.32px', sample: 'Monthly Operations' },
    { role: 'Heading 1', size: 'text-2xl ≈24px', weight: '800', lh: '1.2', ls: '-0.5px', sample: 'Startup Valley' },
    { role: 'Heading 2', size: 'text-xl ≈20px', weight: '800', lh: '1.3', ls: '-0.5px', sample: 'Design System' },
    { role: 'Heading 3', size: 'text-lg ≈18px', weight: '700', lh: '1.4', ls: '—', sample: 'Product Matrix' },
    { role: 'Heading 4', size: '16px', weight: '600', lh: '1.5', ls: '—', sample: 'Card Label' },
    { role: 'Body / Label', size: '14px', weight: '500', lh: '1.5', ls: '—', sample: 'Review results before the next purchase decision' },
    { role: 'Section Tag', size: '15px', weight: '700', lh: '1.4', ls: '—', sample: 'Financial Performance' },
    { role: 'Card Label', size: '12px', weight: '600', lh: '1.4', ls: '—', sample: 'Marketing Expense' },
    { role: 'Micro / Ref', size: '10–11px', weight: '700', lh: '1.4', ls: '0.05em', sample: 'PULSE STRIP · 15.10' },
    { role: 'Badge', size: '9–10px', weight: '700', lh: '1', ls: '1.5px', sample: 'STANDARD' },
  ];

  const SPACING = [
    { token: 'gap-3', px: '12px', usage: 'Card grids (Pulse strip, KPI ribbon)' },
    { token: 'gap-4', px: '16px', usage: 'Section grids (Quarterly view)' },
    { token: 'p-4', px: '16px', usage: 'Compact cards (Pulse strip)' },
    { token: 'p-5', px: '20px', usage: 'Standard cards (ALL content cards)' },
    { token: 'p-6', px: '24px', usage: 'Setup screens (input cards)' },
    { token: 'px-6', px: '24px', usage: 'Page horizontal padding' },
    { token: 'pb-24', px: '96px', usage: 'Page bottom scroll buffer' },
    { token: 'mb-3', px: '12px', usage: 'SectionLabel → first card gap' },
    { token: 'mb-6', px: '24px', usage: 'Between section blocks' },
    { token: 'space-y-2.5', px: '10px', usage: 'Product matrix row gap' },
  ];

  const RADIUS = [
    { name: 'radius-sm', value: '6px', calc: 'calc(var(--radius) - 4px)', usage: 'Small pills, tight badges' },
    { name: 'radius-md', value: '8px', calc: 'calc(var(--radius) - 2px)', usage: 'Input fields, dropdowns' },
    { name: 'radius-lg / base', value: '10px', calc: 'var(--radius)', usage: 'Default radius token' },
    { name: 'radius-xl', value: '14px', calc: 'calc(var(--radius) + 4px)', usage: 'Larger panels' },
    { name: 'rounded-xl', value: '12px', calc: 'Tailwind', usage: 'Toggle buttons, inner UI' },
    { name: 'game-card-radius', value: '16px', calc: 'rounded-2xl', usage: 'ALL content cards globally' },
    { name: 'rounded-3xl', value: '24px', calc: 'Tailwind', usage: 'Overlay / modal corners' },
    { name: 'radius-pill', value: '9999px', calc: 'rounded-full', usage: 'PrimaryCTA, GameButton pill' },
  ];

  const SHADOWS = [
    { name: 'Card Selected', values: '0px 2.5px 10px 0px rgba(77,181,182,0.29)', usage: 'Selected card state', token: '--game-card-selected-shadow' },
    { name: 'Card Default', values: '0px 3px 8px 0px rgba(0,0,0,0.06)', usage: 'User pill / subtle float', token: 'shadow (GameHeader pill)' },
    { name: 'Tooltip', values: '0 4px 12px rgba(0,0,0,0.10)', usage: 'Recharts tooltip, popovers', token: 'shadow-tooltip' },
    { name: 'Overlay', values: 'Tailwind shadow-2xl', usage: 'DecisionOverlay modal', token: 'shadow-2xl' },
    { name: 'CTA Inset', values: 'inset 0px 0px 8px 1px rgba(20,20,20,0.50)', usage: 'GameButton inner depth', token: 'shadow-inset-cta' },
    { name: 'Button Hover', values: 'Tailwind shadow-lg', usage: 'GameButton on hover', token: 'hover:shadow-lg' },
  ];

  return (
    <div className="space-y-12">

      {/* ── COLORS ──────────────────────────────── */}
      <section>
        <SectionHead label="FOUNDATIONS · 01" title="Color Primitives" desc="Click any swatch to copy the hex value to clipboard." />

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette size={13} color="#006E85" />
              <span style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#202326' }}>Brand Palette — Cyan / Teal Scale</span>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {BRAND_COLORS.map(c => <Swatch key={c.token} {...c} />)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={13} color="#B45309" />
              <span style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#202326' }}>Semantic States</span>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {SEMANTIC_COLORS.map(c => <Swatch key={c.token} {...c} />)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid size={13} color="#94A3B8" />
              <span style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#202326' }}>Surface & Border</span>
            </div>
            <div className="grid grid-cols-6 gap-3">
              {SURFACE_COLORS.map(c => <Swatch key={c.name} {...c} />)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid size={13} color="#7C3AED" />
              <span style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#202326' }}>Data Visualization — 5 Chart Slots</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {CHART_COLORS.map(c => <Swatch key={c.token} {...c} />)}
            </div>
          </div>

          {/* Gradients showcase */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers size={13} color="#006E85" />
              <span style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#202326' }}>Gradients</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="h-16 rounded-xl mb-2" style={{ background: 'linear-gradient(to bottom right, #006E85, #003D47)' }} />
                <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#202326' }}>gradient-strategic</div>
                <div style={{ fontFamily: F, fontSize: '10px', color: '#606569' }}>#006E85 → #003D47 · to-br</div>
                <div style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8' }}>Strategic Summary card, Decision Overlay header</div>
              </div>
              <div>
                <div className="h-16 rounded-xl mb-2" style={{ background: 'linear-gradient(to right, #F0F9FC, #FFFFFF)' }} />
                <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#202326' }}>gradient-report-strip</div>
                <div style={{ fontFamily: F, fontSize: '10px', color: '#606569' }}>#F0F9FC → #FFFFFF · to-r</div>
                <div style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8' }}>Monthly Reporting View (15.11)</div>
              </div>
              <div>
                <div className="h-16 rounded-xl mb-2 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', border: '1.4px solid white' }}>
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(to right, #232323 1px, transparent 1px), linear-gradient(to bottom, #232323 1px, transparent 1px)',
                    backgroundSize: '12px 12px',
                  }} />
                  <div className="relative flex items-center justify-center h-full" style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85' }}>
                    Glass Surface
                  </div>
                </div>
                <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#202326' }}>Glass / Glassmorphism</div>
                <div style={{ fontFamily: F, fontSize: '10px', color: '#606569' }}>rgba(255,255,255,0.60) + border 1.4px white</div>
                <div style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8' }}>ALL content cards globally</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TYPOGRAPHY ──────────────────────────── */}
      <section>
        <SectionHead label="FOUNDATIONS · 02" title="Typography Scale" desc="Outfit replaces Inter as the primary typeface across all surfaces. fontVariantNumeric: 'tabular-nums' is enforced on all KPI values." />

        <DSCard>
          <div className="mb-4 p-3 rounded-lg bg-[#E0F7FF] flex items-center gap-3">
            <Type size={16} color="#006E85" />
            <div>
              <div style={{ fontFamily: F, fontSize: '13px', fontWeight: 700, color: '#006E85' }}>
                Font Family: 'Outfit', system-ui, -apple-system, sans-serif
              </div>
              <div style={{ fontFamily: F, fontSize: '11px', color: '#006E85', opacity: 0.8 }}>
                Loaded via Google Fonts CDN · Weights: 400, 500, 600, 700, 800, 900
              </div>
            </div>
          </div>

          <div className="space-y-px">
            {/* Header row */}
            <div className="grid grid-cols-[200px_1fr] gap-4 pb-2 mb-2" style={{ borderBottom: '1px solid #C8DDE6' }}>
              {['Role + Token', 'Live Example · Size / Weight / Line-Height / Letter-Spacing'].map(h => (
                <div key={h} style={{ fontFamily: F, fontSize: '10px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em' }}>{h}</div>
              ))}
            </div>
            {TYPE_SCALE.map((t, i) => (
              <div key={i} className="grid grid-cols-[200px_1fr] gap-4 py-3 hover:bg-[#F0F9FC] rounded-lg px-2 transition-colors">
                <div>
                  <div style={{ fontFamily: F, fontSize: '12px', fontWeight: 600, color: '#202326' }}>{t.role}</div>
                  <div style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8', marginTop: 2 }}>{t.size} · w{t.weight} · lh {t.lh} {t.ls !== '—' ? `· ls ${t.ls}` : ''}</div>
                </div>
                <div style={{
                  fontFamily: F,
                  fontSize: t.size.includes('px') ? t.size.replace('≈', '').split(' ')[0] : undefined,
                  fontWeight: parseInt(t.weight),
                  color: '#202326',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {t.sample}
                </div>
              </div>
            ))}
          </div>
        </DSCard>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 8 }}>TABULAR NUMS</div>
            <div className="space-y-1">
              {['$124,500', '19.6%', '3,488', '+18.4%', '6.1 mo'].map(v => (
                <div key={v} style={{ fontFamily: F, fontSize: '24px', fontWeight: 700, color: '#202326', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
              ))}
            </div>
            <div style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8', marginTop: 8 }}>fontVariantNumeric: 'tabular-nums' · All KPIs</div>
          </DSCard>
          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 8 }}>EYEBROW / REF TAGS</div>
            <div className="space-y-3">
              {[
                { text: 'COMMAND CENTER', bg: '#E0F7FF', color: '#006E85' },
                { text: 'PULSE STRIP', bg: '#E0F7FF', color: '#006E85' },
                { text: '15.1–15.3', bg: '#E0F7FF', color: '#006E85' },
                { text: 'WEAKEST LINK', bg: '#FEE2E2', color: '#c65252' },
                { text: '17.11 · STRATEGIC SUMMARY', bg: 'transparent', color: 'white' },
              ].map(tag => (
                <span key={tag.text} className="inline-block px-2 py-0.5 rounded"
                  style={{ fontFamily: F, fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', background: tag.bg || '#002C33', color: tag.color }}>
                  {tag.text}
                </span>
              ))}
            </div>
          </DSCard>
          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 8 }}>FONT WEIGHTS</div>
            <div className="space-y-2">
              {[400, 500, 600, 700, 800, 900].map(w => (
                <div key={w} className="flex items-center gap-3">
                  <span style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8', width: 28 }}>{w}</span>
                  <span style={{ fontFamily: F, fontSize: '15px', fontWeight: w, color: '#202326' }}>Outfit {w}</span>
                </div>
              ))}
            </div>
          </DSCard>
        </div>
      </section>

      {/* ── SPACING ─────────────────────────────── */}
      <section>
        <SectionHead label="FOUNDATIONS · 03" title="Spatial Rhythm & Spacing" desc="All spacing follows Tailwind's 4px base grid. Key values enforced globally." />
        <DSCard>
          <div className="space-y-px">
            <div className="grid grid-cols-[120px_80px_1fr] gap-4 pb-2 mb-2" style={{ borderBottom: '1px solid #C8DDE6' }}>
              {['Token', 'Value', 'Usage Context'].map(h => (
                <div key={h} style={{ fontFamily: F, fontSize: '10px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em' }}>{h}</div>
              ))}
            </div>
            {SPACING.map((s, i) => (
              <div key={i} className="grid grid-cols-[120px_80px_1fr] gap-4 py-2.5 hover:bg-[#F0F9FC] rounded-lg px-2 transition-colors items-center">
                <CodeTag>{s.token}</CodeTag>
                <span style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#202326', fontVariantNumeric: 'tabular-nums' }}>{s.px}</span>
                <span style={{ fontFamily: F, fontSize: '12px', color: '#606569' }}>{s.usage}</span>
              </div>
            ))}
          </div>
        </DSCard>

        <div className="mt-4 grid grid-cols-5 gap-3">
          {[{ t: 'p-4', px: 16 }, { t: 'p-5', px: 20 }, { t: 'p-6', px: 24 }, { t: 'gap-3', px: 12 }, { t: 'gap-4', px: 16 }].map(s => (
            <DSCard key={s.t} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-[#E0F7FF] relative" style={{ width: s.px * 2, height: s.px * 2, borderRadius: 4 }}>
                  <div className="absolute inset-0 flex items-center justify-center" style={{ fontFamily: F, fontSize: '10px', fontWeight: 700, color: '#006E85' }}>
                    {s.px}px
                  </div>
                </div>
              </div>
              <CodeTag>{s.t}</CodeTag>
            </DSCard>
          ))}
        </div>
      </section>

      {/* ── RADIUS ──────────────────────────────── */}
      <section>
        <SectionHead label="FOUNDATIONS · 04" title="Border Radius" desc="All cards use rounded-2xl (16px). Buttons use pill (9999px)." />
        <div className="grid grid-cols-4 gap-4">
          {RADIUS.map(r => (
            <DSCard key={r.name}>
              <div className="h-14 bg-[#E0F7FF] mb-3" style={{ borderRadius: r.value === '9999px' ? 9999 : parseInt(r.value) }} />
              <div style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#202326', marginBottom: 2 }}>{r.name}</div>
              <div style={{ fontFamily: F, fontSize: '14px', fontWeight: 800, color: '#006E85', fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>{r.value}</div>
              <div style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8' }}>{r.usage}</div>
            </DSCard>
          ))}
        </div>
      </section>

      {/* ── SHADOWS ─────────────────────────────── */}
      <section>
        <SectionHead label="FOUNDATIONS · 05" title="Elevation & Shadows" desc="6 verified shadow layers. All values source-verified from component styles." />
        <div className="grid grid-cols-3 gap-4">
          {SHADOWS.map(s => (
            <DSCard key={s.name}>
              <div className="h-16 bg-white rounded-xl mb-3 flex items-center justify-center" style={{ boxShadow: s.values.includes('Tailwind') ? undefined : s.values }}>
                <span style={{ fontFamily: F, fontSize: '11px', color: '#94A3B8' }}>Surface</span>
              </div>
              <div style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#202326', marginBottom: 2 }}>{s.name}</div>
              <div style={{ fontFamily: F, fontSize: '10px', color: '#606569', marginBottom: 4 }}>{s.values}</div>
              <CodeTag>{s.token}</CodeTag>
            </DSCard>
          ))}
        </div>
      </section>

      {/* ── GRID TEXTURE ────────────────────────── */}
      <section>
        <SectionHead label="FOUNDATIONS · 06" title="Background Effects" />
        <div className="grid grid-cols-3 gap-4">
          <DSCard>
            <div className="h-24 rounded-xl mb-3 relative overflow-hidden" style={{ background: '#eff2f4' }}>
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(to right, #232323 1px, transparent 1px), linear-gradient(to bottom, #232323 1px, transparent 1px)',
                backgroundSize: '20px 20px', opacity: 0.05,
              }} />
            </div>
            <div style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#202326', marginBottom: 2 }}>Grid Texture</div>
            <div style={{ fontFamily: F, fontSize: '10px', color: '#606569' }}>Background: #eff2f4 · Grid: #232323 · Size: 63×63px · Opacity: 0.03</div>
          </DSCard>
          <DSCard>
            <div className="h-24 rounded-xl mb-3 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', border: '1.4px solid white' }}>
              <span style={{ fontFamily: F, fontSize: '13px', fontWeight: 700, color: '#202326' }}>Glass Card</span>
            </div>
            <div style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#202326', marginBottom: 2 }}>Glassmorphism</div>
            <div style={{ fontFamily: F, fontSize: '10px', color: '#606569' }}>bg: rgba(255,255,255,0.60) · border: 1.4px solid white · All content cards</div>
          </DSCard>
          <DSCard>
            <div className="h-24 rounded-xl mb-3 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
              <span style={{ fontFamily: F, fontSize: '13px', fontWeight: 700, color: 'white' }}>Overlay Scrim</span>
            </div>
            <div style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#202326', marginBottom: 2 }}>Overlay Scrim</div>
            <div style={{ fontFamily: F, fontSize: '10px', color: '#606569' }}>bg-black/40 + backdrop-blur-sm · DecisionOverlay, Modals</div>
          </DSCard>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTS TAB
// ─────────────────────────────────────────────────────────────────
function ComponentsTab() {
  const [sliderVal, setSliderVal] = useState(18000);
  const sparkData = [
    { x: 0, y: 48000 }, { x: 1, y: 72000 }, { x: 2, y: 99200 },
  ];
  const barData = [
    { m: 'M1', v: 62 }, { m: 'M2', v: 69 }, { m: 'M3', v: 74 },
  ];

  return (
    <div className="space-y-12">

      {/* ── BUTTONS ─────────────────────────────── */}
      <section>
        <SectionHead label="COMPONENTS · 01" title="Buttons" desc="3 button roles. GameButton uses radial gradient SVG background. All share Outfit 500 16px." />
        <div className="grid grid-cols-2 gap-4">
          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>GameButton — PRIMARY CTA</div>
            <div className="space-y-3">
              <div className="w-64"><GameButton onClick={() => {}}>Proceed to Purchase Goods</GameButton></div>
              <div className="w-64"><GameButton onClick={() => {}} disabled>Disabled State</GameButton></div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-[#F0F9FC]">
              <div style={{ fontFamily: F, fontSize: '10px', fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>ANATOMY</div>
              <div className="space-y-1">
                {[
                  'Border-radius: 43px (pill)',
                  'Background: linear-gradient(180deg, #00B1D6 -180.36%, #0090AD 105.36%)',
                  'Outer padding: 1px 4px · Inner: py-3 px-5',
                  'Arrow icon: white/20 bg pill 28×28px',
                  'Font: Outfit 600 15px white',
                  'Hover: shadow-lg · Active: -translate-y-px',
                ].map(a => (
                  <div key={a} style={{ fontFamily: F, fontSize: '11px', color: '#606569' }}>· {a}</div>
                ))}
              </div>
            </div>
          </DSCard>

          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>GameButton — SECONDARY + PrimaryCTA variants</div>
            <div className="space-y-3">
              <button className="w-64 py-4 px-6 rounded-full border border-[#d1d5db] bg-white text-[#202326] hover:bg-gray-50 cursor-pointer"
                style={{ fontFamily: F, fontWeight: 500, fontSize: '16px' }}>
                Secondary Button
              </button>
              <button className="w-64 py-3.5 px-8 rounded-full bg-[#00C1EB] text-white hover:bg-[#0090AD] cursor-pointer uppercase tracking-wider"
                style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1.5px', fontFamily: F }}>
                PrimaryCTA default
              </button>
              <button className="w-64 py-3.5 px-8 rounded-full bg-white text-[#002C33] hover:bg-gray-100 cursor-pointer uppercase tracking-wider"
                style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1.5px', fontFamily: F }}>
                PrimaryCTA dark
              </button>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-white border border-[#C8DDE6] flex items-center gap-1.5 text-[#006E85] hover:bg-[#F0F9FC] cursor-pointer"
                  style={{ fontFamily: F, fontSize: '12px', fontWeight: 600 }}>
                  <Download size={13} /> Download
                </button>
                <button className="px-3 py-2 rounded-lg bg-[#006E85] text-white flex items-center gap-1.5 cursor-pointer hover:bg-[#005F58]"
                  style={{ fontFamily: F, fontSize: '12px', fontWeight: 600 }}>
                  Expand <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </DSCard>

          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>ToggleBtn — Mode Switcher</div>
            <div className="flex bg-[#F0F6FA] rounded-xl p-1 w-fit" style={{ border: '1.4px solid white' }}>
              {['Monthly View', 'Quarterly Mode'].map((label, i) => (
                <button key={label}
                  className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${i === 0 ? 'bg-[#006E85] text-white shadow-sm' : 'text-[#606569] hover:text-[#202326]'}`}
                  style={{ fontFamily: F, fontSize: '13px', fontWeight: 600 }}>
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg bg-[#F0F9FC]">
              <div style={{ fontFamily: F, fontSize: '11px', color: '#606569' }}>Active: bg-[#006E85] text-white shadow-sm · Inactive: text-[#606569] hover:text-[#202326] · Container: bg-white/60 rounded-xl p-1</div>
            </div>
          </DSCard>

          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>Icon Buttons & Inline CTAs</div>
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-[#006E85] cursor-pointer" style={{ fontFamily: F, fontSize: '13px', fontWeight: 700 }}>
                Open Ledger <ChevronRight size={14} />
              </div>
              <div className="flex items-center gap-2 mt-2">
                {[
                  { label: 'Positive', color: '#156162', icon: <ArrowUpRight size={12} color="#156162" /> },
                  { label: 'Negative', color: '#c65252', icon: <ArrowDownRight size={12} color="#c65252" /> },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-1">
                    {b.icon}
                    <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: b.color }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </DSCard>
        </div>
      </section>

      {/* ── BADGES & TAGS ───────────────────────── */}
      <section>
        <SectionHead label="COMPONENTS · 02" title="Badges & Tags" desc="7 Badge variants + ImpactTag, TimingBadge, SectionLabel ref tags, SegBadge." />
        <div className="grid grid-cols-2 gap-4">
          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>Badge — 7 Variants</div>
            <div className="flex flex-wrap gap-2">
              {[
                { v: 'public', bg: '#00A0C2', label: 'PUBLIC' },
                { v: 'private', bg: '#003D47', label: 'PRIVATE' },
                { v: 'facilitator', bg: '#D4590A', label: 'FACILITATOR' },
                { v: 'value', bg: '#475569', label: 'VALUE' },
                { v: 'standard', bg: '#006E85', label: 'STANDARD' },
                { v: 'premium', bg: '#1e293b', label: 'PREMIUM' },
                { v: 'custom', bg: '#7C3AED', label: 'CUSTOM' },
              ].map(b => (
                <span key={b.v} className="inline-block text-white uppercase px-2 py-0.5 rounded"
                  style={{ background: b.bg, fontSize: '0.6rem', letterSpacing: '1.5px', fontWeight: 700, fontFamily: F }}>
                  {b.label}
                </span>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg bg-[#F0F9FC]">
              <div style={{ fontFamily: F, fontSize: '10px', color: '#606569' }}>font-size: 0.6rem · font-weight: 700 · letter-spacing: 1.5px · uppercase · color: white</div>
            </div>
          </DSCard>

          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>ImpactTag, TimingBadge, Status Pills</div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-block bg-[#E0F7FF] text-[#006E85] px-2 py-0.5 rounded" style={{ fontSize: '0.65rem', fontWeight: 600, fontFamily: F }}>Impact Tag</span>
              <span className="inline-block bg-[#E0F7FF] text-[#006E85] px-2 py-0.5 rounded" style={{ fontSize: '0.65rem', fontWeight: 600, fontFamily: F }}>⚡ Effect: This Week</span>
              <span className="inline-block bg-[#FEF3C7] text-[#B45309] px-2 py-0.5 rounded" style={{ fontSize: '0.65rem', fontWeight: 600, fontFamily: F }}>🕐 Effect: Week +4</span>
              <span className="inline-block bg-[#D1FAE5] text-[#156162] px-2 py-0.5 rounded" style={{ fontSize: '11px', fontWeight: 700, fontFamily: F }}>+13</span>
              <span className="inline-block bg-[#FEE2E2] text-[#c65252] px-2 py-0.5 rounded" style={{ fontSize: '10px', fontWeight: 700, fontFamily: F }}>WEAKEST LINK</span>
            </div>
            <div className="mt-3">
              <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: 6 }}>SegBadge (Customer Pulse sub-badges)</div>
              <div className="flex gap-1">
                {[
                  { label: 'Value', score: 82, active: false },
                  { label: 'Balanced', score: 91, active: true },
                  { label: 'Premium', score: 74, active: false },
                ].map(s => (
                  <div key={s.label} className="px-1.5 py-0.5 rounded"
                    style={{ fontFamily: F, fontSize: '9px', fontWeight: 700, background: s.active ? '#006E85' : '#F0F6FA', color: s.active ? 'white' : '#606569' }}>
                    {s.label} {s.score}
                  </div>
                ))}
              </div>
            </div>
          </DSCard>

          <DSCard className="col-span-2">
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>SectionLabel — Anatomy</div>
            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-[#F0F9FC]">
              <span className="px-2 py-0.5 rounded bg-[#E0F7FF] text-[#006E85]" style={{ fontFamily: F, fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>15.1–15.3</span>
              <div style={{ fontFamily: F, fontSize: '15px', fontWeight: 700, color: '#202326' }}>Financial Performance</div>
              <span className="group relative inline-flex items-center cursor-help">
                <Info size={13} color="#94A3B8" />
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4" style={{ fontSize: '11px', fontFamily: F, color: '#606569' }}>
              <div>① Ref tag: px-2 py-0.5 · bg-[#E0F7FF] · text-[#006E85] · rounded · 10px 700 ls:0.05em</div>
              <div>② Title: 15px 700 text-[#202326]</div>
              <div>③ Info icon: 13px #94A3B8 · hover tooltip: bg-[#202326] white 11px</div>
            </div>
          </DSCard>
        </div>
      </section>

      {/* ── CARDS ───────────────────────────────── */}
      <section>
        <SectionHead label="COMPONENTS · 03" title="Cards & Surfaces" desc="All content cards share: bg-white/60 rounded-2xl p-5 border-1.4px-white. Variants differ by accent, gradient, and border-left." />
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Standard Glass Card</div>
            <div style={{ fontFamily: F, fontSize: '12px', color: '#606569' }}>bg-white/60 · rounded-2xl · p-5 · border: 1.4px solid white</div>
          </div>
          <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Ribbon KPI Card (left-accent deprecated)</div>
            <div style={{ fontFamily: F, fontSize: '12px', color: '#606569' }}>Left-accent variants are deprecated — use standard card styling and token-driven accents instead.</div>
          </div>
          <div className="rounded-2xl p-5" style={{ border: '1.4px solid rgba(21,97,98,0.33)', boxShadow: '0px 2.5px 10px 0px rgba(77,181,182,0.29)', background: 'rgba(255,255,255,0.6)' }}>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Selected Card State</div>
            <div style={{ fontFamily: F, fontSize: '12px', color: '#606569' }}>border: 1.4px solid rgba(21,97,98,0.33) · shadow: rgba(77,181,182,0.29)</div>
          </div>
          <div className="rounded-2xl p-5 text-white relative overflow-hidden col-span-2"
            style={{ background: 'linear-gradient(to bottom right, #006E85, #003D47)' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
            <div className="absolute right-10 bottom-4 w-20 h-20 rounded-full bg-white/5" />
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }} className="relative z-10">STRATEGIC SUMMARY CARD</div>
            <div style={{ fontFamily: F, fontSize: '18px', fontWeight: 700, marginBottom: 6 }} className="relative z-10">gradient-strategic variant</div>
            <div style={{ fontFamily: F, fontSize: '12px', opacity: 0.9, lineHeight: 1.55 }} className="relative z-10">bg-gradient-to-br from-[#006E85] to-[#003D47] · Decorative circles: w-32/20 h-32/20 bg-white/5 · text-white</div>
          </div>
          <div className="rounded-2xl p-5" style={{ border: '1.4px solid white', background: 'linear-gradient(to right, #F0F9FC, #FFFFFF)' }}>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Report Strip Card</div>
            <div style={{ fontFamily: F, fontSize: '12px', color: '#606569' }}>bg-gradient-to-r from-[#F0F9FC] to-white · Monthly 15.11 block</div>
          </div>
          <div className="rounded-2xl p-5" style={{ border: '1.4px solid #c65252', background: 'rgba(254, 226, 226, 0.9)' }}>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#c65252', marginBottom: 8 }}>Danger State Card (Runway &lt; 3mo)</div>
            <div style={{ fontFamily: F, fontSize: '12px', color: '#606569' }}>border: 1.4px solid #c65252 · bg: rgba(254,226,226,0.9) · animate-pulse</div>
          </div>
        </div>
      </section>

      {/* ── KPI DISPLAYS ────────────────────────── */}
      <section>
        <SectionHead label="COMPONENTS · 04" title="KPI Displays" desc="RibbonKpi, SparkCard, CashStep bridge, PulseStrip cards — all use fontVariantNumeric: tabular-nums." />
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Revenue', value: '$99,200', delta: '+18.4%', positive: true, accent: '#006E85' },
            { label: 'Cost', value: '$79,700', delta: '+8.2%', positive: false, accent: '#c65252' },
            { label: 'Margin', value: '19.6%', delta: '+4.1pts', positive: true, accent: '#156162' },
          ].map(k => (
            <div key={k.label} className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
              <div style={{ fontFamily: F, fontSize: '12px', color: '#606569', marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: '26px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
              <div className="flex items-center gap-1">
                {k.positive ? <ArrowUpRight size={12} color="#156162" /> : <ArrowDownRight size={12} color="#c65252" />}
                <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: k.positive ? '#156162' : '#c65252' }}>{k.delta}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { title: 'Revenue', n: '17.1', value: '$219k', delta: '+106% QoQ', positive: true, accent: '#006E85' },
            { title: 'Margin', n: '17.2', value: '19.6%', delta: '+27.9 pts', positive: true, accent: '#156162' },
            { title: 'Retention', n: '17.3', value: '86%', delta: '+14 pts', positive: true, accent: '#4DB5B6' },
            { title: 'Footfall', n: '17.4', value: '3,488', delta: '+45.5%', positive: true, accent: '#00C1EB' },
          ].map(s => (
            <div key={s.title} className="bg-white/60 rounded-2xl p-4" style={{ border: '1.4px solid white' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#606569]" style={{ fontFamily: F, fontSize: '12px', fontWeight: 600 }}>{s.title}</span>
                <span className="text-[#94A3B8]" style={{ fontSize: '10px' }}>{s.n}</span>
              </div>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: '22px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
              <div className="flex items-center gap-1 mb-1">
                <ArrowUpRight size={11} color="#156162" />
                <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#156162' }}>{s.delta}</span>
              </div>
              <ResponsiveContainer width="100%" height={36}>
                <LineChart data={sparkData}>
                  <Line type="monotone" dataKey="y" stroke={s.accent} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>

        <DSCard>
          <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>Cash Movement Bridge (15.10)</div>
          <div className="flex items-center justify-between">
            {[
              { label: 'Opening', value: '$145,000', color: '#606569', bold: false },
              null,
              { label: 'Inflow', value: '+$99,200', color: '#156162', bold: false },
              null,
              { label: 'Outflow', value: '-$119,700', color: '#c65252', bold: false },
              null,
              { label: 'Closing', value: '$124,500', color: '#006E85', bold: true },
            ].map((step, i) =>
              step === null
                ? <ChevronRight key={i} size={18} color="#94A3B8" />
                : (
                  <div key={step.label} className="flex-1 text-center">
                    <div className="text-[#606569] mb-1" style={{ fontFamily: F, fontSize: '11px' }}>{step.label}</div>
                    <div style={{ fontFamily: F, fontWeight: step.bold ? 700 : 600, fontSize: step.bold ? '22px' : '18px', color: step.color, fontVariantNumeric: 'tabular-nums' }}>{step.value}</div>
                  </div>
                )
            )}
          </div>
        </DSCard>
      </section>

      {/* ── DATA VIZ ────────────────────────────── */}
      <section>
        <SectionHead label="COMPONENTS · 05" title="Data Visualization" desc="5-slot chart palette. Recharts with custom Tooltip style. 3 chart types in use." />
        <div className="grid grid-cols-3 gap-4">
          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 8 }}>LineChart — Workforce Trends</div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={[{ m: 'M1', s: 62, t: 18 }, { m: 'M2', s: 69, t: 14 }, { m: 'M3', s: 74, t: 11 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: F }} />
                <Line type="monotone" dataKey="s" stroke="#006E85" strokeWidth={2.5} dot={{ r: 3 }} name="Satisfaction" />
                <Line type="monotone" dataKey="t" stroke="#c65252" strokeWidth={2.5} dot={{ r: 3 }} name="Turnover" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8', marginTop: 4 }}>strokeWidth: 2.5 · dot r:4 · Tooltip: radius 12px no-border shadow-lg</div>
          </DSCard>

          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 8 }}>AreaChart — System Loss</div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={[{ m: 'M1', w: 9.8, p: 3.2 }, { m: 'M2', w: 8.9, p: 2.6 }, { m: 'M3', w: 8.4, p: 2.1 }]}>
                <defs>
                  <linearGradient id="wG2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B45309" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#B45309" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pG2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c65252" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#c65252" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: F }} />
                <Area type="monotone" dataKey="w" stroke="#B45309" strokeWidth={2} fill="url(#wG2)" name="Waste %" />
                <Area type="monotone" dataKey="p" stroke="#c65252" strokeWidth={2} fill="url(#pG2)" name="Phantom %" />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8', marginTop: 4 }}>linearGradient: 5%→95% opacity 0.2→0 · strokeWidth 2</div>
          </DSCard>

          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 8 }}>SVG Components — Gauge & Circle</div>
            <div className="flex gap-6 items-center justify-center py-2">
              {/* Semi-gauge */}
              <div className="relative flex items-center justify-center" style={{ height: 60 }}>
                <svg width="90" height="52" viewBox="0 0 90 48">
                  <path d="M 8 42 A 34 34 0 0 1 82 42" stroke="#F0F6FA" strokeWidth="8" fill="none" strokeLinecap="round" />
                  <path d="M 8 42 A 34 34 0 0 1 82 42" stroke="#B45309" strokeWidth="8" fill="none" strokeLinecap="round"
                    strokeDasharray={`${(78 / 100) * Math.PI * 34} ${Math.PI * 34}`} />
                </svg>
                <div className="absolute bottom-0" style={{ fontFamily: F, fontWeight: 700, fontSize: '14px', color: '#B45309', fontVariantNumeric: 'tabular-nums' }}>78%</div>
              </div>
              {/* Circle gauge */}
              <div className="relative">
                <svg width="100" height="100" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="58" stroke="#F0F6FA" strokeWidth="14" fill="none" />
                  <circle cx="70" cy="70" r="58" stroke="#006E85" strokeWidth="14" fill="none"
                    strokeDasharray={`${(68 / 100) * 364} 364`} strokeLinecap="round" transform="rotate(-90 70 70)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: '20px', color: '#006E85', fontVariantNumeric: 'tabular-nums' }}>68</div>
                  <div style={{ fontFamily: F, fontSize: '9px', color: '#94A3B8' }}>/ 100</div>
                </div>
              </div>
            </div>
            <div style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8', marginTop: 4 }}>Semi-gauge: SVG arc · Circle: SVG circle strokeDasharray · Both: fontVariantNumeric tabular-nums</div>
          </DSCard>

          <DSCard className="col-span-3">
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>Progress Bar — Sold vs Unsold (15.4 / 15.5)</div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#202326' }}>Stock Integrity</span>
                  <span style={{ fontFamily: F, fontSize: '11px', color: '#94A3B8' }}>3,840 sold · 620 unsold</span>
                </div>
                <div className="h-3 rounded-full bg-[#F0F6FA] overflow-hidden flex">
                  <div className="h-full bg-[#006E85]" style={{ width: `${(3840 / 4460) * 100}%` }} />
                  <div className="h-full bg-[#B45309]" style={{ width: `${(620 / 4460) * 100}%` }} />
                </div>
                <div className="flex gap-4 mt-1">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#006E85]" /><span style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8' }}>Sold 86%</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#B45309]" /><span style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8' }}>Unsold 14%</span></div>
                </div>
              </div>
              <div>
                <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#202326', marginBottom: 4 }}>Product Score Bars (color logic)</div>
                <div className="space-y-2">
                  {[{ name: 'Signature Bowl', score: 94 }, { name: 'Veggie Wrap', score: 76 }, { name: 'Dessert Jar', score: 52 }, { name: 'Spicy Noodle', score: 31 }].map(p => {
                    const isWeakest = p.score === 31;
                    return (
                      <div key={p.name} className="flex items-center gap-3">
                        <span style={{ fontFamily: F, fontSize: '11px', width: 120, color: '#202326', fontWeight: 600 }}>{p.name}</span>
                        <div className="flex-1 h-2 bg-[#F0F6FA] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${p.score}%`, background: isWeakest ? '#c65252' : p.score > 70 ? '#006E85' : '#B45309' }} />
                        </div>
                        <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, width: 28, color: '#202326', fontVariantNumeric: 'tabular-nums' }}>{p.score}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8', marginTop: 6 }}>Color logic: score &gt; 70 → #006E85 · 40–70 → #B45309 · weakest-link → #c65252</div>
              </div>
            </div>
          </DSCard>
        </div>
      </section>

      {/* ── FORMS ───────────────────────────────── */}
      <section>
        <SectionHead label="COMPONENTS · 06" title="Forms & Inputs" desc="Range slider with custom thumb. What-If Action Hub pattern." />
        <div className="grid grid-cols-2 gap-4">
          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>WhatIfSlider — Range Input</div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#606569' }}>Extra Marketing Spend</span>
                <span style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: sliderVal > 0 ? '#c65252' : '#202326', fontVariantNumeric: 'tabular-nums' }}>
                  +${sliderVal.toLocaleString()}
                </span>
              </div>
              <input type="range" min={0} max={50000} step={1000} value={sliderVal}
                onChange={e => setSliderVal(Number(e.target.value))}
                className="w-full accent-[#006E85] cursor-pointer" />
            </div>
            <div className="mt-4 p-3 rounded-lg bg-[#F0F9FC]">
              <div style={{ fontFamily: F, fontSize: '10px', color: '#606569' }}>Thumb: 18×18px · radius 50% · bg #00C1EB · border 3px white · shadow 0 1px 4px rgba(0,0,0,0.2) · accent-[#006E85]</div>
            </div>
          </DSCard>
          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>What-If Action Hub Container</div>
            <div className="bg-white/60 rounded-2xl p-4" style={{ border: '1.4px solid white' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#202326' }}>What-If Action Hub</div>
                  <div style={{ fontFamily: F, fontSize: '11px', color: '#606569' }}>Drag sliders to preview impact.</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Extra Marketing Spend', 'Extra Purchase Goods'].map(label => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#606569' }}>{label}</span>
                      <span style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#202326', fontVariantNumeric: 'tabular-nums' }}>+$0</span>
                    </div>
                    <input type="range" min={0} max={50000} step={1000} defaultValue={0} className="w-full accent-[#006E85] cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          </DSCard>
        </div>
      </section>

      {/* ── PAGE ACTION BAR ─────────────────────── */}
      <section>
        <SectionHead label="COMPONENTS · 07" title="PageActionBar" desc="Glass pill holding primary + ghost actions. Always right-aligned in the page header row. Source: Figma 7135-41591." />
        <div className="grid grid-cols-2 gap-4">
          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>Live Preview</div>
            <PageActionBar actions={[{ label: 'Report', variant: 'primary' }, { label: 'Decisions', variant: 'ghost' }]} />
            <div className="mt-4 p-3 rounded-lg bg-[#F0F9FC] space-y-1">
              {[
                'Container: rgba(255,255,255,0.6) · border: 1px solid white · borderRadius: 70px · padding: 4px 8px',
                'Primary: gradient(180deg, #00B1D6 → #0090AD) · borderRadius: 30px · Outfit 500 12px white',
                'Ghost: transparent · #212121 · borderRadius: 40px · Outfit 500 12px',
              ].map(a => <div key={a} style={{ fontFamily: F, fontSize: '11px', color: '#606569' }}>· {a}</div>)}
            </div>
          </DSCard>
          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>Usage</div>
            <div className="space-y-2" style={{ fontFamily: F, fontSize: '12px', color: '#606569', lineHeight: 1.6 }}>
              <div>Import <code style={{ background: '#F0F6FA', padding: '1px 5px', borderRadius: 4, color: '#006E85', fontSize: '11px' }}>PageActionBar</code> and pass an <code style={{ background: '#F0F6FA', padding: '1px 5px', borderRadius: 4, color: '#006E85', fontSize: '11px' }}>actions</code> array.</div>
              <div>Each action: <code style={{ background: '#F0F6FA', padding: '1px 5px', borderRadius: 4, color: '#006E85', fontSize: '11px' }}>{`{ label, variant: 'primary'|'ghost', onClick? }`}</code></div>
              <div>One primary max. Ghost can be multiple. Always right-align using flex justify-between on the page header.</div>
            </div>
          </DSCard>
        </div>
      </section>

      {/* ── TAB BAR ──────────────────────────────── */}
      <section>
        <SectionHead label="COMPONENTS · 08" title="TabBar" desc="Pill tab bar for content section switching. No icons on tabs. Glass container." />
        <div className="grid grid-cols-2 gap-4">
          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>Live Preview</div>
            <TabBarDemo />
            <div className="mt-4 p-3 rounded-lg bg-[#F0F9FC] space-y-1">
              {[
                'Container: rgba(255,255,255,0.6) · border: 1.4px solid white · borderRadius: 12px · padding: 4px',
                'Active: bg #006E85 · white · Outfit 600 13px · borderRadius: 8px · padding: 7px 18px',
                'Inactive: transparent · #606569 · same size',
                'No icons on any tab state',
              ].map(a => <div key={a} style={{ fontFamily: F, fontSize: '11px', color: '#606569' }}>· {a}</div>)}
            </div>
          </DSCard>
          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>Usage</div>
            <div className="space-y-2" style={{ fontFamily: F, fontSize: '12px', color: '#606569', lineHeight: 1.6 }}>
              <div>Import <code style={{ background: '#F0F6FA', padding: '1px 5px', borderRadius: 4, color: '#006E85', fontSize: '11px' }}>TabBar</code> and manage state with <code style={{ background: '#F0F6FA', padding: '1px 5px', borderRadius: 4, color: '#006E85', fontSize: '11px' }}>useState</code>.</div>
              <div>Tabs prop: <code style={{ background: '#F0F6FA', padding: '1px 5px', borderRadius: 4, color: '#006E85', fontSize: '11px' }}>{`TabItem[]`}</code> — array of <code style={{ background: '#F0F6FA', padding: '1px 5px', borderRadius: 4, color: '#006E85', fontSize: '11px' }}>{`{ id, label }`}</code>.</div>
              <div>Used in MonthReview (Overview / Finance / Inventory) and any multi-section dashboard page.</div>
            </div>
          </DSCard>
        </div>
      </section>

      {/* ── KPI STRIP ────────────────────────────── */}
      <section>
        <SectionHead label="COMPONENTS · 09" title="KPI Strip Cards" desc="6-column ribbon. No icons. Optional badge pill. Value tabular-nums." />
        <DSCard>
          <div className="grid grid-cols-6 gap-3">
            {[
              { label: 'Revenue', value: '$24,500', delta: '+12.4% vs last Month', positive: true, badge: 'Month 12' },
              { label: 'Cash Balance', value: '$122,400', delta: '+$39,700', positive: true },
              { label: 'Monthly Burn', value: '$12,400', delta: '+3.5%', positive: false },
              { label: 'Runway', value: '9.9 wks', delta: '-0.3 wks', positive: false },
              { label: 'Retention %', value: '89%', delta: '+3% vs M2', positive: true },
              { label: 'Market Share', value: '28%', delta: '+2.1%', positive: true },
            ].map((kpi, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.6)', border: '1.4px solid white', borderRadius: '16px', padding: '14px 16px' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 500, color: '#606569' }}>{kpi.label}</span>
                  {kpi.badge && <span style={{ fontFamily: F, fontSize: '9px', fontWeight: 700, background: '#E0F7FF', color: '#006E85', padding: '2px 7px', borderRadius: '10px' }}>{kpi.badge}</span>}
                </div>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: '20px', color: '#202326', fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.positive ? <ArrowUpRight size={11} color="#156162" /> : <ArrowDownRight size={11} color="#c65252" />}
                  <span style={{ fontFamily: F, fontSize: '10px', fontWeight: 600, color: kpi.positive ? '#156162' : '#c65252' }}>{kpi.delta}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-[#F0F9FC]">
            <div className="grid grid-cols-3 gap-4 text-[11px]" style={{ fontFamily: F, color: '#606569' }}>
              <div>· Card: glass 0.6 · 1.4px solid white · 16px radius · 14/16 padding</div>
              <div>· Label: Outfit 500 11px #606569 · Badge: 9px 700 #E0F7FF/#006E85</div>
              <div>· Value: Outfit 700 20px tabular-nums · Delta: ArrowUpRight/Down 11px</div>
            </div>
          </div>
        </DSCard>
      </section>

      {/* ── CASH FLOW STRIP ──────────────────────── */}
      <section>
        <SectionHead label="COMPONENTS · 10" title="Cash Flow Strip" desc="Horizontal 4-step bridge: Opening → Inflow → Outflow → Closing." />
        <DSCard>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr auto 1fr', alignItems: 'center' }}>
            {[
              { label: 'Opening', value: '$145,000', color: '#202326' },
              null,
              { label: 'Inflow', value: '+$99,200', color: '#156162' },
              null,
              { label: 'Outflow', value: '-$119,700', color: '#c65252' },
              null,
              { label: 'Closing', value: '$124,500', color: '#006E85', large: true },
            ].map((item, i) =>
              item === null
                ? <ChevronRight key={i} size={16} color="#C8DDE6" style={{ justifySelf: 'center' }} />
                : (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: F, fontSize: '11px', color: '#94A3B8', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontFamily: F, fontSize: item.large ? '20px' : '18px', fontWeight: 700, color: item.color, fontVariantNumeric: 'tabular-nums' }}>{item.value}</div>
                  </div>
                )
            )}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-[#F0F9FC] grid grid-cols-3 gap-4 text-[11px]" style={{ fontFamily: F, color: '#606569' }}>
            <div>· Grid: 1fr auto 1fr auto 1fr auto 1fr</div>
            <div>· Separator: ChevronRight 16px #C8DDE6</div>
            <div>· Closing: 20px #006E85 · Others: 18px colored</div>
          </div>
        </DSCard>
      </section>

      {/* ── WASTE ALERTS ─────────────────────────── */}
      <section>
        <SectionHead label="COMPONENTS · 11" title="Waste Alert Cards" desc="3 variants: Expiry (#F59E0B), Phantom (#B45309), Damaged (#c65252). AlertTriangle icon + big number." />
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Expiry', value: 180, pct: '53% of waste', color: '#F59E0B', action: 'Adjust Pricing →' },
            { label: 'Phantom', value: 95, pct: '28% of waste', color: '#B45309' },
            { label: 'Damaged', value: 62, pct: '18% of waste', color: '#c65252' },
          ].map(w => (
            <div key={w.label} style={{ background: 'rgba(255,255,255,0.6)', border: '1.4px solid white', borderRadius: '16px', padding: '16px 18px' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle size={12} color={w.color} />
                <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#606569' }}>{w.label}</span>
              </div>
              <div style={{ fontFamily: F, fontSize: '32px', fontWeight: 700, color: '#202326', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{w.value}</div>
              <div style={{ fontFamily: F, fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{w.pct}</div>
              {w.action && <button style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#006E85', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '6px' }}>{w.action}</button>}
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCT PILL SELECTORS ───────────────── */}
      <section>
        <SectionHead label="COMPONENTS · 12" title="Product Pill Selectors" desc="Colored pill buttons for Revenue by Product. Active = filled with data color. Inactive = #f0f2f4." />
        <DSCard>
          <ProductPillDemo />
          <div className="mt-4 p-3 rounded-lg bg-[#F0F9FC] space-y-1">
            {[
              'Active: filled data color · white text · borderRadius: 20px · Outfit 600 12px',
              'Inactive: #f0f2f4 bg · #606569 text · same geometry',
              'Legend below: 10px colored square + product name · revenue',
            ].map(a => <div key={a} style={{ fontFamily: F, fontSize: '11px', color: '#606569' }}>· {a}</div>)}
          </div>
        </DSCard>
      </section>

      {/* ── HORIZONTAL BARS ──────────────────────── */}
      <section>
        <SectionHead label="COMPONENTS · 13" title="Horizontal Progress Bars" desc="Sold vs Unsold per product. 8px track, teal fill, amber unsold." />
        <DSCard>
          <div className="space-y-3">
            {[
              { name: 'Espresso', sold: 466, unsold: 18 },
              { name: 'Cappuccino', sold: 642, unsold: 12 },
              { name: 'Cold Brew', sold: 198, unsold: 22 },
              { name: 'Croissant', sold: 268, unsold: 34 },
              { name: 'Muffin', sold: 144, unsold: 26 },
            ].map(p => {
              const total = p.sold + p.unsold;
              return (
                <div key={p.name} className="flex items-center gap-3">
                  <span style={{ fontFamily: F, fontSize: '12px', color: '#606569', width: '80px', flexShrink: 0 }}>{p.name}</span>
                  <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: '#f0f2f4', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${(p.sold / total) * 100}%`, background: '#006E85' }} />
                    <div style={{ width: `${(p.unsold / total) * 100}%`, background: '#F59E0B' }} />
                  </div>
                  <span style={{ fontFamily: F, fontSize: '11px', color: '#94A3B8', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', width: '140px', textAlign: 'right' }}>
                    {p.sold} sold · {p.unsold} unsold
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-[#F0F9FC] grid grid-cols-3 gap-3 text-[11px]" style={{ fontFamily: F, color: '#606569' }}>
            <div>· Track: 8px · borderRadius: 4px · #f0f2f4</div>
            <div>· Sold fill: #006E85 · Unsold: #F59E0B</div>
            <div>· Left label: 80px fixed · Right label: tabular-nums</div>
          </div>
        </DSCard>
      </section>

      {/* ── OVERLAY ─────────────────────────────── */}
      <section>
        <SectionHead label="COMPONENTS · 14" title="Overlays & Modals" desc="DecisionOverlay anatomy. Fixed backdrop + centered modal." />
        <DSCard>
          <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>DecisionOverlay — Anatomy Preview</div>
          <div className="max-w-[580px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#C8DDE6]">
            <div className="bg-gradient-to-r from-[#006E85] to-[#003D47] p-5 text-white">
              <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>QUARTERLY PRODUCT LEDGER · 17.10</div>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: '20px' }}>Translate insight → next month's purchase</div>
            </div>
            <div className="p-5">
              <div className="bg-[#F0F9FC] rounded-xl p-4 mb-4 flex items-start gap-2">
                <AlertCircle size={14} color="#B45309" className="mt-0.5 shrink-0" />
                <div>
                  <div style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#B45309', marginBottom: 4 }}>Insight detected</div>
                  <div style={{ fontFamily: F, fontSize: '13px', color: '#202326' }}><strong>Signature Bowl</strong> has 94% performance. Consider reallocating away from <strong>Spicy Noodle</strong>.</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 rounded-xl border border-[#C8DDE6] text-[#606569] cursor-pointer"
                  style={{ fontFamily: F, fontSize: '13px', fontWeight: 600 }}>Keep reviewing</button>
                <button className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#006E85] to-[#003D47] text-white cursor-pointer"
                  style={{ fontFamily: F, fontSize: '13px', fontWeight: 700 }}>Go to Purchase Goods</button>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4" style={{ fontFamily: F, fontSize: '11px', color: '#606569' }}>
            <div>Backdrop: fixed inset-0 bg-black/40 backdrop-blur-sm</div>
            <div>Modal: bg-white rounded-2xl shadow-2xl max-w-[680px]</div>
            <div>Header: gradient-strategic · Body: p-5 · Insight: bg-[#F0F9FC] rounded-xl</div>
          </div>
        </DSCard>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MOTION TAB
// ─────────────────────────────────────────────────────────────────
function MotionTab() {
  const [playing, setPlaying] = useState(false);

  const triggerPlay = () => {
    setPlaying(false);
    setTimeout(() => setPlaying(true), 50);
    setTimeout(() => setPlaying(false), 800);
  };

  return (
    <div className="space-y-10">
      <section>
        <SectionHead label="MOTION · 01" title="PageTransition" desc="Wraps every screen. Uses Motion (motion/react) with custom cubic-bezier easing." />
        <div className="grid grid-cols-2 gap-4">
          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>Spec</div>
            <div className="space-y-3">
              {[
                { prop: 'initial', value: '{ opacity: 0, y: 16 }' },
                { prop: 'animate', value: '{ opacity: 1, y: 0 }' },
                { prop: 'exit', value: '{ opacity: 0, y: -12 }' },
                { prop: 'duration', value: '0.35s' },
                { prop: 'ease', value: '[0.22, 1, 0.36, 1]' },
                { prop: 'description', value: 'Custom "fast-out-slow-in" → smooth deceleration' },
                { prop: 'package', value: "'motion/react' (Motion, not Framer Motion)" },
                { prop: 'minHeight', value: '100vh · width: 100%' },
              ].map(r => (
                <div key={r.prop} className="flex gap-3 items-start">
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: '11px', background: '#F0F6FA', color: '#006E85', padding: '2px 6px', borderRadius: 5, border: '1px solid #C8DDE6', minWidth: 80, textAlign: 'right' }}>{r.prop}</span>
                  <span style={{ fontFamily: F, fontSize: '12px', color: '#202326' }}>{r.value}</span>
                </div>
              ))}
            </div>
          </DSCard>
          <DSCard>
            <div className="flex items-center justify-between mb-4">
              <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85' }}>Live Demo</div>
              <button onClick={triggerPlay} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#006E85] text-white cursor-pointer hover:bg-[#005F58]"
                style={{ fontFamily: F, fontSize: '11px', fontWeight: 600 }}>
                <Play size={11} /> Replay
              </button>
            </div>
            <div className="h-32 flex items-center justify-center overflow-hidden rounded-xl bg-[#F0F6FA]">
              <div
                style={{
                  opacity: playing ? 0 : 1,
                  transform: playing ? 'translateY(16px)' : 'translateY(0px)',
                  transition: playing ? 'none' : 'opacity 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1)',
                  fontFamily: F, fontSize: '18px', fontWeight: 700, color: '#202326',
                }}
              >
                Screen enters ↑
              </div>
            </div>
            <div style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8', marginTop: 8 }}>Simulated: opacity 0→1, translateY 16→0 over 350ms with cubic-bezier(0.22, 1, 0.36, 1)</div>
          </DSCard>
        </div>
      </section>

      <section>
        <SectionHead label="MOTION · 02" title="Interactive State Transitions" />
        <div className="grid grid-cols-3 gap-4">
          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>Hover Elevations</div>
            <div className="space-y-3">
              {[
                { label: 'GameButton hover', value: 'hover:shadow-lg · transition-all' },
                { label: 'WasteTile clickable', value: 'hover:shadow-md · transition-all' },
                { label: 'QuarterlyHub ledger btn', value: 'hover:bg-white/80 · transition-all' },
                { label: 'Expand button hover', value: 'hover:bg-[#005F58]' },
                { label: 'Download button hover', value: 'hover:bg-[#F0F9FC]' },
              ].map(h => (
                <div key={h.label} className="py-2" style={{ borderBottom: '1px solid #F0F6FA' }}>
                  <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#202326', marginBottom: 2 }}>{h.label}</div>
                  <code style={{ fontFamily: "'Courier New', monospace", fontSize: '10px', color: '#606569' }}>{h.value}</code>
                </div>
              ))}
            </div>
          </DSCard>

          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>Pulse Animation — Runway Danger</div>
            <div className="space-y-4">
              <div className="rounded-2xl p-4 animate-pulse" style={{ border: '1.4px solid #c65252', background: 'rgba(254, 226, 226, 0.9)' }}>
                <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#606569', marginBottom: 4 }}>Runway</div>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: '22px', color: '#c65252', fontVariantNumeric: 'tabular-nums' }}>2.1 mo</div>
                <div style={{ fontFamily: F, fontSize: '11px', color: '#c65252', fontWeight: 700 }}>Bankruptcy risk</div>
              </div>
              <div style={{ fontFamily: F, fontSize: '10px', color: '#94A3B8' }}>Triggered when runway &lt; 3 months · Tailwind animate-pulse · border-color + background both change to danger theme</div>
            </div>
          </DSCard>

          <DSCard>
            <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85', marginBottom: 12 }}>Color Transition Thresholds</div>
            <div className="space-y-3">
              <div>
                <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#202326', marginBottom: 6 }}>Runway color scale</div>
                <div className="space-y-2">
                  {[
                    { range: '≥ 6 months', color: '#156162', label: 'Healthy' },
                    { range: '3–6 months', color: '#B45309', label: 'Caution' },
                    { range: '< 3 months', color: '#c65252', label: 'Bankruptcy risk + pulse' },
                  ].map(r => (
                    <div key={r.range} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: r.color }} />
                      <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: r.color, width: 80 }}>{r.range}</span>
                      <span style={{ fontFamily: F, fontSize: '10px', color: '#606569' }}>{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#202326', marginBottom: 6 }}>Stock Pressure color scale</div>
                <div className="space-y-2">
                  {[
                    { range: '≤ 75%', color: '#006E85', label: 'Normal' },
                    { range: '76–90%', color: '#B45309', label: 'Warning' },
                    { range: '> 90%', color: '#c65252', label: 'Alert' },
                  ].map(r => (
                    <div key={r.range} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: r.color }} />
                      <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: r.color, width: 80 }}>{r.range}</span>
                      <span style={{ fontFamily: F, fontSize: '10px', color: '#606569' }}>{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DSCard>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TOKENS TAB
// ─────────────────────────────────────────────────────────────────
function TokensTab() {
  const ALL_TOKENS = [
    { cat: 'Brand', token: '--game-font', value: "'Outfit', system-ui, -apple-system, sans-serif", usage: 'Global font stack' },
    { cat: 'Brand', token: '--game-teal-dark', value: '#003C49', usage: 'CTA gradient end stop' },
    { cat: 'Brand', token: '--game-teal', value: '#005F58', usage: 'CTA gradient start stop' },
    { cat: 'Brand', token: '--game-teal-mid', value: '#006E85', usage: 'Primary interactive, active states' },
    { cat: 'Brand', token: '--game-teal-light', value: '#00A0C2', usage: 'Hover states, icons' },
    { cat: 'Brand', token: '--game-cyan', value: '#00C1EB', usage: 'Primary highlight, ring, Chart 1' },
    { cat: 'Brand', token: '--game-cyan-bright', value: '#00D2FF', usage: 'Max brightness cyan' },
    { cat: 'Surface', token: '--game-dark', value: '#002C33', usage: 'Deep ink, sidebar bg' },
    { cat: 'Surface', token: '--game-surface', value: 'rgba(255,255,255,0.6)', usage: 'Glass card background' },
    { cat: 'Surface', token: '--game-surface-solid', value: '#FFFFFF', usage: 'Opaque surface' },
    { cat: 'Surface', token: '--background', value: '#F0F6FA', usage: 'Page background (theme)' },
    { cat: 'Text', token: '--game-text', value: '#202326', usage: 'Primary body text' },
    { cat: 'Text', token: '--game-text-secondary', value: '#606569', usage: 'Secondary / labels' },
    { cat: 'Text', token: '--game-text-muted', value: '#94A3B8', usage: 'Placeholder, timestamps' },
    { cat: 'Semantic', token: '--game-positive', value: '#156162', usage: 'Revenue up, retention gain' },
    { cat: 'Semantic', token: '--game-success', value: '#166534', usage: 'Success state' },
    { cat: 'Semantic', token: '--game-negative', value: '#c65252', usage: 'Cost up, turnover, danger' },
    { cat: 'Semantic', token: '--game-warning', value: '#B45309', usage: 'Phantom stock, unsold, lag' },
    { cat: 'Semantic', token: '--destructive', value: '#C0392B', usage: 'System-level danger, coral' },
    { cat: 'Border', token: '--game-card-border', value: '1.4px solid white', usage: 'All content cards' },
    { cat: 'Border', token: '--game-card-radius', value: '1rem (16px)', usage: 'All content card corners' },
    { cat: 'Border', token: '--game-card-selected-border', value: '1.4px solid rgba(21,97,98,0.33)', usage: 'Selected card' },
    { cat: 'Border', token: '--border', value: '#C8DDE6', usage: 'Default border color' },
    { cat: 'Shadow', token: '--game-card-selected-shadow', value: '0px 2.5px 10px 0px rgba(77,181,182,0.29)', usage: 'Selected card shadow' },
    { cat: 'Sidebar', token: '--sidebar', value: '#002C33', usage: 'Sidebar background' },
    { cat: 'Sidebar', token: '--sidebar-border', value: '#006E85', usage: 'Sidebar border' },
    { cat: 'Sidebar', token: '--sidebar-ring', value: '#00C1EB', usage: 'Sidebar focus ring' },
    { cat: 'Chart', token: '--chart-1', value: '#00C1EB', usage: 'Primary chart series' },
    { cat: 'Chart', token: '--chart-2', value: '#003D47', usage: 'Secondary chart series' },
    { cat: 'Chart', token: '--chart-3', value: '#7C3AED', usage: 'Tertiary (purple accent)' },
    { cat: 'Chart', token: '--chart-4', value: '#B45309', usage: 'Warning series (waste)' },
    { cat: 'Chart', token: '--chart-5', value: '#C0392B', usage: 'Critical series' },
    { cat: 'Radius', token: '--radius', value: '0.625rem (10px)', usage: 'Base radius token' },
    { cat: 'Radius', token: '--radius-sm', value: 'calc(var(--radius) - 4px) = 6px', usage: 'Small elements' },
    { cat: 'Radius', token: '--radius-md', value: 'calc(var(--radius) - 2px) = 8px', usage: 'Medium elements' },
    { cat: 'Radius', token: '--radius-xl', value: 'calc(var(--radius) + 4px) = 14px', usage: 'Large panels' },
  ];

  const cats = [...new Set(ALL_TOKENS.map(t => t.cat))];
  const [activeCat, setActiveCat] = useState('All');

  const filtered = activeCat === 'All' ? ALL_TOKENS : ALL_TOKENS.filter(t => t.cat === activeCat);

  return (
    <div className="space-y-6">
      <SectionHead label="TOKEN REFERENCE" title="Complete CSS Token Table" desc="All tokens sourced from /src/styles/theme.css. Click any hex to copy." />

      <div className="flex flex-wrap gap-2 mb-4">
        {['All', ...cats].map(c => (
          <button key={c} onClick={() => setActiveCat(c)}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${activeCat === c ? 'bg-[#006E85] text-white' : 'bg-white/60 text-[#606569] hover:text-[#202326]'}`}
            style={{ fontFamily: F, fontSize: '12px', fontWeight: 600, border: '1.4px solid white' }}>
            {c}
          </button>
        ))}
      </div>

      <DSCard>
        <div className="grid grid-cols-[100px_180px_160px_1fr] gap-3 pb-2 mb-2" style={{ borderBottom: '1px solid #C8DDE6' }}>
          {['Category', 'Token', 'Value', 'Usage'].map(h => (
            <div key={h} style={{ fontFamily: F, fontSize: '10px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em' }}>{h}</div>
          ))}
        </div>
        <div className="space-y-px">
          {filtered.map((t, i) => (
            <div key={i} className="grid grid-cols-[100px_180px_160px_1fr] gap-3 py-2.5 px-2 hover:bg-[#F0F9FC] rounded-lg transition-colors items-center">
              <span className="px-1.5 py-0.5 rounded text-center" style={{
                fontFamily: F, fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em',
                background: '#E0F7FF', color: '#006E85',
              }}>{t.cat.toUpperCase()}</span>
              <CodeTag>{t.token}</CodeTag>
              <div className="flex items-center gap-2">
                {t.value.startsWith('#') && (
                  <div className="w-4 h-4 rounded shrink-0" style={{ background: t.value, border: '1px solid rgba(0,0,0,0.08)' }} />
                )}
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: '10px', color: '#202326' }}>{t.value}</span>
              </div>
              <span style={{ fontFamily: F, fontSize: '11px', color: '#606569' }}>{t.usage}</span>
            </div>
          ))}
        </div>
      </DSCard>

      {/* Flags section */}
      <div>
        <div style={{ fontFamily: F, fontSize: '15px', fontWeight: 700, color: '#202326', marginBottom: 12 }}>⚠️ Open Design Flags</div>
        <div className="space-y-3">
          {[
            { sev: 'HIGH', color: '#c65252', bg: '#FEE2E2', flag: 'F-1', title: 'GameButton gradient is a base64 SVG data URI', desc: 'The radial gradient is not tokenized — impossible to update via theme.css. Extract to CSS radial-gradient() token or /src/imports/ SVG asset.' },
            { sev: 'MED', color: '#B45309', bg: '#FEF3C7', flag: 'F-2', title: 'No --font-mono token', desc: 'tabular-nums alignment achieved via fontVariantNumeric inline style only. Add --font-mono token and .tabular-nums utility class.' },
            { sev: 'MED', color: '#B45309', bg: '#FEF3C7', flag: 'F-3', title: 'max-width 2px drift', desc: 'CommandCenter uses max-w-[1288px], GameHeader uses max-w-[1286px]. Unify to --max-w-page: 1288px CSS token.' },
            { sev: 'MED', color: '#B45309', bg: '#FEF3C7', flag: 'F-4', title: 'No elevation ladder', desc: 'All shadows are ad-hoc per component. Define 4-step --shadow-elev-{0–3} token set in theme.css.' },
            { sev: 'MED', color: '#B45309', bg: '#FEF3C7', flag: 'F-5', title: 'Button pill radius conflict', desc: 'GameButton uses 46px, PrimaryCTA uses 9999px. Unify under --radius-pill: 9999px token.' },
            { sev: 'LOW', color: '#006E85', bg: '#E0F7FF', flag: 'F-6', title: 'fontVariantNumeric applied inline only', desc: 'Should be a reusable .tabular-nums Tailwind utility or CSS class for consistency.' },
          ].map(f => (
            <div key={f.flag} className="flex gap-3 p-3 rounded-xl" style={{ background: f.bg }}>
              <div className="shrink-0">
                <span className="px-1.5 py-0.5 rounded" style={{ fontFamily: F, fontSize: '9px', fontWeight: 700, background: f.color, color: 'white' }}>{f.sev}</span>
              </div>
              <div>
                <div style={{ fontFamily: F, fontSize: '12px', fontWeight: 700, color: '#202326', marginBottom: 2 }}>{f.flag} — {f.title}</div>
                <div style={{ fontFamily: F, fontSize: '11px', color: '#606569' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Small demo helpers used in ComponentsTab ─────────────────────
function TabBarDemo() {
  const [active, setActive] = useState('overview');
  return (
    <TabBar
      tabs={[{ id: 'overview', label: 'Overview' }, { id: 'finance', label: 'Finance' }, { id: 'inventory', label: 'Inventory' }]}
      activeTab={active}
      onChange={setActive}
    />
  );
}

function ProductPillDemo() {
  const [active, setActive] = useState('Espresso');
  const products = [
    { name: 'Espresso', value: 1631, color: '#00C1EB' },
    { name: 'Cappuccino', value: 2689, color: '#006E85' },
    { name: 'Cold Brew', value: 990, color: '#003D47' },
    { name: 'Croissant', value: 1005, color: '#F59E0B' },
    { name: 'Muffin', value: 458, color: '#7C3AED' },
    { name: 'Whole Bean', value: 392, color: '#C0392B' },
  ];
  return (
    <div>
      <div style={{ fontFamily: F, fontSize: '13px', fontWeight: 700, color: '#202326', marginBottom: '12px', letterSpacing: '0.02em' }}>
        REVENUE BY PRODUCT · $7.4K
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {products.map(p => (
          <button key={p.name} onClick={() => setActive(p.name)} style={{
            fontFamily: F, fontSize: '12px', fontWeight: 600, padding: '6px 14px',
            borderRadius: '20px', border: 'none', cursor: 'pointer',
            background: active === p.name ? p.color : '#f0f2f4',
            color: active === p.name ? 'white' : '#606569',
            transition: 'all 0.15s',
          }}>{p.name}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
        {products.map(p => (
          <div key={p.name} className="flex items-center gap-2">
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: p.color, flexShrink: 0 }} />
            <span style={{ fontFamily: F, fontSize: '11px', color: '#606569' }}>{p.name} · ${p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ICONS TAB
// ─────────────────────────────────────────────────────────────────
const ICON_GROUPS = [
  {
    category: 'Interface Essentials',
    icons: [
      { name: 'Search', el: <Search size={20} /> },
      { name: 'Settings', el: <Settings size={20} /> },
      { name: 'Bell', el: <Bell size={20} /> },
      { name: 'Eye', el: <Eye size={20} /> },
      { name: 'EyeOff', el: <EyeOff size={20} /> },
      { name: 'Lock', el: <Lock size={20} /> },
      { name: 'Unlock', el: <Unlock size={20} /> },
      { name: 'RefreshCw', el: <RefreshCw size={20} /> },
      { name: 'RotateCcw', el: <RotateCcw size={20} /> },
      { name: 'Check', el: <Check size={20} /> },
      { name: 'X', el: <X size={20} /> },
      { name: 'Plus', el: <Plus size={20} /> },
      { name: 'Minus', el: <Minus size={20} /> },
      { name: 'Menu', el: <Menu size={20} /> },
      { name: 'Info', el: <Info size={20} /> },
      { name: 'AlertTriangle', el: <AlertTriangle size={20} /> },
      { name: 'AlertCircle', el: <AlertCircle size={20} /> },
      { name: 'Copy', el: <Copy size={20} /> },
      { name: 'Upload', el: <Upload size={20} /> },
      { name: 'Share2', el: <Share2 size={20} /> },
    ],
  },
  {
    category: 'Navigation & Chevrons',
    icons: [
      { name: 'ChevronRight', el: <ChevronRight size={20} /> },
      { name: 'ChevronLeft', el: <ChevronLeft size={20} /> },
      { name: 'ChevronUp', el: <ChevronUp size={20} /> },
      { name: 'ChevronDown', el: <ChevronDown size={20} /> },
      { name: 'ArrowUpRight', el: <ArrowUpRight size={20} /> },
      { name: 'ArrowDownRight', el: <ArrowDownRight size={20} /> },
      { name: 'ExternalLink', el: <ExternalLink size={20} /> },
      { name: 'Map', el: <Map size={20} /> },
      { name: 'Home', el: <Home size={20} /> },
      { name: 'Globe', el: <Globe size={20} /> },
    ],
  },
  {
    category: 'Business & Work',
    icons: [
      { name: 'Users', el: <Users size={20} /> },
      { name: 'UserPlus', el: <UserPlus size={20} /> },
      { name: 'Heart', el: <Heart size={20} /> },
      { name: 'Lightbulb', el: <Lightbulb size={20} /> },
      { name: 'Package', el: <Package size={20} /> },
      { name: 'Landmark', el: <Landmark size={20} /> },
      { name: 'Truck', el: <Truck size={20} /> },
      { name: 'ShoppingCart', el: <ShoppingCart size={20} /> },
      { name: 'DollarSign', el: <DollarSign size={20} /> },
      { name: 'FileText', el: <FileText size={20} /> },
      { name: 'Calendar', el: <Calendar size={20} /> },
      { name: 'Mail', el: <Mail size={20} /> },
      { name: 'Phone', el: <Phone size={20} /> },
      { name: 'Star', el: <Star size={20} /> },
      { name: 'Award', el: <Award size={20} /> },
      { name: 'ThumbsUp', el: <ThumbsUp size={20} /> },
    ],
  },
  {
    category: 'Data & Charts',
    icons: [
      { name: 'BarChart3', el: <BarChart3 size={20} /> },
      { name: 'BarChart2', el: <BarChart2 size={20} /> },
      { name: 'PieChart', el: <PieChart size={20} /> },
      { name: 'Activity', el: <Activity size={20} /> },
      { name: 'TrendingUp', el: <TrendingUp size={20} /> },
      { name: 'TrendingDown', el: <TrendingDown size={20} /> },
      { name: 'Sliders', el: <Sliders size={20} /> },
    ],
  },
  {
    category: 'Technology & Devices',
    icons: [
      { name: 'Monitor', el: <Monitor size={20} /> },
      { name: 'Smartphone', el: <Smartphone size={20} /> },
      { name: 'Tablet', el: <Tablet size={20} /> },
      { name: 'Cpu', el: <Cpu size={20} /> },
      { name: 'Wifi', el: <Wifi size={20} /> },
      { name: 'Battery', el: <Battery size={20} /> },
    ],
  },
  {
    category: 'Food & Lifestyle',
    icons: [
      { name: 'Coffee', el: <Coffee size={20} /> },
      { name: 'Sun', el: <Sun size={20} /> },
      { name: 'Cloud', el: <Cloud size={20} /> },
      { name: 'Wind', el: <Wind size={20} /> },
      { name: 'Droplets', el: <Droplets size={20} /> },
      { name: 'Zap', el: <Zap size={20} /> },
      { name: 'Clock', el: <Clock size={20} /> },
    ],
  },
];

function IconsTab() {
  return (
    <div className="space-y-10">

      {/* Rule banner */}
      <div style={{
        background: 'linear-gradient(135deg, #006E85, #003D47)',
        borderRadius: '16px', padding: '20px 24px', color: 'white',
      }}>
        <div style={{ fontFamily: F, fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px', opacity: 0.7 }}>
          ICON SYSTEM RULE
        </div>
        <div style={{ fontFamily: F, fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
          Figma SVG pixel icons — project implementation library
        </div>
        <p style={{ fontFamily: F, fontSize: '13px', opacity: 0.85, lineHeight: 1.6, maxWidth: '640px' }}>
          All icons in generated and hand-coded design-system components use the imported
          <strong> Figma SVG pixel icon components</strong>. No emoji. No other icon packages.
          The source style is the <strong>Streamline Pixel</strong> 32×32 set from Figma node 5643-5603.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            'local SVG only',
            'Figma pixel source',
            'no emoji',
            'no heroicons',
            'no fontawesome',
            'no image icons',
            'size: 12–20px in UI',
            'color: token-matched',
          ].map(r => (
            <span key={r} style={{
              fontFamily: F, fontSize: '10px', fontWeight: 700,
              background: 'rgba(255,255,255,0.15)', padding: '3px 10px',
              borderRadius: '20px', letterSpacing: '0.04em',
            }}>
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Size reference */}
      <section>
        <SectionHead label="ICONS · 01" title="Size Scale" desc="Use the right size for the context. Never scale up with CSS transforms." />
        <DSCard>
          <div className="flex items-end gap-8">
            {[
              { size: 12, usage: 'Inline delta arrows, badge icons' },
              { size: 14, usage: 'Card header labels, compact rows' },
              { size: 16, usage: 'Standard UI icons, section headers' },
              { size: 18, usage: 'Decision card icons (in tinted boxes)' },
              { size: 20, usage: 'Tab / nav icons, prominent actions' },
              { size: 24, usage: 'Hero/empty state icons' },
            ].map(s => (
              <div key={s.size} className="flex flex-col items-center gap-2">
                <Settings size={s.size} color="#006E85" />
                <div style={{ fontFamily: F, fontSize: '10px', fontWeight: 700, color: '#202326' }}>{s.size}px</div>
                <div style={{ fontFamily: F, fontSize: '9px', color: '#94A3B8', textAlign: 'center', maxWidth: '70px' }}>{s.usage}</div>
              </div>
            ))}
          </div>
        </DSCard>
      </section>

      {/* Color usage */}
      <section>
        <SectionHead label="ICONS · 02" title="Color Rules" desc="Icons inherit semantic meaning from their color. Match the token, not a hardcoded hex." />
        <DSCard>
          <div className="grid grid-cols-5 gap-4">
            {[
              { color: '#94A3B8', token: 'game-text-muted', label: 'Neutral / decorative', el: <Bell size={18} color="#94A3B8" /> },
              { color: '#006E85', token: 'game-teal-mid', label: 'Interactive / active', el: <Settings size={18} color="#006E85" /> },
              { color: '#156162', token: 'game-positive', label: 'Positive / up trend', el: <ArrowUpRight size={18} color="#156162" /> },
              { color: '#c65252', token: 'game-negative', label: 'Negative / warning', el: <AlertTriangle size={18} color="#c65252" /> },
              { color: '#B45309', token: 'game-warning', label: 'Caution / lag', el: <Clock size={18} color="#B45309" /> },
            ].map(c => (
              <div key={c.token} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#F0F9FC]">
                {c.el}
                <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: '#202326' }}>{c.label}</div>
                <CodeTag>{`--${c.token}`}</CodeTag>
              </div>
            ))}
          </div>
        </DSCard>
      </section>

      {/* Icon library */}
      {ICON_GROUPS.map((group, gi) => (
        <section key={group.category}>
          <SectionHead label={`ICONS · 0${gi + 3}`} title={group.category} />
          <DSCard>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}>
              {group.icons.map(icon => (
                <div key={icon.name} className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-[#F0F9FC] cursor-default group">
                  <div className="text-[#606569] group-hover:text-[#006E85] transition-colors">
                    {icon.el}
                  </div>
                  <span style={{ fontFamily: F, fontSize: '9px', color: '#94A3B8', textAlign: 'center', lineHeight: 1.3 }}>
                    {icon.name}
                  </span>
                </div>
              ))}
            </div>
          </DSCard>
        </section>
      ))}

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
export function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState<Tab>('foundations');

  return (
    <GridBackground className="flex flex-col min-h-screen">
      <PageTransition>
        {/* Page Header */}
        <div className="bg-white/60 sticky top-0 z-40" style={{ borderBottom: '1.4px solid white', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-[1288px] mx-auto px-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#006E85] to-[#003C49] flex items-center justify-center">
                  <Layers size={16} color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: F, fontSize: '18px', fontWeight: 800, color: '#202326', letterSpacing: '-0.32px' }}>
                    Startup Valley — Design System
                  </div>
                  <div style={{ fontFamily: F, fontSize: '11px', color: '#94A3B8' }}>
                    uSpec Framework · Outfit · Phase 1–4 complete
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-[#E0F7FF]" style={{ fontFamily: F, fontSize: '11px', fontWeight: 700, color: '#006E85' }}>
                  v1.1 · May 2026
                </div>
                <a href="/game/command-center" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C8DDE6] text-[#606569] hover:text-[#202326] hover:bg-[#F0F9FC] transition-all"
                  style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, textDecoration: 'none' }}>
                  <ExternalLink size={11} /> Command Center
                </a>
              </div>
            </div>

            {/* Tab nav */}
            <div className="flex gap-1 pb-px">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg transition-all cursor-pointer relative ${activeTab === tab.id ? 'text-[#006E85]' : 'text-[#606569] hover:text-[#202326]'}`}
                  style={{ fontFamily: F, fontSize: '13px', fontWeight: activeTab === tab.id ? 700 : 500 }}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006E85] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1288px] mx-auto px-6 py-8 pb-24 w-full">
          {activeTab === 'foundations' && <FoundationsTab />}
          {activeTab === 'components' && <ComponentsTab />}
          {activeTab === 'motion' && <MotionTab />}
          {activeTab === 'tokens' && <TokensTab />}
          {activeTab === 'icons' && <IconsTab />}
        </div>
      </PageTransition>
    </GridBackground>
  );
}
