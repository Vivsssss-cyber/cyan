import React from 'react';
import { CyanLogo } from './CyanLogo';
import { MapPin, Maximize, Users, Megaphone, Target, Check } from 'lucide-react';

const stages = [
  { label: 'Location', icon: MapPin },
  { label: 'Capacity', icon: Maximize },
  { label: 'Team', icon: Users },
  { label: 'Marketing', icon: Megaphone },
  { label: 'Positioning', icon: Target },
];

interface SetupHeaderProps {
  activeStage: number;
}

export function SetupHeader({ activeStage }: SetupHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#C8DDE6]">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <CyanLogo />
        <div className="flex items-center gap-1">
          {stages.map((stage, i) => {
            const isActive = i + 1 === activeStage;
            const isComplete = i + 1 < activeStage;
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div className={`w-8 h-0.5 ${isComplete ? 'bg-[#00C1EB]' : 'bg-[#C8DDE6]'}`} />
                )}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  isActive ? 'bg-[#E0F7FF] border border-[#00C1EB]' :
                  isComplete ? 'bg-[#E0F7FF]/50' : 'opacity-40'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isComplete ? 'bg-[#00C1EB]' :
                    isActive ? 'bg-[#00C1EB]' : 'bg-[#C8DDE6]'
                  }`}>
                    {isComplete ? (
                      <Check size={12} color="white" strokeWidth={3} />
                    ) : (
                      <stage.icon size={12} color={isActive ? 'white' : '#64748B'} />
                    )}
                  </div>
                  <span
                    className={`hidden sm:block ${isActive ? 'text-[#002C33]' : 'text-[#64748B]'}`}
                    style={{ fontSize: '12px', fontWeight: isActive ? 700 : 500 }}
                  >
                    {stage.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
