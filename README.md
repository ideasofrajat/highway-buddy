# highway-buddy

**India's highway layer for every app.**

A TypeScript SDK covering toll calculation, POI lookup, emergency contacts, and route enrichment across India's national highway network — with no API key required for basic usage.

[![CI](https://img.shields.io/github/actions/workflow/status/ideasofrajat/highway-buddy/ci.yml?branch=main&label=CI)](https://github.com/ideasofrajat/highway-buddy/actions)
[![npm](https://img.shields.io/npm/v/highway-buddy)](https://www.npmjs.com/package/highway-buddy)
[![License: MIT](https://img.shields.io/badge/license-MIT-black)](./LICENSE)

Open Source · MIT · v0.1.0

---

## The Gap

NHAI publishes toll rates and highway data — but it's spread across PDFs, government portals, and undocumented internal APIs. Every developer building a travel, logistics, or fleet app in India ends up scraping the same CSVs or paying ₹15K/month for a commercial API.

**highway-buddy** consolidates, normalises, and exposes all of this as a clean, typed, open-source SDK. Free for everyone. Maintained by the community.

- No API key needed for bundled offline data (toll rates, highway info, POI dataset)
- TypeScript-first with full type definitions — works in React Native, Next.js, Node.js, and browser
- Covers all vehicle categories: car, LCV, 2-axle truck, 3-axle, 4-axle, MAV, tractor

---

## Install

```bash
npm install highway-buddy
# or
yarn add highway-buddy
pnpm add highway-buddy
```

> **v0.1 Coverage Note:** Full data exists for NH-48 (24 plazas, Delhi–Mumbai). All other highways are community-expandable — see [CONTRIBUTING.md](./CONTRIBUTING.md). The API surface is stable. The dataset is what grows.

---

## Quick Start

```ts
import { toll, poi, highway, emergency } from 'highway-buddy'

// Estimate tolls: Delhi → Jaipur via NH48
const estimate = await toll.estimate({
  from: 'Delhi',
  to: 'Jaipur',
  vehicle: 'car',
  fastag: true
})
// → { total: 310, plazas: 4, highways: ['NH48'] }

// Find petrol pumps near current location
const pumps = await poi.nearby({
  lat: 27.58, lng: 75.92,
  type: 'petrol',
  radius: 10
})
```

---

## API Reference

Four modules. Everything you need. Each module is tree-shakeable — import only what your app uses.

### `toll` — Toll Calculator

Estimate tolls between any two points in India. Supports all NHAI vehicle classes, FASTag vs cash, return trip discounts, and monthly pass rates.

```ts
await toll.estimate({ from: 'Delhi', to: 'Mumbai', vehicle: 'car' })
// → { total: 1840, plazas: 12, highways: ['NH48'], breakdown: [...] }

await toll.byPlaza('Kherki Daula')
// → { car: 90, lcv: 145, twoAxle: 290, ... }

await toll.plazasOnRoute({ nh: 'NH-48', from: 0, to: 280 })
```

### `poi` — Highway POI

Find petrol pumps, dhabas, rest areas, ATMs, hospitals, and police stations near any highway coordinate. Offline-capable with bundled dataset.

```ts
await poi.nearby({ lat: 27.58, lng: 75.92, type: 'petrol', radius: 15 })
// → [{ name: 'HP Petrol Pump', dist: 3.2, lat, lng, open24h: true }]

poi.types // 'petrol' | 'food' | 'atm' | 'hospital' | 'police' | 'rest'
// Note: atm, hospital, and police return [] until data is contributed for those types

await poi.onHighway({ nh: 'NH-44', type: 'hospital' })
```

### `highway` — Highway Info

Full metadata for any national highway — length, states, lanes, toll plazas, and speed limits.

```ts
await highway.get('NH-48')
// → { number: 'NH-48', length: 2807, states: ['Delhi', 'Haryana', 'Rajasthan', ...], lanes: 4, tollPlazas: 24 }

await highway.search('Mumbai')
// → highways passing through or connecting to Mumbai

await highway.speedLimit({ nh: 'NH-48', km: 145 })
```

### `emergency` — Emergency Contacts

NHAI highway helpline numbers, police stations on highway stretches, nearest trauma centres, and towing service contacts — accessible without internet.

```ts
emergency.helpline({ nh: 'NH-44' })
// → { nhai: '1033', police: '100', ambulance: '108', towing: [...] }

await emergency.nearestTrauma({ lat: 18.52, lng: 73.86 })
// → { name: 'Sassoon General Hospital', dist: 4.1, phone: '...' }
```

### `configure` — Cloud API Key (v0.2 roadmap)

Reserved for the upcoming highway-buddy Cloud backend (real-time toll updates, extended POI data). Currently a no-op — all offline data works without calling this. Signature is stable so you can add it now without breaking changes when v0.2 ships.

```ts
import { configure } from 'highway-buddy'

configure({ apiKey: 'hb_live_...' }) // no-op until v0.2
```

---

## Full Example

```ts
import { toll, poi, emergency } from 'highway-buddy'

async function planTrip(origin: string, dest: string) {
  // 1. Calculate toll cost
  const tolls = await toll.estimate({
    from: origin, to: dest, vehicle: 'car'
  })

  // 2. Find rest stops every 100 km
  const stops = await poi.alongRoute({
    route: tolls.highways,
    types: ['food', 'petrol'],
    every: 100
  })

  // 3. Cache emergency contacts offline
  const sos = emergency.helpline({
    highways: tolls.highways
  })

  return { tolls, stops, sos }
}

// Works in React Native — no bridge required
const trip = await planTrip('Delhi', 'Manali')
```

---

## Data Coverage

v0.1 ships with complete data for NH-48. Community contributions expand coverage every release — see [CONTRIBUTING.md](./CONTRIBUTING.md).

| Metric | v0.1 (current) | Target |
|---|---|---|
| NHs with full data | 1 (NH-48) | 600+ |
| Toll plazas mapped | 24 | 1,148 |
| POIs indexed | NH-48 only | 28,400+ |
| Data sync cadence | Community PRs | Weekly automation |

**Highway coverage:**

| Highway | Route | Status |
|---|---|---|
| NH-48 | Delhi–Mumbai | Full (24 plazas) |
| NH-44 | Srinagar–Kanyakumari | Contributions welcome |
| NH-19 | Delhi–Kolkata | Contributions welcome |
| NH-27 | East-West Corridor | Contributions welcome |
| NH-16 | Kolkata–Chennai | Contributions welcome |

---

## Built For

**Travel & Navigation Apps** — Show real toll costs before a trip. Surface rest stops, dhabas, and petrol pumps on the route. Uses: `toll.estimate`, `poi.nearby`, `highway.get`

**Logistics & Fleet Management** — Calculate accurate per-trip toll costs for commercial vehicles across axle categories. Uses: `toll.estimate` (LCV/truck), `toll.plazasOnRoute`

**Safety & Emergency Apps** — Provide NHAI helpline numbers, trauma centre locations, and police contacts without internet access. Uses: `emergency.helpline`, `emergency.nearestTrauma`

---

## Contributing

The data improves when you contribute. Every PR improves the experience for every Indian developer.

| Area | Difficulty |
|---|---|
| Add / verify a toll plaza | Good first issue |
| POI data for your NH stretch | Help wanted |
| State Highway support | Feature |
| Framework integration guides | Docs |

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the data contribution workflow and JSON schema details.

```
github.com/ideasofrajat/highway-buddy
MIT License · Issues welcome · PRs reviewed within 48 hours
```

---

## License

MIT — see [LICENSE](./LICENSE)
