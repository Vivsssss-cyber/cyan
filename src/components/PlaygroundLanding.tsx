"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  Coffee,
  LayoutGrid,
  Play,
  Calendar,
  Target,
  Sliders,
  GraduationCap,
  MessageSquare,
  type PixelIconProps,
} from "./PixelIcons";
import { GridBackground } from "./GridBackground";
import { useAppNavigate } from "../lib/use-app-navigate";

type PixelIcon = React.FC<PixelIconProps>;
type Tag = { label: string; icon: PixelIcon };

type CardDef = {
  path: string;
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  tags: Tag[];
  icon: PixelIcon;
};

const cards: CardDef[] = [
  {
    path: "/demo",
    index: "01",
    eyebrow: "PLAYABLE FLOW",
    title: "Startup Valley",
    body: "Run a startup through the full monthly → quarterly → annual cadence. A live simulation loop with decisions, reviews, and a final evaluation.",
    tags: [
      { label: "Simulation", icon: Play },
      { label: "12 Months", icon: Calendar },
      { label: "Decisions", icon: Target },
    ],
    icon: Coffee,
  },
  {
    path: "/sim",
    index: "02",
    eyebrow: "PLATFORM",
    title: "CyanSim Platform",
    body: "The facilitator + student platform — scenario studio, teacher console, team dashboards, mentor loop, and voice evidence capture.",
    tags: [
      { label: "Facilitator", icon: Sliders },
      { label: "Students", icon: GraduationCap },
      { label: "Mentor Loop", icon: MessageSquare },
    ],
    icon: LayoutGrid,
  },
];

const BTN_CSS = `
.sv-btn-cta { transition: filter .15s ease, transform .12s ease; }
.sv-btn-cta:hover { filter: brightness(1.07); transform: translateY(-1px); }
.sv-btn-cta:active { transform: translateY(0); }
.sv-btn-outline { transition: transform .12s ease, border-color .15s ease; }
.sv-btn-outline:hover { transform: translateY(-1px); border-color: var(--sv-cyan); }
.sv-btn-outline:active { transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  .sv-btn-cta, .sv-btn-outline { transition: none !important; }
}
`;

export function PlaygroundLanding() {
  const navigate = useAppNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <GridBackground>
      <style>{BTN_CSS}</style>
      <div style={s.root}>
        <div style={s.inner}>
          {/* ── Top nav ── */}
          <motion.div
            style={s.nav}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={s.brand}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demo/cyan-logo.png" alt="Cyan Innovations" style={s.logoImg} />
            </div>
            <div style={s.navPills}>
              <button className="sv-btn-outline" style={s.navPill} onClick={() => navigate("/design-system")}>Design System</button>
              <button className="sv-btn-cta" style={s.navPillCta} onClick={() => navigate("/design-generator")}>
                <Sparkles size={14} strokeWidth={2.4} />
                New Design
              </button>
            </div>
          </motion.div>

          {/* ── Hero ── */}
          <motion.div
            style={s.hero}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={s.eyebrow}>
              <span style={s.eyebrowDot} />
              CYAN DESIGN PLAYGROUND
            </span>
            <h1 style={s.heroTitle}>
              Two surfaces.<br />
              <span style={s.heroAccent}>One design language.</span>
            </h1>
            <p style={s.heroBody}>
              Pick a place to play. Each door drops you into a fully-built experience
              shaped by the Cyan command-center system.
            </p>
          </motion.div>

          {/* ── Selectable cards ── */}
          <div style={s.cardGrid}>
            {cards.map((card, i) => {
              const Icon = card.icon;
              const isHover = hovered === card.path;
              return (
                <motion.button
                  key={card.path}
                  style={s.card(isHover)}
                  onClick={() => navigate(card.path)}
                  onMouseEnter={() => setHovered(card.path)}
                  onMouseLeave={() => setHovered(null)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.18 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Big ghost index number */}
                  <span style={s.ghostIndex}>{card.index}</span>

                  <div style={s.cardTop}>
                    <div style={s.cardIcon(isHover)}>
                      <Icon size={24} strokeWidth={2} color="var(--sv-teal-mid)" />
                    </div>
                    <span style={s.cardEyebrow}>{card.eyebrow}</span>
                  </div>

                  <h2 style={s.cardTitle}>{card.title}</h2>
                  <p style={s.cardBody}>{card.body}</p>

                  <div style={s.tagRow}>
                    {card.tags.map((t) => {
                      const TagIcon = t.icon;
                      return (
                        <span key={t.label} style={s.tag}>
                          <TagIcon size={12} strokeWidth={2.2} />
                          {t.label}
                        </span>
                      );
                    })}
                  </div>

                  <div style={s.cardFoot}>
                    <span style={s.cardPath}>{card.path}</span>
                    <span className="sv-btn-cta" style={s.enterPill(isHover)}>
                      Enter Game
                      <ArrowRight
                        size={15}
                        strokeWidth={2.4}
                        style={{ transform: isHover ? "translateX(3px)" : "none", transition: "transform 0.18s" }}
                      />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </GridBackground>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const s: Record<string, any> = {
  root: {
    position: "relative" as const,
    zIndex: 1,
    minHeight: "100dvh",
    padding: "24px",
    paddingBottom: 80,
  },
  inner: {
    maxWidth: "var(--sv-max-page-width)",
    margin: "0 auto",
  },

  // Nav
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 56,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logoImg: {
    height: 38,
    width: "auto",
    display: "block",
  },
  brandText: {
    display: "flex",
    flexDirection: "column" as const,
    lineHeight: 1,
  },
  brandName: {
    fontFamily: "var(--sv-font-ui)",
    fontWeight: 800,
    fontSize: 15,
    letterSpacing: "3px",
    color: "var(--sv-foreground)",
  },
  brandSub: {
    fontFamily: "var(--sv-font-ui)",
    fontWeight: 500,
    fontSize: 9,
    letterSpacing: "1.5px",
    color: "var(--sv-text-secondary)",
    marginTop: 2,
  },
  navPills: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  navPill: {
    fontFamily: "var(--sv-font-ui)",
    fontSize: 14,
    fontWeight: 600,
    color: "var(--game-text)",
    background: "#fff",
    border: "1.4px solid var(--sv-border)",
    borderRadius: "var(--game-cta-radius)",
    padding: "10px 20px",
    cursor: "pointer",
  },
  navPillCta: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontFamily: "var(--sv-font-ui)",
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    background: "var(--game-cta-gradient)",
    border: "none",
    borderRadius: "var(--game-cta-radius)",
    padding: "10px 22px",
    cursor: "pointer",
  },

  // Hero
  hero: {
    marginBottom: 36,
    maxWidth: 640,
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "var(--sv-teal-mid)",
    background: "var(--sv-cyan-tint)",
    padding: "5px 12px",
    borderRadius: "var(--sv-radius-pill)",
    marginBottom: 18,
  },
  eyebrowDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "var(--sv-cyan)",
    boxShadow: "0 0 0 3px rgba(0,193,235,0.25)",
  },
  heroTitle: {
    fontSize: 46,
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-1.4px",
    color: "var(--sv-foreground)",
    marginBottom: 16,
  },
  heroAccent: {
    background: "linear-gradient(120deg, var(--sv-cyan), var(--sv-teal-mid))",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "var(--sv-teal-mid)",
  },
  heroBody: {
    fontSize: 15,
    color: "var(--sv-text-secondary)",
    lineHeight: 1.6,
    maxWidth: 480,
  },

  // Cards
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "1.12fr 0.88fr",
    gap: 20,
    alignItems: "stretch",
  },
  card: (hover: boolean) => ({
    position: "relative" as const,
    overflow: "hidden",
    textAlign: "left" as const,
    fontFamily: "var(--sv-font-ui)",
    background: hover
      ? "linear-gradient(160deg, rgba(255,255,255,0.82), rgba(224,247,255,0.55))"
      : "rgba(255,255,255,0.6)",
    border: hover ? "1.4px solid rgba(0,193,235,0.5)" : "1.4px solid white",
    borderRadius: 24,
    padding: 28,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
    boxShadow: hover
      ? "0 22px 48px -22px rgba(0,44,51,0.4)"
      : "0 8px 24px -18px rgba(0,44,51,0.22)",
    transform: hover ? "translateY(-4px)" : "none",
    transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s, background 0.2s",
  }),
  ghostIndex: {
    position: "absolute" as const,
    top: -18,
    right: 6,
    fontSize: 120,
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: "-4px",
    color: "rgba(0,110,133,0.06)",
    pointerEvents: "none" as const,
    fontVariantNumeric: "tabular-nums",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  cardIcon: (hover: boolean) => ({
    width: 52,
    height: 52,
    borderRadius: 14,
    background: "var(--sv-cyan-tint)",
    border: "1px solid var(--sv-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transform: hover ? "scale(1.06) rotate(-3deg)" : "none",
    transition: "transform 0.2s",
  }),
  cardEyebrow: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "var(--sv-text-muted)",
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: "var(--sv-foreground)",
    letterSpacing: "-0.7px",
    marginTop: 2,
  },
  cardBody: {
    fontSize: 13.5,
    color: "var(--sv-text-secondary)",
    lineHeight: 1.6,
    flexGrow: 1,
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 6,
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.04em",
    color: "var(--sv-teal-mid)",
    background: "var(--sv-cyan-tint)",
    border: "1px solid var(--sv-border)",
    borderRadius: "var(--sv-radius-pill)",
    padding: "4px 10px",
  },
  cardFoot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 14,
    borderTop: "1px solid var(--sv-border)",
  },
  cardPath: {
    fontSize: 12,
    fontWeight: 700,
    color: "var(--sv-text-muted)",
    fontVariantNumeric: "tabular-nums",
  },
  enterPill: () => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    fontFamily: "var(--sv-font-ui)",
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    background: "var(--game-cta-gradient)",
    border: "none",
    borderRadius: "var(--game-cta-radius)",
    padding: "11px 20px",
  }),
};
