import React, { useState } from 'react';
import { EdgeNode } from '../../types';
import { X, Plus, Server, Radio, Zap } from 'lucide-react';

interface DeployNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (node: EdgeNode) => void;
}

export const DeployNodeModal: React.FC<DeployNodeModalProps> = ({
  isOpen,
  onClose,
  onDeploy,
}) => {
  const [nodeId, setNodeId] = useState(`CE-${Math.floor(1000 + Math.random() * 9000)}`);
  const [name, setName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [lat, setLat] = useState('34.0522');
  const [lng, setLng] = useState('-118.2437');
  const [powerType, setPowerType] = useState<'Battery' | 'AC'>('Battery');
  const [hardwareModel, setHardwareModel] = useState('EdgeNode-X300');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNode: EdgeNode = {
      id: nodeId.toUpperCase(),
      name: name || `Sensor Array ${nodeId}`,
      status: 'Online',
      locationName: locationName || `Urban Array (${lat}, ${lng})`,
      lat: parseFloat(lat) || 34.0522,
      lng: parseFloat(lng) || -118.2437,
      temperature: 22 + +(Math.random() * 5).toFixed(1),
      humidity: 40 + Math.floor(Math.random() * 20),
      aqi: 20 + Math.floor(Math.random() * 30),
      anomalyScore: +(Math.random() * 0.25).toFixed(2),
      powerType,
      batteryLevel: powerType === 'Battery' ? 100 : undefined,
      lastPing: 'Just now',
      firmwareVersion: 'v4.2.0-latest',
      hardwareModel,
      mapX: 30 + Math.floor(Math.random() * 40),
      mapY: 30 + Math.floor(Math.random() * 40),
    };

    onDeploy(newNode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#30363D] bg-[#141c24]">
          <div className="flex items-center gap-2 text-[#00f2ff]">
            <Server className="w-5 h-5" />
            <h3 className="font-bold text-[#e1fdff] text-base">Provision New Edge Node</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#849495] hover:text-[#e1fdff] p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-body-md text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono-data text-xs text-[#b9cacb] mb-1">
                Node ID Identifier
              </label>
              <input
                type="text"
                value={nodeId}
                onChange={(e) => setNodeId(e.target.value)}
                required
                className="w-full bg-[#0A0C10] border border-[#30363D] rounded px-3 py-2 text-[#e1fdff] font-mono-data focus:border-[#00f2ff] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono-data text-xs text-[#b9cacb] mb-1">
                Hardware Model
              </label>
              <select
                value={hardwareModel}
                onChange={(e) => setHardwareModel(e.target.value)}
                className="w-full bg-[#0A0C10] border border-[#30363D] rounded px-3 py-2 text-[#e1fdff] font-mono-data focus:border-[#00f2ff] focus:outline-none"
              >
                <option value="EdgeNode-X300">EdgeNode-X300 (Standard)</option>
                <option value="EdgeNode-ColdSpec">EdgeNode-ColdSpec (Arctic)</option>
                <option value="EdgeNode-Indus4">EdgeNode-Indus4 (Hazardous)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono-data text-xs text-[#b9cacb] mb-1">
              Display Name / Tag
            </label>
            <input
              type="text"
              placeholder="e.g. Burbank North Transit Array"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0A0C10] border border-[#30363D] rounded px-3 py-2 text-[#e1fdff] focus:border-[#00f2ff] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono-data text-xs text-[#b9cacb] mb-1">
              Geographic Region / Location Name
            </label>
            <input
              type="text"
              placeholder="e.g. Los Angeles Downtown (34.0522, -118.2437)"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full bg-[#0A0C10] border border-[#30363D] rounded px-3 py-2 text-[#e1fdff] focus:border-[#00f2ff] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono-data text-xs text-[#b9cacb] mb-1">
                Latitude (Deg N)
              </label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-[#0A0C10] border border-[#30363D] rounded px-3 py-2 text-[#e1fdff] font-mono-data focus:border-[#00f2ff] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono-data text-xs text-[#b9cacb] mb-1">
                Longitude (Deg W)
              </label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full bg-[#0A0C10] border border-[#30363D] rounded px-3 py-2 text-[#e1fdff] font-mono-data focus:border-[#00f2ff] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono-data text-xs text-[#b9cacb] mb-1">
              Power Source
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPowerType('Battery')}
                className={`py-2 px-3 rounded flex items-center justify-center gap-2 border font-mono-data text-xs transition-colors ${
                  powerType === 'Battery'
                    ? 'bg-[#0044eb]/30 border-[#00f2ff] text-[#00f2ff]'
                    : 'bg-[#0A0C10] border-[#30363D] text-[#849495]'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>LiFePO4 Solar Battery</span>
              </button>
              <button
                type="button"
                onClick={() => setPowerType('AC')}
                className={`py-2 px-3 rounded flex items-center justify-center gap-2 border font-mono-data text-xs transition-colors ${
                  powerType === 'AC'
                    ? 'bg-[#0044eb]/30 border-[#00f2ff] text-[#00f2ff]'
                    : 'bg-[#0A0C10] border-[#30363D] text-[#849495]'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>Continuous 120V AC</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#30363D] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-label-caps text-[#b9cacb] hover:text-[#e1fdff] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#00f2ff] text-[#002022] font-label-caps text-xs font-bold px-5 py-2 rounded flex items-center gap-1.5 hover:bg-[#74f5ff] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy Node to Mesh</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
