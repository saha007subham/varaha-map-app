// Utility to provide Mapbox or raster style definitions based on theme and token
export function getStyleDefinition(isDark, hasToken) {
  if (hasToken) {
    // When a Mapbox token is available, prefer a standard Mapbox style URL.
    // The same style is used for both themes here but this can be customized.
    return isDark
      ? "mapbox://styles/mapbox/streets-v12"
      : "mapbox://styles/mapbox/streets-v12";
  }

  // Fallback raster tile styles for environments without a Mapbox token.
  // Provide a dark and light raster tile source using Carto basemaps.
  if (isDark) {
    return {
      version: 8,
      sources: {
        "osm-tiles": {
          type: "raster",
          tiles: [
            "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          ],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors, © CartoDB",
        },
      },
      layers: [
        {
          id: "osm-tiles",
          type: "raster",
          source: "osm-tiles",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };
  }

  return {
    version: 8,
    sources: {
      "osm-tiles": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        ],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors, © CartoDB",
      },
    },
    layers: [
      {
        id: "osm-tiles",
        type: "raster",
        source: "osm-tiles",
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  };
}
