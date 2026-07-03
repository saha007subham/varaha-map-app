import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { getStyleDefinition } from "../utils/mapStyles";

const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

/**
 * Custom hook for Mapbox map initialization and core setup
 * Handles: map creation, style management, polygon layers, status tracking, and click handlers
 * @param {string} mode - Current interaction mode (idle, add-marker, draw-polygon)
 * @param {Function} addMarker - Callback to add a marker
 * @param {Function} addPolygonVertex - Callback to add a polygon vertex
 * @param {boolean} isDarkTheme - Whether dark theme is enabled
 * @param {boolean} isPolygonFinished - Whether polygon drawing is finished
 * @returns {Object} { mapRef, mapContainerRef, mapLoaded, mapStatus, setPolygonSyncTrigger }
 */
export function useMapInitialization(
  mode,
  addMarker,
  addPolygonVertex,
  isDarkTheme,
  isPolygonFinished,
) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const currentStyleRef = useRef(getStyleDefinition(isDarkTheme, !!token));

  const [mapLoaded, setMapLoaded] = useState(false);
  const [polygonSyncTrigger, setPolygonSyncTrigger] = useState(0);
  const [mapStatus, setMapStatus] = useState({
    lat: 12.9716,
    lng: 77.5946,
    zoom: 11.0,
  });

  // Refs to keep callbacks current
  const addMarkerRef = useRef(addMarker);
  const addPolygonVertexRef = useRef(addPolygonVertex);

  useEffect(() => {
    addMarkerRef.current = addMarker;
  }, [addMarker]);

  useEffect(() => {
    addPolygonVertexRef.current = addPolygonVertex;
  }, [addPolygonVertex]);

  // Create Map Instance exactly once on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialStyle = getStyleDefinition(isDarkTheme, !!token);

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [77.5946, 12.9716],
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

    // Setup polygon layers on style load
    map.on("style.load", () => {
      if (!map.getSource("polygon-data")) {
        map.addSource("polygon-data", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });

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

  // Update map style when theme changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const targetStyle = getStyleDefinition(isDarkTheme, !!token);
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

  // Update interaction mode
  useEffect(() => {
    window.__mapModeRef = mode;

    if (mapRef.current) {
      const canvas = mapRef.current.getCanvas();
      if (mode === "add-marker") {
        canvas.style.cursor = "pointer";
      } else if (mode === "draw-polygon") {
        canvas.style.cursor = "crosshair";
      } else {
        canvas.style.cursor = "";
      }
    }
  }, [mode]);

  // Disable double-click zoom while drawing polygon
  useEffect(() => {
    if (!mapRef.current) return;
    if (mode === "draw-polygon" && !isPolygonFinished) {
      mapRef.current.doubleClickZoom.disable();
    } else {
      mapRef.current.doubleClickZoom.enable();
    }
  }, [mode, isPolygonFinished]);

  return {
    mapRef,
    mapContainerRef,
    mapLoaded,
    mapStatus,
    polygonSyncTrigger,
    setPolygonSyncTrigger,
  };
}
