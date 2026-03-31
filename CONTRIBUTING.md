# Contributing to highway-buddy

Thanks for helping improve open highway toll data in India.

## Add a new toll plaza

1. Create a new JSON file under `packages/data/plazas/<nh-code>/`.
   - Example: `packages/data/plazas/nh-48/manesar.json`
2. Follow the plaza schema at `packages/data/schema/plaza.schema.json`.
3. Add the same object to `packages/data/plazas/index.json` so the SDK consumes it.
4. Set `last_updated` with the latest known official revision date.
5. Run checks:
   - `pnpm install`
   - `pnpm test`
6. Open a PR with source references for rates and location.

## Plaza JSON template

```json
{
  "id": "plaza_nh48_manesar",
  "name": "Manesar Toll Plaza",
  "nh": "NH-48",
  "state": "Haryana",
  "coordinates": { "lat": 28.3541, "lng": 76.9467 },
  "rates": {
    "car_jeep_van": { "single": 85, "return": 130, "fastag": 85 },
    "lcv": { "single": 135, "return": 205, "fastag": 135 },
    "bus_truck": { "single": 285, "return": 430, "fastag": 285 }
  },
  "operator": "NHAI",
  "last_updated": "2025-01-01"
}
```

## Schema reference

- `packages/data/schema/plaza.schema.json`
