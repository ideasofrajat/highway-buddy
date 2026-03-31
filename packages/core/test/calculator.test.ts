import { describe, expect, it } from "vitest";
import { HighwayBuddy, VehicleClass } from "../src";

describe("calculateTolls", () => {
  it("returns toll plazas and aggregate cost", async () => {
    const sdk = new HighwayBuddy();
    const result = await sdk.calculateTolls({
      origin: { lat: 28.6139, lng: 77.209 },
      destination: { lat: 19.076, lng: 72.8777 },
      vehicleClass: VehicleClass.CAR_JEEP_VAN,
      fastagEnabled: true
    });

    expect(result.plazas.length).toBeGreaterThan(10);
    expect(result.totalToll).toBeGreaterThan(1000);
    expect(result.distanceKm).toBeGreaterThan(1000);
    expect(result.route).toContain("NH-48");
  });

  it("uses cash rate when fastag disabled", async () => {
    const sdk = new HighwayBuddy();
    const result = await sdk.calculateTolls({
      origin: { lat: 28.6139, lng: 77.209 },
      destination: { lat: 19.076, lng: 72.8777 },
      vehicleClass: VehicleClass.BUS_TRUCK,
      fastagEnabled: false
    });

    expect(result.plazas.every((p) => p.appliedRate === p.cashRate)).toBe(true);
  });
});
