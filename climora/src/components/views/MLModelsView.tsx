import React, { useState } from 'react';
import { AnomalyEvent, PcaPoint } from '../../types';
import { PCA_POINTS, HISTOGRAM_DATA } from '../../mockData';
import { 
  Cpu, 
  RefreshCw, 
  Sliders, 
  Info, 
  AlertTriangle, 
  ScatterChart, 
  Table, 
  Download, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface MLModelsViewProps {
  anomalies: AnomalyEvent[];
  onInvestigateAnomaly: (anomaly: AnomalyEvent) => void;
  onExportCsv: () => void;
  sensitivity: number;
}

export const MLModelsView: React.FC<MLModelsViewProps> = ({
  anomalies,
  onInvestigateAnomaly,
  onExportCsv,
  sensitivity,
}) => {
  const [selectedPcaPoint, setSelectedPcaPoint] = useState<PcaPoint | null>(null);
  const [isRetraining, setIsRetraining] = useState(false);
  const [lastTrainedTime, setLastTrainedTime] = useState('2024-10-24 08:00Z');

  const handleRetrain = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
      const now = new Date();
      setLastTrainedTime(`${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 16)}Z`);
    }, 1200);
  };

  return (
    <div id="ml-models-container" className="p-4 md:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#3a494b] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-label-caps text-[#849495] uppercase mb-1">
            <span>ML Models</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#00f2ff]">Isolation Forest & PCA Projection</span>
          </div>
          <h2 className="font-extrabold text-2xl md:text-4xl text-[#e1fdff] tracking-tight">
            Anomaly Analysis
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#182028] border border-[#3a494b] rounded-full px-3 py-1.5 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00E475]" />
            <span className="font-mono-data text-xs text-[#e1fdff] font-medium">Model Live (v3.2)</span>
          </div>

          <button
            onClick={handleRetrain}
            disabled={isRetraining}
            title="Retrain Isolation Forest Model"
            className="p-2 bg-[#141c24] border border-[#3a494b] rounded hover:bg-[#2d363e] text-[#dae3ee] transition-colors flex items-center justify-center cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin text-[#00f2ff]' : ''}`} />
          </button>
        </div>
      </header>

      {/* Bento Grid Top Row (3 cards: Parameters, Global Risk, Score Distribution) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 1. Model Overview Card */}
        <section className="col-span-1 md:col-span-4 bg-[#141c24] border border-[#3a494b] rounded-lg p-5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f2ff]/5 rounded-bl-full -z-0 group-hover:bg-[#00f2ff]/10 transition-colors" />
          
          <div>
            <header className="flex justify-between items-center mb-4 border-b border-[#3a494b] pb-2 z-10 relative">
              <h3 className="font-label-caps text-xs uppercase text-[#e1fdff] tracking-widest font-bold flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#00f2ff]" />
                <span>Model Parameters</span>
              </h3>
              <Info className="w-4 h-4 text-[#849495]" />
            </header>

            <div className="grid grid-cols-2 gap-3 z-10 relative">
              <div className="bg-[#182028] p-2.5 rounded border border-[#3a494b]/60">
                <p className="font-label-caps text-[11px] text-[#849495] mb-0.5">Algorithm</p>
                <p className="font-mono-data text-xs text-[#e1fdff] font-semibold truncate">
                  Isolation Forest
                </p>
              </div>
              <div className="bg-[#182028] p-2.5 rounded border border-[#3a494b]/60">
                <p className="font-label-caps text-[11px] text-[#849495] mb-0.5">Contamination</p>
                <p className="font-mono-data text-xs text-[#00f2ff] font-bold">
                  {sensitivity.toFixed(2)}
                </p>
              </div>
              <div className="bg-[#182028] p-2.5 rounded border border-[#3a494b]/60">
                <p className="font-label-caps text-[11px] text-[#849495] mb-0.5">N_Estimators</p>
                <p className="font-mono-data text-xs text-[#e1fdff] font-semibold">150 Trees</p>
              </div>
              <div className="bg-[#182028] p-2.5 rounded border border-[#3a494b]/60">
                <p className="font-label-caps text-[11px] text-[#849495] mb-0.5">Features (n)</p>
                <p className="font-mono-data text-xs text-[#e1fdff]">
                  12 <span className="text-[#849495] text-[10px]">dims</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#3a494b] flex justify-between items-center text-xs font-mono-data">
            <span className="text-[#849495]">Last Trained: {lastTrainedTime}</span>
            <span className="text-[#00E475] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Healthy
            </span>
          </div>
        </section>

        {/* 2. Global Risk Score Gauge */}
        <section className="col-span-1 md:col-span-4 bg-[#141c24] border border-[#3a494b] rounded-lg p-5 flex flex-col justify-between items-center text-center">
          <header className="w-full flex justify-between items-center mb-2">
            <h3 className="font-label-caps text-xs uppercase text-[#e1fdff] tracking-widest font-bold">
              Global Risk Score
            </h3>
            <span className="flex items-center gap-1 text-[#ffb4ab] text-[10px] font-mono-data px-2 py-0.5 bg-[#ffb4ab]/10 rounded border border-[#ffb4ab]/30 font-bold">
              <AlertTriangle className="w-3 h-3" />
              ELEVATED
            </span>
          </header>

          {/* SVG Gauge */}
          <div className="relative w-44 h-44 flex items-center justify-center my-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#2d363e"
                strokeWidth="8"
                strokeDasharray="188 62"
                strokeLinecap="round"
              />
              {/* Value track (Pink / Red elevated) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ffb4ab"
                strokeWidth="8"
                strokeDasharray="160 100"
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-extrabold text-4xl text-[#ffb4ab] leading-none tracking-tight">
                .82
              </span>
              <span className="font-mono-data text-[11px] text-[#b9cacb] mt-1">
                Threshold: &gt;.75
              </span>
            </div>
          </div>

          <div className="w-full flex justify-between font-mono-data text-[11px] text-[#849495] mt-1 px-4">
            <span>0.0 (Nominal)</span>
            <span>1.0 (Critical)</span>
          </div>
        </section>

        {/* 3. Score Distribution Histogram */}
        <section className="col-span-1 md:col-span-4 bg-[#141c24] border border-[#3a494b] rounded-lg p-5 flex flex-col justify-between">
          <header className="flex justify-between items-center mb-3 border-b border-[#3a494b] pb-2">
            <h3 className="font-label-caps text-xs uppercase text-[#e1fdff] tracking-widest font-bold">
              Score Distribution
            </h3>
            <span className="font-mono-data text-xs text-[#849495]">Last 24h</span>
          </header>

          <div className="flex-1 flex items-end gap-1.5 w-full h-32 mt-2">
            {HISTOGRAM_DATA.map((bin, idx) => (
              <div 
                key={idx} 
                className="flex-1 flex flex-col justify-end h-full group relative cursor-pointer"
                title={`${bin.label}: ${bin.count} samples`}
              >
                <div
                  className={`w-full rounded-t transition-all ${
                    bin.isAnomaly
                      ? 'bg-[#ffb4ab] hover:bg-[#ffdad6]'
                      : 'bg-[#00f2ff]/60 hover:bg-[#00f2ff]'
                  }`}
                  style={{ height: bin.height }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between w-full border-t border-[#3a494b] mt-3 pt-2 font-mono-data text-[11px] text-[#849495]">
            <span>-0.5</span>
            <span>0.0</span>
            <span className="text-[#ffb4ab] font-bold">0.75</span>
            <span>1.0</span>
          </div>
        </section>
      </div>

      {/* 4. Feature Space Projection (PCA) Scatter Plot */}
      <section className="bg-[#182028] border border-[#3a494b] rounded-lg p-5 flex flex-col min-h-[380px]">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-label-caps text-xs uppercase text-[#e1fdff] tracking-widest font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00f2ff]" />
              <span>Feature Space Projection (PCA)</span>
            </h3>
            <p className="text-xs text-[#b9cacb] font-mono-data mt-0.5">
              2D manifold projection of 12-dimensional multivariate telemetry streams.
            </p>
          </div>

          <div className="flex items-center gap-4 border border-[#3a494b] rounded px-3 py-1 bg-[#141c24] font-mono-data text-xs">
            <div className="flex items-center gap-2 text-[#e1fdff]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F2FF]" />
              <span>Nominal Cluster</span>
            </div>
            <div className="flex items-center gap-2 text-[#ffb4ab]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]" />
              <span>Anomalous Outlier</span>
            </div>
          </div>
        </header>

        {/* 2D Cyber Grid Canvas */}
        <div className="flex-1 relative border border-[#3a494b] rounded bg-[#060f16] cyber-grid overflow-hidden min-h-[260px]">
          {/* Central Crosshairs */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#3a494b]/60" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#3a494b]/60" />

          {/* Scatter Points */}
          {PCA_POINTS.map((pt) => {
            const isAnomaly = pt.isAnomaly;
            return (
              <div
                key={pt.id}
                onClick={() => setSelectedPcaPoint(pt)}
                className={`absolute w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
                  isAnomaly
                    ? 'bg-[#ffb4ab] z-20 hover:scale-150'
                    : 'bg-[#00f2ff] z-10 hover:scale-150'
                } ${selectedPcaPoint?.id === pt.id ? 'ring-2 ring-white scale-150' : ''}`}
                style={{
                  left: `${pt.x}%`,
                  top: `${pt.y}%`,
                }}
              />
            );
          })}

          {/* Point Inspection Card */}
          {selectedPcaPoint && (
            <div className="absolute bottom-4 right-4 bg-[#141c24] border border-[#00f2ff] p-3 rounded shadow-2xl text-xs font-mono-data z-30 animate-in fade-in">
              <div className="flex justify-between items-center gap-4 text-[#00f2ff] font-bold">
                <span>Vector: {selectedPcaPoint.nodeId}</span>
                <button 
                  onClick={() => setSelectedPcaPoint(null)}
                  className="text-[#849495] hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-[#dae3ee] mt-1">{selectedPcaPoint.label}</p>
              <div className="mt-1 flex gap-3 text-[11px]">
                <span className="text-[#849495]">Anomaly Score:</span>
                <span className={selectedPcaPoint.isAnomaly ? 'text-[#ffb4ab] font-bold' : 'text-[#37fa87]'}>
                  {selectedPcaPoint.score.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Detected Anomalous Events Table */}
      <section className="bg-[#141c24] border border-[#3a494b] rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#3a494b] flex justify-between items-center bg-[#182028]">
          <h3 className="font-label-caps text-xs uppercase text-[#e1fdff] tracking-widest font-bold flex items-center gap-2">
            <Table className="w-4 h-4 text-[#00f2ff]" />
            <span>Detected Anomalous Events</span>
          </h3>
          <button
            onClick={onExportCsv}
            className="text-xs font-mono-data text-[#00f2ff] hover:text-[#74f5ff] border border-[#00f2ff]/40 hover:bg-[#00f2ff]/10 px-3 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-data text-xs">
            <thead>
              <tr className="border-b border-[#3a494b] bg-[#060f16] font-label-caps text-[11px] text-[#849495] uppercase">
                <th className="p-3.5 font-normal">Timestamp (UTC)</th>
                <th className="p-3.5 font-normal">Node ID</th>
                <th className="p-3.5 font-normal">Primary Sensor</th>
                <th className="p-3.5 font-normal">Raw Reading</th>
                <th className="p-3.5 font-normal text-right">Anomaly Score</th>
                <th className="p-3.5 font-normal text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a494b]/60">
              {anomalies.map((item) => (
                <tr key={item.id} className="hover:bg-[#2d363e]/40 transition-colors group">
                  <td className="p-3.5 text-[#dae3ee]">{item.timestamp}</td>
                  <td className="p-3.5 text-[#b8c3ff] font-semibold">{item.sensorId}</td>
                  <td className="p-3.5 text-[#b9cacb]">{item.primarySensor}</td>
                  <td className="p-3.5 text-[#dae3ee]">
                    {item.rawReading}
                  </td>
                  <td className="p-3.5 text-right text-[#ffb4ab] font-bold text-sm">
                    {item.anomalyScore.toFixed(2)}
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onInvestigateAnomaly(item)}
                      className="text-xs font-label-caps text-[#00f2ff] hover:text-[#74f5ff] border border-[#00f2ff]/30 hover:bg-[#00f2ff]/20 px-3 py-1 rounded transition-colors font-bold cursor-pointer"
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
