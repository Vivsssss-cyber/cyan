"use client";

import { use } from "react";
import { getRouteComponent } from "../../lib/route-registry";
import { DemoProvider } from "../../context/DemoContext";
import { SimProvider } from "../../context/SimContext";

export default function CatchAllPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = use(params);
  const path = resolvedParams.slug?.length ? `/${resolvedParams.slug.join("/")}` : "/";
  const Screen = getRouteComponent(path);

  if (!Screen) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "Outfit, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "#606569" }}>Screen not found — <a href="/" style={{ color: "#00C1EB" }}>go home</a></p>
        </div>
      </main>
    );
  }

  if (path.startsWith("/demo")) {
    return (
      <DemoProvider>
        <Screen />
      </DemoProvider>
    );
  }

  if (path.startsWith("/sim")) {
    return (
      <SimProvider>
        <Screen />
      </SimProvider>
    );
  }

  return <Screen />;
}
