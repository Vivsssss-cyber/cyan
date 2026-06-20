import React from 'react';
import { useAppNavigate } from '../../lib/use-app-navigate';
import {
  Play, MapPin, Users, Settings, LayoutDashboard,
  BarChart3, TrendingUp, Globe, Trophy, DollarSign,
  Cpu, Shield, Palette, ChevronRight, RefreshCw,
} from 'lucide-react';

const F = "'Outfit', system-ui, sans-serif";

interface RouteItem {
  path: string;
  label: string;
  description: string;
  icon: React.ElementType;
  group: string;
  accent?: string;
}

const routes: RouteItem[] = [
  // Onboarding
  { path: '/training',          label: 'Training Intro',      description: 'Game rules & orientation',          icon: Play,          group: 'Onboarding' },
  { path: '/welcome',           label: 'Welcome Carousel',    description: 'Brand intro + story setup',         icon: Play,          group: 'Onboarding' },
  // Setup
  { path: '/setup/location',    label: 'Location Setup',      description: 'Choose restaurant location',        icon: MapPin,        group: 'Setup' },
  { path: '/setup/capacity',    label: 'Capacity Setup',      description: 'Set seating & kitchen capacity',    icon: Settings,      group: 'Setup' },
  { path: '/setup/team',        label: 'Team Setup',          description: 'Hire your founding team',           icon: Users,         group: 'Setup' },
  { path: '/setup/summary',     label: 'Setup Summary',       description: 'Review all setup decisions',        icon: LayoutDashboard, group: 'Setup' },
  // Gameplay
  { path: '/game/cockpit',      label: 'Weekly Cockpit',      description: 'Make weekly business decisions',    icon: Cpu,           group: 'Gameplay' },
  { path: '/game/results',      label: 'Weekly Results',      description: 'Outcome of your week',              icon: BarChart3,     group: 'Gameplay' },
  { path: '/game/month-review', label: 'Month Review',        description: '4-week performance dashboard',      icon: TrendingUp,    group: 'Gameplay' },
  { path: '/game/board-review', label: 'Board Review',        description: 'Quarterly board presentation',      icon: Shield,        group: 'Gameplay' },
  { path: '/game/market',       label: 'Market View',         description: 'Competitive landscape analysis',    icon: Globe,         group: 'Gameplay' },
  { path: '/game/command-center', label: 'Command Center',    description: 'Advanced analytics & KPIs',         icon: LayoutDashboard, group: 'Gameplay' },
  { path: '/game/fundraising',  label: 'Fundraising',         description: 'Investor pitch & capital raise',    icon: DollarSign,    group: 'Gameplay' },
  { path: '/game/performance-report', label: 'Performance Report', description: 'Full simulation performance summary', icon: TrendingUp,    group: 'Gameplay' },
  { path: '/game/leaderboard',  label: 'Leaderboard',         description: 'Team rankings & scores',            icon: Trophy,        group: 'Gameplay' },
  // Admin
  { path: '/facilitator',       label: 'Facilitator Dashboard', description: 'Game master control panel',       icon: Shield,        group: 'Admin' },
  { path: '/design-system',     label: 'Design System',       description: 'Component library & tokens',        icon: Palette,       group: 'Admin' },
  { path: '/loops-design',      label: 'Loops Design',        description: 'Monthly, quarterly, annual cadence', icon: RefreshCw,     group: 'Admin' },
];

const groups = ['Onboarding', 'Setup', 'Gameplay', 'Admin'];

const groupAccent: Record<string, { dot: string; label: string }> = {
  Onboarding: { dot: '#00C1EB', label: 'text-[#00C1EB]' },
  Setup:      { dot: '#00A0C2', label: 'text-[#00A0C2]' },
  Gameplay:   { dot: '#006E85', label: 'text-[#006E85]' },
  Admin:      { dot: '#B45309', label: 'text-[#B45309]' },
};

export function RoutingHub() {
  const navigate = useAppNavigate();

  return (
    <div
      className="min-h-[100dvh] bg-[#F0F6FA]"
      style={{ fontFamily: F }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 bg-[#002C33]/95 backdrop-blur-md border-b border-white/10 px-8 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#00C1EB' }}
          >
            <LayoutDashboard size={16} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#FFFFFF', letterSpacing: '-0.2px' }}>
              Startup Valley
            </div>
            <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Route Navigator
            </div>
          </div>
        </div>
        <div
          className="px-3 py-1.5 rounded-full border border-[#006E85] flex items-center gap-1.5"
          style={{ background: 'rgba(0,193,235,0.08)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#00C1EB] animate-pulse" />
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#00C1EB', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {routes.length} Screens
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1288px] mx-auto px-6 py-10 w-full">

        {/* Hero */}
        <div className="mb-10">
          <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#002C33', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
            Screen Directory
          </h1>
          <p style={{ fontSize: '1rem', color: '#606569', marginTop: '0.5rem', fontWeight: 400 }}>
            Jump directly to any screen in the simulation. All routes active.
          </p>
        </div>

        {/* Groups */}
        <div className="flex flex-col gap-10">
          {groups.map(group => {
            const items = routes.filter(r => r.group === group);
            const accent = groupAccent[group];
            return (
              <section key={group}>
                {/* Group label */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: accent.dot }}
                  />
                  <span
                    style={{
                      fontSize: '0.65rem', fontWeight: 700,
                      letterSpacing: '2px', textTransform: 'uppercase',
                      color: accent.dot,
                    }}
                  >
                    {group}
                  </span>
                  <div className="flex-1 h-px bg-[#C8DDE6]" />
                  <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 500 }}>
                    {items.length} screen{items.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Cards grid — 2-col asymmetric */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map(route => {
                    const Icon = route.icon;
                    return (
                      <button
                        key={route.path}
                        onClick={() => navigate(route.path)}
                        className="group text-left bg-white rounded-xl p-5 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
                        style={{
                          border: '1.4px solid white',
                          boxShadow: '0px 2.5px 10px 0px rgba(77,181,182,0.18)',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.boxShadow = '0px 2.5px 14px 0px rgba(77,181,182,0.38)';
                          (e.currentTarget as HTMLElement).style.border = '1.4px solid rgba(0,193,235,0.3)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.boxShadow = '0px 2.5px 10px 0px rgba(77,181,182,0.18)';
                          (e.currentTarget as HTMLElement).style.border = '1.4px solid white';
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: '#E0F7FF' }}
                          >
                            <Icon size={16} color={accent.dot} />
                          </div>
                          <ChevronRight
                            size={14}
                            color="#C8DDE6"
                            className="mt-1 transition-all group-hover:translate-x-0.5 group-hover:text-[#00C1EB]"
                          />
                        </div>

                        <div className="mt-3">
                          <div
                            style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#002C33', lineHeight: 1.3 }}
                          >
                            {route.label}
                          </div>
                          <div
                            style={{ fontSize: '0.8125rem', color: '#606569', marginTop: '0.25rem', fontWeight: 400 }}
                          >
                            {route.description}
                          </div>
                        </div>

                        <div
                          className="mt-3 pt-3 border-t border-[#F0F6FA]"
                        >
                          <code
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.6875rem',
                              color: '#94A3B8',
                              fontWeight: 400,
                            }}
                          >
                            {route.path}
                          </code>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
