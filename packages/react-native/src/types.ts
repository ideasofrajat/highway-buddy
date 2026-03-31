import type { Coordinate, VehicleClass } from "@highway-buddy/core";

export type HighwayRouteInput = {
  origin: Coordinate;
  destination: Coordinate;
  vehicleClass: VehicleClass;
  fastagEnabled?: boolean;
  fuelPricePerLitre?: number;
  vehicleMileage?: number;
};
