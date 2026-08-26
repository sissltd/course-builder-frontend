/**
 * Grid cards are filled with a colour derived from the course category, so a
 * scan of the board reads as "which kinds of courses are queued up".
 *
 * Every class string here is written out in full rather than composed at
 * runtime — Tailwind only generates the utilities it can see literally in the
 * source, so `bg-[${hex}]` would silently produce no CSS.
 */
export interface CategoryPalette {
  /** Card fill + border. */
  card: string;
  /** Heading text, darkest step of the hue. */
  title: string;
  /** Supporting text on top of the fill. */
  body: string;
  /** Small pill sitting on the fill (status, badges). */
  chip: string;
  /** Internal rule between the card body and its footer. */
  divider: string;
  /** Focus/selected ring. */
  ring: string;
  /** Solid swatch for the category dot. */
  dot: string;
}

const PALETTES: Record<string, CategoryPalette> = {
  blue: {
    card: "bg-[#EAF3FF] border-[#C3DCFF]",
    title: "text-[#0B2E5C]",
    body: "text-[#3F6795]",
    chip: "bg-white/70 text-[#0B4EA2]",
    divider: "border-[#CFE2FF]",
    ring: "ring-[#0063EF]",
    dot: "bg-[#0063EF]",
  },
  purple: {
    card: "bg-[#F5E9FF] border-[#E3C8FB]",
    title: "text-[#3F1263]",
    body: "text-[#70479B]",
    chip: "bg-white/70 text-[#6A1FA8]",
    divider: "border-[#E8D3FB]",
    ring: "ring-[#B423FF]",
    dot: "bg-[#B423FF]",
  },
  amber: {
    card: "bg-[#FDF2DC] border-[#F2DDAE]",
    title: "text-[#5A3B05]",
    body: "text-[#8A6620]",
    chip: "bg-white/70 text-[#8A5B0B]",
    divider: "border-[#F5E4C2]",
    ring: "ring-[#B77815]",
    dot: "bg-[#E09B1B]",
  },
  green: {
    card: "bg-[#E7F6EA] border-[#BFE3C7]",
    title: "text-[#0F3D1B]",
    body: "text-[#3C7E44]",
    chip: "bg-white/70 text-[#1F6B31]",
    divider: "border-[#CCE9D3]",
    ring: "ring-[#008500]",
    dot: "bg-[#00A344]",
  },
  coral: {
    card: "bg-[#FDEBE5] border-[#F7C9B9]",
    title: "text-[#5C1D08]",
    body: "text-[#96482C]",
    chip: "bg-white/70 text-[#A63A12]",
    divider: "border-[#F8D6C8]",
    ring: "ring-[#FF5025]",
    dot: "bg-[#FF5025]",
  },
  teal: {
    card: "bg-[#E4F5F3] border-[#B7E0DB]",
    title: "text-[#0C3B37]",
    body: "text-[#33776F]",
    chip: "bg-white/70 text-[#0F6B62]",
    divider: "border-[#C8E7E3]",
    ring: "ring-[#14B8A6]",
    dot: "bg-[#14B8A6]",
  },
  pink: {
    card: "bg-[#FCE9F1] border-[#F5C4D8]",
    title: "text-[#571233]",
    body: "text-[#94476B]",
    chip: "bg-white/70 text-[#A31F5C]",
    divider: "border-[#F7D4E2]",
    ring: "ring-[#DB2777]",
    dot: "bg-[#DB2777]",
  },
  slate: {
    card: "bg-[#F2F3F5] border-[#DDDFE3]",
    title: "text-[#1F2430]",
    body: "text-[#5C6472]",
    chip: "bg-white/80 text-[#3A414F]",
    divider: "border-[#E4E6EA]",
    ring: "ring-[#606060]",
    dot: "bg-[#606060]",
  },
};

const PALETTE_ORDER = Object.keys(PALETTES);

/**
 * Categories we already know about get a deliberate hue. Anything else falls
 * back to a stable hash so a newly added category still renders consistently.
 */
const CATEGORY_PALETTE: Record<string, keyof typeof PALETTES> = {
  "Software Engineering": "blue",
  "Artificial Intelligence": "purple",
  Leadership: "amber",
  Finance: "green",
  Robotics: "coral",
  "Product Design": "pink",
  "Data Analysis": "teal",
  "Cyber Security": "coral",
  "Mobile Development": "green",
  "Cloud Computing": "blue",
  "Business Strategy": "amber",
  "UI Animation": "purple",
  DevOps: "slate",
  "Content Marketing": "pink",
};

export const paletteForCategory = (category: string): CategoryPalette => {
  const named = CATEGORY_PALETTE[category];
  if (named) return PALETTES[named];

  const sum = category.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return PALETTES[PALETTE_ORDER[sum % PALETTE_ORDER.length]];
};

/** Category swatches for the legend above the grid. */
export const categoryLegend = (categories: string[]) =>
  Array.from(new Set(categories)).map((category) => ({
    category,
    palette: paletteForCategory(category),
  }));
