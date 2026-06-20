import React from 'react';
import { Calendar, Dice3, AlertTriangle, MessageCircle, X } from 'lucide-react';

interface EventModalProps {
  onClose: () => void;
  eventType?: 'scheduled' | 'random' | 'threshold' | 'notification';
}

const eventData = {
  scheduled: {
    headerColor: '#006E85',
    icon: Calendar,
    title: 'Festival Week',
    description: 'A local food festival is happening in your area! Foot traffic increases by 25% this week across all locations. Premium customer ratio increases by 5%.',
    kpiAffected: ['Footfall', 'Revenue', 'Customer Mix'],
    durationBadge: { label: 'This week only', color: '#B45309' },
    typeBadge: 'SCHEDULED',
  },
  random: {
    headerColor: '#B45309',
    icon: Dice3,
    title: 'Supply Chain Disruption',
    description: 'A regional logistics strike affects ingredient supply chains. Cost of materials increases by 15% for the next 4 weeks. All teams are affected simultaneously.',
    kpiAffected: ['COGS', 'Margin', 'Cash'],
    durationBadge: { label: '4-week effect', color: '#D97706' },
    typeBadge: 'RANDOM GLOBAL',
  },
  threshold: {
    headerColor: '#C0392B',
    icon: AlertTriangle,
    title: 'Customer Satisfaction Crisis',
    description: 'Your satisfaction score has fallen below 40% for 3 consecutive weeks. A wave of negative reviews hits — demand drops 20% until recovery.',
    kpiAffected: ['Demand', 'Retention', 'Revenue'],
    durationBadge: { label: '26-week effect', color: '#C0392B' },
    typeBadge: 'THRESHOLD',
    causalText: 'Ops level "Basic" with Premium positioning for 3+ weeks triggered this event.',
    cooldown: '8-week cooldown',
  },
  notification: {
    headerColor: '#64748B',
    icon: MessageCircle,
    title: 'Industry Report Published',
    description: 'A market research firm has published quarterly restaurant industry data. Average customer spend is trending upward by 3% across the sector. No direct KPI impact — informational only.',
    kpiAffected: [],
    durationBadge: null,
    typeBadge: 'NOTIFICATION',
  },
};

export function EventModal({ onClose, eventType = 'scheduled' }: EventModalProps) {
  const event = eventData[eventType];
  const Icon = event.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden" style={{ borderRadius: '16px' }}>
        {/* Header band */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: event.headerColor }}>
          <div className="flex items-center gap-3">
            <Icon size={22} color="white" />
            <span
              className="px-2 py-0.5 rounded text-white uppercase"
              style={{ background: 'rgba(255,255,255,0.2)', fontSize: '10px', fontWeight: 700, letterSpacing: '1px' }}
            >
              {event.typeBadge}
            </span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-[#002C33] mb-3" style={{ fontSize: '22px', fontWeight: 800 }}>
            {event.title}
          </h3>
          <p className="text-[#334155]" style={{ fontSize: '14px', lineHeight: '1.7' }}>
            {event.description}
          </p>

          {/* Duration badge */}
          {event.durationBadge && (
            <div className="mt-4">
              <span
                className="px-3 py-1 rounded-full text-white"
                style={{ background: event.durationBadge.color, fontSize: '11px', fontWeight: 700 }}
              >
                {event.durationBadge.label}
              </span>
            </div>
          )}

          {/* KPIs affected */}
          {event.kpiAffected.length > 0 && (
            <div className="mt-4">
              <span className="text-[#64748B] uppercase" style={{ fontSize: '9px', letterSpacing: '2px' }}>KPIs Affected</span>
              <div className="flex gap-2 mt-1.5">
                {event.kpiAffected.map((kpi) => (
                  <span key={kpi} className="px-2 py-0.5 rounded bg-[#E0F7FF] text-[#006E85]" style={{ fontSize: '11px', fontWeight: 600 }}>
                    {kpi}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Threshold-specific */}
          {'causalText' in event && event.causalText && (
            <div className="mt-4 p-3 rounded-xl bg-[#FEF2F2] border border-[#C0392B]/20">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} color="#C0392B" className="mt-0.5 shrink-0" />
                <div>
                  <span className="text-[#C0392B]" style={{ fontSize: '12px', fontWeight: 700 }}>Why it happened:</span>
                  <p className="text-[#C0392B]/80 mt-0.5" style={{ fontSize: '12px' }}>{event.causalText}</p>
                </div>
              </div>
              {'cooldown' in event && (
                <p className="text-[#64748B] mt-2 italic" style={{ fontSize: '11px' }}>
                  {event.cooldown}
                </p>
              )}
            </div>
          )}

          {/* Notification-specific */}
          {eventType === 'notification' && (
            <div className="mt-4 p-3 rounded-xl bg-[#F0F6FA] border border-[#C8DDE6]">
              <span className="text-[#64748B]" style={{ fontSize: '12px', fontWeight: 600 }}>
                No KPI impact — informational only
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-6 px-8 py-3 rounded-full text-white uppercase tracking-[2px] transition-all hover:shadow-lg"
            style={{ background: event.headerColor, fontWeight: 700, fontSize: '13px' }}
          >
            Got it →
          </button>
        </div>
      </div>
    </div>
  );
}
