interface RadarLogoProps {
  size?: number;
  color?: string;
}

export function RadarLogo({ size = 40, color = 'currentColor' }: RadarLogoProps) {
  return (
    <svg
      className="radar-logo"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ color }}
      aria-hidden
    >
      <defs>
        <linearGradient id="radar-sweep-grad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.45" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <clipPath id="radar-clip">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>

      {/* Dial rings */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />

      {/* Crosshair */}
      <line x1="4" y1="50" x2="96" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="50" y1="4" x2="50" y2="96" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />

      {/* Rotating sweep beam (90deg arc) */}
      <g clipPath="url(#radar-clip)">
        <path
          className="radar-logo__sweep"
          d="M 50 50 L 98 50 A 48 48 0 0 0 76.97 9.20 Z"
          fill="url(#radar-sweep-grad)"
        />
      </g>

      {/* News blips — newspaper icons fading in as sweep passes */}
      <g className="radar-logo__blip radar-logo__blip--1" transform="translate(63, 22)">
        <Newspaper />
      </g>
      <g className="radar-logo__blip radar-logo__blip--2" transform="translate(20, 58)">
        <Newspaper />
      </g>
      <g className="radar-logo__blip radar-logo__blip--3" transform="translate(64, 66)">
        <Newspaper />
      </g>

      {/* Center pulse */}
      <circle className="radar-logo__center" cx="50" cy="50" r="2" fill="currentColor" />
    </svg>
  );
}

function Newspaper() {
  return (
    <g>
      <rect x="-7" y="-8" width="14" height="16" rx="1.2" fill="currentColor" />
      <rect x="-5" y="-6" width="10" height="3" fill="white" opacity="0.7" />
      <line x1="-5" y1="-1" x2="5" y2="-1" stroke="white" strokeWidth="0.7" opacity="0.7" />
      <line x1="-5" y1="2" x2="5" y2="2" stroke="white" strokeWidth="0.7" opacity="0.7" />
      <line x1="-5" y1="5" x2="2" y2="5" stroke="white" strokeWidth="0.7" opacity="0.7" />
    </g>
  );
}
