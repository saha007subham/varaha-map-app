import React from 'react';
import { 
  MapPin, 
  Hexagon, 
  Trash2, 
  Save, 
  FolderOpen,
  HelpCircle,
  CheckCircle2,
  Maximize
} from 'lucide-react';

export default function Toolbar({
  mode,
  setMode,
  polygonCount,
  finishPolygon,
  clearAll,
  saveData,
  loadData,
  mapboxTokenStatus,
  triggerFitView
}) {
  return (
    <div className="flex flex-row flex-nowrap items-center justify-between gap-3 bg-slate-950/85 backdrop-blur-xl border border-slate-900 rounded-2xl p-2.5 shadow-2xl overflow-x-auto w-full max-w-full scrollbar-none">
      
      {/* Interaction Mode Selection Group */}
      <div className="flex flex-row flex-nowrap items-center gap-1.5 p-1 bg-slate-900/60 rounded-xl border border-slate-800/40 shrink-0">
        <button
          onClick={() => setMode(mode === 'add-marker' ? 'idle' : 'add-marker')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all shrink-0 ${
            mode === 'add-marker'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          title="Place Coordinate Pin Markers"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Add Marker</span>
        </button>

        <button
          onClick={() => setMode(mode === 'draw-polygon' ? 'idle' : 'draw-polygon')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all shrink-0 ${
            mode === 'draw-polygon'
              ? 'bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          title="Draw Area Boundaries"
        >
          <Hexagon className="w-3.5 h-3.5" />
          <span>Draw Polygon</span>
        </button>

        {/* Dedicated "Finish Polygon" button */}
        {mode === 'draw-polygon' && (
          <button
            onClick={finishPolygon}
            disabled={polygonCount < 3}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all shrink-0 ${
              polygonCount >= 3
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20 scale-[1.02] cursor-pointer'
                : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed'
            }`}
            title={polygonCount >= 3 ? "Close polygon shape and compute area" : "Place at least 3 vertices to finish"}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Finish Polygon ({polygonCount})</span>
          </button>
        )}
      </div>

      {/* Action Buttons: Fit View, Save, Load, Clear */}
      <div className="flex flex-row flex-nowrap items-center gap-2 shrink-0">
        <button
          onClick={triggerFitView}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/50 hover:border-slate-700/80 transition-all active:scale-95 shrink-0"
          title="Recenter and zoom map to fit all markers and polygons"
        >
          <Maximize className="w-3.5 h-3.5 text-indigo-400" />
          <span>Fit View</span>
        </button>

        <button
          onClick={saveData}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/50 hover:border-slate-700/80 transition-all active:scale-95 shrink-0"
          title="Save GIS state to local storage"
        >
          <Save className="w-3.5 h-3.5 text-indigo-400" />
          <span>Save</span>
        </button>

        <button
          onClick={loadData}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/50 hover:border-slate-700/80 transition-all active:scale-95 shrink-0"
          title="Load saved GIS state"
        >
          <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Load</span>
        </button>

        <div className="w-px h-6 bg-slate-800 mx-1 hidden sm:block shrink-0"></div>

        <button
          onClick={clearAll}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-all active:scale-95 shrink-0"
          title="Clear all map objects"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Mapbox Token warning/status */}
      <div className="flex items-center gap-2 ml-auto shrink-0">
        {mapboxTokenStatus === 'fallback' && (
          <div 
            className="flex items-center gap-1.5 text-[10px] text-amber-400 bg-amber-400/5 border border-amber-400/25 px-2.5 py-1 rounded-lg"
            title="Mapbox API Token missing. Using OpenStreetMap fallback raster styling."
          >
            <HelpCircle className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden lg:inline">Using OSM Tiles (Fallback)</span>
          </div>
        )}
      </div>

    </div>
  );
}
