import React from 'react';
import { ClimoraLogo } from './ClimoraLogo';

export const Footer: React.FC = () => {
  return (
    <footer 
      id="main-footer"
      className="w-full mt-auto border-t border-[#3a494b] bg-[#0b141c] flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-2.5 gap-2 text-[11px] shrink-0"
    >
      <div className="flex items-center gap-2">
        <ClimoraLogo size={18} />
        <p className="font-label-caps text-[#b8c3ff] font-medium text-center md:text-left">
          © 2024 CLIMORA Spatio-Temporal Intelligence.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-label-caps text-[#b9cacb]">
        <button 
          onClick={() => alert('Security Protocol: AES-256 GCM Hardware-encrypted telemetry streams with TLS 1.3 edge termination.')}
          className="hover:text-[#00f2ff] transition-colors underline-offset-4 hover:underline cursor-pointer"
        >
          Security Protocol
        </button>
        <button 
          onClick={() => alert('API Status: 99.98% uptime in US-West and EU-North regions. Latency: 18ms.')}
          className="hover:text-[#00f2ff] transition-colors underline-offset-4 hover:underline cursor-pointer"
        >
          API Status
        </button>
        <button 
          onClick={() => alert('Edge Mesh Network: 1,248 distributed nodes connected via Sub-GHz LoRa & Satellite Backhaul.')}
          className="hover:text-[#00f2ff] transition-colors underline-offset-4 hover:underline cursor-pointer"
        >
          Edge Network
        </button>
        <button 
          onClick={() => alert('Privacy: Zero-knowledge atmospheric & spatial telemetry aggregation without PII ingestion.')}
          className="hover:text-[#00f2ff] transition-colors underline-offset-4 hover:underline cursor-pointer"
        >
          Privacy
        </button>
      </div>
    </footer>
  );
};
