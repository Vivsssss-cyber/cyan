import React from 'react';
import { useAppNavigate } from '../../lib/use-app-navigate';
import { useGame } from '../context/GameContext';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { GameButton } from './GameButton';
import { PageTransition } from './PageTransition';

function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <div className={`w-[27px] h-[27px] rounded-full flex items-center justify-center transition-colors ${
      selected ? 'bg-[#156162]' : 'bg-[#CBD8D8]'
    }`}>
      <div className="w-[14px] h-[14px] rounded-full bg-[#F9FAFB]" />
    </div>
  );
}

function SelectionCard({
  label,
  title,
  subtitle,
  selected,
  onClick,
  children,
}: {
  label: string;
  title: string;
  subtitle?: string;
  selected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-2xl p-6 text-left transition-all hover:shadow-lg cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.6)',
        border: selected ? '1.4px solid rgba(21,97,98,0.33)' : '1.4px solid white',
        boxShadow: selected ? '0px 2.5px 10px 0px rgba(77,181,182,0.29)' : '0px 2.5px 10px 0px rgba(255,255,255,0)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
          {label}
        </span>
        <RadioIndicator selected={selected} />
      </div>
      <h3
        className="text-[#202326]"
        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '24px', letterSpacing: '-0.29px' }}
      >
        {title}
      </h3>
      {subtitle && (
        <p className="text-[#c65252] mt-1" style={{ fontSize: '16px' }}>
          {subtitle}
        </p>
      )}
      {children}
    </button>
  );
}

const positioningOptions = [
  {
    id: 'VALUE',
    label: 'Value',
    priceBand: '$5 – $12 AOV',
    opsLevel: 'Basic',
    affinity: 'Low',
    quote: 'Good enough food at a great price — customers come for deals.',
  },
  {
    id: 'STANDARD',
    label: 'Standard',
    priceBand: '$12 – $22 AOV',
    opsLevel: 'Standard',
    affinity: 'Moderate',
    quote: 'Reliable quality, fair pricing — the everyday restaurant.',
  },
  {
    id: 'PREMIUM',
    label: 'Premium',
    priceBand: '$22 – $40 AOV',
    opsLevel: 'High',
    affinity: 'High',
    quote: 'Exceptional experience — customers expect the best.',
  },
];

export function TeamSetup() {
  const { state, setEmployeeCount, setMarketingBudget, setPositioning } = useGame();
  const navigate = useAppNavigate();
  const allComplete = state.employeeCount !== null && state.marketingBudget !== null && state.positioning !== null;

  return (
    <GridBackground className="flex flex-col">
      <PageTransition>
      <GameHeader />

      <div className="max-w-[1288px] mx-auto px-6 w-full pb-32">
        <h1
          className="text-center text-[#202326] mb-8"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '32px', letterSpacing: '-0.32px' }}
        >
          Lets set up your Business
        </h1>

        {/* Stage 3 — Employee Count */}
        <div className="mb-10">
          <p
            className="text-[#202326] mb-6"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '24px', letterSpacing: '-0.29px' }}
          >
            Stage 3: Employee Count
          </p>
          <p className="text-[#606569] mb-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
            First productive week: Week 5 (4-week hiring delay applies)
          </p>
          <div className="flex gap-6">
            {[3, 5, 7, 10].map((count) => (
              <SelectionCard
                key={count}
                label={`${count} employees`}
                title={count.toString()}
                subtitle={`$${(count * 800).toLocaleString()}/wk`}
                selected={state.employeeCount === count}
                onClick={() => setEmployeeCount(count)}
              />
            ))}
          </div>
        </div>

        {/* Stage 4 — Marketing Budget */}
        <div className="mb-10">
          <p
            className="text-[#202326] mb-6"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '24px', letterSpacing: '-0.29px' }}
          >
            Stage 4: Marketing Budget
          </p>
          <p className="text-[#606569] mb-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
            Split across acquisition, retention, and repurchase each week
          </p>
          <div className="flex gap-6">
            {[1, 2, 3, 5].map((pct) => (
              <SelectionCard
                key={pct}
                label={`${pct}% of revenue`}
                title={`${pct}%`}
                subtitle={`~$${(pct * 1000).toLocaleString()}/wk`}
                selected={state.marketingBudget === pct}
                onClick={() => setMarketingBudget(pct)}
              />
            ))}
          </div>
        </div>

        {/* Stage 5 — Positioning */}
        <div className="mb-10">
          <p
            className="text-[#202326] mb-6"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '24px', letterSpacing: '-0.29px' }}
          >
            Stage 5: Positioning
          </p>
          <div className="flex gap-6">
            {positioningOptions.map((pos) => (
              <SelectionCard
                key={pos.id}
                label={pos.priceBand}
                title={pos.label}
                selected={state.positioning === pos.id}
                onClick={() => setPositioning(pos.id)}
              >
                <p className="text-[#606569] mt-3 italic" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', lineHeight: 1.5 }}>
                  "{pos.quote}"
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#f0f2f4] text-[#606569]" style={{ fontSize: '12px' }}>
                    Ops: {pos.opsLevel}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#f0f2f4] text-[#606569]" style={{ fontSize: '12px' }}>
                    Affinity: {pos.affinity}
                  </span>
                </div>
              </SelectionCard>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-[853px] mx-auto flex gap-4">
          <GameButton variant="secondary" onClick={() => navigate('/setup/capacity')}>
            Back
          </GameButton>
          <GameButton
            onClick={() => {
              if (allComplete) navigate('/setup/summary');
            }}
            disabled={!allComplete}
          >
            Review Setup
          </GameButton>
        </div>
      </div>
      </PageTransition>
    </GridBackground>
  );
}
