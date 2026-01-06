# Hong Kong Open Map | 香港開放地圖

免費開源香港地圖套件，使用香港政府地政總署官方矢量圖磚。為香港應用程式提供 Google Maps 的完美替代方案。

✨ Features | 特色
- 🏛️ **Official Data** - Uses Hong Kong government's official vector tiles (地政總署官方矢量圖磚)
- 🎨 **Light & Dark Themes** - Beautiful built-in themes with auto-detection (淺色/深色主題，支援自動切換)
- 🌏 **Bilingual Labels** - Chinese and English map labels (中英文標籤)
- 📍 **Customizable Markers** - Easy marker creation with popups (自訂標記與彈出視窗)
- 📱 **Responsive Design** - Works on all devices (響應式設計)
- ♿ **Accessible** - Keyboard navigation and ARIA support (無障礙支援)
- 📦 **Multiple Formats** - React, Vanilla JS, and iFrame embed (多種使用方式)
- 🔧 **TypeScript Ready** - Full TypeScript support with type definitions (完整 TypeScript 支援)

## Installation | 安裝

```bash
npm install hong-kong-open-map
# or
bun add hong-kong-open-map
```

## Quick Start | 快速開始

For more detailed examples, check the [examples/](examples/) directory.

> **Note:** Due to browser security restrictions on ES Modules, you cannot open the vanilla demo directly via `file://`. Please use a local server.
> 
> **注意：** 由於瀏覽器對 ES 模組的安全限制，您不能直接經由 `file://` 打開 vanilla demo。請使用本地伺服器。

```bash
bun run dev:examples
# Open http://localhost:3000/examples/vanilla/index.html
```

### React

```tsx
import { HKMap, HKMarker, HKPopup } from 'hong-kong-open-map';
import 'hong-kong-open-map/dist/style.css';

function App() {
  return (
    <HKMap theme="auto" height="500px">
      <HKMarker 
        id="v-harbour" 
        position={[114.1694, 22.3193]} 
        title="Victoria Harbour" 
      />
      <HKPopup position={[114.1694, 22.3193]}>
        <h3>Victoria Harbour | 維多利亞港</h3>
        <p>The iconic harbour of Hong Kong.</p>
      </HKPopup>
    </HKMap>
  );
}
```

### Vanilla JavaScript

```html
<link rel="stylesheet" href="https://unpkg.com/hong-kong-open-map/dist/style.css">
<div id="map" style="height: 500px;"></div>

<script type="module">
  import { HKMap } from 'https://unpkg.com/hong-kong-open-map/dist/vanilla/index.js';
  
  const map = new HKMap('map', {
    theme: 'light',
    zoom: 12
  });

  map.addMarker({
    id: 'marker-1',
    position: [114.1694, 22.3193],
    title: 'Victoria Harbour',
    popup: '<b>Victoria Harbour</b>'
  });
</script>
```

### iFrame Embed

```html
<iframe 
  src="https://wangwailok.com/hong-kong-open-map/embed?lat=22.3193&lng=114.1694&zoom=10"
  width="100%" 
  height="500px" 
  frameborder="0"
></iframe>
```

## Required Attribution | 必要版權聲明

All maps must include the following attribution (included by default in the components):

```html
© Map information from Lands Department
```

## License | 授權

MIT License. Map data © Lands Department, HKSAR Government.
