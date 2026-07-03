# 🗺️ Varaha GIS – Interactive Map Sandbox

An interactive GIS (Geographic Information System) web application built with **React**, **Mapbox GL JS**, and **Turf.js**.

This project was developed as part of the **Varaha Frontend Assignment**. It enables users to interact with a map by placing markers, drawing polygons, calculating polygon areas, saving/loading map state, and importing/exporting GeoJSON data.

## 🌐 Live Demo

**Live Application:**  
https://varaha-map-app.vercel.app/

**GitHub Repository:**  
https://github.com/saha007subham/varaha-map-app

---

# 📸 Preview

> Interactive GIS Sandbox built with React + Mapbox GL JS

Features include:

- 📍 Add coordinate markers
- 🔷 Draw polygons
- 📐 Calculate polygon area using Turf.js
- 💾 Save & Load map state
- 🌍 Import & Export GeoJSON
- 🎨 Light / Dark theme
- 📱 Responsive UI
- 🔎 Fit View
- 📊 Live Status Dashboard

---

# ✨ Features

## 🗺️ Interactive Map

- Built using Mapbox GL JS
- Smooth zooming and panning
- Navigation controls
- Responsive map canvas

---

## 📍 Marker Management

- Add markers by clicking on the map
- Numbered markers
- Marker popups showing coordinates
- Focus on a marker from the sidebar
- Delete individual markers

---

## 🔷 Polygon Drawing

- Draw polygons interactively
- Finish polygon after placing at least 3 vertices
- Polygon visualization
- Clear polygon independently

---

## 📐 Area Calculation

- Polygon area calculated using **Turf.js**
- Area displayed in square meters
- Live area statistics panel

---

## 💾 Save & Load

Persist map state using Local Storage.

Includes:

- Markers
- Polygon
- Theme preference

---

## 🌍 GeoJSON Support

### Export

Export markers and polygons as a valid **GeoJSON FeatureCollection**.

### Import

Import existing GeoJSON files.

Supports:

- Point
- Polygon

---

## 🎨 Theme Support

- Dark Mode
- Light Mode
- Theme preference persisted across reloads

---

## 📱 Responsive Design

Optimized for:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive sidebar and toolbar.

---

## 📊 Status Dashboard

Displays

- Current Mode
- Total Markers
- Polygon Vertices
- Polygon Area

---

## 🔎 Fit View

Automatically adjusts the camera to fit all markers and polygons.

---

# 🛠️ Tech Stack

- React
- Vite
- Mapbox GL JS
- Turf.js
- Tailwind CSS
- Lucide React
- JavaScript (ES6+)

Mapbox GL JS is used for rendering interactive maps, while Turf.js provides client-side geospatial analysis such as polygon area calculation. :contentReference[oaicite:0]{index=0}

---

# 📂 Project Structure

```
varaha-map-app/
├── public/
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── MapCanvas.jsx
│   │   ├── Toolbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SidebarToggle.jsx
│   │   ├── Status.jsx
│   │   ├── MarkersList.jsx
│   │   └── PolygonAreaStats.jsx
│   │
│   ├── hooks/
│   │   ├── useMapInitialization.js
│   │   ├── useMarkers.js
│   │   └── usePolygon.js
│   │
│   ├── utils/
│   │   ├── createMarker.js
│   │   ├── geoUtils.js
│   │   └── mapStyles.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/saha007subham/varaha-map-app.git
```

---

## 2. Navigate into the project

```bash
cd varaha-map-app
```

---

## 3. Install dependencies

```bash
npm install
```

---

## 4. Create Environment File

Create a file named

```
.env.local
```

Add your Mapbox access token

```env
VITE_MAPBOX_ACCESS_TOKEN=YOUR_MAPBOX_ACCESS_TOKEN
```

You can create a free Mapbox account and generate an access token from:

https://account.mapbox.com/

---

## 5. Run the development server

```bash
npm run dev
```

The application will be available at

```
http://localhost:5173
```

---

## 6. Build for production

```bash
npm run build
```

---

# 📖 How to Use

### Add Marker

- Click **Add Marker**
- Click anywhere on the map
- Marker appears with popup and sidebar entry

---

### Draw Polygon

- Click **Draw Polygon**
- Click multiple points on the map
- Click **Finish Polygon**
- Area is calculated automatically

---

### Save

Stores current workspace in Local Storage.

---

### Load

Restores the previously saved workspace.

---

### Export GeoJSON

Downloads the current map state as a valid GeoJSON file.

---

### Import GeoJSON

Imports Point and Polygon features from a GeoJSON file.

---

### Fit View

Automatically zooms the map to include all markers and polygons.

---

# ✅ Assignment Requirements Covered

| Requirement | Status |
|------------|--------|
| Mapbox GL JS Integration | ✅ |
| Center Map | ✅ |
| Add Markers | ✅ |
| Display Coordinates | ✅ |
| Draw Polygon | ✅ |
| Calculate Area (Turf.js) | ✅ |
| Marker Popup | ✅ |
| Clear All | ✅ |
| Save / Load | ✅ |
| Responsive Design | ✅ |
| GeoJSON Export *(Bonus)* | ✅ |
| GeoJSON Import *(Bonus)* | ✅ |

---


# 👨‍💻 Author

**Subham Saha**

Frontend Engineer

GitHub:  
https://github.com/saha007subham

LinkedIn:  
https://www.linkedin.com/in/subham-saha/

---

Thank you for reviewing this assignment.
Feedback is always appreciated!
