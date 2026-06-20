import React from 'react';

const FO = "'Outfit', sans-serif";

export interface TabItem {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

/**
 * Glass pill tab bar — Overview / Finance / Inventory style.
 * Active tab: DS cyan gradient. Inactive: transparent #606569.
 * No icons on tabs.
 */
export function TabBar({ tabs, activeTab, onChange, className = '' }: TabBarProps) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        background: 'rgba(255,255,255,0.6)',
        border: '1px solid white',
        borderRadius: '70px',
        padding: '4px 8px',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            fontFamily: FO, fontSize: '13px', fontWeight: activeTab === tab.id ? 700 : 600,
            padding: '9px 20px', borderRadius: activeTab === tab.id ? '30px' : '40px',
            border: 'none', cursor: 'pointer',
            background: activeTab === tab.id ? 'var(--game-cta-gradient)' : 'transparent',
            color: activeTab === tab.id ? 'white' : '#606569',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            if (activeTab !== tab.id) e.currentTarget.style.color = '#202326';
          }}
          onMouseLeave={e => {
            if (activeTab !== tab.id) e.currentTarget.style.color = '#606569';
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
