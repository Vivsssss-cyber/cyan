function Card({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface-glass)',
        border: '1.4px solid #fff',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-1)',
        color: 'var(--fg-1)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Button({ children, variant = 'primary', size = 'md', icon, onClick, disabled }) {
  const variants = {
    primary: {
      background: 'var(--cyan-500)',
      color: '#fff',
      border: '1px solid var(--cyan-500)',
      boxShadow: 'var(--shadow-2)',
    },
    dark: {
      background: 'linear-gradient(135deg, var(--teal-800), #003c49)',
      color: '#fff',
      border: '1px solid #0e3a3e',
      boxShadow: 'inset 0px 0px 8px 1px rgba(20,20,20,0.35)',
    },
    secondary: {
      background: '#fff',
      color: 'var(--fg-1)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-1)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--teal-700)',
      border: '1px solid transparent',
      boxShadow: 'none',
    },
  };
  const pad = size === 'lg' ? '13px 22px' : '10px 16px';
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: pad,
        borderRadius: 999,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        fontWeight: 700,
        fontSize: size === 'lg' ? 15 : 13,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...(variants[variant] || variants.primary),
      }}
    >
      <span>{children}</span>
      {icon && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: 999,
            background: variant === 'secondary' || variant === 'ghost' ? 'var(--cyan-100)' : 'rgba(255,255,255,.2)',
          }}
        >
          {icon}
        </span>
      )}
    </button>
  );
}

function Pill({ children, tone = 'neutral', dot, size = 'md' }) {
  const tones = {
    neutral: { bg: '#fff', fg: 'var(--fg-1)', bd: 'var(--border)' },
    cyan: { bg: 'var(--cyan-100)', fg: 'var(--teal-700)', bd: 'transparent' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: size === 'sm' ? '6px 10px' : '8px 12px',
        borderRadius: 999,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        fontSize: size === 'sm' ? 11 : 12,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        boxShadow: size === 'sm' ? 'none' : 'var(--shadow-1)',
      }}
    >
      {dot && <span style={{ width: 7, height: 7, borderRadius: 99, background: dot }} />}
      {children}
    </span>
  );
}

function Tabs({ items, value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', gap: 4, padding: 4, borderRadius: 999, background: 'var(--muted)' }}>
      {items.map((item) => {
        const active = value === item;
        return (
          <button
            key={item}
            onClick={() => onChange(item)}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '8px 14px',
              background: active ? '#fff' : 'transparent',
              color: active ? 'var(--teal-700)' : 'var(--fg-2)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: active ? 'var(--shadow-1)' : 'none',
            }}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

function Delta({ value, unit = '%', dir }) {
  const up = dir == null ? value >= 0 : dir;
  const color = up ? 'var(--positive)' : 'var(--negative)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700 }}>
      <span>{up ? '↑' : '↓'}</span>
      <span>{Math.abs(value).toLocaleString()}{unit ? unit : ''}</span>
    </span>
  );
}

function KPI({ label, value, delta }) {
  return (
    <Card style={{ padding: 20, borderLeft: '4px solid var(--cyan-500)' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-2)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontVariantNumeric: 'tabular-nums', fontSize: 26, fontWeight: 800, color: 'var(--fg-1)', lineHeight: 1 }}>{value}</div>
      <div style={{ marginTop: 10 }}>{delta}</div>
    </Card>
  );
}

Object.assign(window, { Card, Button, Pill, Tabs, KPI, Delta });
