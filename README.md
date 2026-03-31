# highway-buddy

India's highway layer for every app.

The open-source TypeScript SDK for Indian highway toll data — calculate costs, plan routes, query plazas.

![CI](https://img.shields.io/github/actions/workflow/status/ideasofrajat/highway-buddy/ci.yml?branch=main&label=CI)
![License](https://img.shields.io/badge/license-MIT-black)

Open Source · MIT · v0.1.0

## Install

```bash
npm install highway-buddy
```

## Quick Start

```ts
import { toll, poi, highway } from "highway-buddy";

const estimate = await toll.estimate({
  from: "Delhi",
  to: "Jaipur",
  vehicle: "car",
  fastag: true
});

// -> { total: 310, plazas: 4, highways: ["NH48"] }

const pumps = await poi.nearby({
  lat: 27.58,
  lng: 75.92,
  type: "petrol",
  radius: 10
});
```

## Why this exists

NHAI has the data, but developers could not use it easily.

- Data is spread across PDFs, portals, and undocumented APIs.
- Teams rebuild scrapers or pay high monthly API costs.
- Existing datasets often miss type-safe SDK ergonomics.

`highway-buddy` consolidates and normalizes this into a clean, typed, open-source SDK.

## API Reference

Four modules. Everything you need.

### `toll` - Toll Calculator

```ts
await toll.estimate({ from: "Delhi", to: "Mumbai", vehicle: "car" });
await toll.byPlaza("Kherki Daula");
await toll.plazasOnRoute({ nh: "NH48", from: 0, to: 280 });
```

### `poi` - Highway POI

```ts
await poi.nearby({ lat: 27.58, lng: 75.92, type: "petrol", radius: 15 });
await poi.onHighway({ nh: "NH44", type: "hospital" });
```

### `highway` - Highway Info

```ts
await highway.get("NH48");
await highway.search("Mumbai");
await highway.speedLimit({ nh: "NH48", km: 145 });
```

### `emergency` - Emergency Contacts

```ts
emergency.helpline({ nh: "NH44" });
await emergency.nearestTrauma({ lat: 18.52, lng: 73.86 });
```

## Data Coverage

Current coverage — contributions welcome to expand it:

- **NH-48** (Delhi–Mumbai): 22 toll plazas mapped end-to-end
- Rest stops, petrol pumps, and dhabas indexed along NH-48
- More highways coming — see [CONTRIBUTING.md](./CONTRIBUTING.md) to add yours

## Built for

- Travel and navigation apps
- Logistics and fleet management
- Safety and emergency workflows

## Docs

See `apps/docs/index.html` for the full reference site.

```bash
npm run setup
npm run docs:dev
```

Open `http://localhost:4173`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for data contribution workflow and schema details.

## License

MIT
