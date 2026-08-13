import React, { useState, useEffect } from 'react';
import { ViewMode, EdgeNode, AnomalyEvent, SystemSettings } from './types';
import { 
  INITIAL_NODES, 
  INITIAL_ANOMALIES, 
  TELEMETRY_24H_DATA, 
  DEFAULT_SETTINGS 
} from './mockData';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Footer } from './components/Footer';
import { LandingView } from './components/views/LandingView';
import { OverviewView } from './components/views/OverviewView';
import { LiveMapView } from './components/views/LiveMapView';
import { MLModelsView } from './components/views/MLModelsView';
import { EdgeNodesView } from './components/views/EdgeNodesView';
import { SettingsView } from './components/views/SettingsView';
import { AlertsView } from './components/views/AlertsView';
import { DeployNodeModal } from './components/modals/DeployNodeModal';
import { CalibrateNodeModal } from './components/modals/CalibrateNodeModal';
import { InspectAnomalyModal } from './components/modals/InspectAnomalyModal';
import { CheckCircle2, Info } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('overview');
  const [nodes, setNodes] = useState<EdgeNode[]>(() => {
    const saved = localStorage.getItem('climora_nodes') || localStorage.getItem('climaedge_nodes');
    return saved ? JSON.parse(saved) : INITIAL_NODES;
  });
  const [anomalies, setAnomalies] = useState<AnomalyEvent[]>(() => {
    const saved = localStorage.getItem('climora_anomalies') || localStorage.getItem('climaedge_anomalies');
    return saved ? JSON.parse(saved) : INITIAL_ANOMALIES;
  });
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('climora_settings') || localStorage.getItem('climaedge_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Modal States
  const [selectedNode, setSelectedNode] = useState<EdgeNode | null>(nodes[0] || null);
  const [inspectAnomaly, setInspectAnomaly] = useState<AnomalyEvent | null>(null);
  const [calibrateTargetNode, setCalibrateTargetNode] = useState<EdgeNode | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isCalibrateModalOpen, setIsCalibrateModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('climora_nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('climora_anomalies', JSON.stringify(anomalies));
  }, [anomalies]);

  useEffect(() => {
    localStorage.setItem('climora_settings', JSON.stringify(settings));
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Node actions
  const handleDeployNode = (newNode: EdgeNode) => {
    setNodes((prev) => [newNode, ...prev]);
    showToast(`Edge node ${newNode.id} provisioned and connected to mesh network.`);
  };

  const handleOpenCalibrateModal = (node: EdgeNode) => {
    setCalibrateTargetNode(node);
    setIsCalibrateModalOpen(true);
  };

  const handleCalibrateSuccess = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              status: 'Online',
              anomalyScore: 0.08,
              lastPing: 'Just now (Calibrated)',
            }
          : n
      )
    );
    // Also remove anomaly if exists
    setAnomalies((prev) => prev.filter((a) => a.sensorId !== nodeId));
    showToast(`Node ${nodeId} zero-point transducer calibration verified.`);
  };

  const handleResolveAnomaly = (anomalyId: string) => {
    setAnomalies((prev) => prev.filter((a) => a.id !== anomalyId));
    showToast(`Incident #${anomalyId} resolved and archived.`);
  };

  const handleRebootNode = (nodeId: string) => {
    showToast(`Transmitting OTA warm reboot signal to node ${nodeId}...`);
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? { ...n, status: 'Online', lastPing: '1s ago (Rebooted)' }
            : n
        )
      );
      showToast(`Node ${nodeId} rebooted successfully. Microcontroller status: NOMINAL.`);
    }, 1500);
  };

  // Navigation helpers
  const handleSelectNodeForMap = (node: EdgeNode) => {
    setSelectedNode(node);
    setCurrentView('map');
  };

  const handleNavigateToMapFromAnomaly = (sensorId: string) => {
    const matched = nodes.find((n) => n.id === sensorId);
    if (matched) setSelectedNode(matched);
    setCurrentView('map');
  };

  // Data exports
  const handleExportCsv = () => {
    const headers = ['Timestamp,SensorId,SensorName,Type,PrimarySensor,RawReading,AnomalyScore,Severity,Status\n'];
    const rows = anomalies.map(
      (a) =>
        `"${a.timestamp}","${a.sensorId}","${a.sensorName || ''}","${a.type}","${a.primarySensor}","${a.rawReading}","${a.anomalyScore}","${a.severity}","${a.status}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `climora_anomalies_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Anomalies CSV dataset generated and downloaded.');
  };

  const handleDownloadLogs = () => {
    const payload = {
      system: 'CLIMORA Spatio-Temporal AI Framework v4.2',
      exportedAt: new Date().toISOString(),
      settings,
      activeNodesCount: nodes.filter((n) => n.status !== 'Offline').length,
      nodes,
      anomalies,
      telemetrySnapshot: TELEMETRY_24H_DATA,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `climora_system_telemetry_logs_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Full telemetry JSON archive downloaded.');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0C10] text-[#dae3ee]">
      {/* Fixed Left Sidebar on Desktop */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        activeNodesCount={nodes.filter((n) => n.status !== 'Offline').length}
        totalAnomaliesCount={anomalies.length}
        onDownloadLogs={handleDownloadLogs}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden md:ml-[280px] relative">
        {/* Top Navbar */}
        <TopNav
          currentView={currentView}
          onSelectView={setCurrentView}
          onOpenDeployModal={() => setIsDeployModalOpen(true)}
          anomaliesCount={anomalies.length}
        />

        {/* View Switcher Container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col bg-[#0A0C10]">
          {currentView === 'landing' && (
            <LandingView
              onNavigate={setCurrentView}
              onDeployNode={() => setIsDeployModalOpen(true)}
            />
          )}

          {currentView === 'overview' && (
            <OverviewView
              nodes={nodes}
              anomalies={anomalies}
              telemetryData={TELEMETRY_24H_DATA}
              unitPreference={settings.unitPreference}
              onNavigate={setCurrentView}
              onInspectAnomaly={(anom) => setInspectAnomaly(anom)}
              onSelectNode={handleSelectNodeForMap}
            />
          )}

          {currentView === 'map' && (
            <LiveMapView
              nodes={nodes}
              selectedNode={selectedNode}
              unitPreference={settings.unitPreference}
              onSelectNode={setSelectedNode}
              onOpenCalibrate={(node) => handleOpenCalibrateModal(node)}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'models' && (
            <MLModelsView
              anomalies={anomalies}
              onInvestigateAnomaly={(anom) => setInspectAnomaly(anom)}
              onExportCsv={handleExportCsv}
              sensitivity={settings.isolationForestSensitivity}
            />
          )}

          {currentView === 'nodes' && (
            <EdgeNodesView
              nodes={nodes}
              onSelectNodeForMap={handleSelectNodeForMap}
              onOpenDeployModal={() => setIsDeployModalOpen(true)}
              onOpenCalibrateModal={handleOpenCalibrateModal}
              onRebootNode={handleRebootNode}
              unitPreference={settings.unitPreference}
            />
          )}

          {currentView === 'alerts' && (
            <AlertsView
              anomalies={anomalies}
              nodes={nodes}
              onInspectAnomaly={(anom) => setInspectAnomaly(anom)}
              onResolveAnomaly={handleResolveAnomaly}
              onNavigateToMap={handleNavigateToMapFromAnomaly}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={setSettings}
              onExportLogs={handleDownloadLogs}
              onShowToast={showToast}
            />
          )}

          {/* Persistent Footer */}
          <Footer />
        </main>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#161B22] border border-[#00f2ff] text-[#e1fdff] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 font-mono-data text-xs animate-in fade-in slide-in-from-bottom-3">
            <Info className="w-4 h-4 text-[#00f2ff] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Global Modals */}
        <DeployNodeModal
          isOpen={isDeployModalOpen}
          onClose={() => setIsDeployModalOpen(false)}
          onDeploy={handleDeployNode}
        />

        <CalibrateNodeModal
          isOpen={isCalibrateModalOpen}
          node={calibrateTargetNode}
          onClose={() => setIsCalibrateModalOpen(false)}
          onCalibrateSuccess={handleCalibrateSuccess}
        />

        <InspectAnomalyModal
          isOpen={!!inspectAnomaly}
          anomaly={inspectAnomaly}
          onClose={() => setInspectAnomaly(null)}
          onResolve={handleResolveAnomaly}
          onCalibrateNode={(sensorId) => {
            const target = nodes.find((n) => n.id === sensorId) || {
              id: sensorId,
              name: 'Edge Sensor Array',
              status: 'Warning',
              locationName: 'Active Sector',
              lat: 34.0522,
              lng: -118.2437,
              temperature: 28.5,
              humidity: 60,
              aqi: 80,
              anomalyScore: 0.85,
              powerType: 'Battery',
              batteryLevel: 90,
              lastPing: '1m ago',
              firmwareVersion: 'v4.1.2-edge',
              hardwareModel: 'EdgeNode-X300',
            };
            setInspectAnomaly(null);
            handleOpenCalibrateModal(target as EdgeNode);
          }}
        />
      </div>
    </div>
  );
}
