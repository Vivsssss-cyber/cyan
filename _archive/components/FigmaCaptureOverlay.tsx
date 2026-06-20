"use client";

import { useEffect, useRef, useState } from "react";

const CAPTURE_SCRIPT_SRC = "https://mcp.figma.com/mcp/html-to-design/capture.js";
const ROOT_SELECTOR = '[data-figma-capture-root="true"]';
const IFRAME_SELECTOR = '[data-figma-capture-frame="true"]';
const IFRAME_CAPTURE_SELECTOR = "#root";
const SCRIPT_TIMEOUT_MS = 4000;
const CAPTURE_TIMEOUT_MS = 12000;
const TARGET_RETRY_COUNT = 8;
const TARGET_RETRY_DELAY_MS = 500;

type CaptureFn = (options: { element?: HTMLElement; selector?: string }) => Promise<unknown>;

declare global {
  interface Window {
    __startupValleyFigmaBridge?: {
      copyToFigma: () => Promise<unknown>;
    };
    figma?: {
      captureForDesign?: CaptureFn;
    };
  }
}

function hasAutoCaptureFlag() {
  if (typeof window === "undefined") {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  return params.has("figmacapture") || window.location.hash.includes("figmacapture");
}

function hasIframeCaptureTarget() {
  if (typeof document === "undefined") {
    return false;
  }

  return Boolean(document.querySelector(IFRAME_SELECTOR));
}

function getIframeElement() {
  return document.querySelector<HTMLIFrameElement>(IFRAME_SELECTOR);
}

function getDirectCaptureUrl() {
  const iframeElement = getIframeElement();

  if (iframeElement?.src) {
    const url = new URL(iframeElement.src, window.location.href);
    url.searchParams.set("figmacapture", "1");
    return url;
  }

  const url = new URL(window.location.href);
  url.searchParams.set("figmacapture", "1");
  return url;
}

async function ensureCaptureScript(doc: Document, scopeWindow: Window): Promise<CaptureFn | null> {
  if (scopeWindow.figma?.captureForDesign) {
    return scopeWindow.figma.captureForDesign;
  }

  const existing = doc.querySelector<HTMLScriptElement>(`script[src="${CAPTURE_SCRIPT_SRC}"]`);

  await new Promise<void>((resolve, reject) => {
    if (scopeWindow.figma?.captureForDesign) {
      resolve();
      return;
    }

    const script = existing ?? doc.createElement("script");
    let settled = false;
    const cleanup = () => {
      script.onload = null;
      script.onerror = null;
      window.clearTimeout(timeoutId);
    };
    const finish = (callback: () => void) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      callback();
    };

    script.src = CAPTURE_SCRIPT_SRC;
    script.async = true;
    script.onload = () => finish(resolve);
    script.onerror = () => finish(() => reject(new Error("Failed to load Figma capture script.")));

    const timeoutId = window.setTimeout(() => {
      finish(() => reject(new Error("Timed out loading Figma capture script.")));
    }, SCRIPT_TIMEOUT_MS);

    if (!existing) {
      (doc.head ?? doc.body ?? doc.documentElement).appendChild(script);
    }
  });

  return scopeWindow.figma?.captureForDesign ?? null;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function waitForIframeRenderedRoot(doc: Document) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const root = doc.getElementById("root");
    if (root && root.children.length > 0) {
      await wait(900);
      return;
    }
    await wait(150);
  }

  await wait(900);
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error(message));
    }, ms);

    promise.then(
      (value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      },
    );
  });
}

async function resolveCaptureTargetOnce() {
  const iframeElement = getIframeElement();

  if (iframeElement?.contentDocument?.body && iframeElement.contentWindow) {
    const bridge = (iframeElement.contentWindow as Window).__startupValleyFigmaBridge;
    if (bridge?.copyToFigma) {
      return {
        runCapture: () => bridge.copyToFigma(),
      };
    }

    const iframeWindow = iframeElement.contentWindow as Window;
    const iframeDocument = iframeElement.contentDocument;

    return {
      runCapture: async () => {
        const captureForDesign = await ensureCaptureScript(iframeDocument, iframeWindow);
        if (!captureForDesign) {
          throw new Error("Figma capture API unavailable inside iframe.");
        }

        await waitForIframeRenderedRoot(iframeDocument);
        return captureForDesign({
          selector: IFRAME_CAPTURE_SELECTOR,
        });
      },
    };
  }

  const rootElement = document.querySelector<HTMLElement>(ROOT_SELECTOR);
  const captureForDesign = await ensureCaptureScript(document, window);

  if (!rootElement || !captureForDesign) {
    return null;
  }

  return {
    runCapture: () =>
      captureForDesign({
        selector: ROOT_SELECTOR,
      }),
  };
}

async function resolveCaptureTarget() {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < TARGET_RETRY_COUNT; attempt += 1) {
    try {
      const target = await resolveCaptureTargetOnce();
      if (target) {
        return target;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Figma capture failed.");
    }

    if (attempt < TARGET_RETRY_COUNT - 1) {
      await wait(TARGET_RETRY_DELAY_MS);
    }
  }

  if (lastError) {
    throw lastError;
  }

  return null;
}

export function FigmaCaptureOverlay() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("Loading Figma capture...");
  const autoCaptureAttemptedRef = useRef(false);
  const captureInFlightRef = useRef(false);
  const [reloadKey, setReloadKey] = useState(0);

  const runCapture = async () => {
    if (captureInFlightRef.current) {
      throw new Error("A Figma capture is already in progress.");
    }

    captureInFlightRef.current = true;

    try {
      const target = await resolveCaptureTarget();
      if (!target) {
        throw new Error("Figma capture target not ready.");
      }

      await withTimeout(
        target.runCapture(),
        CAPTURE_TIMEOUT_MS,
        "Figma capture timed out. Use Copy Direct URL instead.",
      );
    } finally {
      captureInFlightRef.current = false;
    }
  };

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setMessage("Loading Figma capture...");

    const prepareCapture = async () => {
      try {
        const target = await resolveCaptureTarget();
        if (cancelled) {
          return;
        }
        if (!target) {
          setStatus("error");
          setMessage("Figma capture target not ready.");
          return;
        }

        setStatus("ready");
        setMessage("Copy or direct-capture this screen into Figma.");

        if (hasAutoCaptureFlag() && !autoCaptureAttemptedRef.current) {
          autoCaptureAttemptedRef.current = true;
          await withTimeout(
            target.runCapture(),
            CAPTURE_TIMEOUT_MS,
            "Figma direct capture timed out.",
          );
          if (!cancelled) {
            setMessage("Direct capture sent to Figma.");
          }
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setMessage(error instanceof Error ? error.message : "Figma capture failed.");
        }
      }
    };

    const timeoutId = window.setTimeout(prepareCapture, 600);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [reloadKey]);

  const handleCopy = async () => {
    try {
      setMessage("Preparing capture...");
      setStatus("ready");
      await runCapture();
      setMessage("Copied for Figma. Paste with Ctrl+V.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Figma capture failed.");
    }
  };

  const handleCopyDirectUrl = async () => {
    await navigator.clipboard.writeText(getDirectCaptureUrl().toString());
    setMessage("Direct-capture URL copied.");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: 280,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(6, 19, 28, 0.92)",
        boxShadow: "0 18px 50px rgba(0, 0, 0, 0.28)",
        backdropFilter: "blur(14px)",
        color: "#E6F7FB",
        padding: 12,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Figma Export
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.45, color: "#9BC7D6" }}>{message}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleCopy}
          disabled={status === "loading" || captureInFlightRef.current}
          style={{
            flex: 1,
            border: 0,
            borderRadius: 10,
            padding: "10px 12px",
            background: status === "loading" || captureInFlightRef.current ? "#49626E" : "#00C1EB",
            color: "#042833",
            fontSize: 13,
            fontWeight: 700,
            cursor: status === "loading" || captureInFlightRef.current ? "wait" : "pointer",
          }}
        >
          {status === "loading"
            ? "Loading..."
            : captureInFlightRef.current
              ? "Capturing..."
              : "Copy Screen"}
        </button>
        <button
          onClick={handleCopyDirectUrl}
          style={{
            flex: 1,
            borderRadius: 10,
            padding: "10px 12px",
            border: "1px solid rgba(155, 199, 214, 0.24)",
            background: "transparent",
            color: "#E6F7FB",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Copy Direct URL
        </button>
      </div>
      {status === "error" ? (
        <button
          onClick={() => setReloadKey((value) => value + 1)}
          style={{
            borderRadius: 10,
            padding: "9px 12px",
            border: "1px solid rgba(155, 199, 214, 0.24)",
            background: "rgba(255,255,255,0.04)",
            color: "#E6F7FB",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Retry Figma Hook
        </button>
      ) : null}
    </div>
  );
}
