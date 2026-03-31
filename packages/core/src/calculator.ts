import plazasData from "@highway-buddy/data/plazas";
import routesData from "@highway-buddy/data/routes";
import { haversineDistanceKm } from "./lookup";
import { VehicleClass, type CalculateTollsInput, type CalculateTollsResult, type TollPlaza, type TollRates } from "./types";

const VEHICLE_CLASS_RATE_KEY: Record<VehicleClass, keyof TollRates> = {
  [VehicleClass.CAR_JEEP_VAN]: "car_jeep_van",
  [VehicleClass.LCV]: "lcv",
  [VehicleClass.BUS_TRUCK]: "bus_truck",
  [VehicleClass.MAV]: "mav",
  [VehicleClass.HCM_EME]: "hcm_eme",
  [VehicleClass.OVERSIZED]: "oversized"
};

const plazas = plazasData as TollPlaza[];
const routeNh48 = (routesData as Record<string, { waypoints: { lat: number; lng: number }[] }>)["nh-48-delhi-mumbai"];

export const calculateTolls = async (
  input: CalculateTollsInput
): Promise<CalculateTollsResult> => {
  const vehicleKey = VEHICLE_CLASS_RATE_KEY[input.vehicleClass];
  const selectedPlazas = plazas.filter((plaza) => plaza.nh.toUpperCase() === "NH-48");

  const enriched = selectedPlazas
    .map((plaza) => {
      const rate = plaza.rates[vehicleKey];
      if (!rate) return null;
      return {
        ...plaza,
        selectedVehicleClass: input.vehicleClass,
        cashRate: rate.single,
        fastagRate: rate.fastag,
        appliedRate: input.fastagEnabled === false ? rate.single : rate.fastag
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const totalToll = enriched.reduce((sum, plaza) => sum + plaza.appliedRate, 0);
  const distanceKm = haversineDistanceKm(input.origin, input.destination) * 1.2;
  const estimatedTimeHours = distanceKm / 62;

  return {
    totalToll: Math.round(totalToll),
    plazas: enriched,
    distanceKm: Math.round(distanceKm),
    estimatedTimeHours: Number(estimatedTimeHours.toFixed(2)),
    route: routeNh48 ? "NH-48 via Jaipur, Udaipur, Ahmedabad, Surat" : "Unknown route"
  };
};
