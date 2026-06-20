import React from 'react';
import { useAppNavigate } from '../../lib/use-app-navigate';
import { useGame } from '../context/GameContext';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { GameButton } from './GameButton';
import { PageTransition } from './PageTransition';
import imgLocation1 from '../../assets/f219b4f8e3f91bcfd4704698b8953662ff157106.png';
import imgLocation2 from '../../assets/894575627134db2cf8467c86677ffe285c21a8ea.png';

const locationImages = [imgLocation1, imgLocation2, imgLocation2, imgLocation1];

const locationData = [
  {
    name: 'Streets of Bagbazar',
    rent: 15,
    premium: '30%',
    footfall: '500',
    competitors: '10%',
    sourcing: '10',
    employment: '$10',
  },
  {
    name: 'Market Square',
    rent: 20,
    premium: '25%',
    footfall: '600',
    competitors: '15%',
    sourcing: '8',
    employment: '$12',
  },
  {
    name: 'Central Avenue',
    rent: 18,
    premium: '35%',
    footfall: '700',
    competitors: '5%',
    sourcing: '12',
    employment: '$11',
  },
  {
    name: 'Riverside Drive',
    rent: 22,
    premium: '40%',
    footfall: '800',
    competitors: '8%',
    sourcing: '15',
    employment: '$13',
  },
];

function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <div className={`w-[27px] h-[27px] rounded-full flex items-center justify-center transition-colors ${
      selected ? 'bg-[#156162]' : 'bg-[#CBD8D8]'
    }`}>
      <div className="w-[14px] h-[14px] rounded-full bg-[#F9FAFB]" />
    </div>
  );
}

interface LocationCardProps {
  index: number;
  location: typeof locationData[0];
  selected: boolean;
  onClick: () => void;
}

function LocationCard({ index, location, selected, onClick }: LocationCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden text-left transition-all hover:shadow-lg cursor-pointer flex-1 min-w-[240px] ${
        selected
          ? 'shadow-[0px_2.5px_10px_0px_rgba(77,181,182,0.29)]'
          : ''
      }`}
      style={{
        background: 'rgba(255,255,255,0.6)',
        border: selected ? '1.4px solid rgba(21,97,98,0.33)' : '1.4px solid white',
      }}
    >
      <div className="p-6 pb-0">
        {/* Header with radio */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
            Location {index + 1}
          </span>
          <RadioIndicator selected={selected} />
        </div>

        {/* Name and rent */}
        <h3
          className="text-[#202326] mb-1"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '24px', letterSpacing: '-0.29px' }}
        >
          {location.name}
        </h3>
        <p className="text-[#c65252] mb-5" style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px' }}>
          Rent per sq feet: ${location.rent}
        </p>

        {/* Stats */}
        <div className="space-y-1.5 mb-6">
          <StatRow label="Premium Customers:" value={location.premium} />
          <StatRow label="Avg Footfall:" value={location.footfall} />
          <StatRow label="Competitors Impact:" value={location.competitors} />
          <StatRow label="Sourcing Distance in miles:" value={location.sourcing} />
          <StatRow label="Base Employment Cost:" value={location.employment} />
        </div>
      </div>

      {/* Location image */}
      <div className="w-full h-[140px] overflow-hidden">
        <img
          src={locationImages[index].src}
          alt={location.name}
          className="w-full h-full object-cover grayscale opacity-80"
        />
      </div>
    </button>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
        {label}
      </span>
      <span className="text-[#202326]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px' }}>
        {value}
      </span>
    </div>
  );
}

export function LocationSetup() {
  const { state, setLocation } = useGame();
  const navigate = useAppNavigate();
  const selected = state.location;

  return (
    <GridBackground className="flex flex-col">
      <PageTransition>
      <GameHeader />

      <div className="max-w-[1288px] mx-auto px-6 w-full pb-32">
        {/* Title */}
        <h1
          className="text-center text-[#202326] mb-2"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '32px', letterSpacing: '-0.32px' }}
        >
          Lets set up your Business
        </h1>

        {/* Subtitle */}
        <p
          className="text-center text-[#202326] mb-10"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '24px', letterSpacing: '-0.29px' }}
        >
          Stage 1: Choose Your Location
        </p>

        {/* Location cards grid */}
        <div className="flex gap-8 mb-12">
          {locationData.map((loc, i) => (
            <LocationCard
              key={i}
              index={i}
              location={loc}
              selected={selected === i}
              onClick={() => setLocation(i)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-[853px] mx-auto">
          <GameButton
            onClick={() => {
              if (selected !== null) navigate('/setup/capacity');
            }}
            disabled={selected === null}
          >
            Select the Location
          </GameButton>
        </div>
      </div>
      </PageTransition>
    </GridBackground>
  );
}
