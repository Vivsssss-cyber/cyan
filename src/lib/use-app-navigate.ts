"use client";

import { useRouter, usePathname } from "next/navigation";
import { useDemoOptional } from "../context/DemoContext";
import { nextPhase, resolveDemoTarget, routeForPhase } from "./demo/demo-flow";

export function useAppNavigate() {
  const router = useRouter();
  const pathname = usePathname();
  const demo = useDemoOptional();

  return (target: string | number) => {
    if (typeof target === "number") {
      if (target < 0) {
        router.back();
      }
      return;
    }

    // Inside the /demo flow, legacy screen targets drive the phase machine
    // instead of pushing dead routes. /ref behavior is unchanged (demo === null).
    if (demo && pathname?.startsWith("/demo")) {
      const resolved = resolveDemoTarget(target);

      if (resolved.kind === "phase") {
        demo.dispatch({ type: "GOTO_PHASE", phase: resolved.phase });
        router.push(routeForPhase(resolved.phase));
        return;
      }

      if (resolved.kind === "advance") {
        const next = nextPhase(demo.state);
        demo.dispatch({ type: "ADVANCE" });
        router.push(routeForPhase(next.phase));
        return;
      }

      router.push(resolved.path);
      return;
    }

    router.push(target);
  };
}
