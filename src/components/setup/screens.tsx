'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Hash, ChevronDown } from 'lucide-react';
import { GridBackground } from '../GridBackground';
import { GameHeader } from '../GameHeader';
import { PageTransition } from '../PageTransition';
import { SetupShell, SetupCTA, TotalCostChip } from './SetupShell';
import { OptionGrid } from './OptionGrid';
import { useSetupController } from './useSetupController';
import { LOCATIONS } from '../../lib/game-state';
import {
  COMPANY_DOMAINS, CAPACITY_OPTIONS, EMPLOYEE_OB, MARKETING_OB, PAYMENT_OPTIONS,
  capacityRent, marketingBudget, estimatedMonthlyCost, locationStats,
} from '../../lib/demo/onboarding-data';

const F = "'Outfit', sans-serif";

/* ── shared input + select primitives ───────────────────────────────────── */

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontFamily: F, fontWeight: 500, fontSize: 14, color: 'var(--game-text-secondary)', marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  );
}

function TextField({ icon, value, onChange, placeholder, upper }: {
  icon?: React.ReactNode; value: string; onChange: (v: string) => void; placeholder: string; upper?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  const active = focus || value.length > 0;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 11, height: 52, padding: '0 18px',
      background: '#fff', borderRadius: 999,
      border: active ? '1.6px solid var(--game-cyan)' : '1px solid var(--sv-border)',
      boxShadow: active ? '0 0 0 4px rgba(0,193,235,0.10)' : '0 1px 2px rgba(0,44,51,0.04)',
      transition: 'border-color .15s ease, box-shadow .15s ease',
    }}>
      {icon && <span style={{ color: active ? 'var(--game-teal-mid)' : 'var(--game-text-muted)', display: 'flex', flexShrink: 0 }}>{icon}</span>}
      <input
        value={value}
        onChange={(e) => onChange(upper ? e.target.value.toUpperCase() : e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        placeholder={placeholder}
        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: F, fontWeight: 600, fontSize: 15, color: 'var(--game-text)', letterSpacing: upper ? '1.2px' : '-0.1px' }}
      />
    </div>
  );
}

function SelectField({ value, onChange, options, pill = true }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; pill?: boolean;
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', height: 52, padding: '0 44px 0 18px', appearance: 'none',
          background: '#fff', borderRadius: pill ? 999 : 12, border: '1px solid var(--sv-border)',
          fontFamily: F, fontWeight: 600, fontSize: 15, color: 'var(--game-text)', cursor: 'pointer', outline: 'none',
        }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={16} color="var(--game-text-muted)" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
    </div>
  );
}

/* ════════════ STAGE 1 — Basic information ════════════ */

export function BasicInfoSetup() {
  const { setup, patch, next } = useSetupController();
  const ready = setup.companyName.trim().length > 0 && setup.registrationNumber.trim().length > 0;
  return (
    <SetupShell
      stage="Stage 1: Basic Information Setup"
      footer={<SetupCTA label="Select the Location" onClick={next} disabled={!ready} />}
    >
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        <Labeled label="Enter your company name">
          <TextField icon={<Building2 size={17} />} value={setup.companyName} onChange={(v) => patch({ companyName: v })} placeholder="e.g. Dhaulagiri Cafe" />
        </Labeled>
        <Labeled label="Write your company registration number">
          <TextField icon={<Hash size={17} />} value={setup.registrationNumber} onChange={(v) => patch({ registrationNumber: v })} placeholder="e.g. 54P0UI" upper />
        </Labeled>
        <Labeled label="Company Domain">
          <SelectField value={setup.domain} onChange={(v) => patch({ domain: v })} options={COMPANY_DOMAINS.map((d) => ({ value: d, label: d }))} />
        </Labeled>
      </div>
    </SetupShell>
  );
}

/* ════════════ STAGE 2 — Location ════════════ */

function LocationCard({ index, on, onClick }: { index: number; on: boolean; onClick: () => void }) {
  const loc = LOCATIONS[index];
  const stats = locationStats(index);
  const rent = stats[0];          // lead cost row → promoted to a hero figure
  const rest = stats.slice(1);
  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.4, delay: 0.08 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      style={{
        textAlign: 'left', cursor: 'pointer', borderRadius: 16, overflow: 'hidden',
        background: 'var(--game-surface-solid)',
        border: on ? '1.6px solid var(--game-teal-mid)' : '1px solid var(--sv-border)',
        boxShadow: on ? 'var(--shadow-elev-3)' : 'var(--shadow-elev-1)',
        display: 'flex', flexDirection: 'column',
        transition: 'border-color .15s ease, box-shadow .15s ease',
      }}
    >
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* eyebrow + select indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: on ? 'var(--game-teal-mid)' : 'var(--game-text-muted)' }}>Location {index + 1}</span>
          <span style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, border: on ? 'none' : '2px solid var(--sv-border)', background: on ? 'var(--game-teal-mid)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {on && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
          </span>
        </div>

        {/* name + promoted rent figure */}
        <div>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 17, letterSpacing: '-0.3px', color: 'var(--game-text)' }}>{loc.name}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 7 }}>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 21, color: 'var(--game-negative)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.4px' }}>{rent.value}</span>
            <span style={{ fontFamily: F, fontWeight: 500, fontSize: 11, color: 'var(--game-text-secondary)' }}>/ sq ft rent</span>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--sv-border)', opacity: 0.6 }} />

        {/* secondary stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {rest.map((s) => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
              <span style={{ fontFamily: F, fontWeight: 400, fontSize: 12, color: 'var(--game-text-secondary)' }}>{s.label}</span>
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* street sketch strip — unified teal duotone band, cropped past the source vignettes */}
      <div style={{ height: 100, marginTop: 'auto', position: 'relative', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/demo/street-${index + 1}.png`}
          alt=""
          style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 82%',
            transform: 'scale(1.22)', transformOrigin: 'center bottom',
            filter: 'grayscale(1) contrast(1.16) brightness(1.04)',
          }}
        />
        {/* duotone — recolor the grayscale sketch into the teal accent (luminance preserved) */}
        <div style={{ position: 'absolute', inset: 0, background: 'var(--game-teal-mid)', mixBlendMode: 'color', opacity: 0.55, pointerEvents: 'none' }} />
        {/* depth — deepen the base of the band */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,46,51,0.22), rgba(0,46,51,0) 70%)', pointerEvents: 'none' }} />
        {/* top scrim — dissolve the hard edge into the card surface */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--game-surface-solid) 0%, rgba(255,255,255,0) 46%)', pointerEvents: 'none' }} />
      </div>
    </motion.button>
  );
}

export function LocationSetupNew() {
  const { setup, patch, next } = useSetupController();
  const [area, setArea] = useState('Kathmandu');
  const ready = setup.location !== null;
  return (
    <SetupShell
      stage="Stage 2: Choose Your Location"
      mascot="map"
      footer={<SetupCTA label="Select the Location" onClick={next} disabled={!ready} />}
    >
      <div style={{ maxWidth: 360, margin: '0 auto 30px' }}>
        <label style={{ display: 'block', textAlign: 'center', fontFamily: F, fontWeight: 600, fontSize: 13, color: 'var(--game-text-secondary)', marginBottom: 10 }}>Select Area</label>
        <SelectField value={area} onChange={setArea} options={[{ value: 'Kathmandu', label: 'Kathmandu' }]} pill={false} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, maxWidth: 1120, margin: '0 auto' }}>
        {LOCATIONS.map((_, i) => (
          <LocationCard key={i} index={i} on={setup.location === i} onClick={() => patch({ location: i })} />
        ))}
      </div>
    </SetupShell>
  );
}

/* ════════════ STAGE 3 — Capacity ════════════ */

export function CapacitySetupNew() {
  const { setup, patch, next } = useSetupController();
  return (
    <SetupShell
      stage="Stage 3: Set Initial Area Capacity"
      mascot="builder"
      footer={<>
        <TotalCostChip amount={capacityRent(setup.spaceOption)} />
        <SetupCTA label="Select the Area" onClick={next} disabled={setup.spaceOption === null} />
      </>}
    >
      <OptionGrid
        options={CAPACITY_OPTIONS.map((o) => ({ key: o.spaceIndex, value: `${o.sqft} sq ft`, sub: `Monthly Rent: $${o.monthlyRent.toLocaleString('en-US')}` }))}
        selected={setup.spaceOption}
        onSelect={(k) => patch({ spaceOption: Number(k) })}
      />
    </SetupShell>
  );
}

/* ════════════ STAGE 4 — Employee count ════════════ */

export function EmployeeSetup() {
  const { setup, patch, next } = useSetupController();
  return (
    <SetupShell
      stage="Stage 4: Initial Employee Count"
      footer={<>
        <TotalCostChip amount={estimatedMonthlyCost(setup)} />
        <SetupCTA label="Select the Count" onClick={next} disabled={setup.employeeCount === null} />
      </>}
    >
      <OptionGrid
        options={EMPLOYEE_OB.map((o) => ({ key: o.count, value: `${o.count}`, sub: `Labor Capacity: ${o.laborHours}hr/per Month` }))}
        selected={setup.employeeCount}
        onSelect={(k) => patch({ employeeCount: Number(k) })}
      />
    </SetupShell>
  );
}

/* ════════════ STAGE 5 — Marketing spend ════════════ */

export function MarketingSetup() {
  const { setup, patch, next } = useSetupController();
  return (
    <SetupShell
      stage="Stage 5: Initial Marketing Cost Spend"
      footer={<>
        <TotalCostChip amount={estimatedMonthlyCost(setup)} />
        <SetupCTA label="Select the Marketing" onClick={next} disabled={setup.marketingBudget === null} />
      </>}
    >
      <OptionGrid
        options={MARKETING_OB.map((o) => ({ key: o.pct, value: `${o.pct}%`, sub: `Est. Monthly Budget: $${o.budget.toLocaleString('en-US')}` }))}
        selected={setup.marketingBudget}
        onSelect={(k) => patch({ marketingBudget: Number(k) })}
      />
    </SetupShell>
  );
}

/* ════════════ STAGE 6 — Rent payment mode ════════════ */

export function PaymentSetup() {
  const { setup, patch, next } = useSetupController();
  return (
    <SetupShell
      stage="Stage 6: Choose how you pay your expenses upfront"
      footer={<>
        <TotalCostChip amount={estimatedMonthlyCost(setup)} />
        <SetupCTA label="Confirm Setup" onClick={next} />
      </>}
    >
      <OptionGrid
        columns={3}
        options={PAYMENT_OPTIONS.map((o) => ({ key: o.mode, value: o.label, sub: o.sub }))}
        selected={setup.rentPayment}
        onSelect={(k) => patch({ rentPayment: k as typeof setup.rentPayment })}
      />
    </SetupShell>
  );
}

/* ════════════ STAGE 7 — Summary modal ════════════ */

export function SetupSummaryNew() {
  const { setup, patch, next, back } = useSetupController();
  const locIndex = setup.location ?? 0;
  const company = setup.companyName.trim() || 'Your Company';
  const space = CAPACITY_OPTIONS.find((o) => o.spaceIndex === setup.spaceOption);

  const card: React.CSSProperties = { background: '#fff', borderRadius: 12, border: '1px solid var(--sv-border)' };

  return (
    <GridBackground className="flex flex-col min-h-screen">
      <PageTransition>
        <GameHeader />
        <div style={{ maxWidth: 'var(--max-w-page)', margin: '0 auto', padding: '24px', display: 'flex', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            style={{ width: '100%', maxWidth: 720, background: 'rgba(255,255,255,0.7)', border: '1.4px solid white', borderRadius: 20, boxShadow: '0 24px 60px rgba(0,44,51,0.16)', padding: 32 }}
          >
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 26, letterSpacing: '-0.5px', color: 'var(--game-text)', textAlign: 'center', marginBottom: 24 }}>{company}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* left — location stats */}
              <div style={{ ...card, padding: 16, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {locationStats(locIndex).map((s) => (
                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontFamily: F, fontWeight: s.lead ? 600 : 400, fontSize: 12, color: s.lead ? 'var(--game-negative)' : 'var(--game-text-secondary)' }}>{s.label}:</span>
                      <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: s.lead ? 'var(--game-negative)' : 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, height: 140, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--sv-border)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/demo/street-${locIndex + 1}.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }} />
                </div>
              </div>

              {/* right — editable */}
              <div>
                <Labeled label="Location">
                  <SelectField value={String(locIndex)} onChange={(v) => patch({ location: Number(v) })} options={LOCATIONS.map((l, i) => ({ value: String(i), label: l.name }))} pill={false} />
                </Labeled>
                <Labeled label="Cost of Marketing">
                  <SelectField value={String(setup.marketingBudget ?? MARKETING_OB[1].pct)} onChange={(v) => patch({ marketingBudget: Number(v) })} options={MARKETING_OB.map((o) => ({ value: String(o.pct), label: `${o.pct}%` }))} pill={false} />
                </Labeled>
                <Labeled label="Employee count">
                  <SelectField value={String(setup.employeeCount ?? EMPLOYEE_OB[1].count)} onChange={(v) => patch({ employeeCount: Number(v) })} options={EMPLOYEE_OB.map((o) => ({ value: String(o.count), label: String(o.count) }))} pill={false} />
                </Labeled>
                <Labeled label="Initial Area">
                  <SelectField value={String(setup.spaceOption ?? CAPACITY_OPTIONS[0].spaceIndex)} onChange={(v) => patch({ spaceOption: Number(v) })} options={CAPACITY_OPTIONS.map((o) => ({ value: String(o.spaceIndex), label: `${o.sqft} sq ft` }))} pill={false} />
                </Labeled>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <SetupCTA label="Back" onClick={back} secondary />
              <div style={{ flex: 1 }}>
                <SetupCTA label="Set up your Business" onClick={next} />
              </div>
            </div>
            <div style={{ marginTop: 12, textAlign: 'center', fontFamily: F, fontSize: 12, color: 'var(--game-text-secondary)' }}>
              {space ? `${space.sqft} sq ft` : ''} · Est. monthly cost ${estimatedMonthlyCost(setup).toLocaleString('en-US')}
            </div>
          </motion.div>
        </div>
      </PageTransition>
    </GridBackground>
  );
}

/* ════════════ STAGE 8 — Loading / building ════════════ */

export function SetupLoading() {
  const { complete } = useSetupController();
  const [pct, setPct] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const t0 = performance.now();
    const dur = 2800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else if (!done.current) { done.current = true; setTimeout(complete, 400); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridBackground className="flex flex-col min-h-screen">
      <PageTransition>
        <GameHeader />
        <div style={{ maxWidth: 'var(--max-w-page)', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 28, letterSpacing: '-0.5px', color: 'var(--game-text)', marginTop: 24 }}>
            Wait a minute — setting up your Business
          </h1>

          <motion.img
            src="/demo/ob-construction.png"
            alt=""
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            style={{ width: 420, maxWidth: '75%', height: 'auto', marginTop: 24, filter: 'drop-shadow(0 16px 30px rgba(0,44,51,0.12))' }}
          />

          <div style={{ width: 460, maxWidth: '80%', marginTop: 28 }}>
            <div style={{ height: 14, borderRadius: 999, background: 'rgba(255,255,255,0.6)', border: '1.4px solid white', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 3px' }}>
              <div style={{ width: `${pct}%`, height: 8, borderRadius: 999, background: 'linear-gradient(90deg, #4EB4C9 0%, #05687C 100%)', transition: 'width .1s linear' }} />
            </div>
          </div>

          <p style={{ fontFamily: F, fontWeight: 400, fontSize: 13.5, color: 'var(--game-text-secondary)', marginTop: 20, maxWidth: 460, lineHeight: 1.6 }}>
            According to your requirements your business is being set up. Next you&apos;ll plan the decisions
            that shape your startup. Be ready.
          </p>
        </div>
      </PageTransition>
    </GridBackground>
  );
}
