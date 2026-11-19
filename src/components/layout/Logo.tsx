import React from 'react';

export const LOGO_SRC = "/Arrow_Ventures_Logo.png";

interface LogoProps {
  inverted?: boolean;
  compact?: boolean;
  className?: string;
}

/** Tenways-style letter-spaced wordmark with the brand symbol on its left. */
export function Wordmark({ inverted = false, className = '' }: {inverted?: boolean;className?: string;}) {
  return (
    <span
      aria-label="Arrow Ventures"
      className={`inline-flex items-center gap-2.5 whitespace-nowrap text-[17px] font-semibold leading-none tracking-[-0.015em] md:text-[19px] ${inverted ? 'text-white' : 'text-ink'} ${className}`}>
      
      <LogoMark inverted={inverted} className="h-[1.5em] w-[1.5em] shrink-0" />
      <span aria-hidden="true" className="flex items-center gap-[0.28em] pb-[0.06em]">
        <span>Arrow</span>
        <span className="font-light opacity-80">Ventures</span>
      </span>
    </span>);

}

export function LogoMark({ className = 'h-10 w-10', inverted = false }: {className?: string;inverted?: boolean;}) {
  return (
    <img
      src={LOGO_SRC}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`${className} object-contain ${inverted ? 'invert mix-blend-screen' : 'mix-blend-multiply'}`} />);


}

export function Logo({ inverted = false, compact = false, className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="Arrow Ventures">
      <LogoMark inverted={inverted} className={compact ? 'h-7 w-7' : 'h-8 w-8 md:h-9 md:w-9'} />
      <span
        aria-hidden="true"
        className={`whitespace-nowrap font-extrabold uppercase tracking-[0.28em] ${inverted ? 'text-white' : 'text-ink'} ${
        compact ? 'text-[13px]' : 'text-[13px] md:text-[15px]'}`
        }>
        
        Arrow Ventures
      </span>
    </span>);

}