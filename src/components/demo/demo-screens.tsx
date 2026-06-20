'use client';

/* Zero-prop route wrappers for the /demo flow.
 * The catch-all page renders registry components without props, so each demo
 * route gets a wrapper that pulls sim state from DemoContext and injects it
 * into the reused reference screens. */

import React from 'react';
import { DemoShell } from './DemoShell';
import { useDemo } from '../../context/DemoContext';
import { PRODUCT_CATALOG } from '../../lib/demo/sim-engine';
import {
  toMonthReviewData,
  toOpeningReportData,
  toCommandCenterMonthly,
  toQuarterlyReportData,
  toAnnualProductStats,
  toFinalEvaluationOutcome,
  toLeaderboardCohort,
} from '../../lib/demo/adapters';
import { provisionalValuation } from '../../lib/demo/sim-engine';
import { quarterOf } from '../../lib/demo/demo-flow';
import { LOCATIONS, SPACE_OPTIONS } from '../../lib/game-state';
import { TrainingIntro } from '../TrainingIntro';
import { WelcomeCarousel } from '../WelcomeCarousel';
import {
  BasicInfoSetup, LocationSetupNew, CapacitySetupNew, EmployeeSetup,
  MarketingSetup, PaymentSetup, SetupSummaryNew, SetupLoading,
} from '../setup/screens';
import { MonthlyDecisions } from '../MonthlyDecisions';
import { MonthReview } from '../MonthReview';
import { CommandCenter } from '../CommandCenter';
import { QuarterlyReport } from '../QuarterlyReport';
import { AnnualOverview } from '../AnnualOverview';
import { FinalEvaluation } from '../FinalEvaluation';
import { Leaderboard } from '../Leaderboard';
import { QuarterlyDecisions } from '../QuarterlyDecisions';
import { AnnualDecisions } from '../AnnualDecisions';

export function DemoTraining() {
  return <DemoShell><TrainingIntro /></DemoShell>;
}

export function DemoWelcome() {
  return <DemoShell><WelcomeCarousel /></DemoShell>;
}

export function DemoBasicSetup() {
  return <DemoShell><BasicInfoSetup /></DemoShell>;
}

export function DemoLocationSetup() {
  return <DemoShell><LocationSetupNew /></DemoShell>;
}

export function DemoCapacitySetup() {
  return <DemoShell><CapacitySetupNew /></DemoShell>;
}

export function DemoEmployeeSetup() {
  return <DemoShell><EmployeeSetup /></DemoShell>;
}

export function DemoMarketingSetup() {
  return <DemoShell><MarketingSetup /></DemoShell>;
}

export function DemoPaymentSetup() {
  return <DemoShell><PaymentSetup /></DemoShell>;
}

export function DemoSetupSummary() {
  return <DemoShell><SetupSummaryNew /></DemoShell>;
}

export function DemoSetupLoading() {
  return <DemoShell><SetupLoading /></DemoShell>;
}

export function DemoMonthlyDecisions() {
  const { state, dispatch } = useDemo();
  const catalog = PRODUCT_CATALOG.filter((p) => state.activeProducts.includes(p.id));
  // Report tab: prior month's results once a month has traded, else the opening
  // position derived from onboarding.
  const reportData = toMonthReviewData(state) ?? toOpeningReportData(state);
  return (
    <DemoShell>
      <MonthlyDecisions
        demo={{
          value: state.draftMonthly,
          onChange: (patch) => dispatch({ type: 'UPDATE_MONTH_DRAFT', patch }),
          catalog,
          cash: state.cash,
          month: state.month,
          reportData,
          lockedTabs: state.lockedTabs,
          onTabLockChange: (tab, locked) => dispatch({ type: 'SET_TAB_LOCK', tab, locked }),
        }}
      />
    </DemoShell>
  );
}

export function DemoMonthReview() {
  const { state } = useDemo();
  return <DemoShell><MonthReview data={toMonthReviewData(state)} /></DemoShell>;
}

export function DemoCommandCenter() {
  const { state } = useDemo();
  return <DemoShell><CommandCenter monthly={toCommandCenterMonthly(state)} /></DemoShell>;
}

export function DemoQuarterlyDecisions() {
  const { state, dispatch } = useDemo();
  return (
    <DemoShell>
      <QuarterlyDecisions
        demo={{
          value: state.draftQuarterly,
          onChange: (patch) => dispatch({ type: 'UPDATE_QUARTER_DRAFT', patch }),
          cash: state.cash,
          quarter: quarterOf(state.month),
        }}
      />
    </DemoShell>
  );
}

export function DemoQuarterlyReview() {
  const { state } = useDemo();
  return <DemoShell><QuarterlyReport data={toQuarterlyReportData(state)} /></DemoShell>;
}

export function DemoAnnualDecisions() {
  const { state, dispatch } = useDemo();
  const currentSqft = (state.setup.spaceOption !== null ? SPACE_OPTIONS[state.setup.spaceOption].sqft : 3200) + state.extensionSqft;
  const rentPerSqft = state.setup.location !== null ? LOCATIONS[state.setup.location].rent : 20;
  return (
    <DemoShell>
      <AnnualDecisions
        demo={{
          value: state.draftAnnual,
          onChange: (patch) => dispatch({ type: 'UPDATE_ANNUAL_DRAFT', patch }),
          cash: state.cash,
          ownershipPct: state.ownershipPct,
          activeProducts: state.activeProducts,
          productStats: toAnnualProductStats(state),
          provisionalValue: provisionalValuation(state.history),
          currentSqft,
          rentPerSqft,
        }}
      />
    </DemoShell>
  );
}

export function DemoAnnualReview() {
  return <DemoShell><AnnualOverview initialView="report" /></DemoShell>;
}

export function DemoFinalEvaluation() {
  const { state } = useDemo();
  return <DemoShell><FinalEvaluation outcome={toFinalEvaluationOutcome(state)} /></DemoShell>;
}

export function DemoLeaderboard() {
  const { state } = useDemo();
  return <DemoShell><Leaderboard cohortRows={toLeaderboardCohort(state)} /></DemoShell>;
}
