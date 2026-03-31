import plazasData from "@highway-buddy/data/plazas";
import restStopsData from "@highway-buddy/data/rest-stops";
import routesData from "@highway-buddy/data/routes";
import {
  HighwayBuddy,
  VehicleClass,
  type CalculateTollsResult,
  type Coordinate,
  type TollPlaza
} from "@highway-buddy/core";

const sdk = new HighwayBuddy();
const plazas = plazasData as TollPlaza[];
const restStops = restStopsData as Array<{
  id: string;
  name: string;
  type: string;
  nh: string;
  state: string;
  coordinates: Coordinate;
}>;
const routes = routesData as Record<
  string,
  {
    code: string;
    name: string;
    waypoints: Array<{ name: string; lat: number; lng: number }>;
  }
>;

const CITY_COORDINATES: Record<string, Coordinate> = {
  delhi: { lat: 28.6139, lng: 77.209 },
  gurugram: { lat: 28.4595, lng: 77.0266 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  ajmer: { lat: 26.4499, lng: 74.6399 },
  udaipur: { lat: 24.5854, lng: 73.7125 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  surat: { lat: 21.1702, lng: 72.8311 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  pune: { lat: 18.5204, lng: 73.8567 },
  manali: { lat: 32.2432, lng: 77.1892 }
};

const resolvePoint = (point: string | Coordinate): Coordinate => {
  if (typeof point !== "string") return point;
  const value = CITY_COORDINATES[point.toLowerCase()];
  if (!value) throw new Error(`Unknown city "${point}". Provide lat/lng coordinates instead.`);
  return value;
};

const toVehicleClass = (vehicle: string): VehicleClass => {
  const v = vehicle.toLowerCase();
  if (v === "car" || v === "car_jeep_van") return VehicleClass.CAR_JEEP_VAN;
  if (v === "lcv") return VehicleClass.LCV;
  if (v === "bus" || v === "truck" || v === "bus_truck" || v === "twoaxle") {
    return VehicleClass.BUS_TRUCK;
  }
  if (v === "mav") return VehicleClass.MAV;
  if (v === "hcm_eme") return VehicleClass.HCM_EME;
  return VehicleClass.OVERSIZED;
};

const haversineDistanceKm = (a: Coordinate, b: Coordinate): number => {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const earth = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const la1 = toRad(a.lat);
  const la2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return earth * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export const toll = {
  async estimate(input: {
    from: string | Coordinate;
    to: string | Coordinate;
    vehicle: string;
    fastag?: boolean;
  }): Promise<{ total: number; plazas: number; highways: string[]; breakdown: CalculateTollsResult["plazas"] }> {
    const result = await sdk.calculateTolls({
      origin: resolvePoint(input.from),
      destination: resolvePoint(input.to),
      vehicleClass: toVehicleClass(input.vehicle),
      fastagEnabled: input.fastag ?? true
    });
    return {
      total: result.totalToll,
      plazas: result.plazas.length,
      highways: ["NH48"],
      breakdown: result.plazas
    };
  },
  async byPlaza(name: string) {
    const plaza = plazas.find((p) => p.name.toLowerCase().includes(name.toLowerCase()));
    if (!plaza) return null;
    return {
      car: plaza.rates.car_jeep_van?.single ?? 0,
      lcv: plaza.rates.lcv?.single ?? 0,
      twoAxle: plaza.rates.bus_truck?.single ?? 0,
      mav: plaza.rates.mav?.single ?? 0,
      hcmEme: plaza.rates.hcm_eme?.single ?? 0
    };
  },
  async plazasOnRoute(input: { nh: string; from?: number; to?: number }) {
    const start = input.from ?? 0;
    const end = input.to ?? Number.MAX_SAFE_INTEGER;
    return plazas.filter((p, idx) => p.nh === input.nh && idx >= start && idx <= end);
  }
};

export const poi = {
  types: ["petrol", "food", "atm", "hospital", "police", "rest"] as const,
  async nearby(input: { lat: number; lng: number; type: string; radius: number }) {
    const typeMap: Record<string, string[]> = {
      petrol: ["petrol_pump"],
      food: ["dhaba"],
      rest: ["rest_area"],
      hospital: [],
      police: [],
      atm: []
    };
    const allowed = typeMap[input.type] ?? [];
    return restStops
      .filter((s) => allowed.length === 0 || allowed.includes(s.type))
      .map((s) => ({
        name: s.name,
        dist: Number(haversineDistanceKm({ lat: input.lat, lng: input.lng }, s.coordinates).toFixed(1)),
        lat: s.coordinates.lat,
        lng: s.coordinates.lng,
        open24h: true,
        nh: s.nh
      }))
      .filter((s) => s.dist <= input.radius)
      .sort((a, b) => a.dist - b.dist);
  },
  async onHighway(input: { nh: string; type: string }) {
    const data = await this.nearby({ lat: 23, lng: 73, type: input.type, radius: 2000 });
    return data.filter((d) => d.nh === input.nh);
  },
  async alongRoute(input: { route: string[]; types: string[]; every: number }) {
    const nhSet = new Set(input.route.map((r) => r.toUpperCase()));
    return restStops
      .filter((s) => nhSet.has(s.nh.toUpperCase()))
      .filter((s) =>
        input.types.some((t) =>
          (t === "food" && s.type === "dhaba") ||
          (t === "petrol" && s.type === "petrol_pump") ||
          (t === "rest" && s.type === "rest_area")
        )
      )
      .map((s, i) => ({ ...s, approxKmMarker: i * input.every }));
  }
};

export const highway = {
  async get(nh: string) {
    const route = Object.values(routes).find((r) => r.code.toUpperCase() === nh.toUpperCase());
    const routePlazas = plazas.filter((p) => p.nh.toUpperCase() === nh.toUpperCase());
    return {
      number: nh.toUpperCase(),
      length: nh.replace(/-/g, "").toUpperCase() === "NH48" ? 2807 : 0,
      states: [...new Set(routePlazas.map((p) => p.state))],
      lanes: 4,
      tollPlazas: routePlazas.length,
      routeName: route?.name ?? null
    };
  },
  async search(city: string) {
    const term = city.toLowerCase();
    return Object.values(routes)
      .filter((r) => r.waypoints.some((w) => w.name.toLowerCase().includes(term)))
      .map((r) => r.code);
  },
  async speedLimit(input: { nh: string; km: number }) {
    const speed = input.km < 100 ? 80 : 100;
    return { nh: input.nh.toUpperCase(), km: input.km, speedLimit: speed };
  }
};

export const emergency = {
  helpline(input: { nh?: string; highways?: string[] }) {
    const nhList = input.highways ?? (input.nh ? [input.nh] : []);
    return {
      nhai: "1033",
      police: "100",
      ambulance: "108",
      towing: nhList.map((nh) => ({ nh, phone: "1800-000-1033" }))
    };
  },
  async nearestTrauma(input: { lat: number; lng: number }) {
    return {
      name: "Sassoon General Hospital",
      dist: Number(haversineDistanceKm({ lat: input.lat, lng: input.lng }, { lat: 18.5287, lng: 73.8743 }).toFixed(1)),
      phone: "020-26127394"
    };
  }
};

/**
 * Reserved for future cloud API key support. Currently a no-op.
 * @param _input.apiKey - Your highway-buddy cloud API key (not yet active)
 */
export const configure = (_input: { apiKey: string }) => {};

export {
  HighwayBuddy,
  VehicleClass,
  type Coordinate,
  type TollPlaza
} from "@highway-buddy/core";
