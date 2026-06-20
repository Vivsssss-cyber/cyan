function SVNavCluster({ team, role, round, avatar }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '7px 12px',
          borderRadius: 999,
          background: 'rgba(255,255,255,.72)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-1)',
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            background: 'var(--ink)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          {avatar}
        </div>
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--fg-1)' }}>{team}</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{role} · {round}</div>
        </div>
      </div>
    </div>
  );
}

function AppShell({ title, right, children }) {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--fg-1)' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'rgba(239,242,244,.88)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            maxWidth: 1288,
            margin: '0 auto',
            padding: '14px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--ink)',
                color: 'var(--cyan-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 900,
              }}
            >
              SV
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-.02em' }}>{title}</div>
              <div style={{ fontSize: 10, color: 'var(--fg-muted)', fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase' }}>Monthly · Quarterly · Annual loops</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {right}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

Object.assign(window, { SVNavCluster, AppShell });
