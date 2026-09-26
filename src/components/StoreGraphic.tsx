import React, { useState } from 'react';

// Using generated 3D store image with a high-fidelity SVG fallback
const GENERATED_IMAGE_URL = '/src/assets/images/store_3d_icon_1790399597582.jpg';

interface StoreGraphicProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StoreGraphic: React.FC<StoreGraphicProps> = ({
  className = '',
  size = 'md',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20 md:w-24 md:h-24',
    lg: 'w-28 h-28 md:w-32 md:h-32',
  }[size];

  if (!hasError) {
    return (
      <div className={`relative ${sizeClasses} ${className} flex-shrink-0 select-none pointer-events-none drop-shadow-md`}>
        <img
          src={GENERATED_IMAGE_URL}
          alt="متجر الأمل التجاري"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-contain rounded-2xl transform hover:scale-105 transition-transform duration-300"
        />
      </div>
    );
  }

  // High-fidelity handcrafted 3D store SVG fallback
  return (
    <div className={`relative ${sizeClasses} ${className} flex-shrink-0 select-none drop-shadow-lg`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
          <filter id="storeShadow" x="-10%" y="-10%" width="130%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.25" floodColor="#0f172a" />
          </filter>
        </defs>

        {/* Base Platform */}
        <ellipse cx="60" cy="100" rx="46" ry="12" fill="#cbd5e1" opacity="0.6" filter="url(#storeShadow)" />
        <rect x="22" y="92" width="76" height="10" rx="4" fill="#94a3b8" />
        <rect x="20" y="90" width="80" height="5" rx="2.5" fill="#e2e8f0" />

        {/* Building walls */}
        <rect x="28" y="48" width="64" height="44" rx="3" fill="url(#wallGrad)" />

        {/* Shop Window */}
        <rect x="34" y="58" width="24" height="24" rx="2" fill="url(#glassGrad)" stroke="#0284c7" strokeWidth="1.5" />
        <line x1="46" y1="58" x2="46" y2="82" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
        <line x1="34" y1="70" x2="58" y2="70" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />

        {/* Wooden Door */}
        <rect x="66" y="58" width="20" height="34" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
        <rect x="70" y="62" width="12" height="12" rx="1" fill="#fef3c7" opacity="0.9" />
        <circle cx="82" cy="76" r="1.5" fill="#fef08a" />

        {/* Flower planters */}
        <rect x="33" y="83" width="26" height="6" rx="2" fill="#d97706" />
        <circle cx="38" cy="81" r="3" fill="#22c55e" />
        <circle cx="44" cy="80" r="3.5" fill="#16a34a" />
        <circle cx="50" cy="81" r="3" fill="#ef4444" />
        <circle cx="54" cy="80.5" r="3" fill="#22c55e" />

        {/* Awning (Striped Red & White) */}
        <path
          d="M20 46 L100 46 L95 34 L25 34 Z"
          fill="url(#roofGrad)"
        />
        {/* Awning stripes */}
        <path d="M20 46 L30 46 L33 34 L25 34 Z" fill="#ffffff" />
        <path d="M40 46 L50 46 L49 34 L41 34 Z" fill="#ffffff" />
        <path d="M60 46 L70 46 L65 34 L57 34 Z" fill="#ffffff" />
        <path d="M80 46 L90 46 L81 34 L73 34 Z" fill="#ffffff" />

        {/* Awning scallops */}
        <path d="M20 46 Q25 50 30 46 Q35 50 40 46 Q45 50 50 46 Q55 50 60 46 Q65 50 70 46 Q75 50 80 46 Q85 50 90 46 Q95 50 100 46 L100 48 Q95 52 90 48 Q85 52 80 48 Q75 52 70 48 Q65 52 60 48 Q55 52 50 48 Q45 52 40 48 Q35 52 30 48 Q25 52 20 48 Z" fill="#dc2626" />

        {/* Roof sign */}
        <rect x="42" y="24" width="36" height="10" rx="3" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
        <rect x="46" y="28" width="28" height="2" rx="1" fill="#f59e0b" />
      </svg>
    </div>
  );
};
