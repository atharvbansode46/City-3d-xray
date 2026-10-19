import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { GeoJSONSource, Map as MapLibreMap, MapLayerMouseEvent } from "maplibre-gl";
import {
  Activity,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Droplets,
  Globe2,
  Layers3,
  LocateFixed,
  Map as MapIcon,
  Mountain,
  PanelRight,
  Search,
  Settings2,
  TreePine,
  Waves,
  X,
} from "lucide-react";
import {
  categoryLabels,
  findings,
  SATARA,
  syntheticLayerData,
  type Category,
  type ComparisonYear,
  type DataMode,
  type Finding,
  type LayerFeatureCollection,
} from "./data";

const styleUrl = "https://tiles.openfreemap.org/styles/liberty";
const colors: Record<Category, string> = {
  vegetation: "#65d69a",
  expansion: "#f5a55b",
  terrain: "#b38cff",
  water: "#54c7f5",
  infrastructure: "#f3d66b",
};

const defaultActive: Record<Category, boolean> = {
  vegetation: true,
  expansion: true,
  terrain: true,
  water: true,
  infrastructure: true,
};

const emptyCollection: LayerFeatureCollection = { type: "FeatureCollection", features: [] };
const realDataConnected = false;

function App() {
  const mapNode = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [projection, setProjection] = useState<"mercator" | "globe">("globe");
  const [mode, setMode] = useState<DataMode>("demo");
  const [comparisonYear, setComparisonYear] = useState<ComparisonYear>(2024);
  const [scenario, setScenario] = useState("satara-urban-pilot");
  const [selected, setSelected] = useState<Finding | null>(findings[0]);
  const [active, setActive] = useState<Record<Category, boolean>>(defaultActive);
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [search, setSearch] = useState("");
  const [searchBusy, setSearchBusy] = useState(false);
  const [status, setStatus] = useState("DEMO MODE · LIVE BASEMAP · SYNTHETIC ANALYSIS");
  const [view, setView] = useState({ lat: SATARA[1], lon: SATARA[0], zoom: 11.3 });

  const showDemoData = mode === "demo";

  const visibleFindings = useMemo(() => {
    if (!showDemoData) return [];
    return findings.filter((finding) => (filter === "all" || finding.category === filter) && active[finding.category]);
  }, [active, filter, showDemoData]);

  useEffect(() => {
    if (!visibleFindings.length) {
      setSelected(null);
      return;
    }
    if (!selected || !visibleFindings.some((finding) => finding.id === selected.id)) {
      setSelected(visibleFindings[0]);
    }
  }, [visibleFindings, selected]);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapNode.current,
      style: styleUrl,
      center: SATARA,
      zoom: 11.3,
      pitch: 38,
      bearing: -12,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "bottom-right");

    map.on("load", () => {
      map.setProjection({ type: "globe" });

      map.addSource("terrain-dem", {
        type: "raster-dem",
        url: "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
        tileSize: 256,
      });

      map.addLayer({
        id: "terrain-hillshade",
        type: "hillshade",
        source: "terrain-dem",
        layout: { visibility: "visible" },
        paint: {
          "hillshade-exaggeration": 0.3,
          "hillshade-accent-color": "#3f5563",
          "hillshade-shadow-color": "#1d2a34",
        },
      });

      map.setTerrain({ source: "terrain-dem", exaggeration: 1.2 });

      map.addSource("layer-vegetation", { type: "geojson", data: emptyCollection });
      map.addSource("layer-expansion", { type: "geojson", data: emptyCollection });
      map.addSource("layer-terrain", { type: "geojson", data: emptyCollection });
      map.addSource("layer-water", { type: "geojson", data: emptyCollection });
      map.addSource("layer-infrastructure", { type: "geojson", data: emptyCollection });
      map.addSource("findings", { type: "geojson", data: emptyCollection });

      map.addLayer({
        id: "layer-vegetation-fill",
        type: "fill",
        source: "layer-vegetation",
        paint: { "fill-color": colors.vegetation, "fill-opacity": 0.2 },
      });
      map.addLayer({
        id: "layer-vegetation-line",
        type: "line",
        source: "layer-vegetation",
        paint: { "line-color": colors.vegetation, "line-width": 1.4, "line-opacity": 0.85 },
      });
      map.addLayer({
        id: "layer-expansion-fill",
        type: "fill",
        source: "layer-expansion",
        paint: { "fill-color": colors.expansion, "fill-opacity": 0.17 },
      });
      map.addLayer({
        id: "layer-expansion-line",
        type: "line",
        source: "layer-expansion",
        paint: { "line-color": colors.expansion, "line-width": 1.4, "line-opacity": 0.88 },
      });
      map.addLayer({
        id: "layer-terrain-line",
        type: "line",
        source: "layer-terrain",
        paint: { "line-color": colors.terrain, "line-width": 1.35, "line-opacity": 0.84, "line-dasharray": [2, 1] },
      });
      map.addLayer({
        id: "layer-water-fill",
        type: "fill",
        source: "layer-water",
        paint: { "fill-color": colors.water, "fill-opacity": 0.18 },
      });
      map.addLayer({
        id: "layer-water-line",
        type: "line",
        source: "layer-water",
        paint: { "line-color": colors.water, "line-width": 1.8, "line-opacity": 0.88 },
      });
      map.addLayer({
        id: "layer-infrastructure-line",
        type: "line",
        source: "layer-infrastructure",
        paint: { "line-color": colors.infrastructure, "line-width": 2.2, "line-opacity": 0.9, "line-dasharray": [3, 1.5] },
      });
      map.addLayer({
        id: "findings-circle",
        type: "circle",
        source: "findings",
        paint: {
          "circle-color": [
            "match",
            ["get", "category"],
            "vegetation",
            colors.vegetation,
            "expansion",
            colors.expansion,
            "terrain",
            colors.terrain,
            "water",
            colors.water,
            colors.infrastructure,
          ],
          "circle-radius": 7,
          "circle-stroke-color": "#071018",
          "circle-stroke-width": 2,
        },
      });

      map.on("click", "findings-circle", (event: MapLayerMouseEvent) => {
        const pickedId = event.features?.[0]?.properties?.id;
        const picked = findings.find((finding) => finding.id === pickedId);
        if (picked) {
          setSelected(picked);
          setDetailsOpen(true);
          setAnalysisOpen(false);
          setStatus("FINDING SELECTED");
        }
      });

      const dataLayerIds = [
        "layer-vegetation-fill",
        "layer-vegetation-line",
        "layer-expansion-fill",
        "layer-expansion-line",
        "layer-terrain-line",
        "layer-water-fill",
        "layer-water-line",
        "layer-infrastructure-line",
      ];
      dataLayerIds.forEach((id) => {
        map.on("mouseenter", id, () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", id, () => { map.getCanvas().style.cursor = ""; });
      });

      map.on("click", "layer-water-line", () => setStatus("WATER LAYER CONTEXT SELECTED"));
      map.on("click", "layer-terrain-line", () => setStatus("TERRAIN CONTEXT SELECTED"));

      map.on("move", () => {
        const center = map.getCenter();
        setView({ lat: center.lat, lon: center.lng, zoom: map.getZoom() });
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    map.setProjection({ type: projection });
    if (projection === "globe") {
      map.setTerrain({ source: "terrain-dem", exaggeration: 1.2 });
      map.setPitch(45);
    } else {
      map.setTerrain(null);
      map.setPitch(0);
    }

    const hillshadeVisible = projection === "globe" && active.terrain && showDemoData;
    if (map.getLayer("terrain-hillshade")) {
      map.setLayoutProperty("terrain-hillshade", "visibility", hillshadeVisible ? "visible" : "none");
    }
  }, [projection, active.terrain, showDemoData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const perCategory = showDemoData ? syntheticLayerData[comparisonYear] : null;
    const setLayerData = (id: string, data: LayerFeatureCollection) => {
      const source = map.getSource(id) as GeoJSONSource | undefined;
      if (source) source.setData(data);
    };

    setLayerData("layer-vegetation", perCategory?.vegetation ?? emptyCollection);
    setLayerData("layer-expansion", perCategory?.expansion ?? emptyCollection);
    setLayerData("layer-terrain", perCategory?.terrain ?? emptyCollection);
    setLayerData("layer-water", perCategory?.water ?? emptyCollection);
    setLayerData("layer-infrastructure", perCategory?.infrastructure ?? emptyCollection);

    const markerSource = map.getSource("findings") as GeoJSONSource | undefined;
    if (markerSource) {
      markerSource.setData({
        type: "FeatureCollection",
        features: visibleFindings.map((finding) => ({
          type: "Feature",
          properties: { id: finding.id, category: finding.category },
          geometry: { type: "Point", coordinates: finding.coordinates },
        })),
      });
    }

    const visibilityByCategory: Record<Category, "visible" | "none"> = {
      vegetation: showDemoData && active.vegetation ? "visible" : "none",
      expansion: showDemoData && active.expansion ? "visible" : "none",
      terrain: showDemoData && active.terrain ? "visible" : "none",
      water: showDemoData && active.water ? "visible" : "none",
      infrastructure: showDemoData && active.infrastructure ? "visible" : "none",
    };

    const setVisibility = (layerId: string, visibility: "visible" | "none") => {
      if (map.getLayer(layerId)) map.setLayoutProperty(layerId, "visibility", visibility);
    };

    setVisibility("layer-vegetation-fill", visibilityByCategory.vegetation);
    setVisibility("layer-vegetation-line", visibilityByCategory.vegetation);
    setVisibility("layer-expansion-fill", visibilityByCategory.expansion);
    setVisibility("layer-expansion-line", visibilityByCategory.expansion);
    setVisibility("layer-terrain-line", visibilityByCategory.terrain);
    setVisibility("layer-water-fill", visibilityByCategory.water);
    setVisibility("layer-water-line", visibilityByCategory.water);
    setVisibility("layer-infrastructure-line", visibilityByCategory.infrastructure);
    setVisibility("findings-circle", showDemoData ? "visible" : "none");
    setVisibility("terrain-hillshade", projection === "globe" && visibilityByCategory.terrain === "visible" ? "visible" : "none");
  }, [active, comparisonYear, projection, showDemoData, visibleFindings]);

  useEffect(() => {
    const focus = (event: Event) => {
      const detail = (event as CustomEvent<[number, number]>).detail;
      flyTo(detail);
    };
    document.addEventListener("focus-finding", focus);
    return () => document.removeEventListener("focus-finding", focus);
  });

  const flyTo = (coordinates = SATARA) => {
    mapRef.current?.flyTo({
      center: coordinates,
      zoom: 12.5,
      pitch: projection === "globe" ? 45 : 0,
      duration: 1000,
    });
  };

  const runSearch = async () => {
    const term = search.trim().toLowerCase();
    if (!term) return;

    setSearchBusy(true);
    try {
      if (showDemoData) {
        const finding = findings.find(
          (item) =>
            item.title.toLowerCase().includes(term)
            || item.location.toLowerCase().includes(term)
            || categoryLabels[item.category].toLowerCase().includes(term),
        );
        if (finding) {
          setSelected(finding);
          setDetailsOpen(true);
          flyTo(finding.coordinates);
          setStatus("DEMO MODE · FINDING SEARCH MATCH");
          return;
        }
      }

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(search.trim())}`,
      );
      if (!response.ok) throw new Error(`Search service unavailable (${response.status})`);
      const results: Array<{ lat: string; lon: string; display_name: string }> = await response.json();
      if (!results.length) {
        setStatus(`NO LOCATION RESULT FOR "${search.trim()}"`);
        return;
      }

      const result = results[0];
      const lat = Number(result.lat);
      const lon = Number(result.lon);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        mapRef.current?.flyTo({ center: [lon, lat], zoom: 11.5, duration: 1100 });
        setStatus(`LOCATION SEARCH RESULT · ${result.display_name.slice(0, 48)}...`);
      } else {
        setStatus("LOCATION SEARCH RETURNED INVALID COORDINATES");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown search error";
      setStatus(`SEARCH ERROR · ${message}`);
    } finally {
      setSearchBusy(false);
    }
  };

  const toggleCategory = (category: Category) => {
    setActive((state) => ({ ...state, [category]: !state[category] }));
  };

  const resetView = () => {
    setActive(defaultActive);
    setFilter("all");
    setComparisonYear(2024);
    setMode("demo");
    setSelected(findings[0]);
    setStatus("DEMO MODE · BASELINE VIEW RESET");
    flyTo();
  };

  const activateMode = (nextMode: DataMode) => {
    if (nextMode === "real" && !realDataConnected) {
      setMode("real");
      setStatus("REAL DATA MODE · NO CONNECTED DATASET (SHOWING BASEMAP ONLY)");
      return;
    }
    setMode(nextMode);
    setStatus(nextMode === "demo" ? "DEMO MODE · SYNTHETIC LAYERS ACTIVE" : "REAL DATA MODE · CONNECTED DATASET");
  };

  const selectedSnapshot = selected ? selected.snapshots[comparisonYear] : null;

  return (
    <main className="app-shell">
      <div ref={mapNode} className="map-canvas" />
      <div className="map-vignette" />

      <header className="topbar">
        <button className="brand" onClick={() => flyTo()}>
          <span className="brand-mark"><Activity size={18} /></span>
          <span>
            <strong>CITY 3D X-RAY</strong>
            <small>URBAN INTELLIGENCE / SATARA</small>
          </span>
        </button>

        <div className="search-box">
          <Search size={15} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") void runSearch(); }}
            placeholder="Search findings, locations, or layers..."
          />
          <button onClick={() => void runSearch()} disabled={searchBusy}>{searchBusy ? "..." : "GO"}</button>
        </div>

        <div className="mode-switch">
          <button className={`mode-chip ${mode === "demo" ? "active" : ""}`} onClick={() => activateMode("demo")}>DEMO MODE</button>
          <button className={`mode-chip ${mode === "real" ? "active" : ""} ${!realDataConnected ? "disabled" : ""}`} onClick={() => activateMode("real")}>REAL DATA MODE</button>
        </div>

        <div className="top-actions">
          <span className="status-dot" />
          <span className="desktop-only">{mode === "demo" ? "SIMULATED ANALYSIS" : "REAL DATA NOT CONNECTED"}</span>
          <button className="icon-button" aria-label="Settings"><Settings2 size={17} /></button>
        </div>
      </header>

      <aside className={`left-panel ${sidebarOpen ? "" : "collapsed"}`}>
        <button className="collapse left-collapse" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {sidebarOpen && (
          <>
            <div className="panel-heading">
              <span><Layers3 size={16} /> ANALYSIS LAYERS</span>
              <span className="live-pill">{mode === "demo" ? "DEMO" : "REAL"}</span>
            </div>

            {mode === "demo" ? (
              <div className="notice">
                <span className="warning">!</span>
                <div>
                  <strong>SIMULATED DEMO DATA</strong>
                  <p>Analysis overlays and finding metrics are synthetic placeholders. Basemap is real and separate.</p>
                </div>
              </div>
            ) : (
              <div className="notice real">
                <span className="warning">i</span>
                <div>
                  <strong>REAL DATA MODE</strong>
                  <p>No external dataset is connected yet. Basemap stays available while analysis layers are disabled.</p>
                </div>
              </div>
            )}

            <section className="control-section">
              <label className="section-label">SCENARIO</label>
              <select value={scenario} onChange={(event) => setScenario(event.target.value)} disabled={mode === "real" && !realDataConnected}>
                <option value="satara-urban-pilot">Satara urban change / pilot</option>
                <option value="satara-monsoon-demo">Monsoon drainage review / demo</option>
              </select>
            </section>

            <section className="control-section">
              <label className="section-label">COMPARISON WINDOW</label>
              <div className="period-row">
                <button onClick={() => setComparisonYear(2018)} className={comparisonYear === 2018 ? "selected" : ""}>2018</button>
                <span>→</span>
                <button onClick={() => setComparisonYear(2024)} className={comparisonYear === 2024 ? "selected" : ""}>2024</button>
              </div>
              <div className="period-readout">
                {comparisonYear === 2018 ? "Baseline year selected" : "Change year selected"}
                <span>{mode === "demo" ? "synthetic comparison state" : "dataset connection required"}</span>
              </div>
            </section>

            <section className="control-section">
              <label className="section-label">VISIBLE LAYERS</label>
              {(Object.keys(categoryLabels) as Category[]).map((category) => (
                <button className="layer-row" key={category} onClick={() => toggleCategory(category)}>
                  <span className={`layer-icon ${category}`}><LayerIcon category={category} /></span>
                  <span>{categoryLabels[category]}</span>
                  <span className={`toggle ${active[category] ? "on" : ""}`}><i /></span>
                </button>
              ))}
            </section>

            <section className="control-section">
              <label className="section-label">FINDING FILTER</label>
              <div className="filter-grid">
                <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All <b>{showDemoData ? visibleFindings.length : 0}</b></button>
                {(Object.keys(categoryLabels) as Category[]).map((category) => (
                  <button className={filter === category ? "active" : ""} key={category} onClick={() => setFilter(category)}>
                    {categoryLabels[category].split(" ")[0]} <b>{showDemoData ? findings.filter((finding) => finding.category === category).length : 0}</b>
                  </button>
                ))}
              </div>
            </section>

            <section className="control-section">
              <label className="section-label">LAYER LEGEND</label>
              <ul className="legend-list">
                {(Object.keys(categoryLabels) as Category[]).map((category) => (
                  <li key={category} className="legend-item">
                    <span className={`legend-dot ${category}`} />
                    <span>{categoryLabels[category]}</span>
                  </li>
                ))}
              </ul>
              <p className="section-note">Layer styles are category-specific. Values shown in DEMO MODE are simulated only.</p>
            </section>

            <div className="sidebar-footer">
              <button onClick={resetView}><LocateFixed size={14} /> RESET VIEW</button>
            </div>
          </>
        )}
      </aside>

      <aside className={`right-panel ${detailsOpen ? "" : "hidden"}`}>
        <button className="collapse right-collapse" onClick={() => setDetailsOpen(!detailsOpen)}><PanelRight size={15} /></button>
        <div className="panel-heading">
          <span><CircleDot size={16} /> SELECTED FINDING</span>
          <span className="finding-count">{showDemoData ? visibleFindings.length : 0} ACTIVE</span>
        </div>
        {selected && selectedSnapshot && showDemoData ? (
          <FindingCard
            finding={selected}
            snapshot={selectedSnapshot}
            year={comparisonYear}
            analysisOpen={analysisOpen}
            onToggleAnalysis={() => setAnalysisOpen((state) => !state)}
            onClose={() => setSelected(null)}
          />
        ) : (
          <div className="empty-state">
            <MapIcon size={32} />
            <p>
              {mode === "real"
                ? "Real Data Mode is selected, but no dataset is connected yet."
                : "Select a marker on the map to inspect its evidence card."}
            </p>
          </div>
        )}
      </aside>

      {!detailsOpen && <button className="open-details" onClick={() => setDetailsOpen(true)}><PanelRight size={17} /></button>}

      <div className="view-switch">
        <button className={projection === "globe" ? "active" : ""} onClick={() => setProjection("globe")}><Globe2 size={14} /> 3D GLOBE + TERRAIN</button>
        <button className={projection === "mercator" ? "active" : ""} onClick={() => setProjection("mercator")}><MapIcon size={14} /> 2D MAP</button>
      </div>

      <div className="bottom-bar">
        <div><span className="coord-label">CENTER</span><b>{view.lat.toFixed(4)}° N, {view.lon.toFixed(4)}° E</b></div>
        <div className="bar-separator" />
        <div><span className="coord-label">ZOOM</span><b>{view.zoom.toFixed(2)}</b></div>
        <div className="bar-separator" />
        <div className="data-status"><span className="status-dot" /><b>{status}</b></div>
        <div className="attribution">© OpenFreeMap · © OpenStreetMap contributors · Terrain: MapLibre Demo Tiles</div>
      </div>
    </main>
  );
}

function LayerIcon({ category }: { category: Category }) {
  if (category === "vegetation") return <TreePine size={15} />;
  if (category === "expansion") return <Building2 size={15} />;
  if (category === "terrain") return <Mountain size={15} />;
  if (category === "water") return <Droplets size={15} />;
  return <Waves size={15} />;
}

type FindingCardProps = {
  finding: Finding;
  snapshot: Finding["snapshots"][ComparisonYear];
  year: ComparisonYear;
  analysisOpen: boolean;
  onToggleAnalysis: () => void;
  onClose: () => void;
};

function FindingCard({ finding, snapshot, year, analysisOpen, onToggleAnalysis, onClose }: FindingCardProps) {
  return (
    <div className="finding-card">
      <div className="card-topline">
        <span className={`category-tag ${finding.category}`}>{categoryLabels[finding.category]}</span>
        <button onClick={onClose} aria-label="Close finding"><X size={15} /></button>
      </div>
      <h2>{finding.title}</h2>
      <div className="simulated-badge">SIMULATED DEMO DATA</div>

      <div className="metric">
        <span>{snapshot.metricLabel}</span>
        <strong>{snapshot.metricValue}</strong>
      </div>

      <p className="observation">{snapshot.observation}</p>
      <dl>
        <div><dt>LOCATION</dt><dd>{finding.location}</dd></div>
        <div><dt>OBSERVATION DATE</dt><dd>{snapshot.date}</dd></div>
        <div><dt>DATASET</dt><dd>{snapshot.dataset}</dd></div>
        <div><dt>SOURCE</dt><dd>{finding.source}</dd></div>
        <div><dt>METHODOLOGY</dt><dd>{finding.methodology}</dd></div>
        <div><dt>COMPARISON STATE</dt><dd>{year === 2018 ? "Baseline (2018)" : "Comparison Year (2024)"}</dd></div>
        <div><dt>CONFIDENCE</dt><dd><span className={`confidence ${snapshot.confidence.toLowerCase()}`}>{snapshot.confidence}</span></dd></div>
      </dl>

      <div className="limitations">
        <strong>LIMITATIONS</strong>
        <p>{finding.limitations}</p>
      </div>

      <button className="analysis-button" onClick={onToggleAnalysis}>{analysisOpen ? "HIDE DETAILED ANALYSIS" : "OPEN DETAILED ANALYSIS"}</button>
      {analysisOpen && (
        <div className="analysis-panel">
          <div className="analysis-grid">
            <div><span>{snapshot.analysis.areaLabel}</span><strong>{snapshot.analysis.areaValue}</strong></div>
            <div><span>{snapshot.analysis.signalLabel}</span><strong>{snapshot.analysis.signalValue}</strong></div>
          </div>
          <ul>
            {snapshot.analysis.notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </div>
      )}

      <button className="focus-button" onClick={() => document.dispatchEvent(new CustomEvent("focus-finding", { detail: finding.coordinates }))}>
        FOCUS ON LOCATION <ChevronRight size={14} />
      </button>
    </div>
  );
}

export default App;
