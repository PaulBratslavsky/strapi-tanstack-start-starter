import {
  Flame,
  Gem,
  Globe,
  Heart,
  Lightbulb,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const fallbackIcons: Array<LucideIcon> = [
  Sparkles,
  Zap,
  Globe,
  Rocket,
  Heart,
  Star,
  Shield,
  Target,
  Lightbulb,
  Trophy,
  Gem,
  Flame,
];

export function getFallbackIcon(index: number): LucideIcon {
  return fallbackIcons[index % fallbackIcons.length];
}

interface FallbackIconProps {
  index: number;
  className?: string;
}

export function FallbackIcon({ index, className = "w-full h-full text-black" }: FallbackIconProps) {
  const IconComponent = getFallbackIcon(index);
  return <IconComponent className={className} />;
}
