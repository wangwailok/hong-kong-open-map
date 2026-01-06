# GitHub Copilot Instructions | GitHub Copilot 指引

## Project Overview | 項目概述

**Hong Kong Open Map** is a free, open-source map component library for Hong Kong applications. It uses official vector tiles from the Hong Kong Lands Department (地政總署) and provides a perfect alternative to Google Maps for Hong Kong-focused applications.

**香港開放地圖** 是一個免費、開源的香港地圖組件庫。使用香港地政總署官方矢量圖磚，為香港應用程式提供 Google Maps 的完美替代方案。

---

## Tech Stack | 技術棧

| Technology | Purpose | 用途 |
|------------|---------|------|
| React 18+ | Primary component library | 主要組件庫 |
| TypeScript | Type safety and DX | 類型安全與開發體驗 |
| MapLibre GL JS | Map rendering engine (free & open-source) | 地圖渲染引擎（免費開源）|
| Vite | Build tool | 構建工具 |
| Vitest | Testing framework | 測試框架 |
| Rollup | Library bundling | 庫打包 |

---

## Distribution Formats | 發佈格式

This package supports multiple usage methods:

1. **React Component** (`hong-kong-open-map`)
   - Primary npm package for React applications
   - React 應用程式的主要 npm 套件

2. **Vanilla JavaScript** (`hong-kong-open-map/vanilla`)
   - Standalone JS for non-React projects
   - 適用於非 React 項目的獨立 JS

3. **iFrame Embed** (`https://wangwailok.com/hong-kong-open-map/embed`)
   - Public URL for easy embedding
   - 公開 URL 方便嵌入

---

## Core API Reference | 核心 API 參考

### Map Tile URLs | 地圖圖磚網址

```typescript
// Base vector tile URL (WGS84 projection for MapLibre)
const BASEMAP_URL = "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/basemap/WGS84";

// Label layers (Chinese/English)
const LABEL_URL_ZH = "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/label/hk/tc/WGS84";
const LABEL_URL_EN = "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/label/hk/en/WGS84";

// Style JSON URL (for MapLibre)
const STYLE_URL = "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/basemap/WGS84/style.json";
const STYLE_URL_DARK = "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/basemap/WGS84/style_dark.json";
```

### Spatial Reference | 空間參考

```typescript
// WGS84 (EPSG:4326) - Standard for MapLibre GL JS
const WGS84_EPSG = 4326;

// Default center point (Victoria Harbour area)
const DEFAULT_CENTER: [number, number] = [114.1694, 22.3193]; // [longitude, latitude]

// Default bounds for Hong Kong
const HK_BOUNDS: [[number, number], [number, number]] = [
  [113.8259, 22.1533],  // Southwest
  [114.4069, 22.5620]   // Northeast
];
```

### Zoom Constraints | 縮放限制

```typescript
const ZOOM_CONSTRAINTS = {
  minZoom: 8,   // Hong Kong overview
  maxZoom: 19,  // Street level detail
  defaultZoom: 10
};
```

---

## Component Props Interface | 組件屬性介面

```typescript
interface HKMapProps {
  // Map configuration
  center?: [number, number];     // [longitude, latitude] in WGS84
  zoom?: number;                 // Initial zoom level (8-19)
  theme?: 'light' | 'dark' | 'auto';
  language?: 'zh' | 'en' | 'auto';
  
  // Styling
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  
  // Markers
  markers?: HKMapMarker[];
  
  // Events
  onLoad?: (map: MapInstance) => void;
  onClick?: (event: MapClickEvent) => void;
  onMarkerClick?: (marker: HKMapMarker) => void;
  
  // Accessibility
  ariaLabel?: string;
  tabIndex?: number;
}

interface HKMapMarker {
  id: string;
  position: [number, number];    // [longitude, latitude] in WGS84
  title?: string;
  popup?: string | React.ReactNode;
  icon?: string | MarkerIcon;
}
```

---

## File Structure | 檔案結構

```
hong-kong-open-map/
├── src/
│   ├── index.ts              # Main entry point
│   ├── react/                # React components
│   │   ├── HKMap.tsx         # Main map component
│   │   ├── HKMarker.tsx      # Marker component
│   │   ├── HKPopup.tsx       # Popup component
│   │   └── hooks/            # React hooks
│   │       ├── useMap.ts
│   │       └── useMarkers.ts
│   ├── vanilla/              # Vanilla JS implementation
│   │   ├── index.ts
│   │   ├── HKMap.ts
│   │   └── utils.ts
│   ├── core/                 # Shared core logic
│   │   ├── config.ts         # Map configuration
│   │   ├── tiles.ts          # Tile layer management
│   │   ├── themes.ts         # Theme definitions
│   │   ├── projection.ts     # Coordinate conversion
│   │   └── types.ts          # TypeScript types
│   ├── styles/               # CSS styles
│   │   ├── map.css
│   │   └── themes/
│   └── embed/                # iFrame embed page
│       └── index.html
├── dist/                     # Built files
├── docs/                     # Documentation
├── examples/                 # Usage examples
└── tests/                    # Test files
```

---

## Coding Standards | 編碼標準

### General Rules | 一般規則

1. **Comments in English only** - All code comments should be in English
2. **Documentation bilingual** - All user-facing docs in Chinese and English
3. **TypeScript strict mode** - Enable all strict type checking
4. **Named exports preferred** - Use named exports over default exports
5. **Functional components** - Use React functional components with hooks

### Naming Conventions | 命名慣例

```typescript
// Components: PascalCase with HK prefix
HKMap, HKMarker, HKPopup

// Hooks: camelCase with use prefix
useMap, useMarkers, useTheme

// Constants: SCREAMING_SNAKE_CASE
DEFAULT_CENTER, BASEMAP_URL, HK80_WKID

// Types/Interfaces: PascalCase with descriptive suffix
HKMapProps, MapClickEvent, MarkerOptions

// Files: kebab-case or PascalCase for components
hk-map.tsx or HKMap.tsx
```

### Error Handling | 錯誤處理

```typescript
// Always provide meaningful error messages
throw new Error('[HKMap] Failed to load map tiles. Check network connection.');

// Use error boundaries for React components
// Provide fallback UI for loading/error states
```

---

## Required Attribution | 必要版權聲明

All maps must include the following attribution:

```html
<a href="https://api.portal.hkmapservice.gov.hk/disclaimer" target="_blank">
  © Map information from Lands Department
</a>
<img src="https://api.hkmapservice.gov.hk/mapapi/landsdlogo.jpg" alt="Lands Department Logo" />
```

This is a **legal requirement** for using the Hong Kong government map tiles.

這是使用香港政府地圖圖磚的**法律要求**。

---

## Theme Configuration | 主題配置

```typescript
// Light theme (default)
const lightTheme = {
  style: 'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/basemap/WGS84/style.json',
  labelStyle: 'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/label/hk/tc/WGS84/style.json',
  attribution: {
    textColor: '#000000',
    backgroundColor: 'transparent'
  }
};

// Dark theme
const darkTheme = {
  style: 'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/basemap/WGS84/style_dark.json',
  labelStyle: 'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/label/hk/tc/WGS84/style.json',
  attribution: {
    textColor: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
};
```

---

## Coordinate Systems | 座標系統

MapLibre GL JS uses WGS84 natively - no coordinate conversion needed:

MapLibre GL JS 原生使用 WGS84 - 無需座標轉換：

| System | EPSG | Usage | 用途 |
|--------|------|-------|------|
| WGS84 | 4326 | All coordinates | 所有座標 |

```typescript
// Coordinates are [longitude, latitude] in WGS84
<HKMap center={[114.1694, 22.3193]} /> // Victoria Harbour

// No conversion needed - MapLibre uses WGS84 directly
// 無需轉換 - MapLibre 直接使用 WGS84
```

---

## Accessibility Requirements | 無障礙要求

1. **Keyboard Navigation** - Arrow keys for panning, +/- for zoom
2. **ARIA Labels** - Descriptive labels for screen readers
3. **Focus Management** - Visible focus indicators
4. **Color Contrast** - Meet WCAG 2.1 AA standards

```tsx
<HKMap
  ariaLabel="Interactive map of Hong Kong"
  tabIndex={0}
/>
```

---

## Testing Guidelines | 測試指南

```typescript
// Unit tests for utilities
describe('config', () => {
  it('returns correct style URL for theme', () => {
    expect(getStyleUrl('light')).toBe('https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/basemap/WGS84/style.json');
    expect(getStyleUrl('dark')).toBe('https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/basemap/WGS84/style_dark.json');
  });
});

// Integration tests for components
describe('HKMap', () => {
  it('renders map container', () => {
    render(<HKMap />);
    expect(screen.getByRole('application')).toBeInTheDocument();
  });
});
```

---

## Build Commands | 構建命令

```bash
# Development
bun run dev           # Start dev server
bun run dev:embed     # Start embed preview

# Build
bun run build         # Build all formats
bun run build:react   # Build React only
bun run build:vanilla # Build Vanilla JS only
bun run build:embed   # Build embed page

# Test
bun run test          # Run tests
bun run test:coverage # With coverage

# Publish
bun run prepublish    # Prepare for npm
npm publish           # Publish to npm
```

---

## API Documentation URLs | API 文檔網址

- Official API Docs | 官方 API 文檔: https://portal.csdi.gov.hk/csdi-webpage/apidoc/VectorMapAPI
- Map Service Portal | 地圖服務入口: https://api.portal.hkmapservice.gov.hk/
- Disclaimer | 免責聲明: https://api.portal.hkmapservice.gov.hk/disclaimer

---

## Common Issues | 常見問題

### CORS Errors | 跨域錯誤
The government API allows cross-origin requests. If you encounter CORS issues, check your proxy configuration.

政府 API 允許跨域請求。如遇 CORS 問題，請檢查代理配置。

### Style Loading | 樣式載入
Always use the WGS84 style URLs for MapLibre. The HK80 styles are for ArcGIS only.

MapLibre 必須使用 WGS84 樣式網址。HK80 樣式僅適用於 ArcGIS。

### Performance | 性能
Limit markers to <1000 for optimal performance. Use clustering for larger datasets.

為保持最佳性能，標記數量應少於 1000。大量數據請使用聚類功能。

### MapLibre CSS | MapLibre 樣式表
Always import MapLibre CSS for proper rendering: `import 'maplibre-gl/dist/maplibre-gl.css'`

必須引入 MapLibre CSS 以正確渲染：`import 'maplibre-gl/dist/maplibre-gl.css'`

---

## Contributing Guidelines | 貢獻指南

1. Fork the repository | 複製倉庫
2. Create feature branch | 建立功能分支
3. Write tests | 編寫測試
4. Update documentation (bilingual) | 更新文檔（雙語）
5. Submit pull request | 提交拉取請求

---

## License | 授權

MIT License - Free for commercial and personal use.

MIT 授權 - 可免費用於商業和個人用途。

Map data © Lands Department, HKSAR Government.

地圖數據 © 香港特區政府地政總署。
