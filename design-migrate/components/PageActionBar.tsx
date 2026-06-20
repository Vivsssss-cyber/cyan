import React from 'react';

const FO = "'Outfit', sans-serif";

export interface PageAction {
  label: string;
  variant: 'primary' | 'ghost';
  onClick?: () => void;
}

interface PageActionBarProps {
  actions: PageAction[];
  className?: string;
}

/**
 * Glass pill container holding primary + ghost action buttons.
 * Source: Figma node 7135-41591 (NavigationBar).
 * Always place in page header row, right-aligned.
 */
export function PageActionBar({ actions, className = '' }: PageActionBarProps) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.6)',
        border: '1px solid white',
        borderRadius: '70px',
        padding: '4px 8px',
        gap: '0px',
      }}
    >
      {actions.map((action, i) => (
        action.variant === 'primary' ? (
          <button
            key={i}
            onClick={action.onClick}
            style={{
              fontFamily: FO, fontWeight: 500, fontSize: '12px',
              color: 'white', whiteSpace: 'nowrap',
              background: 'linear-gradient(180deg, #00B1D6 -180.36%, #0090AD 105.36%)',
              border: 'none', borderRadius: '30px',
              padding: '8px 18px', cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {action.label}
          </button>
        ) : (
          <button
            key={i}
            onClick={action.onClick}
            style={{
              fontFamily: FO, fontWeight: 500, fontSize: '12px',
              color: '#212121', whiteSpace: 'nowrap',
              background: 'none', border: 'none', borderRadius: '40px',
              padding: '8px 12px', cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            {action.label}
          </button>
        )
      ))}
    </div>
  );
}
