import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppNavigate } from '../lib/use-app-navigate';
import { GridBackground } from './GridBackground';
import { PageTransition } from './PageTransition';
import { TabBar } from './TabBar';
import badgeIcon from './icons/business-product-check--Streamline-Pixel.svg';
import bankIcon from './icons/money-payments-bank--Streamline-Pixel.svg';
import buildingIcon from './icons/real-estate-building-3--Streamline-Pixel.svg';
import downloadIcon from './icons/internet-network-download--Streamline-Pixel.svg';
import moneyIcon from './icons/business-money-coin-currency--Streamline-Pixel.svg';
import reportChartIcon from './icons/business-product-report-present-grahp--Streamline-Pixel.svg';
import shieldIcon from './icons/business-products-cash-shield--Streamline-Pixel.svg';
import trophyIcon from './icons/social-rewards-vip-crown-king--Streamline-Pixel.svg';
import usersIcon from './icons/multiple-user--Streamline-Pixel.svg';

const FO = "'Outfit', sans-serif";
const INK = 'var(--game-text)';
const TEXT = 'var(--game-text-secondary)';
const BORDER = 'var(--color-border)';
const SURFACE = 'rgba(255,255,255,0.72)';
const TEAL = 'var(--game-teal-mid)';
const TEAL_DARK = 'var(--game-teal-dark)';
const CYAN = 'var(--color-chart-1)';
const DEEP = 'var(--color-chart-2)';
const AMBER = 'var(--color-chart-4)';
const RED = 'var(--color-chart-5)';
const POSITIVE = 'var(--game-positive)';
const CTA_BG = 'var(--game-cta-gradient)';

const tabs = [
  { id: 'results', label: 'Final Results' },
  { id: 'finance', label: 'Finance & Funding' },
  { id: 'customers', label: 'Performance & Customers' },
  { id: 'journey', label: 'Journey Summary' },
];

const fiveYearTrend = [
  { year: 'Y1', revenue: 420000, profit: 52000, valuation: 1240000 },
  { year: 'Y2', revenue: 880000, profit: 141000, valuation: 2380000 },
  { year: 'Y3', revenue: 1460000, profit: 304000, valuation: 4120000 },
  { year: 'Y4', revenue: 2190000, profit: 636000, valuation: 6020000 },
  { year: 'Y5', revenue: 3240000, profit: 864000, valuation: 8450000 },
];

const benchmarkRows = [
  { metric: 'Market Share', yours: '18.4%', average: '12.6%', top: '28.7%' },
  { metric: 'Occupancy', yours: '78.5%', average: '64.2%', top: '92.1%' },
  { metric: 'Churn Rate', yours: '6.1%', average: '11.3%', top: '3.2%' },
  { metric: 'Retention (12-Month)', yours: '71.0%', average: '58.4%', top: '82.6%' },
  { metric: 'Founder Ownership', yours: '64.0%', average: '52.3%', top: '41.8%' },
  { metric: 'Debt Ratio', yours: '0.28', average: '0.46', top: '0.18' },
];

const cashFlowTrend = [
  { year: 'Y1', cashFlow: 120000, valuation: 1240000 },
  { year: 'Y2', cashFlow: 310000, valuation: 2380000 },
  { year: 'Y3', cashFlow: 680000, valuation: 4120000 },
  { year: 'Y4', cashFlow: 930000, valuation: 6020000 },
  { year: 'Y5', cashFlow: 1250000, valuation: 8450000 },
];

const financialSnapshot = [
  { metric: 'Revenue', y5: '$3,240,000', y4: '$2,190,000', delta: '+48%', industry: '$1,920,000', up: true },
  { metric: 'Net Profit', y5: '$864,000', y4: '$635,000', delta: '+36%', industry: '$410,000', up: true },
  { metric: 'ROI', y5: '28.4%', y4: '22.1%', delta: '+6.3pp', industry: '18.7%', up: true },
  { metric: 'ROE', y5: '24.6%', y4: '18.7%', delta: '+5.9pp', industry: '16.3%', up: true },
  { metric: 'ROA', y5: '16.8%', y4: '13.2%', delta: '+3.6pp', industry: '11.5%', up: true },
  { metric: 'Operating Ratio', y5: '0.72', y4: '0.81', delta: '−0.09', industry: '0.84', up: true },
];

const customerGrowthTrend = [
  { year: 'Y1', newCustomers: 12400, returning: 8100 },
  { year: 'Y2', newCustomers: 16800, returning: 11300 },
  { year: 'Y3', newCustomers: 21700, returning: 15400 },
  { year: 'Y4', newCustomers: 29600, returning: 21200 },
  { year: 'Y5', newCustomers: 38900, returning: 29600 },
];

const segmentSnapshot = [
  { segment: 'Value Seekers', share: '42.0%', avgSpend: '$12.40', retention: '62.1%' },
  { segment: 'Balanced Buyers', share: '38.0%', avgSpend: '$18.60', retention: '71.3%' },
  { segment: 'Premium Loyalists', share: '20.0%', avgSpend: '$28.90', retention: '81.7%' },
];

const operationsKpis = [
  { label: 'Footfall', value: '124,350', delta: '+27.6% vs Y4' },
  { label: 'Conversion Rate', value: '18.7%', delta: '+3.6pp vs Y4' },
  { label: 'Avg Order Value', value: '$17.80', delta: '+9.2% vs Y4' },
  { label: 'Waste Rate', value: '4.6%', delta: '−0.8pp vs Y4' },
];

const financeBridge = [
  { label: 'Opening', value: 182000, color: 'var(--color-muted-foreground)' },
  { label: 'Op. Profit', value: 864000, color: POSITIVE },
  { label: 'Debt Service', value: -146000, color: RED },
  { label: 'Inventory', value: -188000, color: AMBER },
  { label: 'Closing', value: 712500, color: TEAL },
];

const journeyMilestones = [
  { title: 'Year 1', note: 'Validated the core cafe model and kept burn controlled.', score: 164 },
  { title: 'Year 2', note: 'Expanded menu depth without over-hiring.', score: 309 },
  { title: 'Year 3', note: 'Retention became the main growth driver.', score: 502 },
  { title: 'Year 4', note: 'Debt ratio stayed below the cohort risk threshold.', score: 693 },
  { title: 'Year 5', note: 'Finished top-three through ownership discipline.', score: 847 },
];

function money(value: number) {
  if (Math.abs(value) >= 1000000) return `${value < 0 ? '-' : ''}$${(Math.abs(value) / 1000000).toFixed(1)}M`;
  return `${value < 0 ? '-' : ''}$${(Math.abs(value) / 1000).toFixed(0)}K`;
}

const REPORT_SUMMARY = `Dhaulagiri Cafe — Final Report (Year 5)

Revenue:           $3,240,000  (+48% vs Y4)
Net Profit:        $864,000    (+36% vs Y4)
Company Valuation: $8,450,000  (+41% vs Y4)
Founder Retained:  $5,408,000  (64% ownership)

Market Share:      18.4%  (avg 12.6%, top 28.7%)
Occupancy:         78.5%  (avg 64.2%, top 92.1%)
Churn Rate:        6.1%   (avg 11.3%, top 3.2%)
Retention (12mo):  71.0%  (avg 58.4%, top 82.6%)
Debt Ratio:        0.28   (avg 0.46, top 0.18)

Score: 847 / 1000
Team Annapurna · End of Year 5 · Final Evaluation`;

export function FinalReport() {
  const [activeTab, setActiveTab] = useState('results');
  const [copied, setCopied] = useState(false);
  const navigate = useAppNavigate();

  function handleCopy() {
    navigator.clipboard.writeText(REPORT_SUMMARY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <GridBackground>
      <PageTransition>
        <main className="mx-auto w-full max-w-[1312px] px-6 pb-16 pt-5">
          <header className="mb-6 flex flex-col gap-5 border-b border-[#C8DDE6] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span style={styles.eyebrow}>End of Year 5 · Final Evaluation</span>
              <h1 style={styles.h1}>Final Report</h1>
              <p style={styles.sub}>
                Five years, one location, every decision compounded. Here is what you built — what worked, what it became worth, and what you kept.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ActionButton icon={copied ? <Check size={16} /> : <Copy size={16} />} onClick={handleCopy}>
                {copied ? 'Copied' : 'Copy'}
              </ActionButton>
              <ActionButton icon={<DsIcon icon={downloadIcon} size={16} />}>Export</ActionButton>
              <ActionButton icon={<DsIcon icon={trophyIcon} size={16} />} primary onClick={() => navigate('/ref/game/leaderboard')}>
                View Leaderboard
              </ActionButton>
            </div>
          </header>

          <section className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Kpi icon={<DsIcon icon={reportChartIcon} size={19} />} label="Revenue" value="$3.24M" detail="+48% vs Year 4" />
            <Kpi icon={<DsIcon icon={moneyIcon} size={19} />} label="Net Profit" value="$864K" detail="+36% vs Year 4" />
            <Kpi icon={<DsIcon icon={buildingIcon} size={19} />} label="Company Valuation" value="$8.45M" detail="+41% vs Year 4" />
            <Kpi icon={<DsIcon icon={shieldIcon} size={19} />} label="Founder Retained" value="$5.41M" detail="64% of $8.45M" accent />
          </section>

          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            <span style={styles.metaPill}>Dhaulagiri Cafe · Team Annapurna · Year 5</span>
          </div>

          {activeTab === 'results' && <ResultsTab />}
          {activeTab === 'finance' && <FinanceTab />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'journey' && <JourneyTab />}
        </main>
      </PageTransition>
    </GridBackground>
  );
}

function ResultsTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]">
        <Panel>
          <ChartTitle icon={<DsIcon icon={reportChartIcon} size={17} />} title="Five-year growth over time" subtitle="Revenue, net profit, and company valuation tracked across all five years." />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fiveYearTrend} margin={{ top: 12, right: 22, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: TEXT, fontFamily: FO }} />
                <YAxis tick={{ fontSize: 11, fill: TEXT, fontFamily: FO }} tickFormatter={(v) => money(Number(v))} width={58} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontFamily: FO, fontSize: 12, color: TEXT }} />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke={CYAN} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="profit" name="Net Profit" stroke={POSITIVE} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="valuation" name="Valuation" stroke={DEEP} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <span style={styles.eyebrow}>Benchmarked</span>
          <h2 style={styles.h2}>Business snapshot</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: FO }}>
              <thead>
                <tr>
                  {['Metric', 'You', 'Average', 'Top'].map((head, i) => (
                    <th key={head} style={{ ...styles.th, textAlign: i === 0 ? 'left' : 'right' }}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {benchmarkRows.map((row) => (
                  <tr key={row.metric}>
                    <td style={styles.td}>{row.metric}</td>
                    <td style={{ ...styles.td, ...styles.num, color: TEAL, fontWeight: 800 }}>{row.yours}</td>
                    <td style={{ ...styles.td, ...styles.num, color: TEXT }}>{row.average}</td>
                    <td style={{ ...styles.td, ...styles.num, color: TEXT }}>{row.top}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {/* Stages of Evolution */}
      <Panel>
        <span style={styles.eyebrow}>Three Acts</span>
        <h2 style={styles.h2}>Stages of evolution</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { stage: 'Early Stage', period: 'Year 1–2', note: 'Validated the idea, built the MVP menu, and acquired first loyal customers in the neighborhood.' },
            { stage: 'Growth Stage', period: 'Year 3', note: 'Scaled operations, improved unit economics, and expanded the customer base through targeted marketing.' },
            { stage: 'Scale Stage', period: 'Year 4–5', note: 'Optimized the business, strengthened the brand, and built a foundation for long-term impact.' },
          ].map((s) => (
            <div key={s.stage} className="flex flex-col gap-3 rounded-xl border border-[#C8DDE6] bg-white p-4">
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E0F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DsIcon icon={buildingIcon} size={22} />
              </div>
              <div>
                <div style={{ color: TEXT, fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.period}</div>
                <div style={{ color: TEAL, fontSize: 15, fontWeight: 800, marginTop: 2 }}>{s.stage}</div>
                <p style={{ color: TEXT, fontSize: 13, lineHeight: 1.55, marginTop: 6 }}>{s.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Experience Summary */}
      <Panel>
        <span style={styles.eyebrow}>Why You Won Where You Won</span>
        <h2 style={styles.h2}>Experience summary</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { icon: reportChartIcon, title: 'Unit Economics Matter', body: 'Contribution margin and cost discipline gave you a sustainable path to profitability.' },
            { icon: usersIcon, title: 'Retention Drives Growth', body: 'A strong experience and loyalty programs kept customers spending more and churning less.' },
            { icon: shieldIcon, title: 'Capital Discipline Wins', body: 'Smart runway management and selective dilution kept you optionful when it mattered.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 rounded-xl border border-[#C8DDE6] bg-white p-4">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#E0F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <DsIcon icon={item.icon} size={20} />
              </div>
              <div>
                <div style={{ color: INK, fontSize: 14, fontWeight: 800 }}>{item.title}</div>
                <p style={{ color: TEXT, fontSize: 12, lineHeight: 1.55, marginTop: 4 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function FinanceTab() {
  return (
    <div className="flex flex-col gap-4">
      {/* KPI ribbon */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MiniKpi label="Cash Balance" value="$712,500" delta="+22% vs Y4" up />
        <MiniKpi label="Debt Ratio" value="0.28" delta="−12% vs Y4" up />
        <MiniKpi label="Debt-to-Equity" value="0.36" delta="−15% vs Y4" up />
        <MiniKpi label="Company Valuation" value="$8,450,000" delta="+41% vs Y4" up />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <Panel>
          <ChartTitle icon={<DsIcon icon={reportChartIcon} size={17} />} title="Cash flow & valuation over time" subtitle="Cash flow and company valuation tracked across all five operating years." />
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowTrend} margin={{ top: 12, right: 22, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: TEXT, fontFamily: FO }} />
                <YAxis tick={{ fontSize: 11, fill: TEXT, fontFamily: FO }} tickFormatter={(v) => money(Number(v))} width={60} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontFamily: FO, fontSize: 12, color: TEXT }} />
                <Line type="monotone" dataKey="cashFlow" name="Cash Flow" stroke={CYAN} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="valuation" name="Valuation" stroke={RED} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <span style={styles.eyebrow}>Cap Table</span>
          <h2 style={styles.h2}>Funding & dilution</h2>
          <p style={{ ...styles.sub, marginTop: 4 }}>
            $8.45M company. Founder owns 64%, retaining $5.41M of value before score normalisation.
          </p>
          {/* Ownership bar */}
          <div className="mt-5 overflow-hidden rounded-lg" style={{ height: 36, display: 'flex' }}>
            <div style={{ width: '64%', background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 800 }}>64%</div>
            <div style={{ width: '36%', background: 'var(--color-chart-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 800 }}>36%</div>
          </div>
          <div className="mt-2 flex gap-4" style={{ fontSize: 12, color: TEXT }}>
            <span className="inline-flex items-center gap-1.5"><span style={{ width: 10, height: 10, borderRadius: '50%', background: TEAL, display: 'inline-block' }} />Founder</span>
            <span className="inline-flex items-center gap-1.5"><span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-chart-3)', display: 'inline-block' }} />Investor</span>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {[
              { label: 'Founder Ownership', value: '64%' },
              { label: 'Cash Raised', value: '$2,450,000' },
              { label: 'Post-Money Valuation', value: '$8,450,000' },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F0F6FA', borderRadius: 10 }}>
                <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{row.label}</span>
                <span style={{ color: INK, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#E0F7FF', borderRadius: 10, border: `1px solid ${BORDER}` }}>
              <span style={{ color: TEAL, fontSize: 13, fontWeight: 700 }}>Founder Retained Value</span>
              <span style={{ color: TEAL, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>$5,408,000</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Cash bridge + Financial Snapshot */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Panel>
          <ChartTitle icon={<DsIcon icon={bankIcon} size={17} />} title="Cash movement bridge" subtitle="Positive and negative movements in the final year, separated by semantic color." />
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeBridge} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: TEXT, fontFamily: FO }} />
                <YAxis tick={{ fontSize: 11, fill: TEXT, fontFamily: FO }} tickFormatter={(v) => money(Number(v))} width={60} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {financeBridge.map((entry) => <Cell key={entry.label} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <span style={styles.eyebrow}>Numbers</span>
          <h2 style={styles.h2}>Financial snapshot</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: FO }}>
              <thead>
                <tr>
                  {['Metric', 'Year 5', 'Year 4', 'vs Y4', 'Industry'].map((h, i) => (
                    <th key={h} style={{ ...styles.th, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {financialSnapshot.map((row) => (
                  <tr key={row.metric}>
                    <td style={styles.td}>{row.metric}</td>
                    <td style={{ ...styles.td, ...styles.num, color: TEAL, fontWeight: 800 }}>{row.y5}</td>
                    <td style={{ ...styles.td, ...styles.num, color: TEXT }}>{row.y4}</td>
                    <td style={{ ...styles.td, ...styles.num }}>
                      <span style={{ color: POSITIVE, fontWeight: 800 }}>↗ {row.delta}</span>
                    </td>
                    <td style={{ ...styles.td, ...styles.num, color: TEXT }}>{row.industry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {/* Capital Lessons */}
      <Panel>
        <span style={styles.eyebrow}>What Capital Taught You</span>
        <h2 style={styles.h2}>Capital lessons</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { icon: bankIcon, title: 'Runway Matters', body: 'A strong cash position let you invest, pivot, and weather demand shocks without panic raises.' },
            { icon: shieldIcon, title: 'Debt Discipline', body: 'Keeping debt below industry average preserved negotiating power and lowered fragility.' },
            { icon: moneyIcon, title: 'Dilution Trade-Offs', body: 'Every round bought fuel and cost equity. You raised what you needed, not what was offered.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 rounded-xl border border-[#C8DDE6] bg-white p-4">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#E0F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <DsIcon icon={item.icon} size={20} />
              </div>
              <div>
                <div style={{ color: INK, fontSize: 14, fontWeight: 800 }}>{item.title}</div>
                <p style={{ color: TEXT, fontSize: 12, lineHeight: 1.55, marginTop: 4 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function CustomersTab() {
  return (
    <div className="flex flex-col gap-4">
      {/* KPI ribbon */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MiniKpi label="Market Share" value="18.4%" delta="+4.8pp vs Y4" up />
        <MiniKpi label="Occupancy" value="78.5%" delta="+14.3pp vs Y4" up />
        <MiniKpi label="Customer Retention" value="71.0%" delta="+12.6pp vs Y4" up />
        <MiniKpi label="Total Customers" value="86,420" delta="+32.1% vs Y4" up />
      </div>

      {/* Customer growth chart */}
      <Panel>
        <ChartTitle icon={<DsIcon icon={usersIcon} size={17} />} title="Customer growth over time" subtitle="New customers acquired each year vs returning customers — retention compounding visibly." />
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={customerGrowthTrend} margin={{ top: 12, right: 22, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: TEXT, fontFamily: FO }} />
              <YAxis tick={{ fontSize: 11, fill: TEXT, fontFamily: FO }} tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}K`} width={44} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontFamily: FO, fontSize: 12, color: TEXT }} />
              <Line type="monotone" dataKey="newCustomers" name="New Customers" stroke={CYAN} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="returning" name="Returning Customers" stroke={RED} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Segment snapshot + Operations */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Panel>
          <span style={styles.eyebrow}>Who Bought, How Often</span>
          <h2 style={styles.h2}>Customer segment snapshot</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: FO }}>
              <thead>
                <tr>
                  {['Segment', 'Share', 'Avg Spend / Visit', 'Retention'].map((h, i) => (
                    <th key={h} style={{ ...styles.th, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {segmentSnapshot.map((row) => (
                  <tr key={row.segment}>
                    <td style={styles.td}>{row.segment}</td>
                    <td style={{ ...styles.td, ...styles.num, color: TEAL, fontWeight: 800 }}>{row.share}</td>
                    <td style={{ ...styles.td, ...styles.num, fontWeight: 800 }}>{row.avgSpend}</td>
                    <td style={{ ...styles.td, ...styles.num, color: TEXT }}>{row.retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <span style={styles.eyebrow}>Operations</span>
          <h2 style={styles.h2}>Operations at a glance</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {operationsKpis.map((op) => (
              <div key={op.label} className="flex flex-col gap-2 rounded-xl border border-[#C8DDE6] bg-white p-4">
                <div style={{ color: TEXT, fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{op.label}</div>
                <div style={{ color: INK, fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{op.value}</div>
                <div style={{ color: POSITIVE, fontSize: 12, fontWeight: 700 }}>↗ {op.delta}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Key Learnings */}
      <Panel>
        <span style={styles.eyebrow}>Patterns That Held</span>
        <h2 style={styles.h2}>Key learnings</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { icon: usersIcon, title: 'Retention Is Strengthening', body: 'Loyalty work compounded — repeat visit rate rose every year you funded the program.' },
            { icon: reportChartIcon, title: 'Balanced Mix Drives Growth', body: 'A healthy split across value, mid, and premium segments protected revenue from any single shock.' },
            { icon: shieldIcon, title: 'Operational Discipline Pays', body: 'Conversion up, AOV up, waste down — small gains stacked into margin expansion each year.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 rounded-xl border border-[#C8DDE6] bg-white p-4">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#E0F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <DsIcon icon={item.icon} size={20} />
              </div>
              <div>
                <div style={{ color: INK, fontSize: 14, fontWeight: 800 }}>{item.title}</div>
                <p style={{ color: TEXT, fontSize: 12, lineHeight: 1.55, marginTop: 4 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function JourneyTab() {
  return (
    <div className="flex flex-col gap-4">
      {/* Stages timeline */}
      <Panel>
        <span style={styles.eyebrow}>Five-Year Timeline</span>
        <h2 style={styles.h2}>The business journey</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 30, left: '10%', right: '10%', height: 2, background: `linear-gradient(90deg, #E0F7FF, ${TEAL})` }} />
          {[
            { stage: 'Early Stage', period: 'Year 1–2', note: 'Validated the cafe concept, launched MVP menu, won first wave of loyal customers in the neighborhood.' },
            { stage: 'Growth Stage', period: 'Year 3', note: 'Scaled operations, improved unit economics, and expanded the customer base through targeted marketing.' },
            { stage: 'Scale Stage', period: 'Year 4–5', note: 'Optimized the business, strengthened the brand, built foundation for long-term impact.' },
          ].map((s) => (
            <div key={s.stage} style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#E0F7FF', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', boxShadow: '0 1px 4px rgba(0,44,51,0.1)' }}>
                <DsIcon icon={buildingIcon} size={28} />
              </div>
              <div style={{ color: TEXT, fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.period}</div>
              <div style={{ color: TEAL, fontSize: 16, fontWeight: 800, margin: '4px 0 6px' }}>{s.stage}</div>
              <p style={{ color: TEXT, fontSize: 13, lineHeight: 1.55, maxWidth: 260, margin: '0 auto' }}>{s.note}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* What Drove Results */}
      <Panel>
        <span style={styles.eyebrow}>Levers That Mattered</span>
        <h2 style={styles.h2}>What drove your results</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: badgeIcon, title: 'Pricing', body: 'Thoughtful pricing and value alignment drove strong revenue growth without alienating value seekers.' },
            { icon: reportChartIcon, title: 'Marketing', body: 'Smart targeting and brand building fueled efficient acquisition and rising footfall.' },
            { icon: usersIcon, title: 'Retention', body: 'A great experience turned customers into loyal advocates — repeat visits became your moat.' },
            { icon: shieldIcon, title: 'Cost Control', body: 'Disciplined spending protected margins and extended runway, even as scale grew.' },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-3 rounded-xl border border-[#C8DDE6] bg-white p-4">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#E0F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DsIcon icon={item.icon} size={20} />
              </div>
              <div>
                <div style={{ color: INK, fontSize: 14, fontWeight: 800 }}>{item.title}</div>
                <p style={{ color: TEXT, fontSize: 12, lineHeight: 1.55, marginTop: 4 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Numbered Experience Summary */}
      <Panel>
        <span style={styles.eyebrow}>Four Truths</span>
        <h2 style={styles.h2}>Experience summary</h2>
        <div className="mt-4 flex flex-col">
          {[
            {
              num: 1, icon: reportChartIcon,
              title: 'Unit economics matter.',
              body: 'From the start, focusing on contribution margin and customer lifetime value gave you a clear path to sustainable profitability. Good unit economics let you scale with confidence.',
            },
            {
              num: 2, icon: usersIcon,
              title: 'Retention compounds.',
              body: 'Investing in customer experience and loyalty programs paid off over time. Lower churn, higher LTV, and strong word-of-mouth created a durable competitive advantage.',
            },
            {
              num: 3, icon: buildingIcon,
              title: 'Expansion needs discipline.',
              body: 'Scaling square footage too fast can break a business. You balanced extension with operational readiness, keeping quality high while growing capacity.',
            },
            {
              num: 4, icon: moneyIcon,
              title: 'Capital decisions shape founder value.',
              body: 'Every fundraise traded equity for fuel. Smart choices on dilution, reinvestment, and cost control maximized your valuation — and protected the slice you actually own.',
            },
          ].map((item, i) => (
            <div key={item.num} className="grid gap-4 py-4" style={{ gridTemplateColumns: '44px 44px 1fr', alignItems: 'flex-start', borderBottom: i < 3 ? `1px dashed ${BORDER}` : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E0F7FF', color: TEAL, fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.num}</div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#E0F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DsIcon icon={item.icon} size={20} />
              </div>
              <div>
                <div style={{ color: INK, fontSize: 14, fontWeight: 800 }}>{item.title}</div>
                <p style={{ color: TEXT, fontSize: 13, lineHeight: 1.6, marginTop: 4 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Final Outcome KPIs */}
      <Panel style={{ background: 'linear-gradient(to right, #F0F9FC, rgba(255,255,255,0.72))' }}>
        <span style={styles.eyebrow}>Where You Landed</span>
        <h2 style={styles.h2}>Final outcome</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div style={{ padding: 16, background: 'white', borderRadius: 12, border: `1px solid ${BORDER}` }}>
            <div style={styles.kpiLabel}>Revenue</div>
            <div style={{ ...styles.kpiValue, marginTop: 6 }}>$3,240,000</div>
            <div style={{ color: POSITIVE, fontSize: 12, fontWeight: 700, marginTop: 4 }}>↗ +48% vs Year 4</div>
          </div>
          <div style={{ padding: 16, background: 'white', borderRadius: 12, border: `1px solid ${BORDER}` }}>
            <div style={styles.kpiLabel}>Net Profit</div>
            <div style={{ ...styles.kpiValue, marginTop: 6 }}>$864,000</div>
            <div style={{ color: POSITIVE, fontSize: 12, fontWeight: 700, marginTop: 4 }}>↗ +36% vs Year 4</div>
          </div>
          <div style={{ padding: 16, background: 'white', borderRadius: 12, border: `1px solid ${BORDER}` }}>
            <div style={styles.kpiLabel}>Company Valuation</div>
            <div style={{ ...styles.kpiValue, marginTop: 6 }}>$8,450,000</div>
            <div style={{ color: POSITIVE, fontSize: 12, fontWeight: 700, marginTop: 4 }}>↗ +41% vs Year 4</div>
          </div>
          <div style={{ padding: 16, background: '#E0F7FF', borderRadius: 12, border: `1.4px solid ${CYAN}` }}>
            <div style={{ ...styles.kpiLabel, color: TEAL }}>Founder Ownership</div>
            <div style={{ ...styles.kpiValue, color: TEAL, marginTop: 6 }}>64.0%</div>
            <div style={{ color: TEXT, fontSize: 12, fontWeight: 600, marginTop: 4 }}>$5.41M founder retained</div>
          </div>
        </div>
      </Panel>

      {/* Score trajectory */}
      <Panel>
        <span style={styles.eyebrow}>Decision Journey</span>
        <h2 style={styles.h2}>What compounded across five years</h2>
        <div className="mt-5 grid gap-3">
          {journeyMilestones.map((item, index) => (
            <div key={item.title} className="grid gap-3 rounded-xl border border-[#C8DDE6] bg-white p-4 md:grid-cols-[90px_1fr_90px] md:items-center">
              <div style={{ color: TEAL, fontWeight: 800, fontSize: 15 }}>{item.title}</div>
              <div>
                <div style={{ color: INK, fontSize: 14, fontWeight: 800 }}>{item.note}</div>
                <div className="mt-2 h-2 rounded-full bg-[#F0F6FA]">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, 18 + index * 18)}%`, background: index >= 3 ? TEAL : DEEP }} />
                </div>
              </div>
              <div style={{ color: INK, fontSize: 20, fontWeight: 800, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{item.score}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────

function Kpi({ icon, label, value, detail, accent = false }: { icon: React.ReactNode; label: string; value: string; detail: string; accent?: boolean }) {
  return (
    <Panel style={{ border: accent ? `1.4px solid ${CYAN}` : '1.4px solid white', background: accent ? '#E0F7FF' : SURFACE }}>
      <div className="flex items-start gap-3">
        <div style={{ ...styles.iconShell, background: accent ? 'white' : '#E0F7FF' }}>{icon}</div>
        <div>
          <div style={{ ...styles.kpiLabel, color: accent ? TEAL : TEXT }}>{label}</div>
          <div style={{ ...styles.kpiValue, color: accent ? TEAL : INK }}>{value}</div>
          <div style={styles.kpiDetail}>{detail}</div>
        </div>
      </div>
    </Panel>
  );
}

function MiniKpi({ label, value, delta, up = true }: { label: string; value: string; delta: string; up?: boolean }) {
  return (
    <div style={{ background: SURFACE, border: '1.4px solid white', borderRadius: 16, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ color: TEXT, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ color: INK, fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{value}</div>
      <div style={{ color: up ? POSITIVE : RED, fontSize: 12, fontWeight: 700 }}>{up ? '↗' : '↘'} {delta}</div>
    </div>
  );
}

// Inline SVGR component — captures into Figma as vectors; `currentColor` recolors.
function DsIcon({ icon: Icon, size = 18 }: { icon: React.FC<React.SVGProps<SVGSVGElement>>; size?: number }) {
  return (
    <Icon
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: 'block', color: 'currentColor' }}
    />
  );
}

function Panel({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <section
      className={`rounded-2xl p-5 ${className}`}
      style={{ background: SURFACE, border: '1.4px solid white', boxShadow: 'none', ...style }}
    >
      {children}
    </section>
  );
}

function ActionButton({
  children,
  icon,
  primary = false,
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 transition-transform active:-translate-y-px"
      style={{
        border: primary ? 'none' : `1px solid ${BORDER}`,
        borderRadius: 'var(--game-cta-radius)',
        background: primary ? CTA_BG : '#FFFFFF',
        color: primary ? '#FFFFFF' : INK,
        cursor: 'pointer',
        fontFamily: FO,
        fontSize: 13,
        fontWeight: 700,
        boxShadow: primary ? 'inset 0 -1px 0 rgba(0,0,0,0.15)' : 'none',
        minHeight: 52,
        padding: primary ? '14px 24px' : '13px 22px',
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function ChartTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div style={styles.iconShell}>{icon}</div>
      <div>
        <h2 style={styles.h2}>{title}</h2>
        <p style={{ ...styles.sub, marginTop: 2 }}>{subtitle}</p>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={styles.tooltip}>
      <div style={{ color: INK, fontSize: 12, fontWeight: 800, marginBottom: 6 }}>{label}</div>
      {payload.map((item) => (
        <div key={item.name} className="flex items-center justify-between gap-5" style={{ color: TEXT, fontSize: 12 }}>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: item.color ?? TEAL }} />
            {item.name}
          </span>
          <span style={{ color: INK, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
            {Math.abs(item.value) >= 1000 ? money(item.value) : item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  eyebrow: {
    color: TEAL,
    fontFamily: FO,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.11em',
    textTransform: 'uppercase',
  },
  h1: {
    color: INK,
    fontFamily: FO,
    fontSize: 38,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    margin: '8px 0 0',
  },
  h2: {
    color: INK,
    fontFamily: FO,
    fontSize: 17,
    fontWeight: 800,
    letterSpacing: '-0.01em',
    margin: 0,
  },
  sub: {
    color: TEXT,
    fontFamily: FO,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.55,
    margin: '6px 0 0',
    maxWidth: 720,
  },
  iconShell: {
    alignItems: 'center',
    background: '#E0F7FF',
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    color: TEAL,
    display: 'flex',
    flexShrink: 0,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  kpiLabel: {
    color: TEXT,
    fontFamily: FO,
    fontSize: 12,
    fontWeight: 700,
  },
  kpiValue: {
    color: INK,
    fontFamily: FO,
    fontSize: 22,
    fontWeight: 800,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1.15,
    marginTop: 3,
  },
  kpiDetail: {
    color: TEXT,
    fontFamily: FO,
    fontSize: 12,
    fontWeight: 600,
    marginTop: 4,
  },
  metaPill: {
    background: '#FFFFFF',
    border: `1px solid ${BORDER}`,
    borderRadius: 9999,
    color: TEXT,
    fontFamily: FO,
    fontSize: 12,
    fontWeight: 700,
    padding: '7px 11px',
    width: 'fit-content',
  },
  th: {
    borderBottom: `1px solid ${BORDER}`,
    color: TEXT,
    fontFamily: FO,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '0.08em',
    padding: '10px 8px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  td: {
    borderBottom: `1px solid rgba(200,221,230,0.55)`,
    color: INK,
    fontFamily: FO,
    fontSize: 13,
    fontWeight: 700,
    padding: '11px 8px',
    verticalAlign: 'middle',
  },
  num: {
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
  },
  tooltip: {
    background: '#FFFFFF',
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    boxShadow: 'none',
    fontFamily: FO,
    minWidth: 190,
    padding: 12,
  },
};

