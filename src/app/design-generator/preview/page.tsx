"use client";

import { useEffect, useRef, useState } from "react";

export default function FigmaPreviewPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");

  useEffect(() => {
    const html = sessionStorage.getItem("figma-preview-html");
    if (!html) {
      setStatus("empty");
      return;
    }
    if (iframeRef.current) {
      iframeRef.current.srcdoc = html;
      setStatus("ready");
    }
  }, []);

  if (status === "empty") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#f0f4f4",
          fontFamily: "'Outfit', sans-serif",
          color: "#6b7280",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p style={{ fontSize: "15px", fontWeight: 500 }}>No preview available</p>
        <p style={{ fontSize: "13px" }}>Generate a design first, then click "Copy to Figma"</p>
      </div>
    );
  }

  return (
    <div style={{ width: "1280px", minHeight: "100vh", margin: "0 auto" }}>
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        style={{
          width: "1280px",
          height: "100vh",
          border: "none",
          display: "block",
        }}
        title="Design Preview"
      />
    </div>
  );
}
