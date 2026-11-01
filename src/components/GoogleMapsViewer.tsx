import React, { useState, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  MapCameraChangedEvent
} from '@vis.gl/react-google-maps';
import { StateData, FreightHubPin } from '../types/state';
import { US_STATES, STATES_BY_ID } from '../data/states';
import { MAJOR_FREIGHT_HUBS } from '../data/usMapPaths';
import {
  MapPin, Navigation, Eye, EyeOff, Radio,
  Compass, Layers, AlertTriangle, ShieldCheck, Maximize2, RotateCcw
} from 'lucide-react';

interface GoogleMapsViewerProps {
  selectedState: StateData | null;
  onSelectState: (state: StateData) => void;
  apiKey?: string;
}

// Subcomponent to control map camera and live traffic layer
function MapController({
  selectedState,
  showTraffic
}: {
  selectedState: StateData | null;
  showTraffic: boolean;
}) {
  const map = useMap();
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);

  // Sync pan & zoom to selected state
  useEffect(() => {
    if (!map || !selectedState) return;

    let targetZoom = 6;
    if (selectedState.id === 'AK') targetZoom = 4;
    else if (['TX', 'CA', 'MT'].includes(selectedState.id)) targetZoom = 5;
    else if (['RI', 'DE', 'CT', 'NJ', 'DC', 'PR', 'VI', 'GU'].includes(selectedState.id)) targetZoom = 8;

    map.panTo(selectedState.coordinates);
    map.setZoom(targetZoom);
  }, [map, selectedState]);

  // Handle Google Maps Live Traffic Layer
  useEffect(() => {
    if (!map) return;

    if (showTraffic) {
      if (!trafficLayerRef.current) {
        trafficLayerRef.current = new google.maps.TrafficLayer();
      }
      trafficLayerRef.current.setMap(map);
    } else {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
    }

    return () => {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
    };
  }, [map, showTraffic]);

  return null;
}

export const GoogleMapsViewer: React.FC<GoogleMapsViewerProps> = ({
  selectedState,
  onSelectState,
  apiKey: propApiKey
}) => {
  const apiKey =
    propApiKey ||
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyCKd4xU7EUxiUw2475Aw36SRWtQsJdZ-mE';

  const [mapType, setMapType] = useState<string>('roadmap');
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [showHubs, setShowHubs] = useState<boolean>(true);
  const [activeInfoWindow, setActiveInfoWindow] = useState<{
    type: 'state' | 'hub';
    state?: StateData;
    hub?: FreightHubPin;
  } | null>(null);

  // Default center of USA
  const defaultCenter = selectedState?.coordinates || { lat: 39.8283, lng: -98.5795 };

  const handleResetToUs = () => {
    if (selectedState) {
      // re-trigger centering
      onSelectState(selectedState);
    }
  };

  return (
    <div className="relative w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-2xl backdrop-blur-md">
      {/* Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 flex-wrap">
              Google Maps Pro: Jonli Tirbandlik va Sun'iy Yo'ldosh Xaritasi
              {selectedState && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedState.name} ({selectedState.id})
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Haqiqiy Google Maps xaritasi: Real vaqtdagi yo'l tirbandliklari (traffic) va logistika terminallari
            </p>
          </div>
        </div>

        {/* Map Type & Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Traffic Toggle */}
          <button
            type="button"
            onClick={() => setShowTraffic(!showTraffic)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              showTraffic
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Jonli Tirbandlik (Traffic)</span>
          </button>

          {/* Freight Hubs Toggle */}
          <button
            type="button"
            onClick={() => setShowHubs(!showHubs)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              showHubs
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Yuk Markazlari</span>
          </button>

          {/* Map Type Select */}
          <select
            value={mapType as any}
            onChange={(e) => setMapType(e.target.value as any)}
            className="py-1.5 px-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
          >
            <option value="roadmap">Xarita (Roadmap)</option>
            <option value="satellite">Sun'iy yo'ldosh (Satellite)</option>
            <option value="hybrid">Gibrid (Hybrid)</option>
            <option value="terrain">Relyef (Terrain)</option>
          </select>
        </div>
      </div>

      {/* Google Maps Container */}
      <div className="relative w-full h-[520px] rounded-xl border border-slate-800 overflow-hidden shadow-inner bg-slate-950">
        <APIProvider
          apiKey={apiKey}
          language="uz"
          region="US"
          {...({ internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'] } as any)}
        >
          <Map
            mapId="DEMO_MAP_ID"
            {...({ internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'] } as any)}
            style={{ width: '100%', height: '100%' }}
            defaultCenter={defaultCenter}
            defaultZoom={selectedState ? 6 : 4}
            mapTypeId={mapType as any}
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            <MapController selectedState={selectedState} showTraffic={showTraffic} />

            {/* Selected Active State Marker */}
            {selectedState && (
              <AdvancedMarker
                position={selectedState.coordinates}
                onClick={() =>
                  setActiveInfoWindow({ type: 'state', state: selectedState })
                }
                title={`${selectedState.name} (${selectedState.id})`}
              >
                <div className="flex flex-col items-center cursor-pointer group">
                  <div className="px-2.5 py-1 bg-amber-500 text-slate-950 font-mono font-black text-xs rounded-lg shadow-xl shadow-amber-500/50 ring-2 ring-white flex items-center gap-1 animate-bounce">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedState.id}</span>
                  </div>
                  <div className="w-2 h-2 bg-amber-500 rotate-45 -mt-1 ring-1 ring-white" />
                </div>
              </AdvancedMarker>
            )}

            {/* Bordering States Markers */}
            {selectedState?.borderingStates.map((bId) => {
              const bState = STATES_BY_ID.get(bId);
              if (!bState) return null;
              return (
                <AdvancedMarker
                  key={bId}
                  position={bState.coordinates}
                  onClick={() => onSelectState(bState)}
                  title={`Chegaradosh: ${bState.name} (${bId})`}
                >
                  <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
                    <div className="px-2 py-0.5 bg-sky-600 text-white font-mono font-bold text-[11px] rounded-md shadow-md ring-1 ring-sky-300">
                      {bId}
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* Freight Hubs Markers */}
            {showHubs &&
              MAJOR_FREIGHT_HUBS.map((hub) => {
                const hubState = STATES_BY_ID.get(hub.stateId);
                const isSelected = selectedState?.id === hub.stateId;
                const coords = hubState
                  ? {
                      lat: hubState.coordinates.lat + (hub.id === 'LRD' ? -2.5 : hub.id === 'DFW' ? 1.5 : 0),
                      lng: hubState.coordinates.lng + (hub.id === 'LRD' ? -1.5 : hub.id === 'DFW' ? 0.5 : 0),
                    }
                  : null;

                if (!coords) return null;

                return (
                  <AdvancedMarker
                    key={hub.id}
                    position={coords}
                    onClick={() => {
                      if (hubState) onSelectState(hubState);
                      setActiveInfoWindow({ type: 'hub', hub });
                    }}
                    title={hub.name}
                  >
                    <div className="p-1.5 rounded-full bg-slate-900 border border-amber-400 text-amber-400 shadow-lg hover:scale-110 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                    </div>
                  </AdvancedMarker>
                );
              })}

            {/* InfoWindow Popup */}
            {activeInfoWindow?.type === 'state' && activeInfoWindow.state && (
              <InfoWindow
                position={activeInfoWindow.state.coordinates}
                onCloseClick={() => setActiveInfoWindow(null)}
              >
                <div className="p-2 text-slate-900 max-w-xs">
                  <div className="font-extrabold text-base flex items-center gap-1.5 text-amber-600">
                    <span>{activeInfoWindow.state.name}</span>
                    <span className="font-mono">({activeInfoWindow.state.id})</span>
                  </div>
                  <div className="text-xs text-slate-600 italic">
                    "{activeInfoWindow.state.nickname}"
                  </div>
                  <div className="text-xs mt-1.5 space-y-0.5">
                    <div>Poytaxti: <strong>{activeInfoWindow.state.capital}</strong></div>
                    <div>Vaqt: <strong>{activeInfoWindow.state.timeZoneName.split('/')[0]}</strong></div>
                    <div>Bozor: <strong>{activeInfoWindow.state.marketType}</strong></div>
                    <div>Trak tezligi: <strong>{activeInfoWindow.state.truckSpeedLimit.split('(')[0]}</strong></div>
                  </div>
                  <div className="mt-2 pt-1 border-t text-[11px] text-slate-500">
                    Magistrallar: {activeInfoWindow.state.interstates.slice(0, 3).join(', ')}
                  </div>
                </div>
              </InfoWindow>
            )}

            {activeInfoWindow?.type === 'hub' && activeInfoWindow.hub && (
              <InfoWindow
                position={
                  STATES_BY_ID.get(activeInfoWindow.hub.stateId)?.coordinates || { lat: 39, lng: -98 }
                }
                onCloseClick={() => setActiveInfoWindow(null)}
              >
                <div className="p-2 text-slate-900 max-w-xs">
                  <div className="font-extrabold text-sm text-sky-700">
                    {activeInfoWindow.hub.name}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Turi: <strong>{activeInfoWindow.hub.type}</strong>
                  </div>
                  <div className="text-xs text-slate-600">
                    Shtat: <strong>{activeInfoWindow.hub.stateId}</strong> • Muhimlik darajasi: <strong>{activeInfoWindow.hub.importance}</strong>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Google Maps Legend & Quick Tips */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 border border-white" />
            <span className="text-slate-200">Tanlangan shtat belgisi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-600 border border-sky-300" />
            <span className="text-slate-200">Chegaradosh shtatlar (Tranzit)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-slate-900" />
            <span className="text-slate-200">Logistika markazlari</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Tirbandlik ma'lumotlari Google Maps tomonidan real vaqtda yangilanadi
        </div>
      </div>
    </div>
  );
};
