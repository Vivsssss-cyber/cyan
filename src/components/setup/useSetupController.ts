'use client';

import { useRouter } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import { nextPhase, prevPhase, routeForPhase } from '../../lib/demo/demo-flow';
import { DemoSetup } from '../../lib/demo/demo-types';

/** Shared controller for the demo setup stages: live setup draft + phase nav. */
export function useSetupController() {
  const { state, dispatch } = useDemo();
  const router = useRouter();

  const patch = (p: Partial<DemoSetup>) => dispatch({ type: 'SET_SETUP', patch: p });

  const next = () => {
    const n = nextPhase(state);
    dispatch({ type: 'GOTO_PHASE', phase: n.phase });
    router.push(routeForPhase(n.phase));
  };

  const back = () => {
    const p = prevPhase(state);
    if (!p) return;
    dispatch({ type: 'GOTO_PHASE', phase: p.phase });
    router.push(routeForPhase(p.phase));
  };

  /** Finalize setup → seed Month 1 (used by the loading stage). */
  const complete = () => {
    dispatch({ type: 'SETUP_COMPLETE' });
    router.push(routeForPhase('month-decisions'));
  };

  return { setup: state.setup, patch, next, back, complete };
}
