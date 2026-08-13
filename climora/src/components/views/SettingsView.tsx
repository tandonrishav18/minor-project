import React, { useState } from 'react';
import { SystemSettings } from '../../types';
import { 
  Settings, 
  Key, 
  Database, 
  Cpu, 
  Sliders, 
  Save, 
  Copy, 
  RotateCw, 
  Check, 
  Download, 
  AlertTriangle,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface SettingsViewProps {
  settings: SystemSettings;
  onSaveSettings: (newSettings: SystemSettings) => void;
  onExportLogs: () => void;
  onShowToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onExportLogs,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<SystemSettings>({ ...settings });
  const [copiedKey, setCopiedKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(formData.masterApiKey);
    setCopiedKey(true);
    onShowToast('Master API key copied to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRotateKey = () => {
    const newKey = `sk-clima-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setFormData(prev => ({ ...prev, masterApiKey: newKey }));
    onShowToast('New master API key generated. Remember to save changes.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onSaveSettings(formData);
      setIsSaving(false);
      onShowToast('System configuration changes saved successfully.');
    }, 600);
  };

  return (
    <div id="settings-view-container" className="p-4 md:p-10 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#3a494b] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-label-caps text-[#849495] uppercase mb-1">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#00f2ff]">Settings</span>
          </div>
          <h2 className="font-extrabold text-2xl md:text-4xl text-[#e1fdff] tracking-tight">
            System Configuration
          </h2>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#00f2ff] hover:bg-[#74f5ff] text-[#002022] font-label-caps text-xs font-bold px-5 py-2.5 rounded transition-colors cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
        </button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 font-body-md text-sm">
        {/* 1. General Configuration */}
        <section className="bg-[#141c24] border border-[#3a494b] rounded-lg p-5 space-y-4">
          <h3 className="font-label-caps text-xs uppercase text-[#e1fdff] tracking-widest font-bold flex items-center gap-2 border-b border-[#3a494b] pb-3">
            <Settings className="w-4 h-4 text-[#00f2ff]" />
            <span>General Telemetry Configuration</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono-data text-xs text-[#b9cacb] mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full bg-[#0A0C10] border border-[#30363D] rounded px-3 py-2 text-[#e1fdff] font-mono-data focus:border-[#00f2ff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-data text-xs text-[#b9cacb] mb-1">
                Data Retention Window
              </label>
              <select
                value={formData.dataRetention}
                onChange={(e) => setFormData({ ...formData, dataRetention: e.target.value as any })}
                className="w-full bg-[#0A0C10] border border-[#30363D] rounded px-3 py-2 text-[#e1fdff] font-mono-data focus:border-[#00f2ff] focus:outline-none"
              >
                <option value="30 Days">30 Days (Standard Edge Cache)</option>
                <option value="90 Days">90 Days (Recommended)</option>
                <option value="1 Year">1 Year (Long Term Archive)</option>
                <option value="Indefinite">Indefinite (Full Cold Storage)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono-data text-xs text-[#b9cacb] mb-2">
              Temperature Unit Display Preference
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono-data text-[#dae3ee]">
                <input
                  type="radio"
                  name="unitPref"
                  checked={formData.unitPreference === 'Celsius'}
                  onChange={() => setFormData({ ...formData, unitPreference: 'Celsius' })}
                  className="accent-[#00f2ff]"
                />
                <span>Celsius (°C) [International Standard]</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono-data text-[#dae3ee]">
                <input
                  type="radio"
                  name="unitPref"
                  checked={formData.unitPreference === 'Fahrenheit'}
                  onChange={() => setFormData({ ...formData, unitPreference: 'Fahrenheit' })}
                  className="accent-[#00f2ff]"
                />
                <span>Fahrenheit (°F) [US Imperial]</span>
              </label>
            </div>
          </div>
        </section>

        {/* 2. API & Integration Keys */}
        <section className="bg-[#141c24] border border-[#3a494b] rounded-lg p-5 space-y-4">
          <h3 className="font-label-caps text-xs uppercase text-[#e1fdff] tracking-widest font-bold flex items-center gap-2 border-b border-[#3a494b] pb-3">
            <Key className="w-4 h-4 text-[#00f2ff]" />
            <span>API Gateway & Ingestion Endpoints</span>
          </h3>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-mono-data text-xs text-[#b9cacb]">
                Master Node Ingestion API Key
              </label>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[11px] text-[#00f2ff] hover:underline font-mono-data"
              >
                {showKey ? 'Hide Secret' : 'Reveal Secret'}
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                readOnly
                value={formData.masterApiKey}
                className="flex-1 bg-[#0A0C10] border border-[#30363D] rounded px-3 py-2 text-[#00f2ff] font-mono-data text-xs"
              />
              <button
                type="button"
                onClick={handleCopyKey}
                className="px-3 py-2 bg-[#182028] border border-[#3a494b] hover:bg-[#2d363e] text-[#dae3ee] rounded flex items-center gap-1 text-xs font-mono-data transition-colors"
                title="Copy API Key"
              >
                {copiedKey ? <Check className="w-4 h-4 text-[#37fa87]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handleRotateKey}
                className="px-3 py-2 bg-[#182028] border border-[#3a494b] hover:bg-[#2d363e] text-[#dae3ee] rounded flex items-center gap-1 text-xs font-mono-data transition-colors"
                title="Rotate Key"
              >
                <RotateCw className="w-4 h-4" />
                <span>Rotate</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono-data text-xs text-[#b9cacb] mb-1">
                Alert Webhook URL (Slack/PagerDuty)
              </label>
              <input
                type="text"
                value={formData.alertWebhookUrl}
                onChange={(e) => setFormData({ ...formData, alertWebhookUrl: e.target.value })}
                className="w-full bg-[#0A0C10] border border-[#30363D] rounded px-3 py-2 text-[#e1fdff] font-mono-data text-xs focus:border-[#00f2ff] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono-data text-xs text-[#b9cacb] mb-1">
                Edge Ingestion Server Endpoint
              </label>
              <input
                type="text"
                value={formData.backendEndpoint}
                onChange={(e) => setFormData({ ...formData, backendEndpoint: e.target.value })}
                className="w-full bg-[#0A0C10] border border-[#30363D] rounded px-3 py-2 text-[#e1fdff] font-mono-data text-xs focus:border-[#00f2ff] focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* 3. ML Model Hyperparameter Tuning */}
        <section className="bg-[#141c24] border border-[#3a494b] rounded-lg p-5 space-y-4">
          <h3 className="font-label-caps text-xs uppercase text-[#e1fdff] tracking-widest font-bold flex items-center gap-2 border-b border-[#3a494b] pb-3">
            <Cpu className="w-4 h-4 text-[#00f2ff]" />
            <span>Machine Learning & Anomaly Tuning</span>
          </h3>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-mono-data text-xs text-[#b9cacb]">
                Isolation Forest Contamination Rate (Sensitivity)
              </label>
              <span className="font-mono-data text-xs text-[#00f2ff] font-bold">
                {formData.isolationForestSensitivity.toFixed(2)} (
                {Math.round(formData.isolationForestSensitivity * 100)}% expected outlier ratio)
              </span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.20"
              step="0.01"
              value={formData.isolationForestSensitivity}
              onChange={(e) => setFormData({ ...formData, isolationForestSensitivity: parseFloat(e.target.value) })}
              className="w-full h-2 bg-[#2d363e] rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono-data text-[#849495] mt-1">
              <span>0.01 (Fewer False Positives)</span>
              <span>0.10 (Balanced)</span>
              <span>0.20 (High Sensitivity Alerting)</span>
            </div>
          </div>

          <div>
            <label className="block font-mono-data text-xs text-[#b9cacb] mb-2">
              Automated Re-training Batch Schedule
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono-data text-[#dae3ee]">
                <input
                  type="radio"
                  name="trainFreq"
                  checked={formData.trainingFrequency === 'hourly'}
                  onChange={() => setFormData({ ...formData, trainingFrequency: 'hourly' })}
                  className="accent-[#00f2ff]"
                />
                <span>Hourly (High Drift Environments)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono-data text-[#dae3ee]">
                <input
                  type="radio"
                  name="trainFreq"
                  checked={formData.trainingFrequency === 'daily'}
                  onChange={() => setFormData({ ...formData, trainingFrequency: 'daily' })}
                  className="accent-[#00f2ff]"
                />
                <span>Daily at 08:00 UTC (Standard)</span>
              </label>
            </div>
          </div>
        </section>

        {/* 4. System Maintenance & Telemetry Logs */}
        <section className="bg-[#141c24] border border-[#3a494b] rounded-lg p-5 space-y-4">
          <h3 className="font-label-caps text-xs uppercase text-[#e1fdff] tracking-widest font-bold flex items-center gap-2 border-b border-[#3a494b] pb-3">
            <Database className="w-4 h-4 text-[#00f2ff]" />
            <span>System Maintenance & Data Dump</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-[#0A0C10] rounded border border-[#30363D]">
            <div>
              <h4 className="font-mono-data text-xs text-[#e1fdff] font-semibold">
                Export Full Telemetry Archive (.JSON / .CSV)
              </h4>
              <p className="text-[11px] text-[#849495] font-mono-data mt-0.5">
                Download raw sensor epochs and anomaly scores for offline analysis.
              </p>
            </div>
            <button
              type="button"
              onClick={onExportLogs}
              className="bg-[#182028] hover:bg-[#2d363e] text-[#00f2ff] border border-[#00f2ff]/40 font-mono-data text-xs px-4 py-2 rounded flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Export Raw Data</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-[#ffb4ab]/5 rounded border border-[#ffb4ab]/20">
            <div>
              <h4 className="font-mono-data text-xs text-[#ffb4ab] font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Clear Local Edge Cache</span>
              </h4>
              <p className="text-[11px] text-[#849495] font-mono-data mt-0.5">
                Purges volatile transient buffer. Does not delete historical Cloud replicas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('Local volatile cache purged. All edge buffers synchronized.')}
              className="bg-[#182028] hover:bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/40 font-mono-data text-xs px-4 py-2 rounded transition-colors cursor-pointer whitespace-nowrap"
            >
              Purge Cache
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};
