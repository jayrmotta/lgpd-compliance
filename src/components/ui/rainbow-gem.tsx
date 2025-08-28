import React from 'react';

interface RainbowGemProps {
  className?: string;
  size?: number;
}

export function RainbowGem({ className = "", size = 24 }: RainbowGemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0000" />
          <stop offset="16.66%" stopColor="#ff8000" />
          <stop offset="33.33%" stopColor="#ffff00" />
          <stop offset="50%" stopColor="#00ff00" />
          <stop offset="66.66%" stopColor="#0080ff" />
          <stop offset="83.33%" stopColor="#8000ff" />
          <stop offset="100%" stopColor="#ff0080" />
        </linearGradient>
      </defs>
      <path d="M6 3h12l4 6-10 13L2 9Z" fill="url(#rainbow-gradient)" />
      <path d="M11 3 8 9l4 13 4-13-3-6" fill="url(#rainbow-gradient)" />
      <path d="M2 9h20" fill="url(#rainbow-gradient)" />
    </svg>
  );
}
