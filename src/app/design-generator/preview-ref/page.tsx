"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RefPreview() {
  const params = useSearchParams();
  const path = params.get("path");

  if (!path) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", fontFamily: "'Outfit', sans-serif", color: "#6b7280",
        flexDirection: "column", gap: "12px",
      }}>
        <p style={{ fontSize: "15px", fontWeight: 500 }}>No path provided</p>
      </div>
    );
  }

  return (
    <div style={{ width: "1280px", minHeight: "100vh", margin: "0 auto" }}>
      <iframe
        src={path}
        style={{ width: "1280px", height: "100vh", border: "none", display: "block" }}
        title="Reference Screen Preview"
      />
    </div>
  );
}

export default function RefPreviewPage() {
  return (
    <Suspense>
      <RefPreview />
    </Suspense>
  );
}
