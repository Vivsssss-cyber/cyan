'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Hash, ArrowRight, CalendarRange, Repeat, LineChart, Trophy } from 'lucide-react';
import { useAppNavigate } from '../lib/use-app-navigate';
import { PageTransition } from './PageTransition';

const F = "'Outfit', sans-serif";

function BrandMark({ light = false }: { light?: boolean }) {
  // Using the new cyan logo provided by the user
  return (
    <img 
      src="/demo/cyan-logo.png" 
      alt="Cyan Innovations" 
      style={{ height: 42, filter: light ? 'brightness(0) invert(1)' : 'none' }} 
    />
  );
}

function Field({
  label, icon, value, onChange, placeholder, upper = false,
}: {
  label: string; icon: React.ReactNode; value: string; onChange: (v: string) => void; placeholder: string; upper?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="mb-5">
      <label style={{ display: 'block', fontFamily: F, fontWeight: 700, fontSize: 14, color: '#0F172A', marginBottom: 8 }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, height: 52, padding: '0 16px',
        background: '#fff', borderRadius: 12,
        border: active ? '1.6px solid var(--game-cyan)' : '1px solid #CBD5E1',
        boxShadow: active ? '0 0 0 4px rgba(0,193,235,0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
        transition: 'border-color .15s ease, box-shadow .15s ease',
      }}>
        <span style={{ color: active ? 'var(--game-teal-mid)' : '#94A3B8', display: 'flex', flexShrink: 0, transition: 'color .15s ease' }}>
          {icon}
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(upper ? e.target.value.toUpperCase() : e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: F, fontWeight: 500, fontSize: 15, color: '#334155',
            letterSpacing: upper ? '1.5px' : '-0.1px',
          }}
        />
      </div>
    </div>
  );
}

const HINTS = [
  { Icon: CalendarRange, label: '12 monthly rounds' },
  { Icon: Repeat, label: 'Quarterly checkpoints' },
  { Icon: LineChart, label: 'Annual DCF valuation' },
  { Icon: Trophy, label: 'Founder leaderboard' },
];

export function TrainingIntro() {
  const navigate = useAppNavigate();
  const [name, setName] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');

  const canProceed = name.trim().length > 0 && lobbyCode.trim().length > 0;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col lg:flex-row bg-white w-full">
        
        {/* ── Left — identity form ─────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-between p-8 lg:p-16 lg:px-24">
          <div>
            <BrandMark />
          </div>

          <div className="max-w-[440px] w-full mx-auto lg:mx-0 my-16">
            <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 38, letterSpacing: '-0.8px', color: '#0F172A', lineHeight: 1.15 }}>
              Take ownership of<br />your business.
            </h1>
            <p style={{ fontFamily: F, fontWeight: 400, fontSize: 15, color: '#64748B', marginTop: 16, lineHeight: 1.6, marginBottom: 36 }}>
              Cyan Innovations teaches business through interactive simulation. Enter your name and lobby code to step in as founder and start building.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Field
                label="Your name"
                icon={<User size={18} />}
                value={name}
                onChange={setName}
                placeholder="Your full name"
              />
              <Field
                label="Lobby code"
                icon={<Hash size={18} />}
                value={lobbyCode}
                onChange={setLobbyCode}
                placeholder="e.g. 54P0UI"
                upper
              />
            </div>

            <button
              onClick={() => { if (canProceed) navigate('/welcome'); }}
              disabled={!canProceed}
              style={{
                marginTop: 24, width: '100%', maxWidth: 220,
                display: 'flex', alignItems: 'center', justifyItems: 'center', gap: 10,
                padding: '14px 24px', borderRadius: 'var(--game-cta-radius)', border: 'none',
                background: canProceed ? 'var(--game-cta-gradient)' : '#E2E8F0',
                color: canProceed ? '#fff' : '#94A3B8', fontFamily: F, fontWeight: 600, fontSize: 15,
                cursor: canProceed ? 'pointer' : 'not-allowed',
                boxShadow: canProceed ? '0 6px 16px rgba(0,144,173,0.3)' : 'none',
                transition: 'opacity .15s ease, box-shadow .15s ease, transform .1s ease, background .15s ease, color .15s ease',
                justifyContent: 'center',
              }}
            >
              Enter Game
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: canProceed ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={14} />
              </span>
            </button>
          </div>

          <div style={{ fontFamily: F, fontWeight: 500, fontSize: 13, color: '#94A3B8' }}>
            Cyan Innovations · Educational simulation
          </div>
        </div>

        {/* ── Right — immersive brand panel ────────────────────── */}
        <div className="lg:w-[48%] xl:w-[45%] relative flex flex-col justify-between p-10 lg:p-16 lg:px-20" style={{
          backgroundColor: '#001C22',
        }}>
          {/* hex pattern background */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/demo/hex-pattern.png)',
            backgroundSize: '480px',
            backgroundRepeat: 'repeat',
            opacity: 0.35,
            pointerEvents: 'none',
          }} />
          {/* cyan glow to blend pattern into content gently */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(120% 90% at 80% 0%, rgba(10,85,102,0.6) 0%, rgba(0,60,73,0.4) 38%, transparent 100%)',
            pointerEvents: 'none'
          }} />

          {/* cyan glow top right */}
          <div style={{
            position: 'absolute', top: '-10%', right: '-8%', width: 420, height: 420, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,193,235,0.25) 0%, transparent 70%)', pointerEvents: 'none',
          }} />

          <div className="relative z-10 flex justify-end">
            <BrandMark light />
          </div>

          <div className="relative z-10 my-auto pt-10 pb-16">
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: F, fontWeight: 800, fontSize: 36, letterSpacing: '-0.6px', color: '#fff', lineHeight: 1.15, maxWidth: 480 }}
            >
              Five years. Sixty decisions.<br />One company you build.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: F, fontWeight: 400, fontSize: 15, color: 'rgba(255,255,255,0.72)', marginTop: 18, lineHeight: 1.6, maxWidth: 420 }}
            >
              Run a retail business month by month. Pricing, stock, marketing and people all compound into the valuation that decides how you finish.
            </motion.p>

            {/* hint chips */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 36, maxWidth: 460 }}>
              {HINTS.map(({ Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.18 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <Icon size={16} color="#5FD3EE" style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: F, fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.92)' }}>{label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* founder mascot — bottom right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.3 }}
            style={{ position: 'absolute', right: 30, bottom: 0, width: 220, height: 320, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo/progress-mascot.png"
              alt="Founder character"
              style={{ position: 'absolute', width: '232.48%', height: '109.52%', left: '-61.52%', top: '-9.52%', maxWidth: 'none', filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.4))' }}
            />
          </motion.div>

          <div className="relative z-10 flex items-center justify-between">
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.5)', maxWidth: 180 }}>
              You are the founder-management team.
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
