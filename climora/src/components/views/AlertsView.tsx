import React, { useState } from 'react';
import { AnomalyEvent, EdgeNode, ViewMode } from '../../types';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  ExternalLink, 
  Sliders, 
  Clock, 
  ShieldAlert,
  Radio
} from 'lucide-react';

interface AlertsViewProps {
  anomalies: AnomalyEvent[];
  nodes: EdgeNode[];
  onInspectAnomaly: (anomaly: AnomalyEvent) => void;
  onResolveAnomaly: (anomalyId: string) => void;
  onNavigateToMap: (nodeId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  anomalies,
  nodes,
  onInspectAnomaly,
  onResolveAnomaly,
  onNavigateToMap,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = anomalies.filter((item) => {
    const matchesSearch = 
      item.sensorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.primarySensor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'All' || item.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const criticalCount = anomalies.filter(a => a.severity === 'Critical').length;
  const warningCount = anomalies.filter(a => a.severity === 'Warning').length;

  return (
    <div id="alerts-view-container" className="p-4 md:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-2xl md:text-4xl text-[#e1fdff] tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-[#ffb4ab]" />
            <span>Incident Command Center</span>
          </h2>
          <p className="text-sm md:text-base text-[#b9cacb] mt-1">
            Real-time environmental anomaly triage and threshold breach diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 rounded-lg px-3 py-1.5 font-mono-data text-xs text-[#ffb4ab]">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-bold">{criticalCount} Critical Incidents</span>
          </div>
          <div className="flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg px-3 py-1.5 font-mono-data text-xs text-[#FFD700]">
            <Clock className="w-4 h-4" />
            <span className="font-bold">{warningCount} Warnings</span>
          </div>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#141c24] border border-[#3a494b] rounded-lg p-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#849495] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search anomalies by Node ID, sensor type, or symptom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0A0C10] border border-[#30363D] rounded pl-9 pr-4 py-2 text-xs font-mono-data text-[#e1fdff] placeholder-[#849495] focus:outline-none focus:border-[#00f2ff]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#849495]" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#0A0C10] border border-[#30363D] text-xs font-mono-data text-[#e1fdff] px-3 py-2 rounded focus:outline-none focus:border-[#00f2ff] cursor-pointer"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical Only</option>
            <option value="Warning">Warnings Only</option>
          </select>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {filtered.map((anomaly) => {
          const isCritical = anomaly.severity === 'Critical';
          return (
            <div
              key={anomaly.id}
              className={`bg-[#161B22] border rounded-lg p-5 transition-all shadow-md ${
                isCritical 
                  ? 'border-[#ffb4ab]/40 hover:border-[#ffb4ab]' 
                  : 'border-[#FFD700]/40 hover:border-[#FFD700]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg mt-0.5 ${
                    isCritical ? 'bg-[#ffb4ab]/10 text-[#ffb4ab]' : 'bg-[#FFD700]/10 text-[#FFD700]'
                  }`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono-data font-bold text-sm text-[#00f2ff]">
                        {anomaly.sensorId}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono-data font-bold ${
                        isCritical 
                          ? 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/30' 
                          : 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30'
                      }`}>
                        {anomaly.severity}
                      </span>
                      <span className="text-xs text-[#849495] font-mono-data">
                        • {anomaly.timestamp} (UTC)
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[#e1fdff] mt-1">
                      {anomaly.type}
                    </h3>
                    <p className="text-xs text-[#b9cacb] font-mono-data mt-0.5">
                      Transducer: <span className="text-[#dae3ee]">{anomaly.primarySensor}</span> — Reading: <span className="text-[#00f2ff]">{anomaly.rawReading}</span>
                    </p>
                    <p className="text-xs text-[#849495] mt-2 max-w-2xl leading-relaxed">
                      {anomaly.description}
                    </p>
                  </div>
                </div>

                <div className="flex md:flex-col items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#30363D]">
                  <div className="text-right font-mono-data">
                    <span className="text-[10px] text-[#849495] block">Score</span>
                    <span className={`text-lg font-bold ${isCritical ? 'text-[#ffb4ab]' : 'text-[#FFD700]'}`}>
                      {anomaly.anomalyScore.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigateToMap(anomaly.sensorId)}
                      title="Locate on Live Map"
                      className="p-2 bg-[#182028] hover:bg-[#2d363e] text-[#00f2ff] border border-[#3a494b] rounded transition-colors"
                    >
                      <Radio className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onInspectAnomaly(anomaly)}
                      className="bg-[#0044eb] hover:bg-[#2D5BFF] text-white text-xs font-label-caps font-bold px-3 py-2 rounded transition-colors"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => onResolveAnomaly(anomaly.id)}
                      className="bg-[#37fa87]/20 hover:bg-[#37fa87]/30 text-[#37fa87] border border-[#37fa87]/40 text-xs font-label-caps font-bold px-3 py-2 rounded transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#37fa87] mx-auto" />
            <h3 className="text-lg font-bold text-[#e1fdff]">Zero Active Anomalies Detected</h3>
            <p className="text-xs text-[#849495] font-mono-data max-w-md mx-auto">
              All 1,248 spatio-temporal nodes in the global mesh are reporting nominal covariance bounds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
