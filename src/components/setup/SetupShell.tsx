'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Tag } from 'lucide-react';
import { GridBackground } from '../GridBackground';
import { GameHeader } from '../GameHeader';
import { PageTransition } from '../PageTransition';

const F = "'Outfit', sans-serif";

export function SetupCTA({
  label, onClick, disabled, secondary,
}: {
  label: string; onClick: () => void; disabled?: boolean; secondary?: boolean;
}) {
  if (secondary) {
    return (
      <button
        onClick={onClick}
        style={{
          minWidth: 200, padding: '13px 26px', borderRadius: 'var(--game-cta-radius)',
          border: '1.4px solid var(--sv-border)', background: '#fff', cursor: 'pointer',
          fontFamily: F, fontWeight: 600, fontSize: 14.5, color: 'var(--game-text)',
        }}
      >
        {label}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 320, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '14px 26px', borderRadius: 'var(--game-cta-radius)', border: 'none',
        background: disabled ? 'var(--sv-border)' : 'var(--game-cta-gradient)',
        color: '#fff', fontFamily: F, fontWeight: 600, fontSize: 15,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.7 : 1,
        transition: 'opacity .15s ease, filter .15s ease',
      }}
    >
      {label}
      <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ArrowRight size={14} />
      </span>
    </button>
  );
}

export function TotalCostChip({ amount }: { amount: number }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 12,
      background: 'var(--game-surface-solid)', border: '1px solid var(--sv-border)', boxShadow: 'var(--shadow-elev-1)',
    }}>
      <span style={{ fontFamily: F, fontWeight: 600, fontSize: 14, color: 'var(--game-text)' }}>Total Cost:</span>
      <span style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: 'var(--game-negative)', fontVariantNumeric: 'tabular-nums' }}>
        ${amount.toLocaleString('en-US')}
      </span>
      <Tag size={15} color="var(--game-text-muted)" />
    </div>
  );
}

export function SetupShell({
  stage, title = 'Lets set up your Business', children, footer, mascot,
}: {
  stage: string;
  title?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  mascot?: 'builder' | 'map';
}) {
  return (
    <GridBackground className="flex flex-col min-h-screen">
      <PageTransition>
        <GameHeader />
        <div style={{ maxWidth: 'var(--max-w-page)', width: '100%', margin: '0 auto', padding: '8px 24px 48px', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginTop: 16, marginBottom: 32 }}
          >
            <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 30, letterSpacing: '-0.5px', color: 'var(--game-text)' }}>{title}</h1>
            <p style={{ fontFamily: F, fontWeight: 500, fontSize: 17, color: 'var(--game-text-secondary)', marginTop: 8 }}>{stage}</p>
          </motion.div>

          {children}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 36 }}>
            {footer}
          </div>

          {mascot && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.25 }}
              style={{ position: 'absolute', right: mascot === 'builder' ? 40 : 16, bottom: mascot === 'builder' ? -4 : 8, pointerEvents: 'none' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mascot === 'builder' ? '/demo/ob-builder.png' : '/demo/ob-map-mascot.png'}
                alt=""
                style={{ width: mascot === 'builder' ? 150 : 120, height: 'auto', filter: 'drop-shadow(0 12px 24px rgba(0,44,51,0.16))' }}
              />
            </motion.div>
          )}
        </div>
      </PageTransition>
    </GridBackground>
  );
}
