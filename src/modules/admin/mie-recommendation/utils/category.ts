import type { MieSubmission } from "../types";

/**
 * Derives a clean category label from a submission's payload or title keywords,
 * enabling category-based color coding in the grid view just like courses.
 */
export const getSubmissionCategory = (submission: MieSubmission): string => {
  const p = submission.payload as Record<string, unknown> | undefined;
  if (p?.category && typeof p.category === "string" && p.category.trim()) {
    return p.category.trim();
  }
  if (p?.topic && typeof p.topic === "string" && p.topic.trim()) {
    return p.topic.trim();
  }

  const title = (submission.title || "").toLowerCase();
  if (
    /python|javascript|typescript|react|node|web|coding|programming|backend|frontend|api|rust|golang|c\+\+/i.test(
      title
    )
  ) {
    return "Software Engineering";
  }
  if (
    /ai|artificial intelligence|machine learning|deep learning|llm|prompt|neural|gpt|nlp/i.test(
      title
    )
  ) {
    return "Artificial Intelligence";
  }
  if (/design|ui|ux|figma|animation|graphic/i.test(title)) {
    return "Product Design";
  }
  if (/finance|money|stock|crypto|trading|accounting/i.test(title)) {
    return "Finance";
  }
  if (/cloud|devops|aws|azure|gcp|docker|kubernetes|linux/i.test(title)) {
    return "Cloud Computing";
  }
  if (/data|analytics|sql|bi|statistics|power bi/i.test(title)) {
    return "Data Analysis";
  }
  if (/security|cyber|hack|penetration|infosec/i.test(title)) {
    return "Cyber Security";
  }
  if (/leader|management|business|strategy|startup|agile/i.test(title)) {
    return "Business Strategy";
  }

  return "General";
};
