import * as turf from '@turf/turf';

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
  if (areaInSqMeters === undefined || areaInSqMeters === null || isNaN(areaInSqMeters)) {
    return '0.00 m²';
  }
  return `${areaInSqMeters.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²`;
}

/**
 * Formats a coordinate pair to standard display format.
 * @param {number} num - Coordinate value (lat or lng).
 * @returns {string} String with 6 decimal places.
 */
export function formatCoordinate(num) {
  if (num === undefined || num === null || isNaN(num)) return '-';
  return num.toFixed(6);
}
