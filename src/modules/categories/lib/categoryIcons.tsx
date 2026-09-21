import React from "react";
import {
  Banknote,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Calculator,
  Camera,
  Car,
  ChartLine,
  Cloud,
  Code,
  Coins,
  Cpu,
  Database,
  Dumbbell,
  Film,
  FlaskConical,
  Globe,
  GraduationCap,
  Hammer,
  Handshake,
  Headphones,
  HeartPulse,
  Languages,
  Leaf,
  Lightbulb,
  Megaphone,
  Microscope,
  Music,
  Package,
  Paintbrush,
  Palette,
  PenTool,
  Pill,
  Plane,
  Presentation,
  Puzzle,
  Rocket,
  Shapes,
  Shield,
  ShoppingCart,
  Smartphone,
  Sprout,
  Star,
  Stethoscope,
  Target,
  Terminal,
  Truck,
  Users,
  Utensils,
  Wrench,
} from "lucide-react";

/**
 * Derived from a real component rather than lucide's own `LucideIcon` type —
 * that name is not part of the v1 public surface, and this cannot drift with
 * whatever the package exports next.
 */
type IconComponent = typeof Code;

/**
 * The client owns the icon set. `Category.icon` is free text on the API
 * *precisely so* it need not agree with any one library — storing lucide's
 * component name is the intended use, not a shortcut.
 *
 * Keys are persisted verbatim, so they are a contract: renaming one orphans
 * every category already saved under it. Add, don't rename. Insertion order is
 * the order the picker renders, hence the grouping.
 */
export const CATEGORY_ICONS = {
  // Technology
  code: Code,
  terminal: Terminal,
  cpu: Cpu,
  database: Database,
  cloud: Cloud,
  smartphone: Smartphone,
  shield: Shield,
  // Business
  briefcase: Briefcase,
  "building-2": Building2,
  "chart-line": ChartLine,
  megaphone: Megaphone,
  handshake: Handshake,
  coins: Coins,
  presentation: Presentation,
  calculator: Calculator,
  banknote: Banknote,
  // Education
  "graduation-cap": GraduationCap,
  "book-open": BookOpen,
  languages: Languages,
  lightbulb: Lightbulb,
  "pen-tool": PenTool,
  // Health
  stethoscope: Stethoscope,
  "heart-pulse": HeartPulse,
  pill: Pill,
  dumbbell: Dumbbell,
  brain: Brain,
  // Creative and media
  palette: Palette,
  paintbrush: Paintbrush,
  camera: Camera,
  film: Film,
  music: Music,
  headphones: Headphones,
  // Science and nature
  microscope: Microscope,
  "flask-conical": FlaskConical,
  leaf: Leaf,
  sprout: Sprout,
  globe: Globe,
  // Trades
  wrench: Wrench,
  hammer: Hammer,
  utensils: Utensils,
  // Transport
  truck: Truck,
  plane: Plane,
  car: Car,
  // General
  users: Users,
  target: Target,
  rocket: Rocket,
  package: Package,
  "shopping-cart": ShoppingCart,
  star: Star,
  puzzle: Puzzle,
  shapes: Shapes,
} as const satisfies Record<string, IconComponent>;

export type CategoryIconName = keyof typeof CATEGORY_ICONS;

/** Shown for a category that has no icon, and for any name we don't know. */
export const DEFAULT_CATEGORY_ICON: CategoryIconName = "shapes";

const humanize = (key: string) =>
  key
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/**
 * Picker options derived from the registry so the two cannot drift. The label
 * is the icon's accessible name and what the picker's search matches on.
 */
export const CATEGORY_ICON_OPTIONS: Array<{
  value: CategoryIconName;
  label: string;
}> = (Object.keys(CATEGORY_ICONS) as CategoryIconName[]).map((value) => ({
  value,
  label: humanize(value),
}));

/**
 * Resolves a stored value to a component. Anything unrecognised — including the
 * empty string on rows saved before an icon could be chosen — falls back, so a
 * stale or hand-edited value degrades to a default instead of blanking a cell.
 */
export const getCategoryIcon = (name?: string | null): IconComponent =>
  (name ? CATEGORY_ICONS[name as CategoryIconName] : undefined) ??
  CATEGORY_ICONS[DEFAULT_CATEGORY_ICON];

/**
 * `name` is omitted from the icon's own props: lucide declares it for the SVG
 * `name` attribute, and here it means the stored category icon key instead.
 */
interface CategoryIconProps
  extends Omit<React.ComponentProps<IconComponent>, "name"> {
  /** The stored `Category.icon` value. */
  name?: string | null;
}

export const CategoryIcon = ({ name, ...props }: CategoryIconProps) => {
  const Icon = getCategoryIcon(name);

  /*
    `Icon` is a member of the module-level CATEGORY_ICONS record, so its identity
    is stable across renders — nothing is created here. The rule cannot see
    through the lookup, but the remount it guards against needs an unstable
    reference, which a frozen module constant cannot produce.
  */
  // eslint-disable-next-line react-hooks/static-components
  return <Icon {...props} />;
};
