"use client";

import { useCallback, useRef, useState } from "react";
import { saveToHistory } from "../lib/design-history";
import { useAppNavigate } from "../lib/use-app-navigate";

type Phase = "idle" | "generating" | "preview";
type OutputMode = "html" | "jsx" | "both";

interface GenerationResult {
  html: string;
  bodyHtml: string;
  jsx: string | null;
}

const MAX_BRIEF_CHARS = 2000;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

const PHASE_LABELS: Record<string, string> = {
  uploading_file: "Uploading reference…",
  generating: "Applying design rules…",
};

// ─── Figma capture: save to sessionStorage and open clean preview ─────────
function openFigmaPreview(html: string) {
  sessionStorage.setItem("figma-preview-html", html);
  window.open("/design-generator/preview", "_blank", "noopener");
}

export function DesignGenerator() {
  const navigate = useAppNavigate();
  const [phase, setPhase] = useState<Phase>("idle");
  const [brief, setBrief] = useState("");
  const [outputMode, setOutputMode] = useState<OutputMode>("html");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [statusLabel, setStatusLabel] = useState("");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [codeTab, setCodeTab] = useState<"html" | "jsx">("html");
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [figmaCopied, setFigmaCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selected: File) => {
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Only PNG, JPG, and WEBP images are supported.");
      return;
    }
    if (selected.size > MAX_FILE_BYTES) {
      setError("File must be under 10MB.");
      return;
    }
    setError(null);
    setFile(selected);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFileSelect(dropped);
    },
    [handleFileSelect]
  );

  const handleGenerate = async () => {
    if (!brief.trim()) { setError("Please enter a design brief."); return; }
    setError(null);
    setPhase("generating");
    setStatusLabel("Reading brief…");
    setResult(null);

    const formData = new FormData();
    formData.append("brief", brief);
    if (file) formData.append("file", file);

    try {
      const response = await fetch("/api/design-generator", { method: "POST", body: formData });
      if (!response.ok || !response.body) throw new Error("Request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        let currentEvent = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) currentEvent = line.slice(7).trim();
          else if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            if (currentEvent === "status") setStatusLabel(PHASE_LABELS[data.phase] ?? "Generating…");
            else if (currentEvent === "done") {
              const res = { html: data.html, bodyHtml: data.bodyHtml, jsx: data.jsx };
              setResult(res);
              setPhase("preview");
              saveToHistory({ brief, html: data.html, bodyHtml: data.bodyHtml });
            } else if (currentEvent === "error") throw new Error(data.message);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("idle");
    }
  };

  const handleCopyHtml = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.bodyHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleFigma = () => {
    if (!result) return;
    openFigmaPreview(result.html);
    setFigmaCopied(true);
    setTimeout(() => setFigmaCopied(false), 2000);
  };

  const isPreview = phase === "preview" && result;

  return (
    <div style={$.root}>
      <div style={$.inner}>

        {/* ── Page header ── */}
        <div style={$.pageHeader}>
          <div style={$.pageHeaderLeft}>
            <div style={$.logoMark}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sv-cyan)" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div style={$.logoLabel}>CYAN DESIGN</div>
              <h1 style={$.pageTitle}>Design Generator</h1>
            </div>
          </div>
          <div style={$.pageHeaderRight}>
            <button style={$.navBtn} onClick={() => navigate("/")}>← All Designs</button>
            <div style={$.statusPill(phase)}>
              <div style={$.statusDot(phase)} />
              {phase === "idle" && "Ready"}
              {phase === "generating" && "Generating…"}
              {phase === "preview" && "Preview ready"}
            </div>
          </div>
        </div>

        {/* ── Main two-column layout ── */}
        <div style={$.layout}>

          {/* ════ LEFT PANEL ════ */}
          <div style={$.leftPanel}>

            {/* Brief */}
            <section style={$.card}>
              <div style={$.sectionLabel}>
                <span style={$.eyebrow}>BRIEF</span>
              </div>
              <label style={$.fieldLabel}>Design Brief</label>
              <p style={$.fieldHint}>
                Describe the screen, its data, purpose, and any layout direction. The AI
                reinterprets structure through the Cyan design language — not a copy.
              </p>
              <textarea
                style={$.textarea(phase === "generating")}
                placeholder="e.g. A monthly command-center showing revenue, burn rate, team headcount, and cash runway. B2B SaaS, 8-person startup. Show a danger state if runway is under 3 months."
                value={brief}
                onChange={(e) => setBrief(e.target.value.slice(0, MAX_BRIEF_CHARS))}
                disabled={phase === "generating"}
              />
              <div style={$.charRow}>
                <span style={{ color: brief.length > 1800 ? "var(--sv-negative)" : "var(--sv-text-muted)", fontSize: 11 }}>
                  {brief.length} / {MAX_BRIEF_CHARS}
                </span>
              </div>
            </section>

            {/* Upload */}
            <section style={$.card}>
              <div style={$.sectionLabel}>
                <span style={$.eyebrow}>REFERENCE</span>
                <span style={$.optionalPill}>optional</span>
              </div>
              <label style={$.fieldLabel}>Image Upload</label>
              <p style={$.fieldHint}>
                Upload a screenshot, sketch, or wireframe. Extracts structure and
                intent only — visual style is always reinterpreted.
              </p>

              {!file ? (
                <div
                  style={$.dropZone(isDragging)}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div style={$.uploadIconWrap}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sv-teal-mid)" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--sv-text-secondary)", marginTop: 8, marginBottom: 6 }}>
                    Drop image here or click to browse
                  </p>
                  <div style={$.fileTypePills}>
                    {["PNG", "JPG", "WEBP"].map(t => (
                      <span key={t} style={$.fileTypePill}>{t}</span>
                    ))}
                    <span style={{ ...$.fileTypePill, color: "var(--sv-text-muted)", background: "var(--sv-muted)" }}>max 10MB</span>
                  </div>
                </div>
              ) : (
                <div style={$.fileChip}>
                  <div style={$.fileChipIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sv-cyan)" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--sv-text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {file.name}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--sv-text-muted)" }}>
                    {(file.size / 1024).toFixed(0)}KB
                  </span>
                  <button style={$.removeBtn} onClick={() => setFile(null)} disabled={phase === "generating"}>×</button>
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
            </section>

            {/* Output mode */}
            <section style={$.card}>
              <div style={$.sectionLabel}>
                <span style={$.eyebrow}>OUTPUT</span>
              </div>
              <label style={$.fieldLabel}>Output Mode</label>
              <div style={$.modeGroup}>
                {(["html", "jsx", "both"] as OutputMode[]).map(mode => (
                  <button
                    key={mode}
                    style={$.modeBtn(outputMode === mode)}
                    onClick={() => setOutputMode(mode)}
                    disabled={phase === "generating"}
                  >
                    {mode === "html" && "HTML Preview"}
                    {mode === "jsx" && "React JSX"}
                    {mode === "both" && "Both"}
                  </button>
                ))}
              </div>
              {outputMode !== "html" && (
                <p style={{ fontSize: 11, color: "var(--sv-warning)", marginTop: 8 }}>
                  JSX output is planned. HTML preview active for now.
                </p>
              )}
            </section>

            {/* Constraints notice */}
            <section style={$.constraintsCard}>
              <div style={$.constraintsRow}>
                <div style={$.constraintItem}>
                  <span style={$.constraintLabel}>Viewport</span>
                  <span style={$.constraintValue}>1280px</span>
                </div>
                <div style={$.constraintDivider} />
                <div style={$.constraintItem}>
                  <span style={$.constraintLabel}>Output</span>
                  <span style={$.constraintValue}>HTML + tokens</span>
                </div>
                <div style={$.constraintDivider} />
                <div style={$.constraintItem}>
                  <span style={$.constraintLabel}>Figma-ready</span>
                  <span style={{ ...$.constraintValue, color: "var(--sv-positive)" }}>Yes</span>
                </div>
                <div style={$.constraintDivider} />
                <div style={$.constraintItem}>
                  <span style={$.constraintLabel}>Design rules</span>
                  <span style={$.constraintValue}>4 files loaded</span>
                </div>
              </div>
            </section>

            {/* Error */}
            {error && (
              <div style={$.errorBanner}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sv-negative)" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span style={{ fontSize: 12, color: "var(--sv-negative)" }}>{error}</span>
              </div>
            )}

            {/* Generate */}
            <button style={$.generateBtn(phase === "generating", !brief.trim())} onClick={handleGenerate}
              disabled={phase === "generating" || !brief.trim()}>
              {phase === "generating" ? (
                <>
                  <span style={$.pulse} />
                  {statusLabel || "Generating…"}
                </>
              ) : (
                <>
                  Generate Design
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 8 }}>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

          </div>{/* end left */}

          {/* ════ RIGHT PANEL ════ */}
          <div style={$.rightPanel}>

            {/* Preview card */}
            <div style={$.previewCard}>

              {/* Toolbar */}
              <div style={$.toolbar}>
                <div style={$.toolbarLeft}>
                  <span style={$.eyebrow}>PREVIEW</span>
                  {isPreview && <span style={$.readyBadge}>Design ready</span>}
                  {phase === "generating" && <span style={$.generatingBadge}>Generating…</span>}
                </div>

                {isPreview && (
                  <div style={$.toolbarActions}>
                    {/* Regenerate */}
                    <button style={$.tbBtn} onClick={() => { setPhase("idle"); setResult(null); }} title="Start over">
                      Regenerate
                    </button>

                    {/* Copy HTML */}
                    <button style={$.tbBtn} onClick={handleCopyHtml} title="Copy raw HTML body">
                      {copiedHtml ? "Copied!" : "Copy HTML"}
                    </button>

                    {/* Copy to Figma — primary action */}
                    <button style={$.figmaBtn} onClick={handleFigma}
                      title="Opens a clean 1280px browser preview for Claude Code / Figma capture">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 5 }}>
                        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      {figmaCopied ? "Opened!" : "Copy to Figma"}
                    </button>

                    {/* Full screen */}
                    <button style={$.tbBtn} onClick={() => { const w = window.open("", "_blank"); if (w && result) { w.document.write(result.html); w.document.close(); } }}
                      title="Open raw output in new tab">
                      Full screen
                    </button>

                    {/* JSX — soon */}
                    <button style={$.tbBtnDisabled} disabled title="React JSX output — coming soon">
                      Copy JSX
                      <span style={$.soonPill}>Soon</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Figma hint strip — shows when preview is ready */}
              {isPreview && (
                <div style={$.figmaHint}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--sv-teal-mid)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>
                    <strong>Copy to Figma</strong> opens a clean 1280px capture view —
                    use Claude Code / Figma&apos;s Code to Canvas to import it as editable frames.
                  </span>
                </div>
              )}

              {/* Preview area */}
              <div style={$.previewArea}>
                {phase === "idle" && (
                  <div style={$.emptyState}>
                    <div style={$.emptyBg} />
                    <div style={$.emptyBody}>
                      <div style={$.emptyIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--sv-teal-mid)" strokeWidth="1.2">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18M9 21V9" />
                        </svg>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--sv-text-secondary)", marginTop: 10 }}>
                        Your design will appear here
                      </p>
                      <p style={{ fontSize: 12, color: "var(--sv-text-muted)", marginTop: 4 }}>
                        Enter a brief and click Generate
                      </p>
                    </div>
                  </div>
                )}

                {phase === "generating" && (
                  <div style={$.generatingState}>
                    <div style={$.progressTrack}>
                      <div style={$.progressBar} />
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--sv-teal-mid)", marginTop: 14 }}>
                      {statusLabel}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--sv-text-muted)", marginTop: 4 }}>
                      Injecting design rules · 1280px canvas
                    </p>
                  </div>
                )}

                {isPreview && (
                  <iframe
                    srcDoc={result.html}
                    sandbox="allow-scripts"
                    style={$.iframe}
                    title="Generated design preview"
                  />
                )}
              </div>
            </div>

            {/* Code panel — only when preview ready */}
            {isPreview && (
              <div style={$.codeCard}>
                <div style={$.codeHeader}>
                  <div style={$.codeTabs}>
                    <button style={$.codeTab(codeTab === "html")} onClick={() => setCodeTab("html")}>HTML</button>
                    <button style={{ ...$.codeTab(false), opacity: 0.4, cursor: "not-allowed" }} disabled title="JSX coming soon">
                      JSX <span style={$.soonPill}>Soon</span>
                    </button>
                  </div>
                  <button style={$.copyCodeBtn} onClick={handleCopyHtml}>
                    {copiedHtml ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre style={$.codePre}>
                  <code style={{ fontSize: 11, color: "var(--sv-text-secondary)", fontFamily: "var(--sv-font-mono)" }}>
                    {result.bodyHtml}
                  </code>
                </pre>
              </div>
            )}

          </div>{/* end right */}
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
// All values from design-rules/DESIGN.md + tokens.css
// No hardcoded hex — only var(--sv-*) tokens or rgba wrappers

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const $: Record<string, any> = {

  root: {
    minHeight: "100dvh",
    padding: "24px 24px 96px",
    background: "var(--sv-background)",
    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent calc(var(--sv-grid-size) - 1px), rgba(35,35,35,0.03) var(--sv-grid-size)),
      repeating-linear-gradient(90deg, transparent, transparent calc(var(--sv-grid-size) - 1px), rgba(35,35,35,0.03) var(--sv-grid-size))`,
  },

  inner: {
    maxWidth: "var(--sv-max-page-width)",
    margin: "0 auto",
  },

  // ── Page header ──
  pageHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  pageHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  pageHeaderRight: {
    paddingTop: 2,
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
  logoMark: {
    width: 40,
    height: 40,
    background: "var(--sv-ink)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "var(--sv-text-muted)",
    marginBottom: 2,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "var(--sv-foreground)",
    letterSpacing: "-0.4px",
    lineHeight: 1,
  },

  statusPill: (phase: Phase) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    fontWeight: 600,
    padding: "5px 12px",
    borderRadius: "var(--sv-radius-pill)",
    border: "1px solid",
    background: phase === "preview" ? "rgba(21,97,98,0.08)"
      : phase === "generating" ? "var(--sv-cyan-tint)"
      : "rgba(255,255,255,0.7)",
    color: phase === "preview" ? "var(--sv-positive)"
      : phase === "generating" ? "var(--sv-teal-mid)"
      : "var(--sv-text-muted)",
    borderColor: phase === "preview" ? "rgba(21,97,98,0.18)"
      : "var(--sv-border)",
  }),
  statusDot: (phase: Phase) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: phase === "preview" ? "var(--sv-positive)"
      : phase === "generating" ? "var(--sv-cyan)"
      : "var(--sv-border)",
    animation: phase === "generating" ? "pulse 1s infinite" : "none",
  }),

  // ── Layout ──
  layout: {
    display: "grid",
    gridTemplateColumns: "380px minmax(0, 1fr)",
    gap: 20,
    alignItems: "start",
  },
  leftPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  rightPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    position: "sticky",
    top: 24,
  },

  // ── Cards ──
  card: {
    background: "rgba(255,255,255,0.6)",
    border: "1.4px solid white",
    borderRadius: "var(--sv-radius-2xl)",
    padding: 20,
  },
  constraintsCard: {
    background: "rgba(255,255,255,0.6)",
    border: "1.4px solid white",
    borderRadius: "var(--sv-radius-2xl)",
    padding: "14px 20px",
  },
  constraintsRow: {
    display: "flex",
    alignItems: "center",
    gap: 0,
  },
  constraintItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    alignItems: "center",
  },
  constraintLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--sv-text-muted)",
    textTransform: "uppercase",
  },
  constraintValue: {
    fontSize: 12,
    fontWeight: 700,
    color: "var(--sv-foreground)",
    fontVariantNumeric: "tabular-nums",
  },
  constraintDivider: {
    width: 1,
    height: 28,
    background: "var(--sv-border)",
    flexShrink: 0,
  },

  // ── Section labels ──
  sectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  eyebrow: {
    display: "inline-block",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "var(--sv-teal-mid)",
    background: "var(--sv-cyan-tint)",
    padding: "2px 7px",
    borderRadius: "var(--sv-radius-sm)",
  },
  optionalPill: {
    fontSize: 9,
    fontWeight: 600,
    color: "var(--sv-text-muted)",
    background: "var(--sv-muted)",
    padding: "2px 6px",
    borderRadius: "var(--sv-radius-pill)",
  },

  // ── Fields ──
  fieldLabel: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--sv-foreground)",
    marginBottom: 4,
  },
  fieldHint: {
    fontSize: 11,
    color: "var(--sv-text-muted)",
    lineHeight: 1.5,
    marginBottom: 10,
  },
  textarea: (disabled: boolean) => ({
    width: "100%",
    minHeight: 148,
    resize: "vertical",
    background: "var(--sv-muted)",
    border: "1px solid var(--sv-border)",
    borderRadius: "var(--sv-radius-md)",
    padding: "10px 12px",
    fontSize: 13,
    fontFamily: "var(--sv-font-ui)",
    color: "var(--sv-text)",
    outline: "none",
    lineHeight: 1.6,
    opacity: disabled ? 0.6 : 1,
  }),
  charRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 5,
  },

  // ── Drop zone ──
  dropZone: (active: boolean) => ({
    border: `1.5px dashed ${active ? "var(--sv-cyan)" : "var(--sv-border)"}`,
    borderRadius: "var(--sv-radius-lg)",
    padding: "20px 16px",
    textAlign: "center",
    cursor: "pointer",
    background: active ? "var(--sv-cyan-tint)" : "transparent",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }),
  uploadIconWrap: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "var(--sv-cyan-tint)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fileTypePills: {
    display: "flex",
    gap: 5,
    justifyContent: "center",
  },
  fileTypePill: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--sv-teal-mid)",
    background: "var(--sv-cyan-tint)",
    padding: "2px 6px",
    borderRadius: "var(--sv-radius-pill)",
  },
  fileChip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "var(--sv-muted)",
    border: "1px solid var(--sv-border)",
    borderRadius: "var(--sv-radius-md)",
    padding: "8px 12px",
  },
  fileChipIcon: {
    width: 28,
    height: 28,
    background: "var(--sv-cyan-tint)",
    borderRadius: "var(--sv-radius-sm)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  removeBtn: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    border: "1px solid var(--sv-border)",
    background: "white",
    color: "var(--sv-text-muted)",
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  // ── Output mode ──
  modeGroup: {
    display: "flex",
    gap: 6,
  },
  modeBtn: (active: boolean) => ({
    flex: 1,
    padding: "7px 0",
    borderRadius: "var(--sv-radius-pill)",
    border: active ? "1px solid var(--sv-teal-dark)" : "1px solid var(--sv-border)",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "var(--sv-font-ui)",
    cursor: "pointer",
    background: active ? "var(--sv-gradient-strategic)" : "rgba(255,255,255,0.6)",
    color: active ? "white" : "var(--sv-text-secondary)",
    boxShadow: active ? "inset 0 0 6px rgba(20,20,20,0.2)" : "none",
  }),

  // ── Error ──
  errorBanner: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    background: "rgba(198,82,82,0.07)",
    border: "1px solid rgba(198,82,82,0.2)",
    borderRadius: "var(--sv-radius-md)",
    padding: "10px 14px",
  },

  // ── Generate button ──
  generateBtn: (loading: boolean, disabled: boolean) => ({
    width: "100%",
    padding: "13px 24px",
    borderRadius: "var(--sv-radius-pill)",
    border: `1px solid var(--sv-teal-dark)`,
    background: loading || disabled
      ? "rgba(0,60,73,0.35)"
      : "var(--sv-gradient-strategic)",
    color: "white",
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "var(--sv-font-ui)",
    cursor: loading || disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: loading || disabled ? "none" : "inset 0 0 8px 1px rgba(20,20,20,0.3), var(--sv-shadow-3)",
    letterSpacing: "0.02em",
  }),
  pulse: {
    display: "inline-block",
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.7)",
    marginRight: 9,
    animation: "pulse 1s infinite",
  },

  // ── Preview card ──
  previewCard: {
    background: "rgba(255,255,255,0.6)",
    border: "1.4px solid white",
    borderRadius: "var(--sv-radius-2xl)",
    overflow: "hidden",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid var(--sv-border)",
    gap: 12,
    flexWrap: "wrap",
  },
  toolbarLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  toolbarActions: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  readyBadge: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "var(--sv-positive)",
    background: "rgba(21,97,98,0.08)",
    padding: "2px 7px",
    borderRadius: "var(--sv-radius-pill)",
    border: "1px solid rgba(21,97,98,0.15)",
  },
  generatingBadge: {
    fontSize: 9,
    fontWeight: 700,
    color: "var(--sv-teal-mid)",
    background: "var(--sv-cyan-tint)",
    padding: "2px 7px",
    borderRadius: "var(--sv-radius-pill)",
    border: "1px solid var(--sv-border)",
  },

  // toolbar buttons
  tbBtn: {
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "var(--sv-font-ui)",
    color: "var(--sv-teal-mid)",
    background: "var(--sv-cyan-tint)",
    border: "1px solid var(--sv-border)",
    borderRadius: "var(--sv-radius-pill)",
    padding: "5px 13px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  figmaBtn: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "var(--sv-font-ui)",
    color: "white",
    background: "var(--sv-gradient-strategic)",
    border: "1px solid var(--sv-teal-dark)",
    borderRadius: "var(--sv-radius-pill)",
    padding: "5px 14px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "inset 0 0 6px rgba(20,20,20,0.25)",
    letterSpacing: "0.02em",
  },
  tbBtnDisabled: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "var(--sv-font-ui)",
    color: "var(--sv-text-muted)",
    background: "var(--sv-muted)",
    border: "1px solid var(--sv-border)",
    borderRadius: "var(--sv-radius-pill)",
    padding: "5px 13px",
    cursor: "not-allowed",
    whiteSpace: "nowrap",
    opacity: 0.6,
  },
  soonPill: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--sv-text-muted)",
    background: "var(--sv-border)",
    padding: "1px 5px",
    borderRadius: "var(--sv-radius-pill)",
  },

  // Figma hint
  figmaHint: {
    display: "flex",
    alignItems: "flex-start",
    gap: 7,
    padding: "8px 16px",
    background: "var(--sv-cyan-tint)",
    borderBottom: "1px solid var(--sv-border)",
    fontSize: 11,
    color: "var(--sv-teal-mid)",
    lineHeight: 1.5,
  },

  // Preview area
  previewArea: {
    height: 520,
    position: "relative",
    overflow: "hidden",
    background: "var(--sv-background)",
    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent calc(var(--sv-grid-size) - 1px), rgba(35,35,35,0.03) var(--sv-grid-size)),
      repeating-linear-gradient(90deg, transparent, transparent calc(var(--sv-grid-size) - 1px), rgba(35,35,35,0.03) var(--sv-grid-size))`,
  },
  emptyState: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  emptyBg: {
    position: "absolute",
    inset: 0,
    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 62px, rgba(35,35,35,0.04) 63px),
      repeating-linear-gradient(90deg, transparent, transparent 62px, rgba(35,35,35,0.04) 63px)`,
  },
  emptyBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.8)",
    border: "1.4px solid var(--sv-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  generatingState: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    width: 200,
    height: 2,
    background: "var(--sv-border)",
    borderRadius: 1,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    width: "55%",
    background: "var(--sv-cyan)",
    borderRadius: 1,
    animation: "progressSlide 1.8s ease-in-out infinite",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block",
  },

  // Code panel
  codeCard: {
    background: "rgba(255,255,255,0.6)",
    border: "1.4px solid white",
    borderRadius: "var(--sv-radius-2xl)",
    overflow: "hidden",
  },
  codeHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderBottom: "1px solid var(--sv-border)",
  },
  codeTabs: {
    display: "flex",
    gap: 3,
    background: "var(--sv-muted)",
    borderRadius: "var(--sv-radius-sm)",
    padding: 3,
  },
  codeTab: (active: boolean) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 10,
    fontWeight: 700,
    fontFamily: "var(--sv-font-ui)",
    padding: "3px 9px",
    borderRadius: 3,
    border: "none",
    cursor: active ? "pointer" : "default",
    background: active ? "white" : "transparent",
    color: active ? "var(--sv-teal-mid)" : "var(--sv-text-muted)",
    boxShadow: active ? "var(--sv-shadow-1)" : "none",
  }),
  copyCodeBtn: {
    fontSize: 10,
    fontWeight: 700,
    fontFamily: "var(--sv-font-ui)",
    color: "var(--sv-teal-mid)",
    background: "var(--sv-cyan-tint)",
    border: "none",
    borderRadius: "var(--sv-radius-sm)",
    padding: "3px 10px",
    cursor: "pointer",
    letterSpacing: "0.04em",
  },
  codePre: {
    overflow: "auto",
    maxHeight: 240,
    padding: "14px 16px",
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    background: "transparent",
  },
};

