export type Coordinate = {
  lat: number;
  lng: number;
};

export enum VehicleClass {
  CAR_JEEP_VAN = "CAR_JEEP_VAN",
  LCV = "LCV",
  BUS_TRUCK = "BUS_TRUCK",
  MAV = "MAV",
  HCM_EME = "HCM_EME",
  OVERSIZED = "OVERSIZED"
}

export type VehicleRate = {
  single: number;
  return: number;
  fastag: number;
};

export type TollRates = {
  car_jeep_van?: VehicleRate;
  lcv?: VehicleRate;
  bus_truck?: VehicleRate;
  mav?: VehicleRate;
  hcm_eme?: VehicleRate;
  oversized?: VehicleRate;
};

export type TollPlaza = {
  id: string;
  name: string;
  nh: string;
  state: string;
  coordinates: Coordinate;
  rates: TollRates;
  operator: string;
  last_updated: string;
};

export type TollPlazaWithCost = TollPlaza & {
  selectedVehicleClass: VehicleClass;
  cashRate: number;
  fastagRate: number;
  appliedRate: number;
};

export type CalculateTollsInput = {
  origin: Coordinate;
  destination: Coordinate;
  vehicleClass: VehicleClass;
  fastagEnabled?: boolean;
};

export type CalculateTollsResult = {
  totalToll: number;
  plazas: TollPlazaWithCost[];
  distanceKm: number;
  estimatedTimeHours: number;
  route: string;
};

export type LookupFilters = {
  name?: string;
  nh?: string;
  state?: string;
};
