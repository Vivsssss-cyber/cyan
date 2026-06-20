import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { GameButton } from './GameButton';
import { ChevronDown } from 'lucide-react';
import imgLocation from '../assets/f219b4f8e3f91bcfd4704698b8953662ff157106.png';

interface EditChoicesModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function EditChoicesModal({ open, onClose, onConfirm }: EditChoicesModalProps) {
  const { state, locations, spaceOptions, marketingOptions, employeeOptions, setLocation, setSpaceOption, setEmployeeCount, setMarketingBudget } = useGame();

  const loc = state.location !== null ? locations[state.location] : locations[0];
  const space = state.spaceOption !== null ? spaceOptions[state.spaceOption] : spaceOptions[0];

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showMarketingDropdown, setShowMarketingDropdown] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-[21px] p-7 max-w-[767px] w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex gap-12">
              {/* Left Column - Location */}
              <div className="w-[298px] shrink-0">
                <p className="text-[#606569] mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px' }}>
                  Location
                </p>

                {/* Location Dropdown */}
                <div className="relative mb-3">
                  <button
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                    className="w-full bg-white/60 h-[44px] rounded-xl flex items-center justify-between px-3 cursor-pointer"
                    style={{
                      border: '1.4px solid rgba(21,97,98,0.33)',
                      boxShadow: '0px 2.5px 10px 0px rgba(77,181,182,0.29)',
                    }}
                  >
                    <span className="text-[#515151]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px' }}>
                      {loc.name}
                    </span>
                    <ChevronDown size={18} className="text-[#515151]" />
                  </button>
                  {showLocationDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-10 overflow-hidden border border-gray-200">
                      {locations.map((l, i) => (
                        <button
                          key={l.id}
                          onClick={() => { setLocation(i); setShowLocationDropdown(false); }}
                          className={`w-full text-left px-4 py-3 hover:bg-[#f0f6fa] transition-colors cursor-pointer ${state.location === i ? 'bg-[#e0f7ff]' : ''}`}
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '15px' }}
                        >
                          {l.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location Card */}
                <div
                  className="bg-white/60 rounded-2xl overflow-hidden"
                  style={{
                    border: '1.4px solid rgba(21,97,98,0.33)',
                    boxShadow: '0px 2.5px 10px 0px rgba(77,181,182,0.29)',
                  }}
                >
                  <div className="p-6">
                    <p className="text-[#c65252] mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px' }}>
                      Rent per sq feet: ${loc.rent}
                    </p>
                    <div className="space-y-2">
                      <DetailRow label="Premium Customers:" value={`${loc.premium}%`} />
                      <DetailRow label="Avg Footfall:" value={loc.footfall.toString()} />
                      <DetailRow label="Competitors Impact:" value={`${loc.competitorImpact}%`} />
                      <DetailRow label="Sourcing Distance in miles:" value="10" />
                      <DetailRow label="Base Employment Cost:" value="$10" />
                    </div>
                  </div>
                  <div className="w-full h-[140px] overflow-hidden">
                    <img
                      src={imgLocation.src}
                      alt={loc.name}
                      className="w-full h-full object-cover grayscale opacity-80"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Settings */}
              <div className="flex-1 space-y-6">
                {/* Marketing */}
                <DropdownField
                  label="Cost of Marketing"
                  value={`${state.marketingBudget || 2}%`}
                  open={showMarketingDropdown}
                  onToggle={() => setShowMarketingDropdown(!showMarketingDropdown)}
                  options={marketingOptions.map(m => ({ label: `${m}%`, value: m }))}
                  selected={state.marketingBudget}
                  onSelect={(v) => { setMarketingBudget(v as number); setShowMarketingDropdown(false); }}
                />

                {/* Employee Count */}
                <DropdownField
                  label="Employee count"
                  value={(state.employeeCount || 5).toString()}
                  open={showEmployeeDropdown}
                  onToggle={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                  options={employeeOptions.map(e => ({ label: e.toString(), value: e }))}
                  selected={state.employeeCount}
                  onSelect={(v) => { setEmployeeCount(v as number); setShowEmployeeDropdown(false); }}
                />

                {/* Initial Area */}
                <DropdownField
                  label="Initial Area"
                  value={`${space.sqft.toLocaleString()} sq ft`}
                  open={showAreaDropdown}
                  onToggle={() => setShowAreaDropdown(!showAreaDropdown)}
                  options={spaceOptions.map((s, i) => ({ label: `${s.sqft.toLocaleString()} sq ft`, value: i }))}
                  selected={state.spaceOption}
                  onSelect={(v) => { setSpaceOption(v as number); setShowAreaDropdown(false); }}
                />

                {/* Buttons */}
                <div className="space-y-3 pt-4">
                  <GameButton onClick={onConfirm}>
                    Set the Count
                  </GameButton>
                  <GameButton variant="secondary" onClick={onClose}>
                    Cancel
                  </GameButton>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
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

function DropdownField({
  label, value, open, onToggle, options, selected, onSelect,
}: {
  label: string;
  value: string;
  open: boolean;
  onToggle: () => void;
  options: { label: string; value: number }[];
  selected: number | null;
  onSelect: (v: number) => void;
}) {
  return (
    <div>
      <p className="text-[#606569] mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px' }}>
        {label}
      </p>
      <div className="relative">
        <button
          onClick={onToggle}
          className="w-full bg-white/60 h-[44px] rounded-xl flex items-center justify-between px-3 cursor-pointer"
          style={{
            border: '1.4px solid rgba(21,97,98,0.33)',
            boxShadow: '0px 2.5px 10px 0px rgba(77,181,182,0.29)',
          }}
        >
          <span className="text-[#515151]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px' }}>
            {value}
          </span>
          <ChevronDown size={18} className="text-[#515151]" />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-10 overflow-hidden border border-gray-200">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSelect(opt.value)}
                className={`w-full text-left px-4 py-3 hover:bg-[#f0f6fa] transition-colors cursor-pointer ${selected === opt.value ? 'bg-[#e0f7ff]' : ''}`}
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '15px' }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

