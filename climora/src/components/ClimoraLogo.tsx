import React from 'react';

interface ClimoraLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
}

export const ClimoraLogo: React.FC<ClimoraLogoProps> = ({
  size = 36,
  className = '',
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          {/* Outer 'C' arc gradient: Teal to Blue to Navy to Green */}
          <linearGradient id="cArcGrad" x1="40" y1="10" x2="160" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5A3" />
            <stop offset="25%" stopColor="#00C4DF" />
            <stop offset="55%" stopColor="#005BDB" />
            <stop offset="80%" stopColor="#0A2540" />
            <stop offset="100%" stopColor="#004080" />
          </linearGradient>

          {/* Leaf gradient */}
          <linearGradient id="leafGrad" x1="130" y1="120" x2="185" y2="175" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="60%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>

          {/* Cloud & Mesh gradient */}
          <linearGradient id="cloudGrad" x1="70" y1="50" x2="130" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#0072F5" />
          </linearGradient>

          {/* Mountain & City Silhouettes gradient */}
          <linearGradient id="mountainGrad" x1="70" y1="110" x2="130" y2="155" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7E9EB8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2A4365" stopOpacity="0.85" />
          </linearGradient>

          {/* Rolling Hills gradient */}
          <linearGradient id="hillsGrad" x1="90" y1="130" x2="150" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#65A30D" />
            <stop offset="60%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Deep Navy Base curve */}
          <linearGradient id="baseCurveGrad" x1="50" y1="150" x2="150" y2="185" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B2347" />
            <stop offset="100%" stopColor="#06162D" />
          </linearGradient>
        </defs>

        {/* --- 1. Background Environment (Inside C) --- */}
        <g id="climora-inner-landscape">
          {/* Mountains Silhouette */}
          <path
            d="M 55 150 L 85 115 L 105 140 L 125 120 L 155 155 Z"
            fill="url(#mountainGrad)"
          />

          {/* City Skyline */}
          <path
            d="M 98 145 L 98 128 L 104 122 L 104 145 L 108 145 L 108 112 L 114 118 L 114 145 L 118 145 L 118 126 L 123 130 L 123 148 Z"
            fill="#8BA7C2"
            opacity="0.7"
          />

          {/* Green Tree on the right hill */}
          <circle cx="134" cy="122" r="11" fill="#15803D" />
          <rect x="132.5" y="130" width="3" height="8" rx="1" fill="#166534" />

          {/* Rolling Green Hills */}
          <path
            d="M 90 156 Q 120 135 155 145 Q 140 168 105 168 Z"
            fill="url(#hillsGrad)"
          />

          {/* Bottom Dark Navy Base Hill / River */}
          <path
            d="M 46 148 Q 75 148 100 158 Q 130 170 148 162 C 125 182 75 182 46 148 Z"
            fill="url(#baseCurveGrad)"
          />

          {/* Weather Station & Sensor Mast on the Left */}
          <g id="weather-mast" stroke="#003566" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Mast Pole */}
            <line x1="60" y1="152" x2="60" y2="108" />

            {/* Solar Panel */}
            <g transform="translate(45, 114) rotate(-15)">
              <rect x="0" y="0" width="13" height="8" rx="1" fill="#0284C7" stroke="#003566" strokeWidth="1.5" />
              <line x1="4.3" y1="0" x2="4.3" y2="8" stroke="#E0F2FE" strokeWidth="0.8" />
              <line x1="8.6" y1="0" x2="8.6" y2="8" stroke="#E0F2FE" strokeWidth="0.8" />
            </g>

            {/* Anemometer & Wind Vane Crossbar */}
            <line x1="53" y1="120" x2="68" y2="120" />
            <line x1="68" y1="120" x2="68" y2="110" />
            {/* Wind Cups */}
            <circle cx="64" cy="110" r="2.5" fill="#003566" />
            <circle cx="72" cy="110" r="2.5" fill="#003566" />

            {/* Radiation Multi-Plate Shield */}
            <line x1="64" y1="126" x2="72" y2="126" />
            <line x1="64" y1="129" x2="72" y2="129" />
            <line x1="64" y1="132" x2="72" y2="132" />

            {/* Wireless / RF Transmission Arcs */}
            <path d="M 53 103 A 8 8 0 0 1 67 103" stroke="#005BDB" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 48 98 A 15 15 0 0 1 72 98" stroke="#00C4DF" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>

          {/* Cloud & AI Telemetry Network Mesh at Top */}
          <g id="cloud-mesh">
            {/* Cloud Outline */}
            <path
              d="M 80 88 
                 C 70 88 68 76 76 72 
                 C 74 60 88 56 94 62 
                 C 99 50 116 50 121 62 
                 C 130 60 138 70 134 78 
                 C 142 82 138 88 130 88 
                 Z"
              fill="none"
              stroke="url(#cloudGrad)"
              strokeWidth="3.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Mesh Vertices inside Cloud */}
            <line x1="86" y1="78" x2="100" y2="64" stroke="#0072F5" strokeWidth="2" />
            <line x1="100" y1="64" x2="116" y2="78" stroke="#0072F5" strokeWidth="2" />
            <line x1="86" y1="78" x2="100" y2="83" stroke="#0072F5" strokeWidth="2" />
            <line x1="100" y1="64" x2="100" y2="83" stroke="#0072F5" strokeWidth="2" />
            <line x1="100" y1="83" x2="116" y2="78" stroke="#0072F5" strokeWidth="2" />

            <circle cx="86" cy="78" r="3.5" fill="#0072F5" />
            <circle cx="100" cy="64" r="4" fill="#00E5FF" stroke="#0072F5" strokeWidth="1.5" />
            <circle cx="100" cy="83" r="4" fill="#0072F5" />
            <circle cx="116" cy="78" r="3.5" fill="#0072F5" />

            {/* Vertical Dashed Telemetry Data Streams */}
            <line x1="86" y1="91" x2="86" y2="104" stroke="#00C4DF" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
            <line x1="100" y1="91" x2="100" y2="112" stroke="#00C4DF" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
            <line x1="116" y1="91" x2="116" y2="102" stroke="#00C4DF" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
          </g>
        </g>

        {/* --- 2. Outer Stylized "C" Arc Ring --- */}
        <path
          d="M 148 42
             A 76 76 0 1 0 142 165"
          fill="none"
          stroke="url(#cArcGrad)"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* --- 3. Terminal Green Leaf at Bottom Right --- */}
        <g id="climora-leaf" transform="translate(132, 110)">
          {/* Leaf Body */}
          <path
            d="M 8 50 
               C 22 45 42 28 46 0 
               C 38 24 16 38 0 42 
               C 2 46 5 49 8 50 Z"
            fill="url(#leafGrad)"
          />
          {/* Leaf Central Vein */}
          <path
            d="M 7 49 Q 24 33 46 0"
            stroke="#DCFCE7"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>

      {showText && (
        <span className="font-bold text-xl md:text-2xl text-[#e1fdff] tracking-tight font-sans">
          CLIMORA
        </span>
      )}
    </div>
  );
};
