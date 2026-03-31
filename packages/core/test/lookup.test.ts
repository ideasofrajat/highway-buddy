import { describe, expect, it } from "vitest";
import { HighwayBuddy } from "../src";

describe("lookup APIs", () => {
  it("finds plazas by NH", () => {
    const sdk = new HighwayBuddy();
    const plazas = sdk.getPlazasByNH("NH-48");
    expect(plazas.length).toBeGreaterThan(10);
    expect(plazas.every((p) => p.nh === "NH-48")).toBe(true);
  });

  it("finds nearby plaza within radius", () => {
    const sdk = new HighwayBuddy();
    const nearby = sdk.getNearestPlaza({ lat: 28.42, lng: 76.98 }, 20);
    expect(nearby.length).toBeGreaterThan(0);
    expect(nearby[0]?.name).toContain("Kherki");
  });

  it("supports fuzzy plaza search", () => {
    const sdk = new HighwayBuddy();
    const result = sdk.searchPlazas({ name: "shahjhnpr" });
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]?.name).toContain("Shahjahanpur");
  });
});
