import React from 'react';
import { AnomalyEvent } from '../../types';
import { X, AlertTriangle, CheckCircle2, Sliders, ShieldAlert, Activity } from 'lucide-react';

interface InspectAnomalyModalProps {
  anomaly: AnomalyEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (anomalyId: string) => void;
  onCalibrateNode: (sensorId: string) => void;
}

export const InspectAnomalyModal: React.FC<InspectAnomalyModalProps> = ({
  anomaly,
  isOpen,
  onClose,
  onResolve,
  onCalibrateNode,
}) => {
  if (!isOpen || !anomaly) return null;

  const isCritical = anomaly.severity === 'Critical';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className={`flex justify-between items-center px-6 py-4 border-b border-[#30363D] ${isCritical ? 'bg-[#ffb4ab]/10' : 'bg-[#141c24]'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded ${isCritical ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]' : 'bg-[#FFD700]/20 text-[#FFD700]'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-data text-xs text-[#00f2ff] font-bold">{anomaly.sensorId}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono-data font-bold ${
                  isCritical ? 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/30' : 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30'
                }`}>
                  {anomaly.severity}
                </span>
              </div>
              <h3 className="font-bold text-[#e1fdff] text-base">{anomaly.type}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#849495] hover:text-[#e1fdff] p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 font-body-md text-sm">
          {/* Telemetry Snapshot */}
          <div className="grid grid-cols-3 gap-3 font-mono-data text-xs">
            <div className="bg-[#0A0C10] p-3 rounded border border-[#30363D]">
              <span className="text-[#849495] block mb-1">Timestamp (UTC)</span>
              <span className="text-[#e1fdff]">{anomaly.timestamp}</span>
            </div>
            <div className="bg-[#0A0C10] p-3 rounded border border-[#30363D]">
              <span className="text-[#849495] block mb-1">Primary Sensor</span>
              <span className="text-[#00f2ff] truncate block">{anomaly.primarySensor}</span>
            </div>
            <div className="bg-[#0A0C10] p-3 rounded border border-[#30363D]">
              <span className="text-[#849495] block mb-1">Anomaly Score</span>
              <span className={isCritical ? 'text-[#ffb4ab] font-bold text-sm' : 'text-[#FFD700] font-bold text-sm'}>
                {anomaly.anomalyScore.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Raw Reading */}
          <div className="p-3 bg-[#0A0C10] rounded border border-[#30363D]">
            <span className="font-label-caps text-xs text-[#849495] block mb-1 uppercase">
              Raw Transducer Signal
            </span>
            <div className="text-sm font-mono-data text-[#e1fdff] flex items-center justify-between">
              <span>{anomaly.rawReading}</span>
              <Activity className="w-4 h-4 text-[#ffb4ab] animate-pulse" />
            </div>
          </div>

          {/* Diagnostic Narrative */}
          <div className="space-y-2">
            <h4 className="font-label-caps text-xs text-[#00f2ff] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Diagnostic Assessment</span>
            </h4>
            <p className="text-xs text-[#dae3ee] leading-relaxed bg-[#182028] p-3 rounded border border-[#3a494b]">
              {anomaly.description || 'Spatial covariance matrix indicates outlier behavior across 12-dimensional manifold.'}
            </p>
            {anomaly.potentialCause && (
              <p className="text-xs text-[#b9cacb] font-mono-data bg-[#0A0C10] p-2.5 rounded border border-[#30363D]">
                <strong className="text-[#FFD700]">Potential Root Cause:</strong> {anomaly.potentialCause}
              </p>
            )}
          </div>

          {/* Simulated Waveform Anomaly Chart */}
          <div className="p-3 bg-[#0A0C10] rounded border border-[#30363D]">
            <div className="flex justify-between text-xs text-[#849495] mb-2 font-mono-data">
              <span>Waveform Epoch (t-30m to t)</span>
              <span className="text-[#ffb4ab]">Threshold Breach (+3.8σ)</span>
            </div>
            <div className="h-16 w-full flex items-end gap-1">
              {[20, 22, 21, 24, 25, 23, 22, 28, 45, 82, 95, 78, 65, 88].map((val, idx) => {
                const isSpike = idx >= 8;
                return (
                  <div key={idx} className="flex-1 flex flex-col justify-end h-full">
                    <div
                      className={`w-full rounded-t transition-all ${
                        isSpike ? 'bg-[#ffb4ab]' : 'bg-[#00f2ff]/40'
                      }`}
                      style={{ height: `${val}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#30363D] flex justify-between items-center">
            <button
              type="button"
              onClick={() => onCalibrateNode(anomaly.sensorId)}
              className="text-xs font-label-caps text-[#00f2ff] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Launch Sensor Calibration</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-label-caps text-[#b9cacb] hover:text-[#e1fdff] transition-colors"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  onResolve(anomaly.id);
                  onClose();
                }}
                className="bg-[#37fa87] hover:bg-[#62ff96] text-[#00210b] font-label-caps text-xs font-bold px-4 py-1.5 rounded flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Resolved</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
