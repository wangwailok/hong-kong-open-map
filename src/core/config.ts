export const BASE_VT_URL = "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt";

// Use basemap (not topographic) as per official API docs
export const STYLE_URL = `${BASE_VT_URL}/basemap/WGS84/resources/styles/root.json`;
export const STYLE_URL_DARK = `${BASE_VT_URL}/basemap/WGS84/resources/styles/root_dark.json`;

// Tile URL uses {z}/{y}/{x} format (not standard {z}/{x}/{y})
export const BASEMAP_TILE_URL = `${BASE_VT_URL}/basemap/WGS84/tile/{z}/{y}/{x}.pbf`;

export const LABEL_STYLE_URL_ZH = `${BASE_VT_URL}/label/hk/tc/WGS84/resources/styles/root.json`;
export const LABEL_STYLE_URL_ZH_DARK = `${BASE_VT_URL}/label/hk/tc/WGS84/resources/styles/root_dark.json`;

export const LABEL_STYLE_URL_EN = `${BASE_VT_URL}/label/hk/en/WGS84/resources/styles/root.json`;
export const LABEL_STYLE_URL_EN_DARK = `${BASE_VT_URL}/label/hk/en/WGS84/resources/styles/root_dark.json`;

export const DEFAULT_CENTER: [number, number] = [114.1694, 22.3193];

export const HK_BOUNDS: [[number, number], [number, number]] = [
  [113.8259, 22.1533],  // Southwest
  [114.4069, 22.5620]   // Northeast
];

export const ZOOM_CONSTRAINTS = {
  minZoom: 10,
  maxZoom: 15,
  defaultZoom: 12
};

export const ATTRIBUTION = `
  <a href="https://api.portal.hkmapservice.gov.hk/disclaimer" target="_blank" style="color: inherit; text-decoration: none;">
    © Map information from Lands Department
  </a>
  <img src="https://api.hkmapservice.gov.hk/mapapi/landsdlogo.jpg" alt="Lands Department Logo" style="width: 20px; height: 20px; vertical-align: middle; margin-left: 4px;" />
`;
