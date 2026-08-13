import React, { useState } from 'react';
import { EdgeNode, AnomalyEvent, TelemetryPoint, ViewMode } from '../../types';
import { HOTLINK_IMAGES } from '../../mockData';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Radio, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface OverviewViewProps {
  nodes: EdgeNode[];
  anomalies: AnomalyEvent[];
  telemetryData: TelemetryPoint[];
  unitPreference: 'Celsius' | 'Fahrenheit';
  onNavigate: (view: ViewMode) => void;
  onInspectAnomaly: (anomaly: AnomalyEvent) => void;
  onSelectNode: (node: EdgeNode) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  nodes,
  anomalies,
  telemetryData,
  unitPreference,
  onNavigate,
  onInspectAnomaly,
  onSelectNode,
}) => {
  const [activeHoverPoint, setActiveHoverPoint] = useState<TelemetryPoint | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  // Convert temp based on unit preference
  const formatTemp = (celsius: number) => {
    if (unitPreference === 'Fahrenheit') {
      return `${(celsius * 1.8 + 32).toFixed(1)}°F`;
    }
    return `${celsius.toFixed(1)}°C`;
  };

  const activeNodesCount = nodes.filter(n => n.status !== 'Offline').length;
  const criticalAnomaliesCount = anomalies.filter(a => a.severity === 'Critical').length;
  const latestPoint = telemetryData[telemetryData.length - 1];

  return (
    <div id="overview-view-container" className="p-4 md:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-2xl md:text-4xl text-[#e1fdff] tracking-tight">
            System Overview
          </h2>
          <p className="text-sm md:text-base text-[#b9cacb] mt-1 font-normal">
            Real-time environmental telemetry and anomaly detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#141c24] border border-[#3a494b] rounded p-1 text-xs font-mono-data">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded transition-colors ${
                  timeRange === range
                    ? 'bg-[#0044eb] text-white font-bold'
                    : 'text-[#849495] hover:text-[#e1fdff]'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="flex items-center gap-1.5 bg-[#182028] hover:bg-[#222b33] text-[#00f2ff] border border-[#3a494b] px-3.5 py-1.5 rounded text-xs font-label-caps font-semibold transition-colors"
          >
            <span>Live Mesh Map</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {/* 1. Temperature */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 flex flex-col justify-between h-32 hover:border-[#00f2ff]/50 transition-colors">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-xs text-[#b9cacb] uppercase">Temperature</span>
            <Thermometer className="w-5 h-5 text-[#00dbe7]" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-[#e1fdff] font-sans">
              {formatTemp(latestPoint?.temperature || 24.5)}
            </div>
            <div className="font-mono-data text-[11px] text-[#37fa87] mt-1 font-semibold">
              +0.2°C/hr
            </div>
          </div>
        </div>

        {/* 2. Humidity */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 flex flex-col justify-between h-32 hover:border-[#b8c3ff]/50 transition-colors">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-xs text-[#b9cacb] uppercase">Humidity</span>
            <Droplets className="w-5 h-5 text-[#b8c3ff]" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-[#e1fdff] font-sans">
              {latestPoint?.humidity || 45}%
            </div>
            <div className="font-mono-data text-[11px] text-[#b9cacb] mt-1">
              Stable
            </div>
          </div>
        </div>

        {/* 3. AQI */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 flex flex-col justify-between h-32 hover:border-[#37fa87]/50 transition-colors">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-xs text-[#b9cacb] uppercase">AQI</span>
            <Wind className="w-5 h-5 text-[#37fa87]" />
          </div>
          <div>
            <div className="flex items-end gap-2">
              <span className="text-2xl md:text-3xl font-bold text-[#37fa87] font-sans">
                {latestPoint?.aqi || 32}
              </span>
              <span className="font-mono-data text-xs text-[#37fa87] pb-1 font-semibold">
                Good
              </span>
            </div>
            <div className="font-mono-data text-[10px] text-[#849495] mt-1">
              PM2.5: 8.4 µg/m³
            </div>
          </div>
        </div>

        {/* 4. Active Sensors */}
        <div 
          onClick={() => onNavigate('nodes')}
          className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 flex flex-col justify-between h-32 hover:border-[#00f2ff] cursor-pointer transition-colors"
        >
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-xs text-[#b9cacb] uppercase">Active Sensors</span>
            <Radio className="w-5 h-5 text-[#00dbe7]" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-[#e1fdff] font-sans">
              {activeNodesCount.toLocaleString()}
            </div>
            <div className="font-mono-data text-[11px] text-[#37fa87] mt-1 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#37fa87] animate-pulse" />
              <span>99.8% Uptime</span>
            </div>
          </div>
        </div>

        {/* 5. Anomalies */}
        <div 
          onClick={() => onNavigate('alerts')}
          className="bg-[#161B22] border border-[#30363D] border-l-4 border-l-[#ffb4ab] rounded-lg p-4 flex flex-col justify-between h-32 hover:border-[#ffb4ab] cursor-pointer transition-colors"
        >
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-xs text-[#ffb4ab] uppercase font-bold">Anomalies</span>
            <AlertTriangle className="w-5 h-5 text-[#ffb4ab]" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-[#ffb4ab] font-sans">
              {anomalies.length}
            </div>
            <div className="font-mono-data text-[11px] text-[#b9cacb] mt-1">
              {criticalAnomaliesCount} Critical in 24h
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace: Chart & Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-lg p-5 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-label-caps text-xs text-[#e1fdff] uppercase font-bold tracking-wider">
                Environmental Trends ({timeRange.toUpperCase()})
              </h3>
              <p className="text-[11px] text-[#849495] font-mono-data mt-0.5">
                Composite spatio-temporal telemetry mesh averaging 1,248 nodes
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00F2FF]" />
                <span className="font-mono-data text-xs text-[#b9cacb]">Temp</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#37fa87]" />
                <span className="font-mono-data text-xs text-[#b9cacb]">Humidity</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="relative w-full h-[280px] mt-2 bg-[#0A0C10]/40 rounded border border-[#30363D]/40 p-2">
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox="0 0 600 200" 
              preserveAspectRatio="none"
            >
              {/* Horizontal Grid lines */}
              <line x1="0" x2="600" y1="40" y2="40" stroke="#2d363e" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" x2="600" y1="90" y2="90" stroke="#2d363e" strokeWidth="1" />
              <line x1="0" x2="600" y1="140" y2="140" stroke="#2d363e" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" x2="600" y1="190" y2="190" stroke="#2d363e" strokeWidth="1" />

              {/* Temp Area Gradient */}
              <defs>
                <linearGradient id="tempGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00F2FF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#00F2FF" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="humidityGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#37fa87" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#37fa87" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Humidity Path (Green) */}
              <path
                d="M0,100 C50,110 100,90 150,120 C200,150 250,130 300,160 C350,190 400,150 450,130 C500,110 550,140 600,120"
                fill="none"
                stroke="#37fa87"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Temp Path (Cyan) */}
              <path
                d="M0,150 C50,130 100,140 150,100 C200,60 250,80 300,50 C350,20 400,60 450,80 C500,100 550,70 600,90"
                fill="none"
                stroke="#00F2FF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points along curve for interactive hover */}
              {telemetryData.map((pt, idx) => {
                const x = (idx / (telemetryData.length - 1)) * 600;
                // Approximate y coordinates matching curve
                const tempY = 150 - (pt.temperature - 18) * 9;
                const humY = 80 + (pt.humidity - 30) * 1.5;
                
                return (
                  <g key={idx} className="cursor-pointer">
                    <circle
                      cx={x}
                      cy={tempY}
                      r="4"
                      className="fill-[#00F2FF] hover:r-6 transition-all"
                      onMouseEnter={() => setActiveHoverPoint(pt)}
                    />
                    <circle
                      cx={x}
                      cy={humY}
                      r="3.5"
                      className="fill-[#37fa87] hover:r-6 transition-all"
                      onMouseEnter={() => setActiveHoverPoint(pt)}
                    />
                  </g>
                );
              })}

              {/* Labels */}
              <text x="5" y="35" fill="#b9cacb" fontFamily="Geist, monospace" fontSize="10">30°C / 60%</text>
              <text x="5" y="85" fill="#b9cacb" fontFamily="Geist, monospace" fontSize="10">25°C / 50%</text>
              <text x="5" y="135" fill="#b9cacb" fontFamily="Geist, monospace" fontSize="10">20°C / 40%</text>
            </svg>

            {/* Hover Tooltip Overlay */}
            {activeHoverPoint && (
              <div className="absolute top-4 right-4 bg-[#141c24] border border-[#00f2ff] p-2.5 rounded shadow-xl text-xs font-mono-data z-10 animate-in fade-in">
                <div className="text-[#00f2ff] font-bold">Epoch: {activeHoverPoint.time}</div>
                <div className="text-[#e1fdff] mt-0.5">Temp: {formatTemp(activeHoverPoint.temperature)}</div>
                <div className="text-[#37fa87]">Humidity: {activeHoverPoint.humidity}%</div>
                <div className="text-[#b9cacb]">AQI: {activeHoverPoint.aqi} (Good)</div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#30363D]/60 text-xs font-mono-data text-[#849495]">
            <span>00:00 UTC</span>
            <span>06:00 UTC</span>
            <span>12:00 UTC</span>
            <span>18:00 UTC</span>
            <span className="text-[#00f2ff]">24:00 UTC (Live)</span>
          </div>
        </div>

        {/* Right Column: Status & Mini Map */}
        <div className="space-y-6 flex flex-col">
          {/* Status Panel */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-5">
            <h3 className="font-label-caps text-xs text-[#e1fdff] uppercase font-bold tracking-wider mb-3">
              System Status
            </h3>
            <ul className="space-y-3 font-mono-data text-xs">
              <li className="flex justify-between items-center py-1.5 border-b border-[#30363D]/60">
                <span className="text-[#b9cacb]">API Endpoint</span>
                <span className="bg-[#37fa87]/10 text-[#37fa87] text-[10px] px-2 py-0.5 rounded border border-[#37fa87]/30 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#37fa87]" />
                  Online
                </span>
              </li>
              <li className="flex justify-between items-center py-1.5 border-b border-[#30363D]/60">
                <span className="text-[#b9cacb]">ML Model</span>
                <div className="text-right">
                  <span className="block text-[#00dbe7] text-[10px] font-bold">Active</span>
                  <span className="block text-[11px] text-[#b9cacb]">Isolation Forest</span>
                </div>
              </li>
              <li className="flex justify-between items-center py-1.5">
                <span className="text-[#b9cacb]">Database</span>
                <span className="text-[#b9cacb] flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#37fa87]" />
                  SQLite (Embedded Edge)
                </span>
              </li>
            </ul>
          </div>

          {/* Mini Map Card */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-2 flex-1 min-h-[220px] relative overflow-hidden flex flex-col group">
            <div className="flex justify-between items-center p-2 z-10 relative bg-[#182028]/90 backdrop-blur-sm rounded-t border-b border-[#30363D]/60">
              <h3 className="font-label-caps text-xs text-[#e1fdff] uppercase font-bold tracking-wider">
                Sensor Deployment
              </h3>
              <button
                onClick={() => onNavigate('map')}
                className="text-[#00f2ff] hover:text-[#74f5ff] text-xs font-mono-data flex items-center gap-1 cursor-pointer"
              >
                <span>Expand</span>
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>

            <div 
              onClick={() => onNavigate('map')}
              className="relative w-full flex-1 bg-[#060f16] bg-cover bg-center cursor-pointer min-h-[160px] rounded-b overflow-hidden"
              style={{ backgroundImage: `url('${HOTLINK_IMAGES.miniMap}')` }}
            >
              {/* Overlay Grid */}
              <div className="absolute inset-0 bg-[#060f16]/60" />

              {/* Pulsing Node Markers */}
              <div 
                className="absolute top-[30%] left-[40%] w-2.5 h-2.5 bg-[#00F2FF] rounded-full map-marker-pulse-green" 
                title="CE-9021 (Normal)" 
              />
              <div 
                className="absolute top-[45%] left-[60%] w-2.5 h-2.5 bg-[#00F2FF] rounded-full map-marker-pulse-green" 
                title="CE-9044 (Normal)" 
              />
              <div 
                className="absolute top-[20%] left-[70%] w-3 h-3 bg-[#ffb4ab] rounded-full map-marker-pulse-red" 
                title="NODE-782 (Critical Anomaly)" 
              />
              <div 
                className="absolute top-[60%] left-[30%] w-2.5 h-2.5 bg-[#00F2FF] rounded-full map-marker-pulse-green" 
              />
              <div 
                className="absolute top-[75%] left-[55%] w-2.5 h-2.5 bg-[#00F2FF] rounded-full map-marker-pulse-green" 
              />

              <div className="absolute bottom-2 left-2 bg-[#0A0C10]/80 border border-[#30363D] px-2 py-0.5 rounded text-[10px] font-mono-data text-[#00f2ff]">
                Mesh: 8 Clusters Synced
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Anomalies Table */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-5 overflow-hidden">
        <div className="flex justify-between items-center border-b border-[#30363D] pb-3 mb-3">
          <h3 className="font-label-caps text-xs text-[#ffb4ab] uppercase font-bold tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Recent Anomalies ({anomalies.length})</span>
          </h3>
          <button
            onClick={() => onNavigate('alerts')}
            className="text-xs font-mono-data text-[#00f2ff] hover:underline flex items-center gap-1"
          >
            <span>View All in Incident Center</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-data text-xs">
            <thead className="text-[#849495] uppercase bg-[#141c24]">
              <tr>
                <th className="py-2.5 px-3 font-normal rounded-tl">Timestamp (UTC)</th>
                <th className="py-2.5 px-3 font-normal">Sensor ID</th>
                <th className="py-2.5 px-3 font-normal">Type</th>
                <th className="py-2.5 px-3 font-normal">Severity</th>
                <th className="py-2.5 px-3 font-normal text-right rounded-tr">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]/60">
              {anomalies.slice(0, 4).map((item) => (
                <tr key={item.id} className="hover:bg-[#2d363e]/40 transition-colors group">
                  <td className="py-3 px-3 text-[#dae3ee]">{item.timestamp}</td>
                  <td className="py-3 px-3 text-[#00dbe7] font-semibold">
                    <button
                      onClick={() => {
                        const matched = nodes.find(n => n.id === item.sensorId);
                        if (matched) onSelectNode(matched);
                        else onNavigate('map');
                      }}
                      className="hover:underline cursor-pointer"
                    >
                      {item.sensorId}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-[#b9cacb]">{item.type}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.severity === 'Critical'
                        ? 'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/30'
                        : 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30'
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onInspectAnomaly(item)}
                      className="text-[#00f2ff] hover:text-[#74f5ff] font-label-caps text-xs font-bold px-2 py-1 rounded bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20 transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
