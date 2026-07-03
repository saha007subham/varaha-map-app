import * as turf from "@turf/turf";

/**
 * Calculates the geodesic area of a polygon using Turf.js.
 *
 * @param {Array<Array<number>>} coordinates - Array of [lng, lat] coordinate pairs.
 * @returns {number} The area in square meters.
 */
export function calculatePolygonArea(coordinates) {
  if (!coordinates || coordinates.length < 3) return 0;

  // Clone to avoid modifying the original array
  const points = [...coordinates];

  // Close the polygon if it is not already closed (Turf requires closed loops)
  const first = points[0];
  const last = points[points.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    points.push(first);
  }

  try {
    const poly = turf.polygon([points]);
    return turf.area(poly);
  } catch (err) {
    console.error("Turf.js area calculation failed:", err);
    return 0;
  }
}

/**
 * Formats an area in square meters to a string with commas and two decimal places.
 * @param {number} areaInSqMeters - The area in square meters.
 * @returns {string} Formatted string (e.g. "1,234.56 m²").
 */
export function formatArea(areaInSqMeters) {
  if (
    areaInSqMeters === undefined ||
    areaInSqMeters === null ||
    isNaN(areaInSqMeters)
  ) {
    return "0.00 m²";
  }
  return `${areaInSqMeters.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²`;
}

/**
 * Formats a coordinate pair to standard display format.
 * @param {number} num - Coordinate value (lat or lng).
 * @returns {string} String with 6 decimal places.
 */
export function formatCoordinate(num) {
  if (num === undefined || num === null || isNaN(num)) return "-";
  return num.toFixed(6);
}

/**
 * Creates a valid GeoJSON FeatureCollection from markers and a completed polygon.
 *
 * @param {Array<Object>} markers
 * @param {Array<Array<number>>} polygon
 * @param {boolean} includePolygon
 * @returns {Object} GeoJSON FeatureCollection
 */
export function createGeoJSONFeatureCollection(
  markers,
  polygon,
  includePolygon = true,
) {
  const features = markers.map((marker) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [marker.lng, marker.lat],
    },
    properties: {
      id: marker.id,
      name: marker.name,
    },
  }));

  if (includePolygon && Array.isArray(polygon) && polygon.length >= 3) {
    const closedCoords =
      polygon[0][0] === polygon[polygon.length - 1][0] &&
      polygon[0][1] === polygon[polygon.length - 1][1]
        ? polygon
        : [...polygon, polygon[0]];

    features.push({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [closedCoords],
      },
      properties: {},
    });
  }

  return {
    type: "FeatureCollection",
    features,
  };
}

/**
 * Parses a GeoJSON FeatureCollection and returns supported markers and polygon coordinates.
 * Unsupported geometries are ignored.
 *
 * @param {Object} payload
 * @returns {{markers: Array<Object>, polygon: Array<Array<number>>, polygonCount: number}}
 */
export function parseGeoJSONFeatureCollection(payload) {
  if (
    !payload ||
    payload.type !== "FeatureCollection" ||
    !Array.isArray(payload.features)
  ) {
    throw new Error("File must be a valid GeoJSON FeatureCollection.");
  }

  const markers = [];
  let polygon = null;
  let polygonCount = 0;

  payload.features.forEach((feature) => {
    if (!feature || feature.type !== "Feature") return;

    const geometry = feature.geometry;
    if (!geometry || !geometry.type || !Array.isArray(geometry.coordinates)) {
      return;
    }

    if (geometry.type === "Point") {
      const [lng, lat] = geometry.coordinates;
      if (
        typeof lng === "number" &&
        typeof lat === "number" &&
        Number.isFinite(lng) &&
        Number.isFinite(lat)
      ) {
        markers.push({
          lng,
          lat,
          name:
            feature.properties && typeof feature.properties.name === "string"
              ? feature.properties.name
              : null,
        });
      }
      return;
    }

    if (geometry.type === "Polygon" && polygon === null) {
      const coords = geometry.coordinates;
      if (!Array.isArray(coords) || coords.length === 0) return;

      const firstRing = coords[0];
      if (!Array.isArray(firstRing) || firstRing.length < 4) return;

      const isClosed =
        firstRing[0][0] === firstRing[firstRing.length - 1][0] &&
        firstRing[0][1] === firstRing[firstRing.length - 1][1];
      polygon = isClosed ? firstRing.slice(0, -1) : firstRing;
      polygonCount += 1;
      return;
    }

    // Ignore unsupported geometry types.
  });

  return {
    markers,
    polygon,
    polygonCount,
  };
}
