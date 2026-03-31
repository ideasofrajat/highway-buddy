import { HighwayBuddy } from "@highway-buddy/core";
import { useEffect, useMemo, useState } from "react";
import type { HighwayRouteInput } from "../types";

type PlannedRoute = Awaited<ReturnType<HighwayBuddy["planRoute"]>>;

type UseHighwayRouteState = {
  route: PlannedRoute | null;
  loading: boolean;
  error: Error | null;
};

const sdk = new HighwayBuddy();

export const useHighwayRoute = (input: HighwayRouteInput): UseHighwayRouteState => {
  const [state, setState] = useState<UseHighwayRouteState>({
    route: null,
    loading: true,
    error: null
  });

  const stableInput = useMemo(() => input, [input]);

  useEffect(() => {
    let active = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    sdk
      .planRoute({
        ...stableInput,
        fuelPricePerLitre: stableInput.fuelPricePerLitre ?? 100,
        vehicleMileageKmPerLitre: stableInput.vehicleMileage ?? 15
      })
      .then((route) => {
        if (!active) return;
        setState({ route, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!active) return;
        setState({ route: null, loading: false, error });
      });

    return () => {
      active = false;
    };
  }, [stableInput]);

  return state;
};
