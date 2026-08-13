import React from 'react';
import { ViewMode } from '../types';
import { ClimoraLogo } from './ClimoraLogo';
import { 
  LayoutDashboard, 
  Radio, 
  Cpu, 
  Server, 
  Settings, 
  Download, 
  FileText, 
  HelpCircle,
  Cloud,
  Layers,
  Bell
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  activeNodesCount: number;
  totalAnomaliesCount: number;
  onDownloadLogs: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  activeNodesCount,
  totalAnomaliesCount,
  onDownloadLogs,
}) => {
  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'map',
      label: 'Telemetry',
      icon: <Radio className="w-5 h-5" />,
    },
    {
      id: 'models',
      label: 'ML Models',
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      id: 'nodes',
      label: 'Edge Nodes',
      icon: <Server className="w-5 h-5" />,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <Bell className="w-5 h-5" />,
      badge: totalAnomaliesCount > 0 ? totalAnomaliesCount : undefined,
      badgeColor: 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/30',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside 
      id="main-sidebar"
      className="hidden md:flex flex-col h-screen w-[280px] fixed left-0 top-0 z-40 bg-[#141c24] border-r border-[#3a494b] py-6 select-none shrink-0"
    >
      {/* Brand Header */}
      <div 
        id="sidebar-header"
        onClick={() => onSelectView('landing')}
        className="px-5 mb-8 flex items-center gap-3 cursor-pointer group"
      >
        <div className="shrink-0 group-hover:scale-105 transition-transform">
          <ClimoraLogo size={42} />
        </div>
        <div>
          <h1 className="font-bold text-lg text-[#e1fdff] tracking-tight group-hover:text-[#00f2ff] transition-colors">
            CLIMORA
          </h1>
          <p className="font-mono-data text-xs text-[#b9cacb]">
            Active Nodes: <span className="text-[#00f2ff] font-semibold">{activeNodesCount.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-label-caps text-xs uppercase tracking-wider transition-all duration-150 relative ${
                isActive
                  ? 'bg-[#0044eb] text-[#c6cfff] font-bold shadow-sm'
                  : 'text-[#b9cacb] hover:bg-[#2d363e] hover:text-[#e1fdff]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#c6cfff]' : 'text-[#849495]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono-data ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#00f2ff] rounded-r" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Actions */}
      <div className="px-6 mt-auto space-y-4 pt-4 border-t border-[#3a494b]">
        <button
          id="btn-download-logs-sidebar"
          onClick={onDownloadLogs}
          className="w-full bg-[#00f2ff] text-[#002022] font-label-caps text-xs font-bold py-2.5 px-3 rounded flex items-center justify-center gap-2 hover:bg-[#74f5ff] transition-colors active:scale-[0.98] cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download Logs</span>
        </button>

        <div className="flex flex-col gap-1">
          <button
            onClick={() => onSelectView('landing')}
            className="flex items-center gap-3 p-2 text-xs font-label-caps text-[#b9cacb] hover:bg-[#2d363e] hover:text-[#e1fdff] rounded transition-colors text-left"
          >
            <Layers className="w-4 h-4 text-[#849495]" />
            <span>Landing / Overview</span>
          </button>
          <button
            onClick={() => alert('CLIMORA Spatio-Temporal Mesh Architecture v4.2 Documentation Loaded.')}
            className="flex items-center gap-3 p-2 text-xs font-label-caps text-[#b9cacb] hover:bg-[#2d363e] hover:text-[#e1fdff] rounded transition-colors text-left"
          >
            <FileText className="w-4 h-4 text-[#849495]" />
            <span>Documentation</span>
          </button>
          <button
            onClick={() => alert('Support dispatch center: contact teleops@climora.internal or channel #edge-ops')}
            className="flex items-center gap-3 p-2 text-xs font-label-caps text-[#b9cacb] hover:bg-[#2d363e] hover:text-[#e1fdff] rounded transition-colors text-left"
          >
            <HelpCircle className="w-4 h-4 text-[#849495]" />
            <span>Support</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
