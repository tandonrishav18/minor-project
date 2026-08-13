import React from 'react';
import { ViewMode } from '../../types';
import { ClimoraLogo } from '../ClimoraLogo';
import { Radio, Router, Cpu, BellRing, ArrowRight } from 'lucide-react';

interface LandingViewProps {
  onNavigate: (view: ViewMode) => void;
  onDeployNode: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  onDeployNode,
}) => {
  return (
    <div id="landing-view-container" className="flex-1 flex flex-col min-h-full relative overflow-x-hidden bg-[#0b141c]">
      <div className="absolute inset-0 dot-matrix-bg pointer-events-none opacity-20 z-0" />

      {/* Hero Section */}
      <div className="z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12 md:py-20 max-w-5xl mx-auto text-center">
        {/* Emblem Logo */}
        <div className="mb-6 hover:scale-105 transition-transform">
          <ClimoraLogo size={104} />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182028] border border-[#3a494b] text-xs font-mono-data text-[#74f5ff] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#00f2ff]" />
          <span>CLIMORA Spatial AI Framework v4.2</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-extrabold text-3xl sm:text-5xl md:text-6xl text-[#dae3ee] tracking-tight leading-[1.15] max-w-4xl">
          Detect Environmental Anomalies Before They Become{' '}
          <span className="text-[#00f2ff]">
            Critical
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-[#b9cacb] max-w-2xl mx-auto font-normal leading-relaxed">
          Real-time spatio-temporal environmental monitoring powered by AI-driven anomaly detection at the edge.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <button
            id="btn-landing-open-dashboard"
            onClick={() => onNavigate('overview')}
            className="w-full sm:w-auto bg-[#00f2ff] hover:bg-[#74f5ff] text-[#002022] font-label-caps text-xs uppercase px-8 py-3.5 rounded font-bold transition-colors active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-landing-explore-project"
            onClick={() => onNavigate('map')}
            className="w-full sm:w-auto border border-[#0044eb] text-[#b8c3ff] hover:bg-[#0044eb] hover:text-white font-label-caps text-xs uppercase px-8 py-3.5 rounded font-bold transition-colors duration-300 active:scale-[0.98] cursor-pointer"
          >
            Explore Live Map
          </button>
        </div>

        {/* Visual Process Section (4 interconnected workflow cards) */}
        <div className="mt-16 sm:mt-24 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
            {/* Step 1: Sensors */}
            <div 
              onClick={() => onNavigate('map')}
              className="bg-[#141c24] border border-[#3a494b] rounded-lg p-6 flex flex-col items-center text-center relative group hover:border-[#00f2ff] transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#0b141c] border border-[#3a494b] flex items-center justify-center mb-4 group-hover:border-[#00f2ff] transition-colors relative">
                <Radio className="w-7 h-7 text-[#00f2ff]" />
              </div>
              <h3 className="font-label-caps text-sm text-[#dae3ee] font-bold uppercase tracking-wider mb-1">
                Sensors
              </h3>
              <p className="font-mono-data text-xs text-[#b9cacb]">
                Distributed Data Capture
              </p>
              {/* Connector Line (Desktop) */}
              <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t border-dashed border-[#3a494b] transform -translate-y-1/2 z-10" />
            </div>

            {/* Step 2: Edge Processing */}
            <div 
              onClick={() => onNavigate('nodes')}
              className="bg-[#141c24] border border-[#3a494b] rounded-lg p-6 flex flex-col items-center text-center relative group hover:border-[#b8c3ff] transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#0b141c] border border-[#3a494b] flex items-center justify-center mb-4 group-hover:border-[#b8c3ff] transition-colors">
                <Router className="w-7 h-7 text-[#b8c3ff]" />
              </div>
              <h3 className="font-label-caps text-sm text-[#dae3ee] font-bold uppercase tracking-wider mb-1">
                Edge Processing
              </h3>
              <p className="font-mono-data text-xs text-[#b9cacb]">
                Local Data Aggregation
              </p>
              {/* Connector Line */}
              <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t border-dashed border-[#3a494b] transform -translate-y-1/2 z-10" />
            </div>

            {/* Step 3: AI Detection */}
            <div 
              onClick={() => onNavigate('models')}
              className="bg-[#141c24] border border-[#3a494b] rounded-lg p-6 flex flex-col items-center text-center relative group hover:border-[#37fa87] transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#0b141c] border border-[#3a494b] flex items-center justify-center mb-4 group-hover:border-[#37fa87] transition-colors">
                <Cpu className="w-7 h-7 text-[#37fa87]" />
              </div>
              <h3 className="font-label-caps text-sm text-[#dae3ee] font-bold uppercase tracking-wider mb-1">
                AI Detection
              </h3>
              <p className="font-mono-data text-xs text-[#b9cacb]">
                Pattern Recognition (PCA & Isolation Forest)
              </p>
              {/* Connector Line */}
              <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t border-dashed border-[#3a494b] transform -translate-y-1/2 z-10" />
            </div>

            {/* Step 4: Alerts */}
            <div 
              onClick={() => onNavigate('alerts')}
              className="bg-[#141c24] border border-[#3a494b] hover:border-[#00f2ff] rounded-lg p-6 flex flex-col items-center text-center relative group transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#0b141c] border border-[#3a494b] group-hover:border-[#00f2ff] flex items-center justify-center mb-4 transition-colors">
                <BellRing className="w-7 h-7 text-[#00f2ff]" />
              </div>
              <h3 className="font-label-caps text-sm text-[#00f2ff] font-bold uppercase tracking-wider mb-1">
                Alerts
              </h3>
              <p className="font-mono-data text-xs text-[#b9cacb]">
                Actionable Insights & Triage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
