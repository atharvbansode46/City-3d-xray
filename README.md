# City 3D X-Ray

An interactive urban-intelligence prototype for Satara, Maharashtra. The first release is intentionally a **synthetic demo**: findings and analysis overlays are illustrative placeholders, while the basemap is a live open map. No synthetic value should be treated as a measured civic or environmental result.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite. A production build is created with `npm run build` and can be previewed with `npm run preview`.

## What works

- Real 2D/3D behavior in MapLibre: globe projection, terrain elevation (demo DEM), pan, zoom, rotate, and reset.
- Search demo findings by title/layer/location and fall back to OpenStreetMap Nominatim location search.
- Toggle five category-specific analysis layers (vegetation, built-up, terrain contours, water/drainage, infrastructure) and filter findings by category.
- Functional 2018 and 2024 synthetic comparison states with explicit simulated labeling.
- Click map findings to inspect location, observation, dataset, source, date, methodology, confidence, limitations, and a detailed analysis view.
- Demo Mode / Real Data Mode indicators (Real Data Mode currently has no connected dataset, so basemap-only behavior is expected).
- Responsive dark operations interface with live basemap attribution.

## Deployment

The app is a static Vite site and does not require a backend or API key. Import this repository into Vercel, choose the Vite preset, and use `npm run build` as the build command with `dist` as the output directory. Netlify and GitHub Pages can use the same build output.

The default basemap uses OpenFreeMap's public style endpoint. It is suitable for a prototype, but review provider terms and usage limits before high-traffic production use. OpenStreetMap contributors require attribution, which is shown in the bottom bar.

## Replacing demo data

Synthetic feature collections, finding snapshots, and comparison-year values are defined in `src/data.ts`.

The intended next workflow is to replace synthetic vegetation and built-up layers with documented, cloud-filtered Sentinel-2 analysis for a fixed Satara study boundary. Keep measured observations, interpretations, confidence, and limitations separate. Elevation and flood-related indicators must not be presented as official forecasts without authoritative data and validation.
