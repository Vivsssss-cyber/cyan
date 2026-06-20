import React from 'react';
import { useAppNavigate } from '../lib/use-app-navigate';
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

export function CapacitySetup() {
  const { state, locations, spaceOptions, setSpaceOption } = useGame();
  const navigate = useAppNavigate();
  const selected = state.spaceOption;
  const loc = state.location !== null ? locations[state.location] : null;

  const getMonthlyRent = (sqft: number) => {
    if (!loc) return 0;
    return loc.rent * sqft;
  };

  return (
    <GridBackground className="flex flex-col">
      <PageTransition>
      <GameHeader />

      <div className="max-w-[1312px] mx-auto px-6 w-full pb-32">
        <h1
          className="text-center text-[#202326] mb-2"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '32px', letterSpacing: '-0.32px' }}
        >
          Lets set up your Business
        </h1>
        <p
          className="text-center text-[#202326] mb-3"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '24px', letterSpacing: '-0.29px' }}
        >
          Stage 2: Set Your Area Capacity
        </p>
        {loc && (
          <p className="text-center text-[#606569] mb-10" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
            Location: {loc.name} — ${loc.rent}/sq ft · Larger spaces serve more customers but cost more in rent
          </p>
        )}

        <div className="flex gap-8 mb-12">
          {spaceOptions.map((opt, i) => {
            const isSelected = selected === i;
            const monthlyRent = getMonthlyRent(opt.sqft);
            return (
              <button
                key={opt.id}
                onClick={() => setSpaceOption(i)}
                className="flex-1 rounded-2xl p-6 text-left transition-all cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  border: isSelected ? '1.4px solid rgba(21,97,98,0.33)' : '1.4px solid white',
                  boxShadow: isSelected ? '0px 2.5px 10px 0px rgba(77,181,182,0.29)' : '0px 2.5px 10px 0px rgba(255,255,255,0)',
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                    Option {i + 1}
                  </span>
                  <RadioIndicator selected={isSelected} />
                </div>

                <h3
                  className="text-[#202326]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '24px' }}
                >
                  {opt.sqft.toLocaleString()} sq ft
                </h3>
                <p className="text-[#c65252] mb-5" style={{ fontSize: '16px' }}>
                  Rent: ${monthlyRent.toLocaleString()}/mo
                </p>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>Max Customers:</span>
                    <span className="text-[#202326]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px' }}>{opt.maxCustomers}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>Weekly Rent:</span>
                    <span className="text-[#202326]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px' }}>
                      ${Math.round(monthlyRent / 4).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>Capacity/day:</span>
                    <span className="text-[#202326]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px' }}>
                      {Math.floor(opt.sqft * 10 / 25)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="max-w-[853px] mx-auto flex gap-4">
          <GameButton variant="secondary" onClick={() => navigate('/setup/location')}>
            Back
          </GameButton>
          <GameButton
            onClick={() => {
              if (selected !== null) navigate('/setup/team');
            }}
            disabled={selected === null}
          >
            Set the Capacity
          </GameButton>
        </div>
      </div>
      </PageTransition>
    </GridBackground>
  );
}

