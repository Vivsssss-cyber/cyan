"use client";

import React from "react";
import { GridBackground } from "./GridBackground";
import { PageTransition } from "./PageTransition";

const FI = "'Outfit', system-ui, -apple-system, sans-serif";

export function ProjectValleyPage() {
  return (
    <GridBackground>
      <PageTransition>
        <div
          style={{
            fontFamily: FI,
            minHeight: "100dvh",
            padding: "32px 24px 96px",
            maxWidth: 1312,
            margin: "0 auto",
          }}
        >
          {/* Page header */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#E0F7FF",
                color: "#006E85",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                borderRadius: 6,
                padding: "3px 10px",
                marginBottom: 10,
              }}
            >
              PROJECT MANAGEMENT
            </div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#002C33",
                letterSpacing: "-0.32px",
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Project Valley
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "#606569",
                marginTop: 6,
                fontWeight: 500,
              }}
            >
              Sprint-by-sprint software project simulation
            </p>
          </div>


        </div>
      </PageTransition>
    </GridBackground>
  );
}

