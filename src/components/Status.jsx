import React from "react";

export function getModeLabel(mode) {
  switch (mode) {
    case "add-marker":
      return "Add Marker";
    case "draw-polygon":
      return "Draw Polygon";
    default:
      return "Idle";
  }
}

export function getModeBadge(mode, isDarkTheme) {
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
}
