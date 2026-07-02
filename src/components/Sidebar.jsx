import React, { useState } from "react";
import {
  MapPin,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Layers,
  Activity,
  Ruler,
  Hash,
  Info,
} from "lucide-react";
import { formatArea, formatCoordinate } from "../utils/geoUtils";

export default function Sidebar({
  isOpen,
  setIsOpen,
  mode,
  markers,
  deleteMarker,
  focusMarker,
  polygon,
  clearPolygon,
  isPolygonFinished,
  area,
  isDarkTheme,
}) {
  const [editingMarkerId, setEditingMarkerId] = useState(null);
  const [tempName, setTempName] = useState("");

  const handleEditStart = (marker) => {
    setEditingMarkerId(marker.id);
    setTempName(marker.name);
  };

  const handleEditSave = (marker) => {
    if (tempName.trim()) {
      marker.name = tempName.trim();
    }
    setEditingMarkerId(null);
  };

  const getModeLabel = () => {
    switch (mode) {
      case "add-marker":
        return "Add Marker";
      case "draw-polygon":
        return "Draw Polygon";
      default:
        return "Idle";
    }
  };

  const getModeBadge = () => {
    switch (mode) {
      case "add-marker":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
            ● Active
          </span>
        );
      case "draw-polygon":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 animate-pulse">
            ● Active
          </span>
        );
      default:
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${isDarkTheme ? "bg-slate-500/10 text-slate-400 border-slate-800" : "bg-slate-200 text-slate-600 border-slate-300"}`}
          >
            ● Idle
          </span>
        );
    }
  };

  const isWorkspaceEmpty = markers.length === 0 && polygon.length === 0;

  return (
    <>
      {/* Sidebar toggle button (Mobile & floating tab) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 z-40 p-2.5 rounded-lg border transition-all shadow-xl md:hidden ${
          isDarkTheme
            ? "bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
            : "bg-white/90 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
        } ${isOpen ? "left-[260px]" : "left-4"}`}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>

      {/* Main Sidebar Panel */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-30 w-[300px] backdrop-blur-xl border-r flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isDarkTheme
            ? "bg-slate-950/95 md:bg-slate-950/80 border-slate-900 text-slate-100"
            : "bg-white/85 md:bg-white/80 border-slate-200 text-slate-700"
        } ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header Branding */}
        <div
          className={`p-6 border-b flex items-center justify-between ${isDarkTheme ? "border-slate-900" : "border-slate-200"}`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/35">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1
                className={`text-lg font-bold tracking-tight ${isDarkTheme ? "text-slate-100" : "text-slate-900"}`}
              >
                Varaha GIS
              </h1>
              <p
                className={`text-xs ${isDarkTheme ? "text-slate-400" : "text-slate-500"}`}
              >
                Interactive Map Sandbox
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status HUD Section */}
          <div
            className={`rounded-xl p-4 space-y-3 border ${isDarkTheme ? "bg-slate-900/40 border-slate-900" : "bg-slate-100 border-slate-200"}`}
          >
            <div className="flex justify-between items-center">
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${isDarkTheme ? "text-slate-400" : "text-slate-600"}`}
              >
                Status Dashboard
              </span>
              {getModeBadge()}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div
                className={`p-2 rounded-lg border ${isDarkTheme ? "bg-slate-950/40 border-slate-900" : "bg-white border-slate-200"}`}
              >
                <p
                  className={`text-[10px] uppercase ${isDarkTheme ? "text-slate-500" : "text-slate-500"}`}
                >
                  Current Mode
                </p>
                <p
                  className={`font-semibold mt-0.5 ${isDarkTheme ? "text-slate-200" : "text-slate-800"}`}
                >
                  {getModeLabel()}
                </p>
              </div>
              <div
                className={`p-2 rounded-lg border ${isDarkTheme ? "bg-slate-950/40 border-slate-900" : "bg-white border-slate-200"}`}
              >
                <p
                  className={`text-[10px] uppercase ${isDarkTheme ? "text-slate-500" : "text-slate-500"}`}
                >
                  Total Markers
                </p>
                <p
                  className={`font-semibold mt-0.5 font-mono ${isDarkTheme ? "text-slate-200" : "text-slate-800"}`}
                >
                  {markers.length}
                </p>
              </div>
              <div
                className={`p-2 rounded-lg border col-span-2 ${isDarkTheme ? "bg-slate-950/40 border-slate-900" : "bg-white border-slate-200"}`}
              >
                <p
                  className={`text-[10px] uppercase ${isDarkTheme ? "text-slate-500" : "text-slate-500"}`}
                >
                  Polygon Vertices
                </p>
                <p
                  className={`font-semibold mt-0.5 font-mono ${isDarkTheme ? "text-slate-200" : "text-slate-800"}`}
                >
                  {polygon.length}{" "}
                  {polygon.length > 0 && !isPolygonFinished && "(drawing...)"}
                  {polygon.length > 0 && isPolygonFinished && "(finished)"}
                </p>
              </div>
            </div>
          </div>

          {/* Empty workspace placeholder overlay */}
          {isWorkspaceEmpty ? (
            <div
              className={`border border-dashed rounded-2xl p-6 text-center space-y-3 ${isDarkTheme ? "border-slate-800" : "border-slate-300"}`}
            >
              <Info
                className={`w-8 h-8 mx-auto ${isDarkTheme ? "text-slate-600" : "text-slate-400"}`}
              />
              <p
                className={`text-xs font-medium ${isDarkTheme ? "text-slate-400" : "text-slate-600"}`}
              >
                Sandbox Canvas is Empty
              </p>
              <p
                className={`text-[10px] leading-relaxed ${isDarkTheme ? "text-slate-500" : "text-slate-500"}`}
              >
                Add markers or draw polygons from the toolbar at the top of the
                map to begin mapping.
              </p>
            </div>
          ) : (
            <>
              {/* Polygon Area Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div
                    className={`flex items-center space-x-2 font-semibold text-sm ${isDarkTheme ? "text-slate-300" : "text-slate-700"}`}
                  >
                    <Ruler
                      className={`w-4 h-4 ${isDarkTheme ? "text-indigo-400" : "text-indigo-500"}`}
                    />
                    <span>Calculated Area</span>
                  </div>
                  {polygon.length > 0 && (
                    <button
                      onClick={clearPolygon}
                      className={`text-xs transition-colors ${isDarkTheme ? "text-rose-400 hover:text-rose-300" : "text-rose-500 hover:text-rose-600"}`}
                    >
                      Clear Area
                    </button>
                  )}
                </div>

                <div
                  className={`rounded-xl p-4 shadow-xl border ${isDarkTheme ? "bg-gradient-to-br from-indigo-950/45 via-indigo-950/15 to-slate-950/60 border-indigo-500/20 shadow-indigo-950/20" : "bg-gradient-to-br from-indigo-50 via-white to-slate-100 border-indigo-200 shadow-indigo-100/70"}`}
                >
                  {polygon.length === 0 ? (
                    <div className="text-center py-2">
                      <p
                        className={`text-xs ${isDarkTheme ? "text-slate-500" : "text-slate-600"}`}
                      >
                        No polygon drawn yet.
                      </p>
                    </div>
                  ) : !isPolygonFinished ? (
                    <div className="text-center py-2">
                      <p
                        className={`text-xs font-medium animate-pulse ${isDarkTheme ? "text-amber-400" : "text-amber-600"}`}
                      >
                        ● Drawing shape...
                      </p>
                      <p
                        className={`text-[10px] mt-1 ${isDarkTheme ? "text-slate-500" : "text-slate-600"}`}
                      >
                        Click 'Finish Polygon' on the toolbar when ready to
                        close and calculate area.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p
                        className={`text-[10px] uppercase font-bold tracking-wider ${isDarkTheme ? "text-indigo-400" : "text-indigo-600"}`}
                      >
                        Polygon Area (Turf.js)
                      </p>
                      <p
                        className={`text-2xl font-black font-mono tracking-tight bg-clip-text text-transparent ${isDarkTheme ? "text-white bg-gradient-to-r from-slate-100 to-indigo-200" : "text-slate-900 bg-gradient-to-r from-slate-800 to-indigo-700"}`}
                      >
                        {formatArea(area)}
                      </p>
                      <p
                        className={`text-[10px] ${isDarkTheme ? "text-slate-500" : "text-slate-600"}`}
                      >
                        Geodesic area over {polygon.length} nodes
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Markers List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div
                    className={`flex items-center space-x-2 font-semibold text-sm ${isDarkTheme ? "text-slate-300" : "text-slate-700"}`}
                  >
                    <MapPin
                      className={`w-4 h-4 ${isDarkTheme ? "text-emerald-400" : "text-emerald-500"}`}
                    />
                    <span>Coordinate Pins ({markers.length})</span>
                  </div>
                </div>

                {markers.length === 0 ? (
                  <div
                    className={`border border-dashed rounded-xl p-4 text-center ${isDarkTheme ? "border-slate-900/60" : "border-slate-300"}`}
                  >
                    <p
                      className={`text-xs ${isDarkTheme ? "text-slate-500" : "text-slate-600"}`}
                    >
                      No active markers placed
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {markers.map((marker, index) => (
                      <div
                        key={marker.id}
                        className={`group flex flex-col rounded-xl p-2.5 transition-all border ${isDarkTheme ? "bg-slate-900/30 hover:bg-slate-900/60 border-slate-900/60 hover:border-slate-800" : "bg-slate-100 hover:bg-slate-200 border-slate-200 hover:border-slate-300"}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold border ${isDarkTheme ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" : "bg-emerald-100 text-emerald-600 border-emerald-200"}`}
                            >
                              {index + 1}
                            </span>
                            {editingMarkerId === marker.id ? (
                              <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onBlur={() => handleEditSave(marker)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleEditSave(marker);
                                  }
                                }}
                                className={`border text-xs px-2 py-0.5 rounded outline-none font-medium max-w-[120px] ${isDarkTheme ? "bg-slate-950 border-indigo-500 text-slate-200" : "bg-white border-indigo-300 text-slate-800"}`}
                                autoFocus
                              />
                            ) : (
                              <span
                                onClick={() => handleEditStart(marker)}
                                className={`text-xs font-semibold cursor-pointer hover:underline truncate max-w-[130px] ${isDarkTheme ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-900"}`}
                                title="Click to rename"
                              >
                                {marker.name}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => focusMarker(marker)}
                              className={`p-1 rounded transition-colors ${isDarkTheme ? "hover:bg-slate-800 text-slate-400 hover:text-emerald-400" : "hover:bg-slate-200 text-slate-500 hover:text-emerald-600"}`}
                              title="Fly to marker"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteMarker(marker.id)}
                              className={`p-1 rounded transition-colors ${isDarkTheme ? "hover:bg-slate-800 text-slate-400 hover:text-rose-400" : "hover:bg-slate-200 text-slate-500 hover:text-rose-600"}`}
                              title="Delete marker"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div
                          className={`mt-1.5 grid grid-cols-2 gap-1 text-[10px] font-mono ${isDarkTheme ? "text-slate-400" : "text-slate-600"}`}
                        >
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase">
                              Lat:
                            </span>{" "}
                            {formatCoordinate(marker.lat)}
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase">
                              Lng:
                            </span>{" "}
                            {formatCoordinate(marker.lng)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer info banner */}
        <div
          className={`p-4 border-t text-[10px] flex items-center justify-between ${isDarkTheme ? "border-slate-900/60 bg-slate-950/40 text-slate-500" : "border-slate-200 bg-slate-50 text-slate-600"}`}
        >
          <div className="flex items-center space-x-1.5">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Mapbox Engine v3.x</span>
          </div>
          <span>v1.1.0</span>
        </div>
      </div>
    </>
  );
}
