// Game state — Year 1, Month 4. Brew Lane, a specialty coffee shop.
// Cash-tight phase, finding product-market fit.

const GAME = {
  business: 'Brew Lane',
  team: 'Team Roastline',
  role: 'Founder',
  year: 1,
  month: 4,
  monthLabel: 'Month 4 · Year 1',
  startCash: 18420,   // start of month
  burnLastMonth: 9180,
  runwayMonths: 6,
  loanCap: 24000,     // 60% of asset value
  loanCurrent: 0,
};

// 6 active products (max). Each with cost, current price, last month sold.
const PRODUCTS = [
  { id: 'esp', name: 'Espresso',     unit: 'cup',  cost: 0.85, price: 3.50, lastSold: 412, expiryDays: 1,  selected: true },
  { id: 'cap', name: 'Cappuccino',   unit: 'cup',  cost: 1.10, price: 4.50, lastSold: 588, expiryDays: 1,  selected: true },
  { id: 'cb',  name: 'Cold Brew',    unit: 'cup',  cost: 1.20, price: 5.00, lastSold: 184, expiryDays: 5,  selected: true },
  { id: 'cr',  name: 'Croissant',    unit: 'pc',   cost: 1.40, price: 3.75, lastSold: 246, expiryDays: 2,  selected: true },
  { id: 'mu',  name: 'Blueberry Muffin', unit: 'pc', cost: 1.10, price: 3.25, lastSold: 132, expiryDays: 3, selected: true },
  { id: 'gr',  name: 'Whole Bean (250g)', unit: 'bag', cost: 6.20, price: 14.00, lastSold: 22, expiryDays: 90, selected: false },
];

const SUPPLIERS = [
  { id: 't1', tier: 'Tier 1 · Local roaster',    distance: 4,  moq: 20,  priceMult: 1.00, leadDays: 1, note: 'Premium beans, no MOQ pressure.' },
  { id: 't2', tier: 'Tier 2 · Regional wholesale', distance: 38, moq: 80,  priceMult: 0.86, leadDays: 3, note: 'Cheaper unit cost, mid quality.' },
  { id: 't3', tier: 'Tier 3 · National importer',  distance: 220, moq: 250, priceMult: 0.72, leadDays: 7, note: 'Lowest cost, large MOQ — overstock risk.' },
];

const SEGMENTS = [
  { id: 'val', name: 'Value Seekers',     share: 38, cac: 4.20, conv: 11, color: '#F59E0B', desc: 'Price-sensitive commuters. Respond to discounts.' },
  { id: 'bal', name: 'Balanced Buyers',   share: 44, cac: 6.10, conv: 18, color: '#00B1D6', desc: 'Want quality at fair price. Largest share.' },
  { id: 'prm', name: 'Premium Loyalists', share: 18, cac: 9.40, conv: 28, color: '#8A38F5', desc: 'High margin, low volume. Care about origin & ritual.' },
];

const STAFF_ROLES = [
  { id: 'sup', name: 'Support', current: 1, recommended: 1, costPer: 2400, desc: 'Inventory, cleaning, opening/closing.' },
  { id: 'bar', name: 'Barista', current: 2, recommended: 3, costPer: 3100, desc: 'Drives throughput at peak hours.' },
  { id: 'wai', name: 'Waiter',  current: 1, recommended: 1, costPer: 2200, desc: 'Front-of-house, table service.' },
];

// Last 6 months — for sparklines + trend on results
const HISTORY = {
  revenue:  [ 6800,  7950,  8420,  9180,  null, null ],   // M1..M6, M5 will be filled in Results
  cash:     [22500, 19800, 19120, 18420,  null, null ],
  footfall:[  820,   980,  1110,  1240,  null, null ],
  margin:  [   12,    15,    16,    18,  null, null ],   // %
};

// What player is about to commit (the "Decisions" state)
const DEFAULT_DECISIONS = {
  // Inventory
  supplier: 't2',
  buyOrders: { esp: 320, cap: 480, cb: 160, cr: 220, mu: 120, gr: 0 },
  // Pricing — same shape as PRODUCTS prices, may be modified
  prices: { esp: 3.50, cap: 4.50, cb: 5.00, cr: 3.75, mu: 3.25, gr: 14.00 },
  // Marketing
  marketingBudget: 1200,
  targetSegments: ['bal'],
  // Staff
  staff: { sup: 1, bar: 2, wai: 1 },
  // Finance
  loanOn: false,
  loanAmount: 0,
};

// Results "actuals" for the just-completed month (used on Results screen)
const RESULTS = {
  revenue: 10240,
  cogs: 2810,
  rent: 2200,
  marketing: 1200,
  salary: 8900 / 1.0,   // actual salary
  wastage: 340,
  maintenance: 180,
  interest: 0,
  depreciation: 220,
  misc: 110,
  // by-product revenue
  byProduct: [
    { id: 'esp', name: 'Espresso',   sold: 466, unsold: 18,  rev: 1631 },
    { id: 'cap', name: 'Cappuccino', sold: 642, unsold: 12,  rev: 2889 },
    { id: 'cb',  name: 'Cold Brew',  sold: 198, unsold: 22,  rev: 990  },
    { id: 'cr',  name: 'Croissant',  sold: 268, unsold: 34,  rev: 1005 },
    { id: 'mu',  name: 'Muffin',     sold: 144, unsold: 26,  rev: 468  },
    { id: 'gr',  name: 'Whole Bean', sold: 28,  unsold: 0,   rev: 392  },
  ],
  footfall: 1372,
  retention: 64,        // %
  satisfaction: 71,     // %
  staffCount: 4,
  cashStart: 18420,
  cashEnd: 19140,       // ~+720
  forecastRev: 9700,    // we beat forecast modestly
  // P&L waterfall steps
  waterfall: [
    { label: 'Open',   value: 18420, type: 'start' },
    { label: 'Revenue', value: 10240, type: 'pos' },
    { label: 'COGS',    value: -2810, type: 'neg' },
    { label: 'Rent',    value: -2200, type: 'neg' },
    { label: 'Salary',  value: -2780, type: 'neg' },  // smaller chunk than total — non-cash split
    { label: 'Mkt',     value: -1200, type: 'neg' },
    { label: 'Other',   value: -530,  type: 'neg' },
    { label: 'Close',   value: 19140, type: 'end' },
  ],
};

// ====================== QUARTERLY ======================
const QUARTER = {
  label: 'Q2 · Year 1',
  number: 2,
  // Recap of Q1 to inform Q2 strategy
  q1: {
    revenue: 23170,
    profit: 1840,
    cashStart: 22500,
    cashEnd: 18420,
    footfall: 2910,
    nps: 42,
    bestProduct: 'Cappuccino',
    weakestProduct: 'Whole Bean',
  },
  // Q2 plan options — strategic bets
  themes: [
    { id: 'lean',     name: 'Lean & profitable',  desc: 'Cut SKUs, hold prices, prioritise margin over growth.', cashImpact: '+$3.2k', revImpact: '-5%', risk: 'Low growth ceiling.', icon: '◆' },
    { id: 'growth',   name: 'Growth push',        desc: 'Aggressive marketing, expand SKUs, capture share.',     cashImpact: '-$1.8k', revImpact: '+22%', risk: 'Cash burn accelerates.', icon: '↑' },
    { id: 'premium',  name: 'Move upmarket',      desc: 'Reposition on Premium Loyalists. Raise prices 10%.',     cashImpact: '+$1.4k', revImpact: '+9%',  risk: 'May alienate Value Seekers.', icon: '★' },
  ],
  // Initiatives that span the quarter
  initiatives: [
    { id: 'loyalty',   name: 'Loyalty program',         cost: 1800,  q: 'Builds retention, pays back M3 onwards.', selected: true },
    { id: 'pos',       name: 'New POS system',          cost: 3200,  q: 'Cuts checkout time 40%, raises throughput.', selected: false },
    { id: 'menu',      name: 'Menu refresh (3 SKUs)',   cost: 1200,  q: 'New seasonal items. Risk: untested demand.', selected: true },
    { id: 'partner',   name: 'Office partnership',      cost: 800,   q: 'Bulk-deal with the tower next door. Predictable AM rush.', selected: false },
    { id: 'training',  name: 'Barista certification',   cost: 1400,  q: 'Quality + speed. NPS boost.', selected: true },
    { id: 'rebrand',   name: 'Storefront rebrand',      cost: 4200,  q: 'Visual refresh. Long-term play.', selected: false },
  ],
  // KPI targets
  targets: {
    revenue:   { value: 32000, baseline: 27500, label: 'Revenue' },
    margin:    { value: 22,    baseline: 18,    label: 'Net margin %' },
    footfall:  { value: 3600,  baseline: 3000,  label: 'Footfall' },
    retention: { value: 70,    baseline: 60,    label: 'Retention %' },
  },
  // Mid-quarter checkpoint (after Month 5 — we're at Q2-mid)
  midCheck: {
    revenueProgress: 11240,
    revenueOnTrack:  10670,
    eventTitle: 'New office tower opened next door',
    eventBody: 'AM rush spiked 28% on weekdays — but Tier-2 supplier hit a 4-day delay. Stockouts on cappuccino on three mornings.',
    pivotOptions: [
      { id: 'a', name: 'Accept partnership offer',  body: 'Office tower wants a 200-cup/day standing order at -12%. Locks AM capacity.', delta: '+$4.2k Q', risk: 'Reduces walk-in capacity.' },
      { id: 'b', name: 'Switch to Tier-1 supplier', body: 'Lose 14% supplier savings, gain reliability. Restocks in 1 day.', delta: '-$1.1k Q', risk: 'Margin compression.' },
      { id: 'c', name: 'Stay the course',           body: 'Accept volatility — assume Tier-2 normalises. Bank on Q1 momentum.', delta: '±$0', risk: 'Repeat stockouts likely.' },
    ],
    selected: 'a',
  },
  // Quarter results
  qResults: {
    revenue: 30840,
    target: 32000,
    margin: 21,
    marginTarget: 22,
    footfall: 3520,
    footfallTarget: 3600,
    retention: 67,
    retentionTarget: 70,
    nps: 51,
    cashEnd: 21800,
    monthly: [10240, 10180, 10420], // M4, M5, M6
    initiativesShipped: 3,
    learnings: [
      { good: true,  text: 'Loyalty program added 240 repeat visitors — 18% above forecast.' },
      { good: true,  text: 'Menu refresh: 2 of 3 new SKUs hit double-digit volume.' },
      { good: false, text: 'Did not hit revenue target — supplier reliability cost ~$1.2k in Q2.' },
      { good: false, text: 'Staff turnover: 1 barista left mid-quarter.' },
    ],
  },
};

// ====================== ANNUAL ======================
const ANNUAL = {
  label: 'Year 1 · Annual Gate',
  // Year-1 recap
  yearTotals: {
    revenue: 124800,
    netProfit: 11200,
    margin: 9,
    cashEnd: 24600,
    footfall: 14200,
    customers: 6800,
    nps: 54,
  },
  quarters: [
    { q: 'Q1', revenue: 23170, margin: 8,  highlight: 'Found product-market fit on cappuccino' },
    { q: 'Q2', revenue: 30840, margin: 21, highlight: 'Added loyalty program; missed revenue target by 4%' },
    { q: 'Q3', revenue: 33480, margin: 12, highlight: 'Premium SKU launch; one-off rebrand cost' },
    { q: 'Q4', revenue: 37310, margin: 14, highlight: 'Best quarter ever; capacity-constrained on weekends' },
  ],
  // Strategic options for Year 2
  year2Options: [
    {
      id: 'optimise',
      name: 'Optimise the single store',
      tag: 'Compound',
      desc: 'Focus on margin, throughput, and retention at Brew Lane. No new locations.',
      capex: 12000,
      yearRev: 158000,
      yearProfit: 24000,
      ownership: 100,
      pros: ['No dilution', 'Predictable cashflow', 'Operational mastery'],
      cons: ['Growth ceiling', 'Single point of failure'],
    },
    {
      id: 'expand',
      name: 'Open a second location',
      tag: 'Scale',
      desc: 'Find a second high-foot-traffic site. Replicate the playbook. Requires outside capital.',
      capex: 95000,
      yearRev: 218000,
      yearProfit: 18000,
      ownership: 72,
      pros: ['Builds a chain story', 'Doubles addressable demand', 'Brand leverage'],
      cons: ['Heavy dilution', 'Execution risk on site #2', 'Splits founder attention'],
    },
    {
      id: 'wholesale',
      name: 'Move into wholesale',
      tag: 'Platform',
      desc: 'License the roast and supply 6 partner cafés. Asset-light, but distribution-heavy.',
      capex: 38000,
      yearRev: 192000,
      yearProfit: 21000,
      ownership: 88,
      pros: ['Lower per-dollar capex', 'New revenue line', 'Brand reach'],
      cons: ['New muscle to build', 'Margin lower than retail', 'Channel conflict'],
    },
  ],
  // Funding offers (only relevant if expand/wholesale picked)
  offers: [
    { id: 'angel',   name: 'Angel syndicate',     amount: 80000,  equity: 12,  valuation: 580000,  terms: 'Convertible note · 8% disc · 18mo' },
    { id: 'seed',    name: 'Seed VC',             amount: 250000, equity: 28,  valuation: 640000,  terms: 'Priced round · 1× pref · board seat' },
    { id: 'revloan', name: 'Revenue-based loan',  amount: 60000,  equity: 0,   valuation: null,    terms: '8% of monthly revenue until 1.5× repaid' },
    { id: 'bootstrap', name: 'Bootstrap',         amount: 0,      equity: 0,   valuation: null,    terms: 'No outside money. Pace constrained.' },
  ],
  // Valuation drivers
  drivers: [
    { label: 'Revenue multiple',    value: 1.4, weight: 35, desc: 'Coffee retail comp set: 1.0–1.8×' },
    { label: 'Profit multiple',     value: 8,   weight: 30, desc: 'Strong margins relative to peers' },
    { label: 'Brand & loyalty',     value: 7,   weight: 15, desc: 'NPS 54, 64% retention' },
    { label: 'Growth trajectory',   value: 6,   weight: 12, desc: 'Q4 +13% QoQ' },
    { label: 'Operational maturity',value: 5,   weight: 8,  desc: 'Single-store, 1 founder bottleneck' },
  ],
  baseValuation: 580000,
};


