// Monthly Decisions Screen — the anchor screen of the prototype.
// 6 decision groups arranged as cards. Layout adapts to tweak (long-scroll / wizard / tabs).

const { useState, useMemo } = React;

// Section heading
function SectionHead({ eyebrow, title, hint, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
      <div>
        <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>{eyebrow}</div>
        <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, margin: '4px 0 0', color: '#232323', letterSpacing: '-.005em' }}>{title}</h2>
        {hint && <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#737373', margin: '4px 0 0', lineHeight: 1.4, maxWidth: 540 }}>{hint}</p>}
      </div>
      {right}
    </div>
  );
}

// Number stepper (used for buy quantities, staff counts)
function QtyStepper({ value, onChange, min = 0, max = 9999, step = 1, suffix }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', height: 36, borderRadius: 999, border: '1px solid #E6E6E6', background: '#fff', overflow: 'hidden' }}>
      <button onClick={() => onChange(Math.max(min, value - step))} style={{ width: 32, height: 36, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'Outfit', fontSize: 16, color: '#737373' }}>−</button>
      <div style={{ minWidth: 60, textAlign: 'center', fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, color: '#232323' }}>
        {value}{suffix && <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373', marginLeft: 2 }}>{suffix}</span>}
      </div>
      <button onClick={() => onChange(Math.min(max, value + step))} style={{ width: 32, height: 36, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'Outfit', fontSize: 16, color: '#737373' }}>+</button>
    </div>
  );
}

// Inventory section
function InventorySection({ dec, set }) {
  const totalUnits = Object.values(dec.buyOrders).reduce((a, b) => a + b, 0);
  const sup = SUPPLIERS.find(s => s.id === dec.supplier);
  const cogs = PRODUCTS.reduce((s, p) => s + (dec.buyOrders[p.id] || 0) * p.cost * sup.priceMult, 0);
  return (
    <Card style={{ padding: 24 }}>
      <SectionHead
        eyebrow="01 · Inventory"
        title="Buy goods for the month"
        hint="Pick a supplier tier, then set the quantity per active product. Higher tiers are cheaper per unit but carry MOQs and overstock risk."
        right={<Pill tone="cyan" size="sm">{totalUnits} units · ${Math.round(cogs).toLocaleString()}</Pill>}
      />

      {/* Supplier tier selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 18 }}>
        {SUPPLIERS.map(s => {
          const active = dec.supplier === s.id;
          const overMOQ = totalUnits >= s.moq;
          return (
            <button key={s.id} onClick={() => set({ ...dec, supplier: s.id })} style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 12, border: active ? '2px solid #00B1D6' : '1px solid #E6E6E6', background: active ? '#E6F9FF' : '#fff', cursor: 'pointer' }}>
              <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, color: '#232323' }}>{s.tier}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: '#737373', marginTop: 4, lineHeight: 1.35 }}>{s.note}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                <RiskChip tone="info">{Math.round((1 - s.priceMult) * 100)}% off list</RiskChip>
                <RiskChip tone={overMOQ ? 'info' : 'warn'}>MOQ {s.moq}</RiskChip>
                <RiskChip tone="info">+${s.distance * 6} freight</RiskChip>
              </div>
            </button>
          );
        })}
      </div>

      {/* Per-product order quantity */}
      <div style={{ borderTop: '1px dashed #E6E6E6', paddingTop: 16 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#737373', marginBottom: 10 }}>Order quantity per product</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {PRODUCTS.filter(p => p.selected).map(p => {
            const q = dec.buyOrders[p.id] || 0;
            const lineCost = q * p.cost * sup.priceMult;
            const overstockRisk = q > p.lastSold * 1.2 && p.expiryDays <= 3;
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: '#FAFAFA' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 13.5, color: '#232323' }}>{p.name}</span>
                    {overstockRisk && <RiskChip tone="warn">Overstock risk</RiskChip>}
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>Sold {p.lastSold} last month · expires in {p.expiryDays}d · ${(p.cost * sup.priceMult).toFixed(2)}/{p.unit}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 12, color: '#737373', minWidth: 56, textAlign: 'right' }}>${lineCost.toFixed(0)}</span>
                  <QtyStepper value={q} onChange={v => set({ ...dec, buyOrders: { ...dec.buyOrders, [p.id]: v } })} step={20} max={2000} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

// Pricing section
function PricingSection({ dec, set }) {
  return (
    <Card style={{ padding: 24 }}>
      <SectionHead
        eyebrow="02 · Pricing"
        title="Selling price per product"
        hint="Each product can hold its price, raise, or cut. Last month sales are shown for reference. Big swings shift segment mix."
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {PRODUCTS.filter(p => p.selected).map(p => {
          const price = dec.prices[p.id];
          const margin = ((price - p.cost) / price) * 100;
          const marginDir = margin > 60 ? 'good' : margin > 35 ? 'ok' : 'low';
          const delta = price - p.price;
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: '#FAFAFA' }}>
              <div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 13.5, color: '#232323' }}>{p.name}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>Cost ${p.cost.toFixed(2)} · margin {margin.toFixed(0)}% {marginDir === 'low' && <RiskChip tone="warn">Thin margin</RiskChip>}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'Inter', fontSize: 11, color: delta > 0 ? '#10B981' : delta < 0 ? '#F44336' : '#737373', fontWeight: 600, minWidth: 36, textAlign: 'right' }}>{delta > 0 ? `+${delta.toFixed(2)}` : delta < 0 ? delta.toFixed(2) : '—'}</span>
                <QtyStepper value={Number(price.toFixed(2))} onChange={v => set({ ...dec, prices: { ...dec.prices, [p.id]: Number(v.toFixed(2)) } })} step={0.25} min={p.cost + 0.5} max={20} suffix="$" />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Marketing section
function MarketingSection({ dec, set }) {
  const reach = Math.round(dec.marketingBudget * 1.8 + 200);
  const tooLow = dec.marketingBudget < 600;
  const tooBroad = dec.targetSegments.length > 1;
  return (
    <Card style={{ padding: 24 }}>
      <SectionHead
        eyebrow="03 · Marketing"
        title="Spend & target audience"
        hint="Budget controls reach. Picking too many segments dilutes the message — pick the one that matches this month's product."
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#515151', fontWeight: 500 }}>Marketing budget</span>
            <span style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700, color: '#004747' }}>${dec.marketingBudget.toLocaleString()}</span>
          </div>
          <input type="range" min="0" max="3000" step="100" value={dec.marketingBudget} onChange={e => set({ ...dec, marketingBudget: Number(e.target.value) })} style={{ width: '100%', accentColor: '#00B1D6' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: 10, color: '#999', marginTop: 4 }}>
            <span>$0</span><span>$1.5k</span><span>$3k</span>
          </div>
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#737373' }}>Estimated reach</span>
            <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, color: '#232323' }}>{reach.toLocaleString()}</span>
            <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>impressions · signal only</span>
          </div>
          {tooLow && <div style={{ marginTop: 10 }}><RiskChip tone="warn">Below visibility threshold — segment may not notice</RiskChip></div>}
        </div>

        <div>
          <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#515151', fontWeight: 500, marginBottom: 8 }}>Target segments {tooBroad && <RiskChip tone="warn">Too broad — message dilutes</RiskChip>}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SEGMENTS.map(s => {
              const active = dec.targetSegments.includes(s.id);
              return (
                <button key={s.id} onClick={() => {
                  const next = active ? dec.targetSegments.filter(x => x !== s.id) : [...dec.targetSegments, s.id];
                  set({ ...dec, targetSegments: next });
                }} style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 10, border: active ? '2px solid #00B1D6' : '1px solid #E6E6E6', background: active ? '#E6F9FF' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 99, background: s.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, color: '#232323' }}>{s.name} <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373', fontWeight: 400 }}>· {s.share}% share · CAC ${s.cac}</span></div>
                    <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373', marginTop: 2 }}>{s.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Staff section
function StaffSection({ dec, set }) {
  const total = STAFF_ROLES.reduce((s, r) => s + (dec.staff[r.id] || 0), 0);
  const cost = STAFF_ROLES.reduce((s, r) => s + (dec.staff[r.id] || 0) * r.costPer, 0);
  return (
    <Card style={{ padding: 24 }}>
      <SectionHead
        eyebrow="04 · Workforce"
        title="Allocate this month's staff"
        hint="Below recommended in baristas hits throughput at peak. Above adds payroll without commensurate revenue."
        right={<Pill size="sm">{total} people · ${cost.toLocaleString()}/mo</Pill>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {STAFF_ROLES.map(r => {
          const v = dec.staff[r.id] || 0;
          const understaffed = v < r.recommended;
          return (
            <div key={r.id} style={{ padding: '14px 16px', borderRadius: 12, background: '#FAFAFA' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, color: '#232323' }}>{r.name}</div>
                {understaffed && <RiskChip tone="warn">Below rec</RiskChip>}
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373', marginTop: 4, lineHeight: 1.4, minHeight: 30 }}>{r.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>Recommended <strong style={{ color: '#232323', fontWeight: 600 }}>{r.recommended}</strong></div>
                <QtyStepper value={v} onChange={x => set({ ...dec, staff: { ...dec.staff, [r.id]: x } })} max={6} />
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373', marginTop: 6 }}>${(v * r.costPer).toLocaleString()} this month</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Finance / loan section
function FinanceSection({ dec, set }) {
  const interest = dec.loanOn ? dec.loanAmount * 0.018 : 0;
  return (
    <Card style={{ padding: 24 }}>
      <SectionHead
        eyebrow="05 · Finance"
        title="Take a loan?"
        hint={`Loan capped at $${GAME.loanCap.toLocaleString()} (60% of asset value). 1.8% monthly interest. Cash hits this month, principal is repaid over the year.`}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* Toggle */}
        <button onClick={() => set({ ...dec, loanOn: !dec.loanOn })} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 999, border: '1px solid #E6E6E6', background: dec.loanOn ? '#E6F9FF' : '#fff', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 20, background: dec.loanOn ? '#00B1D6' : '#D2D2D2', borderRadius: 99, position: 'relative', transition: 'background 200ms' }}>
            <div style={{ width: 16, height: 16, borderRadius: 99, background: '#fff', position: 'absolute', top: 2, left: dec.loanOn ? 18 : 2, transition: 'left 200ms' }} />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, color: '#232323' }}>{dec.loanOn ? 'Loan ON' : 'Loan OFF'}</span>
        </button>

        <div style={{ flex: 1, opacity: dec.loanOn ? 1 : 0.4, pointerEvents: dec.loanOn ? 'auto' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#515151' }}>Amount</span>
            <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, color: '#004747' }}>${dec.loanAmount.toLocaleString()}</span>
          </div>
          <input type="range" min="0" max={GAME.loanCap} step="500" value={dec.loanAmount} onChange={e => set({ ...dec, loanAmount: Number(e.target.value) })} style={{ width: '100%', accentColor: '#00B1D6' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: 11, color: '#737373', marginTop: 6 }}>
            <span>Cash impact <strong style={{ color: '#10B981' }}>+${dec.loanAmount.toLocaleString()}</strong> this month</span>
            <span>Interest <strong style={{ color: '#F44336' }}>-${interest.toFixed(0)}/mo</strong></span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Forecast / risk summary section (read-only signals)
function ForecastSection({ dec }) {
  const i = computeImpact(dec);
  return (
    <Card style={{ padding: 24, background: '#F3F7F8' }}>
      <SectionHead eyebrow="06 · Signals" title="What the model is telling you" hint="Forecasts are signals, not predictions. Treat them as risk-radar." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Demand vs. last month</div>
          <div style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700, color: '#004747', marginTop: 4 }}>+{Math.round(i.demandSignal - 50)}%</div>
          <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>Within Balanced segment.</div>
        </div>
        <div>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Overstock probability</div>
          <div style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700, color: i.inventoryPressure > 60 ? '#F44336' : '#004747', marginTop: 4 }}>{Math.round(i.inventoryPressure * 0.6)}%</div>
          <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>Croissant + muffin most exposed.</div>
        </div>
        <div>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Cash shortfall risk</div>
          <div style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700, color: i.cashAfter < 8000 ? '#F44336' : '#004747', marginTop: 4 }}>{i.cashAfter < 8000 ? 'High' : i.cashAfter < 14000 ? 'Med' : 'Low'}</div>
          <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>Based on cash after spend.</div>
        </div>
      </div>
    </Card>
  );
}

window.DecisionSections = { InventorySection, PricingSection, MarketingSection, StaffSection, FinanceSection, ForecastSection };
