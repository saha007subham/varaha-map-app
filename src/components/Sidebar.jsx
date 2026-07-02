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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-800">
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
        className={`fixed top-4 z-40 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-xl hover:bg-slate-800 md:hidden ${
          isOpen ? "left-[260px]" : "left-4"
        }`}
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
        className={`fixed top-0 bottom-0 left-0 z-30 w-[300px] bg-slate-950/95 md:bg-slate-950/80 backdrop-blur-xl border-r border-slate-900 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div className="p-6 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/35">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight">
                Varaha GIS
              </h1>
              <p className="text-xs text-slate-400">Interactive Map Sandbox</p>
            </div>
          </div>
        </div>

        {/* Scrollable contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status HUD Section */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status Dashboard
              </span>
              {getModeBadge()}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-900">
                <p className="text-[10px] text-slate-500 uppercase">
                  Current Mode
                </p>
                <p className="font-semibold text-slate-200 mt-0.5">
                  {getModeLabel()}
                </p>
              </div>
              <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-900">
                <p className="text-[10px] text-slate-500 uppercase">
                  Total Markers
                </p>
                <p className="font-semibold text-slate-200 mt-0.5 font-mono">
                  {markers.length}
                </p>
              </div>
              <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-900 col-span-2">
                <p className="text-[10px] text-slate-500 uppercase">
                  Polygon Vertices
                </p>
                <p className="font-semibold text-slate-200 mt-0.5 font-mono">
                  {polygon.length}{" "}
                  {polygon.length > 0 && !isPolygonFinished && "(drawing...)"}
                  {polygon.length > 0 && isPolygonFinished && "(finished)"}
                </p>
              </div>
            </div>
          </div>

          {/* Empty workspace placeholder overlay */}
          {isWorkspaceEmpty ? (
            <div className="border border-dashed border-slate-800 rounded-2xl p-6 text-center space-y-3">
              <Info className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-medium text-slate-400">
                Sandbox Canvas is Empty
              </p>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Add markers or draw polygons from the toolbar at the top of the
                map to begin mapping.
              </p>
            </div>
          ) : (
            <>
              {/* Polygon Area Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-slate-300 font-semibold text-sm">
                    <Ruler className="w-4 h-4 text-indigo-400" />
                    <span>Calculated Area</span>
                  </div>
                  {polygon.length > 0 && (
                    <button
                      onClick={clearPolygon}
                      className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      Clear Area
                    </button>
                  )}
                </div>

                <div className="bg-gradient-to-br from-indigo-950/45 via-indigo-950/15 to-slate-950/60 border border-indigo-500/20 rounded-xl p-4 shadow-xl shadow-indigo-950/20">
                  {polygon.length === 0 ? (
                    <div className="text-center py-2">
                      <p className="text-xs text-slate-500">
                        No polygon drawn yet.
                      </p>
                    </div>
                  ) : !isPolygonFinished ? (
                    <div className="text-center py-2">
                      <p className="text-xs text-amber-400 font-medium animate-pulse">
                        ● Drawing shape...
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Click 'Finish Polygon' on the toolbar when ready to
                        close and calculate area.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                        Polygon Area (Turf.js)
                      </p>
                      <p className="text-2xl font-black text-white font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-indigo-200">
                        {formatArea(area)}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Geodesic area over {polygon.length} nodes
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Markers List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-slate-300 font-semibold text-sm">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Coordinate Pins ({markers.length})</span>
                  </div>
                </div>

                {markers.length === 0 ? (
                  <div className="border border-dashed border-slate-900/60 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-500">
                      No active markers placed
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {markers.map((marker, index) => (
                      <div
                        key={marker.id}
                        className="group flex flex-col bg-slate-900/30 hover:bg-slate-900/60 border border-slate-900/60 hover:border-slate-800 rounded-xl p-2.5 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/25">
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
                                className="bg-slate-950 border border-indigo-500 text-slate-200 text-xs px-2 py-0.5 rounded outline-none font-medium max-w-[120px]"
                                autoFocus
                              />
                            ) : (
                              <span
                                onClick={() => handleEditStart(marker)}
                                className="text-xs font-semibold text-slate-300 hover:text-white cursor-pointer hover:underline truncate max-w-[130px]"
                                title="Click to rename"
                              >
                                {marker.name}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => focusMarker(marker)}
                              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                              title="Fly to marker"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteMarker(marker.id)}
                              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Delete marker"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-1.5 grid grid-cols-2 gap-1 text-[10px] text-slate-400 font-mono">
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
        <div className="p-4 border-t border-slate-900/60 bg-slate-950/40 text-[10px] text-slate-500 flex items-center justify-between">
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
