import React, { useState } from 'react';
import { useAppNavigate } from '../../lib/use-app-navigate';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { GameButton } from './GameButton';
import { PageTransition } from './PageTransition';
import {
  AlertTriangle, Info, Heart, AlertCircle, ChevronRight,
  ArrowUpRight, ArrowDownRight, Download,
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, AreaChart, Area,
} from 'recharts';

const FI = "'Outfit', sans-serif";

type Mode = 'monthly' | 'quarterly';

// ============ MONTHLY DATA (15.1 - 15.11) ============
const monthlyFinancials = {
  revenue: 99200,        // 15.1
  cost: 79700,           // 15.2
  margin: 19.6,          // 15.3
  revenueDelta: '+18.4%',
  costDelta: '+8.2%',
  marginDelta: '+4.1pts',
};

const stockIntegrity = {
  sold: 3840,            // 15.4
  unsold: 620,           // 15.5
  expiry: 180,           // 15.6
  phantom: 95,           // 15.7
  damaged: 62,           // 15.7
};

const marketResponse = {
  marketing: 12000,      // 15.8
  footfall: 1368,        // 15.9
  costPerVisit: 8.77,
};

const cashMovement = {   // 15.10
  opening: 145000,
  inflow: 99200,
  outflow: 119700,
  closing: 124500,
};

// ============ QUARTERLY DATA (17.1 - 17.11) ============
const quarterlyTrends = [
  { m: 'M1', revenue: 48000, margin: -8.3, retention: 72, footfall: 940 },
  { m: 'M2', revenue: 72000, margin: 9.7, retention: 81, footfall: 1180 },
  { m: 'M3', revenue: 99200, margin: 19.6, retention: 86, footfall: 1368 },
];

const productRanking = [ // 17.5  (6 slots)
  { name: 'Signature Bowl', score: 94, rev: 28400, trend: 'up' },
  { name: 'Morning Combo',  score: 88, rev: 22100, trend: 'up' },
  { name: 'Veggie Wrap',    score: 76, rev: 16800, trend: 'flat' },
  { name: 'Cold Brew',      score: 71, rev: 13200, trend: 'up' },
  { name: 'Dessert Jar',    score: 52, rev:  9400, trend: 'down' },
  { name: 'Spicy Noodle',   score: 31, rev:  4300, trend: 'down' }, // weakest
];

const marketingEffectiveness = 68; // 17.6

const workforceTrend = [ // 17.7, 17.8
  { m: 'M1', satisfaction: 62, turnover: 18 },
  { m: 'M2', satisfaction: 69, turnover: 14 },
  { m: 'M3', satisfaction: 74, turnover: 11 },
];

const systemLoss = [ // 17.9
  { m: 'M1', waste: 9.8, phantom: 3.2 },
  { m: 'M2', waste: 8.9, phantom: 2.6 },
  { m: 'M3', waste: 8.4, phantom: 2.1 },
];

export function CommandCenter() {
  const navigate = useAppNavigate();
  const [mode, setMode] = useState<Mode>('monthly');
  const [overlay, setOverlay] = useState<null | 'ledger'>(null);

  // --- What-If state ---
  const baseCash = cashMovement.closing;       // $124,500
  const baseBurn = 20500;                      // from 15.10 net outflow
  const [whatIfMarketing, setWhatIfMarketing] = useState(0);
  const [whatIfPurchase, setWhatIfPurchase] = useState(0);
  const projectedBurn = baseBurn + whatIfMarketing + whatIfPurchase;
  const runway = Math.max(0.1, baseCash / projectedBurn);
  const burnHot = whatIfMarketing + whatIfPurchase > 0;
  const runwayDanger = runway < 3;

  return (
    <GridBackground className="flex flex-col min-h-screen">
      <PageTransition>
        <GameHeader />

        <div className="max-w-[1288px] mx-auto px-6 w-full pb-24">
          {/* ============== PULSE STRIP ============== */}
          <PulseStrip
            cash={baseCash}
            projectedBurn={projectedBurn}
            burnHot={burnHot}
            runway={runway}
            runwayDanger={runwayDanger}
            whatIfMarketing={whatIfMarketing}
            setWhatIfMarketing={setWhatIfMarketing}
            whatIfPurchase={whatIfPurchase}
            setWhatIfPurchase={setWhatIfPurchase}
          />
          {/* Title + Mode toggle */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="mb-1">
                <span className="text-[#006E85] uppercase tracking-wider" style={{ fontFamily: FI, fontSize: '11px', fontWeight: 700 }}>
                  Command Center
                </span>
              </div>
              <h1 className="text-[#202326] mb-1" style={{ fontFamily: FI, fontWeight: 700, fontSize: '32px', letterSpacing: '-0.32px' }}>
                {mode === 'monthly' ? 'Monthly Operations' : 'Quarterly Strategy'}
              </h1>
              <p className="text-[#606569]" style={{ fontFamily: FI, fontSize: '14px' }}>
                {mode === 'monthly'
                  ? 'Review results (15.1–15.11) before the next Purchase Goods decision'
                  : 'Spot trends (17.1–17.11) before strategic reallocation'}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex bg-white/60 rounded-xl p-1" style={{ border: '1.4px solid white' }}>
                <ToggleBtn active={mode === 'monthly'} onClick={() => setMode('monthly')} label="Monthly View" />
                <ToggleBtn active={mode === 'quarterly'} onClick={() => setMode('quarterly')} label="Quarterly Mode" />
              </div>
              <div className="w-[240px]">
                <GameButton onClick={() => navigate(mode === 'monthly' ? '/game/cockpit' : '/game/board-review')}>
                  {mode === 'monthly' ? 'Proceed to Purchase Goods' : 'Review Product Swap'}
                </GameButton>
              </div>
            </div>
          </div>

          {mode === 'monthly' ? <MonthlyHub onJump={(r) => navigate(r)} /> : <QuarterlyHub onOpenLedger={() => setOverlay('ledger')} />}
        </div>

        {overlay === 'ledger' && <DecisionOverlay onClose={() => setOverlay(null)} onProceed={() => { setOverlay(null); navigate('/game/cockpit'); }} />}
      </PageTransition>
    </GridBackground>
  );
}

// ============ MONTHLY HUB ============
function MonthlyHub({ onJump }: { onJump: (route: string) => void }) {
  const m = monthlyFinancials;
  const s = stockIntegrity;
  const totalWaste = s.expiry + s.phantom + s.damaged;

  return (
    <>
      {/* 15.1 - 15.3  Review Ribbon (Financial) */}
      <SectionLabel n="15.1–15.3" title="Financial Performance" />
      <div className="grid grid-cols-3 gap-3 mb-6">
        <RibbonKpi label="Revenue" value={`$${m.revenue.toLocaleString()}`} delta={m.revenueDelta} positive accent="#006E85" />
        <RibbonKpi label="Cost" value={`$${m.cost.toLocaleString()}`} delta={m.costDelta} positive={false} accent="#c65252" />
        <RibbonKpi label="Margin" value={`${m.margin}%`} delta={m.marginDelta} positive accent="#156162" />
      </div>

      {/* 15.4 - 15.7 Inventory */}
      <SectionLabel n="15.4–15.7" title="Stock Integrity" tooltip="Phantom Stock = inventory recorded in the system but not physically present (shrinkage, miscounts)." />
      <div className="grid grid-cols-5 gap-3 mb-6">
        {/* Sold vs Unsold meter */}
        <div className="col-span-2 bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontFamily: FI, fontSize: '12px', fontWeight: 600, color: '#202326' }}>Sold vs Unsold</span>
            <span className="text-[#94A3B8]" style={{ fontSize: '11px' }}>15.4 / 15.5</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span style={{ fontFamily: FI, fontWeight: 700, fontSize: '24px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>{s.sold.toLocaleString()}</span>
            <span className="text-[#606569]" style={{ fontSize: '12px' }}>units sold · {s.unsold} unsold</span>
          </div>
          <div className="h-3 rounded-full bg-[#F0F6FA] overflow-hidden flex">
            <div className="h-full bg-[#006E85]" style={{ width: `${(s.sold / (s.sold + s.unsold)) * 100}%` }} />
            <div className="h-full bg-[#B45309]" style={{ width: `${(s.unsold / (s.sold + s.unsold)) * 100}%` }} />
          </div>
          <div className="flex gap-4 mt-2">
            <LegendDot color="#006E85" label={`Sold ${((s.sold / (s.sold + s.unsold)) * 100).toFixed(0)}%`} />
            <LegendDot color="#B45309" label={`Unsold ${((s.unsold / (s.sold + s.unsold)) * 100).toFixed(0)}%`} />
          </div>
        </div>

        {/* Waste Trio — expiry clickable (15.6) */}
        <WasteTile label="Expiry" n="15.6" value={s.expiry} total={totalWaste} color="#c65252" clickable onClick={() => onJump('/game/cockpit')} cta="Adjust Pricing →" />
        <WasteTile label="Phantom" n="15.7" value={s.phantom} total={totalWaste} color="#B45309" tooltip="Phantom stock: recorded but missing physically." />
        <WasteTile label="Damaged" n="15.7" value={s.damaged} total={totalWaste} color="#7C3AED" />
      </div>

      {/* 15.8 - 15.9 Market response */}
      <SectionLabel n="15.8–15.9" title="Market Response" />
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
          <div className="mb-3">
            <span style={{ fontFamily: FI, fontSize: '12px', fontWeight: 600, color: '#202326' }}>Marketing Expense</span>
          </div>
          <div style={{ fontFamily: FI, fontWeight: 700, fontSize: '28px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>
            ${marketResponse.marketing.toLocaleString()}
          </div>
          <span className="text-[#606569]" style={{ fontSize: '11px' }}>12.1% of revenue</span>
        </div>
        <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
          <div className="mb-3">
            <span style={{ fontFamily: FI, fontSize: '12px', fontWeight: 600, color: '#202326' }}>Footfall</span>
          </div>
          <div style={{ fontFamily: FI, fontWeight: 700, fontSize: '28px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>
            {marketResponse.footfall.toLocaleString()}
          </div>
          <span className="text-[#156162]" style={{ fontSize: '11px', fontWeight: 600 }}>+188 vs M2</span>
        </div>
        <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
          <div className="mb-3">
            <span style={{ fontFamily: FI, fontSize: '12px', fontWeight: 600, color: '#202326' }}>Cost per Visit</span>
          </div>
          <div style={{ fontFamily: FI, fontWeight: 700, fontSize: '28px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>
            ${marketResponse.costPerVisit}
          </div>
          <span className="text-[#156162]" style={{ fontSize: '11px', fontWeight: 600 }}>-$1.12 vs M2</span>
        </div>
      </div>

      {/* 15.10 Liquidity / Cash Movement */}
      <SectionLabel n="15.10" title="Liquidity — Cash Movement" />
      <div className="bg-white/60 rounded-2xl p-5 mb-4" style={{ border: '1.4px solid white' }}>
        <div className="flex items-center justify-between">
          <CashStep label="Opening" value={cashMovement.opening} color="#606569" />
          <ChevronRight size={18} color="#94A3B8" />
          <CashStep label="Inflow" value={cashMovement.inflow} color="#156162" prefix="+" />
          <ChevronRight size={18} color="#94A3B8" />
          <CashStep label="Outflow" value={-cashMovement.outflow} color="#c65252" prefix="-" absolute />
          <ChevronRight size={18} color="#94A3B8" />
          <CashStep label="Closing" value={cashMovement.closing} color="#006E85" bold />
        </div>
      </div>

      {/* 15.11 Monthly Reporting View */}
      <div className="bg-gradient-to-r from-[#F0F9FC] to-white rounded-2xl p-5 flex items-center justify-between" style={{ border: '1.4px solid white' }}>
        <div className="flex items-center gap-3">
          <div>
            <div style={{ fontFamily: FI, fontSize: '14px', fontWeight: 700, color: '#202326' }}>
              Monthly Reporting View <span className="text-[#94A3B8]" style={{ fontSize: '11px', fontWeight: 500 }}>· 15.11</span>
            </div>
            <div className="text-[#606569]" style={{ fontSize: '12px' }}>Expandable ledger — full P&amp;L, stock log, marketing ROI</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg bg-white border border-[#C8DDE6] flex items-center gap-1.5 text-[#006E85] hover:bg-[#F0F9FC] cursor-pointer" style={{ fontFamily: FI, fontSize: '12px', fontWeight: 600 }}>
            <Download size={13} /> Download
          </button>
          <button className="px-3 py-2 rounded-lg bg-[#006E85] text-white flex items-center gap-1.5 cursor-pointer hover:bg-[#005F58]" style={{ fontFamily: FI, fontSize: '12px', fontWeight: 600 }}>
            Expand <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </>
  );
}

// ============ QUARTERLY HUB ============
function QuarterlyHub({ onOpenLedger }: { onOpenLedger: () => void }) {
  const weakest = productRanking.reduce((a, b) => (a.score < b.score ? a : b));

  return (
    <>
      {/* 17.1 - 17.4 Big Four Trends */}
      <SectionLabel n="17.1–17.4" title="The Big Four Trends" />
      <div className="grid grid-cols-4 gap-3 mb-6">
        <SparkCard title="Revenue" n="17.1" value="$219k" delta="+106% QoQ" positive series={quarterlyTrends.map(d => d.revenue)} accent="#006E85" />
        <SparkCard title="Margin" n="17.2" value="19.6%" delta="+27.9 pts" positive series={quarterlyTrends.map(d => d.margin)} accent="#156162" />
        <SparkCard title="Retention" n="17.3" value="86%" delta="+14 pts" positive series={quarterlyTrends.map(d => d.retention)} accent="#4DB5B6" />
        <SparkCard title="Footfall" n="17.4" value="3,488" delta="+45.5%" positive series={quarterlyTrends.map(d => d.footfall)} accent="#00C1EB" />
      </div>

      {/* 17.5 Performance Matrix + 17.6 Marketing effectiveness */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#202326]" style={{ fontFamily: FI, fontWeight: 700, fontSize: '16px' }}>Product Performance Matrix</h3>
              <p className="text-[#94A3B8]" style={{ fontSize: '12px' }}>6-slot ranking · weakest link prepared for Annual Product Swap · 17.5</p>
            </div>
            <span className="px-2 py-1 rounded bg-[#FEE2E2] text-[#c65252]" style={{ fontSize: '10px', fontWeight: 700 }}>
              WEAKEST LINK: {weakest.name}
            </span>
          </div>
          <div className="space-y-2.5">
            {productRanking.map((p, i) => {
              const isWeakest = p.name === weakest.name;
              return (
                <div key={p.name} className={`flex items-center gap-3 p-2 rounded-lg ${isWeakest ? 'bg-[#FEF2F2] border border-[#FECACA]' : ''}`}>
                  <span className="w-6 text-center text-[#94A3B8]" style={{ fontFamily: FI, fontSize: '12px', fontWeight: 700 }}>#{i + 1}</span>
                  <span className="w-40" style={{ fontFamily: FI, fontSize: '13px', fontWeight: 600, color: '#202326' }}>{p.name}</span>
                  <div className="flex-1 h-2 bg-[#F0F6FA] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.score}%`, background: isWeakest ? '#c65252' : p.score > 70 ? '#006E85' : '#B45309' }} />
                  </div>
                  <span className="w-12 text-right" style={{ fontFamily: FI, fontSize: '12px', fontWeight: 700, color: '#202326', fontVariantNumeric: 'tabular-nums' }}>{p.score}</span>
                  <span className="w-20 text-right text-[#606569]" style={{ fontSize: '11px', fontVariantNumeric: 'tabular-nums' }}>${(p.rev / 1000).toFixed(1)}k</span>
                  {p.trend === 'up' && <ArrowUpRight size={14} color="#156162" />}
                  {p.trend === 'down' && <ArrowDownRight size={14} color="#c65252" />}
                  {p.trend === 'flat' && <span className="w-[14px] h-[2px] bg-[#94A3B8] rounded-full" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* 17.6 Marketing Effectiveness */}
        <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
          <h3 className="text-[#202326] mb-1" style={{ fontFamily: FI, fontWeight: 700, fontSize: '14px' }}>Marketing Effectiveness</h3>
          <p className="text-[#94A3B8] mb-4" style={{ fontSize: '11px' }}>17.6 · composite score</p>
          <div className="relative flex items-center justify-center my-4">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="58" stroke="#F0F6FA" strokeWidth="14" fill="none" />
              <circle
                cx="70" cy="70" r="58" stroke="#006E85" strokeWidth="14" fill="none"
                strokeDasharray={`${(marketingEffectiveness / 100) * 364} 364`}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute text-center">
              <div style={{ fontFamily: FI, fontWeight: 700, fontSize: '28px', color: '#006E85', fontVariantNumeric: 'tabular-nums' }}>{marketingEffectiveness}</div>
              <div className="text-[#94A3B8]" style={{ fontSize: '10px' }}>/ 100</div>
            </div>
          </div>
          <div className="text-center px-2 py-1.5 rounded bg-[#E0F7FF]" style={{ fontFamily: FI, fontSize: '11px', fontWeight: 600, color: '#006E85' }}>
            Solid — CAC trending down
          </div>
        </div>
      </div>

      {/* 17.7 - 17.9  Workforce & System Loss */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
          <h3 className="text-[#202326]" style={{ fontFamily: FI, fontWeight: 700, fontSize: '14px' }}>Workforce Trends</h3>
          <p className="text-[#94A3B8] mb-3" style={{ fontSize: '11px' }}>17.7–17.8 · Satisfaction &amp; Turnover</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={workforceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="satisfaction" stroke="#006E85" strokeWidth={2.5} dot={{ r: 4 }} name="Satisfaction %" />
              <Line type="monotone" dataKey="turnover" stroke="#c65252" strokeWidth={2.5} dot={{ r: 4 }} name="Turnover %" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center">
            <LegendDot color="#006E85" label="Satisfaction" />
            <LegendDot color="#c65252" label="Turnover" />
          </div>
        </div>

        <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
          <h3 className="text-[#202326]" style={{ fontFamily: FI, fontWeight: 700, fontSize: '14px' }}>System Loss</h3>
          <p className="text-[#94A3B8] mb-3" style={{ fontSize: '11px' }}>17.9 · Waste &amp; Phantom (% of stock)</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={systemLoss}>
              <defs>
                <linearGradient id="wasteG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B45309" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#B45309" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="phantomG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c65252" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#c65252" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="waste" stroke="#B45309" strokeWidth={2} fill="url(#wasteG)" />
              <Area type="monotone" dataKey="phantom" stroke="#c65252" strokeWidth={2} fill="url(#phantomG)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center">
            <LegendDot color="#B45309" label="Waste" />
            <LegendDot color="#c65252" label="Phantom" />
          </div>
        </div>
      </div>

      {/* 17.10 Ledger link  +  17.11 Narrative */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={onOpenLedger}
          className="col-span-1 bg-white/60 rounded-2xl p-5 text-left hover:bg-white/80 transition-all cursor-pointer flex flex-col justify-between"
          style={{ border: '1.4px solid white' }}
        >
          <div>
            <div className="mb-1">
              <span style={{ fontFamily: FI, fontSize: '12px', fontWeight: 700, color: '#006E85' }}>17.10 · DEEP DIVE</span>
            </div>
            <h3 className="text-[#202326] mb-1" style={{ fontFamily: FI, fontWeight: 700, fontSize: '18px' }}>Quarterly Product Ledger</h3>
            <p className="text-[#606569]" style={{ fontSize: '12px' }}>SKU-level unit economics, supplier costs, and COGS variance across the quarter.</p>
          </div>
          <div className="flex items-center gap-1 mt-4 text-[#006E85]" style={{ fontFamily: FI, fontSize: '13px', fontWeight: 700 }}>
            Open Ledger <ChevronRight size={14} />
          </div>
        </button>

        <div className="col-span-2 bg-gradient-to-br from-[#006E85] to-[#003D47] rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute right-10 bottom-4 w-20 h-20 rounded-full bg-white/5" />
          <div className="mb-2 relative z-10">
            <span style={{ fontFamily: FI, fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>17.11 · STRATEGIC SUMMARY</span>
          </div>
          <h3 className="mb-2 relative z-10" style={{ fontFamily: FI, fontWeight: 700, fontSize: '18px' }}>Q1 Narrative</h3>
          <p className="opacity-90 relative z-10" style={{ fontFamily: FI, fontSize: '13px', lineHeight: '1.55' }}>
            Strong footfall conversion (+45%) and retention gains drove margin from <span style={{ fontWeight: 700 }}>-8.3%</span> to <span style={{ fontWeight: 700 }}>19.6%</span>.
            Watch: <span style={{ fontWeight: 700 }}>Spicy Noodle</span> underperforming its slot — consider swap at Annual Review.
            Waste is trending down but phantom stock remains elevated.
          </p>
        </div>
      </div>
    </>
  );
}

// ============ DECISION OVERLAY (17.10 → Purchase Goods) ============
function DecisionOverlay({ onClose, onProceed }: { onClose: () => void; onProceed: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-[680px] w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#006E85] to-[#003D47] p-5 text-white">
          <div className="mb-1">
            <span style={{ fontFamily: FI, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}>QUARTERLY PRODUCT LEDGER · 17.10</span>
          </div>
          <h2 style={{ fontFamily: FI, fontWeight: 700, fontSize: '22px' }}>Translate insight → next month's purchase</h2>
        </div>
        <div className="p-5">
          <div className="bg-[#F0F9FC] rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={14} color="#B45309" />
              <span style={{ fontFamily: FI, fontSize: '12px', fontWeight: 700, color: '#B45309' }}>Insight detected</span>
            </div>
            <p className="text-[#202326]" style={{ fontFamily: FI, fontSize: '13px' }}>
              <span style={{ fontWeight: 700 }}>Signature Bowl</span> has 94% performance with only 22% of order volume. Consider reallocating
              purchase units away from <span style={{ fontWeight: 700 }}>Spicy Noodle</span>.
            </p>
          </div>
          <div className="space-y-2 mb-4">
            {productRanking.slice(0, 3).map((p) => (
              <div key={p.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#F7FAFB]">
                <span style={{ fontFamily: FI, fontSize: '13px', fontWeight: 600, color: '#202326' }}>{p.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#606569]" style={{ fontSize: '12px' }}>Suggested +units</span>
                  <span className="px-2 py-0.5 rounded bg-[#D1FAE5] text-[#156162]" style={{ fontSize: '11px', fontWeight: 700 }}>+{30 - p.score % 17}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-[#C8DDE6] text-[#606569] cursor-pointer hover:bg-[#F0F9FC]"
              style={{ fontFamily: FI, fontSize: '13px', fontWeight: 600 }}
            >
              Keep reviewing
            </button>
            <button
              onClick={onProceed}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#006E85] to-[#003D47] text-white cursor-pointer flex items-center justify-center gap-2"
              style={{ fontFamily: FI, fontSize: '13px', fontWeight: 700 }}
            >
              Go to Purchase Goods
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Small pieces ============
function ToggleBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${active ? 'bg-[#006E85] text-white shadow-sm' : 'text-[#606569] hover:text-[#202326]'}`}
      style={{ fontFamily: FI, fontSize: '13px', fontWeight: 600 }}
    >
      {label}
    </button>
  );
}

function SectionLabel({ n, title, tooltip }: { n: string; title: string; tooltip?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="px-2 py-0.5 rounded bg-[#E0F7FF] text-[#006E85]" style={{ fontFamily: FI, fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>
        {n}
      </span>
      <h2 className="text-[#202326]" style={{ fontFamily: FI, fontSize: '15px', fontWeight: 700 }}>{title}</h2>
      {tooltip && (
        <span className="group relative inline-flex items-center cursor-help">
          <Info size={13} color="#94A3B8" />
          <span className="absolute left-5 top-0 w-64 z-20 hidden group-hover:block bg-[#202326] text-white rounded-lg p-2 shadow-lg" style={{ fontSize: '11px', lineHeight: 1.4 }}>
            {tooltip}
          </span>
        </span>
      )}
    </div>
  );
}

function RibbonKpi({ label, value, delta, positive, accent }: { label: string; value: string; delta: string; positive: boolean; accent: string }) {
  return (
    <div className="bg-white/60 rounded-2xl p-5 border-l-4" style={{ border: '1.4px solid white', borderLeft: `4px solid ${accent}` }}>
      <div className="mb-2">
        <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '12px' }}>{label}</span>
      </div>
      <div style={{ fontFamily: FI, fontWeight: 700, fontSize: '26px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div className="flex items-center gap-1">
        {positive ? <ArrowUpRight size={12} color="#156162" /> : <ArrowDownRight size={12} color="#c65252" />}
        <span style={{ fontFamily: FI, fontSize: '11px', fontWeight: 600, color: positive ? '#156162' : '#c65252' }}>{delta}</span>
      </div>
    </div>
  );
}

function WasteTile({ label, n, value, total, color, clickable, onClick, cta, tooltip }: { label: string; n: string; value: number; total: number; color: string; clickable?: boolean; onClick?: () => void; cta?: string; tooltip?: string }) {
  const pct = ((value / total) * 100).toFixed(0);
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`bg-white/60 rounded-2xl p-4 ${clickable ? 'cursor-pointer hover:shadow-md' : ''} transition-all`}
      style={{ border: '1.4px solid white' }}
      title={tooltip}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <AlertTriangle size={12} color={color} />
          <span style={{ fontFamily: FI, fontSize: '11px', fontWeight: 600, color: '#202326' }}>{label}</span>
          {tooltip && <Info size={11} color="#94A3B8" />}
        </div>
        <span className="text-[#94A3B8]" style={{ fontSize: '10px' }}>{n}</span>
      </div>
      <div style={{ fontFamily: FI, fontWeight: 700, fontSize: '22px', color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div className="text-[#606569] mb-2" style={{ fontSize: '10px' }}>{pct}% of waste</div>
      {cta && (
        <div className="text-[#006E85]" style={{ fontFamily: FI, fontSize: '11px', fontWeight: 700 }}>{cta}</div>
      )}
    </div>
  );
}

function CashStep({ label, value, color, bold, prefix, absolute }: { label: string; value: number; color: string; bold?: boolean; prefix?: string; absolute?: boolean }) {
  const display = absolute ? Math.abs(value) : value;
  return (
    <div className="flex-1 text-center">
      <div className="text-[#606569] mb-1" style={{ fontFamily: FI, fontSize: '11px' }}>{label}</div>
      <div style={{ fontFamily: FI, fontWeight: bold ? 700 : 600, fontSize: bold ? '22px' : '18px', color, fontVariantNumeric: 'tabular-nums' }}>
        {prefix}${display.toLocaleString()}
      </div>
    </div>
  );
}

function SparkCard({ title, n, value, delta, positive, series, accent }: { title: string; n: string; value: string; delta: string; positive: boolean; series: number[]; accent: string }) {
  const data = series.map((v, i) => ({ x: i, y: v }));
  return (
    <div className="bg-white/60 rounded-2xl p-4" style={{ border: '1.4px solid white' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '12px', fontWeight: 600 }}>{title}</span>
        <span className="text-[#94A3B8]" style={{ fontSize: '10px' }}>{n}</span>
      </div>
      <div style={{ fontFamily: FI, fontWeight: 700, fontSize: '22px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div className="flex items-center gap-1 mb-1">
        {positive ? <ArrowUpRight size={11} color="#156162" /> : <ArrowDownRight size={11} color="#c65252" />}
        <span style={{ fontFamily: FI, fontSize: '11px', fontWeight: 600, color: positive ? '#156162' : '#c65252' }}>{delta}</span>
      </div>
      <ResponsiveContainer width="100%" height={40}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="y" stroke={accent} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============ PULSE STRIP ============
type PulseProps = {
  cash: number;
  projectedBurn: number;
  burnHot: boolean;
  runway: number;
  runwayDanger: boolean;
  whatIfMarketing: number;
  setWhatIfMarketing: (v: number) => void;
  whatIfPurchase: number;
  setWhatIfPurchase: (v: number) => void;
};

function PulseStrip(p: PulseProps) {
  // Card 3 morale trend (17.7/17.8): rising
  const satisfaction = 74;
  const satisfactionLag: 'up' | 'down' = 'up';
  // Card 4 stock pressure (15.5 unsold + 15.7 phantom)
  const stockPct = 78; // 0-100
  const stockDanger = stockPct > 90;
  // Card 5 customer pulse (17.3)
  const customerPulse = 86;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#E0F7FF] text-[#006E85]" style={{ fontFamily: FI, fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>
            PULSE STRIP
          </span>
          <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '12px' }}>
            Live warning system · {p.runwayDanger ? 'Survival at risk' : 'All systems steady'}
          </span>
        </div>
        <span className="text-[#94A3B8]" style={{ fontFamily: FI, fontSize: '11px' }}>Month 12 of 60</span>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {/* Card 1 — Financial Oxygen */}
        <div className="bg-white/60 rounded-2xl p-4" style={{ border: '1.4px solid white' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '11px', fontWeight: 600 }}>Financial Oxygen</span>
            <span className="text-[#94A3B8]" style={{ fontSize: '10px' }}>15.10</span>
          </div>
          <div style={{ fontFamily: FI, fontWeight: 700, fontSize: '22px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>
            ${p.cash.toLocaleString()}
          </div>
          <div className="mt-1" style={{ fontFamily: FI, fontSize: '11px' }}>
            <span className="text-[#94A3B8]">Projected burn · </span>
            <span
              style={{
                color: p.burnHot ? '#c65252' : '#606569',
                fontWeight: p.burnHot ? 700 : 500,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              ${p.projectedBurn.toLocaleString()}/mo
            </span>
          </div>
        </div>

        {/* Card 2 — Survival Timer */}
        <div
          className={`rounded-2xl p-4 ${p.runwayDanger ? 'animate-pulse' : ''}`}
          style={{
            border: p.runwayDanger ? '1.4px solid #c65252' : '1.4px solid white',
            background: p.runwayDanger ? 'rgba(254, 226, 226, 0.9)' : 'rgba(255,255,255,0.6)',
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '11px', fontWeight: 600 }}>Runway</span>
            <span className="text-[#94A3B8]" style={{ fontSize: '10px' }}>13.3</span>
          </div>
          <div
            style={{
              fontFamily: FI, fontWeight: 700, fontSize: '22px',
              color: p.runwayDanger ? '#c65252' : p.runway < 6 ? '#B45309' : '#156162',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {p.runway.toFixed(1)} mo
          </div>
          <div style={{ fontFamily: FI, fontSize: '11px', color: p.runwayDanger ? '#c65252' : '#606569', fontWeight: p.runwayDanger ? 700 : 500 }}>
            {p.runwayDanger ? 'Bankruptcy risk' : p.runway < 6 ? 'Caution' : 'Healthy'}
          </div>
        </div>

        {/* Card 3 — Operational Stability */}
        <div className="bg-white/60 rounded-2xl p-4" style={{ border: '1.4px solid white' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '11px', fontWeight: 600 }}>Morale</span>
            <span className="text-[#94A3B8]" style={{ fontSize: '10px' }}>17.7–17.8</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart size={18} color="#c65252" fill="#c65252" />
            <span style={{ fontFamily: FI, fontWeight: 700, fontSize: '22px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>
              {satisfaction}%
            </span>
            {satisfactionLag === 'up' ? (
              <ArrowUpRight size={14} color="#156162" />
            ) : (
              <ArrowDownRight size={14} color="#c65252" />
            )}
          </div>
          <div className="text-[#606569]" style={{ fontFamily: FI, fontSize: '11px' }}>
            Lag: {satisfactionLag === 'up' ? 'rising' : 'falling'} vs recent invest.
          </div>
        </div>

        {/* Card 4 — Stock Pressure */}
        <div className="bg-white/60 rounded-2xl p-4" style={{ border: '1.4px solid white' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '11px', fontWeight: 600 }}>Stock Pressure</span>
            <span className="text-[#94A3B8]" style={{ fontSize: '10px' }}>15.5 / 15.7</span>
          </div>
          <SemiGauge value={stockPct} color={stockDanger ? '#c65252' : stockPct > 75 ? '#B45309' : '#006E85'} />
          {stockDanger ? (
            <div className="mt-1 flex items-center gap-1" style={{ fontFamily: FI, fontSize: '10px', fontWeight: 700, color: '#c65252' }}>
              <AlertTriangle size={11} /> Phantom / waste alert
            </div>
          ) : (
            <div className="mt-1 text-[#606569]" style={{ fontFamily: FI, fontSize: '11px' }}>
              Warehouse {stockPct}% full
            </div>
          )}
        </div>

        {/* Card 5 — Customer Pulse */}
        <div className="bg-white/60 rounded-2xl p-4" style={{ border: '1.4px solid white' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '11px', fontWeight: 600 }}>Customer Pulse</span>
            <span className="text-[#94A3B8]" style={{ fontSize: '10px' }}>17.3</span>
          </div>
          <div style={{ fontFamily: FI, fontWeight: 700, fontSize: '22px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>
            {customerPulse}<span className="text-[#94A3B8]" style={{ fontSize: '13px', fontWeight: 500 }}> / 100</span>
          </div>
          <div className="flex gap-1 mt-1 flex-wrap">
            <SegBadge label="Value" score={82} />
            <SegBadge label="Balanced" score={91} active />
            <SegBadge label="Premium" score={74} />
          </div>
        </div>
      </div>

      {/* What-If Action Hub */}
      <div className="bg-white/60 rounded-2xl p-4 mt-3" style={{ border: '1.4px solid white' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div style={{ fontFamily: FI, fontSize: '12px', fontWeight: 700, color: '#202326' }}>What-If Action Hub</div>
            <div className="text-[#606569]" style={{ fontFamily: FI, fontSize: '11px' }}>
              Drag sliders to preview impact before you submit the month.
            </div>
          </div>
          {p.runwayDanger && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#FEE2E2]" style={{ fontFamily: FI, fontSize: '11px', fontWeight: 700, color: '#c65252' }}>
              <AlertCircle size={12} /> Take a loan or reduce spend
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <WhatIfSlider
            label="Extra Marketing Spend"
            value={p.whatIfMarketing}
            onChange={p.setWhatIfMarketing}
            max={50000}
            step={1000}
          />
          <WhatIfSlider
            label="Extra Purchase Goods"
            value={p.whatIfPurchase}
            onChange={p.setWhatIfPurchase}
            max={50000}
            step={1000}
          />
        </div>
      </div>
    </div>
  );
}

function SemiGauge({ value, color }: { value: number; color: string }) {
  const pct = Math.min(100, Math.max(0, value));
  const r = 34;
  const c = Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="relative flex items-center justify-center" style={{ height: 42 }}>
      <svg width="90" height="48" viewBox="0 0 90 48">
        <path d={`M 8 42 A ${r} ${r} 0 0 1 82 42`} stroke="#F0F6FA" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path
          d={`M 8 42 A ${r} ${r} 0 0 1 82 42`}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="absolute bottom-0" style={{ fontFamily: FI, fontWeight: 700, fontSize: '16px', color, fontVariantNumeric: 'tabular-nums' }}>
        {pct}%
      </div>
    </div>
  );
}

function SegBadge({ label, score, active }: { label: string; score: number; active?: boolean }) {
  return (
    <div
      className="px-1.5 py-0.5 rounded"
      style={{
        fontFamily: FI, fontSize: '9px', fontWeight: 700,
        background: active ? '#006E85' : '#F0F6FA',
        color: active ? 'white' : '#606569',
      }}
    >
      {label} {score}
    </div>
  );
}

function WhatIfSlider({ label, value, onChange, max, step }: { label: string; value: number; onChange: (v: number) => void; max: number; step: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '11px', fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: FI, fontSize: '12px', fontWeight: 700, color: value > 0 ? '#c65252' : '#202326', fontVariantNumeric: 'tabular-nums' }}>
          +${value.toLocaleString()}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#006E85] cursor-pointer"
      />
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-[#94A3B8]" style={{ fontFamily: FI, fontSize: '11px' }}>{label}</span>
    </div>
  );
}
