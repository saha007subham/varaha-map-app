import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

/**
 * Custom hook for managing polygon drawing and visualization
 * Handles: polygon layer updates, vertex marker creation and deletion
 * @param {Object} mapRef - Reference to the Mapbox map instance
 * @param {boolean} mapLoaded - Whether the map has finished loading
 * @param {Array} polygon - Array of polygon coordinates [[lng, lat], ...]
 * @param {boolean} isPolygonFinished - Whether polygon drawing is finished
 * @param {number} polygonSyncTrigger - Trigger to re-sync polygon (from style.load)
 * @returns {Object} { polygonMarkersRef }
 */
export function usePolygon(
  mapRef,
  mapLoaded,
  polygon,
  isPolygonFinished,
  polygonSyncTrigger,
) {
  const polygonMarkersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const source = mapRef.current.getSource("polygon-data");
    if (source) {
      const features = [];

      if (polygon.length > 0) {
        if (isPolygonFinished && polygon.length >= 3) {
          // Closed polygon loop
          const closedCoords = [...polygon, polygon[0]];
          features.push({
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [closedCoords],
            },
            properties: {},
          });
        } else {
          // Open line string while actively drawing
          features.push({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: polygon,
            },
            properties: {},
          });
        }
      }

      source.setData({
        type: "FeatureCollection",
        features,
      });
    }

    // Draw vertex corner dots on the map
    // Clear old vertex markers
    polygonMarkersRef.current.forEach((marker) => marker.remove());
    polygonMarkersRef.current = [];

    // Place new vertex dots on map (only if we are still drawing/unfinished)
    if (!isPolygonFinished) {
      polygon.forEach((coord) => {
        const el = document.createElement("div");
        el.className =
          "w-3 h-3 rounded-full border-2 bg-white border-indigo-600 shadow-md cursor-pointer transition-transform hover:scale-125";

        const markerInstance = new mapboxgl.Marker({ element: el })
          .setLngLat(coord)
          .addTo(mapRef.current);

        polygonMarkersRef.current.push(markerInstance);
      });
    }
  }, [polygon, isPolygonFinished, mapLoaded, polygonSyncTrigger, mapRef]);

  return { polygonMarkersRef };
}
