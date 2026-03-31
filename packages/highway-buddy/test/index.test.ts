import { describe, expect, it } from "vitest";
import { emergency, highway, poi, toll } from "../src";

describe("toll.estimate", () => {
  it("returns a cost, plaza count and highway list for a known city pair", async () => {
    const result = await toll.estimate({ from: "delhi", to: "jaipur", vehicle: "car" });
    expect(result.total).toBeGreaterThan(0);
    expect(result.plazas).toBeGreaterThan(0);
    expect(result.highways).toContain("NH48");
    expect(result.breakdown.length).toBe(result.plazas);
  });

  it("FASTag is enabled by default", async () => {
    const withFastag = await toll.estimate({ from: "delhi", to: "mumbai", vehicle: "car" });
    const withoutFastag = await toll.estimate({
      from: "delhi",
      to: "mumbai",
      vehicle: "car",
      fastag: false
    });
    // FASTag total should be <= cash total (same or discounted)
    expect(withFastag.total).toBeLessThanOrEqual(withoutFastag.total);
  });

  it("supports all major vehicle types", async () => {
    const vehicles = ["car", "lcv", "bus", "truck", "mav"];
    for (const vehicle of vehicles) {
      const result = await toll.estimate({ from: "delhi", to: "mumbai", vehicle });
      expect(result.total).toBeGreaterThan(0);
    }
  });

  it("throws for an unknown city name", async () => {
    await expect(
      toll.estimate({ from: "atlantis", to: "delhi", vehicle: "car" })
    ).rejects.toThrow();
  });
});

describe("toll.byPlaza", () => {
  it("returns rates for a known plaza", async () => {
    const result = await toll.byPlaza("Kherki Daula");
    expect(result).not.toBeNull();
    expect(result!.car).toBeGreaterThan(0);
    expect(result!.lcv).toBeGreaterThan(0);
    expect(result!.twoAxle).toBeGreaterThan(0);
  });

  it("returns null for an unknown plaza", async () => {
    const result = await toll.byPlaza("this plaza does not exist");
    expect(result).toBeNull();
  });
});

describe("toll.plazasOnRoute", () => {
  it("returns plazas for NH-48", async () => {
    const plazas = await toll.plazasOnRoute({ nh: "NH-48" });
    expect(plazas.length).toBeGreaterThan(0);
    expect(plazas.every((p) => p.nh === "NH-48")).toBe(true);
  });

  it("returns empty array for an unknown highway", async () => {
    const plazas = await toll.plazasOnRoute({ nh: "NH-9999" });
    expect(plazas).toHaveLength(0);
  });
});

describe("poi.nearby", () => {
  it("finds petrol pumps within radius", async () => {
    const results = await poi.nearby({ lat: 28.42, lng: 76.97, type: "petrol", radius: 50 });
    expect(Array.isArray(results)).toBe(true);
    // all results are within the requested radius
    expect(results.every((r) => r.dist <= 50)).toBe(true);
    // results are sorted nearest first
    for (let i = 1; i < results.length; i++) {
      expect(results[i]!.dist).toBeGreaterThanOrEqual(results[i - 1]!.dist);
    }
  });

  it("finds dhabas within radius", async () => {
    const results = await poi.nearby({ lat: 26.9, lng: 75.8, type: "food", radius: 100 });
    expect(Array.isArray(results)).toBe(true);
  });

  it("returns empty array when nothing is within radius", async () => {
    const results = await poi.nearby({ lat: 0, lng: 0, type: "petrol", radius: 1 });
    expect(results).toHaveLength(0);
  });

  it("exposes a stable list of supported types", () => {
    expect(poi.types).toContain("petrol");
    expect(poi.types).toContain("food");
    expect(poi.types).toContain("rest");
  });
});

describe("highway.get", () => {
  it("returns info for NH-48", async () => {
    const info = await highway.get("NH-48");
    expect(info.number).toBe("NH-48");
    expect(info.tollPlazas).toBeGreaterThan(0);
    expect(info.states.length).toBeGreaterThan(0);
    expect(info.length).toBeGreaterThan(0);
  });

  it("throws for a highway with no data yet", async () => {
    await expect(highway.get("NH-44")).rejects.toThrow("No data for NH-44");
  });
});

describe("highway.speedLimit", () => {
  it("returns 80 km/h for early km markers", async () => {
    const result = await highway.speedLimit({ nh: "NH-48", km: 50 });
    expect(result.speedLimit).toBe(80);
  });

  it("returns 100 km/h beyond km 100", async () => {
    const result = await highway.speedLimit({ nh: "NH-48", km: 200 });
    expect(result.speedLimit).toBe(100);
  });
});

describe("emergency.helpline", () => {
  it("always returns NHAI, police and ambulance numbers", () => {
    const result = emergency.helpline({ nh: "NH-48" });
    expect(result.nhai).toBe("1033");
    expect(result.police).toBe("100");
    expect(result.ambulance).toBe("108");
  });

  it("includes towing contacts for requested highways", () => {
    const result = emergency.helpline({ highways: ["NH-48", "NH-44"] });
    expect(result.towing).toHaveLength(2);
    expect(result.towing.map((t) => t.nh)).toContain("NH-48");
  });
});

describe("emergency.nearestTrauma", () => {
  it("returns a hospital name, distance and phone", async () => {
    const result = await emergency.nearestTrauma({ lat: 18.52, lng: 73.86 });
    expect(result.name).toBeTruthy();
    expect(result.dist).toBeGreaterThanOrEqual(0);
    expect(result.phone).toMatch(/\d/);
  });
});
