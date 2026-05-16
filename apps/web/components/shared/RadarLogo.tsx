interface RadarLogoProps {
  size?: number;
}

const CX = 50;
const CY = 52;
const R  = 42;

export function RadarLogo({ size = 40 }: RadarLogoProps) {
  return (
    <svg
      className="radar-logo"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden
    >
      <defs>
        <linearGradient id="radar-sweep-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
        </linearGradient>
        <clipPath id="radar-clip">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
      </defs>

      {/* ── Newspaper page ── */}
      <rect x="3" y="3" width="94" height="94" rx="3" fill="#FEFDF8" stroke="#C0B49A" strokeWidth="1.5" />

      {/* Masthead bar */}
      <rect x="3" y="3" width="94" height="13" rx="3" fill="#1A1A1A" />
      <rect x="3" y="10" width="94" height="6"  fill="#1A1A1A" />
      <rect x="18" y="6.5" width="64" height="4" rx="1.5" fill="white" opacity="0.88" />

      {/* Tagline rule */}
      <line x1="8" y1="19" x2="92" y2="19" stroke="#C0B49A" strokeWidth="0.6" />

      {/* Main headline */}
      <rect x="8" y="22" width="84" height="3.5" rx="1" fill="#1A1A1A" opacity="0.7" />
      <rect x="8" y="27.5" width="56" height="2.5" rx="1" fill="#1A1A1A" opacity="0.42" />

      {/* Section rule */}
      <line x1="8" y1="33" x2="92" y2="33" stroke="#C0B49A" strokeWidth="0.6" />

      {/* 3-column layout */}
      {/* Left column — image placeholder + text */}
      <rect x="8"  y="36" width="27" height="18" rx="1.5" fill="#E2D8C6" />
      <rect x="8"  y="57" width="25" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="8"  y="61" width="27" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="8"  y="65" width="19" height="1.5" rx="0.75" fill="#CCCCCC" />

      {/* Column divider */}
      <line x1="40" y1="35" x2="40" y2="90" stroke="#C0B49A" strokeWidth="0.5" />

      {/* Middle column */}
      <rect x="43" y="36" width="19" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="43" y="40" width="21" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="43" y="44" width="15" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="43" y="48" width="20" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="43" y="52" width="17" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="43" y="56" width="21" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="43" y="60" width="13" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="43" y="64" width="19" height="1.5" rx="0.75" fill="#CCCCCC" />

      {/* Column divider */}
      <line x1="68" y1="35" x2="68" y2="90" stroke="#C0B49A" strokeWidth="0.5" />

      {/* Right column */}
      <rect x="71" y="36" width="19" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="71" y="40" width="17" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="71" y="44" width="21" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="71" y="48" width="14" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="71" y="52" width="19" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="71" y="56" width="16" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="71" y="60" width="20" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="71" y="64" width="12" height="1.5" rx="0.75" fill="#CCCCCC" />

      {/* Horizontal rule */}
      <line x1="8" y1="70" x2="92" y2="70" stroke="#C0B49A" strokeWidth="0.5" />

      {/* Bottom 2-column section */}
      <line x1="52" y1="71" x2="52" y2="90" stroke="#C0B49A" strokeWidth="0.5" />
      <rect x="8"  y="73" width="38" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="8"  y="77" width="32" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="8"  y="81" width="36" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="8"  y="85" width="26" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="55" y="73" width="35" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="55" y="77" width="29" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="55" y="81" width="33" height="1.5" rx="0.75" fill="#CCCCCC" />
      <rect x="55" y="85" width="22" height="1.5" rx="0.75" fill="#CCCCCC" />

      {/* ── Radar overlay ── */}
      <circle cx={CX} cy={CY} r={R}        fill="none" stroke="#22C55E" strokeWidth="1"   opacity="0.38" />
      <circle cx={CX} cy={CY} r={R * 0.65} fill="none" stroke="#22C55E" strokeWidth="0.8" opacity="0.26" />
      <circle cx={CX} cy={CY} r={R * 0.32} fill="none" stroke="#22C55E" strokeWidth="0.8" opacity="0.26" />

      <line x1={CX - R} y1={CY}     x2={CX + R} y2={CY}     stroke="#22C55E" strokeWidth="0.5" opacity="0.18" />
      <line x1={CX}     y1={CY - R} x2={CX}     y2={CY + R} stroke="#22C55E" strokeWidth="0.5" opacity="0.18" />

      <g clipPath="url(#radar-clip)">
        <path
          className="radar-logo__sweep"
          d={`M ${CX} ${CY} L ${CX + R} ${CY} A ${R} ${R} 0 0 0 ${CX} ${CY - R} Z`}
          fill="url(#radar-sweep-grad)"
        />
      </g>

      <circle className="radar-logo__blip radar-logo__blip--1" cx={CX + 26} cy={CY - 22} r="2.5" fill="#22C55E" />
      <circle className="radar-logo__blip radar-logo__blip--2" cx={CX - 22} cy={CY + 12} r="2.5" fill="#22C55E" />
      <circle className="radar-logo__blip radar-logo__blip--3" cx={CX + 18} cy={CY + 26} r="2.5" fill="#22C55E" />

      <circle className="radar-logo__center" cx={CX} cy={CY} r="2.2" fill="#22C55E" />
    </svg>
  );
}
