'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info, ThumbsUp, Mic } from '../PixelIcons';
import { SimStudentShell, DeckCard } from './SimShell';
import { SelectInput } from './admin-ui';
import { VoiceRecorder } from './RationaleCapture';
import { CtaButton, OutlineButton, GhostButton, Eyebrow, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, cyanTint, whisper, surfaceSoft } from './sim-ui';

function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', background: cyanTint, borderRadius: 10, padding: '11px 14px', marginTop: 16 }}>
      <Info size={15} color={tealMid} style={{ marginTop: 1, flexShrink: 0 }} />
      <span style={{ fontFamily: DATA, fontSize: 12.5, color: tealMid, lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}

/* ════════════ 72 · Student Voice Note Capture ════════════ */
export function SimStudentVoice() {
  const router = useRouter();
  const [t, setT] = useState('');
  return (
    <SimStudentShell>
      <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: ink, letterSpacing: '-0.5px' }}>Voice Reflection</h1>
      <p style={{ fontFamily: DISPLAY, fontSize: 14.5, color: muted, marginTop: 5, marginBottom: 18 }}>Team: Blue Horizon · Round 10</p>
      <DeckCard style={{ padding: 24, maxWidth: 720 }}>
        <Eyebrow>Prompt</Eyebrow>
        <p style={{ fontFamily: DISPLAY, fontSize: 17, lineHeight: 1.6, color: ink, marginTop: 10, marginBottom: 4 }}>What was the most important decision your team made this round, and why?</p>
        <VoiceRecorder transcript={t} onTranscript={setT} />
        <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, marginTop: 8 }}>Max 90 seconds</div>
        <InfoNote>Your voice note will be transcribed and linked to your decisions and assumptions.</InfoNote>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
          <GhostButton onClick={() => setT('')}>Discard</GhostButton>
          <CtaButton onClick={() => router.push('/sim/play')}>Save recording</CtaButton>
        </div>
      </DeckCard>
    </SimStudentShell>
  );
}

/* ════════════ 73 · Team Voice Note Capture ════════════ */
export function SimTeamVoice() {
  const router = useRouter();
  const [t, setT] = useState('');
  return (
    <SimStudentShell>
      <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: ink, letterSpacing: '-0.5px' }}>Team Reflection</h1>
      <p style={{ fontFamily: DISPLAY, fontSize: 14.5, color: muted, marginTop: 5, marginBottom: 18 }}>Team: Blue Horizon · Round 10</p>
      <DeckCard style={{ padding: 24, maxWidth: 720 }}>
        <Eyebrow>Prompt</Eyebrow>
        <p style={{ fontFamily: DISPLAY, fontSize: 17, lineHeight: 1.6, color: ink, marginTop: 10, marginBottom: 4 }}>Reflect on your team&apos;s overall performance this round and what you would do differently next round.</p>
        <VoiceRecorder transcript={t} onTranscript={setT} />
        <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, marginTop: 8 }}>Max 120 seconds</div>
        <InfoNote>This reflection will be visible to your teacher and mentor for coaching and feedback.</InfoNote>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
          <GhostButton onClick={() => setT('')}>Discard</GhostButton>
          <CtaButton onClick={() => router.push('/sim/play')}>Save recording</CtaButton>
        </div>
      </DeckCard>
    </SimStudentShell>
  );
}

/* ════════════ 77 · Peer Feedback Exchange ════════════ */
interface Peer { from: string; when: string; text: string; likes: number }
const RECEIVED: Peer[] = [
  { from: 'Growth Gurus', when: 'May 23, 11:05 AM', text: 'Strong strategy on brand awareness. Curious how you’ll measure lift in repeat purchases.', likes: 2 },
  { from: 'Market Movers', when: 'May 23, 10:58 AM', text: 'Love the pricing adjustment. Watch margins if discounting continues.', likes: 1 },
];
export function SimPeerFeedback() {
  const router = useRouter();
  const [to, setTo] = useState('Growth Gurus');
  const [text, setText] = useState('');
  return (
    <SimStudentShell>
      <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: ink, letterSpacing: '-0.5px' }}>Peer Feedback</h1>
      <p style={{ fontFamily: DISPLAY, fontSize: 14.5, color: muted, marginTop: 5, marginBottom: 20 }}>Team: Blue Horizon · Round 10 · All peers</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: 18, alignItems: 'start' }}>
        <div>
          <Eyebrow>Received feedback</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
            {RECEIVED.map((p) => (
              <DeckCard key={p.from} style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13.5, color: ink }}>From {p.from}</span>
                  <span style={{ fontFamily: DATA, fontSize: 11.5, color: faint }}>{p.when}</span>
                </div>
                <p style={{ fontFamily: DATA, fontSize: 13.5, lineHeight: 1.55, color: body, margin: '8px 0 0' }}>{p.text}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, color: tealMid }}>
                  <ThumbsUp size={14} color={tealMid} /><span style={{ fontFamily: DATA, fontSize: 12.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{p.likes}</span>
                </div>
              </DeckCard>
            ))}
          </div>
        </div>

        <DeckCard style={{ padding: 20 }}>
          <Eyebrow>Give feedback</Eyebrow>
          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block', fontFamily: DATA, fontSize: 13, fontWeight: 600, color: body, marginBottom: 7 }}>To team</label>
            <SelectInput value={to} onChange={setTo} options={['Growth Gurus', 'Market Movers', 'Visionary Minds', 'Peak Performers']} />
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value.slice(0, 250))} placeholder="Your insight here…" style={{ width: '100%', minHeight: 100, marginTop: 14, fontFamily: DATA, fontSize: 14, lineHeight: 1.6, color: ink, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 8, padding: 12, resize: 'vertical' }} />
          <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, marginTop: 6, textAlign: 'right' }}>{text.length}/250</div>
          <div style={{ marginTop: 14 }}><CtaButton full disabled={text.trim().length === 0} reason={text.trim().length === 0 ? 'Write your feedback first' : undefined} onClick={() => { setText(''); router.push('/sim/play'); }}>Send feedback</CtaButton></div>
        </DeckCard>
      </div>
    </SimStudentShell>
  );
}
