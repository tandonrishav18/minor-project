import React, { useState } from 'react';
import { EdgeNode, ViewMode } from '../../types';
import { 
  Server, 
  Search, 
  Filter, 
  Plus, 
  RotateCw, 
  Radio, 
  Sliders, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Zap,
  Battery,
  AlertCircle
} from 'lucide-react';

interface EdgeNodesViewProps {
  nodes: EdgeNode[];
  onSelectNodeForMap: (node: EdgeNode) => void;
  onOpenDeployModal: () => void;
  onOpenCalibrateModal: (node: EdgeNode) => void;
  onRebootNode: (nodeId: string) => void;
  unitPreference: 'Celsius' | 'Fahrenheit';
}

export const EdgeNodesView: React.FC<EdgeNodesViewProps> = ({
  nodes,
  onSelectNodeForMap,
  onOpenDeployModal,
  onOpenCalibrateModal,
  onRebootNode,
  unitPreference,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredNodes = nodes.filter((node) => {
    const matchesSearch = 
      node.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || node.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatTemp = (celsius: number) => {
    if (unitPreference === 'Fahrenheit') {
      return `${(celsius * 1.8 + 32).toFixed(1)}°F`;
    }
    return `${celsius.toFixed(1)}°C`;
  };

  const totalCount = 1248;
  const onlineCount = nodes.filter(n => n.status === 'Online').length;
  const warningCount = nodes.filter(n => n.status === 'Warning').length;
  const offlineCount = nodes.filter(n => n.status === 'Offline' || n.status === 'Maint').length;

  return (
    <div id="edge-nodes-view-container" className="p-4 md:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-2xl md:text-4xl text-[#e1fdff] tracking-tight flex items-center gap-3">
            <Server className="w-8 h-8 text-[#00f2ff]" />
            <span>Edge Nodes Directory</span>
          </h2>
          <p className="text-sm md:text-base text-[#b9cacb] mt-1">
            Global spatio-temporal telemetry mesh deployment and hardware health.
          </p>
        </div>

        <button
          onClick={onOpenDeployModal}
          className="flex items-center justify-center gap-2 bg-[#00f2ff] hover:bg-[#74f5ff] text-[#002022] font-label-caps text-xs font-bold px-4 py-2.5 rounded transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Deploy New Node</span>
        </button>
      </header>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
          <span className="font-label-caps text-xs text-[#849495] uppercase">Total Mesh Nodes</span>
          <div className="text-2xl md:text-3xl font-bold text-[#e1fdff] mt-1 font-mono-data">
            {totalCount.toLocaleString()}
          </div>
          <span className="text-xs text-[#00f2ff] font-mono-data mt-1 block">
            Across 14 Spatial Sectors
          </span>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
          <span className="font-label-caps text-xs text-[#849495] uppercase">Online & Operational</span>
          <div className="text-2xl md:text-3xl font-bold text-[#37fa87] mt-1 font-mono-data flex items-center gap-2">
            <span>1,192</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#37fa87]/10 text-[#37fa87] border border-[#37fa87]/30">
              95.5%
            </span>
          </div>
          <span className="text-xs text-[#b9cacb] font-mono-data mt-1 block">
            Sub-second telemetry sync
          </span>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
          <span className="font-label-caps text-xs text-[#849495] uppercase">Warning / Maint / Offline</span>
          <div className="text-2xl md:text-3xl font-bold text-[#ffb4ab] mt-1 font-mono-data flex items-center gap-2">
            <span>56</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/30">
              4.5%
            </span>
          </div>
          <span className="text-xs text-[#b9cacb] font-mono-data mt-1 block">
            Requires field technician / OTA reset
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#141c24] border border-[#3a494b] rounded-lg p-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#849495] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Node ID, tag name, or coordinates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0A0C10] border border-[#30363D] rounded pl-9 pr-4 py-2 text-xs font-mono-data text-[#e1fdff] placeholder-[#849495] focus:outline-none focus:border-[#00f2ff]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#849495]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0A0C10] border border-[#30363D] text-xs font-mono-data text-[#e1fdff] px-3 py-2 rounded focus:outline-none focus:border-[#00f2ff] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Online">Online Only</option>
            <option value="Warning">Warning (Anomalous)</option>
            <option value="Maint">Maintenance Mode</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Nodes Table */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-data text-xs">
            <thead className="bg-[#141c24] text-[#849495] uppercase border-b border-[#30363D]">
              <tr>
                <th className="py-3 px-4 font-normal">Node ID & Name</th>
                <th className="py-3 px-4 font-normal">Status</th>
                <th className="py-3 px-4 font-normal">Location</th>
                <th className="py-3 px-4 font-normal">Telemetry (Temp/RH/AQI)</th>
                <th className="py-3 px-4 font-normal">Power Source</th>
                <th className="py-3 px-4 font-normal">Last Ping</th>
                <th className="py-3 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]/60">
              {filteredNodes.map((node) => (
                <tr key={node.id} className="hover:bg-[#2d363e]/40 transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#e1fdff] text-sm flex items-center gap-2">
                      <span className="text-[#00f2ff]">{node.id}</span>
                    </div>
                    <span className="text-[11px] text-[#849495] block mt-0.5">{node.name}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      node.status === 'Online'
                        ? 'bg-[#37fa87]/10 text-[#37fa87] border border-[#37fa87]/30'
                        : node.status === 'Warning'
                        ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30'
                        : node.status === 'Maint'
                        ? 'bg-[#b8c3ff]/10 text-[#b8c3ff] border border-[#b8c3ff]/30'
                        : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/30'
                    }`}>
                      {node.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-[#dae3ee]">
                    <div className="truncate max-w-[200px]" title={node.locationName}>
                      {node.locationName}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#dae3ee]">
                    <div className="flex items-center gap-2">
                      <span>{formatTemp(node.temperature)}</span>
                      <span className="text-[#849495]">/</span>
                      <span>{node.humidity}%</span>
                      <span className="text-[#849495]">/</span>
                      <span className={node.aqi > 80 ? 'text-[#FFD700] font-bold' : 'text-[#37fa87]'}>
                        AQI {node.aqi}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-[#b9cacb]">
                      {node.powerType === 'Battery' ? (
                        <>
                          <Battery className="w-3.5 h-3.5 text-[#37fa87]" />
                          <span>Battery ({node.batteryLevel}%)</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-[#00f2ff]" />
                          <span>120V AC Grid</span>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#849495]">
                    {node.lastPing}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onSelectNodeForMap(node)}
                        title="View on Telemetry Map"
                        className="p-1.5 text-[#00f2ff] hover:bg-[#00f2ff]/10 rounded transition-colors"
                      >
                        <Radio className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenCalibrateModal(node)}
                        title="Calibrate Sensor Transducers"
                        className="p-1.5 text-[#dae3ee] hover:text-[#00f2ff] hover:bg-[#2d363e] rounded transition-colors"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRebootNode(node.id)}
                        title="Remote OTA Warm Reboot"
                        className="p-1.5 text-[#dae3ee] hover:text-[#ffb4ab] hover:bg-[#2d363e] rounded transition-colors"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-[#141c24] border-t border-[#30363D] flex items-center justify-between font-mono-data text-xs text-[#849495]">
          <span>Showing {filteredNodes.length} of {totalCount} edge nodes</span>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 rounded hover:bg-[#2d363e] disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[#e1fdff] font-bold">Page {currentPage}</span>
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-1 rounded hover:bg-[#2d363e]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
