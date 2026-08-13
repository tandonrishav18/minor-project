import React, { useState } from 'react';
import { ViewMode } from '../types';
import { HOTLINK_IMAGES } from '../mockData';
import { ClimoraLogo } from './ClimoraLogo';
import { 
  Bell, 
  Settings, 
  Plus, 
  Menu, 
  X, 
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface TopNavProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenDeployModal: () => void;
  anomaliesCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onSelectView,
  onOpenDeployModal,
  anomaliesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navLinks: { id: ViewMode; label: string }[] = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'map', label: 'Live Map' },
    { id: 'models', label: 'Analysis' },
    { id: 'alerts', label: 'Alerts' },
  ];

  return (
    <header 
      id="top-nav-bar"
      className="bg-[#182028] border-b border-[#3a494b] sticky top-0 z-30 flex justify-between items-center w-full px-4 md:px-8 py-3 shrink-0"
    >
      {/* Brand logo (visible on mobile, or clickable) */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onSelectView('landing')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <ClimoraLogo size={32} />
          <span className="font-bold text-xl md:text-2xl text-[#e1fdff] tracking-tight group-hover:text-[#00f2ff] transition-colors">
            CLIMORA
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono-data bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20">
            v4.2 PROD
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 ml-6">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                id={`topnav-link-${link.id}`}
                onClick={() => onSelectView(link.id)}
                className={`font-label-caps text-xs tracking-wider transition-all duration-150 py-1 relative ${
                  isActive
                    ? 'text-[#e1fdff] font-bold border-b-2 border-[#00f2ff]'
                    : 'text-[#b9cacb] hover:text-[#74f5ff]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Deploy Node button */}
        <button
          id="btn-deploy-node-topnav"
          onClick={onOpenDeployModal}
          className="flex items-center gap-1.5 bg-[#00f2ff] hover:bg-[#74f5ff] text-[#002022] font-label-caps text-xs px-3.5 py-1.5 rounded font-bold transition-colors active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Deploy Node</span>
        </button>

        {/* Settings button */}
        <button
          id="btn-settings-topnav"
          onClick={() => onSelectView('settings')}
          aria-label="Settings"
          className="text-[#b9cacb] hover:text-[#00f2ff] p-1.5 rounded hover:bg-[#2d363e] transition-colors"
          title="System Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            id="btn-notifications-topnav"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="text-[#b9cacb] hover:text-[#00f2ff] p-1.5 rounded hover:bg-[#2d363e] transition-colors relative"
            title="Telemetry Alerts & Events"
          >
            <Bell className="w-5 h-5" />
            {anomaliesCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#161B22] border border-[#30363D] rounded-lg shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#30363D]">
                <h4 className="font-label-caps text-xs uppercase text-[#e1fdff] font-bold">
                  System Alerts ({anomaliesCount})
                </h4>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#b9cacb] hover:text-[#00f2ff]"
                >
                  Close
                </button>
              </div>
              <div className="mt-3 space-y-2.5 max-h-60 overflow-y-auto pr-1">
                <div 
                  onClick={() => { onSelectView('alerts'); setShowNotifications(false); }}
                  className="p-2 bg-[#2d363e]/40 hover:bg-[#2d363e] rounded border border-[#ffb4ab]/30 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 text-[#ffb4ab] text-xs font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>NODE-782: Temp Spike (+5°C)</span>
                  </div>
                  <p className="text-[11px] text-[#b9cacb] mt-1 font-mono-data">Critical anomaly in San Fernando Valley</p>
                </div>
                <div 
                  onClick={() => { onSelectView('alerts'); setShowNotifications(false); }}
                  className="p-2 bg-[#2d363e]/40 hover:bg-[#2d363e] rounded border border-[#FFD700]/30 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 text-[#FFD700] text-xs font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>CE-9021: Anomaly Score 0.82</span>
                  </div>
                  <p className="text-[11px] text-[#b9cacb] mt-1 font-mono-data">Elevated AQI / Humidity divergence</p>
                </div>
                <div className="p-2 bg-[#2d363e]/20 rounded border border-[#3a494b] text-[11px] text-[#b9cacb] flex items-center gap-2 font-mono-data">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#37fa87]" />
                  <span>Mesh sync: 1,192 nodes nominal</span>
                </div>
              </div>
              <button
                onClick={() => { onSelectView('alerts'); setShowNotifications(false); }}
                className="w-full mt-3 py-1.5 bg-[#0044eb] hover:bg-[#2D5BFF] text-white text-xs font-label-caps rounded transition-colors text-center block font-semibold"
              >
                View Incident Command Center
              </button>
            </div>
          )}
        </div>

        {/* Operator Profile Avatar */}
        <div 
          onClick={() => onSelectView('settings')}
          className="w-8 h-8 rounded-full bg-[#2d363e] border border-[#3a494b] overflow-hidden cursor-pointer hover:border-[#00f2ff] transition-colors shrink-0"
          title="Logged in as Operator: tandonrishav18@gmail.com"
        >
          <img
            src={HOTLINK_IMAGES.operatorAvatar1}
            alt="Operator Profile"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#e1fdff] p-1.5 rounded hover:bg-[#2d363e]"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#141c24] border-b border-[#3a494b] p-4 flex flex-col gap-2 shadow-2xl z-50">
          <button
            onClick={() => { onSelectView('landing'); setMobileMenuOpen(false); }}
            className={`text-left px-3 py-2 rounded text-sm font-label-caps ${currentView === 'landing' ? 'bg-[#0044eb] text-white' : 'text-[#b9cacb]'}`}
          >
            Landing Page
          </button>
          <button
            onClick={() => { onSelectView('overview'); setMobileMenuOpen(false); }}
            className={`text-left px-3 py-2 rounded text-sm font-label-caps ${currentView === 'overview' ? 'bg-[#0044eb] text-white' : 'text-[#b9cacb]'}`}
          >
            System Overview
          </button>
          <button
            onClick={() => { onSelectView('map'); setMobileMenuOpen(false); }}
            className={`text-left px-3 py-2 rounded text-sm font-label-caps ${currentView === 'map' ? 'bg-[#0044eb] text-white' : 'text-[#b9cacb]'}`}
          >
            Telemetry Map
          </button>
          <button
            onClick={() => { onSelectView('models'); setMobileMenuOpen(false); }}
            className={`text-left px-3 py-2 rounded text-sm font-label-caps ${currentView === 'models' ? 'bg-[#0044eb] text-white' : 'text-[#b9cacb]'}`}
          >
            ML Models & Analysis
          </button>
          <button
            onClick={() => { onSelectView('nodes'); setMobileMenuOpen(false); }}
            className={`text-left px-3 py-2 rounded text-sm font-label-caps ${currentView === 'nodes' ? 'bg-[#0044eb] text-white' : 'text-[#b9cacb]'}`}
          >
            Edge Nodes Directory
          </button>
          <button
            onClick={() => { onSelectView('alerts'); setMobileMenuOpen(false); }}
            className={`text-left px-3 py-2 rounded text-sm font-label-caps ${currentView === 'alerts' ? 'bg-[#0044eb] text-white' : 'text-[#b9cacb]'}`}
          >
            Incident Alerts ({anomaliesCount})
          </button>
          <button
            onClick={() => { onSelectView('settings'); setMobileMenuOpen(false); }}
            className={`text-left px-3 py-2 rounded text-sm font-label-caps ${currentView === 'settings' ? 'bg-[#0044eb] text-white' : 'text-[#b9cacb]'}`}
          >
            Settings & Configuration
          </button>
        </div>
      )}
    </header>
  );
};
