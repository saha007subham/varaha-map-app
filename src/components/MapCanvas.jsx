import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Globe } from "lucide-react";
import { getStyleDefinition } from "../utils/mapStyles";

// Initialize Mapbox Access Token synchronously at file load time
const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = token;

export default function MapCanvas({
  mode,
  markers,
  addMarker,
  polygon,
  addPolygonVertex,
  focusedMarker,
  isPolygonFinished,
  isDarkTheme,
  mapboxTokenStatus,
  fitViewTrigger,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({}); // Store active mapboxgl.Marker instances by ID
  const polygonMarkersRef = useRef([]); // Store temporary vertex dots

  const [mapLoaded, setMapLoaded] = useState(false);
  const [polygonSyncTrigger, setPolygonSyncTrigger] = useState(0);

  // Bottom-left Map HUD coordinates status state
  const [mapStatus, setMapStatus] = useState({
    lat: 12.9716,
    lng: 77.5946,
    zoom: 11.0,
  });

  const addMarkerRef = useRef(addMarker);
  const addPolygonVertexRef = useRef(addPolygonVertex);
  const markersRefForFit = useRef(markers);
  const polygonRefForFit = useRef(polygon);

  useEffect(() => {
    addMarkerRef.current = addMarker;
  }, [addMarker]);

  useEffect(() => {
    addPolygonVertexRef.current = addPolygonVertex;
  }, [addPolygonVertex]);

  useEffect(() => {
    markersRefForFit.current = markers;
  }, [markers]);

  useEffect(() => {
    polygonRefForFit.current = polygon;
  }, [polygon]);

  // Track map style to skip redundant setStyle calls
  const currentStyleRef = useRef(getStyleDefinition(isDarkTheme, !!token));

  // Create Map Instance exactly once on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize using correct theme immediately on load
    const initialStyle = getStyleDefinition(isDarkTheme, !!token);

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [77.5946, 12.9716], // Bangalore default center
      zoom: 11,
      attributionControl: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    mapRef.current = map;

    // Track map coordinates and zoom levels
    const updateStatus = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      setMapStatus({
        lat: center.lat,
        lng: center.lng,
        zoom: zoom,
      });
    };

    map.on("move", updateStatus);
    map.on("zoom", updateStatus);

    map.on("load", () => {
      setMapLoaded(true);
    });

    // Re-bind GeoJSON polygon sources & layers dynamically on style load events.
    // (setStyle drops custom style layers & sources from the map canvas structure)
    map.on("style.load", () => {
      if (!map.getSource("polygon-data")) {
        map.addSource("polygon-data", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });

        // Fill layer for closed Polygon
        map.addLayer({
          id: "polygon-fill",
          type: "fill",
          source: "polygon-data",
          paint: {
            "fill-color": "#818cf8",
            "fill-opacity": 0.2,
          },
          filter: ["==", "$type", "Polygon"],
        });

        // Border outline
        map.addLayer({
          id: "polygon-stroke",
          type: "line",
          source: "polygon-data",
          paint: {
            "line-color": "#6366f1",
            "line-width": 3,
          },
        });
      }

      // Signal the polygon sync effect to re-inject coordinates
      setPolygonSyncTrigger((prev) => prev + 1);
    });

    // Click handler for interaction modes
    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      window.__mapModeRef = window.__mapModeRef || "idle";

      if (window.__mapModeRef === "add-marker") {
        addMarkerRef.current(lng, lat);
      } else if (window.__mapModeRef === "draw-polygon") {
        addPolygonVertexRef.current([lng, lat]);
      }
    });

    // Watch for size adjustments
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.off("move", updateStatus);
      map.off("zoom", updateStatus);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update existing map style using setStyle() when theme state changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const targetStyle = getStyleDefinition(isDarkTheme, !!token);

    // Compare style configurations to skip redundant updates
    const hasStyleChanged =
      typeof targetStyle === "string"
        ? currentStyleRef.current !== targetStyle
        : JSON.stringify(currentStyleRef.current) !==
          JSON.stringify(targetStyle);

    if (hasStyleChanged) {
      mapRef.current.setStyle(targetStyle);
      currentStyleRef.current = targetStyle;
    }
  }, [isDarkTheme, mapLoaded]);

  // Keep interaction mode reference updated for the click handler
  useEffect(() => {
    window.__mapModeRef = mode;

    if (mapRef.current) {
      const canvas = mapRef.current.getCanvas();
      if (mode === "add-marker") {
        canvas.style.cursor = "pointer"; // pointer cursor for adding markers
      } else if (mode === "draw-polygon") {
        canvas.style.cursor = "crosshair"; // crosshair cursor for drawing polygons
      } else {
        canvas.style.cursor = "";
      }
    }
  }, [mode]);

  // Disable Mapbox double-click zoom while drawing an active polygon
  useEffect(() => {
    if (!mapRef.current) return;
    if (mode === "draw-polygon" && !isPolygonFinished) {
      mapRef.current.doubleClickZoom.disable();
    } else {
      mapRef.current.doubleClickZoom.enable();
    }
  }, [mode, isPolygonFinished]);

  // Sync Markers Array and number them dynamically
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const currentMarkers = { ...markersRef.current };
    const newMarkers = {};

    markers.forEach((m, index) => {
      const markerNumber = index + 1;

      if (currentMarkers[m.id]) {
        // Marker exists, update number inside the custom DOM node
        const markerInstance = currentMarkers[m.id];
        const el = markerInstance.getElement();
        const numEl = el.querySelector(".marker-number");
        if (numEl) {
          numEl.textContent = markerNumber;
        }

        newMarkers[m.id] = markerInstance;
        delete currentMarkers[m.id];
      } else {
        // Create custom HTML marker element
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="absolute -top-1 w-6 h-6 bg-emerald-500/30 rounded-full animate-ping opacity-75"></div>
            <div class="relative w-7 h-7 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-black/50">
              <span class="marker-number text-[11px] font-bold text-emerald-400">${markerNumber}</span>
            </div>
          </div>
        `;

        // Create Popup
        const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(`
          <div class="text-left font-sans">
            <p class="font-bold text-sm text-slate-100 mb-1">${m.name}</p>
            <div class="space-y-0.5 text-[10px] text-slate-400 font-mono">
              <p>Lat: ${m.lat.toFixed(6)}</p>
              <p>Lng: ${m.lng.toFixed(6)}</p>
            </div>
          </div>
        `);

        // Mount Marker
        const markerInstance = new mapboxgl.Marker({ element: el })
          .setLngLat([m.lng, m.lat])
          .setPopup(popup)
          .addTo(mapRef.current);

        newMarkers[m.id] = markerInstance;
      }
    });

    // Remove obsolete markers from map
    Object.keys(currentMarkers).forEach((id) => {
      currentMarkers[id].remove();
    });

    markersRef.current = newMarkers;
  }, [markers, mapLoaded]);

  // Sync Polygon Layer and Draw vertex dots
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const source = mapRef.current.getSource("polygon-data");
    if (source) {
      const features = [];

      if (polygon.length > 0) {
        if (isPolygonFinished && polygon.length >= 3) {
          // Closed polygon loop
          const closedCoords = [...polygon, polygon[0]];
          features.push({
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [closedCoords],
            },
            properties: {},
          });
        } else {
          // Open line string while actively drawing
          features.push({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: polygon,
            },
            properties: {},
          });
        }
      }

      source.setData({
        type: "FeatureCollection",
        features,
      });
    }

    // Draw vertex corner dots on the map
    // Clear old vertex markers
    polygonMarkersRef.current.forEach((marker) => marker.remove());
    polygonMarkersRef.current = [];

    // Place new vertex dots on map (only if we are still drawing/unfinished)
    if (!isPolygonFinished) {
      polygon.forEach((coord, idx) => {
        const el = document.createElement("div");
        el.className =
          "w-3 h-3 rounded-full border-2 bg-white border-indigo-600 shadow-md cursor-pointer transition-transform hover:scale-125";

        const markerInstance = new mapboxgl.Marker({ element: el })
          .setLngLat(coord)
          .addTo(mapRef.current);

        polygonMarkersRef.current.push(markerInstance);
      });
    }
  }, [polygon, isPolygonFinished, mapLoaded, polygonSyncTrigger]);

  // Fly to target marker when focused
  useEffect(() => {
    if (!mapRef.current || !focusedMarker) return;
    mapRef.current.flyTo({
      center: [focusedMarker.lng, focusedMarker.lat],
      zoom: 14,
      essential: true,
    });
  }, [focusedMarker]);

  // Fit View Bounds Logic
  useEffect(() => {
    if (!mapRef.current || fitViewTrigger === 0) return;

    const points = [];
    markersRefForFit.current.forEach((m) => points.push([m.lng, m.lat]));
    polygonRefForFit.current.forEach((coord) => points.push(coord));

    if (points.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    points.forEach((p) => bounds.extend(p));

    mapRef.current.fitBounds(bounds, {
      padding: 60,
      maxZoom: 15,
      duration: 1200,
    });
  }, [fitViewTrigger]);

  return (
    <div className="relative w-full h-full">
      {/* Map Loading State screen overlay */}
      {!mapLoaded && (
        <div
          className={`absolute inset-0 z-30 flex flex-col items-center justify-center space-y-4 transition-all duration-300 ${
            isDarkTheme
              ? "bg-slate-950/95 text-slate-300"
              : "bg-slate-50/95 text-slate-700"
          }`}
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full border-4 ${
                isDarkTheme
                  ? "border-indigo-500/20 border-t-indigo-400"
                  : "border-indigo-500/10 border-t-indigo-500"
              } animate-spin`}
            ></div>
          </div>
          <p
            className={`text-xs font-semibold uppercase tracking-widest animate-pulse ${
              isDarkTheme ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Initializing GIS Sandbox...
          </p>
        </div>
      )}

      {/* Drawing Mode Helper Overlay */}
      {mode === "draw-polygon" && !isPolygonFinished && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 px-4.5 py-2.5 rounded-xl bg-indigo-950/85 backdrop-blur-md border border-indigo-500/20 shadow-2xl text-xs font-semibold text-slate-200 pointer-events-none flex items-center space-x-2 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
          <span>
            Click to add polygon vertices. Click Finish Polygon when complete.
          </span>
        </div>
      )}

      {/* Target Canvas Container with theme-aware background to prevent flashing */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full transition-colors duration-300 ${
          isDarkTheme ? "bg-slate-950" : "bg-slate-100"
        }`}
      />

      {/* Bottom-left Map HUD coordinates status bar */}
      <div
        className={`absolute bottom-4 left-4 z-10 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 px-3.5 py-2.5 rounded-xl backdrop-blur-md border shadow-xl pointer-events-none text-[10px] font-mono ${isDarkTheme ? "bg-slate-950/85 border-slate-900 text-slate-300" : "bg-white/85 border-slate-200 text-slate-700"}`}
      >
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
          <span
            className={`uppercase font-semibold ${isDarkTheme ? "text-slate-400" : "text-slate-600"}`}
          >
            Lat:
          </span>
          <span
            className={`font-medium ${isDarkTheme ? "text-slate-100" : "text-slate-800"}`}
          >
            {mapStatus.lat.toFixed(6)}
          </span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span
            className={`uppercase font-semibold ${isDarkTheme ? "text-slate-400" : "text-slate-600"}`}
          >
            Lng:
          </span>
          <span
            className={`font-medium ${isDarkTheme ? "text-slate-100" : "text-slate-800"}`}
          >
            {mapStatus.lng.toFixed(6)}
          </span>
        </div>
        <div
          className={`hidden md:block w-px h-3.5 ${isDarkTheme ? "bg-slate-800" : "bg-slate-300"}`}
        ></div>
        <div className="flex items-center space-x-1.5">
          <span
            className={`uppercase font-semibold ${isDarkTheme ? "text-slate-400" : "text-slate-600"}`}
          >
            Zoom:
          </span>
          <span
            className={`font-medium ${isDarkTheme ? "text-slate-100" : "text-slate-800"}`}
          >
            {mapStatus.zoom.toFixed(1)}
          </span>
        </div>
        <div
          className={`hidden md:block w-px h-3.5 ${isDarkTheme ? "bg-slate-800" : "bg-slate-300"}`}
        ></div>
        <div
          className={`flex items-center space-x-1.5 ${isDarkTheme ? "text-slate-400" : "text-slate-500"}`}
        >
          <Globe className="w-3 h-3 text-indigo-400/80" />
          <span>EPSG:3857</span>
        </div>
      </div>
    </div>
  );
}
