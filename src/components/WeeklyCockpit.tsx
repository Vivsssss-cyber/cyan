import React, { useState, useEffect, useCallback } from 'react';
import { useAppNavigate } from '../lib/use-app-navigate';
import { useGame } from '../context/GameContext';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { GameButton } from './GameButton';
import { PageTransition } from './PageTransition';
import { EditChoicesModal } from './EditChoicesModal';
import { ChevronUp, ChevronDown } from 'lucide-react';

function InputCard({
  title,
  value,
  displayValue,
  onIncrement,
  onDecrement,
  note,
}: {
  title: string;
  value: number;
  displayValue: string;
  onIncrement: () => void;
  onDecrement: () => void;
  note?: string;
}) {
  return (
    <div
      className="bg-white/60 rounded-2xl p-6"
      style={{ border: '1.4px solid white', boxShadow: '0px 2.5px 10px 0px rgba(255,255,255,0)' }}
    >
      <h3
        className="text-[#202326] mb-5"
        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '24px', letterSpacing: '-0.29px' }}
      >
        {title}
      </h3>

      {/* Input with spinner */}
      <div
        className="flex items-center justify-between bg-white/60 rounded-full h-[60px] px-6"
        style={{ border: '0.5px solid #2ac2e4', boxShadow: '0px 0px 2px 1px rgba(0,0,0,0.04), 0px 1px 0px 0px rgba(0,0,0,0.06)' }}
      >
        <span
          className="text-[#202326] flex-1 text-center"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '20px' }}
        >
          {displayValue}
        </span>
        <div className="flex flex-col gap-0.5">
          <button
            onClick={onIncrement}
            className="hover:bg-gray-100 rounded p-0.5 transition-colors cursor-pointer"
          >
            <ChevronUp size={16} className="text-[#606569]" />
          </button>
          <button
            onClick={onDecrement}
            className="hover:bg-gray-100 rounded p-0.5 transition-colors cursor-pointer"
          >
            <ChevronDown size={16} className="text-[#606569]" />
          </button>
        </div>
      </div>

      {note && (
        <p className="text-[#2ac2e4] mt-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
          {note}
        </p>
      )}
    </div>
  );
}

function EstimateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
        {label}
      </span>
      <div
        className="px-4 py-1.5 rounded-lg border border-[#d1d5db] bg-white min-w-[80px] text-center"
      >
        <span
          className="text-[#202326]"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px', fontVariantNumeric: 'tabular-nums' }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

export function WeeklyCockpit() {
  const { state, updateDecisions, lockDecisions } = useGame();
  const navigate = useAppNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const d = state.weeklyDecisions;

  const [marketingBudget, setMarketingBudget] = useState(d.marketingSpend);
  const [discountLevel, setDiscountLevel] = useState(d.discountLevel);
  const [avgPrice, setAvgPrice] = useState(d.avgPrice);

  // Estimated customers (mock calculations)
  const estimatedRegular = Math.round(500 + marketingBudget / 50 - discountLevel * 2);
  const estimatedPremium = Math.round(500 - discountLevel * 5 + avgPrice * 2);

  const handleSubmit = useCallback(() => {
    updateDecisions({
      marketingSpend: marketingBudget,
      discountLevel: discountLevel,
      avgPrice: avgPrice,
    });
    lockDecisions();
    setShowConfirm(false);
    setTimeout(() => navigate('/game/results'), 1000);
  }, [marketingBudget, discountLevel, avgPrice, updateDecisions, lockDecisions, navigate]);

  return (
    <GridBackground className="flex flex-col">
      <PageTransition>
      <GameHeader />

      <div className="max-w-[1312px] mx-auto px-6 w-full pb-16">
        <h1
          className="text-[#202326] mb-8"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '32px', letterSpacing: '-0.32px' }}
        >
          Your weekly Operations
        </h1>

        <div className="flex gap-8">
          {/* Left column - Input cards */}
          <div className="flex-1 space-y-6">
            <InputCard
              title="Cost of Marketing (Weekly Budget)"
              value={marketingBudget}
              displayValue={`$ ${marketingBudget.toLocaleString()}`}
              onIncrement={() => setMarketingBudget(v => Math.min(v + 1000, 50000))}
              onDecrement={() => setMarketingBudget(v => Math.max(v - 1000, 0))}
              note="Once submitted, you cannot change your decision for this round."
            />

            <InputCard
              title="Discount & Promotion Level"
              value={discountLevel}
              displayValue={`${discountLevel}%`}
              onIncrement={() => setDiscountLevel(v => Math.min(v + 1, 30))}
              onDecrement={() => setDiscountLevel(v => Math.max(v - 1, 0))}
              note="Once submitted, you cannot change your decision for this round."
            />

            <InputCard
              title="Average Price per product"
              value={avgPrice}
              displayValue={`${avgPrice}`}
              onIncrement={() => setAvgPrice(v => Math.min(v + 1, 50))}
              onDecrement={() => setAvgPrice(v => Math.max(v - 1, 1))}
              note="Once submitted, you cannot change your decision for this round."
            />
          </div>

          {/* Right column - Estimates & Notes */}
          <div className="w-[380px] space-y-6">
            {/* Estimates card */}
            <div
              className="bg-white/60 rounded-2xl p-6"
              style={{ border: '1.4px solid white', boxShadow: '0px 2.5px 10px 0px rgba(255,255,255,0)' }}
            >
              <h3
                className="text-[#202326] mb-4"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '24px', letterSpacing: '-0.29px' }}
              >
                Estimates
              </h3>
              <EstimateRow label="Estimated Customers Regular" value={estimatedRegular.toString()} />
              <EstimateRow label="Estimated Customers Preminum" value={estimatedPremium.toString()} />
            </div>

            {/* Notes card */}
            <div
              className="bg-white/60 rounded-2xl p-6"
              style={{ border: '1.4px solid white', boxShadow: '0px 2.5px 10px 0px rgba(255,255,255,0)' }}
            >
              <h3
                className="text-[#202326] mb-3"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px' }}
              >
                Notes:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[#606569] shrink-0" />
                  <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                    This is a weekly decision
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[#606569] shrink-0" />
                  <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                    This is a one time decisions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[#606569] shrink-0" />
                  <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                    Marketplace fee: 2%
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[#606569] shrink-0" />
                  <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                    Bids are binding
                  </span>
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <GameButton
                onClick={() => setShowConfirm(true)}
                disabled={state.decisionsLocked}
              >
                {state.decisionsLocked ? 'Decisions Locked' : 'Set the Count'}
              </GameButton>
              <GameButton
                variant="secondary"
                onClick={() => navigate('/game/market')}
              >
                Cancel
              </GameButton>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            style={{ border: '1.4px solid white' }}
          >
            <div className="text-center">
              <h3
                className="text-[#202326] mb-2"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '24px' }}
              >
                Confirm Submission
              </h3>
              <p className="text-[#606569] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                Once submitted, you cannot change your Week {state.currentWeek} decisions. Are you sure?
              </p>

              <div className="space-y-3">
                <div className="bg-[#f7f8f9] rounded-xl p-4 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-[#606569]" style={{ fontSize: '14px' }}>Marketing Budget</span>
                    <span className="text-[#202326]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      ${marketingBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#606569]" style={{ fontSize: '14px' }}>Discount Level</span>
                    <span className="text-[#202326]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {discountLevel}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#606569]" style={{ fontSize: '14px' }}>Avg Price</span>
                    <span className="text-[#202326]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      ${avgPrice}
                    </span>
                  </div>
                </div>

                <GameButton onClick={handleSubmit}>
                  Confirm & Lock
                </GameButton>
                <GameButton variant="secondary" onClick={() => setShowConfirm(false)}>
                  Go Back
                </GameButton>
              </div>
            </div>
          </div>
        </div>
      )}
      </PageTransition>
    </GridBackground>
  );
}

