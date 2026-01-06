import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { HKMapProps, HKTheme, HKLanguage, HKMapMarker } from '../core/types';
import { STYLE_URL, STYLE_URL_DARK, DEFAULT_CENTER, ZOOM_CONSTRAINTS, HK_BOUNDS, ATTRIBUTION, LABEL_STYLE_URL_ZH, LABEL_STYLE_URL_ZH_DARK, LABEL_STYLE_URL_EN, LABEL_STYLE_URL_EN_DARK } from '../core/config';

export class HKMap {
  private map: maplibregl.Map;
  private container: HTMLElement;
  private markers: Map<string, maplibregl.Marker> = new Map();
  private apiKey?: string;
  private currentTheme: HKTheme = 'light';

  constructor(containerId: string, options: HKMapProps = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`[HKMap] Container with id "${containerId}" not found.`);
    }
    this.container = container;
    this.apiKey = options.apiKey;
    this.currentTheme = options.theme || 'light';

    const {
      apiKey,
      center = DEFAULT_CENTER,
      zoom = ZOOM_CONSTRAINTS.defaultZoom,
      minZoom = ZOOM_CONSTRAINTS.minZoom,
      maxZoom = ZOOM_CONSTRAINTS.maxZoom,
      theme = 'light',
      language = 'zh',
      markers = [],
      // UI Controls
      showZoomControl = true,
      showNavigationControl = false,
      showScaleControl = false,
      showFullscreenControl = false,
      showAttributionControl = true,
      // Labels
      showLabels = true,
      labelScale = 1.0,
    } = options;

    if (options.width) this.container.style.width = typeof options.width === 'number' ? `${options.width}px` : options.width;
    if (options.height) this.container.style.height = typeof options.height === 'number' ? `${options.height}px` : options.height;

    this.map = new maplibregl.Map({
      container: this.container,
      style: { 
        version: 8, 
        sources: {}, 
        layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#f8f8f8' } }] 
      },
      center: center,
      zoom: Math.min(Math.max(zoom, minZoom), maxZoom),
      minZoom: minZoom,
      maxZoom: maxZoom,
      maxBounds: HK_BOUNDS,
      attributionControl: false,
    });

    const styleUrl = theme === 'dark' ? STYLE_URL_DARK : STYLE_URL;
    this.loadStyle(styleUrl, apiKey);

    // Add UI controls based on options
    if (showZoomControl) {
      this.map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    }
    if (showNavigationControl) {
      this.map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    }
    if (showScaleControl) {
      this.map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');
    }
    if (showFullscreenControl) {
      this.map.addControl(new maplibregl.FullscreenControl(), 'top-right');
    }
    if (showAttributionControl) {
      this.map.addControl(
        new maplibregl.AttributionControl({
          customAttribution: ATTRIBUTION,
        }),
        'bottom-right'
      );
    }

    this.map.on('load', () => {
      if (showLabels) {
        this.applyLanguage(language, labelScale);
      }
      this.addMarkers(markers);
      if (options.onLoad) options.onLoad(this.map);
    });

    if (options.onClick) {
      this.map.on('click', options.onClick);
    }
  }

  getMapInstance() {
    return this.map;
  }

  setTheme(theme: HKTheme) {
    this.currentTheme = theme;
    const styleUrl = theme === 'dark' ? STYLE_URL_DARK : STYLE_URL;
    this.loadStyle(styleUrl, this.apiKey);
  }

  setLanguage(language: HKLanguage) {
    this.applyLanguage(language);
  }

  private async loadStyle(url: string, apiKey?: string) {
    try {
      const response = await fetch(apiKey ? `${url}?key=${apiKey}` : url);
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const style = await response.json();
      
      const resourcesIndex = url.indexOf('/resources/');
      const baseVTUrl = resourcesIndex !== -1 ? url.substring(0, resourcesIndex) : '';

      // Fix relative paths in the style object
      if (style.sources) {
        Object.keys(style.sources).forEach(key => {
          const source = style.sources[key];
          if (source.url && source.url.startsWith('../../')) {
            // HK GeoData API uses {z}/{y}/{x} tile format (not standard {z}/{x}/{y})
            delete source.url;
            const tileUrl = `${baseVTUrl}/tile/{z}/{y}/{x}.pbf`;
            source.tiles = [apiKey ? `${tileUrl}?key=${apiKey}` : tileUrl];
            source.scheme = 'xyz';
          }
        });
      }

      if (style.glyphs && style.glyphs.startsWith('../')) {
        style.glyphs = style.glyphs.replace('../', `${baseVTUrl}/resources/`);
      }

      if (style.sprite && style.sprite.startsWith('../')) {
        style.sprite = style.sprite.replace('../', `${baseVTUrl}/resources/`);
      }

      this.map.setStyle(style);
    } catch (err) {
      console.error('[HKMap] Failed to load/patch map style:', err);
      this.map.setStyle(url);
    }
  }

  private async applyLanguage(lang: HKLanguage, scale: number = 1.0) {
    let isDark = this.currentTheme === 'dark';
    if (this.currentTheme === 'auto') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    const apiKey = this.apiKey;
    const labelStyleUrl = lang === 'en' 
      ? (isDark ? LABEL_STYLE_URL_EN_DARK : LABEL_STYLE_URL_EN)
      : (isDark ? LABEL_STYLE_URL_ZH_DARK : LABEL_STYLE_URL_ZH);

    try {
      const response = await fetch(labelStyleUrl);
      const labelStyle = await response.json();

      // 1. Remove existing label layers and source
      const existingLayers = this.map.getStyle().layers;
      existingLayers.forEach(layer => {
        if (layer.id.startsWith('hk-label-')) {
          this.map.removeLayer(layer.id);
        }
      });

      if (this.map.getSource('hk-labels')) {
        this.map.removeSource('hk-labels');
      }

      // 2. Hide base labels in the basemap style
      this.map.getStyle().layers.forEach(layer => {
        if (layer.id.includes('/label/')) {
          this.map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });

      // 3. Add the label source
      // HK GeoData API uses {z}/{y}/{x} tile format (not standard {z}/{x}/{y})
      const tileUrl = labelStyleUrl.replace('/resources/styles/root.json', '/tile/{z}/{y}/{x}.pbf')
                                   .replace('/resources/styles/root_dark.json', '/tile/{z}/{y}/{x}.pbf');
      
      this.map.addSource('hk-labels', {
        type: 'vector',
        tiles: [apiKey ? `${tileUrl}?key=${apiKey}` : tileUrl],
        minzoom: 0,
        maxzoom: 19
      });

      // 4. Add the layers with optional scaling
      const labelScale = Math.max(0.5, Math.min(2.0, scale)); // Clamp between 0.5 and 2.0
      labelStyle.layers.forEach((layer: any) => {
        if (layer.type === 'symbol' || layer.type === 'circle') {
          const newLayer = {
            ...layer,
            id: `hk-label-${layer.id}`,
            source: 'hk-labels'
          };
          
          // Apply text size scaling
          if (newLayer.layout && newLayer.layout['text-size'] && labelScale !== 1.0) {
            const originalSize = newLayer.layout['text-size'];
            if (typeof originalSize === 'number') {
              newLayer.layout['text-size'] = originalSize * labelScale;
            } else if (Array.isArray(originalSize) && originalSize[0] === 'interpolate') {
              newLayer.layout['text-size'] = originalSize.map((item: any, idx: number) => {
                if (idx > 2 && idx % 2 === 0 && typeof item === 'number') {
                  return item * labelScale;
                }
                return item;
              });
            }
          }
          
          this.map.addLayer(newLayer);
        }
      });
    } catch (error) {
      console.error('[HKMap] Failed to apply language labels:', error);
    }
  }

  addMarkers(markers: HKMapMarker[]) {
    markers.forEach(m => this.addMarker(m));
  }

  addMarker(options: HKMapMarker) {
    const el = options.icon instanceof HTMLElement ? options.icon : undefined;
    const marker = new maplibregl.Marker({ element: el })
      .setLngLat(options.position)
      .addTo(this.map);

    if (options.title) {
      marker.getElement().title = options.title;
    }

    if (options.popup) {
      const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML(typeof options.popup === 'string' ? options.popup : '');
      marker.setPopup(popup);
    }

    this.markers.set(options.id, marker);
    return marker;
  }

  removeMarker(id: string) {
    const marker = this.markers.get(id);
    if (marker) {
      marker.remove();
      this.markers.delete(id);
    }
  }

  destroy() {
    this.markers.forEach(m => m.remove());
    this.markers.clear();
    this.map.remove();
  }
}

