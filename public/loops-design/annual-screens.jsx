// Annual Loop screens — Strategic Review → Funding & Dilution → Valuation
const { useState: uSA } = React;

function AHeader({ eyebrow, title, hint, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
      <div>
        <div style={{ fontFamily: 'Nanum Pen Script', fontSize: 26, color: '#027474', lineHeight: 1 }}>{eyebrow}</div>
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 38, letterSpacing: '-.015em', margin: '4px 0 0', color: '#232323' }}>{title}</h1>
        {hint && <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#737373', margin: '4px 0 0', maxWidth: 620 }}>{hint}</p>}
      </div>
      {right}
    </div>
  );
}

// ===== Strategic Review =====
function StrategicReviewScreen({ goNext }) {
  const [pick, setPick] = uSA('expand');
  const t = ANNUAL.yearTotals;
  const opt = ANNUAL.year2Options.find(o => o.id === pick);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px 80px' }}>
      <AHeader
        eyebrow="zoom out"
        title={`${ANNUAL.label} · strategic review`}
        hint="A full year is in. Pick the path for Year 2 — each shapes valuation, capital needs, and dilution downstream."
        right={<Button variant="dark" icon="→" onClick={goNext}>Continue to funding</Button>}
      />

      {/* Year totals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 16 }}>
        <KPI label="Revenue" value={`$${(t.revenue/1000).toFixed(0)}k`} delta={<Delta value={62} />} />
        <KPI label="Net profit" value={`$${(t.netProfit/1000).toFixed(1)}k`} delta={<Delta value={t.margin} unit="% margin" dir={true} />} />
        <KPI label="Cash" value={`$${(t.cashEnd/1000).toFixed(1)}k`} delta={<span style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>+$6.2k YoY</span>} />
        <KPI label="Customers" value={t.customers.toLocaleString()} delta={<Delta value={140} />} />
        <KPI label="NPS" value={t.nps} delta={<Delta value={12} dir={true} />} />
      </div>

      {/* Quarterly rhythm */}
      <Card style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Quarterly rhythm</div>
        <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 18, margin: '4px 0 14px' }}>4 quarters, 4 chapters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {ANNUAL.quarters.map((q, i) => {
            const max = Math.max(...ANNUAL.quarters.map(x => x.revenue));
            const h = (q.revenue / max) * 110;
            return (
              <div key={i} style={{ padding: '14px 16px', borderRadius: 12, background: i === 3 ? '#E6F9FF' : '#FAFAFA' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: '#232323' }}>{q.q}</span>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18, color: '#004747' }}>${(q.revenue/1000).toFixed(1)}k</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#F2F2F2', borderRadius: 99, marginBottom: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${(q.revenue/max)*100}%`, height: '100%', background: i === 3 ? '#00B1D6' : '#737373' }} />
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373', lineHeight: 1.4, minHeight: 30 }}>{q.highlight}</div>
                <div style={{ marginTop: 8 }}><RiskChip tone="info">{q.margin}% margin</RiskChip></div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Year 2 path */}
      <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373', marginBottom: 8 }}>Pick Year 2 path</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {ANNUAL.year2Options.map(o => {
          const active = pick === o.id;
          return (
            <button key={o.id} onClick={() => setPick(o.id)} style={{ textAlign: 'left', padding: 22, borderRadius: 14, border: active ? '2px solid #00B1D6' : '1px solid #E6E6E6', background: active ? '#E6F9FF' : '#fff', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <RiskChip tone="info">{o.tag}</RiskChip>
                <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: '#737373' }}>${(o.capex/1000).toFixed(0)}k capex</span>
              </div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18, color: '#232323', marginTop: 12 }}>{o.name}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 13, color: '#737373', marginTop: 6, lineHeight: 1.5, minHeight: 60 }}>{o.desc}</div>
              <div style={{ display: 'flex', gap: 14, marginTop: 14, padding: '10px 0', borderTop: '1px solid #F2F2F2' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 10, color: '#737373', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600 }}>Y2 Rev</div>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, color: '#004747' }}>${(o.yearRev/1000).toFixed(0)}k</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 10, color: '#737373', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600 }}>Y2 Profit</div>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, color: '#004747' }}>${(o.yearProfit/1000).toFixed(0)}k</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 10, color: '#737373', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600 }}>You keep</div>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, color: o.ownership === 100 ? '#10B981' : '#232323' }}>{o.ownership}%</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pros/cons of pick */}
      <Card style={{ padding: 24 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Trade-offs · {opt.name}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 12 }}>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, color: '#1B5E20', marginBottom: 8 }}>What you gain</div>
            {opt.pros.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '6px 0' }}>
                <span style={{ color: '#10B981' }}>✓</span>
                <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#515151' }}>{p}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, color: '#820606', marginBottom: 8 }}>What you risk</div>
            {opt.cons.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '6px 0' }}>
                <span style={{ color: '#F44336' }}>!</span>
                <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#515151' }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ===== Funding & Dilution =====
function FundingScreen({ goBack, goNext }) {
  const [pick, setPick] = uSA('seed');
  const offer = ANNUAL.offers.find(o => o.id === pick);
  const founderShare = 100 - offer.equity;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px 80px' }}>
      <AHeader
        eyebrow="capital decision"
        title="Funding & dilution"
        hint="Capital fuels the path you picked — but every dollar costs ownership. Read the trade carefully."
        right={<div style={{ display: 'flex', gap: 12 }}><Button variant="ghost" onClick={goBack}>← Back</Button><Button variant="dark" icon="→" onClick={goNext}>See valuation</Button></div>}
      />

      {/* Offer cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {ANNUAL.offers.map(o => {
          const active = pick === o.id;
          return (
            <button key={o.id} onClick={() => setPick(o.id)} style={{ textAlign: 'left', padding: 18, borderRadius: 14, border: active ? '2px solid #00B1D6' : '1px solid #E6E6E6', background: active ? '#E6F9FF' : '#fff', cursor: 'pointer' }}>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, color: '#232323' }}>{o.name}</div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 26, color: '#004747', marginTop: 8 }}>${o.amount.toLocaleString()}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                <RiskChip tone={o.equity > 20 ? 'warn' : 'info'}>{o.equity}% equity</RiskChip>
                {o.valuation && <RiskChip tone="info">${(o.valuation/1000).toFixed(0)}k post</RiskChip>}
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: '#737373', marginTop: 10, lineHeight: 1.4, minHeight: 32 }}>{o.terms}</div>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        {/* Cap table visualization */}
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Cap table after {offer.name}</div>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 18, margin: '4px 0 18px' }}>Who owns what going into Year 2</h3>

          {/* Big stacked bar */}
          <div style={{ display: 'flex', height: 56, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,.06)' }}>
            <div style={{ flex: founderShare, background: '#004747', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14 }}>
              {founderShare > 15 && `Founder · ${founderShare}%`}
            </div>
            {offer.equity > 0 && (
              <div style={{ flex: offer.equity, background: '#00B1D6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14 }}>
                {offer.equity > 8 && `Investor · ${offer.equity}%`}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 24, marginTop: 18 }}>
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Founder ownership</div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 28, color: '#232323', marginTop: 4 }}>{founderShare}%</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: founderShare < 75 ? '#F59E0B' : '#737373', marginTop: 2 }}>{founderShare === 100 ? 'Full control retained' : founderShare < 75 ? 'Significant dilution' : 'Modest dilution'}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Cash injected</div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 28, color: '#004747', marginTop: 4 }}>${(offer.amount/1000).toFixed(0)}k</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373', marginTop: 2 }}>Available within 30 days of close</div>
            </div>
            {offer.valuation && (
              <div>
                <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Post-money valuation</div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 28, color: '#232323', marginTop: 4 }}>${(offer.valuation/1000).toFixed(0)}k</div>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373', marginTop: 2 }}>Anchors next round</div>
              </div>
            )}
          </div>
        </Card>

        <Card style={{ padding: 24, background: '#FFF8E1' }}>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8B6A00' }}>Watch out</div>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 18, margin: '4px 0 12px', color: '#232323' }}>Dilution compounds</h3>
          <div style={{ fontFamily: 'Inter', fontSize: 13, color: '#515151', lineHeight: 1.55 }}>
            Each round you raise reduces your share of every future dollar of profit. A {offer.equity}% give-up today, paired with a typical Series A of 20% next year, leaves you at <strong>~{Math.round(founderShare * 0.8)}%</strong>.
          </div>
          <div style={{ marginTop: 14, padding: 12, background: '#fff', borderRadius: 10 }}>
            <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, color: '#232323' }}>Rule of thumb</div>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#737373', marginTop: 4, lineHeight: 1.5 }}>Raise the smallest amount that lets you hit the next milestone — not the largest amount you're offered.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ===== Annual Valuation =====
function ValuationScreen({ goBack }) {
  // Compute weighted valuation index
  const score = ANNUAL.drivers.reduce((s, d) => s + d.value * d.weight, 0) / ANNUAL.drivers.reduce((s, d) => s + d.weight, 0);
  const valuation = Math.round(ANNUAL.baseValuation * (0.6 + score * 0.08));

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px 80px' }}>
      <AHeader
        eyebrow="what you've built"
        title="Year 1 valuation"
        hint="The model values the business across five drivers. The weighted score sets the headline number — and the levers for next year."
        right={<Button variant="ghost" onClick={goBack}>← Back to funding</Button>}
      />

      {/* Headline valuation card */}
      <Card style={{ padding: 32, marginBottom: 16, background: 'linear-gradient(135deg,#004747,#0090AD)', color: '#fff' }}>
        <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)' }}>Implied enterprise value</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 8 }}>
          <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 72, lineHeight: 1, letterSpacing: '-.02em' }}>${(valuation/1000).toFixed(0)}k</div>
          <div style={{ fontFamily: 'Nanum Pen Script', fontSize: 32, color: '#7FE2F7' }}>+{Math.round(((valuation - 250000) / 250000) * 100)}% on origination</div>
        </div>
        <div style={{ display: 'flex', gap: 32, marginTop: 22, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,.15)' }}>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(255,255,255,.6)', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600 }}>Revenue multiple</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, marginTop: 4 }}>{(valuation / ANNUAL.yearTotals.revenue).toFixed(1)}×</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(255,255,255,.6)', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600 }}>EBITDA multiple</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, marginTop: 4 }}>{(valuation / ANNUAL.yearTotals.netProfit).toFixed(1)}×</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(255,255,255,.6)', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600 }}>Driver score</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, marginTop: 4 }}>{score.toFixed(1)} / 10</div>
          </div>
        </div>
      </Card>

      {/* Drivers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Valuation drivers</div>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 18, margin: '4px 0 14px' }}>Five things move the number</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ANNUAL.drivers.map((d, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, color: '#232323' }}>{d.label}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373', marginLeft: 8 }}>weight {d.weight}%</span>
                  </div>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, color: '#004747' }}>{d.value} {d.value > 2 ? '/ 10' : '×'}</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#F2F2F2', borderRadius: 99, marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${(d.value / 10) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#00B1D6,#0090AD)' }} />
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#737373', marginTop: 4 }}>{d.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Levers for Year 2</div>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 18, margin: '4px 0 14px' }}>What would move the multiple</h3>
          {[
            { l: 'Lift margin to 15%', d: 'Adds ~$120k to EV at the same multiple.' },
            { l: 'Open second location', d: 'Unlocks a chain narrative — multiple expansion of 1.5×.' },
            { l: 'Brand equity (NPS 65+)', d: 'Lifts brand driver, commands premium pricing.' },
            { l: 'Reduce founder dependency', d: 'Operational maturity is your weakest driver.' },
          ].map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: i ? '1px solid #F2F2F2' : 'none' }}>
              <span style={{ width: 22, height: 22, borderRadius: 99, background: '#E6F9FF', color: '#004747', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>↑</span>
              <div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 13.5, color: '#232323' }}>{it.l}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#737373', marginTop: 2 }}>{it.d}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, fontFamily: 'Nanum Pen Script', fontSize: 18, color: '#027474', textAlign: 'center', lineHeight: 1.2 }}>
            valuation is a teaching tool — drivers are the lesson
          </div>
        </Card>
      </div>
    </div>
  );
}

window.AnnualScreens = { StrategicReviewScreen, FundingScreen, ValuationScreen };
