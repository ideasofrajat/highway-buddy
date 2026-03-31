import type { Coordinate, LookupFilters, TollPlaza } from "./types";

const toRad = (value: number): number => (value * Math.PI) / 180;

export const haversineDistanceKm = (a: Coordinate, b: Coordinate): number => {
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export const fuzzyIncludes = (text: string, query: string): boolean => {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return true;
  if (normalizedText.includes(normalizedQuery)) return true;

  let idx = 0;
  for (const char of normalizedText) {
    if (char === normalizedQuery[idx]) idx += 1;
    if (idx === normalizedQuery.length) return true;
  }
  return false;
};

export const filterPlazas = (
  plazas: TollPlaza[],
  filters: LookupFilters
): TollPlaza[] =>
  plazas.filter((plaza) => {
    if (filters.nh && plaza.nh.toLowerCase() !== filters.nh.toLowerCase()) {
      return false;
    }
    if (filters.state && plaza.state.toLowerCase() !== filters.state.toLowerCase()) {
      return false;
    }
    if (filters.name && !fuzzyIncludes(plaza.name, filters.name)) {
      return false;
    }
    return true;
  });

export const nearestPlazas = (
  plazas: TollPlaza[],
  from: Coordinate,
  radiusKm: number
): TollPlaza[] =>
  plazas
    .map((plaza) => ({ plaza, distanceKm: haversineDistanceKm(from, plaza.coordinates) }))
    .filter((item) => item.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .map((item) => item.plaza);
