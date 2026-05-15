'use client';

interface LogoProps {
  size?: number;
  className?: string;
}

export function CobwebLogo({ size = 48, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Web strands radiating from center */}
      <line x1="50" y1="50" x2="50" y2="5" stroke="#7B5EA7" strokeWidth="0.8" strokeOpacity="0.8" />
      <line x1="50" y1="50" x2="88" y2="17" stroke="#7B5EA7" strokeWidth="0.8" strokeOpacity="0.7" />
      <line x1="50" y1="50" x2="95" y2="50" stroke="#7B5EA7" strokeWidth="0.8" strokeOpacity="0.8" />
      <line x1="50" y1="50" x2="88" y2="83" stroke="#7B5EA7" strokeWidth="0.8" strokeOpacity="0.7" />
      <line x1="50" y1="50" x2="50" y2="95" stroke="#7B5EA7" strokeWidth="0.8" strokeOpacity="0.8" />
      <line x1="50" y1="50" x2="12" y2="83" stroke="#7B5EA7" strokeWidth="0.8" strokeOpacity="0.7" />
      <line x1="50" y1="50" x2="5" y2="50" stroke="#7B5EA7" strokeWidth="0.8" strokeOpacity="0.8" />
      <line x1="50" y1="50" x2="12" y2="17" stroke="#7B5EA7" strokeWidth="0.8" strokeOpacity="0.7" />

      {/* Concentric web rings */}
      {/* Ring 1 - inner */}
      <polygon
        points="50,22 68,33 68,55 50,67 32,55 32,33"
        stroke="#C9A84C"
        strokeWidth="0.7"
        strokeOpacity="0.6"
        fill="none"
      />
      {/* Ring 2 - middle */}
      <polygon
        points="50,10 76,24 76,56 50,70 24,56 24,24"
        stroke="#7B5EA7"
        strokeWidth="0.6"
        strokeOpacity="0.5"
        fill="none"
      />
      {/* Ring 3 - outer */}
      <circle
        cx="50"
        cy="50"
        r="43"
        stroke="#7B5EA7"
        strokeWidth="0.5"
        strokeOpacity="0.3"
        fill="none"
        strokeDasharray="3 4"
      />

      {/* Center diamond */}
      <circle cx="50" cy="50" r="5" fill="#C9A84C" opacity="0.9" />
      <circle cx="50" cy="50" r="2.5" fill="#E8DCC8" />

      {/* Dewdrop accents on web */}
      <circle cx="50" cy="22" r="1.5" fill="#C9A84C" opacity="0.7" />
      <circle cx="68" cy="33" r="1.2" fill="#7B5EA7" opacity="0.8" />
      <circle cx="68" cy="55" r="1.2" fill="#7B5EA7" opacity="0.8" />
      <circle cx="50" cy="67" r="1.5" fill="#C9A84C" opacity="0.7" />
      <circle cx="32" cy="55" r="1.2" fill="#7B5EA7" opacity="0.8" />
      <circle cx="32" cy="33" r="1.2" fill="#7B5EA7" opacity="0.8" />
    </svg>
  );
}
