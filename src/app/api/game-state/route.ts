import { NextResponse } from "next/server";
import {
  getDerivedMetrics,
  getInitialGameState,
  getReferenceData,
} from "../../../lib/game-state";

export function GET() {
  const state = getInitialGameState();

  return NextResponse.json({
    state,
    metrics: getDerivedMetrics(state),
    referenceData: getReferenceData(),
  });
}
