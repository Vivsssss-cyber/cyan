'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Zap as Rocket, ChevronRight as ArrowRight, LayoutGrid } from '../PixelIcons';
import { GridBackground } from '../GridBackground';
import { PageTransition } from '../PageTransition';
import { SimPage, SectionLabel, GlassCard, Tag, DISPLAY, DATA, ink, muted, cyan, tealMid } from './sim-ui';

function FlowCard({
  eyebrow,
  title,
  steps,
  icon,
  onClick,
}: {
  eyebrow: string;
  title: string;
  steps: string[];
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <GlassCard
      onClick={onClick}
      className="sim-flow-card"
      style={{ padding: 28, cursor: 'pointer', transition: 'transform .18s ease' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: '#E0F7FF',
            color: tealMid,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, letterSpacing: '1.8px', textTransform: 'uppercase', color: tealMid }}>
            {eyebrow}
          </div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 22, color: ink, letterSpacing: '-0.4px', marginTop: 2 }}>
            {title}
          </div>
        </div>
      </div>

      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((s, i) => (
          <li key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: '1.4px solid ' + cyan,
                color: tealMid,
                fontFamily: DATA,
                fontSize: 12,
                fontWeight: 700,
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {i + 1}
            </span>
            <span style={{ fontFamily: DISPLAY, fontSize: 14, color: muted }}>{s}</span>
          </li>
        ))}
      </ol>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 22, color: tealMid, fontFamily: DISPLAY, fontWeight: 600, fontSize: 14 }}>
        Start flow <ArrowRight size={16} />
      </div>
    </GlassCard>
  );
}

export function SimHub() {
  const router = useRouter();
  return (
    <GridBackground>
      <PageTransition>
        <SimPage maxWidth={1000}>
          <div style={{ marginBottom: 6 }}>
            <Tag>CyanSim · Deliverable 1</Tag>
          </div>
          <SectionLabel
            eyebrow="CyanSim Platform"
            title="Three surfaces, one platform"
            sub="Pick a surface. Each is wired into /sim routing, styled with the Cyan design system and Streamline Pixel icons — admins build the game, teachers facilitate, students decide."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            <FlowCard
              eyebrow="Module 1 · Admin"
              title="Build a scenario"
              icon={<LayoutGrid size={22} />}
              steps={['Studio dashboard', 'Blocks & canvas', 'Decisions · KPIs · events', 'Balance & publish']}
              onClick={() => router.push('/sim/admin')}
            />
            <FlowCard
              eyebrow="Module 3 · Teacher"
              title="Launch a scenario"
              icon={<Rocket size={22} />}
              steps={['Facilitator home', 'Scenario library', '4-step setup wizard', 'Live facilitation monitor']}
              onClick={() => router.push('/sim/teacher')}
            />
            <FlowCard
              eyebrow="Module 4 · Student"
              title="Decide + voice"
              icon={<GraduationCap size={22} />}
              steps={['Team dashboard + brief', 'Decision areas', 'Rationale & evidence', 'Locked in']}
              onClick={() => router.push('/sim/play')}
            />
          </div>
        </SimPage>
      </PageTransition>

      <style>{`.sim-flow-card:hover{transform:translateY(-3px);}`}</style>
    </GridBackground>
  );
}
