import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { HKMapProps, HKTheme, HKLanguage, HKMapMarker } from '../core/types';
import { STYLE_URL, STYLE_URL_DARK, DEFAULT_CENTER, ZOOM_CONSTRAINTS, HK_BOUNDS, ATTRIBUTION, LABEL_STYLE_URL_ZH, LABEL_STYLE_URL_ZH_DARK, LABEL_STYLE_URL_EN, LABEL_STYLE_URL_EN_DARK } from '../core/config';
import { HKMarker } from './HKMarker';

interface HKMapComponentProps extends HKMapProps {
  children?: React.ReactNode;
}

export const HKMap = forwardRef<maplibregl.Map | null, HKMapComponentProps>((props: HKMapComponentProps, ref: React.ForwardedRef<maplibregl.Map | null>) => {
  const {
    apiKey,
    center = DEFAULT_CENTER,
    zoom = ZOOM_CONSTRAINTS.defaultZoom,
    minZoom = ZOOM_CONSTRAINTS.minZoom,
    maxZoom = ZOOM_CONSTRAINTS.maxZoom,
    theme = 'light' as HKTheme,
    language = 'zh' as HKLanguage,
    className,
    style,
    width = '100%',
    height = '400px',
    markers = [] as HKMapMarker[],
    onLoad,
    onClick,
    onMarkerClick,
    ariaLabel = 'Interactive map of Hong Kong',
    tabIndex = 0,
    children,
    // UI Controls - default to showing zoom and attribution
    showZoomControl = true,
    showNavigationControl = false,
    showScaleControl = false,
    showFullscreenControl = false,
    showAttributionControl = true,
    // Labels
    showLabels = true,
    labelScale = 1.0,
  } = props;
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<HKTheme>(theme);
  const [currentLanguage, setCurrentLanguage] = useState<HKLanguage>(language);

  useImperativeHandle(ref, () => map.current!);

  const getStyleUrl = (t: HKTheme) => {
    let baseUrl = '';
    if (t === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      baseUrl = isDark ? STYLE_URL_DARK : STYLE_URL;
    } else {
      baseUrl = t === 'dark' ? STYLE_URL_DARK : STYLE_URL;
    }
    return baseUrl;
  };

  const BASE_VT_URL = 'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt';

  useEffect(() => {
    if (!mapContainer.current) return;

    const loadStyle = async () => {
      const url = getStyleUrl(theme);
      try {
        const response = await fetch(apiKey ? `${url}?key=${apiKey}` : url);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const style = await response.json();
        
        // Extract base path for absolute resolution
        // e.g., https://.../vt/topographic/WGS84/resources/styles/root.json -> https://.../vt/topographic/WGS84
        const resourcesIndex = url.indexOf('/resources/');
        const baseVTUrl = resourcesIndex !== -1 ? url.substring(0, resourcesIndex) : '';

        // Fix sources
        if (style.sources) {
          Object.keys(style.sources).forEach(key => {
            const source = style.sources[key];
            if (source.url && source.url.startsWith('../../')) {
              // HK GeoData API uses {z}/{y}/{x} tile format (not standard {z}/{x}/{y})
              delete source.url;
              const tileUrl = `${baseVTUrl}/tile/{z}/{y}/{x}.pbf`;
              source.tiles = [apiKey ? `${tileUrl}?key=${apiKey}` : tileUrl];
              source.scheme = 'xyz';
            } else if (source.url && !source.url.startsWith('http')) {
              // Fallback for other relative paths
              const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
              source.url = new URL(source.url, baseUrl).href;
            }
          });
        }

        // Fix glyphs
        if (style.glyphs && style.glyphs.startsWith('../')) {
          style.glyphs = style.glyphs.replace('../', `${baseVTUrl}/resources/`);
        }

        // Fix sprites
        if (style.sprite && style.sprite.startsWith('../')) {
          style.sprite = style.sprite.replace('../', `${baseVTUrl}/resources/`);
        }

        if (map.current) {
          map.current.setStyle(style);
        }
      } catch (err) {
        console.error('[HKMap] Failed to load/patch map style:', err);
        if (map.current) map.current.setStyle(url);
      }
    };

    map.current = new maplibregl.Map({
      container: mapContainer.current,
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

    loadStyle();

    // Add UI controls based on props
    if (showZoomControl) {
      map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    }
    if (showNavigationControl) {
      map.current.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    }
    if (showScaleControl) {
      map.current.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');
    }
    if (showFullscreenControl) {
      map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');
    }

    if (showAttributionControl) {
      map.current.addControl(
        new maplibregl.AttributionControl({
          customAttribution: ATTRIBUTION,
        }),
        'bottom-right'
      );
    }

    map.current.on('load', () => {
      setIsLoaded(true);
      if (map.current) {
        if (showLabels) {
          applyLanguage(language);
        }
        onLoad?.(map.current);
      }
    });

    map.current.on('click', (e: maplibregl.MapMouseEvent) => {
      onClick?.(e);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (map.current && theme !== currentTheme) {
      map.current.setStyle(theme === 'dark' ? STYLE_URL_DARK : STYLE_URL);
      setCurrentTheme(theme);
      if (isLoaded) {
        map.current.once('style.load', () => applyLanguage(language));
      }
    }
  }, [theme, apiKey]);

  useEffect(() => {
    if (map.current && isLoaded && language !== currentLanguage) {
      applyLanguage(language);
      setCurrentLanguage(language);
    }
  }, [language, isLoaded]);

  const applyLanguage = async (lang: HKLanguage) => {
    if (!map.current) return;
    
    const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const labelStyleUrl = lang === 'en' 
      ? (isDark ? LABEL_STYLE_URL_EN_DARK : LABEL_STYLE_URL_EN)
      : (isDark ? LABEL_STYLE_URL_ZH_DARK : LABEL_STYLE_URL_ZH);

    try {
      const response = await fetch(labelStyleUrl);
      const labelStyle = await response.json();
      
      const mapInstance = map.current;

      // 1. Remove existing label layers and source
      const existingLayers = mapInstance.getStyle().layers;
      existingLayers.forEach(layer => {
        if (layer.id.startsWith('hk-label-')) {
          mapInstance.removeLayer(layer.id);
        }
      });

      if (mapInstance.getSource('hk-labels')) {
        mapInstance.removeSource('hk-labels');
      }

      // 2. Hide base labels in the basemap style
      // Most basemap label layers contain "/label/" in their ID
      mapInstance.getStyle().layers.forEach(layer => {
        if (layer.id.includes('/label/')) {
          mapInstance.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });

      // 3. Add the label source
      // HK GeoData API uses {z}/{y}/{x} tile format (not standard {z}/{x}/{y})
      const tileUrl = labelStyleUrl.replace('/resources/styles/root.json', '/tile/{z}/{y}/{x}.pbf');
      const tileUrlDark = labelStyleUrl.replace('/resources/styles/root_dark.json', '/tile/{z}/{y}/{x}.pbf');
      
      const finalTileUrl = isDark ? tileUrlDark : tileUrl;

      mapInstance.addSource('hk-labels', {
        type: 'vector',
        tiles: [apiKey ? `${finalTileUrl}?key=${apiKey}` : finalTileUrl],
        minzoom: 0,
        maxzoom: 19
      });

      // 4. Add the layers from the label style with optional scaling
      const scale = Math.max(0.5, Math.min(2.0, labelScale)); // Clamp between 0.5 and 2.0
      labelStyle.layers.forEach((layer: any) => {
        // Only add symbol and circle layers (the labels)
        if (layer.type === 'symbol' || layer.type === 'circle') {
          const newLayer = {
            ...layer,
            id: `hk-label-${layer.id}`,
            source: 'hk-labels'
          };
          
          // Apply text size scaling
          if (newLayer.layout && newLayer.layout['text-size'] && scale !== 1.0) {
            const originalSize = newLayer.layout['text-size'];
            if (typeof originalSize === 'number') {
              newLayer.layout['text-size'] = originalSize * scale;
            } else if (Array.isArray(originalSize) && originalSize[0] === 'interpolate') {
              // Handle interpolate expressions - scale the output values
              newLayer.layout['text-size'] = originalSize.map((item: any, idx: number) => {
                if (idx > 2 && idx % 2 === 0 && typeof item === 'number') {
                  return item * scale;
                }
                return item;
              });
            }
          }
          
          mapInstance.addLayer(newLayer);
        }
      });
    } catch (error) {
      console.error('[HKMap] Failed to apply language labels:', error);
    }
  };


  const containerStyle: React.CSSProperties = {
    width,
    height,
    position: 'relative',
    ...style,
  };

  return (
    <div
      ref={mapContainer}
      className={className}
      style={containerStyle}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      role="application"
    >
      {isLoaded && (
        <>
          {markers.map((marker: HKMapMarker) => (
            <HKMarker
              key={marker.id}
              map={map.current!}
              {...marker}
              onClick={onMarkerClick}
            />
          ))}
          {React.Children.map(children, (child: React.ReactNode) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { map: map.current } as React.Attributes & { map: maplibregl.Map | null });
            }
            return child;
          })}
        </>
      )}
    </div>
  );
});

