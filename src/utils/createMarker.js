import mapboxgl from "mapbox-gl";

/**
 * Creates and configures a Mapbox marker with custom DOM, popup, and styling
 * @param {Object} markerData - The marker data object
 * @param {string} markerData.id - Unique marker identifier
 * @param {string} markerData.name - Marker display name
 * @param {number} markerData.lat - Latitude coordinate
 * @param {number} markerData.lng - Longitude coordinate
 * @param {number} markerNumber - Display number for the marker (index + 1)
 * @returns {mapboxgl.Marker} Configured marker instance ready to add to map
 */
export function createMarker(markerData, markerNumber) {
  const { name, lat, lng } = markerData;

  // Create custom HTML marker element
  const el = document.createElement("div");
  el.className = "custom-marker";
  el.innerHTML = `
    <div class="relative flex items-center justify-center">
      <div class="absolute -top-1 w-6 h-6 bg-emerald-500/30 rounded-full animate-ping opacity-75"></div>
      <div class="relative w-7 h-7 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-black/50">
        <span class="marker-number text-[11px] font-bold text-emerald-400">${markerNumber}</span>
      </div>
    </div>
  `;

  // Create Popup with marker information
  const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(`
    <div class="text-left font-sans">
      <p class="font-bold text-sm text-slate-100 mb-1">${name}</p>
      <div class="space-y-0.5 text-[10px] text-slate-400 font-mono">
        <p>Lat: ${lat.toFixed(6)}</p>
        <p>Lng: ${lng.toFixed(6)}</p>
      </div>
    </div>
  `);

  // Create and configure Marker instance
  const markerInstance = new mapboxgl.Marker({ element: el })
    .setLngLat([lng, lat])
    .setPopup(popup);

  return markerInstance;
}

/**
 * Updates the marker number display in the DOM
 * @param {mapboxgl.Marker} markerInstance - The marker instance
 * @param {number} markerNumber - The new number to display
 */
export function updateMarkerNumber(markerInstance, markerNumber) {
  const el = markerInstance.getElement();
  const numEl = el.querySelector(".marker-number");
  if (numEl) {
    numEl.textContent = markerNumber;
  }
}
