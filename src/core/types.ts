import { Map as MapInstance, MapMouseEvent } from 'maplibre-gl';
import { ReactNode } from 'react';

export type HKTheme = 'light' | 'dark' | 'auto';
export type HKLanguage = 'zh' | 'en' | 'auto';

export interface HKMapMarker {
  id: string;
  position: [number, number]; // [longitude, latitude] in WGS84
  title?: string;
  popup?: string | ReactNode;
  icon?: string | HTMLElement;
}

export interface HKMapProps {
  apiKey?: string;
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  theme?: HKTheme;
  language?: HKLanguage;
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  markers?: HKMapMarker[];
  onLoad?: (map: MapInstance) => void;
  onClick?: (event: MapMouseEvent) => void;
  onMarkerClick?: (marker: HKMapMarker) => void;
  ariaLabel?: string;
  tabIndex?: number;
  // UI Controls
  showZoomControl?: boolean;
  showNavigationControl?: boolean;
  showScaleControl?: boolean;
  showFullscreenControl?: boolean;
  showAttributionControl?: boolean;
  // Labels
  showLabels?: boolean;
  labelScale?: number; // 0.5 to 2.0, default 1.0
}
