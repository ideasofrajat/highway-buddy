# Contributing to highway-buddy

India has 600+ national highways and 1,100+ toll plazas. One person can't maintain that — but a community of developers who drive these roads every day can. Every contribution here improves the experience for every Indian app that needs highway data.

---

## What to work on

| Track | Difficulty | Impact |
|---|---|---|
| Add or verify a toll plaza | Good first issue | Directly fixes incorrect toll estimates |
| POI data for your NH stretch | Help wanted | Adds petrol pumps, dhabas, rest areas |
| Expand to a new highway | Feature | Unlocks a whole NH for every user |
| Framework integration guide | Docs | Helps developers get started faster |

Pick what matches where you are. If you drive NH-44 to work, you're the most qualified person to verify those toll rates.

---

## Development setup

```bash
git clone https://github.com/ideasofrajat/highway-buddy.git
cd highway-buddy
pnpm install
pnpm test       # all tests should pass
pnpm build      # all packages should compile
```

Requires Node.js 20+ and pnpm 9+. If you don't have pnpm: `npm install -g pnpm`.

---

## Adding a toll plaza

### 1. Find the right folder

Plazas are organised by highway under `packages/data/plazas/`:

```
packages/data/plazas/
  nh-48/          ← one folder per highway
    kherki-daula.json
    shahjahanpur.json
    ...
  index.json      ← master list consumed by the SDK
```

### 2. Create the plaza file

Create `packages/data/plazas/nh-XX/your-plaza-name.json`:

```json
{
  "id": "plaza_nh48_manesar",
  "name": "Manesar Toll Plaza",
  "nh": "NH-48",
  "state": "Haryana",
  "coordinates": { "lat": 28.3541, "lng": 76.9467 },
  "rates": {
    "car_jeep_van": { "single": 85, "return": 130, "fastag": 85 },
    "lcv":          { "single": 135, "return": 205, "fastag": 135 },
    "bus_truck":    { "single": 285, "return": 430, "fastag": 285 },
    "mav":          { "single": 445, "return": 670, "fastag": 445 },
    "hcm_eme":      { "single": 445, "return": 670, "fastag": 445 },
    "oversized":    { "single": 545, "return": 815, "fastag": 545 }
  },
  "operator": "NHAI",
  "last_updated": "2025-01-01"
}
```

Vehicle class key reference:

| Key | Vehicles |
|---|---|
| `car_jeep_van` | Car, Jeep, Van |
| `lcv` | Light Commercial Vehicle |
| `bus_truck` | Bus, 2-axle truck |
| `mav` | 3-axle vehicle |
| `hcm_eme` | 4–6 axle / heavy construction machinery |
| `oversized` | Oversized vehicle |

### 3. Add it to the master index

Open `packages/data/plazas/index.json` and append the same object to the array. Keep entries ordered by approximate km position on the highway.

### 4. Validate and test

```bash
pnpm validate:data   # checks JSON schema
pnpm test            # runs the full test suite
```

### 5. Open a PR

Include in the PR description:
- Source for the toll rates (NHAI FASTag portal URL, photo of the toll board, or gazette notification)
- Date the rates were last verified
- Whether this is a new plaza or a correction to existing data

---

## Expanding to a new highway

If your highway has no folder yet:

1. Create `packages/data/plazas/nh-XX/`
2. Add individual plaza JSON files following the schema above
3. Append all plazas to `packages/data/plazas/index.json`
4. Add a route entry to `packages/data/routes/index.json`:

```json
"nh-44-srinagar-kanyakumari": {
  "code": "NH-44",
  "name": "Srinagar–Kanyakumari",
  "waypoints": [
    { "name": "Srinagar", "lat": 34.0837, "lng": 74.7973 },
    { "name": "Delhi",    "lat": 28.6139, "lng": 77.2090 },
    { "name": "Chennai",  "lat": 13.0827, "lng": 80.2707 }
  ]
}
```

5. Run `pnpm validate:data && pnpm test`

---

## Adding POI data

Rest stops, petrol pumps, and dhabas live in `packages/data/rest-stops/index.json`. Each entry:

```json
{
  "id": "rs_nh48_bhiwadi_hp",
  "name": "HP Petrol Pump, Bhiwadi",
  "type": "petrol_pump",
  "nh": "NH-48",
  "state": "Rajasthan",
  "coordinates": { "lat": 28.2082, "lng": 76.8516 }
}
```

Supported `type` values: `petrol_pump`, `dhaba`, `rest_area`

ATM, hospital, and police types are supported in the API and ready to receive data — open a feature issue if you want to define the schema for those.

---

## Where to find reliable toll rate data

- **NHAI FASTag portal** — `netc.ihmcl.com` lists FASTag rates by plaza
- **Toll booth signage** — rates are posted at every plaza entrance; a photo is a valid source
- **NHAI gazette notifications** — published on `nhai.gov.in` when rates change

If rates have changed since `last_updated`, open a Data Correction issue with the new values and your source.

---

## PR guidelines

- **One plaza or one highway per PR** — keeps reviews fast and focused
- **Always include a source** — no source, no merge; toll rates are legally significant
- **Don't change existing rates without a source** — if you think a rate is wrong, open a Data Correction issue first
- **PRs are reviewed within 48 hours**

---

## Reporting issues

Use the issue templates on GitHub:
- **Bug report** — something in the SDK code is broken
- **Feature request** — new API or behaviour
- **Data correction** — a toll rate or plaza detail is wrong or outdated

---

## Code of conduct

Be straightforward and respectful. This is a data project — debates should be about sources and accuracy. If a rate is disputed, both sides cite their source and the most recent official one wins.
