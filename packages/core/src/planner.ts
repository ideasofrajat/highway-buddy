import restStopsData from "@highway-buddy/data/rest-stops";
import { calculateTolls } from "./calculator";
import type { CalculateTollsInput, Coordinate } from "./types";

export type PlanRouteInput = CalculateTollsInput & {
  fuelPricePerLitre: number;
  vehicleMileageKmPerLitre: number;
};

export type PlanRouteResult = Awaited<ReturnType<typeof calculateTolls>> & {
  estimatedFuelCost: number;
  totalTripCost: number;
  restStops: Array<{
    id: string;
    name: string;
    type: string;
    coordinates: Coordinate;
    state: string;
  }>;
  borderCrossings: string[];
};

const restStops = restStopsData as PlanRouteResult["restStops"];

export const planRoute = async (input: PlanRouteInput): Promise<PlanRouteResult> => {
  const tolls = await calculateTolls(input);
  const estimatedFuelCost = (tolls.distanceKm / input.vehicleMileageKmPerLitre) * input.fuelPricePerLitre;
  const borderCrossings = ["Haryana -> Rajasthan", "Rajasthan -> Gujarat", "Gujarat -> Maharashtra"];

  return {
    ...tolls,
    estimatedFuelCost: Number(estimatedFuelCost.toFixed(2)),
    totalTripCost: Number((tolls.totalToll + estimatedFuelCost).toFixed(2)),
    restStops,
    borderCrossings
  };
};
