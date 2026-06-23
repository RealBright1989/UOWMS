import React from 'react';

interface UnicrossLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auto';
  theme?: 'dark' | 'light' | 'color';
}

export default function UnicrossLogo({ className = '', size = 'md', theme = 'color' }: UnicrossLogoProps) {
  // Define size dimensions with responsive support
  const dims = {
    sm: 'h-8 w-8',
    md: 'h-14 w-14',
    lg: 'h-20 w-20',
    xl: 'h-32 w-32',
    '2xl': 'h-48 w-48',
    auto: 'h-full w-full'
  }[size];

  // Configure colors based on light vs dark theme layouts
  const strokeColor = '#0284c7'; // Deep Sky Blue (University Primary Accent)
  const checkeredColor = '#0284c7';
  const fillColor = '#ffffff';
  
  // Outer text color logic
  const textColor = theme === 'dark' ? '#38bdf8' : '#0284c7'; 
  const ribbonColor = '#0284c7';
  const ribbonTextColor = '#ffffff';

  return (
    <svg 
      className={`${dims} ${className} transition-all duration-300`} 
      viewBox="0 0 240 270" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      id="unicross-vector-logo"
    >
      {/* Top Header Section: Double Line & UNICROSS text */}
      <line x1="15" y1="12" x2="225" y2="12" stroke={strokeColor} strokeWidth="3" id="top-bar-thick" />
      <line x1="15" y1="18" x2="225" y2="18" stroke={strokeColor} strokeWidth="1" id="top-bar-thin" />
      
      <text 
        x="120" 
        y="38" 
        textAnchor="middle" 
        fill={textColor} 
        fontSize="21" 
        fontWeight="bold" 
        fontFamily="Times New Roman, Georgia, serif" 
        letterSpacing="2"
        id="unicross-logo-text"
      >
        UNICROSS
      </text>
      
      <line x1="15" y1="46" x2="225" y2="46" stroke={strokeColor} strokeWidth="1" id="bottom-bar-thin" />
      <line x1="15" y1="51" x2="225" y2="51" stroke={strokeColor} strokeWidth="3" id="bottom-bar-thick" />

      {/* Main Shield Layout */}
      {/* Outer crisp border wrapper */}
      <path 
        d="M 32,60 L 208,60 L 208,120 C 208,180 164,212 120,230 C 76,212 32,180 32,120 Z" 
        fill={fillColor} 
        stroke={strokeColor} 
        strokeWidth="4.5" 
        strokeLinejoin="round"
        id="shield-outer"
      />
      
      {/* Inner fine nested shield line */}
      <path 
        d="M 40,67 L 200,67 L 200,120 C 200,172 160,203 120,221 C 80,203 40,172 40,120 Z" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeLinejoin="round"
        id="shield-inner"
      />

      {/* Checkerboard Pattern Grid inside Top of Shield */}
      {/* 8 Columns of white-blue checkers spanning x=40 to x=200 */}
      <g id="checkerboard-pattern">
        {/* Row 1 Alternating Checkered blocks */}
        <rect x="42" y="70" width="19.5" height="11" fill={checkeredColor} />
        <rect x="81" y="70" width="19.5" height="11" fill={checkeredColor} />
        <rect x="120" y="70" width="19.5" height="11" fill={checkeredColor} />
        <rect x="159" y="70" width="19.5" height="11" fill={checkeredColor} />
        
        {/* Row 2 Alternating Checkered blocks (Offset) */}
        <rect x="61.5" y="81" width="19.5" height="11" fill={checkeredColor} />
        <rect x="100.5" y="81" width="19.5" height="11" fill={checkeredColor} />
        <rect x="139.5" y="81" width="19.5" height="11" fill={checkeredColor} />
        <rect x="178.5" y="81" width="19.5" height="11" fill={checkeredColor} />
      </g>

      {/* Grid Border Division Lines */}
      <line x1="40" y1="92.5" x2="200" y2="92.5" stroke={strokeColor} strokeWidth="1.5" />
      <line x1="40" y1="95.5" x2="200" y2="95.5" stroke={strokeColor} strokeWidth="1" />

      {/* Golden Flame of Light / Wisdom Bulb */}
      <g id="flame-of-wisdom">
        {/* Outer glowing rays */}
        <line x1="120" y1="100" x2="120" y2="103" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="110" y1="110" x2="113" y2="113" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="130" y1="110" x2="127" y2="113" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="106" y1="120" x2="109" y2="120" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="134" y1="120" x2="131" y2="120" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Small bulb orb container */}
        <circle cx="120" cy="118" r="9" stroke={strokeColor} strokeWidth="1.5" fill="none" />
        <path d="M 116,124 L 124,124 M 117,126 L 123,126" stroke={strokeColor} strokeWidth="1.5" />

        {/* Dynamic bright central core flame */}
        <path 
          d="M 120,111 C 117,116 117,120 120,123 C 123,120 123,116 120,111 Z" 
          fill="#f59e0b" 
          stroke="#d97706" 
          strokeWidth="0.75"
        />
      </g>

      {/* Academic Open Book of Learning */}
      <g id="academic-book">
        {/* Core pages block shape */}
        <path 
          d="M 120,154 C 111,143 92,143 72,147 L 72,165 C 92,161 111,161 120,172 C 129,161 148,161 168,165 L 168,147 C 148,143 129,143 120,154 Z" 
          fill="#ffffff" 
          stroke={strokeColor} 
          strokeWidth="2.2" 
          strokeLinejoin="round" 
        />
        {/* Central book spine node */}
        <line x1="120" y1="154" x2="120" y2="172" stroke={strokeColor} strokeWidth="2.5" />
        
        {/* Horizontal text-line abstractions for realistic book layout */}
        <line x1="80" y1="152.5" x2="110" y2="151" stroke={strokeColor} strokeWidth="0.8" opacity="0.6"/>
        <line x1="80" y1="156.5" x2="110" y2="155" stroke={strokeColor} strokeWidth="0.8" opacity="0.6"/>
        <line x1="80" y1="160.5" x2="110" y2="159" stroke={strokeColor} strokeWidth="0.8" opacity="0.6"/>
        <line x1="130" y1="151" x2="160" y2="152.5" stroke={strokeColor} strokeWidth="0.8" opacity="0.6"/>
        <line x1="130" y1="155" x2="160" y2="156.5" stroke={strokeColor} strokeWidth="0.8" opacity="0.6"/>
        <line x1="130" y1="159" x2="160" y2="160.5" stroke={strokeColor} strokeWidth="0.8" opacity="0.6"/>
      </g>

      {/* Beautiful undulating wave at shield base */}
      <path 
        d="M 72,185 Q 96,174 120,185 T 168,185" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        id="river-ripple"
      />

      {/* Flowing Ribbon System at the bottom of the Shield */}
      <g id="ribbon-assembly">
        {/* Shadow overlap hooks to simulate 3D scrolling banner back fold */}
        <path d="M 52,228 L 62,238 L 62,228 Z" fill="#015a87" />
        <path d="M 188,228 L 178,238 L 178,228 Z" fill="#015a87" />

        {/* Center Banner Plate */}
        <path 
          d="M 48,228 C 88,239 152,239 192,228 L 186,248 C 146,259 94,259 54,248 Z" 
          fill={ribbonColor} 
          stroke={strokeColor} 
          strokeWidth="1.5" 
          strokeLinejoin="round"
        />

        {/* Left Ribbon scroll wing */}
        <path 
          d="M 6,218 C 23,211 41,219 51,228 L 46,244 C 36,235 13,229 6,218 Z" 
          fill={ribbonColor} 
          stroke={strokeColor} 
          strokeWidth="1.5" 
          strokeLinejoin="round"
        />

        {/* Right Ribbon scroll wing */}
        <path 
          d="M 234,218 C 217,211 199,219 189,228 L 194,244 C 204,235 227,229 234,218 Z" 
          fill={ribbonColor} 
          stroke={strokeColor} 
          strokeWidth="1.5" 
          strokeLinejoin="round"
        />

        {/* Official Motto Text Labels within ribbon scroll segments */}
        {/* Left segment */}
        <text 
          x="27" 
          y="228" 
          textAnchor="middle" 
          fill={ribbonTextColor} 
          fontSize="5.5" 
          fontWeight="bold" 
          fontFamily="Inter, sans-serif, system-ui"
          transform="rotate(-11, 27, 228)"
        >
          KNOWLEDGE
        </text>

        {/* Right segment */}
        <text 
          x="213" 
          y="228" 
          textAnchor="middle" 
          fill={ribbonTextColor} 
          fontSize="5" 
          fontWeight="bold" 
          fontFamily="Inter, sans-serif, system-ui"
          transform="rotate(11, 213, 228)"
        >
          ADVANCEMENT
        </text>

        {/* Center ribbon focal block */}
        <text 
          x="120" 
          y="243.5" 
          textAnchor="middle" 
          fill={ribbonTextColor} 
          fontSize="7" 
          fontWeight="900" 
          fontFamily="Inter, sans-serif, system-ui"
          letterSpacing="0.25"
        >
          FOR HUMAN
        </text>
      </g>
    </svg>
  );
}
