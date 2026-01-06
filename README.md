# Hong Kong Open Map | 香港開放地圖

<p align="center">
  <strong>🗺️ Free, open-source map component for Hong Kong • 免費開源香港地圖組件</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/hong-kong-open-map"><img src="https://img.shields.io/npm/v/hong-kong-open-map" alt="npm"></a>
  <a href="https://github.com/wangwailok/hong-kong-open-map/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
  <a href="https://wangwailok.com/hong-kong-open-map/"><img src="https://img.shields.io/badge/demo-live-brightgreen" alt="Live Demo"></a>
</p>

---

## Why I Built This | 我為什麼做這個

### English
I created **Hong Kong Open Map** for the **vibe coding** community – developers who build for fun, for learning, or for side projects.

**The problem:** Google Maps is expensive. Sometimes you just want to show your company's location on a contact page. But when traffic grows, you hit API limits and face unexpected bills. This shouldn't happen for something as basic as displaying a map.

**The solution:** Hong Kong Open Map uses **official government tiles from the Lands Department (地政總署)**. 
- ✅ **100% Free** – No API keys, no usage limits, no bills. Ever.
- ✅ **Fast & Accurate** – Data served directly from HK government servers.
- ✅ **No Bandwidth Costs** – You don't host the tiles, the government does.
- ✅ **Universal** – Works with React, HTML, Blogger, WordPress, etc.

### 中文
我為 **vibe coding** 社群創建了**香港開放地圖** – 那些為興趣、學習或 side project 而編程的開發者。

**問題：** Google Maps 太貴了。有時你只想在網頁顯示公司位置，但當流量增加，你就會遇到 API 限制，甚至收到預料之外的賬單。顯示地圖這麼基本的功能，不應該這麼煩人。

**解決方案：** 香港開放地圖使用**地政總署官方圖磚**。
- ✅ **完全免費** – 無需 API Key、無使用限制、無賬單。永遠。
- ✅ **快速準確** – 數據直接從香港政府伺服器提供。
- ✅ **無頻寬成本** – 你不需要託管圖磚，政府負責。
- ✅ **全平台支援** – React、HTML、Blogger、WordPress 等都用得。

---

## Features | 特色

| Feature | 特色 | Description |
|---------|------|-------------|
| 🆓 **Free Forever** | 永久免費 | No API key, no limits, no cost. |
| 🏛️ **Official Data** | 官方數據 | Uses HK Lands Department vector tiles. |
| 🌐 **Bilingual** | 雙語支援 | Traditional Chinese & English labels. |
| 🎨 **Themes** | 主題 | Light, Dark, and Auto mode support. |
| 📍 **Markers** | 標記 | Easily add markers with custom popups. |
| ⚡ **Fast** | 快速 | WebGL rendering via MapLibre GL JS. |
| 🔧 **TypeScript** | 類型安全 | Full TypeScript support and DX. |

---

## Quick Start | 快速開始

### 1. Installation | 安裝

```bash
# Using npm
npm install hong-kong-open-map

# Using bun (recommended)
bun add hong-kong-open-map
```

### 2. Usage | 使用方法

#### React

```tsx
import { HKMap, HKMarker } from 'hong-kong-open-map';

function App() {
  return (
    <div style={{ height: '500px' }}>
      <HKMap 
        center={[114.1694, 22.3193]} 
        zoom={12}
        theme="light"
        language="zh"
      >
        <HKMarker 
          position={[114.1694, 22.3193]} 
          title="Victoria Harbour" 
        />
      </HKMap>
    </div>
  );
}
```

#### Vanilla JavaScript (CDN)

```html
<!-- Include MapLibre GL CSS -->
<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.0.0/dist/maplibre-gl.css">

<!-- Use the UMD bundle -->
<script src="https://unpkg.com/hong-kong-open-map/dist/vanilla.umd.js"></script>

<div id="map" style="width: 100%; height: 500px;"></div>

<script>
  const map = new HKMap('map', {
    center: [114.1694, 22.3193],
    zoom: 12,
    theme: 'auto'
  });
</script>
```

#### iFrame Embed (No Code) | 嵌入式 (免代碼)

Perfect for Blogger, WordPress, or simple sites.

```html
<iframe 
  src="https://wangwailok.com/hong-kong-open-map/embed?lat=22.3193&lng=114.1694&zoom=12"
  width="100%" 
  height="450px" 
  frameborder="0"
></iframe>
```

---

## API Reference | API 參考

### HKMap Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `center` | `[number, number]` | `[114.17, 22.32]` | Map center `[lng, lat]` (WGS84). |
| `zoom` | `number` | `11` | Initial zoom level (8-19). |
| `minZoom` | `number` | `10` | Minimum zoom level. |
| `maxZoom` | `number` | `15` | Maximum zoom level. |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Map color scheme. |
| `language` | `'zh' \| 'en' \| 'auto'` | `'zh'` | Label language (Traditional Chinese/English). |
| `markers` | `HKMapMarker[]` | `[]` | Array of marker objects. |
| `className` | `string` | - | CSS class for the container. |
| `style` | `CSSProperties` | - | Inline styles for the container. |
| `width` | `string \| number` | `'100%'` | Container width. |
| `height` | `string \| number` | `'400px'` | Container height. |
| `ariaLabel` | `string` | 'Interactive map...' | ARIA label for accessibility. |
| `tabIndex` | `number` | `0` | Tab index for keyboard navigation. |

### UI Controls & Labels

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showZoomControl` | `boolean` | `true` | Show +/- zoom buttons. |
| `showNavigationControl`| `boolean` | `false` | Show compass/rotation control. |
| `showScaleControl` | `boolean` | `false` | Show map scale. |
| `showFullscreenControl`| `boolean` | `false` | Show fullscreen toggle. |
| `showAttributionControl`| `boolean` | `true` | Show LandsD attribution. |
| `showLabels` | `boolean` | `true` | Show/hide place names. |
| `labelScale` | `number` | `1.0` | Scale factor for labels (0.5 - 2.0). |

### Event Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onLoad` | `(map: Map) => void` | Callback when map finishes loading. |
| `onClick` | `(event: MapMouseEvent) => void` | Triggered when map is clicked. |
| `onMarkerClick` | `(marker: HKMapMarker) => void` | Triggered when a marker is clicked. |

### HKMarker Props

| Prop | Type | Description |
|------|------|-------------|
| `position` | `[number, number]` | `[lng, lat]` location. |
| `title` | `string` | Tooltip text (native). |
| `popup` | `ReactNode \| string` | Content to show when clicked. |

---

## Attribution | 必要版權聲明

This library uses map tiles from the Lands Department of the HKSAR Government. According to the Terms of Use, the following attribution is **automatically included** in the component:

本庫使用香港特別行政區政府地政總署提供的地圖圖磚。根據使用條款，組件已**自動包含**以下版權聲明：

> © Map information from Lands Department

---

## Author | 作者

Created with ❤️ by [Lok Wang](https://www.wangwailok.com/) for the developer community.

## License | 授權

MIT License. Free for personal and commercial use.
Map data © [Lands Department](https://api.portal.hkmapservice.gov.hk/disclaimer), HKSAR Government.

