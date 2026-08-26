import type { MieRecommendation } from "../data/mockData";

/** Tokens that carry no signal when deciding whether two topics are the same course. */
const FILLER_TOKENS = new Set([
  "a",
  "advanced",
  "an",
  "and",
  "basics",
  "beginner",
  "concepts",
  "course",
  "deep",
  "dive",
  "essentials",
  "for",
  "foundations",
  "fundamental",
  "fundamentals",
  "in",
  "intermediate",
  "intro",
  "introduction",
  "of",
  "principles",
  "the",
  "to",
  "with",
]);

/** Similarity at or above which two topics are treated as the same recommendation. */
const SIMILARITY_THRESHOLD = 0.6;

/**
 * Reduce a topic title to its meaningful tokens so that
 * "Advanced Python Programming" and "Python Programming Advanced Concepts" collide.
 */
export const normaliseTopic = (topic: string): Set<string> => {
  const tokens = topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 0 && !FILLER_TOKENS.has(token));

  // A title made entirely of filler still needs something to compare on.
  return new Set(tokens.length > 0 ? tokens : topic.toLowerCase().split(/\s+/));
};

const jaccard = (a: Set<string>, b: Set<string>) => {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  a.forEach((token) => {
    if (b.has(token)) shared += 1;
  });
  return shared / (a.size + b.size - shared);
};

export const isSimilarTopic = (a: string, b: string) =>
  jaccard(normaliseTopic(a), normaliseTopic(b)) >= SIMILARITY_THRESHOLD;

const byOldestFirst = (a: MieRecommendation, b: MieRecommendation) =>
  new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();

/**
 * Cluster recommendations that describe the same course.
 *
 * Prefers the backend-assigned `duplicateGroupId` when present, and otherwise falls
 * back to normalised-topic similarity within the same category. Only clusters of two
 * or more are returned, and each cluster is sorted oldest-first so index 0 is always
 * the submission that got there first.
 */
export const groupDuplicates = (
  rows: MieRecommendation[],
): Map<string, MieRecommendation[]> => {
  const groups = new Map<string, MieRecommendation[]>();
  const assigned = new Map<string, string>(); // row id -> group id

  const push = (groupId: string, row: MieRecommendation) => {
    const existing = groups.get(groupId);
    if (existing) {
      existing.push(row);
    } else {
      groups.set(groupId, [row]);
    }
    assigned.set(row.id, groupId);
  };

  // Pass 1 — honour explicit backend grouping.
  rows.forEach((row) => {
    if (row.duplicateGroupId) push(row.duplicateGroupId, row);
  });

  // Pass 2 — infer the rest from topic similarity within a category.
  rows.forEach((row) => {
    if (assigned.has(row.id)) return;

    const match = rows.find(
      (candidate) =>
        candidate.id !== row.id &&
        assigned.has(candidate.id) &&
        candidate.category === row.category &&
        isSimilarTopic(candidate.topic, row.topic),
    );

    if (match) {
      push(assigned.get(match.id)!, row);
      return;
    }

    const peer = rows.find(
      (candidate) =>
        candidate.id !== row.id &&
        !assigned.has(candidate.id) &&
        candidate.category === row.category &&
        isSimilarTopic(candidate.topic, row.topic),
    );

    if (peer) {
      const groupId = `inferred-${row.id}`;
      push(groupId, row);
      push(groupId, peer);
    }
  });

  // Drop singletons (an explicit group id can be left alone after siblings resolve)
  // and normalise ordering.
  const clusters = new Map<string, MieRecommendation[]>();
  groups.forEach((cluster, groupId) => {
    if (cluster.length > 1) {
      clusters.set(groupId, [...cluster].sort(byOldestFirst));
    }
  });

  return clusters;
};

/** The sibling list a row belongs to, or null when it has no clash. */
export const getClusterFor = (
  rowId: string,
  clusters: Map<string, MieRecommendation[]>,
): MieRecommendation[] | null => {
  for (const cluster of clusters.values()) {
    if (cluster.some((row) => row.id === rowId)) return cluster;
  }
  return null;
};

/** True when the row is the earliest submission in its cluster. */
export const isFirstIn = (
  rowId: string,
  clusters: Map<string, MieRecommendation[]>,
): boolean => {
  const cluster = getClusterFor(rowId, clusters);
  return cluster ? cluster[0].id === rowId : false;
};

export type ComparableField =
  | "topic"
  | "category"
  | "difficultyLevel"
  | "demandScore"
  | "searchesPerMonth";

const COMPARABLE_FIELDS: ComparableField[] = [
  "topic",
  "category",
  "difficultyLevel",
  "demandScore",
  "searchesPerMonth",
];

/**
 * Fields that actually differ across a cluster — drives the diff highlighting in the
 * compare drawer so the admin's eye lands on the real distinctions.
 */
export const getDifferingFields = (
  cluster: MieRecommendation[],
): Set<ComparableField> => {
  const differing = new Set<ComparableField>();
  if (cluster.length < 2) return differing;

  COMPARABLE_FIELDS.forEach((field) => {
    const first = cluster[0][field];
    if (cluster.some((row) => row[field] !== first)) differing.add(field);
  });

  return differing;
};

/** Total number of rows sitting in a duplicate clash. */
export const countDuplicateRows = (clusters: Map<string, MieRecommendation[]>) => {
  let total = 0;
  clusters.forEach((cluster) => {
    total += cluster.length;
  });
  return total;
};
