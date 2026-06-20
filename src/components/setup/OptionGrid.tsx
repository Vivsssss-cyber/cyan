'use client';

import React from 'react';
import { motion } from 'motion/react';

const F = "'Outfit', sans-serif";

export interface GridOption {
  /** Stable key + selection identity. */
  key: string | number;
  /** Big headline value, e.g. "3500 sq ft" or "3". */
  value: string;
  /** Red sub line, e.g. "Monthly Rent: $15,000". */
  sub: string;
}

function Radio({ on }: { on: boolean }) {
  return (
    <span style={{
      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
      border: on ? 'none' : '2px solid var(--sv-border)',
      background: on ? 'var(--game-teal-mid)' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {on && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
    </span>
  );
}

export function OptionGrid({
  options, selected, onSelect, columns = 4,
}: {
  options: GridOption[];
  selected: string | number | null;
  onSelect: (key: string | number) => void;
  columns?: number;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 16, maxWidth: 1000, margin: '0 auto' }}>
      {options.map((o, i) => {
        const on = selected === o.key;
        return (
          <motion.button
            key={o.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onSelect(o.key)}
            style={{
              textAlign: 'left', cursor: 'pointer', padding: 20, borderRadius: 16,
              background: 'var(--game-surface-solid)',
              border: on ? '1.6px solid var(--game-teal-mid)' : '1px solid var(--sv-border)',
              boxShadow: on ? 'var(--shadow-elev-3)' : 'var(--shadow-elev-1)',
              transition: 'border-color .15s ease, box-shadow .15s ease, transform .1s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: F, fontWeight: 500, fontSize: 13, color: 'var(--game-text-secondary)' }}>Option {i + 1}</span>
              <Radio on={on} />
            </div>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 22, color: 'var(--game-text)', marginTop: 12, letterSpacing: '-0.4px' }}>
              {o.value}
            </div>
            <div style={{ fontFamily: F, fontWeight: 500, fontSize: 12.5, color: 'var(--game-negative)', marginTop: 6 }}>
              {o.sub}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
