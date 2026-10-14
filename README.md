# Ferrowright: construction fastener site concept (React)

A modern, industry-specific website for an anchor bolt and construction fastener manufacturer, in
React + TypeScript + Vite, with three working calculators (bolt weight, tie rod length, plate
weight). "Ferrowright" is a generated placeholder brand: all copy, drawings, contact details and
company facts are original or illustrative. The name, lockup, phone and plant names live in
`src/data/site.ts` (`COMPANY`, `LOCATIONS`) and are the first things to swap.

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm test         # calculator unit tests
npm run build    # typecheck + production build (calculators are code-split)
```

## Design: "Forge & Zinc"

| | |
|---|---|
| Materials | mill-black steel, galvanized-zinc greys, spec-sheet paper, forge orange, blueprint navy |
| Type | Big Shoulders Display (stamped-steel headlines), IBM Plex Sans (body), IBM Plex Mono (spec data) |
| Motifs | hex frames, thread-stripe rules, registration marks, dimension lines, head-marking logo |
| Illustrations | original SVG technical drawings for all 66 product types (`components/Glyph.tsx`) |

Tokens live in `src/styles/tokens.css`. Calculators each get a live technical drawing whose
dimension lines follow the inputs.

## Calculators: what is exact and what is estimated

All three live in `src/calculators/` as pure functions with tests (`npm test`).

### Plate weight: exact
Reverse-engineered from the live tool's behaviour (client-side).
- density **0.2833 lb/in³**; square `(W×L − π(hole/2)²)×T`, round `(π(OD/2)² − π(hole/2)²)×T`
- fractions parse (`1-1/2`, `3/4`, `0.375`); each-weight rounds to 2 dp, total to 1 dp
- Verified against three live readings.

### Tie rod: exact
- per clevis end: `clevis dimension − max(d/2, 1/2")`; a turnbuckle of length T adds `T/2`
  (each rod engages T/4)
- single `P2P − 2c` · equal `(P2P − 2c − T/2)/2` · different `P2P − 2c − T/2 − fixed`
- clevis dimensions and which clevis fits which rod were tabulated from the live tool and are
  tested for **all 36 diameter/clevis pairs**, plus one equal-rod and one different-rod reading.
- Uses the same URL-hash format as the original (`#config=…&p2p=…&fixed=…&d=…&cNum=…&t=…`),
  so links shared from the original open here.

### Bolt weight: estimated, not exact
The original computes weights **on a server** from tables it describes as "super-secret
combinations of theoretical and sampled dimensions", so the numbers cannot be read from its
page source. This build uses an independent physical model instead: ASME B18 head/nut/washer
dimensions, thread geometry, steel at 0.2833 lb/in³, and a zinc-coating allowance for galvanized.

- It matches the one live reading captured (1" × 6" hex, 3" cut thread: 1.58 lb each).
- **Nuts, washers, rolled thread, heavy hex, timber, carriage, anchor rod and 90° anchor bolt are
  uncalibrated estimates.** Timber-head shape, ogee-washer geometry and rolled-thread body
  reduction are educated guesses.
- To calibrate: `src/calculators/boltWeight.groundTruth.test.ts` has a table of ready-made
  inputs. Run each on the original tool with quantity 1000, divide the total by 1000, paste the
  result in, and `npm test` will tell you where the model is off. Tunable constants are in one
  `MODEL` object in `boltWeight.ts`.

## Routes

URL structure mirrors the original: `/products/:category/:slug`, `/technical/tools/*`,
`/technical/:chart`, `/about/industries/:slug`, `/about/manufacturing/:slug`, `/locations/:slug`,
`/quick-quote`, `/anchor-bolts`, etc. 131 routes render; all were smoke-tested in a browser.

## Not rebuilt

Hardness-conversion chart, lag-screw pilot-hole chart, team, careers, testimonials, news,
newsletter and the fun-zone pages; product photography; live chat; search. The quote and
contact forms validate client-side but do not submit anywhere.

## Reference data caveat

Strength, torque, nut-compatibility and AASHTO↔ASTM tables are typical published values written
from standards knowledge, not copied from the original. Confirm against the current ASTM/AASHTO
editions before relying on them.
