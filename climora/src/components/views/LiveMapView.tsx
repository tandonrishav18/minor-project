import React, { useState } from 'react';
import { EdgeNode, ViewMode } from '../../types';
import { HOTLINK_IMAGES } from '../../mockData';
import { 
  Plus, 
  Minus, 
  Crosshair, 
  Sliders, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  RefreshCw,
  Sun,
  Wind,
  Droplet
} from 'lucide-react';

interface LiveMapViewProps {
  nodes: EdgeNode[];
  selectedNode: EdgeNode | null;
  unitPreference: 'Celsius' | 'Fahrenheit';
  onSelectNode: (node: EdgeNode | null) => void;
  onOpenCalibrate: (node: EdgeNode) => void;
  onNavigate: (view: ViewMode) => void;
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({
  nodes,
  selectedNode,
  unitPreference,
  onSelectNode,
  onOpenCalibrate,
  onNavigate,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayer, setActiveLayer] = useState<'all' | 'thermal' | 'aqi'>('all');
  const [selectedCity, setSelectedCity] = useState('Los Angeles');

  // Default to CE-9021 if none selected
  const activeNode = selectedNode || nodes.find(n => n.id === 'CE-9021') || nodes[0];

  const formatTemp = (celsius: number) => {
    if (unitPreference === 'Fahrenheit') {
      return `${(celsius * 1.8 + 32).toFixed(1)}°F`;
    }
    return `${celsius.toFixed(1)}°C`;
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetLocation = () => {
    setZoomLevel(1);
    const primary = nodes.find(n => n.id === 'CE-9021');
    if (primary) onSelectNode(primary);
  };

  return (
    <div id="live-sensor-map-container" className="relative flex-1 h-full w-full overflow-hidden bg-[#060f16]">
      {/* Background Satellite Map Canvas */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-500 ease-out pointer-events-none"
        style={{
          backgroundImage: `url('${HOTLINK_IMAGES.satMap}')`,
          transform: `scale(${zoomLevel})`,
          opacity: 0.7,
        }}
      />

      {/* Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(48,54,61,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(48,54,61,0.25)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />

      {/* Map Header Overlay Bar */}
      <div className="absolute top-4 left-4 md:left-6 z-20 flex flex-wrap items-center gap-3">
        <div className="bg-[#161B22]/90 border border-[#30363D] rounded-lg px-3 py-1.5 backdrop-blur-md shadow-lg flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#00f2ff]" />
          <span className="font-mono-data text-xs text-[#e1fdff] font-bold">Region:</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-transparent text-xs font-mono-data text-[#00f2ff] focus:outline-none cursor-pointer"
          >
            <option value="Los Angeles" className="bg-[#161B22] text-[#e1fdff]">Los Angeles Metro (Grid A)</option>
            <option value="Reykjavik" className="bg-[#161B22] text-[#e1fdff]">Reykjavik Core (Grid B)</option>
            <option value="Svalbard" className="bg-[#161B22] text-[#e1fdff]">Svalbard Arctic (Grid C)</option>
          </select>
        </div>

        {/* Layer Filters */}
        <div className="hidden sm:flex bg-[#161B22]/90 border border-[#30363D] rounded-lg p-1 backdrop-blur-md text-xs font-mono-data">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-2.5 py-1 rounded transition-colors ${activeLayer === 'all' ? 'bg-[#0044eb] text-white font-bold' : 'text-[#849495] hover:text-[#e1fdff]'}`}
          >
            All Sensors
          </button>
          <button
            onClick={() => setActiveLayer('thermal')}
            className={`px-2.5 py-1 rounded transition-colors ${activeLayer === 'thermal' ? 'bg-[#0044eb] text-white font-bold' : 'text-[#849495] hover:text-[#e1fdff]'}`}
          >
            Thermal
          </button>
          <button
            onClick={() => setActiveLayer('aqi')}
            className={`px-2.5 py-1 rounded transition-colors ${activeLayer === 'aqi' ? 'bg-[#0044eb] text-white font-bold' : 'text-[#849495] hover:text-[#e1fdff]'}`}
          >
            AQI Contour
          </button>
        </div>
      </div>

      {/* Map Control Buttons (Top-Right) */}
      <div className="absolute top-4 right-4 md:right-6 flex flex-col gap-2 z-20">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-10 h-10 bg-[#161B22]/95 hover:bg-[#2d363e] text-[#e1fdff] border border-[#30363D] flex items-center justify-center rounded-t shadow-xl transition-colors active:bg-[#0044eb]"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-10 h-10 bg-[#161B22]/95 hover:bg-[#2d363e] text-[#e1fdff] border border-[#30363D] flex items-center justify-center rounded-b shadow-xl -mt-px transition-colors active:bg-[#0044eb]"
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={handleResetLocation}
          title="Recenter Map on Active Node"
          className="w-10 h-10 bg-[#161B22]/95 hover:bg-[#2d363e] text-[#00f2ff] border border-[#30363D] flex items-center justify-center rounded mt-2 shadow-xl transition-colors"
        >
          <Crosshair className="w-5 h-5" />
        </button>
      </div>

      {/* Interactive Node Markers Overlaid on Map */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {nodes.map((node) => {
          const isSelected = activeNode?.id === node.id;
          const isWarning = node.status === 'Warning' || node.anomalyScore > 0.7;
          const isCritical = node.status === 'Offline' || node.anomalyScore > 0.9;
          
          let pulseClass = 'map-marker-pulse-green bg-[#00E475]';
          if (isCritical) pulseClass = 'map-marker-pulse-red bg-[#ffb4ab]';
          else if (isWarning) pulseClass = 'map-marker-pulse-yellow bg-[#FFD700]';

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node)}
              className="absolute pointer-events-auto cursor-pointer group transition-transform duration-200"
              style={{
                top: `${node.mapY || 50}%`,
                left: `${node.mapX || 50}%`,
                transform: `translate(-50%, -50%) scale(${zoomLevel})`,
              }}
            >
              {/* Marker Dot */}
              <div 
                className={`w-4 h-4 rounded-full border-2 border-[#0A0C10] shadow-lg ${pulseClass} ${
                  isSelected ? 'ring-4 ring-[#00f2ff] scale-125' : 'group-hover:scale-110'
                }`}
              />

              {/* Node ID Tag */}
              <div 
                className={`absolute left-5 top-1/2 -translate-y-1/2 px-2 py-1 rounded font-mono-data text-xs whitespace-nowrap shadow-xl border transition-all ${
                  isSelected
                    ? 'bg-[#002022] text-[#00f2ff] border-[#00f2ff] font-bold opacity-100'
                    : 'bg-[#161B22]/90 text-[#dae3ee] border-[#30363D] opacity-90 group-hover:opacity-100 group-hover:border-[#00f2ff]'
                }`}
              >
                {node.id}
                {isCritical && <span className="ml-1 text-[#ffb4ab] font-bold">(CRIT)</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Left Inspection Card */}
      <div className="absolute bottom-4 left-4 md:left-6 w-64 sm:w-72 z-20 pointer-events-none">
        {activeNode && (
          <div className="pointer-events-auto bg-[#161B22]/95 border border-[#30363D] rounded-lg p-3 shadow-2xl backdrop-blur-md space-y-2.5 animate-in fade-in slide-in-from-bottom-3">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[#30363D] pb-2">
              <div>
                <span className="font-label-caps text-[9px] text-[#849495] uppercase tracking-wider block">
                  NODE ID
                </span>
                <h3 className="font-bold text-base text-[#e1fdff] tracking-tight">
                  {activeNode.id}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded font-label-caps text-[10px] font-bold ${
                  activeNode.status === 'Warning' || activeNode.anomalyScore > 0.75
                    ? 'bg-[#FFD700] text-black'
                    : activeNode.status === 'Offline'
                    ? 'bg-[#ffb4ab] text-black'
                    : 'bg-[#37fa87] text-black'
                }`}>
                  {activeNode.status}
                </span>
              </div>
            </div>

            {/* Metrics 2-column (Compact) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#141c24] p-2 rounded border border-[#30363D]">
                <span className="font-label-caps text-[10px] text-[#849495] block mb-0.5">
                  Temp
                </span>
                <span className="font-mono-data text-sm font-bold text-[#e1fdff]">
                  {formatTemp(activeNode.temperature)}
                </span>
              </div>
              <div className="bg-[#141c24] p-2 rounded border border-[#30363D]">
                <span className="font-label-caps text-[10px] text-[#849495] block mb-0.5">
                  Humidity
                </span>
                <span className="font-mono-data text-sm font-bold text-[#e1fdff]">
                  {activeNode.humidity}%
                </span>
              </div>
            </div>

            {/* AQI Level Card with Progress Bar */}
            <div className="bg-[#141c24] p-2 rounded border border-[#FFD700]/40">
              <div className="flex justify-between items-center mb-1">
                <span className="font-label-caps text-[10px] text-[#b9cacb]">AQI Level</span>
                <span className="font-mono-data text-xs text-[#FFD700] font-bold">
                  {activeNode.aqi}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1 bg-[#2d363e] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FFD700] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(activeNode.aqi, 100)}%` }}
                />
              </div>
            </div>

            {/* Coordinates & Anomaly Score */}
            <div className="space-y-1 font-mono-data text-[11px]">
              <div className="flex justify-between items-center border-b border-[#30363D]/60 pb-1">
                <span className="text-[#849495]">Location</span>
                <span className="text-[#00f2ff] text-[10px]">
                  {activeNode.lat.toFixed(4)}, {activeNode.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#30363D]/60 pb-1">
                <span className="text-[#849495]">Anomaly</span>
                <span className={`font-bold ${activeNode.anomalyScore > 0.7 ? 'text-[#FFD700]' : 'text-[#37fa87]'}`}>
                  {activeNode.anomalyScore.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-[#849495] pt-0.5">
                <span>Power / Model</span>
                <span className="text-[#dae3ee]">
                  {activeNode.powerType}
                </span>
              </div>
            </div>

            {/* Calibrate Node CTA Button */}
            <button
              id="btn-calibrate-node"
              onClick={() => onOpenCalibrate(activeNode)}
              className="w-full border border-[#00f2ff] text-[#00f2ff] hover:bg-[#00f2ff] hover:text-[#002022] font-label-caps text-[11px] uppercase font-bold py-1.5 rounded transition-colors flex justify-center items-center gap-1.5 active:scale-[0.98] cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Calibrate Node</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Weather / Conditions HUD Bar (Small & Compact on Bottom-Right) */}
      <div className="absolute bottom-4 right-4 md:right-6 z-20 bg-[#0A0C10]/90 border border-[#30363D] rounded-lg px-3.5 py-1.5 backdrop-blur-md shadow-2xl flex items-center gap-3 font-mono-data text-[11px] text-[#dae3ee]">
        <div className="flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
          <span>LOS ANGELES | 12:04 AM PDT</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[#849495] text-[10.5px]">
          <span className="text-[#e1fdff] font-bold">58°F</span>
          <span>Wind: 7 mph</span>
          <span>Precip: 0%</span>
        </div>
      </div>
    </div>
  );
};
