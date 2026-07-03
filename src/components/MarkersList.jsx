import React, { useState } from "react";
import { Navigation, Trash2 } from "lucide-react";
import { formatCoordinate } from "../utils/geoUtils";

export default function MarkersList({
  markers,
  deleteMarker,
  focusMarker,
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

  if (markers.length === 0) {
    return (
      <div
        className={`border border-dashed rounded-xl p-4 text-center ${isDarkTheme ? "border-slate-900/60" : "border-slate-300"}`}
      >
        <p
          className={`text-xs ${isDarkTheme ? "text-slate-500" : "text-slate-600"}`}
        >
          No active markers placed
        </p>
      </div>
    );
  }

  return (
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
              <span className="text-[9px] text-slate-500 uppercase">Lat:</span>{" "}
              {formatCoordinate(marker.lat)}
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase">Lng:</span>{" "}
              {formatCoordinate(marker.lng)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
