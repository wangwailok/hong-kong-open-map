import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { HKMapMarker } from '../core/types';

interface HKMarkerProps extends HKMapMarker {
  map?: maplibregl.Map;
  onClick?: (marker: HKMapMarker) => void;
}

export const HKMarker: React.FC<HKMarkerProps> = (props) => {
  const { map, position, title, icon, onClick } = props;
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    const el = icon instanceof HTMLElement ? icon : undefined;
    
    const marker = new maplibregl.Marker({
      element: el,
    })
      .setLngLat(position)
      .addTo(map);

    if (title) {
      marker.getElement().title = title;
    }

    marker.getElement().addEventListener('click', () => {
      onClick?.(props);
    });

    markerRef.current = marker;

    return () => {
      marker.remove();
    };
  }, [map, position, icon, title]);

  return null;
};
