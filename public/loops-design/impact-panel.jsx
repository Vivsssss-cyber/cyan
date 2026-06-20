// Live Impact Panel — shows the running consequences of the player's decisions
// for the current month. Renders in 1 of 3 positions (sidebar / top / dock).

const fmt = n => n >= 0 ? `$${Math.round(n).toLocaleString()}` : `-$${Math.round(-n).toLocaleString()}`;

function computeImpact(dec) {
  // Spend from buy orders (using selected supplier mult)
  const sup = SUPPLIERS.find(s => s.id === dec.supplier);
  const cogs = PRODUCTS.reduce((s, p) => s + (dec.buyOrders[p.id] || 0) * p.cost * sup.priceMult, 0);
  const distanceCost = sup.distance * 6;
  const salary = STAFF_ROLES.reduce((s, r) => s + (dec.staff[r.id] || 0) * r.costPer, 0);
  const rent = 2200;
  const marketing = dec.marketingBudget;
  const interest = dec.loanOn ? dec.loanAmount * 0.018 : 0;
  const totalSpend = cogs + distanceCost + salary + rent + marketing + interest + 530;
  const cashAfter = GAME.startCash - totalSpend + (dec.loanOn ? dec.loanAmount : 0);
  // Forecast revenue — simple model around marketing reach × segments × prices
  const reachFactor = 0.6 + (dec.marketingBudget / 2000) * 0.8;
  const forecast = PRODUCTS.filter(p => p.selected).reduce((s, p) => {
    const baseDemand = p.lastSold * reachFactor;
    return s + baseDemand * dec.prices[p.id];
  }, 0);
  // Pressure
  const totalUnits = Object.values(dec.buyOrders).reduce((a, b) => a + b, 0);
  const inventoryPressure = Math.min(100, (totalUnits / 1400) * 100);
  const staffNeeded = STAFF_ROLES.reduce((s, r) => s + r.recommended, 0);
  const staffActual = STAFF_ROLES.reduce((s, r) => s + (dec.staff[r.id] || 0), 0);
  const staffPressure = Math.max(0, Math.min(100, ((staffNeeded - staffActual) / staffNeeded) * 100 + 35));
  const demandSignal = Math.min(100, reachFactor * 55);
  return { cogs, salary, rent, marketing, totalSpend, cashAfter, forecast, inventoryPressure, staffPressure, demandSignal, sup };
}

function ImpactPanelContent({ dec, compact }) {
  const i = computeImpact(dec);
  const cashDelta = i.cashAfter - GAME.startCash;
  const cashStatus = i.cashAfter < 8000 ? 'danger' : i.cashAfter < 14000 ? 'warn' : 'ok';
  const invStatus = i.inventoryPressure > 75 ? 'danger' : i.inventoryPressure > 55 ? 'warn' : 'ok';
  const staffStatus = i.staffPressure > 60 ? 'danger' : i.staffPressure > 30 ? 'warn' : 'ok';
  const demandStatus = i.demandSignal < 30 ? 'warn' : 'ok';
  return (
    <div style={{ display: 'flex', flexDirection: compact ? 'row' : 'column', gap: compact ? 18 : 18, alignItems: compact ? 'center' : 'stretch' }}>
      {!compact && (
        <div>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Live impact</div>
          <div style={{ fontFamily: 'Outfit', fontSize: 14, color: '#515151', marginTop: 2, lineHeight: 1.4 }}>Updates as you change decisions.</div>
        </div>
      )}
      {/* Cash after */}
      <div style={{ flex: compact ? '0 0 auto' : 'unset', minWidth: compact ? 160 : 'auto' }}>
        <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Cash after decisions</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
          <div style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 700, color: cashStatus === 'danger' ? '#F44336' : '#004747', lineHeight: 1 }}>{fmt(i.cashAfter)}</div>
          <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: cashDelta >= 0 ? '#10B981' : '#F44336' }}>{cashDelta >= 0 ? '↑' : '↓'} {fmt(Math.abs(cashDelta))}</span>
        </div>
        {cashStatus !== 'ok' && <div style={{ marginTop: 6 }}><RiskChip tone={cashStatus === 'danger' ? 'danger' : 'warn'}>{cashStatus === 'danger' ? `Below safe runway` : `Tight — watch this`}</RiskChip></div>}
      </div>
      {/* Forecast revenue */}
      {!compact && (
        <div>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Forecast revenue</div>
          <div style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700, color: '#004747', marginTop: 2, lineHeight: 1 }}>{fmt(i.forecast)}</div>
          <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373', marginTop: 4 }}>Signal only — not a guarantee.</div>
        </div>
      )}
      {/* Pressures */}
      <div style={{ display: 'flex', flexDirection: compact ? 'row' : 'column', gap: 12, flex: compact ? '1 1 auto' : 'unset' }}>
        <PressureBar value={i.demandSignal} label="Demand signal" status={demandStatus} w={compact ? 120 : 180} />
        <PressureBar value={i.inventoryPressure} label="Inventory pressure" status={invStatus} w={compact ? 120 : 180} />
        <PressureBar value={i.staffPressure} label="Staff pressure" status={staffStatus} w={compact ? 120 : 180} />
      </div>
      {/* Risk indicators */}
      {!compact && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 12, borderTop: '1px dashed #E6E6E6' }}>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Risks to watch</div>
          {invStatus !== 'ok' && <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><RiskChip tone={invStatus === 'danger' ? 'danger' : 'warn'}>Overstock</RiskChip><span style={{ fontFamily: 'Inter', fontSize: 11.5, color: '#515151', lineHeight: 1.4 }}>Buying volumes likely outpace 28-day expiries on perishables.</span></div>}
          {staffStatus !== 'ok' && <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><RiskChip tone={staffStatus === 'danger' ? 'danger' : 'warn'}>Understaffed</RiskChip><span style={{ fontFamily: 'Inter', fontSize: 11.5, color: '#515151', lineHeight: 1.4 }}>Below recommended baristas for peak rush. Throughput risk.</span></div>}
          {cashStatus !== 'ok' && <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><RiskChip tone={cashStatus === 'danger' ? 'danger' : 'warn'}>Low runway</RiskChip><span style={{ fontFamily: 'Inter', fontSize: 11.5, color: '#515151', lineHeight: 1.4 }}>Cash after this month falls below the 1-month buffer.</span></div>}
          {demandStatus !== 'ok' && <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><RiskChip tone="warn">Soft demand</RiskChip><span style={{ fontFamily: 'Inter', fontSize: 11.5, color: '#515151', lineHeight: 1.4 }}>Marketing reach is below baseline — segment may not hear you.</span></div>}
          {invStatus === 'ok' && staffStatus === 'ok' && cashStatus === 'ok' && demandStatus === 'ok' && (
            <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: '#515151', lineHeight: 1.4 }}>No risks flagged. Submit when ready.</div>
          )}
        </div>
      )}
    </div>
  );
}

window.ImpactPanelContent = ImpactPanelContent;
window.computeImpact = computeImpact;
