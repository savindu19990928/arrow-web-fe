import type { Specification } from '../types/api';

export type HighlightIcon = 'range' | 'speed' | 'battery' | 'warranty' | 'motor' | 'charge' | 'weight' | 'frame' | 'brake' | 'wheel' | 'general';

export interface Highlight {
  icon: HighlightIcon;
  label: string;
}

const maxNumber = (value: string) => {
  const nums = value.match(/\d+(\.\d+)?/g);
  return nums ? nums[nums.length - 1] : null;
};

export function specIcon(key: string): HighlightIcon {
  const k = key.toLowerCase();
  if (/range/.test(k)) return 'range';
  if (/speed/.test(k)) return 'speed';
  if (/battery|capacity|voltage/.test(k)) return 'battery';
  if (/motor|power|torque/.test(k)) return 'motor';
  if (/charg/.test(k)) return 'charge';
  if (/weight|load/.test(k)) return 'weight';
  if (/frame/.test(k)) return 'frame';
  if (/brake|rotor/.test(k)) return 'brake';
  if (/wheel|tyre|tire/.test(k)) return 'wheel';
  return 'general';
}

/** The four quick facts shown under the price. */
export function buildHighlights(specs: Specification[], warranty: string): Highlight[] {
  const find = (re: RegExp) => specs.find((s) => re.test(s.key.toLowerCase()));
  const out: Highlight[] = [];
  const range = find(/range/);
  if (range) out.push({ icon: 'range', label: `Up to ${maxNumber(range.value) ?? ''} km Range` });
  const speed = find(/speed/);
  if (speed) out.push({ icon: 'speed', label: `Max Speed ${speed.value}` });
  const battery = find(/battery|capacity/);
  if (battery) out.push({ icon: 'battery', label: 'Long Life Battery' });
  if (out.length < 3) {
    specs.
    filter((s) => ![range, speed, battery].includes(s)).
    slice(0, 3 - out.length).
    forEach((s) => out.push({ icon: specIcon(s.key), label: `${s.key} ${s.value}` }));
  }
  const years = warranty.match(/(\d+)\s*(year|month)/i);
  out.push({ icon: 'warranty', label: years ? `${years[1]} ${years[2][0].toUpperCase()}${years[2].slice(1).toLowerCase()} Warranty` : 'Warranty Included' });
  return out.slice(0, 4);
}

/** Short benefit lines for the overview checklist. */
export function buildFeatureLines(specs: Specification[]): string[] {
  return specs.slice(0, 4).map((s) => {
    const k = s.key.toLowerCase();
    if (/motor|power/.test(k)) return `Powerful ${s.value.split(/[\s,/]/)[0]} Motor`;
    if (/range/.test(k)) return `Up to ${maxNumber(s.value)} km Range`;
    if (/speed/.test(k)) return `Top Speed of ${s.value}`;
    if (/battery/.test(k)) return `${s.value.split(' ').slice(0, 2).join(' ')} Battery`;
    if (/charg/.test(k)) return `${s.value} Charging`;
    return `${s.value} ${s.key}`;
  });
}