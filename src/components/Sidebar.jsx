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
import { getModeLabel, getModeBadge } from "./Status.jsx";
import SidebarToggle from "./SidebarToggle.jsx";
import PolygonAreaStats from "./PolygonAreaStats.jsx";
import MarkersList from "./MarkersList.jsx";

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
  const isWorkspaceEmpty = markers.length === 0 && polygon.length === 0;

  return (
    <>
      <SidebarToggle
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isDarkTheme={isDarkTheme}
      />

      {/* Main Sidebar Panel */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-30 w-[300px] backdrop-blur-xl border-r flex flex-col transition-transform duration-300 ease-in-out min-[1301px]:translate-x-0 ${
          isDarkTheme
            ? "bg-slate-950/95 min-[1301px]:bg-slate-950/80 border-slate-900 text-slate-100"
            : "bg-white/85 min-[1301px]:bg-white/80 border-slate-200 text-slate-700"
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
              {getModeBadge(mode, isDarkTheme)}
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
                  {getModeLabel(mode)}
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
              <PolygonAreaStats
                polygon={polygon}
                isPolygonFinished={isPolygonFinished}
                area={area}
                isDarkTheme={isDarkTheme}
                clearPolygon={clearPolygon}
              />

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

                <MarkersList
                  markers={markers}
                  deleteMarker={deleteMarker}
                  focusMarker={focusMarker}
                  isDarkTheme={isDarkTheme}
                />
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
