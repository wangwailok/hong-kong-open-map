import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { createRoot } from 'react-dom/client';

interface HKPopupProps {
  map?: maplibregl.Map;
  position: [number, number];
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  maxWidth?: string;
}

export const HKPopup: React.FC<HKPopupProps> = ({
  map,
  position,
  children,
  onClose,
  className,
  maxWidth = '300px',
}) => {
  const popupRef = useRef<maplibregl.Popup | null>(null);

  useEffect(() => {
    if (!map) return;

    const popupNode = document.createElement('div');
    const root = createRoot(popupNode);
    root.render(children);

    const popup = new maplibregl.Popup({
      className,
      maxWidth,
      closeButton: true,
      closeOnClick: false,
    })
      .setLngLat(position)
      .setDOMContent(popupNode)
      .addTo(map);

    popup.on('close', () => {
      onClose?.();
      // Clean up root after a short delay to allow transition
      setTimeout(() => root.unmount(), 300);
    });

    popupRef.current = popup;

    return () => {
      popup.remove();
      root.unmount();
    };
  }, [map, position, children, className, maxWidth]);

  return null;
};
