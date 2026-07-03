import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";
import MapCanvas from "./components/MapCanvas";
import { calculatePolygonArea } from "./utils/geoUtils";
import { CheckCircle, AlertCircle, Info, X, Moon, Sun } from "lucide-react";

export default function App() {
  // App layouts
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Unified GIS State
  const [gisState, setGisState] = useState({
    markers: [],
    polygon: [],
    mode: "idle", // 'idle' | 'add-marker' | 'draw-polygon'
  });

  // Track whether the active polygon is closed/finished
  const [isPolygonFinished, setIsPolygonFinished] = useState(true);

  // Metadata States
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const [mapboxTokenStatus] = useState(mapboxToken ? "configured" : "fallback");
  const [toast, setToast] = useState(null);
  const [focusedMarker, setFocusedMarker] = useState(null);
  const [fitViewTrigger, setFitViewTrigger] = useState(0);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    try {
      return localStorage.getItem("varaha-theme") || "dark";
    } catch (err) {
      return "dark";
    }
  });
  const isDarkTheme = theme === "dark";

  useEffect(() => {
    try {
      localStorage.setItem("varaha-theme", theme);
    } catch (err) {
      // ignore storage errors in unsupported environments
    }
  }, [theme]);

  // Auto-dismiss toast logic
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Show status changes or alerts
  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  // Set interaction mode
  const setMode = (newMode) => {
    setGisState((prev) => {
      let updatedPolygon = [...prev.polygon];

      if (newMode === "draw-polygon") {
        // If they enter draw-polygon mode, and the current polygon is unfinished,
        // clear it because they are starting a new polygon drawing session.
        if (!isPolygonFinished) {
          updatedPolygon = [];
        }
      }

      return {
        ...prev,
        mode: newMode,
        polygon: updatedPolygon,
      };
    });
  };

  // Add Coordinate Marker
  const addMarker = (lng, lat) => {
    setGisState((prev) => {
      const newMarker = {
        id: `marker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `Marker #${prev.markers.length + 1}`,
        lat,
        lng,
      };
      // Trigger side-effect toast
      setTimeout(
        () => showToast(`Placed ${newMarker.name} at coordinates`, "success"),
        0,
      );
      return {
        ...prev,
        markers: [...prev.markers, newMarker],
      };
    });
  };

  // Delete Coordinate Marker
  const deleteMarker = (id) => {
    setGisState((prev) => {
      const target = prev.markers.find((m) => m.id === id);
      if (target) {
        setTimeout(() => showToast(`Removed ${target.name}`, "info"), 0);
      }
      const updatedMarkers = prev.markers.filter((m) => m.id !== id);
      // Re-index remaining marker names for consistency
      const reindexedMarkers = updatedMarkers.map((m, index) => ({
        ...m,
        name: `Marker #${index + 1}`,
      }));
      return {
        ...prev,
        markers: reindexedMarkers,
      };
    });
  };

  // Focus Map on Marker
  const focusMarker = (marker) => {
    setFocusedMarker(marker);
    showToast(`Centering map on ${marker.name}`, "info");
    // Clear trigger after click resolves
    setTimeout(() => setFocusedMarker(null), 1000);
  };

  // Add Vertex to Polygon
  const addPolygonVertex = (coord) => {
    setGisState((prev) => {
      let currentPolygon = [...prev.polygon];

      // If we had a finished polygon and we click the map to draw, clear it first
      // to start drawing a new polygon.
      if (isPolygonFinished) {
        currentPolygon = [];
        setIsPolygonFinished(false);
      }

      const newPolygon = [...currentPolygon, coord];
      setTimeout(
        () =>
          showToast(`Added vertex #${newPolygon.length} to boundary`, "info"),
        0,
      );
      return {
        ...prev,
        polygon: newPolygon,
      };
    });
  };

  // Close/Finish Polygon
  const finishPolygon = () => {
    if (gisState.polygon.length < 3) return;
    setIsPolygonFinished(true);
    setGisState((prev) => ({
      ...prev,
      mode: "idle",
    }));
    showToast("Polygon finished and area calculated!", "success");
  };

  // Clear Polygon only
  const clearPolygon = () => {
    setGisState((prev) => ({
      ...prev,
      polygon: [],
    }));
    setIsPolygonFinished(true);
    showToast("Polygon boundaries cleared", "info");
  };

  // Clear Sandbox Canvas
  const clearAll = () => {
    setGisState({
      markers: [],
      polygon: [],
      mode: "idle",
    });
    setIsPolygonFinished(true);
    showToast("Cleared all canvas layers", "info");
  };

  // Save Sandbox state to LocalStorage
  const saveData = () => {
    try {
      const stateToSave = {
        markers: gisState.markers,
        polygon: gisState.polygon,
        mode: gisState.mode,
        isPolygonFinished,
      };
      localStorage.setItem("gis_state", JSON.stringify(stateToSave));
      showToast("GIS state saved to local storage", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save GIS state", "error");
    }
  };

  // Load Saved state from LocalStorage
  const loadData = () => {
    try {
      const saved = localStorage.getItem("gis_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        setGisState({
          markers: parsed.markers || [],
          polygon: parsed.polygon || [],
          mode: parsed.mode || "idle",
        });
        setIsPolygonFinished(
          parsed.isPolygonFinished !== undefined
            ? parsed.isPolygonFinished
            : true,
        );
        showToast("GIS state successfully loaded", "success");
      } else {
        showToast("No saved GIS state found", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error parsing loaded state", "error");
    }
  };

  // Compute active geodesic polygon area using Turf.js in geoUtils.js
  const area =
    isPolygonFinished && gisState.polygon.length >= 3
      ? calculatePolygonArea(gisState.polygon)
      : 0;

  return (
    <div
      className={`relative w-screen h-screen flex overflow-hidden ${isDarkTheme ? "bg-[#060814] text-slate-100" : "bg-slate-100 text-slate-900"}`}
    >
      {/* Sidebar - Collapsible & floating on mobile */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        mode={gisState.mode}
        markers={gisState.markers}
        deleteMarker={deleteMarker}
        focusMarker={focusMarker}
        polygon={gisState.polygon}
        clearPolygon={clearPolygon}
        isPolygonFinished={isPolygonFinished}
        area={area}
        isDarkTheme={isDarkTheme}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 h-full flex flex-col relative transition-all duration-300 ${
          sidebarOpen ? "md:ml-[300px]" : "ml-0"
        }`}
      >
        {/* Floating Top Header / Toolbar */}
        <header className="absolute top-20 md:top-4 left-4 right-4 z-20 pointer-events-none">
          <div className="max-w-5xl mx-auto pointer-events-auto">
            <Toolbar
              mode={gisState.mode}
              setMode={setMode}
              polygonCount={gisState.polygon.length}
              finishPolygon={finishPolygon}
              clearAll={clearAll}
              saveData={saveData}
              loadData={loadData}
              mapboxTokenStatus={mapboxTokenStatus}
              triggerFitView={() => setFitViewTrigger((prev) => prev + 1)}
              isDarkTheme={isDarkTheme}
              toggleTheme={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
              }
            />
          </div>
        </header>

        {/* Mapbox Canvas */}
        <main className="w-full h-full z-10">
          <MapCanvas
            mode={gisState.mode}
            markers={gisState.markers}
            addMarker={addMarker}
            polygon={gisState.polygon}
            addPolygonVertex={addPolygonVertex}
            focusedMarker={focusedMarker}
            isPolygonFinished={isPolygonFinished}
            isDarkTheme={isDarkTheme}
            mapboxTokenStatus={mapboxTokenStatus}
            fitViewTrigger={fitViewTrigger}
          />
        </main>
      </div>

      {/* Toast Notification HUD */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="relative bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-xl p-4 shadow-2xl flex items-center space-x-3 max-w-sm">
            {/* Status Type Icon */}
            {toast.type === "success" && (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-indigo-400 shrink-0" />
            )}

            {/* Content text */}
            <p className="text-xs font-medium text-slate-200 pr-4">
              {toast.message}
            </p>

            {/* Manual Dismiss */}
            <button
              onClick={() => setToast(null)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress countdown indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 rounded-b-xl overflow-hidden">
              <div
                className={`h-full transition-all duration-4000 ease-linear ${
                  toast.type === "success"
                    ? "bg-emerald-500"
                    : toast.type === "error"
                      ? "bg-rose-500"
                      : "bg-indigo-500"
                }`}
                style={{
                  animation: "shrink 4s linear forwards",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Embedded shrink animation */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
