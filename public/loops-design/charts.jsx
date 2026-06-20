// Hand-drawn SVG charts in Cyan DS style — used on Results / Review screens.
// All charts are deliberately simple, with a slight wobble to feel sketched.

// Tiny utility — a wobbly polyline path
function wobblyPath(points, amp = 0.6) {
  return points.map((p, i) => {
    const x = p[0] + (i % 2 === 0 ? -amp : amp);
    const y = p[1] + (i % 3 === 0 ? amp : -amp);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

// Bar chart: revenue vs cost (single comparison)
function ChartRevenueCost({ revenue, cost, w = 460, h = 200 }) {
  const max = Math.max(revenue, cost) * 1.15;
  const barW = 90;
  const padL = 56, padR = 24, padT = 28, padB = 40;
  const innerH = h - padT - padB;
  const revH = (revenue / max) * innerH;
  const costH = (cost / max) * innerH;
  const groupX = padL + 30;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      {/* y-grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = padT + innerH * (1 - t);
        return <line key={i} x1={padL} y1={y} x2={w - padR} y2={y} stroke="#E6E6E6" strokeWidth="1" strokeDasharray={i === 0 ? '0' : '3 4'} />;
      })}
      {/* y-labels */}
      {[0, 0.5, 1].map((t, i) => (
        <text key={i} x={padL - 8} y={padT + innerH * (1 - t) + 4} textAnchor="end" fontFamily="Inter" fontSize="10" fill="#999">${Math.round((max * t) / 1000)}k</text>
      ))}
      {/* revenue bar */}
      <rect x={groupX} y={padT + innerH - revH} width={barW} height={revH} fill="#00B1D6" rx="4" />
      <text x={groupX + barW / 2} y={padT + innerH - revH - 8} textAnchor="middle" fontFamily="Outfit" fontWeight="700" fontSize="13" fill="#004747">${(revenue / 1000).toFixed(1)}k</text>
      <text x={groupX + barW / 2} y={padT + innerH + 18} textAnchor="middle" fontFamily="Inter" fontSize="11" fill="#737373">Revenue</text>
      {/* cost bar */}
      <rect x={groupX + barW + 36} y={padT + innerH - costH} width={barW} height={costH} fill="#737373" rx="4" />
      <text x={groupX + barW + 36 + barW / 2} y={padT + innerH - costH - 8} textAnchor="middle" fontFamily="Outfit" fontWeight="700" fontSize="13" fill="#333">${(cost / 1000).toFixed(1)}k</text>
      <text x={groupX + barW + 36 + barW / 2} y={padT + innerH + 18} textAnchor="middle" fontFamily="Inter" fontSize="11" fill="#737373">Total Cost</text>
      {/* margin annotation — hand-drawn */}
      <text x={w - padR - 8} y={padT + 8} textAnchor="end" fontFamily="Nanum Pen Script" fontSize="22" fill="#027474">+{Math.round(((revenue - cost) / revenue) * 100)}% margin</text>
    </svg>
  );
}

// Stacked bar — product revenue
function ChartProductStack({ items, w = 460, h = 200 }) {
  const total = items.reduce((s, it) => s + it.rev, 0);
  const colors = ['#00B1D6','#027474','#F59E0B','#8A38F5','#10B981','#F87171'];
  const padL = 24, padR = 24, padT = 36, padB = 40;
  const innerW = w - padL - padR;
  const barH = 56;
  let x = padL;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <text x={padL} y={padT - 14} fontFamily="Inter" fontSize="11" fontWeight="600" fill="#737373" letterSpacing=".06em">REVENUE BY PRODUCT · ${(total / 1000).toFixed(1)}K</text>
      {items.map((it, i) => {
        const w0 = (it.rev / total) * innerW;
        const r = <g key={it.id}>
          <rect x={x} y={padT} width={w0 - 2} height={barH} fill={colors[i % colors.length]} rx="4" />
          {w0 > 60 && <text x={x + w0 / 2} y={padT + barH / 2 + 4} textAnchor="middle" fontFamily="Outfit" fontWeight="600" fontSize="12" fill="#fff">{it.name}</text>}
        </g>;
        x += w0;
        return r;
      })}
      {/* legend */}
      {items.map((it, i) => (
        <g key={it.id} transform={`translate(${padL + (i % 3) * 150}, ${padT + barH + 16 + Math.floor(i / 3) * 18})`}>
          <rect width="10" height="10" fill={colors[i % colors.length]} rx="2" />
          <text x="16" y="9" fontFamily="Inter" fontSize="11" fill="#515151">{it.name} · ${it.rev.toLocaleString()}</text>
        </g>
      ))}
    </svg>
  );
}

// Sold vs Unsold per product
function ChartSoldUnsold({ items, w = 460, h = 220 }) {
  const max = Math.max(...items.map(i => i.sold + i.unsold)) * 1.1;
  const padL = 80, padR = 24, padT = 16, padB = 24;
  const rowH = (h - padT - padB) / items.length;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      {items.map((it, i) => {
        const y = padT + i * rowH + 4;
        const barH = rowH - 8;
        const innerW = w - padL - padR;
        const soldW = (it.sold / max) * innerW;
        const unsoldW = (it.unsold / max) * innerW;
        return (
          <g key={it.id}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fontFamily="Inter" fontSize="11" fill="#515151">{it.name}</text>
            <rect x={padL} y={y} width={soldW} height={barH} fill="#00B1D6" rx="3" />
            <rect x={padL + soldW + 1} y={y} width={unsoldW} height={barH} fill="#F87171" rx="3" />
            <text x={padL + soldW + unsoldW + 6} y={y + barH / 2 + 4} fontFamily="Outfit" fontWeight="600" fontSize="11" fill="#737373">{it.sold} sold · {it.unsold} unsold</text>
          </g>
        );
      })}
    </svg>
  );
}

// Footfall trend (line)
function ChartFootfall({ points, w = 460, h = 180 }) {
  const filled = points.filter(p => p != null);
  const max = Math.max(...filled) * 1.1;
  const padL = 36, padR = 16, padT = 24, padB = 32;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const xs = points.map((_, i) => padL + (i / (points.length - 1)) * innerW);
  const ys = points.map(p => p == null ? null : padT + innerH - (p / max) * innerH);
  const linePts = xs.map((x, i) => ys[i] == null ? null : [x, ys[i]]).filter(Boolean);
  const d = linePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = d + ` L${linePts[linePts.length - 1][0]},${padT + innerH} L${linePts[0][0]},${padT + innerH} Z`;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="ff-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#00B1D6" stopOpacity=".3" />
          <stop offset="1" stopColor="#00B1D6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t, i) => (
        <line key={i} x1={padL} y1={padT + innerH * (1 - t)} x2={w - padR} y2={padT + innerH * (1 - t)} stroke="#E6E6E6" strokeDasharray={i === 0 ? '0' : '3 4'} />
      ))}
      <path d={area} fill="url(#ff-grad)" />
      <path d={d} fill="none" stroke="#00B1D6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => p == null ? null : (
        <g key={i}>
          <circle cx={xs[i]} cy={ys[i]} r="4" fill="#fff" stroke="#00B1D6" strokeWidth="2.5" />
          <text x={xs[i]} y={padT + innerH + 18} textAnchor="middle" fontFamily="Inter" fontSize="10" fill="#737373">M{i + 1}</text>
        </g>
      ))}
      {/* this-month annotation */}
      {ys[3] != null && (
        <g>
          <text x={xs[3] + 6} y={ys[3] - 10} fontFamily="Nanum Pen Script" fontSize="20" fill="#027474">we are here</text>
          <path d={`M${xs[3] + 4} ${ys[3] - 6} Q${xs[3] - 2} ${ys[3] - 4} ${xs[3]} ${ys[3] - 2}`} fill="none" stroke="#027474" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
}

// Cash waterfall
function ChartWaterfall({ steps, w = 540, h = 240 }) {
  const padL = 16, padR = 16, padT = 20, padB = 56;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  // compute running and span
  let running = 0;
  const cumul = steps.map(s => {
    if (s.type === 'start' || s.type === 'end') {
      running = s.value;
      return { ...s, top: s.value, bot: 0 };
    }
    const top = running + Math.max(s.value, 0);
    const bot = running + Math.min(s.value, 0);
    running += s.value;
    return { ...s, top, bot };
  });
  const allVals = cumul.flatMap(s => [s.top, s.bot, s.value, 0]);
  const max = Math.max(...allVals);
  const min = Math.min(...allVals, 0);
  const range = max - min || 1;
  const yFor = v => padT + innerH - ((v - min) / range) * innerH;
  const barW = innerW / steps.length - 8;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <line x1={padL} y1={yFor(0)} x2={w - padR} y2={yFor(0)} stroke="#E6E6E6" />
      {cumul.map((s, i) => {
        const x = padL + i * (barW + 8) + 4;
        const isPillar = s.type === 'start' || s.type === 'end';
        const y = isPillar ? yFor(s.value) : yFor(s.top);
        const h0 = isPillar ? yFor(0) - yFor(s.value) : yFor(s.bot) - yFor(s.top);
        const fill = isPillar ? '#004747' : s.type === 'pos' ? '#10B981' : '#F87171';
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={Math.abs(h0)} fill={fill} rx="3" />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontFamily="Outfit" fontWeight="600" fontSize="11" fill="#333">
              {s.type === 'pos' ? '+' : ''}{s.value < 0 ? '-' : ''}${Math.abs(isPillar ? s.value : s.value).toLocaleString()}
            </text>
            <text x={x + barW / 2} y={padT + innerH + 18} textAnchor="middle" fontFamily="Inter" fontSize="11" fill="#515151">{s.label}</text>
            {isPillar && <text x={x + barW / 2} y={padT + innerH + 34} textAnchor="middle" fontFamily="Outfit" fontWeight="700" fontSize="11" fill="#004747">${s.value.toLocaleString()}</text>}
          </g>
        );
      })}
    </svg>
  );
}

// Mini bar — used for inventory pressure / staff pressure visualizations
function PressureBar({ value, max = 100, label, status = 'ok', w = 180 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const colors = { ok: '#10B981', warn: '#F59E0B', danger: '#F44336' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#737373', letterSpacing: '.04em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: 'Outfit', fontSize: 13, fontWeight: 700, color: colors[status] }}>{Math.round(value)}%</span>
      </div>
      <div style={{ width: w, height: 6, background: '#F2F2F2', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: colors[status], borderRadius: 99, transition: 'width 240ms cubic-bezier(.2,.7,.2,1)' }} />
      </div>
    </div>
  );
}

// Risk pill — small inline chip
function RiskChip({ tone = 'warn', children }) {
  const tones = {
    warn:   { bg: '#FFF8E1', fg: '#8B6A00', dot: '#F59E0B' },
    danger: { bg: '#FEE2E2', fg: '#820606', dot: '#F44336' },
    info:   { bg: '#E3F2FD', fg: '#0B4F8B', dot: '#2196F3' },
  }[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 999, background: tones.bg, color: tones.fg, fontFamily: 'Inter', fontSize: 10.5, fontWeight: 600, letterSpacing: '.01em' }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: tones.dot }} />
      {children}
    </span>
  );
}

Object.assign(window, { ChartRevenueCost, ChartProductStack, ChartSoldUnsold, ChartFootfall, ChartWaterfall, PressureBar, RiskChip });
