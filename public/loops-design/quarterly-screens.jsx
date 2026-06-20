// Quarterly Loop screens — Plan → Pivot → Quarter Results
const { useState: uS } = React;

function QHeader({ eyebrow, title, hint, right }) {
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

// ===== Quarterly Plan =====
function QuarterlyPlanScreen({ goNext }) {
  const [theme, setTheme] = uS('growth');
  const [picks, setPicks] = uS(QUARTER.initiatives.filter(i => i.selected).map(i => i.id));
  const totalCost = QUARTER.initiatives.filter(i => picks.includes(i.id)).reduce((s, i) => s + i.cost, 0);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px 80px' }}>
      <QHeader
        eyebrow="strategic horizon"
        title={`Plan ${QUARTER.label}`}
        hint="Pick a quarterly theme, then commit to the initiatives that support it. Targets cascade down into your monthly decisions."
        right={<div style={{ display: 'flex', gap: 12 }}><Pill dot="#00B1D6">3 months · M4 → M6</Pill><Button variant="dark" icon="→" onClick={goNext}>Set mid-quarter checkpoint</Button></div>}
      />

      {/* Q1 recap strip */}
      <Card style={{ padding: 20, marginBottom: 16, background: '#F3F7F8' }}>
        <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Last quarter recap · Q1</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24, marginTop: 10 }}>
          <div><div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>Revenue</div><div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, color: '#232323' }}>${QUARTER.q1.revenue.toLocaleString()}</div></div>
          <div><div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>Net profit</div><div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, color: '#232323' }}>${QUARTER.q1.profit.toLocaleString()}</div></div>
          <div><div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>Footfall</div><div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, color: '#232323' }}>{QUARTER.q1.footfall.toLocaleString()}</div></div>
          <div><div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>NPS</div><div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, color: '#232323' }}>{QUARTER.q1.nps}</div></div>
          <div><div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>Best · Weakest</div><div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, color: '#232323', marginTop: 4 }}>{QUARTER.q1.bestProduct} <span style={{ color: '#737373', fontWeight: 400 }}>·</span> {QUARTER.q1.weakestProduct}</div></div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Theme */}
          <Card style={{ padding: 24 }}>
            <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>01 · Quarterly theme</div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, margin: '4px 0 14px', color: '#232323' }}>What's the bet for Q2?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {QUARTER.themes.map(t => {
                const active = theme === t.id;
                return (
                  <button key={t.id} onClick={() => setTheme(t.id)} style={{ textAlign: 'left', padding: 18, borderRadius: 14, border: active ? '2px solid #00B1D6' : '1px solid #E6E6E6', background: active ? '#E6F9FF' : '#fff', cursor: 'pointer' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: active ? 'var(--cyan-100)' : '#F2F2F2', color: active ? '#004747' : '#515151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit', fontWeight: 700 }}>{t.icon}</div>
                    <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 15, color: '#232323', marginTop: 10 }}>{t.name}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#737373', marginTop: 4, lineHeight: 1.4, minHeight: 50 }}>{t.desc}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                      <RiskChip tone="info">Cash {t.cashImpact}</RiskChip>
                      <RiskChip tone="info">Rev {t.revImpact}</RiskChip>
                    </div>
                    <div style={{ marginTop: 10 }}><RiskChip tone="warn">{t.risk}</RiskChip></div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Initiatives */}
          <Card style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>02 · Initiatives</div>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, margin: '4px 0 0', color: '#232323' }}>What ships this quarter?</h2>
              </div>
              <Pill tone="cyan" size="sm">{picks.length} selected · ${totalCost.toLocaleString()}</Pill>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {QUARTER.initiatives.map(i => {
                const active = picks.includes(i.id);
                return (
                  <button key={i.id} onClick={() => setPicks(active ? picks.filter(x => x !== i.id) : [...picks, i.id])} style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 12, border: active ? '2px solid #00B1D6' : '1px solid #E6E6E6', background: active ? '#E6F9FF' : '#fff', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, color: '#232323' }}>{i.name}</div>
                      <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: active ? '#004747' : '#737373' }}>${i.cost.toLocaleString()}</span>
                    </div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#737373', marginTop: 4, lineHeight: 1.4 }}>{i.q}</div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Targets sidebar */}
        <div style={{ position: 'sticky', top: 96, alignSelf: 'flex-start' }}>
          <Card style={{ padding: 22 }}>
            <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Quarterly targets</div>
            <div style={{ fontFamily: 'Outfit', fontSize: 14, color: '#515151', marginTop: 4, lineHeight: 1.4 }}>Goals you'll be measured against in Q-Results.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              {Object.entries(QUARTER.targets).map(([k, t]) => (
                <div key={k}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#515151', fontWeight: 500 }}>{t.label}</span>
                    <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, color: '#004747' }}>{typeof t.value === 'number' && t.value > 1000 ? `${(t.value / 1000).toFixed(1)}k` : t.value}{k === 'margin' || k === 'retention' ? '%' : ''}</span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: '#F2F2F2', borderRadius: 99, marginTop: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${(t.baseline / t.value) * 100}%`, height: '100%', background: '#D2D2D2' }} />
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373', marginTop: 4 }}>Baseline: {typeof t.baseline === 'number' && t.baseline > 1000 ? `${(t.baseline / 1000).toFixed(1)}k` : t.baseline}{k === 'margin' || k === 'retention' ? '%' : ''}</div>
                </div>
              ))}
            </div>
          </Card>
          <div style={{ marginTop: 12, fontFamily: 'Nanum Pen Script', fontSize: 18, color: '#027474', textAlign: 'center', lineHeight: 1.2 }}>
            quarterly themes set the rails — monthly decisions choose the speed
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Mid-Quarter Pivot =====
function PivotScreen({ goBack, goNext }) {
  const [pick, setPick] = uS(QUARTER.midCheck.selected);
  const m = QUARTER.midCheck;
  const onTrackPct = Math.round((m.revenueProgress / m.revenueOnTrack) * 100);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 32px 80px' }}>
      <QHeader
        eyebrow="something changed"
        title="Mid-quarter checkpoint"
        hint="Halfway through Q2. The world moved — decide whether to pivot or hold the plan."
        right={<Button variant="ghost" onClick={goBack}>← Back to plan</Button>}
      />

      {/* Progress strip */}
      <Card style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Revenue progress · Q2</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 28, color: '#232323', marginTop: 4 }}>${m.revenueProgress.toLocaleString()} <span style={{ fontSize: 14, color: '#737373', fontWeight: 500 }}>/ ${QUARTER.targets.revenue.value.toLocaleString()}</span></div>
            <div style={{ width: '100%', height: 8, background: '#F2F2F2', borderRadius: 99, marginTop: 10, overflow: 'hidden' }}>
              <div style={{ width: `${(m.revenueProgress / QUARTER.targets.revenue.value) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#00B1D6,#0090AD)' }} />
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: onTrackPct >= 100 ? '#10B981' : '#F59E0B', marginTop: 8, fontWeight: 600 }}>{onTrackPct >= 100 ? '✓ Ahead of pace' : '⚠ Behind pace'} · ${m.revenueOnTrack.toLocaleString()} expected by now</div>
          </div>
          <div style={{ background: '#FFF8E1', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8B6A00' }}>Event · Month 5</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 17, color: '#232323', marginTop: 4 }}>{m.eventTitle}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: '#515151', marginTop: 6, lineHeight: 1.5 }}>{m.eventBody}</div>
          </div>
        </div>
      </Card>

      {/* Pivot options */}
      <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373', marginBottom: 8 }}>Choose one</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {m.pivotOptions.map(o => {
          const active = pick === o.id;
          return (
            <button key={o.id} onClick={() => setPick(o.id)} style={{ textAlign: 'left', padding: 20, borderRadius: 14, border: active ? '2px solid #00B1D6' : '1px solid #E6E6E6', background: active ? '#E6F9FF' : '#fff', cursor: 'pointer' }}>
              <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 15, color: '#232323' }}>{o.name}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: '#737373', marginTop: 6, lineHeight: 1.5, minHeight: 70 }}>{o.body}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                <RiskChip tone="info">Q-impact {o.delta}</RiskChip>
                <RiskChip tone="warn">{o.risk}</RiskChip>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#fff', borderRadius: 14, boxShadow: 'var(--shadow-2)' }}>
        <div style={{ fontFamily: 'Inter', fontSize: 13, color: '#737373' }}>Pivot decisions cascade into next month's plan automatically.</div>
        <Button variant="primary" icon="→" onClick={goNext}>Lock pivot · run Q2</Button>
      </div>
    </div>
  );
}

// ===== Quarter Results =====
function QuarterResultsScreen({ goBack }) {
  const r = QUARTER.qResults;
  const TargetRow = ({ label, value, target, suffix = '', fmtV }) => {
    const pct = (value / target) * 100;
    const hit = value >= target;
    return (
      <div style={{ padding: '14px 0', borderTop: '1px solid #F2F2F2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, color: '#232323' }}>{label}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373', marginTop: 2 }}>Target: {fmtV ? fmtV(target) : target}{suffix}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, color: hit ? '#10B981' : '#F59E0B' }}>{fmtV ? fmtV(value) : value}{suffix}</span>
            <RiskChip tone={hit ? 'info' : 'warn'}>{hit ? '✓ Hit' : `${Math.round(pct)}% of target`}</RiskChip>
          </div>
        </div>
        <div style={{ width: '100%', height: 4, background: '#F2F2F2', borderRadius: 99, marginTop: 10, overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: hit ? '#10B981' : '#F59E0B' }} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px 80px' }}>
      <QHeader
        eyebrow="quarter in the books"
        title={`${QUARTER.label} results`}
        hint="What you bet, what landed, and what carries into Q3."
        right={<div style={{ display: 'flex', gap: 12 }}><Button variant="ghost" onClick={goBack}>← Back</Button><Button variant="dark" icon="→">Plan Q3</Button></div>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <KPI label="Q2 Revenue" value={`$${(r.revenue / 1000).toFixed(1)}k`} delta={<Delta value={Math.round(((r.revenue - r.target) / r.target) * 100)} />} />
        <KPI label="Net margin" value={`${r.margin}%`} delta={<Delta value={r.margin - r.marginTarget} unit="pp" dir={r.margin >= r.marginTarget} />} />
        <KPI label="Footfall" value={r.footfall.toLocaleString()} delta={<Delta value={Math.round(((r.footfall - r.footfallTarget) / r.footfallTarget) * 100)} />} />
        <KPI label="NPS" value={r.nps} delta={<Delta value={9} dir={true} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Targets vs. actuals</div>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 18, margin: '4px 0 0', color: '#232323' }}>3 of 4 targets hit</h3>
          <TargetRow label="Revenue"   value={r.revenue}    target={r.target}    fmtV={v => `$${(v/1000).toFixed(1)}k`} />
          <TargetRow label="Net margin" value={r.margin}    target={r.marginTarget}    suffix="%" />
          <TargetRow label="Footfall"   value={r.footfall}  target={r.footfallTarget}  fmtV={v => v.toLocaleString()} />
          <TargetRow label="Retention"  value={r.retention} target={r.retentionTarget} suffix="%" />
        </Card>

        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Monthly trajectory</div>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 18, margin: '4px 0 14px', color: '#232323' }}>Steady within the quarter</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 200 }}>
            {r.monthly.map((v, i) => {
              const max = Math.max(...r.monthly);
              const h = (v / max) * 160;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: '#004747' }}>${(v/1000).toFixed(1)}k</span>
                  <div style={{ width: '100%', height: h, background: 'linear-gradient(180deg,#00B1D6,#0090AD)', borderRadius: '8px 8px 0 0' }} />
                  <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373' }}>M{i + 4}</span>
                </div>
              );
            })}
          </div>
          <div style={{ fontFamily: 'Nanum Pen Script', fontSize: 18, color: '#027474', textAlign: 'center', marginTop: 14 }}>tight band — predictability is forming</div>
        </Card>
      </div>

      <Card style={{ padding: 24 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#737373' }}>Learnings into Q3</div>
        <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 18, margin: '4px 0 14px', color: '#232323' }}>What to carry forward</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {r.learnings.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ width: 24, height: 24, borderRadius: 99, background: l.good ? '#E8F5E9' : '#FFF8E1', color: l.good ? '#1B5E20' : '#8B6A00', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{l.good ? '✓' : '!'}</span>
              <div style={{ fontFamily: 'Inter', fontSize: 13, color: '#232323', lineHeight: 1.5 }}>{l.text}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

window.QuarterlyScreens = { QuarterlyPlanScreen, PivotScreen, QuarterResultsScreen };
