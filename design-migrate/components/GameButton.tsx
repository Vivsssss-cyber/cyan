import React from 'react';

interface GameButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function GameButton({ children, onClick, disabled = false, variant = 'primary', className = '' }: GameButtonProps) {
  if (variant === 'secondary') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-4 px-6 rounded-full border border-[#d1d5db] bg-white text-[#202326] transition-all hover:bg-gray-50 ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: '15px' }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full relative transition-all hover:shadow-lg active:-translate-y-px ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      style={{
        display: 'flex',
        padding: '1px 4px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '43px',
        background: 'linear-gradient(180deg, #00B1D6 -180.36%, #0090AD 105.36%)',
        border: 'none',
      }}
    >
      <div className="flex items-center justify-center gap-2 px-5 py-3">
        <span
          className="text-white whitespace-nowrap"
          style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '15px' }}
        >
          {children}
        </span>
        <div className="bg-white/20 rounded-full w-7 h-7 flex items-center justify-center shrink-0">
          <svg width="11" height="11" viewBox="0 0 12 10" fill="none">
            <path d="M1 5H11M11 5L7 1M11 5L7 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </button>
  );
}