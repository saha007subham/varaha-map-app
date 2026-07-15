import { useEffect, useRef } from "react";
import { createMarker, updateMarkerNumber } from "../utils/createMarker";

/**
 * Custom hook for managing markers on the map
 * Handles: marker creation, updates, deletion, and numbering
 * @param {Object} mapRef - Reference to the Mapbox map instance
 * @param {boolean} mapLoaded - Whether the map has finished loading
 * @param {Array} markers - Array of marker data objects { id, name, lat, lng }
 * @returns {Object} { markersRef }
 */
export function useMarkers(mapRef, mapLoaded, markers) {
  const markersRef = useRef({});

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const currentMarkers = { ...markersRef.current };
    const newMarkers = {};

    markers.forEach((m, index) => {
      const markerNumber = index + 1;

      if (currentMarkers[m.id]) {
        // Marker exists, update position and number
        const markerInstance = currentMarkers[m.id];
        markerInstance.setLngLat([m.lng, m.lat]);
        updateMarkerNumber(markerInstance, markerNumber);

        newMarkers[m.id] = markerInstance;
        delete currentMarkers[m.id];
      } else {
        // Create new marker
        const markerInstance = createMarker(m, markerNumber).addTo(
          mapRef.current,
        );
        newMarkers[m.id] = markerInstance;
      }
    });

    // Remove obsolete markers from map
    Object.keys(currentMarkers).forEach((id) => {
      currentMarkers[id].remove();
    });

    markersRef.current = newMarkers;
  }, [markers, mapLoaded, mapRef]);

  return { markersRef };
}
