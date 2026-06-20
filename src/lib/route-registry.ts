import { BoardReview } from "../components/BoardReview";
import { DecisionsSummary } from "../components/DecisionsSummary";
import { DecisionsLeaderboard } from "../components/DecisionsLeaderboard";
import { AnnualReport } from "../components/AnnualReport";
import { AnnualOverview } from "../components/AnnualOverview";
import { FinalEvaluation } from "../components/FinalEvaluation";
import { FinalReport } from "../components/FinalReport";
import { FleetReport } from "../components/FleetReport";
import { CapacitySetup } from "../components/CapacitySetup";
import { CommandCenter } from "../components/CommandCenter";
import { DesignCockpit } from "../components/DesignCockpit";
import { PlaygroundLanding } from "../components/PlaygroundLanding";
import { DesignGenerator } from "../components/DesignGenerator";
import { PerformanceCustomers } from "../components/PerformanceCustomers";
import { DesignSystemPage } from "../components/DesignSystem";
import { FacilitatorDashboard } from "../components/FacilitatorDashboard";
import { FundraisingScreen } from "../components/FundraisingModal";
import { Leaderboard } from "../components/Leaderboard";
import { LocationSetup } from "../components/LocationSetup";
import { LoopsDesign } from "../components/LoopsDesign";
import { ProjectValleyPage } from "../components/ProjectValleyPage";
import { MarketView } from "../components/MarketView";
import { MonthReview } from "../components/MonthReview";
import { MonthlyDecisions } from "../components/MonthlyDecisions";
import { PerformanceReport } from "../components/PerformanceReport";
import { QuarterlyReport } from "../components/QuarterlyReport";
import { SetupSummary } from "../components/SetupSummary";
import { TeamSetup } from "../components/TeamSetup";
import { TrainingIntro } from "../components/TrainingIntro";
import { WeeklyCockpit } from "../components/WeeklyCockpit";
import { WeeklyResults } from "../components/WeeklyResults";
import { WelcomeCarousel } from "../components/WelcomeCarousel";
import { DemoLanding } from "../components/demo/DemoLanding";
import {
  DemoTraining,
  DemoWelcome,
  DemoBasicSetup,
  DemoLocationSetup,
  DemoCapacitySetup,
  DemoEmployeeSetup,
  DemoMarketingSetup,
  DemoPaymentSetup,
  DemoSetupSummary,
  DemoSetupLoading,
  DemoMonthlyDecisions,
  DemoMonthReview,
  DemoCommandCenter,
  DemoQuarterlyDecisions,
  DemoQuarterlyReview,
  DemoAnnualDecisions,
  DemoAnnualReview,
  DemoFinalEvaluation,
  DemoLeaderboard,
} from "../components/demo/demo-screens";
import { QuarterlyDecisions } from "../components/QuarterlyDecisions";
import { AnnualDecisions } from "../components/AnnualDecisions";
// CyanSim platform — Deliverable 1 core flows
import { SimHub } from "../components/sim/SimHub";
import { SimFacilitatorHome } from "../components/sim/SimFacilitatorHome";
import { SimScenarioLibrary } from "../components/sim/SimScenarioLibrary";
import { SimSessionSetup } from "../components/sim/SimSessionSetup";
import { SimLiveMonitor } from "../components/sim/SimLiveMonitor";
import { SimTeamDashboard } from "../components/sim/SimTeamDashboard";
import { SimDecisionModules } from "../components/sim/SimDecisionModules";
import { SimRationaleCapture } from "../components/sim/SimRationaleCapture";
// CyanSim — Module 1: Admin Game Studio (screens 1-20)
import { SimAdminDashboard, SimAdminScenarios, SimAdminCreateScenario } from "../components/sim/SimAdminStudio";
import { SimAdminBlockCatalog, SimAdminBlockDetail, SimAdminCanvas, SimAdminRecipe } from "../components/sim/SimAdminBlocks";
import { SimAdminDecisions, SimAdminKpis, SimAdminTimeline } from "../components/sim/SimAdminConfig";
import { SimAdminEvents, SimAdminObjectives, SimAdminReflection, SimAdminDebrief, SimAdminControls } from "../components/sim/SimAdminPedagogy";
import { SimAdminPreviewTeacher, SimAdminPreviewStudent, SimAdminBalance, SimAdminVersions, SimAdminPublish } from "../components/sim/SimAdminPublish";
// CyanSim — Module 5: Mentor Loop & Voice Evidence (screens 71-80)
import { SimMentorQueue, SimMentorTranscript, SimMentorAssumptions, SimMentorFeedback } from "../components/sim/SimMentor";
import { SimMentorTimeline, SimMentorSummary, SimMentorEvidenceHub } from "../components/sim/SimMentorEvidence";
import { SimStudentVoice, SimTeamVoice, SimPeerFeedback } from "../components/sim/SimVoiceCapture";
// CyanSim — Module 4 part 2: Student results & reflection (screens 66-70)
import { SimRoundResult, SimCauseEffect, SimReflection, SimCommitment, SimProgress } from "../components/sim/SimResults";
// CyanSim — Module 4: Student Entry flow (screens 51-56)
import { SimJoin } from "../components/sim/SimJoin";
import { SimIdentity } from "../components/sim/SimIdentity";
import { SimBrief } from "../components/sim/SimBrief";
import { SimTeamLobby } from "../components/sim/SimTeamLobby";
import { SimReadiness } from "../components/sim/SimReadiness";
// CyanSim — Module 3: Teacher Console (classes, roster, teams, roles, invite, session tools)
import { SimTeacherClasses, SimTeacherCreateClass, SimTeacherClassDetail } from "../components/sim/SimTeacherClasses";
import { SimTeacherRoster, SimTeacherTeams, SimTeacherRoles, SimTeacherInvite } from "../components/sim/SimTeacherRoster";
import { SimTeacherTeamDetail, SimTeacherCompare, SimTeacherBroadcast, SimTeacherReflections, SimTeacherFeedback, SimTeacherDebrief } from "../components/sim/SimTeacherSession";
// CyanSim — Module 4: Role Dashboard (#58)
import { SimRoleDashboard } from "../components/sim/SimRoleDashboard";
// CyanSim — Module 2: Teacher Entry (scenario compare, assign, preview, launch, my-sims) screens 25-30
import {
  SimTeacherScenarioCompare,
  SimTeacherAssign,
  SimTeacherScenarioPreview,
  SimTeacherLaunchReady,
  SimTeacherAssigned,
  SimTeacherQuickLaunch,
} from "../components/sim/SimTeacherEntry";
// CyanSim — Module 3 session flow: roster import, pre-launch checklist, pacing, projector (38, 41, 43, 47)
import {
  SimTeacherRosterImport,
  SimTeacherChecklist,
  SimTeacherPacing,
  SimTeacherProjector,
} from "../components/sim/SimTeacherSessionFlow";

export const routeRegistry = {
  // Core tools
  "/": PlaygroundLanding,
  "/pages": DesignCockpit,
  "/design-generator": DesignGenerator,
  "/design-system": DesignSystemPage,
  "/performance-customers": PerformanceCustomers,

  // Reference screens (game simulation)
  "/ref/training": TrainingIntro,
  "/ref/welcome": WelcomeCarousel,
  "/ref/setup/location": LocationSetup,
  "/ref/setup/capacity": CapacitySetup,
  "/ref/setup/team": TeamSetup,
  "/ref/setup/summary": SetupSummary,
  "/ref/game/cockpit": WeeklyCockpit,
  "/ref/game/results": WeeklyResults,
  "/ref/game/month-review": MonthReview,
  "/ref/game/monthly-decisions": MonthlyDecisions,
  "/ref/game/board-review": BoardReview,
  "/ref/game/market": MarketView,
  "/ref/game/leaderboard": Leaderboard,
  "/ref/game/fundraising": FundraisingScreen,
  "/ref/game/command-center": CommandCenter,
  "/ref/game/performance-report": PerformanceReport,
  "/ref/game/quarterly-report": QuarterlyReport,
  "/ref/game/final-evaluation": FinalEvaluation,
  "/ref/game/final-report": FinalReport,
  "/ref/game/annual-report": AnnualReport,
  "/ref/game/annual-overview": AnnualOverview,
  "/ref/game/fleet-report": FleetReport,
  "/ref/game/decisions-summary": DecisionsSummary,
  "/ref/game/decisions-leaderboard": DecisionsLeaderboard,
  "/ref/facilitator": FacilitatorDashboard,
  "/ref/loops-design": LoopsDesign,
  "/projectvalley": ProjectValleyPage,

  // New decision screens (static reference renders)
  "/ref/game/quarterly-decisions": QuarterlyDecisions,
  "/ref/game/annual-decisions": AnnualDecisions,

  // Playable demo flow (PRD cadence: 12 months → quarterly → annual → final)
  "/demo": DemoLanding,
  "/demo/training": DemoTraining,
  "/demo/welcome": DemoWelcome,
  "/demo/setup/basic": DemoBasicSetup,
  "/demo/setup/location": DemoLocationSetup,
  "/demo/setup/capacity": DemoCapacitySetup,
  "/demo/setup/employees": DemoEmployeeSetup,
  "/demo/setup/marketing": DemoMarketingSetup,
  "/demo/setup/payment": DemoPaymentSetup,
  "/demo/setup/summary": DemoSetupSummary,
  "/demo/setup/loading": DemoSetupLoading,
  "/demo/month/decisions": DemoMonthlyDecisions,
  "/demo/month/review": DemoMonthReview,
  "/demo/month/command-center": DemoCommandCenter,
  "/demo/quarter/decisions": DemoQuarterlyDecisions,
  "/demo/quarter/review": DemoQuarterlyReview,
  "/demo/annual/decisions": DemoAnnualDecisions,
  "/demo/annual/review": DemoAnnualReview,
  "/demo/final": DemoFinalEvaluation,
  "/demo/leaderboard": DemoLeaderboard,

  // CyanSim platform — Deliverable 1: core user flows (Teacher launch + Student decision)
  "/sim": SimHub,
  "/sim/teacher": SimFacilitatorHome,
  "/sim/teacher/library": SimScenarioLibrary,
  "/sim/teacher/setup": SimSessionSetup,
  "/sim/teacher/live": SimLiveMonitor,
  "/sim/play": SimTeamDashboard,
  "/sim/play/join": SimJoin,
  "/sim/play/identity": SimIdentity,
  "/sim/play/brief": SimBrief,
  "/sim/play/lobby": SimTeamLobby,
  "/sim/play/readiness": SimReadiness,
  "/sim/play/decide": SimDecisionModules,
  "/sim/play/rationale": SimRationaleCapture,

  // CyanSim — Module 1: Admin Game Studio
  "/sim/admin": SimAdminDashboard,
  "/sim/admin/scenarios": SimAdminScenarios,
  "/sim/admin/scenarios/new": SimAdminCreateScenario,
  "/sim/admin/blocks": SimAdminBlockCatalog,
  "/sim/admin/blocks/detail": SimAdminBlockDetail,
  "/sim/admin/canvas": SimAdminCanvas,
  "/sim/admin/recipe": SimAdminRecipe,
  "/sim/admin/decisions": SimAdminDecisions,
  "/sim/admin/kpis": SimAdminKpis,
  "/sim/admin/timeline": SimAdminTimeline,
  "/sim/admin/events": SimAdminEvents,
  "/sim/admin/objectives": SimAdminObjectives,
  "/sim/admin/reflection": SimAdminReflection,
  "/sim/admin/debrief": SimAdminDebrief,
  "/sim/admin/controls": SimAdminControls,
  "/sim/admin/preview/teacher": SimAdminPreviewTeacher,
  "/sim/admin/preview/student": SimAdminPreviewStudent,
  "/sim/admin/balance": SimAdminBalance,
  "/sim/admin/versions": SimAdminVersions,
  "/sim/admin/publish": SimAdminPublish,

  // CyanSim — Module 5: Mentor Loop & Voice Evidence
  "/sim/mentor": SimMentorQueue,
  "/sim/mentor/transcript": SimMentorTranscript,
  "/sim/mentor/assumptions": SimMentorAssumptions,
  "/sim/mentor/feedback": SimMentorFeedback,
  "/sim/mentor/timeline": SimMentorTimeline,
  "/sim/mentor/summary": SimMentorSummary,
  "/sim/mentor/evidence": SimMentorEvidenceHub,
  "/sim/play/voice": SimStudentVoice,
  "/sim/play/voice-team": SimTeamVoice,
  "/sim/play/peer-feedback": SimPeerFeedback,
  "/sim/play/results": SimRoundResult,
  "/sim/play/cause-effect": SimCauseEffect,
  "/sim/play/reflection": SimReflection,
  "/sim/play/commitment": SimCommitment,
  "/sim/play/progress": SimProgress,

  // CyanSim — Module 3: Teacher Console (classes & session tools)
  "/sim/teacher/classes": SimTeacherClasses,
  "/sim/teacher/classes/new": SimTeacherCreateClass,
  "/sim/teacher/classes/detail": SimTeacherClassDetail,
  "/sim/teacher/roster": SimTeacherRoster,
  "/sim/teacher/teams": SimTeacherTeams,
  "/sim/teacher/roles": SimTeacherRoles,
  "/sim/teacher/invite": SimTeacherInvite,
  "/sim/teacher/team-detail": SimTeacherTeamDetail,
  "/sim/teacher/compare": SimTeacherCompare,
  "/sim/teacher/broadcast": SimTeacherBroadcast,
  "/sim/teacher/reflections": SimTeacherReflections,
  "/sim/teacher/feedback": SimTeacherFeedback,
  "/sim/teacher/debrief": SimTeacherDebrief,

  // CyanSim — Module 4: Role Dashboard
  "/sim/play/role": SimRoleDashboard,

  // CyanSim — Module 2: Teacher Entry (screens 25-30)
  "/sim/teacher/scenarios/compare": SimTeacherScenarioCompare,
  "/sim/teacher/assign": SimTeacherAssign,
  "/sim/teacher/scenarios/preview": SimTeacherScenarioPreview,
  "/sim/teacher/launch-ready": SimTeacherLaunchReady,
  "/sim/teacher/assigned": SimTeacherAssigned,
  "/sim/teacher/quick-launch": SimTeacherQuickLaunch,

  // CyanSim — Module 3: Session flow (38, 41, 43, 47)
  "/sim/teacher/session/roster-import": SimTeacherRosterImport,
  "/sim/teacher/session/checklist": SimTeacherChecklist,
  "/sim/teacher/session/pacing": SimTeacherPacing,
  "/sim/teacher/projector": SimTeacherProjector,
} as const;

export function getRouteComponent(path: string) {
  return routeRegistry[path as keyof typeof routeRegistry] ?? null;
}

export const referenceScreens = [
  { path: "/ref/training", label: "Training Intro", category: "Onboarding" },
  { path: "/ref/welcome", label: "Welcome Carousel", category: "Onboarding" },
  { path: "/ref/setup/location", label: "Location Setup", category: "Setup" },
  { path: "/ref/setup/capacity", label: "Capacity Setup", category: "Setup" },
  { path: "/ref/setup/team", label: "Team Setup", category: "Setup" },
  { path: "/ref/setup/summary", label: "Setup Summary", category: "Setup" },
  { path: "/ref/game/cockpit", label: "Weekly Cockpit", category: "Gameplay" },
  { path: "/ref/game/results", label: "Weekly Results", category: "Gameplay" },
  { path: "/ref/game/month-review", label: "Month Review", category: "Gameplay" },
  { path: "/ref/game/monthly-decisions", label: "Monthly Decisions", category: "Gameplay" },
  { path: "/ref/game/board-review", label: "Board Review", category: "Gameplay" },
  { path: "/ref/game/market", label: "Market View", category: "Gameplay" },
  { path: "/ref/game/leaderboard", label: "Leaderboard", category: "Gameplay" },
  { path: "/ref/game/fundraising", label: "Fundraising", category: "Gameplay" },
  { path: "/ref/game/command-center", label: "Command Center", category: "Gameplay" },
  { path: "/ref/game/performance-report", label: "Performance Report", category: "Gameplay" },
  { path: "/ref/game/quarterly-report", label: "Quarterly Report", category: "Gameplay" },
  { path: "/ref/game/final-evaluation", label: "Final Evaluation", category: "Gameplay" },
  { path: "/ref/game/final-report", label: "Final Report + Leaderboard", category: "Gameplay" },
  { path: "/ref/game/annual-report", label: "Annual Report (Final)", category: "Gameplay" },
  { path: "/ref/game/annual-overview", label: "Annual Overview (Report + Decisions)", category: "Gameplay" },
  { path: "/ref/game/fleet-report", label: "Fish Game End Report", category: "Gameplay" },
  { path: "/ref/game/decisions-summary", label: "Decisions Summary", category: "Gameplay" },
  { path: "/ref/game/decisions-leaderboard", label: "Decisions Leaderboard", category: "Gameplay" },
  { path: "/ref/game/quarterly-decisions", label: "Quarterly Decisions", category: "Gameplay" },
  { path: "/ref/game/annual-decisions", label: "Annual Decisions", category: "Gameplay" },
  { path: "/ref/facilitator", label: "Facilitator Dashboard", category: "Admin" },
  { path: "/ref/loops-design", label: "Loops Design", category: "Reference" },
] as const;

export type ReferenceScreen = (typeof referenceScreens)[number];
