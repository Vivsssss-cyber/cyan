import React from 'react';
import { useAppNavigate } from '../../lib/use-app-navigate';
import { useGame } from '../context/GameContext';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { GameButton } from './GameButton';
import { PageTransition } from './PageTransition';

export function SetupSummary() {
  const { state, locations, spaceOptions, getMonthlyRent, getWeeklyBurn, getRunway, getMaxCustomers } = useGame();
  const navigate = useAppNavigate();

  const loc = state.location !== null ? locations[state.location] : null;
  const space = state.spaceOption !== null ? spaceOptions[state.spaceOption] : null;
  const weeklyBurn = getWeeklyBurn();
  const runway = getRunway();
  const maxCustomers = getMaxCustomers();

  const posLabels: Record<string, string> = { VALUE: 'Value', STANDARD: 'Standard', PREMIUM: 'Premium' };

  return (
    <GridBackground className="flex flex-col">
      <PageTransition>
      <GameHeader />

      <div className="max-w-[1288px] mx-auto px-6 w-full pb-16">
        <h1
          className="text-center text-[#202326] mb-2"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '32px', letterSpacing: '-0.32px' }}
        >
          Your Restaurant Setup
        </h1>
        <p className="text-center text-[#606569] mb-10" style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px' }}>
          Review your choices before beginning Week 1
        </p>

        {/* Summary cards */}
        <div className="flex gap-6 mb-8">
          <SummaryCard label="Location" value={loc?.name || '—'} detail={loc ? `$${loc.rent}/sq ft` : ''} />
          <SummaryCard label="Space" value={space ? `${space.sqft.toLocaleString()} sq ft` : '—'} detail={`Max ${maxCustomers} customers`} />
          <SummaryCard label="Employees" value={state.employeeCount?.toString() || '—'} detail={state.employeeCount ? `$${(state.employeeCount * 800).toLocaleString()}/wk` : ''} />
          <SummaryCard label="Marketing" value={state.marketingBudget ? `${state.marketingBudget}%` : '—'} detail={state.marketingBudget ? `~$${(state.marketingBudget * 1000).toLocaleString()}/wk` : ''} />
          <SummaryCard label="Positioning" value={state.positioning ? posLabels[state.positioning] : '—'} detail="" />
        </div>

        {/* Engine estimates */}
        <div className="flex gap-6 mb-10">
          <div
            className="flex-1 bg-white/60 rounded-2xl p-6 text-center"
            style={{ border: '1.4px solid white' }}
          >
            <p className="text-[#606569] mb-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
              Est. Weekly Capacity
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '36px', color: '#156162', fontVariantNumeric: 'tabular-nums' }}>
              {maxCustomers}
            </p>
            <p className="text-[#606569]" style={{ fontSize: '13px' }}>customers/week</p>
          </div>
          <div
            className="flex-1 bg-white/60 rounded-2xl p-6 text-center"
            style={{ border: '1.4px solid white' }}
          >
            <p className="text-[#606569] mb-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
              Est. Weekly Burn
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '36px', color: '#c65252', fontVariantNumeric: 'tabular-nums' }}>
              ${weeklyBurn.toLocaleString()}
            </p>
            <p className="text-[#606569]" style={{ fontSize: '13px' }}>rent + labour + marketing</p>
          </div>
          <div
            className="flex-1 bg-white/60 rounded-2xl p-6 text-center"
            style={{ border: '1.4px solid white' }}
          >
            <p className="text-[#606569] mb-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
              Est. Runway
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '36px', color: runway > 26 ? '#156162' : runway > 8 ? '#B45309' : '#c65252', fontVariantNumeric: 'tabular-nums' }}>
              {runway} wks
            </p>
            <p className="text-[#606569]" style={{ fontSize: '13px' }}>from $500,000 starting cash</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="max-w-[853px] mx-auto flex gap-4">
          <GameButton variant="secondary" onClick={() => navigate('/setup/team')}>
            Edit Setup
          </GameButton>
          <GameButton onClick={() => navigate('/game/cockpit')}>
            Begin Week 1
          </GameButton>
        </div>
      </div>
      </PageTransition>
    </GridBackground>
  );
}

function SummaryCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div
      className="flex-1 bg-white/60 rounded-2xl p-5"
      style={{ border: '1.4px solid white' }}
    >
      <p className="text-[#606569] mb-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
        {label}
      </p>
      <h3
        className="text-[#202326]"
        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '20px' }}
      >
        {value}
      </h3>
      {detail && (
        <p className="text-[#606569] mt-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
          {detail}
        </p>
      )}
    </div>
  );
}
