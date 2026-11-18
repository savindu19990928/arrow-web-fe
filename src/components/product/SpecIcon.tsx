import React from 'react';
import { BatteryMediumIcon, BikeIcon, CircleDotIcon, CogIcon, GaugeIcon, PlugZapIcon, Settings2Icon, ShieldCheckIcon, WeightIcon, ZapIcon, DiscIcon, BoxIcon } from 'lucide-react';
import type { HighlightIcon } from '../../utils/productHighlights';

const map: Record<HighlightIcon, BoxIcon> = {
  range: ZapIcon,
  speed: GaugeIcon,
  battery: BatteryMediumIcon,
  warranty: ShieldCheckIcon,
  motor: CogIcon,
  charge: PlugZapIcon,
  weight: WeightIcon,
  frame: BikeIcon,
  brake: DiscIcon,
  wheel: CircleDotIcon,
  general: Settings2Icon
};

export function SpecIcon({ icon, className = 'h-5 w-5' }: {icon: HighlightIcon;className?: string;}) {
  const Icon = map[icon];
  return <Icon className={className} strokeWidth={1.9} aria-hidden="true" />;
}