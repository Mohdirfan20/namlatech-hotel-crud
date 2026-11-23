import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NamlaTechLogo - Premium, custom-crafted brand logo for NamlaTech / Namlatic Hotels.
 * Features a distinct architectural geometric 'N' emblem with skyscraper silhouette,
 * rooftop hospitality spire star, and pure Black, Red, and White palette.
 */
export const NamlaTechEmblem = ({ className = 'w-10 h-10' }) => (
  <svg
    viewBox="0 0 120 120"
    className={`${className} flex-shrink-0 drop-shadow-md transition-transform duration-200 group-hover:scale-105`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="NamlaTech Emblem"
  >
    <defs>
      <linearGradient id="namlaRedPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="60%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <linearGradient id="namlaRedAccent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
      <linearGradient id="namlaDarkBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#18181B" />
        <stop offset="100%" stopColor="#09090B" />
      </linearGradient>
      <filter id="namlaGlowEffect" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#DC2626" floodOpacity="0.35" />
      </filter>
    </defs>

    {/* Black Shield / Squircle Container with Red Accent Stroke */}
    <rect
      x="6"
      y="6"
      width="108"
      height="108"
      rx="26"
      fill="url(#namlaDarkBg)"
      stroke="#DC2626"
      strokeWidth="2.5"
    />

    {/* Subtle Luxury Architectural Baseline */}
    <line x1="24" y1="92" x2="96" y2="92" stroke="#DC2626" strokeWidth="2" strokeDasharray="3 3" opacity="0.5" />

    {/* Left Skyscraper Tower (Part 1 of the 'N') */}
    <path
      d="M30 90 L30 38 L48 24 L48 90 Z"
      fill="url(#namlaRedPrimary)"
      filter="url(#namlaGlowEffect)"
    />

    {/* Left Tower Luxury Suite Windows in Crisp Pure White */}
    <rect x="35" y="42" width="4" height="6" rx="1" fill="#FFFFFF" opacity="0.95" />
    <rect x="35" y="54" width="4" height="6" rx="1" fill="#FFFFFF" opacity="0.95" />
    <rect x="35" y="66" width="4" height="6" rx="1" fill="#FFFFFF" opacity="0.95" />
    <rect x="35" y="78" width="4" height="6" rx="1" fill="#FFFFFF" opacity="0.95" />

    {/* Central Dynamic Skybridge (Diagonal Connector of 'N') */}
    <path
      d="M48 38 L72 74 L72 90 L48 54 Z"
      fill="#7F1D1D"
    />
    <path
      d="M48 24 L72 60 L72 74 L48 38 Z"
      fill="url(#namlaRedAccent)"
    />

    {/* Right Tower Spire (Part 2 of 'N') */}
    <path
      d="M72 90 L72 20 L90 32 L90 90 Z"
      fill="url(#namlaRedPrimary)"
    />

    {/* Right Tower Suite Windows */}
    <rect x="81" y="38" width="4" height="6" rx="1" fill="#FFFFFF" opacity="0.95" />
    <rect x="81" y="50" width="4" height="6" rx="1" fill="#FFFFFF" opacity="0.95" />
    <rect x="81" y="62" width="4" height="6" rx="1" fill="#FFFFFF" opacity="0.95" />
    <rect x="81" y="74" width="4" height="6" rx="1" fill="#FFFFFF" opacity="0.95" />

    {/* Rooftop Hospitality Compass Star in White & Red */}
    <path
      d="M81 10 L83.5 16.5 L90 19 L83.5 21.5 L81 28 L78.5 21.5 L72 19 L78.5 16.5 Z"
      fill="#FFFFFF"
    />
    <circle cx="81" cy="19" r="2" fill="#DC2626" />
  </svg>
);

const NamlaTechLogo = ({
  inverted = false,
  size = 'md',
  showTagline = true,
  linkTo = '/'
}) => {
  const emblemSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-12 h-12 sm:w-14 sm:h-14'
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl'
  };

  const content = (
    <div className="flex items-center space-x-3 group select-none">
      {/* Brand Emblem Icon */}
      <NamlaTechEmblem className={emblemSizes[size]} />

      {/* Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center">
          <span className={`font-black tracking-tight leading-none ${titleSizes[size]}`}>
            <span className="text-red-600">NAMLA</span>
            <span className={inverted ? 'text-white' : 'text-black'}>TECH</span>
          </span>
          <span className="ml-2 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-red-600 text-white rounded shadow-xs">
            Hotels
          </span>
        </div>

        {showTagline && (
          <p className={`text-[10px] tracking-wider uppercase font-semibold mt-1 transition ${
            inverted ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-500 group-hover:text-zinc-800'
          }`}>
            Global Hospitality Network
          </p>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};

export default NamlaTechLogo;
