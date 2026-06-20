'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SimStudentShell, DeckCard } from './SimShell';
import {
  TrendingUp, Heart, DollarSign, Check, Clock, ChevronDown, Target, Globe, Megaphone,
} from '../PixelIcons';
import {
  Eyebrow, CtaButton, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, warning, cyanTint, whisper,
} from './sim-ui';

/* ──────────────────────────────────────────────────────────────────────
   54 · Simulation Brief — narrative is the hero. Outfit body at a ~65ch
   measure with generous leading; objectives as scannable status rows;
   a quiet "time to decide" cue; exactly one forward CTA.
   ──────────────────────────────────────────────────────────────────── */

const LEAD =
  'Two rounds in, Peak Performance has found its footing. Your sustainable sportswear line is winning loyal customers, and the brand is gaining recognition in your home market. But standing still is the one decision you can’t afford.';

const REST = [
  'Round 2 opens a new front: expansion. A neighbouring region has opened to outside brands, and early signals show appetite for exactly the kind of product you sell. The opportunity is real — but so is the risk. A new competitor has entered your primary market, raw-material costs have climbed 6%, and demand is tilting further toward sustainability.',
  'Your task this round is to grow without losing the discipline that got you here. Decide where to spend, what to price, and how far to stretch operations and supply — then back each call with your reasoning. The teams that expand thoughtfully, not loudly, will pull ahead.',
];

const OBJECTIVES = [
  { icon: TrendingUp, title: 'Grow Market Share', detail: 'Reach 21% in your primary market while entering the new region.', status: 'progress' as const, note: 'On track · 18.6%' },
  { icon: Heart, title: 'Improve Customer Satisfaction', detail: 'Hold satisfaction at 80%+ as you scale to new customers.', status: 'met' as const, note: 'Met · 82%' },
  { icon: DollarSign, title: 'Maintain Strong Profitability', detail: 'Keep net margin healthy despite the 6% input-cost rise.', status: 'progress' as const, note: 'Watch · margin tightening' },
];

export function SimBrief() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  return (
    <SimStudentShell>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <Eyebrow>Round 2 Brief</Eyebrow>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, letterSpacing: '-0.6px', color: ink, lineHeight: 1.18, marginTop: 6 }}>
          Expanding Our Footprint
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 9, fontFamily: DATA, fontSize: 13, color: muted }}>
          <Clock size={14} color={faint} /> 6-minute read · prepared by your facilitator
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.55fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }} className="sim-brief-grid">
        {/* ── Narrative (hero) ── */}
        <div>
          <DeckCard style={{ padding: 26 }}>
            <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 18, lineHeight: 1.6, color: ink, maxWidth: '65ch', margin: 0 }}>
              {LEAD}
            </p>

            <div
              id="brief-rest"
              style={{
                maxHeight: expanded ? 600 : 0, overflow: 'hidden',
                transition: 'max-height .4s ease, opacity .3s ease', opacity: expanded ? 1 : 0,
              }}
            >
              {REST.map((para) => (
                <p key={para} style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 16, lineHeight: 1.72, color: body, maxWidth: '65ch', marginTop: 18 }}>
                  {para}
                </p>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 22, padding: '14px 16px', background: cyanTint, borderRadius: 12 }}>
                <Megaphone size={18} color={tealMid} style={{ flexShrink: 0 }} />
                <p style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 14.5, color: tealDarkSafe, lineHeight: 1.5, margin: 0 }}>
                  You&apos;ve done the hard part once already. Trust your read of the market, decide together, and commit.
                </p>
              </div>
            </div>

            <button
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls="brief-rest"
              className="sim-readmore"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 18, fontFamily: DISPLAY, fontWeight: 700, fontSize: 13.5, color: tealMid, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {expanded ? 'Show less' : 'Read the full brief'}
              <ChevronDown size={15} color={tealMid} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .25s ease' }} />
            </button>
          </DeckCard>

          {/* Key objectives */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Target size={16} color={tealMid} />
              <Eyebrow>Key objectives this round</Eyebrow>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {OBJECTIVES.map((o) => <ObjectiveRow key={o.title} {...o} />)}
            </div>
          </div>
        </div>

        {/* ── Supporting visual + forward CTA ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 92 }}>
          <BriefVisual />

          <DeckCard style={{ padding: 20 }}>
            <Eyebrow>Next step</Eyebrow>
            <p style={{ fontFamily: DISPLAY, fontSize: 14.5, color: body, lineHeight: 1.55, marginTop: 10 }}>
              Read the brief, then regroup with your team before you decide.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 14, padding: '10px 12px', background: 'color-mix(in srgb, var(--game-warning) 12%, #fff)', borderRadius: 10 }}>
              <Clock size={15} color={warning} />
              <span style={{ fontFamily: DATA, fontSize: 12.5, color: muted }}>Time to decide <strong style={{ color: ink, fontVariantNumeric: 'tabular-nums' }}>2d 14h 32m</strong></span>
            </div>
            <div style={{ marginTop: 16 }}>
              <CtaButton full onClick={() => router.push('/sim/play/lobby')}>Continue to Team Lobby</CtaButton>
            </div>
          </DeckCard>
        </div>
      </div>

      <style>{`
        .sim-readmore:focus-visible{outline:2px solid var(--game-cyan);outline-offset:2px;border-radius:4px;}
        @media (max-width:840px){.sim-brief-grid{grid-template-columns:1fr !important;}.sim-brief-grid > div:last-child{position:static !important;}}
      `}</style>
    </SimStudentShell>
  );
}

const tealDarkSafe = 'var(--game-teal-dark)';

function ObjectiveRow({ icon: Icon, title, detail, status, note }: typeof OBJECTIVES[number]) {
  const met = status === 'met';
  const tone = met ? success : warning;
  const toneBg = met ? 'color-mix(in srgb, var(--game-success) 13%, #fff)' : 'color-mix(in srgb, var(--game-warning) 15%, #fff)';
  return (
    <DeckCard style={{ padding: 16, display: 'flex', alignItems: 'flex-start', gap: 13 }}>
      <span style={{ width: 38, height: 38, borderRadius: 10, background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon size={18} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: ink }}>{title}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: DATA, fontSize: 11.5, fontWeight: 700, color: tone, background: toneBg, padding: '3px 9px', borderRadius: 999 }}>
            {met ? <Check size={12} color={tone} /> : <Clock size={12} color={tone} />}
            {note}
          </span>
        </div>
        <p style={{ fontFamily: DATA, fontSize: 13, color: muted, lineHeight: 1.5, marginTop: 5 }}>{detail}</p>
      </div>
    </DeckCard>
  );
}

/* Supporting visual — a composed scene, not a stock image (no broken loads). */
function BriefVisual() {
  return (
    <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: 'var(--game-card-border)', boxShadow: 'var(--shadow-elev-1)', aspectRatio: '16 / 11', background: 'linear-gradient(150deg, var(--game-teal-dark), var(--game-teal-mid) 70%, var(--game-teal-light))' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.6, backgroundImage: 'radial-gradient(circle at 78% 24%, rgba(95,208,232,0.4), transparent 40%), radial-gradient(circle at 20% 86%, rgba(0,193,235,0.3), transparent 45%)' }} />
      {/* simple skyline of expansion */}
      <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '52%', display: 'flex', alignItems: 'flex-end', gap: 6, padding: '0 22px' }}>
        {[44, 70, 56, 88, 64, 96, 52, 78].map((h, i) => (
          <span key={i} style={{ flex: 1, height: `${h}%`, background: `rgba(255,255,255,${0.08 + (i % 3) * 0.05})`, borderRadius: '4px 4px 0 0' }} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 22, top: 20, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(4px)', borderRadius: 999, padding: '6px 12px' }}>
        <Globe size={15} color="#fff" />
        <span style={{ fontFamily: DATA, fontSize: 12, fontWeight: 700, color: '#fff' }}>New region · now open</span>
      </div>
      <div style={{ position: 'absolute', left: 22, bottom: 18, color: '#fff' }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 20, letterSpacing: '-0.4px' }}>Eastvale Region</div>
        <div style={{ fontFamily: DATA, fontSize: 12.5, color: 'rgba(255,255,255,0.78)' }}>~340k addressable customers · low brand saturation</div>
      </div>
    </div>
  );
}
