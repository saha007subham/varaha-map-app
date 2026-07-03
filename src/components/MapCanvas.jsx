import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Globe } from "lucide-react";
import { useMapInitialization } from "../hooks/useMapInitialization";
import { useMarkers } from "../hooks/useMarkers";
import { usePolygon } from "../hooks/usePolygon";

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
  // Use custom hooks for map initialization, markers, and polygon
  const { mapRef, mapContainerRef, mapLoaded, mapStatus, polygonSyncTrigger } =
    useMapInitialization(
      mode,
      addMarker,
      addPolygonVertex,
      isDarkTheme,
      isPolygonFinished,
    );

  const { markersRef } = useMarkers(mapRef, mapLoaded, markers);
  const { polygonMarkersRef } = usePolygon(
    mapRef,
    mapLoaded,
    polygon,
    isPolygonFinished,
    polygonSyncTrigger,
  );

  // Keep refs for fitView logic
  const markersRefForFit = useRef(markers);
  const polygonRefForFit = useRef(polygon);

  useEffect(() => {
    markersRefForFit.current = markers;
  }, [markers]);

  useEffect(() => {
    polygonRefForFit.current = polygon;
  }, [polygon]);

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
