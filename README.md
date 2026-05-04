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
├── README.md               # Project overview and workflow
└── CNAME                   # Custom domain config
```

## Design system

Uses the **Signal** design system — IBM Plex Sans + IBM Plex Mono + JetBrains Mono, signal cyan (`#22D3EE`) accent, square corners, 1px hairlines. Light (Schematic) mode by default; dark (Oscilloscope) mode available via `data-theme="dark"` on `<html>`.

## Deployment

Hosted on GitHub Pages. The `CNAME` file points to the custom domain.

## Local Development

This is a static site, so no build step is required.

- Open `index.html` directly in the browser, or serve the folder with a simple static server.
- Validate navigation across all pages after each content update.
- Confirm footer legal/contact links and CTA paths before committing.

## Version Control Workflow

- Keep work in feature branches (for example: `feature/update-poc-copy`).
- Commit small, focused changes with clear messages.
- Push branch and open a pull request to `main`.
- Review links and page navigation as part of PR checks before merge.
