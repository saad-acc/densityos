# DensityOS — Marketing Website

Static marketing site for **DensityOS**, a timing layer for data centers that unlocks 40–60% more capacity from existing infrastructure without new hardware.

Built by [Acceltra GmbH](https://acceltra.de), Berlin.

---

## Pages

| File | URL | Description |
|---|---|---|
| `index.html` | `/` | Homepage — hero, problem cards, before/after comparison, POC CTA |
| `for-data-centers.html` | `/for-data-centers` | Data center operator landing page — capacity, growth equation, compatibility |
| `how-it-works.html` | `/how-it-works` | Technical explainer |
| `poc-signup.html` | `/poc-signup` | POC request form |

## Structure

```
/
├── index.html              # Homepage
├── for-data-centers.html   # For data center operators
├── how-it-works.html       # How DensityOS works
├── poc-signup.html         # POC request form
├── styles.css              # Shared Signal design system + all component styles
├── script.js               # Shared interactions (nav, calculators, accordions)
├── assets/                 # SVG logo marks
└── CNAME                   # Custom domain config
```

## Design system

Uses the **Signal** design system — IBM Plex Sans + IBM Plex Mono + JetBrains Mono, signal cyan (`#22D3EE`) accent, square corners, 1px hairlines. Light (Schematic) mode by default; dark (Oscilloscope) mode available via `data-theme="dark"` on `<html>`.

## Deployment

Hosted on GitHub Pages. The `CNAME` file points to the custom domain.
