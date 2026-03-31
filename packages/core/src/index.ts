import plazasData from "@highway-buddy/data/plazas";
import { calculateTolls } from "./calculator";
import { filterPlazas, nearestPlazas } from "./lookup";
import { planRoute } from "./planner";
import type {
  CalculateTollsInput,
  Coordinate,
  LookupFilters,
  TollPlaza
} from "./types";

export { VehicleClass } from "./types";
export type * from "./types";

const plazas = plazasData as TollPlaza[];

export class HighwayBuddy {
  async calculateTolls(input: CalculateTollsInput) {
    return calculateTolls(input);
  }

  async planRoute(
    input: CalculateTollsInput & {
      fuelPricePerLitre: number;
      vehicleMileageKmPerLitre: number;
    }
  ) {
    return planRoute(input);
  }

  getPlazasByNH(nh: string): TollPlaza[] {
    return filterPlazas(plazas, { nh });
  }

  getNearestPlaza(point: Coordinate, radiusKm: number): TollPlaza[] {
    return nearestPlazas(plazas, point, radiusKm);
  }

  searchPlazas(filters: LookupFilters): TollPlaza[] {
    return filterPlazas(plazas, filters);
  }
}

export const getPlazasByNH = (nh: string): TollPlaza[] => {
  const sdk = new HighwayBuddy();
  return sdk.getPlazasByNH(nh);
};

export const getNearestPlaza = (point: Coordinate, radiusKm: number): TollPlaza[] => {
  const sdk = new HighwayBuddy();
  return sdk.getNearestPlaza(point, radiusKm);
};

export { calculateTolls, planRoute };
