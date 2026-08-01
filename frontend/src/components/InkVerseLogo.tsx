import React from 'react';

interface InkVerseLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const InkVerseLogo: React.FC<InkVerseLogoProps> = ({ size = 'md', className = '' }) => {
  const dimensions = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div
      className={`${dimensions} rounded-xl bg-gradient-to-tr from-brand-800 via-brand-700 to-brand-600 flex items-center justify-center text-white shadow-brand-glow shrink-0 group-hover:scale-105 transition-transform duration-300 ${className}`}
    >
      {/* Modern minimal fountain pen nib icon */}
      <svg
        className={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L19 9L15 21L12 18L9 21L5 9L12 2Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M12 2L19 9L15 21L12 18L9 21L5 9L12 2Z" />
        <circle cx="12" cy="9" r="1.5" fill="currentColor" />
        <path d="M12 10.5V18" />
      </svg>
    </div>
  );
};
