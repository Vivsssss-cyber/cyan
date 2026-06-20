import React from 'react';

/* ---- Primary CTA Button ---- */
export function PrimaryCTA({
  children,
  onClick,
  disabled = false,
  dark = false,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  dark?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 px-8 rounded-full uppercase tracking-wider transition-all
        ${dark
          ? 'bg-white text-[#002C33] hover:bg-gray-100'
          : 'bg-[#00C1EB] text-white hover:bg-[#0090AD]'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}`}
      style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1.5px', fontFamily: "'Outfit', sans-serif" }}
    >
      {children}
    </button>
  );
}

/* ---- Badge ---- */
export function Badge({
  children,
  variant = 'public',
}: {
  children: React.ReactNode;
  variant?: 'public' | 'private' | 'facilitator' | 'value' | 'standard' | 'premium' | 'custom';
  bg?: string;
}) {
  const colors: Record<string, string> = {
    public: 'bg-[#00A0C2]',
    private: 'bg-[#003D47]',
    facilitator: 'bg-[#D4590A]',
    value: 'bg-[#475569]',
    standard: 'bg-[#006E85]',
    premium: 'bg-[#1e293b]',
    custom: 'bg-[#7C3AED]',
  };

  return (
    <span
      className={`inline-block ${colors[variant] || colors.public} text-white uppercase px-2 py-0.5 rounded`}
      style={{ fontSize: '0.6rem', letterSpacing: '1.5px', fontWeight: 700 }}
    >
      {children}
    </span>
  );
}

/* ---- Mono Value ---- */
export function MonoValue({
  children,
  color,
  size = 'md',
}: {
  children: React.ReactNode;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizes = { sm: '0.8rem', md: '1rem', lg: '1.4rem', xl: '2rem' };
  return (
    <span
      style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: sizes[size],
        color: color || '#002C33',
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {children}
    </span>
  );
}

/* ---- Step Progress ---- */
export function StepProgress({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="flex items-center justify-center gap-1 py-4">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex items-center gap-1.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.7rem] font-bold
                ${i < currentStep ? 'bg-[#00C1EB] text-white' : i === currentStep ? 'bg-[#003D47] text-white' : 'bg-[#C8DDE6] text-[#64748B]'}`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span
              className={`text-[0.7rem] uppercase tracking-wider hidden sm:inline
                ${i === currentStep ? 'text-[#002C33] font-bold' : 'text-[#64748B]'}`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 h-0.5 mx-1 ${i < currentStep ? 'bg-[#00C1EB]' : 'bg-[#C8DDE6]'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ---- Impact Tag ---- */
export function ImpactTag({ text }: { text: string }) {
  return (
    <span
      className="inline-block bg-[#E0F7FF] text-[#006E85] px-2 py-0.5 rounded"
      style={{ fontSize: '0.65rem', fontWeight: 600 }}
    >
      {text}
    </span>
  );
}

/* ---- Timing Badge ---- */
export function TimingBadge({ immediate }: { immediate: boolean }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded ${immediate ? 'bg-[#E0F7FF] text-[#006E85]' : 'bg-[#FEF3C7] text-[#B45309]'}`}
      style={{ fontSize: '0.65rem', fontWeight: 600 }}
    >
      {immediate ? '⚡ Effect: This Week' : '🕐 Effect: Week +4'}
    </span>
  );
}

/* ---- Nav Header ---- */
export function NavHeader({
  dark = false,
  right,
}: {
  dark?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <div
      className={`sticky top-0 z-50 flex items-center justify-between px-6 py-3 backdrop-blur-md
        ${dark ? 'bg-[#002C33]/90 border-b border-white/10' : 'bg-[#F0F6FA]/90 border-b border-[#C8DDE6]'}`}
    >
      <div className="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 80 80" fill="none">
          <path d="M40 8L68 22V58L40 72L12 58V22L40 8Z"
            fill={dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,193,235,0.15)'}
          />
          <path d="M40 12L64 24V56L40 68L16 56V24L40 12Z"
            fill="none" stroke={dark ? '#CBD5E1' : '#00C1EB'} strokeWidth="2"
          />
          <path d="M50 28C44 24 34 24 28 30C22 36 22 48 28 54C34 60 44 60 50 56"
            fill="none" stroke={dark ? '#FFF' : '#003D47'} strokeWidth="3" strokeLinecap="round"
          />
        </svg>
        <span
          className="tracking-wider"
          style={{ fontWeight: 800, fontSize: '0.75rem', color: dark ? '#FFF' : '#002C33', letterSpacing: '2px', fontFamily: "'Outfit', sans-serif" }}
        >
          STARTUP VALLEY
        </span>
      </div>
      {right}
    </div>
  );
}

/* ---- Format helpers ---- */
export function formatCurrency(val: number): string {
  return '$' + val.toLocaleString('en-US');
}

export function formatNumber(val: number): string {
  return val.toLocaleString('en-US');
}