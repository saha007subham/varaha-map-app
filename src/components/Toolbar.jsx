import React from "react";
import {
  MapPin,
  Hexagon,
  Trash2,
  Save,
  FolderOpen,
  HelpCircle,
  CheckCircle2,
  Maximize,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Toolbar({
  mode,
  setMode,
  polygonCount,
  finishPolygon,
  clearAll,
  saveData,
  loadData,
  mapboxTokenStatus,
  triggerFitView,
  isDarkTheme,
  toggleTheme,
  sidebarOpen,
  toggleSidebar,
}) {
  return (
    <div
      className={`flex flex-row flex-nowrap items-center justify-between gap-3 backdrop-blur-xl border rounded-2xl p-2.5 shadow-2xl overflow-x-auto w-full max-w-full scrollbar-none transition-colors duration-300 ${
        isDarkTheme
          ? "bg-[#242837] border-slate-700/80"
          : "bg-white/85 border-slate-200"
      }`}
    >
      {/* Interaction Mode Selection Group */}
      <div className="flex flex-row flex-nowrap items-center gap-2 shrink-0">
        <button
          onClick={() => setMode(mode === "add-marker" ? "idle" : "add-marker")}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-95 shrink-0 cursor-pointer outline-none border ${
            mode === "add-marker"
              ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-md shadow-emerald-500/20"
              : isDarkTheme
                ? "text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 border-slate-800/50 hover:border-slate-700/80"
                : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 hover:border-slate-400"
          }`}
          title="Place Coordinate Pin Markers"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Add Marker</span>
        </button>

        <button
          onClick={() =>
            setMode(mode === "draw-polygon" ? "idle" : "draw-polygon")
          }
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-95 shrink-0 cursor-pointer outline-none border ${
            mode === "draw-polygon"
              ? "bg-indigo-500 text-slate-950 border-indigo-500 shadow-md shadow-indigo-500/20"
              : isDarkTheme
                ? "text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 border-slate-800/50 hover:border-slate-700/80"
                : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 hover:border-slate-400"
          }`}
          title="Draw Area Boundaries"
        >
          <Hexagon className="w-3.5 h-3.5" />
          <span>Draw Polygon</span>
        </button>

        {/* Dedicated "Finish Polygon" button */}
        {mode === "draw-polygon" && (
          <button
            onClick={finishPolygon}
            disabled={polygonCount < 3}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-95 shrink-0 outline-none border ${
              polygonCount >= 3
                ? "bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-400 shadow-md shadow-amber-400/25 cursor-pointer"
                : isDarkTheme
                  ? "bg-slate-900/20 text-slate-600 border border-slate-900/60 cursor-not-allowed"
                  : "bg-slate-100/50 text-slate-400 border border-slate-200 cursor-not-allowed"
            }`}
            title={
              polygonCount >= 3
                ? "Close polygon shape and compute area"
                : "Place at least 3 vertices to finish"
            }
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Finish Polygon ({polygonCount})</span>
          </button>
        )}
      </div>

      {/* Semantic separation divider */}
      <div
        className={`w-px h-6 mx-1 hidden md:block shrink-0 ${
          isDarkTheme ? "bg-slate-800" : "bg-slate-300"
        }`}
      ></div>

      {/* Action Buttons: Fit View, Save, Load, Clear */}
      <div className="flex flex-row flex-nowrap items-center gap-2 shrink-0">
        <button
          onClick={toggleSidebar}
          className={`hidden max-[1300px]:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 shrink-0 cursor-pointer ${
            isDarkTheme
              ? "text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/50 hover:border-slate-700/80"
              : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 hover:border-slate-400"
          }`}
          title={sidebarOpen ? "Collapse sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
          <span className="truncate">Sidebar</span>
        </button>

        <button
          onClick={toggleTheme}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 shrink-0 cursor-pointer ${
            isDarkTheme
              ? "text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/50 hover:border-slate-700/80"
              : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 hover:border-slate-400"
          }`}
          title={`Switch to ${isDarkTheme ? "light" : "dark"} theme`}
        >
          {isDarkTheme ? (
            <Moon className="w-3.5 h-3.5" />
          ) : (
            <Sun className="w-3.5 h-3.5" />
          )}
          <span>{isDarkTheme ? "Dark" : "Light"}</span>
        </button>
        <button
          onClick={triggerFitView}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 shrink-0 cursor-pointer ${
            isDarkTheme
              ? "text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/50 hover:border-slate-700/80"
              : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 hover:border-slate-400"
          }`}
          title="Recenter and zoom map to fit all markers and polygons"
        >
          <Maximize className="w-3.5 h-3.5 text-indigo-400" />
          <span>Fit View</span>
        </button>

        <button
          onClick={saveData}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 shrink-0 cursor-pointer ${
            isDarkTheme
              ? "text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/50 hover:border-slate-700/80"
              : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 hover:border-slate-400"
          }`}
          title="Save GIS state to local storage"
        >
          <Save className="w-3.5 h-3.5 text-indigo-400" />
          <span>Save</span>
        </button>

        <button
          onClick={loadData}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 shrink-0 cursor-pointer ${
            isDarkTheme
              ? "text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/50 hover:border-slate-700/80"
              : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 hover:border-slate-400"
          }`}
          title="Load saved GIS state"
        >
          <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Load</span>
        </button>
      </div>

      {/* Mapbox Token warning/status */}
      <div className="flex items-center gap-2 ml-auto shrink-0">
        {mapboxTokenStatus === "fallback" && (
          <div
            className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg ${
              isDarkTheme
                ? "text-amber-400 bg-amber-400/5 border border-amber-400/25"
                : "text-amber-600 bg-amber-100 border border-amber-200"
            }`}
            title="Mapbox API Token missing. Using OpenStreetMap fallback raster styling."
          >
            <HelpCircle className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden lg:inline">Using OSM Tiles (Fallback)</span>
          </div>
        )}
      </div>

      <button
        onClick={clearAll}
        className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-all active:scale-95 shrink-0 cursor-pointer"
        title="Clear all map objects"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Clear All</span>
      </button>
    </div>
  );
}
