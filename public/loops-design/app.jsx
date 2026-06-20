// Three-screen prototype: Decisions → Review → Results
const { useState: useS, useMemo: useM, useEffect: useE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layout": "scroll",
  "panel": "sidebar"
}/*EDITMODE-END*/;

const STEPS_M = [
  { id: 'decide',  label: 'Decisions' },
  { id: 'review',  label: 'Review' },
  { id: 'results', label: 'Results' },
];
const STEPS_Q = [
  { id: 'plan',     label: 'Quarterly Plan' },
  { id: 'pivot',    label: 'Mid-Quarter Pivot' },
  { id: 'qresults', label: 'Quarter Results' },
];
const STEPS_A = [
  { id: 'review',    label: 'Strategic Review' },
  { id: 'funding',   label: 'Funding & Dilution' },
  { id: 'valuation', label: 'Valuation' },
];
const LAYERS = [
  { id: 'monthly',   label: 'Monthly',   sub: 'Tactical', steps: STEPS_M },
  { id: 'quarterly', label: 'Quarterly', sub: 'Strategic', steps: STEPS_Q },
  { id: 'annual',    label: 'Annual',    sub: 'Capital', steps: STEPS_A },
];
const STEPS = STEPS_M;

// Top stepper nav
function Stepper({ value, onChange, steps = STEPS }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: 4, background: '#F2F2F2', borderRadius: 999 }}>
      {steps.map((s, i) => {
        const active = value === s.id;
        return (
          <button key={s.id} onClick={() => onChange(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: active ? '#fff' : 'transparent', boxShadow: active ? '0 1px 2px rgba(13,35,39,.08)' : 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ width: 22, height: 22, borderRadius: 99, background: active ? '#004747' : '#D2D2D2', color: '#fff', fontFamily: 'Outfit', fontWeight: 700, fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
            <span style={{ fontFamily: 'Outfit', fontWeight: active ? 600 : 500, fontSize: 13, color: active ? '#004747' : '#737373', whiteSpace: 'nowrap' }}>{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ====================== DECISIONS SCREEN ======================
function DecisionsScreen({ dec, setDec, layout, panel, goNext }) {
  const [activeTab, setActiveTab] = useS('Inventory');
  const [wizardStep, setWizardStep] = useS(0);
  const { InventorySection, PricingSection, MarketingSection, StaffSection, FinanceSection, ForecastSection } = window.DecisionSections;

  const sections = [
    { id: 'Inventory', el: <InventorySection dec={dec} set={setDec} /> },
    { id: 'Pricing',   el: <PricingSection dec={dec} set={setDec} /> },
    { id: 'Marketing', el: <MarketingSection dec={dec} set={setDec} /> },
    { id: 'Staff',     el: <StaffSection dec={dec} set={setDec} /> },
    { id: 'Finance',   el: <FinanceSection dec={dec} set={setDec} /> },
    { id: 'Signals',   el: <ForecastSection dec={dec} /> },
  ];

  let body;
  if (layout === 'wizard') {
    const cur = sections[wizardStep];
    body = (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {sections.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setWizardStep(i)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 999, border: 'none', background: i === wizardStep ? '#004747' : i < wizardStep ? '#E6F9FF' : '#F2F2F2', color: i === wizardStep ? '#fff' : i < wizardStep ? '#004747' : '#737373', fontFamily: 'Outfit', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                <span style={{ width: 18, height: 18, borderRadius: 99, background: i === wizardStep ? '#fff' : i < wizardStep ? '#004747' : '#D2D2D2', color: i === wizardStep ? '#004747' : '#fff', fontSize: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                {s.id}
              </button>
              {i < sections.length - 1 && <span style={{ color: '#D2D2D2' }}>→</span>}
            </div>
          ))}
        </div>
        {cur.el}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <Button variant="secondary" onClick={() => setWizardStep(Math.max(0, wizardStep - 1))} disabled={wizardStep === 0}>← Back</Button>
          {wizardStep < sections.length - 1
            ? <Button variant="dark" icon="→" onClick={() => setWizardStep(wizardStep + 1)}>Next: {sections[wizardStep + 1].id}</Button>
            : <Button variant="primary" icon="→" onClick={goNext}>Review decisions</Button>}
        </div>
      </div>
    );
  } else if (layout === 'tabs') {
    const tabs = sections.map(s => s.id);
    body = (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Tabs items={tabs} value={activeTab} onChange={setActiveTab} />
        </div>
        {sections.find(s => s.id === activeTab).el}
      </div>
    );
  } else {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sections.map(s => <div key={s.id}>{s.el}</div>)}
      </div>
    );
  }

  const ImpactSidebar = (
    <div style={{ position: 'sticky', top: 96, alignSelf: 'flex-start' }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: 22, boxShadow: 'var(--shadow-2)', border: '1px solid #E6E6E6' }}>
        <ImpactPanelContent dec={dec} compact={false} />
      </div>
      <div style={{ marginTop: 12, fontFamily: 'Nanum Pen Script', fontSize: 18, color: '#027474', textAlign: 'center', lineHeight: 1.2 }}>
        the model teaches — it does not decide for you
      </div>
    </div>
  );

  const ImpactTopBar = (
    <div style={{ position: 'sticky', top: 64, zIndex: 5, background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E6E6E6', padding: '12px 32px', marginBottom: 16 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <ImpactPanelContent dec={dec} compact={true} />
      </div>
    </div>
  );

  const [dockOpen, setDockOpen] = useS(false);
  const ImpactDock = (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20, pointerEvents: 'none' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 16px', display: 'flex', justifyContent: 'flex-end' }}>
        <div onMouseEnter={() => setDockOpen(true)} onMouseLeave={() => setDockOpen(false)} style={{ pointerEvents: 'auto', background: '#fff', borderRadius: 14, boxShadow: 'var(--shadow-3)', padding: dockOpen ? 22 : '14px 20px', border: '1px solid #E6E6E6', minWidth: dockOpen ? 480 : 340, maxWidth: 720, transition: 'min-width 200ms, padding 200ms' }}>
          {dockOpen
            ? <ImpactPanelContent dec={dec} compact={false} />
            : <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Live impact ↑</div>
                <ImpactPanelContent dec={dec} compact={true} />
              </div>}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {panel === 'top' && ImpactTopBar}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: panel === 'top' ? '0 32px 120px' : '24px 32px 120px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: 'Nanum Pen Script', fontSize: 26, color: '#027474', lineHeight: 1 }}>your call, founder</div>
            <h1 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 38, letterSpacing: '-.015em', margin: '4px 0 0', color: '#232323' }}>Plan {GAME.monthLabel}</h1>
            <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#737373', margin: '4px 0 0', maxWidth: 560 }}>Set inventory, pricing, marketing, staff, and finance for the coming month. Decisions lock when you submit. Risks update live as you change inputs.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Pill dot="#F59E0B">Cash ${GAME.startCash.toLocaleString()}</Pill>
            <Pill dot="#F44336">Runway {GAME.runwayMonths}mo</Pill>
            <Button variant="secondary" onClick={() => setDec(DEFAULT_DECISIONS)}>Reset draft</Button>
            <Button variant="dark" icon="→" onClick={goNext}>Review</Button>
          </div>
        </div>

        {panel === 'sidebar' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'flex-start' }}>
            <div>{body}</div>
            {ImpactSidebar}
          </div>
        ) : (
          <div>{body}</div>
        )}
      </div>
      {panel === 'dock' && ImpactDock}
    </>
  );
}

// ====================== REVIEW SCREEN ======================
function ReviewScreen({ dec, goBack, goNext }) {
  const i = computeImpact(dec);
  const sup = SUPPLIERS.find(s => s.id === dec.supplier);
  const totalUnits = Object.values(dec.buyOrders).reduce((a, b) => a + b, 0);
  const segs = dec.targetSegments.map(id => SEGMENTS.find(s => s.id === id).name).join(', ') || 'None';

  const Row = ({ label, value, hint, status }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: 16, padding: '14px 0', borderTop: '1px solid #F2F2F2', alignItems: 'center' }}>
      <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#737373' }}>{label}</div>
      <div>
        <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, color: '#232323' }}>{value}</div>
        {hint && <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#737373', marginTop: 2 }}>{hint}</div>}
      </div>
      <div>{status}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 32px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: 'Nanum Pen Script', fontSize: 26, color: '#027474', lineHeight: 1 }}>last look</div>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 38, letterSpacing: '-.015em', margin: '4px 0 0', color: '#232323' }}>Confirm your plan for {GAME.monthLabel}</h1>
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#737373', margin: '4px 0 0', maxWidth: 560 }}>Once submitted, decisions lock for the month and the simulation runs.</p>
        </div>
        <Button variant="ghost" onClick={goBack}>← Edit decisions</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'flex-start' }}>
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Decisions summary</div>
          <Row label="Supplier" value={sup.tier} hint={`${totalUnits} total units · ${sup.leadDays}d lead time`} status={<RiskChip tone="info">{Math.round((1 - sup.priceMult) * 100)}% off list</RiskChip>} />
          <Row label="Inventory spend" value={`$${Math.round(i.cogs).toLocaleString()}`} hint="Goods only — freight billed separately" />
          <Row label="Pricing" value={
            PRODUCTS.filter(p => p.selected).map(p => `${p.name} $${dec.prices[p.id].toFixed(2)}`).join(' · ')
          } />
          <Row label="Marketing" value={`$${dec.marketingBudget.toLocaleString()}`} hint={`Targeting: ${segs}`} status={dec.marketingBudget < 600 ? <RiskChip tone="warn">Below threshold</RiskChip> : null} />
          <Row label="Staff" value={`${Object.values(dec.staff).reduce((a,b)=>a+b,0)} people · $${i.salary.toLocaleString()}/mo`} hint={STAFF_ROLES.map(r => `${r.name} ${dec.staff[r.id]}`).join(' · ')} />
          <Row label="Finance" value={dec.loanOn ? `Loan $${dec.loanAmount.toLocaleString()}` : 'No loan'} hint={dec.loanOn ? `+$${dec.loanAmount.toLocaleString()} this month, -$${(dec.loanAmount * 0.018).toFixed(0)}/mo interest` : 'Operating from cash on hand'} />
          <Row label="Forecast revenue" value={`$${Math.round(i.forecast).toLocaleString()}`} hint="Signal only — depends on demand realisation" />
          <Row label="Cash after month" value={`$${Math.round(i.cashAfter).toLocaleString()}`} status={i.cashAfter < 8000 ? <RiskChip tone="danger">Low runway</RiskChip> : i.cashAfter < 14000 ? <RiskChip tone="warn">Tight</RiskChip> : <RiskChip tone="info">Healthy</RiskChip>} />
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 96 }}>
          <Card style={{ padding: 20 }}>
            <ImpactPanelContent dec={dec} compact={false} />
          </Card>
          <Card style={{ padding: 20, background: '#FFF8E1' }}>
            <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8B6A00' }}>Heads up</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, color: '#232323', marginTop: 6, lineHeight: 1.4 }}>Submitting locks the plan. The simulator will compute actuals and you'll see results next.</div>
          </Card>
          <Button variant="primary" icon="→" size="lg" onClick={goNext}>Submit & run month</Button>
        </div>
      </div>
    </div>
  );
}

// ====================== RESULTS SCREEN ======================
function ResultsScreen({ goBack }) {
  const r = RESULTS;
  const totalCost = r.cogs + r.rent + r.marketing + r.salary + r.wastage + r.maintenance + r.depreciation + r.misc;
  const profit = r.revenue - totalCost;
  const beat = r.revenue - r.forecastRev;

  const histRev = [...HISTORY.revenue]; histRev[4] = r.revenue;
  const histFoot = [...HISTORY.footfall]; histFoot[4] = r.footfall;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: 'Nanum Pen Script', fontSize: 26, color: '#027474', lineHeight: 1 }}>here's what happened</div>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 38, letterSpacing: '-.015em', margin: '4px 0 0', color: '#232323' }}>{GAME.monthLabel} results</h1>
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#737373', margin: '4px 0 0', maxWidth: 620 }}>Actuals tie back to your decisions. Hover any KPI to read which lever drove it.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="ghost" onClick={goBack}>← Back to review</Button>
          <Button variant="dark" icon="→">Plan Month 5</Button>
        </div>
      </div>

      {/* Headline KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <KPI label="Revenue" value={`$${r.revenue.toLocaleString()}`} delta={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Delta value={Math.round(((r.revenue - r.forecastRev) / r.forecastRev) * 100)} /><span style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>vs. forecast</span></span>} />
        <KPI label="Net profit" value={`$${profit.toLocaleString()}`} delta={<Delta value={Math.round((profit / r.revenue) * 100)} unit="% margin" />} />
        <KPI label="Cash balance" value={`$${r.cashEnd.toLocaleString()}`} delta={<Delta value={Math.round((r.cashEnd - r.cashStart))} unit="" dir={r.cashEnd >= r.cashStart} />} />
        <KPI label="Footfall" value={r.footfall.toLocaleString()} delta={<Delta value={Math.round(((r.footfall - HISTORY.footfall[3]) / HISTORY.footfall[3]) * 100)} />} />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Revenue vs. cost</div>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 18, margin: '4px 0 12px' }}>You beat forecast by ${beat.toLocaleString()}</h3>
          <ChartRevenueCost revenue={r.revenue} cost={totalCost} w={520} h={220} />
        </Card>
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Footfall trend</div>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 18, margin: '4px 0 12px' }}>1,372 visits — highest month yet</h3>
          <ChartFootfall points={histFoot} w={460} h={200} />
        </Card>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card style={{ padding: 24 }}>
          <ChartProductStack items={r.byProduct} w={500} h={170} />
        </Card>
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373', marginBottom: 6 }}>Sold vs. unsold</div>
          <ChartSoldUnsold items={r.byProduct} w={500} h={220} />
        </Card>
      </div>

      {/* Waterfall */}
      <Card style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Cash waterfall</div>
        <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 18, margin: '4px 0 16px' }}>Where the cash went, opening to closing</h3>
        <ChartWaterfall steps={r.waterfall} w={1180} h={240} />
      </Card>

      {/* Decision-to-outcome ledger */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>What worked</div>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 18, margin: '4px 0 14px' }}>Your decisions, mapped to outcomes</h3>
          {[
            { dec: 'Held espresso & cappuccino prices', out: 'Volume on cappuccino +9% — Balanced segment held.', tone: 'good' },
            { dec: 'Booked Tier 2 supplier', out: 'COGS down 14% vs. local roaster baseline.', tone: 'good' },
            { dec: '$1,200 marketing on Balanced', out: '+132 new visits attributed to campaign.', tone: 'good' },
          ].map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: i ? '1px solid #F2F2F2' : 'none' }}>
              <span style={{ width: 22, height: 22, borderRadius: 99, background: '#E8F5E9', color: '#1B5E20', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>✓</span>
              <div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 13.5, color: '#232323' }}>{it.dec}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#737373', marginTop: 2 }}>→ {it.out}</div>
              </div>
            </div>
          ))}
        </Card>
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>What to learn</div>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 18, margin: '4px 0 14px' }}>Friction points to address next month</h3>
          {[
            { dec: 'Croissant order: 220 units, sold 268', out: 'Underbought — likely missed 30+ sales. Increase order in M5.', tone: 'warn' },
            { dec: 'Muffin order: 120 units, 26 unsold', out: 'Overbought relative to demand — cut to 100 or shorten expiry exposure.', tone: 'warn' },
            { dec: 'Below-recommended baristas (2 vs. 3)', out: 'Peak-hour wait times averaged 4.2min — throughput cap hit.', tone: 'danger' },
          ].map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: i ? '1px solid #F2F2F2' : 'none' }}>
              <span style={{ width: 22, height: 22, borderRadius: 99, background: it.tone === 'danger' ? '#FEE2E2' : '#FFF8E1', color: it.tone === 'danger' ? '#820606' : '#8B6A00', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>!</span>
              <div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 13.5, color: '#232323' }}>{it.dec}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#737373', marginTop: 2 }}>→ {it.out}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// Layer switcher (Monthly / Quarterly / Annual)
function LayerSwitcher({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: 4, background: '#002C33', borderRadius: 999 }}>
      {LAYERS.map(l => {
        const active = value === l.id;
        return (
          <button key={l.id} onClick={() => onChange(l.id)} style={{ padding: '8px 16px', borderRadius: 999, background: active ? 'linear-gradient(180deg,#00B1D6,#0090AD)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0, lineHeight: 1.1 }}>
            <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, color: active ? '#fff' : '#7FE2F7' }}>{l.label}</span>
            <span style={{ fontFamily: 'Inter', fontSize: 9, color: active ? 'rgba(255,255,255,.8)' : 'rgba(127,226,247,.6)', letterSpacing: '.05em', textTransform: 'uppercase' }}>{l.sub}</span>
          </button>
        );
      })}
    </div>
  );
}

// ====================== ROOT APP ======================
function App() {
  const [layer, setLayer] = useS('monthly');
  const [stepM, setStepM] = useS('decide');
  const [stepQ, setStepQ] = useS('plan');
  const [stepA, setStepA] = useS('review');
  const [dec, setDec] = useS(DEFAULT_DECISIONS);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const { QuarterlyPlanScreen, PivotScreen, QuarterResultsScreen } = window.QuarterlyScreens;
  const { StrategicReviewScreen, FundingScreen, ValuationScreen } = window.AnnualScreens;

  const layerCfg = LAYERS.find(l => l.id === layer);
  const step = layer === 'monthly' ? stepM : layer === 'quarterly' ? stepQ : stepA;
  const setStep = layer === 'monthly' ? setStepM : layer === 'quarterly' ? setStepQ : setStepA;

  const navRound = layer === 'monthly' ? GAME.monthLabel : layer === 'quarterly' ? QUARTER.label : ANNUAL.label;

  const right = (
    <>
      <Stepper value={step} onChange={setStep} steps={layerCfg.steps} />
      <SVNavCluster team={GAME.team} role={GAME.role} round={navRound} avatar="JK" />
    </>
  );

  return (
    <AppShell title="Startup Valley" right={right}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 32px 0' }}>
        <LayerSwitcher value={layer} onChange={setLayer} />
      </div>

      <div data-screen-label={`SV-${layerCfg.label} · ${layerCfg.steps.find(s => s.id === step).label}`}>
        {layer === 'monthly' && step === 'decide'  && <DecisionsScreen dec={dec} setDec={setDec} layout={tweaks.layout} panel={tweaks.panel} goNext={() => setStepM('review')} />}
        {layer === 'monthly' && step === 'review'  && <ReviewScreen dec={dec} goBack={() => setStepM('decide')} goNext={() => setStepM('results')} />}
        {layer === 'monthly' && step === 'results' && <ResultsScreen goBack={() => setStepM('review')} />}

        {layer === 'quarterly' && step === 'plan'     && <QuarterlyPlanScreen goNext={() => setStepQ('pivot')} />}
        {layer === 'quarterly' && step === 'pivot'    && <PivotScreen goBack={() => setStepQ('plan')} goNext={() => setStepQ('qresults')} />}
        {layer === 'quarterly' && step === 'qresults' && <QuarterResultsScreen goBack={() => setStepQ('pivot')} />}

        {layer === 'annual' && step === 'review'    && <StrategicReviewScreen goNext={() => setStepA('funding')} />}
        {layer === 'annual' && step === 'funding'   && <FundingScreen goBack={() => setStepA('review')} goNext={() => setStepA('valuation')} />}
        {layer === 'annual' && step === 'valuation' && <ValuationScreen goBack={() => setStepA('funding')} />}
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Decision screen layout" subtitle="How the 6 sections are arranged on the Decisions screen.">
          <TweakRadio value={tweaks.layout} onChange={v => setTweak('layout', v)} options={[
            { value: 'scroll', label: 'Long scroll' },
            { value: 'wizard', label: 'Wizard' },
            { value: 'tabs',   label: 'Tabs' },
          ]} />
        </TweakSection>
        <TweakSection title="Live impact panel" subtitle="Where the running consequences of decisions live.">
          <TweakRadio value={tweaks.panel} onChange={v => setTweak('panel', v)} options={[
            { value: 'sidebar', label: 'Sidebar' },
            { value: 'top',     label: 'Top bar' },
            { value: 'dock',    label: 'Dock' },
          ]} />
        </TweakSection>
      </TweaksPanel>
    </AppShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
