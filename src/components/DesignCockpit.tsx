"use client";

import { useEffect, useState } from "react";
import {
  DesignEntry,
  deleteFromHistory,
  formatRelativeTime,
  loadHistory,
} from "../lib/design-history";
import { useAppNavigate } from "../lib/use-app-navigate";
import { referenceScreens, ReferenceScreen } from "../lib/route-registry";

type PreviewMode = { kind: "generated"; entry: DesignEntry } | { kind: "reference"; screen: ReferenceScreen };

export function DesignCockpit() {
  const navigate = useAppNavigate();
  const [history, setHistory] = useState<DesignEntry[]>([]);
  const [preview, setPreview] = useState<PreviewMode | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  function handleDelete(id: string) {
    deleteFromHistory(id);
    setHistory(loadHistory());
    if (preview?.kind === "generated" && preview.entry.id === id) setPreview(null);
    setDeleteConfirm(null);
  }

  // Group reference screens by category
  const refByCategory = referenceScreens.reduce<Record<string, ReferenceScreen[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div style={s.root}>
      <div style={s.inner}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.logoMark}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sv-cyan)" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div style={s.logoLabel}>CYAN DESIGN</div>
              <h1 style={s.title}>Design Generator</h1>
            </div>
          </div>
          <div style={s.headerActions}>
            <button style={s.navBtn} onClick={() => navigate("/design-system")}>
              Design System
            </button>
            <button style={s.primaryNavBtn} onClick={() => navigate("/design-generator")}>
              New Design
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 6 }}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Hero strip */}
        <div style={s.heroStrip}>
          <div style={s.heroLeft}>
            <span style={s.eyebrow}>AI DESIGN TOOL</span>
            <h2 style={s.heroTitle}>Turn briefs into screens</h2>
            <p style={s.heroSubtitle}>
              Upload a reference or write a brief. The AI generates a new screen
              strictly in the Cyan design language — glass cards, navy palette, Outfit
              typography.
            </p>
          </div>
          <div style={s.heroRight}>
            <div style={s.statCard}>
              <div style={s.statValue}>{history.length}</div>
              <div style={s.statLabel}>Designs generated</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statValue}>4</div>
              <div style={s.statLabel}>Design rules loaded</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statValue}>
                <span style={{ color: "var(--sv-positive)", fontSize: 12, fontWeight: 700 }}>LIVE</span>
              </div>
              <div style={s.statLabel}>Claude API</div>
            </div>
          </div>
        </div>

        {/* Main two-column layout — always visible */}
        <div style={s.contentGrid}>
          {/* LEFT: unified list panel */}
          <div style={s.listPanel}>

            {/* ── AI Generated ── */}
            <div style={s.listHeader}>
              <span style={s.eyebrow}>AI GENERATED</span>
              <span style={s.listCount}>{history.length} designs</span>
            </div>
            <div style={s.list}>
              {history.length === 0 ? (
                <div style={s.inlineEmpty}>
                  <p style={{ fontSize: 12, color: "var(--sv-text-muted)" }}>No AI designs yet.</p>
                  <button style={s.inlineEmptyBtn} onClick={() => navigate("/design-generator")}>
                    Generate first design
                  </button>
                </div>
              ) : history.map((entry) => {
                const isActive = preview?.kind === "generated" && preview.entry.id === entry.id;
                return (
                  <div
                    key={entry.id}
                    style={s.listItem(isActive)}
                    onClick={() => setPreview({ kind: "generated", entry })}
                  >
                    <div style={s.thumbnail}>
                      <div style={s.thumbnailGrid} />
                      <div style={s.thumbnailContent}>
                        <div style={{ width: "60%", height: 6, background: "rgba(0,193,235,0.3)", borderRadius: 3, marginBottom: 4 }} />
                        <div style={{ width: "80%", height: 4, background: "rgba(0,0,0,0.06)", borderRadius: 2, marginBottom: 3 }} />
                        <div style={{ width: "45%", height: 4, background: "rgba(0,0,0,0.04)", borderRadius: 2 }} />
                      </div>
                    </div>
                    <div style={s.listItemInfo}>
                      <p style={s.listItemBrief}>
                        {entry.brief.length > 80 ? entry.brief.slice(0, 80) + "…" : entry.brief}
                      </p>
                      <span style={s.listItemTime}>{formatRelativeTime(entry.createdAt)}</span>
                    </div>
                    <div style={s.listItemActions}>
                      {deleteConfirm === entry.id ? (
                        <>
                          <button style={{ ...s.actionBtn, color: "var(--sv-negative)", background: "rgba(198,82,82,0.08)" }}
                            onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}>Delete</button>
                          <button style={s.actionBtn}
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}>Cancel</button>
                        </>
                      ) : (
                        <button style={s.actionBtn}
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirm(entry.id); }}>×</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Reference Screens (game simulation) ── */}
            <div style={{ ...s.listHeader, marginTop: 2, borderTop: "2px solid var(--sv-border)" }}>
              <span style={s.eyebrow}>REFERENCE SCREENS</span>
              <span style={s.listCount}>{referenceScreens.length} screens</span>
            </div>
            {Object.entries(refByCategory).map(([category, screens]) => (
              <div key={category}>
                <div style={s.categoryLabel}>{category}</div>
                {screens.map((screen) => {
                  const isActive = preview?.kind === "reference" && preview.screen.path === screen.path;
                  return (
                    <div
                      key={screen.path}
                      style={s.listItem(isActive)}
                      onClick={() => setPreview({ kind: "reference", screen })}
                    >
                      <div style={{ ...s.thumbnail, background: "var(--sv-ink)" }}>
                        <div style={s.thumbnailGrid} />
                        <div style={s.thumbnailContent}>
                          <div style={{ width: "70%", height: 5, background: "rgba(0,193,235,0.4)", borderRadius: 3, marginBottom: 4 }} />
                          <div style={{ width: "50%", height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2 }} />
                        </div>
                      </div>
                      <div style={s.listItemInfo}>
                        <p style={s.listItemBrief}>{screen.label}</p>
                        <span style={{ ...s.listItemTime, color: "var(--sv-teal-mid)" }}>
                          {screen.category}
                        </span>
                      </div>
                      <div style={s.listItemActions}>
                        <button
                          style={{ ...s.actionBtn, color: "var(--sv-teal-mid)" }}
                          onClick={(e) => { e.stopPropagation(); navigate(screen.path); }}
                          title="Open full page"
                        >
                          ↗
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* RIGHT: preview pane */}
          <div style={s.previewPanel}>
            {!preview ? (
              <div style={s.previewEmpty}>
                <p style={{ fontSize: 13, color: "var(--sv-text-muted)" }}>Select a screen to preview</p>
              </div>
            ) : preview.kind === "generated" ? (
              <>
                <div style={s.previewHeader}>
                  <div>
                    <span style={s.eyebrow}>AI GENERATED</span>
                    <p style={s.previewBrief}>
                      {preview.entry.brief.length > 100 ? preview.entry.brief.slice(0, 100) + "…" : preview.entry.brief}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={s.toolBtn} onClick={() => navigator.clipboard.writeText(preview.entry.bodyHtml)}>Copy HTML</button>
                    <button style={s.toolBtn} onClick={() => { const w = window.open("", "_blank"); if (w) { w.document.write(preview.entry.html); w.document.close(); } }}>Full screen</button>
                    <button style={s.figmaBtn} onClick={() => {
                      sessionStorage.setItem("figma-preview-html", preview.entry.html);
                      window.open("/design-generator/preview", "_blank", "noopener");
                    }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 5 }}>
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17.586 3.586a2 2 0 112.828 2.828L12 14l-4 1 1-4 7.586-7.414z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Copy to Figma
                    </button>
                  </div>
                </div>
                <div style={s.iframeWrap}>
                  <iframe key={preview.entry.id} srcDoc={preview.entry.html} sandbox="allow-scripts" style={s.iframe} title="Design preview" />
                </div>
              </>
            ) : (
              <>
                <div style={s.previewHeader}>
                  <div>
                    <span style={s.eyebrow}>REFERENCE · {preview.screen.category.toUpperCase()}</span>
                    <p style={s.previewBrief}>{preview.screen.label}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={s.toolBtn} onClick={() => navigate(preview.screen.path)}>Open full page ↗</button>
                    <button style={s.figmaBtn} onClick={() => {
                      sessionStorage.setItem("figma-preview-url", preview.screen.path);
                      window.open("/design-generator/preview-ref?path=" + encodeURIComponent(preview.screen.path), "_blank", "noopener");
                    }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 5 }}>
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17.586 3.586a2 2 0 112.828 2.828L12 14l-4 1 1-4 7.586-7.414z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Copy to Figma
                    </button>
                  </div>
                </div>
                <div style={s.iframeWrap}>
                  <iframe
                    key={preview.screen.path}
                    src={preview.screen.path}
                    style={s.iframe}
                    title={preview.screen.label}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const s: Record<string, any> = {
  root: {
    minHeight: "100dvh",
    padding: "24px",
    paddingBottom: 96,
  },
  inner: {
    maxWidth: "var(--sv-max-page-width)",
    margin: "0 auto",
  },

  // Header
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logoMark: {
    width: 40,
    height: 40,
    background: "var(--sv-ink)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "var(--sv-text-muted)",
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: "var(--sv-foreground)",
    letterSpacing: "-0.4px",
    lineHeight: 1,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  navBtn: {
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "var(--sv-font-ui)",
    color: "var(--sv-text-secondary)",
    background: "rgba(255,255,255,0.6)",
    border: "1.4px solid white",
    borderRadius: "var(--sv-radius-pill)",
    padding: "8px 16px",
    cursor: "pointer",
  },
  primaryNavBtn: {
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "var(--sv-font-ui)",
    color: "white",
    background: "linear-gradient(135deg, var(--sv-teal), var(--sv-teal-dark))",
    border: "1px solid #0e3a3e",
    borderRadius: "var(--sv-radius-pill)",
    padding: "8px 18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },

  // Hero strip
  heroStrip: {
    background: "rgba(255,255,255,0.6)",
    border: "1.4px solid white",
    borderRadius: "var(--sv-radius-2xl)",
    padding: 24,
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 32,
    alignItems: "center",
    marginBottom: 20,
  },
  heroLeft: {},
  eyebrow: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "var(--sv-teal-mid)",
    background: "var(--sv-cyan-tint)",
    padding: "3px 8px",
    borderRadius: "var(--sv-radius-sm)",
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: "var(--sv-foreground)",
    letterSpacing: "-0.5px",
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "var(--sv-text-secondary)",
    lineHeight: 1.6,
    maxWidth: 480,
  },
  heroRight: {
    display: "flex",
    gap: 12,
  },
  statCard: {
    background: "var(--sv-muted)",
    border: "1px solid var(--sv-border)",
    borderRadius: 12,
    padding: "12px 16px",
    textAlign: "center" as const,
    minWidth: 80,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 700,
    color: "var(--sv-foreground)",
    fontVariantNumeric: "tabular-nums",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: "var(--sv-text-muted)",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },

  // Empty state
  emptyState: {
    position: "relative" as const,
    background: "rgba(255,255,255,0.6)",
    border: "1.4px solid white",
    borderRadius: "var(--sv-radius-2xl)",
    overflow: "hidden",
    minHeight: 400,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyGrid: {
    position: "absolute" as const,
    inset: 0,
    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 62px, rgba(35,35,35,0.04) 63px),
      repeating-linear-gradient(90deg, transparent, transparent 62px, rgba(35,35,35,0.04) 63px)`,
  },
  emptyContent: {
    position: "relative" as const,
    zIndex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 8,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    background: "rgba(255,255,255,0.9)",
    border: "1.4px solid var(--sv-border)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "var(--sv-foreground)",
  },
  emptyBody: {
    fontSize: 13,
    color: "var(--sv-text-muted)",
    marginBottom: 8,
  },
  emptyBtn: {
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "var(--sv-font-ui)",
    color: "white",
    background: "linear-gradient(135deg, var(--sv-teal), var(--sv-teal-dark))",
    border: "1px solid #0e3a3e",
    borderRadius: "var(--sv-radius-pill)",
    padding: "10px 20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },

  // Content grid
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: 16,
    alignItems: "start",
  },

  // List panel
  listPanel: {
    background: "rgba(255,255,255,0.6)",
    border: "1.4px solid white",
    borderRadius: "var(--sv-radius-2xl)",
    overflow: "hidden",
  },
  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid var(--sv-border)",
  },
  listCount: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--sv-text-muted)",
  },
  categoryLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "var(--sv-text-muted)",
    textTransform: "uppercase" as const,
    padding: "6px 16px 4px",
    background: "var(--sv-muted)",
  },
  inlineEmpty: {
    padding: "16px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
    alignItems: "flex-start",
  },
  inlineEmptyBtn: {
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "var(--sv-font-ui)",
    color: "var(--sv-teal-mid)",
    background: "var(--sv-cyan-tint)",
    border: "none",
    borderRadius: "var(--sv-radius-pill)",
    padding: "5px 12px",
    cursor: "pointer",
  },
  list: {
    display: "flex",
    flexDirection: "column" as const,
    maxHeight: 680,
    overflowY: "auto" as const,
  },
  listItem: (active: unknown) => ({
    display: "grid",
    gridTemplateColumns: "56px 1fr auto",
    gap: 10,
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid var(--sv-border)",
    cursor: "pointer",
    background: active ? "var(--sv-cyan-tint)" : "transparent",
    transition: "background 0.12s",
  }),
  thumbnail: {
    width: 56,
    height: 40,
    background: "var(--sv-muted)",
    borderRadius: 6,
    overflow: "hidden",
    position: "relative" as const,
    flexShrink: 0,
  },
  thumbnailGrid: {
    position: "absolute" as const,
    inset: 0,
    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 7px, rgba(35,35,35,0.05) 8px),
      repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(35,35,35,0.05) 8px)`,
  },
  thumbnailContent: {
    position: "absolute" as const,
    inset: 0,
    padding: 6,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
  },
  listItemInfo: {
    overflow: "hidden",
  },
  listItemBrief: {
    fontSize: 12,
    fontWeight: 500,
    color: "var(--sv-text)",
    lineHeight: 1.4,
    marginBottom: 3,
  },
  listItemTime: {
    fontSize: 10,
    color: "var(--sv-text-muted)",
    fontWeight: 600,
  },
  listItemActions: {
    display: "flex",
    gap: 4,
    flexShrink: 0,
  },
  actionBtn: {
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "var(--sv-font-ui)",
    color: "var(--sv-text-muted)",
    background: "transparent",
    border: "none",
    borderRadius: 4,
    padding: "3px 7px",
    cursor: "pointer",
  },

  // Preview panel
  previewPanel: {
    background: "rgba(255,255,255,0.6)",
    border: "1.4px solid white",
    borderRadius: "var(--sv-radius-2xl)",
    overflow: "hidden",
    position: "sticky" as const,
    top: 24,
  },
  previewEmpty: {
    height: 400,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  previewHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "14px 20px",
    borderBottom: "1px solid var(--sv-border)",
    gap: 16,
  },
  previewBrief: {
    fontSize: 12,
    color: "var(--sv-text-secondary)",
    lineHeight: 1.5,
    marginTop: 4,
    maxWidth: 380,
  },
  toolBtn: {
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "var(--sv-font-ui)",
    color: "var(--sv-teal-mid)",
    background: "var(--sv-cyan-tint)",
    border: "none",
    borderRadius: "var(--sv-radius-sm)",
    padding: "5px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  },
  figmaBtn: {
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "var(--sv-font-ui)",
    color: "white",
    background: "linear-gradient(135deg, var(--sv-teal), var(--sv-teal-dark))",
    border: "1px solid #0e3a3e",
    borderRadius: "var(--sv-radius-sm)",
    padding: "5px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    display: "flex",
    alignItems: "center",
  },
  iframeWrap: {
    height: 620,
    overflow: "hidden",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block",
  },
};

