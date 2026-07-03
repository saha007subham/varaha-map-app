import React from "react";
import { Ruler } from "lucide-react";
import { formatArea } from "../utils/geoUtils";

export default function PolygonAreaStats({
  polygon,
  isPolygonFinished,
  area,
  isDarkTheme,
  clearPolygon,
}) {
  return (
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
              Click 'Finish Polygon' on the toolbar when ready to close and
              calculate area.
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
  );
}
