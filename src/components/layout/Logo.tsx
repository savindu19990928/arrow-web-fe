import React from 'react';

const LOGO_SRC = "/Arrow_Ventures_Logo.png";

interface LogoProps {
  inverted?: boolean;
  compact?: boolean;
  className?: string;
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
        
        Arrow<span className="hidden sm:inline"> Ventures</span>
      </span>
    </span>);

}