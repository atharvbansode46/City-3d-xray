import type { FeatureCollection } from "geojson";

export type Category = "vegetation" | "expansion" | "terrain" | "water" | "infrastructure";
export type DataMode = "demo" | "real";
export type ComparisonYear = 2018 | 2024;
export type LayerFeatureCollection = FeatureCollection;

export type Snapshot = {
  observation: string;
  dataset: string;
  date: string;
  metricLabel: string;
  metricValue: string;
  confidence: "High" | "Medium" | "Low";
  analysis: {
    areaLabel: string;
    areaValue: string;
    signalLabel: string;
    signalValue: string;
    notes: string[];
  };
};

export type Finding = {
  id: string;
  title: string;
  category: Category;
  coordinates: [number, number];
  location: string;
  source: string;
  methodology: string;
  limitations: string;
  snapshots: Record<ComparisonYear, Snapshot>;
};

export const SATARA: [number, number] = [74.0183, 17.6805];

export const categoryLabels: Record<Category, string> = {
  vegetation: "Green cover",
  expansion: "Built-up",
  terrain: "Terrain",
  water: "Water & drainage",
  infrastructure: "Infrastructure",
};

export const syntheticLayerData: Record<ComparisonYear, Record<Category, LayerFeatureCollection>> = {
  2018: {
    vegetation: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "North green belt", class: "vegetation" },
          geometry: {
            type: "Polygon",
            coordinates: [[[73.995, 17.685], [74.026, 17.707], [74.049, 17.699], [74.035, 17.679], [74.003, 17.681], [73.995, 17.685]]],
          },
        },
      ],
    },
    expansion: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Urban footprint 2018", class: "expansion" },
          geometry: {
            type: "Polygon",
            coordinates: [[[74.035, 17.662], [74.061, 17.665], [74.067, 17.679], [74.041, 17.677], [74.035, 17.662]]],
          },
        },
      ],
    },
    terrain: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Approx contour 460m", contour_m: 460 },
          geometry: {
            type: "LineString",
            coordinates: [[73.99, 17.724], [74.005, 17.714], [74.022, 17.705], [74.041, 17.699], [74.056, 17.694]],
          },
        },
        {
          type: "Feature",
          properties: { name: "Approx contour 500m", contour_m: 500 },
          geometry: {
            type: "LineString",
            coordinates: [[73.996, 17.736], [74.014, 17.726], [74.034, 17.716], [74.053, 17.709], [74.071, 17.704]],
          },
        },
      ],
    },
    water: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Drainage channel A", class: "drainage" },
          geometry: {
            type: "LineString",
            coordinates: [[74.019, 17.651], [74.027, 17.657], [74.036, 17.661], [74.047, 17.664], [74.059, 17.668]],
          },
        },
      ],
    },
    infrastructure: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Transport corridor", class: "road" },
          geometry: {
            type: "LineString",
            coordinates: [[73.995, 17.704], [74.018, 17.688], [74.038, 17.676], [74.057, 17.668], [74.084, 17.661]],
          },
        },
      ],
    },
  },
  2024: {
    vegetation: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "North green belt", class: "vegetation" },
          geometry: {
            type: "Polygon",
            coordinates: [[[74.001, 17.685], [74.027, 17.703], [74.046, 17.697], [74.032, 17.681], [74.008, 17.682], [74.001, 17.685]]],
          },
        },
      ],
    },
    expansion: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Urban footprint 2024", class: "expansion" },
          geometry: {
            type: "Polygon",
            coordinates: [[[74.032, 17.658], [74.073, 17.664], [74.081, 17.684], [74.04, 17.679], [74.032, 17.658]]],
          },
        },
      ],
    },
    terrain: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Approx contour 460m", contour_m: 460 },
          geometry: {
            type: "LineString",
            coordinates: [[73.99, 17.724], [74.005, 17.714], [74.022, 17.705], [74.041, 17.699], [74.056, 17.694]],
          },
        },
        {
          type: "Feature",
          properties: { name: "Approx contour 500m", contour_m: 500 },
          geometry: {
            type: "LineString",
            coordinates: [[73.996, 17.736], [74.014, 17.726], [74.034, 17.716], [74.053, 17.709], [74.071, 17.704]],
          },
        },
      ],
    },
    water: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Drainage channel A", class: "drainage" },
          geometry: {
            type: "LineString",
            coordinates: [[74.018, 17.649], [74.027, 17.655], [74.037, 17.659], [74.049, 17.662], [74.062, 17.666]],
          },
        },
        {
          type: "Feature",
          properties: { name: "Accumulation pocket", class: "waterbody" },
          geometry: {
            type: "Polygon",
            coordinates: [[[74.022, 17.647], [74.028, 17.648], [74.027, 17.652], [74.021, 17.651], [74.022, 17.647]]],
          },
        },
      ],
    },
    infrastructure: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Transport corridor", class: "road" },
          geometry: {
            type: "LineString",
            coordinates: [[73.995, 17.704], [74.018, 17.688], [74.038, 17.676], [74.057, 17.668], [74.089, 17.66]],
          },
        },
        {
          type: "Feature",
          properties: { name: "New connector", class: "road" },
          geometry: {
            type: "LineString",
            coordinates: [[74.044, 17.675], [74.054, 17.682], [74.066, 17.689]],
          },
        },
      ],
    },
  },
};

export const findings: Finding[] = [
  {
    id: "green-corridor",
    title: "Vegetation corridor",
    category: "vegetation",
    coordinates: [74.027, 17.692],
    location: "North peri-urban corridor, Satara",
    source: "Synthetic demonstration feature set",
    methodology: "Manual synthetic polygons and marker scenarios created for UI demonstration only.",
    limitations: "Synthetic geometry; not measured from Sentinel-2 or any official land-cover product.",
    snapshots: {
      2018: {
        observation: "Baseline scenario shows a broader connected vegetation corridor near the north edge.",
        dataset: "Simulated NDVI-style layer (demo)",
        date: "2018 synthetic baseline",
        metricLabel: "Green-cover proxy",
        metricValue: "65 ha (simulated)",
        confidence: "Low",
        analysis: {
          areaLabel: "Estimated mapped zone",
          areaValue: "65 ha",
          signalLabel: "Comparison signal vs 2024",
          signalValue: "Baseline reference",
          notes: ["No cloud masking", "No seasonal normalization", "Not derived from satellite bands"],
        },
      },
      2024: {
        observation: "Scenario indicates corridor narrowing near built edge and reduced continuity.",
        dataset: "Simulated NDVI-style layer (demo)",
        date: "2024 synthetic scenario",
        metricLabel: "Green-cover proxy",
        metricValue: "52 ha (simulated)",
        confidence: "Low",
        analysis: {
          areaLabel: "Estimated mapped zone",
          areaValue: "52 ha",
          signalLabel: "Change from 2018 baseline",
          signalValue: "-13 ha",
          notes: ["Difference is synthetic", "No statistical confidence interval", "Investigation prompt only"],
        },
      },
    },
  },
  {
    id: "east-growth",
    title: "East-side expansion",
    category: "expansion",
    coordinates: [74.056, 17.674],
    location: "Eastern transport-facing edge, Satara",
    source: "Synthetic demonstration feature set",
    methodology: "Manually drafted urban footprint polygons for before/after interface behavior.",
    limitations: "No official built-up classification, cadastral source, or remote-sensing model has been applied.",
    snapshots: {
      2018: {
        observation: "Baseline footprint remains closer to core settlement extent.",
        dataset: "Simulated built-up layer (demo)",
        date: "2018 synthetic baseline",
        metricLabel: "Built-up proxy",
        metricValue: "41 ha (simulated)",
        confidence: "Low",
        analysis: {
          areaLabel: "Mapped built area",
          areaValue: "41 ha",
          signalLabel: "Comparison signal vs 2024",
          signalValue: "Baseline reference",
          notes: ["No supervised classification", "No building footprints ingested", "Synthetic only"],
        },
      },
      2024: {
        observation: "Scenario highlights outward growth and a broader east-side built envelope.",
        dataset: "Simulated built-up layer (demo)",
        date: "2024 synthetic scenario",
        metricLabel: "Built-up proxy",
        metricValue: "57 ha (simulated)",
        confidence: "Low",
        analysis: {
          areaLabel: "Mapped built area",
          areaValue: "57 ha",
          signalLabel: "Change from 2018 baseline",
          signalValue: "+16 ha",
          notes: ["Growth value is synthetic", "No construction permits linked", "Use as demo hypothesis"],
        },
      },
    },
  },
  {
    id: "ridge",
    title: "Ridge and slope context",
    category: "terrain",
    coordinates: [74.002, 17.716],
    location: "North-west ridge section, Satara",
    source: "Synthetic demonstration feature set",
    methodology: "Approximate contour lines plus MapLibre terrain rendering for exploratory visual context.",
    limitations: "Contours are synthetic and should not be interpreted as certified elevation values.",
    snapshots: {
      2018: {
        observation: "Higher ground context marks likely runoff directions toward lower urban basin areas.",
        dataset: "Simulated contour layer + terrain demo",
        date: "Static context layer",
        metricLabel: "Terrain context",
        metricValue: "Approx contour: 460–500 m",
        confidence: "Low",
        analysis: {
          areaLabel: "Reference corridor length",
          areaValue: "3.8 km",
          signalLabel: "Slope context signal",
          signalValue: "Down-gradient toward south-east",
          notes: ["Not a hydrological model", "No vertical accuracy calibration", "Guidance only"],
        },
      },
      2024: {
        observation: "Terrain context remains unchanged; useful as a stable backdrop for comparing other layers.",
        dataset: "Simulated contour layer + terrain demo",
        date: "Static context layer",
        metricLabel: "Terrain context",
        metricValue: "Approx contour: 460–500 m",
        confidence: "Low",
        analysis: {
          areaLabel: "Reference corridor length",
          areaValue: "3.8 km",
          signalLabel: "Slope context signal",
          signalValue: "No temporal change represented",
          notes: ["No DEM differencing done", "Only visual context", "Not flood proof"],
        },
      },
    },
  },
  {
    id: "drainage",
    title: "Low-lying drainage focus",
    category: "water",
    coordinates: [74.037, 17.657],
    location: "South-central drainage pocket, Satara",
    source: "Synthetic demonstration feature set",
    methodology: "Synthetic channel centerline and accumulation pocket to demonstrate risk-exploration workflow.",
    limitations: "No official flood atlas, gauge data, or hydraulic simulation has been integrated.",
    snapshots: {
      2018: {
        observation: "Baseline channel alignment indicates a narrow downstream path through low-lying ground.",
        dataset: "Simulated drainage layer (demo)",
        date: "2018 synthetic baseline",
        metricLabel: "Drainage context proxy",
        metricValue: "1 mapped channel segment",
        confidence: "Low",
        analysis: {
          areaLabel: "Observed low pocket",
          areaValue: "Not mapped in baseline",
          signalLabel: "Water accumulation signal",
          signalValue: "No pocket shown",
          notes: ["No rainfall model", "No flow accumulation raster", "Interpretation only"],
        },
      },
      2024: {
        observation: "Scenario adds a small accumulation pocket requiring field or dataset verification.",
        dataset: "Simulated drainage layer (demo)",
        date: "2024 synthetic scenario",
        metricLabel: "Drainage context proxy",
        metricValue: "1 channel + 1 pocket",
        confidence: "Low",
        analysis: {
          areaLabel: "Observed low pocket",
          areaValue: "Approx 0.8 ha",
          signalLabel: "Water accumulation signal",
          signalValue: "New pocket in scenario",
          notes: ["Pocket is synthetic", "Not a flood prediction", "Needs DEM + drainage network validation"],
        },
      },
    },
  },
  {
    id: "highway",
    title: "Transport edge",
    category: "infrastructure",
    coordinates: [74.074, 17.697],
    location: "Eastern road corridor, Satara",
    source: "Synthetic demonstration feature set",
    methodology: "Synthetic linear features representing possible corridor extension and a connector.",
    limitations: "Road geometry is illustrative and not an official infrastructure inventory.",
    snapshots: {
      2018: {
        observation: "Transport corridor exists as a through-route with limited branch connectivity.",
        dataset: "Simulated infrastructure layer (demo)",
        date: "2018 synthetic baseline",
        metricLabel: "Connectivity proxy",
        metricValue: "Primary corridor only",
        confidence: "Low",
        analysis: {
          areaLabel: "Mapped route length",
          areaValue: "11.2 km",
          signalLabel: "Network complexity signal",
          signalValue: "Single dominant corridor",
          notes: ["No traffic data", "No official road class schema", "Synthetic geometry only"],
        },
      },
      2024: {
        observation: "Scenario introduces an additional connector that may influence growth orientation.",
        dataset: "Simulated infrastructure layer (demo)",
        date: "2024 synthetic scenario",
        metricLabel: "Connectivity proxy",
        metricValue: "Corridor + connector",
        confidence: "Low",
        analysis: {
          areaLabel: "Mapped route length",
          areaValue: "13.0 km",
          signalLabel: "Network complexity signal",
          signalValue: "Added branch connector",
          notes: ["No mobility model", "No accident/usage statistics", "Use for workflow demonstration"],
        },
      },
    },
  },
];
