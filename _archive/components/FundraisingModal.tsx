import React, { useState } from 'react';
import { useAppNavigate } from '../../lib/use-app-navigate';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { GameButton } from './GameButton';
import { PageTransition } from './PageTransition';
import { motion, AnimatePresence } from 'motion/react';
import { Banknote, Shield, Zap, Building2, AlertTriangle, Check, ChevronRight, X } from 'lucide-react';

interface TermSheet {
  id: string;
  investor: string;
  type: string;
  amount: string;
  valuation: string;
  dilution: string;
  terms: string[];
  icon: typeof Banknote;
  color: string;
  bgColor: string;
  special?: string;
  risk: 'Low' | 'Medium' | 'High';
}

const termSheets: TermSheet[] = [
  {
    id: 'angel',
    investor: 'Angel Investor',
    type: 'Convertible Note',
    amount: '$150,000',
    valuation: '$750K cap',
    dilution: '~15%',
    terms: [
      '20% discount on next round',
      'No board seat required',
      'Mentor network access',
      '24-month conversion deadline',
    ],
    icon: Zap,
    color: '#006E85',
    bgColor: '#E0F7FF',
    special: 'Best for early stage',
    risk: 'Low',
  },
  {
    id: 'seed',
    investor: 'Seed VC Fund',
    type: 'Priced Equity',
    amount: '$500,000',
    valuation: '$2M pre-money',
    dilution: '20%',
    terms: [
      'Board observer seat',
      'Pro-rata rights for follow-on',
      'Quarterly reporting required',
      'Standard 1x liquidation preference',
    ],
    icon: Building2,
    color: '#156162',
    bgColor: '#ECFDF5',
    special: 'Most popular',
    risk: 'Medium',
  },
  {
    id: 'strategic',
    investor: 'Strategic Partner',
    type: 'SAFE + Partnership',
    amount: '$300,000',
    valuation: '$1.5M cap',
    dilution: '~16%',
    terms: [
      'Exclusive supply partnership',
      'Co-marketing agreement',
      'Right of first refusal on exit',
      'Revenue share: 2% for 3 years',
    ],
    icon: Shield,
    color: '#7C3AED',
    bgColor: '#F0F0FF',
    special: 'Operational upside',
    risk: 'Medium',
  },
  {
    id: 'aggressive',
    investor: 'Growth Capital',
    type: 'Series A (Mini)',
    amount: '$1,000,000',
    valuation: '$3M pre-money',
    dilution: '25%',
    terms: [
      'Board seat required',
      '2x liquidation preference',
      'Anti-dilution protection (weighted)',
      'Mandatory milestones: $80K MRR by M6',
      'Right to force sale after Year 3',
    ],
    icon: Banknote,
    color: '#B45309',
    bgColor: '#FEF3C7',
    special: 'High growth path',
    risk: 'High',
  },
];

const riskColors = { Low: '#166534', Medium: '#B45309', High: '#C0392B' };

export function FundraisingScreen() {
  const navigate = useAppNavigate();
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const selected = termSheets.find((t) => t.id === selectedSheet);

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => {
      navigate('/game/leaderboard');
    }, 2000);
  };

  return (
    <PageTransition>
      <GridBackground className="flex flex-col min-h-screen">
        <GameHeader />

        <div className="max-w-[1288px] mx-auto px-6 w-full pb-16">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#006E85]/10 flex items-center justify-center mx-auto mb-4">
              <Banknote size={28} color="#006E85" />
            </div>
            <h1
              className="text-[#202326] mb-2"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '32px', letterSpacing: '-0.32px' }}
            >
              Fundraising Round
            </h1>
            <p className="text-[#606569] max-w-lg mx-auto" style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', lineHeight: 1.6 }}>
              Your restaurant has been operating for 26 weeks. Based on your performance, investors are offering term sheets. Choose wisely - this will impact your ownership and growth trajectory.
            </p>
          </div>

          {/* Current Valuation Bar */}
          <div className="bg-white/60 rounded-2xl p-4 mb-6 flex items-center justify-between" style={{ border: '1.4px solid white' }}>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[#606569]" style={{ fontSize: '11px' }}>Current Enterprise Value</span>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '22px', color: '#156162', fontVariantNumeric: 'tabular-nums' }}>$485,000</div>
              </div>
              <div className="w-px h-8 bg-[#e5e7eb]" />
              <div>
                <span className="text-[#606569]" style={{ fontSize: '11px' }}>Current Ownership</span>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '22px', color: '#006E85', fontVariantNumeric: 'tabular-nums' }}>100%</div>
              </div>
              <div className="w-px h-8 bg-[#e5e7eb]" />
              <div>
                <span className="text-[#606569]" style={{ fontSize: '11px' }}>Cash Balance</span>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '22px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>$122,400</div>
              </div>
            </div>
            <div className="bg-[#F0F6FA] rounded-xl px-4 py-2">
              <span className="text-[#006E85]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600 }}>
                Week 26 - Eligible for funding
              </span>
            </div>
          </div>

          {/* Term Sheet Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {termSheets.map((sheet) => {
              const Icon = sheet.icon;
              const isSelected = selectedSheet === sheet.id;
              return (
                <motion.button
                  key={sheet.id}
                  onClick={() => setSelectedSheet(isSelected ? null : sheet.id)}
                  className="rounded-2xl p-6 text-left transition-all cursor-pointer relative overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    border: isSelected ? `2px solid ${sheet.color}` : '1.4px solid white',
                    boxShadow: isSelected ? `0px 4px 16px 0px ${sheet.color}25` : 'none',
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {/* Special badge */}
                  {sheet.special && (
                    <span
                      className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-white"
                      style={{ background: sheet.color, fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px' }}
                    >
                      {sheet.special.toUpperCase()}
                    </span>
                  )}

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: sheet.bgColor }}>
                      <Icon size={20} color={sheet.color} />
                    </div>
                    <div>
                      <h3 className="text-[#202326]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px' }}>
                        {sheet.investor}
                      </h3>
                      <span className="text-[#94A3B8]" style={{ fontSize: '12px' }}>{sheet.type}</span>
                    </div>
                  </div>

                  {/* Key Numbers */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-[#f7f8f9] rounded-lg p-2.5">
                      <span className="text-[#606569]" style={{ fontSize: '10px' }}>Amount</span>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '16px', color: '#156162', fontVariantNumeric: 'tabular-nums' }}>
                        {sheet.amount}
                      </div>
                    </div>
                    <div className="bg-[#f7f8f9] rounded-lg p-2.5">
                      <span className="text-[#606569]" style={{ fontSize: '10px' }}>Valuation</span>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '14px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>
                        {sheet.valuation}
                      </div>
                    </div>
                    <div className="bg-[#f7f8f9] rounded-lg p-2.5">
                      <span className="text-[#606569]" style={{ fontSize: '10px' }}>Dilution</span>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '16px', color: '#c65252', fontVariantNumeric: 'tabular-nums' }}>
                        {sheet.dilution}
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="space-y-2 mb-4">
                    {sheet.terms.map((term, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <ChevronRight size={12} color="#94A3B8" className="mt-0.5 shrink-0" />
                        <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', lineHeight: 1.5 }}>
                          {term}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Risk Badge */}
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={12} color={riskColors[sheet.risk]} />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: riskColors[sheet.risk] }}>
                      {sheet.risk} Risk
                    </span>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: sheet.color }}
                    >
                      <Check size={16} color="white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Decline option */}
          <div className="bg-white/60 rounded-2xl p-4 mb-6 flex items-center justify-between" style={{ border: '1.4px solid white' }}>
            <div className="flex items-center gap-3">
              <X size={18} color="#606569" />
              <div>
                <p className="text-[#202326]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '15px' }}>
                  Decline All Offers
                </p>
                <p className="text-[#94A3B8]" style={{ fontSize: '12px' }}>
                  Keep 100% ownership. Continue bootstrapping with current cash.
                </p>
              </div>
            </div>
            <button
              onClick={() => { setSelectedSheet(null); navigate('/game/leaderboard'); }}
              className="px-4 py-2 rounded-full border border-[#d1d5db] text-[#606569] hover:text-[#202326] transition-all cursor-pointer"
              style={{ fontSize: '12px', fontWeight: 600 }}
            >
              Skip Round
            </button>
          </div>

          {/* CTA */}
          <div className="max-w-[600px] mx-auto">
            <GameButton
              onClick={() => {
                if (selectedSheet) setShowConfirm(true);
              }}
              disabled={!selectedSheet}
            >
              Review & Accept Term Sheet
            </GameButton>
          </div>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirm && selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              >
                {accepted ? (
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                      className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-4"
                    >
                      <Check size={32} color="#166534" />
                    </motion.div>
                    <h3 className="text-[#202326] mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '24px' }}>
                      Deal Accepted!
                    </h3>
                    <p className="text-[#606569]" style={{ fontSize: '14px' }}>
                      {selected.amount} from {selected.investor} has been added to your cash balance.
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <h3 className="text-[#202326] mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '24px' }}>
                      Confirm Investment
                    </h3>
                    <p className="text-[#606569] mb-6" style={{ fontSize: '14px' }}>
                      This will permanently dilute your ownership by {selected.dilution}. This cannot be undone.
                    </p>

                    <div className="bg-[#f7f8f9] rounded-xl p-4 space-y-2 text-left mb-6">
                      <div className="flex justify-between">
                        <span className="text-[#606569]" style={{ fontSize: '13px' }}>Investor</span>
                        <span className="text-[#202326]" style={{ fontWeight: 600, fontSize: '13px' }}>{selected.investor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#606569]" style={{ fontSize: '13px' }}>Amount</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#156162', fontVariantNumeric: 'tabular-nums' }}>{selected.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#606569]" style={{ fontSize: '13px' }}>Post-money ownership</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#c65252', fontVariantNumeric: 'tabular-nums' }}>
                          {100 - parseInt(selected.dilution.replace(/[^0-9]/g, ''))}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <GameButton onClick={handleAccept}>
                        Accept & Close Round
                      </GameButton>
                      <GameButton variant="secondary" onClick={() => setShowConfirm(false)}>
                        Go Back
                      </GameButton>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </GridBackground>
    </PageTransition>
  );
}
