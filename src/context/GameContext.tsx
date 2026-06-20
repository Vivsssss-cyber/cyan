'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  EMPLOYEE_OPTIONS,
  GameState,
  getInitialGameState,
  getMaxCustomers as computeMaxCustomers,
  getMonthlyRent as computeMonthlyRent,
  getRunway as computeRunway,
  getWeeklyBurn as computeWeeklyBurn,
  LOCATIONS,
  MARKETING_OPTIONS,
  SPACE_OPTIONS,
} from '../lib/game-state';

interface GameContextType {
  state: GameState;
  locations: typeof LOCATIONS;
  spaceOptions: typeof SPACE_OPTIONS;
  employeeOptions: typeof EMPLOYEE_OPTIONS;
  marketingOptions: typeof MARKETING_OPTIONS;
  setLocation: (id: number) => void;
  setSpaceOption: (id: number) => void;
  setEmployeeCount: (count: number) => void;
  setMarketingBudget: (pct: number) => void;
  setPositioning: (pos: string) => void;
  setSetupStage: (stage: number) => void;
  setPhase: (phase: GameState['phase']) => void;
  setCurrentWeek: (week: number) => void;
  updateDecisions: (decisions: Partial<GameState['weeklyDecisions']>) => void;
  lockDecisions: () => void;
  unlockDecisions: () => void;
  setShowEventModal: (show: boolean) => void;
  setFacilitatorMode: (mode: boolean) => void;
  getMonthlyRent: () => number;
  getWeeklyBurn: () => number;
  getRunway: () => number;
  getMaxCustomers: () => number;
}

const initialState: GameState = getInitialGameState();

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const setLocation = useCallback((id: number) => setState(s => ({ ...s, location: id })), []);
  const setSpaceOption = useCallback((id: number) => setState(s => ({ ...s, spaceOption: id })), []);
  const setEmployeeCount = useCallback((count: number) => setState(s => ({ ...s, employeeCount: count })), []);
  const setMarketingBudget = useCallback((pct: number) => setState(s => ({ ...s, marketingBudget: pct })), []);
  const setPositioning = useCallback((pos: string) => setState(s => ({ ...s, positioning: pos })), []);
  const setSetupStage = useCallback((stage: number) => setState(s => ({ ...s, setupStage: stage })), []);
  const setPhase = useCallback((phase: GameState['phase']) => setState(s => ({ ...s, phase })), []);
  const setCurrentWeek = useCallback((week: number) => setState(s => ({ ...s, currentWeek: week })), []);
  const lockDecisions = useCallback(() => setState(s => ({ ...s, decisionsLocked: true })), []);
  const unlockDecisions = useCallback(() => setState(s => ({ ...s, decisionsLocked: false })), []);
  const setShowEventModal = useCallback((show: boolean) => setState(s => ({ ...s, showEventModal: show })), []);
  const setFacilitatorMode = useCallback((mode: boolean) => setState(s => ({ ...s, facilitatorMode: mode })), []);
  const updateDecisions = useCallback((decisions: Partial<GameState['weeklyDecisions']>) => {
    setState(s => ({ ...s, weeklyDecisions: { ...s.weeklyDecisions, ...decisions } }));
  }, []);

  const getMonthlyRent = useCallback(() => {
    return computeMonthlyRent(state);
  }, [state]);

  const getWeeklyBurn = useCallback(() => {
    return computeWeeklyBurn(state);
  }, [state]);

  const getRunway = useCallback(() => {
    return computeRunway(state);
  }, [state]);

  const getMaxCustomers = useCallback(() => {
    return computeMaxCustomers(state);
  }, [state]);

  return (
    <GameContext.Provider value={{
      state,
      locations: LOCATIONS,
      spaceOptions: SPACE_OPTIONS,
      employeeOptions: EMPLOYEE_OPTIONS,
      marketingOptions: MARKETING_OPTIONS,
      setLocation, setSpaceOption, setEmployeeCount, setMarketingBudget,
      setPositioning, setSetupStage, setPhase, setCurrentWeek,
      updateDecisions, lockDecisions, unlockDecisions,
      setShowEventModal, setFacilitatorMode,
      getMonthlyRent, getWeeklyBurn, getRunway, getMaxCustomers,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
}
