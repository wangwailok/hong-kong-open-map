import React, { useState } from 'react';
import { HKMap, HKMarker, HKPopup } from 'hong-kong-open-map';
import 'hong-kong-open-map/dist/style.css';

/**
 * Basic Example showing a map with a marker and a popup.
 */
export const BasicExample = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>React Basic Example</h1>
      <HKMap 
        height="500px" 
        theme="light"
        center={[114.1694, 22.3193]} 
        zoom={12}
      >
        <HKMarker 
          id="marker-1"
          position={[114.1694, 22.3193]}
          title="Victoria Harbour"
        />
        <HKPopup position={[114.1694, 22.3193]}>
          <div style={{ color: '#333' }}>
            <h3>Victoria Harbour</h3>
            <p>The iconic heart of Hong Kong.</p>
          </div>
        </HKPopup>
      </HKMap>
    </div>
  );
};

/**
 * Advanced Example with state management and interactive features.
 */
export const InteractiveExample = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [markers, setMarkers] = useState([
    { id: 'central', position: [114.1577, 22.2820] as [number, number], title: 'Central' },
    { id: 'mong-kok', position: [114.1694, 22.3193] as [number, number], title: 'Mong Kok' }
  ]);

  const addMarker = (e: any) => {
    const { lng, lat } = e.lngLat;
    const newMarker = {
      id: `m-${Date.now()}`,
      position: [lng, lat] as [number, number],
      title: 'New Point'
    };
    setMarkers([...markers, newMarker]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Interactive React Demo</h1>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setTheme('light')}>Light</button>
        <button onClick={() => setTheme('dark')}>Dark</button>
        <button onClick={() => setTheme('auto')}>Auto (System)</button>
        <span style={{ marginLeft: '15px' }}>Click map to add markers!</span>
      </div>

      <HKMap 
        height="600px" 
        theme={theme}
        onClick={addMarker}
      >
        {markers.map(m => (
          <HKMarker 
            key={m.id} 
            id={m.id} 
            position={m.position} 
            title={m.title} 
          />
        ))}
      </HKMap>
    </div>
  );
};
