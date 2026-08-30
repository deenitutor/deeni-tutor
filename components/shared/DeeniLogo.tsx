'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: number | string;
}

/**
 * ============================================================================
 * 📌 GITHUB LOGO UPLOAD INSTRUCTIONS:
 * ----------------------------------------------------------------------------
 * To display your official logo on the live website:
 * 1. Upload your logo image file inside the `/public/` directory in your GitHub repo.
 * 2. Name the file: `logo.png` (Path: `public/logo.png`).
 * 3. Once uploaded to GitHub and deployed, the app will automatically fetch and
 *    display `/logo.png` in the header, footer, and authentication screens!
 * ============================================================================
 */
export function DeeniLogoIcon({ className = 'w-10 h-10', size }: LogoProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Deeni Tutor Logo"
    >
      {!imgError ? (
        /* 
          Loads /logo.png from the public/ directory.
          Add your file as public/logo.png on GitHub!
        */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt="Deeni Tutor Logo"
          className="w-full h-full object-contain rounded-lg transition-transform duration-200"
          onError={() => setImgError(true)}
        />
      ) : (
        /* 
          Placeholder slot displayed when /public/logo.png is not yet uploaded.
          Clean geometric frame reserved for your logo.
        */
        <div className="w-full h-full rounded-lg border-2 border-dashed border-[#D9A441]/60 bg-[#FAF9F5] flex items-center justify-center p-1 group-hover:border-[#16845B] transition-colors">
          <div className="w-2.5 h-2.5 bg-[#D9A441] rotate-45" />
        </div>
      )}
    </div>
  );
}

interface DeeniBrandProps {
  className?: string;
  logoClassName?: string;
  isDarkTheme?: boolean;
  showSubtitle?: boolean;
  textClassName?: string;
  subtitleClassName?: string;
}

export function DeeniBrand({
  className = 'flex items-center gap-2.5',
  logoClassName = 'w-10 h-10',
  isDarkTheme = false,
  showSubtitle = true,
  textClassName = 'text-xl font-bold tracking-tight',
  subtitleClassName = 'text-[10px] tracking-wider uppercase font-bold -mt-0.5',
}: DeeniBrandProps) {
  return (
    <div className={className}>
      {/* Logo container linked to public/logo.png */}
      <DeeniLogoIcon className={`${logoClassName} shrink-0 drop-shadow-xs`} />
      <div className="flex flex-col">
        <span
          className={`${textClassName} leading-none ${
            isDarkTheme ? 'text-white' : 'text-[#0F2A43]'
          }`}
        >
          DEENI <span className="text-[#D9A441]">TUTOR</span>
        </span>
        {showSubtitle && (
          <span
            className={`${subtitleClassName} ${
              isDarkTheme ? 'text-slate-300' : 'text-[#64748B]'
            }`}
          >
            Authentic Arabic &amp; Quran
          </span>
        )}
      </div>
    </div>
  );
}

export default DeeniBrand;
