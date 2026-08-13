import React, { useState } from 'react';
import { EdgeNode } from '../../types';
import { X, Sliders, CheckCircle2, RotateCw, AlertTriangle } from 'lucide-react';

interface CalibrateNodeModalProps {
  node: EdgeNode | null;
  isOpen: boolean;
  onClose: () => void;
  onCalibrateSuccess: (nodeId: string) => void;
}

export const CalibrateNodeModal: React.FC<CalibrateNodeModalProps> = ({
  node,
  isOpen,
  onClose,
  onCalibrateSuccess,
}) => {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationStage, setCalibrationStage] = useState(0);
  const [tempOffset, setTempOffset] = useState('0.0');
  const [humidityOffset, setHumidityOffset] = useState('0.0');
  const [baselineAqi, setBaselineAqi] = useState(node?.aqi.toString() || '35');

  if (!isOpen || !node) return null;

  const handleStartCalibration = () => {
    setIsCalibrating(true);
    setCalibrationStage(1);

    setTimeout(() => setCalibrationStage(2), 700);
    setTimeout(() => setCalibrationStage(3), 1500);
    setTimeout(() => {
      setIsCalibrating(false);
      setCalibrationStage(4);
      onCalibrateSuccess(node.id);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#30363D] bg-[#141c24]">
          <div className="flex items-center gap-2 text-[#00f2ff]">
            <Sliders className="w-5 h-5" />
            <h3 className="font-bold text-[#e1fdff] text-base">
              Sensor Calibration — {node.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#849495] hover:text-[#e1fdff] p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 font-body-md text-sm">
          <div className="p-3 bg-[#0A0C10] rounded border border-[#30363D] space-y-2">
            <div className="flex justify-between text-xs font-mono-data">
              <span className="text-[#b9cacb]">Target Hardware:</span>
              <span className="text-[#00f2ff] font-semibold">{node.hardwareModel}</span>
            </div>
            <div className="flex justify-between text-xs font-mono-data">
              <span className="text-[#b9cacb]">Current Reading:</span>
              <span className="text-[#e1fdff]">{node.temperature}°C / {node.humidity}% RH</span>
            </div>
            <div className="flex justify-between text-xs font-mono-data">
              <span className="text-[#b9cacb]">Current Anomaly Score:</span>
              <span className={node.anomalyScore > 0.75 ? 'text-[#ffb4ab]' : 'text-[#37fa87]'}>
                {node.anomalyScore.toFixed(2)}
              </span>
            </div>
          </div>

          {calibrationStage < 4 ? (
            <div className="space-y-4">
              <div>
                <label className="block font-mono-data text-xs text-[#b9cacb] mb-1">
                  Temperature Drift Correction (±°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tempOffset}
                  onChange={(e) => setTempOffset(e.target.value)}
                  disabled={isCalibrating}
                  className="w-full bg-[#0A0C10] border border-[#30363D] rounded px-3 py-2 text-[#e1fdff] font-mono-data focus:border-[#00f2ff] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono-data text-xs text-[#b9cacb] mb-1">
                  Relative Humidity Null Offset (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={humidityOffset}
                  onChange={(e) => setHumidityOffset(e.target.value)}
                  disabled={isCalibrating}
                  className="w-full bg-[#0A0C10] border border-[#30363D] rounded px-3 py-2 text-[#e1fdff] font-mono-data focus:border-[#00f2ff] focus:outline-none"
                />
              </div>

              {isCalibrating && (
                <div className="p-3 bg-[#0044eb]/20 border border-[#00f2ff]/40 rounded-lg text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-[#00f2ff] text-xs font-mono-data">
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>
                      {calibrationStage === 1 && 'Transmitting zero-point calibration packet...'}
                      {calibrationStage === 2 && 'Adjusting thermal transducer resistance...'}
                      {calibrationStage === 3 && 'Validating PCA distance against mesh baseline...'}
                    </span>
                  </div>
                  <div className="w-full bg-[#2d363e] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#00f2ff] h-full transition-all duration-500"
                      style={{ width: `${calibrationStage * 33}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-[#37fa87]/10 border border-[#37fa87]/30 rounded-lg text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#37fa87] mx-auto" />
              <h4 className="font-bold text-[#e1fdff]">Calibration Succeeded</h4>
              <p className="text-xs text-[#b9cacb] font-mono-data">
                Transducer offset applied. Node anomaly score normalized to nominal baseline (0.08).
              </p>
            </div>
          )}

          {/* Footer actions */}
          <div className="pt-4 border-t border-[#30363D] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-label-caps text-[#b9cacb] hover:text-[#e1fdff] transition-colors"
            >
              {calibrationStage === 4 ? 'Done' : 'Cancel'}
            </button>
            {calibrationStage < 4 && (
              <button
                type="button"
                onClick={handleStartCalibration}
                disabled={isCalibrating}
                className="bg-[#00f2ff] text-[#002022] font-label-caps text-xs font-bold px-5 py-2 rounded flex items-center gap-1.5 hover:bg-[#74f5ff] transition-colors disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isCalibrating ? 'animate-spin' : ''}`} />
                <span>{isCalibrating ? 'Calibrating...' : 'Execute Calibration'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
