import React, { useState } from 'react';
import { useAppNavigate } from '../lib/use-app-navigate';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { GameButton } from './GameButton';
import { PageTransition } from './PageTransition';
import {
  Eye, EyeOff, Zap, Download, Pause, Play, SkipForward, Layers,
  AlertTriangle, Check, ChevronDown
} from 'lucide-react';

const teamsData = [
  { name: 'Team Alpha', color: '#00C1EB', cash: 412500, runway: 18, revenue: 24800, customers: 98, share: 28, satisfaction: 74 },
  { name: 'Team Beta', color: '#003D47', cash: 380200, runway: 15, revenue: 22100, customers: 85, share: 25, satisfaction: 68 },
  { name: 'Team Gamma', color: '#7C3AED', cash: 445800, runway: 22, revenue: 18500, customers: 72, share: 22, satisfaction: 81 },
  { name: 'Team Delta', color: '#B45309', cash: 355000, runway: 12, revenue: 26200, customers: 105, share: 25, satisfaction: 62 },
];

const eventOptions = [
  'Festival Week (+25% footfall)',
  'Supply Chain Disruption (+15% COGS)',
  'Health Inspection (−10% capacity, 2 wks)',
  'Celebrity Review (+20% premium customers)',
  'Economic Downturn (−10% avg spend)',
];

export function FacilitatorDashboard() {
  const navigate = useAppNavigate();
  const [revealToggles, setRevealToggles] = useState<Record<string, boolean>>({});
  const [globalReveal, setGlobalReveal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [showEventConfirm, setShowEventConfirm] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const toggleReveal = (name: string) => {
    setRevealToggles(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <GridBackground className="flex flex-col min-h-screen">
      <PageTransition>
      <GameHeader />

      {/* Facilitator badge bar */}
      <div className="max-w-[1312px] mx-auto px-6 w-full flex items-center gap-3 mb-6">
        <span
          className="px-3 py-1 rounded-full text-white uppercase"
          style={{ background: '#D4590A', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}
        >
          Facilitator Mode
        </span>
        <span className="text-[#606569]" style={{ fontSize: '12px' }}>Week 7 · 4 Teams Active</span>
        <div className="flex-1" />
        <button
          onClick={() => navigate('/game/cockpit')}
          className="px-4 py-1.5 rounded-full text-[#606569] hover:text-[#202326] border border-[#d1d5db] hover:border-[#202326] transition-all cursor-pointer"
          style={{ fontSize: '12px', fontWeight: 600 }}
        >
          Player View
        </button>
      </div>

      <div className="max-w-[1312px] mx-auto px-6 w-full pb-16">
        {/* All-team KPI telemetry */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#202326] uppercase" style={{ fontSize: '14px', letterSpacing: '3px', fontWeight: 700 }}>
              All-Team KPI Telemetry
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[#606569]" style={{ fontSize: '11px' }}>Global Reveal</span>
              <button
                onClick={() => setGlobalReveal(!globalReveal)}
                className={`w-10 h-5 rounded-full transition-all flex items-center ${
                  globalReveal ? 'bg-[#00C1EB] justify-end' : 'bg-white/10 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white mx-0.5" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
              <thead>
                <tr>
                  {['Team', 'Cash Balance', 'Runway', 'Weekly Revenue', 'Customers', 'Market Share', 'Satisfaction', 'Reveal'].map((h) => (
                    <th key={h} className="text-left px-4 py-2 text-[#606569] uppercase" style={{ fontSize: '9px', letterSpacing: '2px' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teamsData.map((team) => {
                  const runwayColor = team.runway > 26 ? '#156162' : team.runway > 8 ? '#B45309' : '#c65252';
                  return (
                    <tr key={team.name} className="rounded-lg bg-white/60" style={{ border: '1.4px solid white' }}>
                      <td className="px-4 py-3 rounded-l-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: team.color }} />
                          <span className="text-[#202326]" style={{ fontSize: '13px', fontWeight: 700 }}>{team.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: '#156162', fontVariantNumeric: 'tabular-nums' }}>
                          ${team.cash.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: runwayColor, fontVariantNumeric: 'tabular-nums' }}>
                          {team.runway} wks
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: '#156162', fontVariantNumeric: 'tabular-nums' }}>
                          ${team.revenue.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: '#202326', fontVariantNumeric: 'tabular-nums' }}>
                          {team.customers}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: '#156162', fontVariantNumeric: 'tabular-nums' }}>
                          {team.share}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: team.satisfaction > 70 ? '#156162' : '#B45309', fontVariantNumeric: 'tabular-nums' }}>
                          {team.satisfaction}%
                        </span>
                      </td>
                      <td className="px-4 py-3 rounded-r-lg">
                        <button onClick={() => toggleReveal(team.name)} className="text-[#606569] hover:text-[#202326] transition-colors">
                          {revealToggles[team.name] || globalReveal ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Event injection + Session controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event injection */}
          <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={18} color="#D4590A" />
              <h3 className="text-[#202326]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700 }}>Event Injection</h3>
            </div>
            <p className="text-[#606569] mb-4" style={{ fontSize: '12px' }}>
              One custom event injection permitted per full game run
            </p>
            <div className="relative mb-3">
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full rounded-lg p-3 text-[#202326] appearance-none cursor-pointer bg-white border border-[#d1d5db]"
                style={{ fontSize: '13px', borderRadius: '8px' }}
              >
                <option value="">Select an event...</option>
                {eventOptions.map((evt) => (
                  <option key={evt} value={evt}>{evt}</option>
                ))}
              </select>
              <ChevronDown size={16} color="white" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
            </div>
            <button
              onClick={() => selectedEvent && setShowEventConfirm(true)}
              disabled={!selectedEvent}
              className={`w-full px-6 py-2.5 rounded-full uppercase tracking-[1px] transition-all ${
                selectedEvent ? 'text-white cursor-pointer' : 'opacity-40 cursor-not-allowed text-white/50'
              }`}
              style={{ background: '#D4590A', fontWeight: 700, fontSize: '12px' }}
            >
              Inject Event
            </button>
          </div>

          {/* Session controls */}
          <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
            <div className="flex items-center gap-2 mb-4">
              <Layers size={18} color="#156162" />
              <h3 className="text-[#202326]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700 }}>Session Controls</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all hover:bg-gray-100 bg-white border border-[#d1d5db] cursor-pointer"
              >
                {isPaused ? <Play size={16} color="#156162" /> : <Pause size={16} color="#B45309" />}
                <span className="text-[#202326]" style={{ fontSize: '12px', fontWeight: 600 }}>
                  {isPaused ? 'Resume Timer' : 'Pause Timer'}
                </span>
              </button>
              <button
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all hover:bg-gray-100 bg-white border border-[#d1d5db] cursor-pointer"
              >
                <SkipForward size={16} color="#156162" />
                <span className="text-[#202326]" style={{ fontSize: '12px', fontWeight: 600 }}>Skip Week</span>
              </button>
              <button
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all hover:bg-gray-100 bg-white border border-[#d1d5db] cursor-pointer"
              >
                <Layers size={16} color="#156162" />
                <span className="text-[#202326]" style={{ fontSize: '12px', fontWeight: 600 }}>Force Batch</span>
              </button>
              <button
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all hover:bg-gray-100 bg-white border border-[#d1d5db] cursor-pointer"
              >
                <Download size={16} color="#156162" />
                <span className="text-[#202326]" style={{ fontSize: '12px', fontWeight: 600 }}>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event confirmation modal */}
      {showEventConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" style={{ border: '1.4px solid white' }}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#D4590A]/20 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} color="#D4590A" />
              </div>
              <h3 className="text-[#202326]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 700 }}>Confirm Event Injection</h3>
              <p className="text-[#606569] mt-2" style={{ fontSize: '14px' }}>
                This will inject "{selectedEvent}" into the current week. This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEventConfirm(false)}
                  className="flex-1 px-6 py-3 rounded-full border border-[#d1d5db] text-[#606569] hover:text-[#202326] hover:border-[#202326] transition-all cursor-pointer"
                  style={{ fontWeight: 700, fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setShowEventConfirm(false); setSelectedEvent(''); }}
                  className="flex-1 px-6 py-3 rounded-full text-white transition-all"
                  style={{ background: '#D4590A', fontWeight: 700, fontSize: '13px' }}
                >
                  Inject Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </PageTransition>
    </GridBackground>
  );
}

