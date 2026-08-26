import { subDays, subHours, formatISO } from "date-fns";

export type RecommendationSource =
  | { kind: "ai" }
  | { kind: "curator"; name: string; initials: string; email: string };

export type RecommendationStatus = "pending" | "approved" | "rejected";

export interface MieRecommendation {
  id: string;
  topic: string;
  category: string;
  difficultyLevel: string;
  /** null for curator proposals MIE has not enriched with demand data yet */
  demandScore: number | null;
  searchesPerMonth: string | null;
  source: RecommendationSource;
  /** ISO timestamp — drives the "who got here first" ordering */
  submittedAt: string;
  status: RecommendationStatus;
  /** Assigned by the backend when it has already clustered a clash */
  duplicateGroupId?: string;
  description?: string;
  rejectedReason?: string;
}

/** Avatar colour rotation, matching the pattern used in TeamsView. */
export const curatorColors = [
  "#0A60E1",
  "#FF8A00",
  "#00C48C",
  "#FF3D57",
  "#7C3AED",
  "#14B8A6",
  "#8B5CF6",
  "#F59E0B",
];

export const colorForCurator = (name: string) => {
  const sum = name.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return curatorColors[sum % curatorColors.length];
};

const curator = (name: string, email: string): RecommendationSource => ({
  kind: "curator",
  name,
  initials: name.charAt(0).toUpperCase(),
  email,
});

const ai: RecommendationSource = { kind: "ai" };

/**
 * Timestamps are generated relative to module load so the relative labels
 * ("4 days ago") stay meaningful without having to re-seed the fixture.
 */
const daysAgo = (days: number) => formatISO(subDays(new Date(), days));
const hoursAgo = (hours: number) => formatISO(subHours(new Date(), hours));

export const mieRecommendations: MieRecommendation[] = [
  {
    id: "1",
    topic: "Introduction to Software design",
    category: "Software Engineering",
    difficultyLevel: "Advanced",
    demandScore: 69,
    searchesPerMonth: "52k",
    source: ai,
    submittedAt: daysAgo(2),
    status: "pending",
    description:
      "Discover the principles, methods, and practices that guide the design, development, and maintenance of software systems. Learn how engineering approaches bring structure, efficiency, and reliability to building modern applications.",
  },

  // ── 3-way clash: two curators + the AI engine, differing category & level ──
  {
    id: "2",
    topic: "Advanced Python Programming",
    category: "Software Development",
    difficultyLevel: "Advanced",
    demandScore: 88,
    searchesPerMonth: "123k",
    source: curator("Michael Chen", "michael.c@example.com"),
    submittedAt: daysAgo(4),
    status: "pending",
    duplicateGroupId: "dup-python",
    description:
      "A deep dive into Python beyond the basics — decorators, generators, async I/O, metaclasses and the patterns that production codebases actually rely on.",
  },
  {
    id: "3",
    topic: "Advanced Python Programming (Deep Dive)",
    category: "Software Development",
    difficultyLevel: "Advanced",
    demandScore: null,
    searchesPerMonth: null,
    source: curator("Emily Davis", "emily.d@example.com"),
    submittedAt: daysAgo(2),
    status: "pending",
    duplicateGroupId: "dup-python",
    description:
      "Covers advanced Python with a stronger emphasis on performance profiling and the C extension boundary.",
  },
  {
    id: "4",
    topic: "Python Programming Advanced Concepts",
    category: "Computer Science",
    difficultyLevel: "Intermediate",
    demandScore: 91,
    searchesPerMonth: "141k",
    source: ai,
    submittedAt: hoursAgo(6),
    status: "pending",
    duplicateGroupId: "dup-python",
    description:
      "Surfaced from search-demand signals: sustained high-intent traffic against advanced Python concepts with thin supply on the platform.",
  },

  {
    id: "5",
    topic: "Data Structures & Algorithms",
    category: "Computer Science",
    difficultyLevel: "Intermediate",
    demandScore: 85,
    searchesPerMonth: "112k",
    source: ai,
    submittedAt: daysAgo(6),
    status: "pending",
  },

  // ── 2-way clash: two curators, near-identical wording ──
  {
    id: "6",
    topic: "Cloud Architecture Fundamentals",
    category: "Cloud Computing",
    difficultyLevel: "Intermediate",
    demandScore: 78,
    searchesPerMonth: "98k",
    source: curator("James Wilson", "james.w@example.com"),
    submittedAt: daysAgo(5),
    status: "pending",
    duplicateGroupId: "dup-cloud",
    description:
      "Foundational cloud architecture: regions, availability zones, the shared responsibility model, and how to reason about cost from day one.",
  },
  {
    id: "7",
    topic: "Fundamentals of Cloud Architecture",
    category: "Cloud Computing",
    difficultyLevel: "Beginner",
    demandScore: null,
    searchesPerMonth: null,
    source: curator("Anna Martinez", "anna.m@example.com"),
    submittedAt: daysAgo(1),
    status: "pending",
    duplicateGroupId: "dup-cloud",
    description:
      "Same ground pitched at a true beginner — no prior infrastructure experience assumed.",
  },

  {
    id: "8",
    topic: "Cybersecurity Best Practices",
    category: "Cybersecurity",
    difficultyLevel: "Beginner",
    demandScore: 95,
    searchesPerMonth: "187k",
    source: curator("Sarah Johnson", "sarah.j@example.com"),
    submittedAt: daysAgo(1),
    status: "pending",
    description:
      "Practical security hygiene for working engineers: secrets handling, dependency risk, least privilege, and incident basics.",
  },
  {
    id: "9",
    topic: "Database Design & Management",
    category: "Information Technology",
    difficultyLevel: "Intermediate",
    demandScore: 72,
    searchesPerMonth: "84k",
    source: ai,
    submittedAt: daysAgo(8),
    status: "pending",
  },

  // ── 2-way clash: curator vs AI engine ──
  {
    id: "10",
    topic: "UI/UX Design Principles",
    category: "Design",
    difficultyLevel: "Beginner",
    demandScore: null,
    searchesPerMonth: null,
    source: curator("Lisa Anderson", "lisa.a@example.com"),
    submittedAt: daysAgo(3),
    status: "pending",
    duplicateGroupId: "dup-uiux",
    description:
      "Hierarchy, contrast, spacing and affordance — the principles that make an interface legible before any visual styling is applied.",
  },
  {
    id: "11",
    topic: "Principles of UI and UX Design",
    category: "Design",
    difficultyLevel: "Beginner",
    demandScore: 81,
    searchesPerMonth: "105k",
    source: ai,
    submittedAt: hoursAgo(20),
    status: "pending",
    duplicateGroupId: "dup-uiux",
    description:
      "Surfaced from demand signals: high search volume against UI/UX foundations with only intermediate supply on the platform.",
  },

  {
    id: "12",
    topic: "DevOps & CI/CD Pipeline",
    category: "Cloud Computing",
    difficultyLevel: "Advanced",
    demandScore: 76,
    searchesPerMonth: "91k",
    source: ai,
    submittedAt: daysAgo(9),
    status: "pending",
  },
  {
    id: "13",
    topic: "Natural Language Processing",
    category: "Artificial Intelligence",
    difficultyLevel: "Advanced",
    demandScore: 90,
    searchesPerMonth: "141k",
    source: curator("David Brown", "david.b@example.com"),
    submittedAt: daysAgo(7),
    status: "approved",
  },
  {
    id: "14",
    topic: "Blockchain Development",
    category: "Software Development",
    difficultyLevel: "Intermediate",
    demandScore: 68,
    searchesPerMonth: "72k",
    source: ai,
    submittedAt: daysAgo(11),
    status: "approved",
  },
  {
    id: "15",
    topic: "Mobile App Development",
    category: "Software Development",
    difficultyLevel: "Intermediate",
    demandScore: 84,
    searchesPerMonth: "116k",
    source: curator("Michael Chen", "michael.c@example.com"),
    submittedAt: daysAgo(12),
    status: "approved",
  },
  {
    id: "16",
    topic: "Network Administration",
    category: "Information Technology",
    difficultyLevel: "Beginner",
    demandScore: 65,
    searchesPerMonth: "68k",
    source: ai,
    submittedAt: daysAgo(14),
    status: "rejected",
    rejectedReason: "Supply already sufficient on the platform.",
  },
  {
    id: "17",
    topic: "Agile Project Management",
    category: "Business",
    difficultyLevel: "Beginner",
    demandScore: 73,
    searchesPerMonth: "89k",
    source: curator("Emily Davis", "emily.d@example.com"),
    submittedAt: daysAgo(15),
    status: "rejected",
    rejectedReason: "Out of scope for the current catalogue focus.",
  },
  {
    id: "18",
    topic: "Linux System Administration",
    category: "Information Technology",
    difficultyLevel: "Intermediate",
    demandScore: 71,
    searchesPerMonth: "79k",
    source: ai,
    submittedAt: daysAgo(16),
    status: "pending",
  },
];

export const categoryOptions = [
  "Software Engineering",
  "Software Development",
  "Computer Science",
  "Cloud Computing",
  "Cybersecurity",
  "Artificial Intelligence",
  "Information Technology",
  "Design",
  "Business",
].map((value) => ({ label: value, value }));

export const difficultyOptions = ["Beginner", "Intermediate", "Advanced"].map((value) => ({
  label: value,
  value,
}));

export const sourceOptions = [
  { label: "All sources", value: "all" },
  { label: "AI Engine", value: "ai" },
  { label: "Curator", value: "curator" },
];
