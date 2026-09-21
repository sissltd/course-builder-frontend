import type { ParsedModule, ParsedLesson, ParsedSection } from "../types/documentImport";

let sectionCounter = 0;

function generateId(): string {
  sectionCounter += 1;
  return `sec-${sectionCounter}`;
}

function resetCounter(): void {
  sectionCounter = 0;
}

// --- TXT Parsing ---

const CHAPTER_PATTERNS = [
  /^(chapter|ch\.?|chap\.?)\s+(\d+|[ivxlcdm]+|[a-z])\b[:.\s—–-]*(.*)/i,
  /^(section|sec\.?|s\.)\s+(\d+[\.\d]*)\b[:.\s—–-]*(.*)/i,
  /^(part|pt\.?)\s+(\d+|[ivxlcdm]+|[a-z])\b[:.\s—–-]*(.*)/i,
  /^(module|mod\.?|m\.)\s+(\d+[\.\d]*)\b[:.\s—–-]*(.*)/i,
  /^(lesson|l\.)\s+(\d+[\.\d]*)\b[:.\s—–-]*(.*)/i,
];

const HEADING_MARKERS = /^(#{1,6})\s+(.+)/;
const NUMBERED_ITEMS = /^(\d+[\.\)]\s+)(.+)/;
const UNDERLINE_HEADING = /^(={3,}|-{3,}|_{3,})\s*$/;
const ALLCAPS_HEADING = /^[A-Z][A-Z\s]{3,}$/;

function parseTxtContent(text: string): ParsedSection[] {
  const lines = text.split("\n");
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  let contentBuffer: string[] = [];

  function flushContent(): void {
    if (currentSection) {
      currentSection.content = contentBuffer.join("\n").trim();
      contentBuffer = [];
      sections.push(currentSection);
      currentSection = null;
    }
  }

  function startSection(title: string, level: number): void {
    flushContent();
    currentSection = {
      id: generateId(),
      title,
      level,
      content: "",
      children: [],
    };
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines but preserve paragraph breaks
    if (trimmed === "") {
      if (contentBuffer.length > 0 && contentBuffer[contentBuffer.length - 1] !== "") {
        contentBuffer.push("");
      }
      continue;
    }

    // 1. Markdown headings: # Title, ## Title, etc.
    const headingMatch = trimmed.match(HEADING_MARKERS);
    if (headingMatch) {
      startSection(headingMatch[2].trim(), headingMatch[1].length);
      continue;
    }

    // 2. Chapter/Section/Part patterns: "Chapter 1: Introduction"
    for (const pattern of CHAPTER_PATTERNS) {
      const match = trimmed.match(pattern);
      if (match) {
        const title = match[3] || `${match[1]} ${match[2]}`;
        startSection(title.trim(), 1);
        break;
      }
    }
    if (currentSection && contentBuffer.length === 0 && sections.length < sections.length) {
      continue;
    }

    // Check if we just started a chapter section
    const wasChapterMatch = CHAPTER_PATTERNS.some(p => trimmed.match(p));
    if (wasChapterMatch && currentSection) {
      continue;
    }

    // 3. Underline following a line = heading (setext-style)
    if (UNDERLINE_HEADING.test(trimmed) && contentBuffer.length > 0) {
      const prevLine = contentBuffer.pop()!.trim();
      if (prevLine.length > 0 && prevLine.length < 120) {
        startSection(prevLine, 2);
        continue;
      }
      // Put it back if not a heading
      contentBuffer.push(prevLine);
    }

    // 4. ALL CAPS lines that look like headings (not too long, not mid-sentence)
    if (ALLCAPS_HEADING.test(trimmed) && trimmed.length < 80 && !/^\d/.test(trimmed)) {
      startSection(trimmed, 2);
      continue;
    }

    // 5. Numbered items at level 1 or 2
    const numberedMatch = trimmed.match(NUMBERED_ITEMS);
    if (numberedMatch) {
      const dotStyle = numberedMatch[1].includes(".");
      startSection(numberedMatch[2].trim(), dotStyle ? 1 : 2);
      continue;
    }

    // 6. Lines that are short and followed by a blank line could be sub-headings
    if (trimmed.length > 0 && trimmed.length < 60 && !trimmed.endsWith(".") && !trimmed.endsWith(",") && i + 1 < lines.length && lines[i + 1]?.trim() === "") {
      const nextNext = i + 2 < lines.length ? lines[i + 2]?.trim() : "";
      // Only treat as heading if next non-empty line is longer (paragraph-like)
      if (nextNext && nextNext.length > trimmed.length) {
        startSection(trimmed, 3);
        continue;
      }
    }

    contentBuffer.push(line);
  }

  flushContent();

  // Fallback: if no sections found, create one from the whole text
  if (sections.length === 0 && text.trim()) {
    const lines = text.trim().split("\n").filter(l => l.trim());
    const title = lines[0]?.trim().slice(0, 100) || "Imported Content";
    sections.push({
      id: generateId(),
      title,
      level: 1,
      content: text.trim(),
      children: [],
    });
  }

  return sections;
}

// --- Hierarchy & Module Conversion ---

function buildHierarchy(sections: ParsedSection[]): ParsedSection[] {
  const root: ParsedSection[] = [];
  const stack: ParsedSection[] = [];

  for (const section of sections) {
    while (stack.length > 0 && stack[stack.length - 1].level >= section.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(section);
    } else {
      stack[stack.length - 1].children.push(section);
    }

    stack.push(section);
  }

  return root;
}

function sectionsToModules(sections: ParsedSection[]): ParsedModule[] {
  const modules: ParsedModule[] = [];

  for (const section of sections) {
    const lessons: ParsedLesson[] = [];

    if (section.children.length > 0) {
      for (const child of section.children) {
        if (child.children.length > 0) {
          // Grandchildren get flattened into lesson content
          const childContent = [child.content, ...child.children.map(c => c.content)]
            .filter(Boolean)
            .join("\n\n");
          lessons.push({
            id: child.id,
            title: child.title,
            content: childContent,
            type: "text",
          });
        } else {
          lessons.push({
            id: child.id,
            title: child.title,
            content: child.content || "",
            type: "text",
          });
        }
      }
    } else if (section.content) {
      lessons.push({
        id: `${section.id}-lesson`,
        title: section.title,
        content: section.content,
        type: "text",
      });
    }

    if (lessons.length === 0) {
      lessons.push({
        id: `${section.id}-lesson`,
        title: section.title,
        content: section.content || "",
        type: "text",
      });
    }

    modules.push({
      id: section.id,
      title: section.title,
      description: section.content?.slice(0, 200) || "",
      lessons,
    });
  }

  return modules;
}

// --- PDF Parsing ---

interface TextItem {
  str: string;
  height: number;
  transform: number[];
  width?: number;
}

function detectHeadingLevel(fontSizes: number[], itemHeight: number): number | null {
  if (fontSizes.length === 0) return null;

  // Sort font sizes descending (largest first)
  const sorted = [...new Set(fontSizes)].sort((a, b) => b - a);

  // Map top font sizes to heading levels
  const h1Threshold = sorted[0];
  const h2Threshold = sorted[1] ?? sorted[0] * 0.85;
  const h3Threshold = sorted[2] ?? sorted[1] * 0.85;

  if (itemHeight >= h1Threshold * 0.95) return 1;
  if (itemHeight >= h2Threshold * 0.95) return 2;
  if (itemHeight >= h3Threshold * 0.95) return 3;
  return null;
}

function buildHierarchyFromPdfItems(pages: TextItem[][]): ParsedSection[] {
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  let contentBuffer: string[] = [];

  function flushContent(): void {
    if (currentSection) {
      currentSection.content = contentBuffer.join("\n").trim();
      contentBuffer = [];
      sections.push(currentSection);
      currentSection = null;
    }
  }

  function startSection(title: string, level: number): void {
    flushContent();
    currentSection = {
      id: generateId(),
      title,
      level,
      content: "",
      children: [],
    };
  }

  // Collect all font sizes across all pages
  const allFontSizes: number[] = [];
  for (const page of pages) {
    for (const item of page) {
      if (item.str.trim()) {
        allFontSizes.push(item.height);
      }
    }
  }

  for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
    const pageItems = pages[pageIdx];

    for (const item of pageItems) {
      const text = item.str.trim();
      if (!text) continue;

      const headingLevel = detectHeadingLevel(allFontSizes, item.height);

      if (headingLevel !== null) {
        startSection(text, headingLevel);
        continue;
      }

      // Check for chapter/section patterns even in body text
      let isChapter = false;
      for (const pattern of CHAPTER_PATTERNS) {
        const match = text.match(pattern);
        if (match) {
          const title = match[3] || `${match[1]} ${match[2]}`;
          startSection(title.trim(), 1);
          isChapter = true;
          break;
        }
      }
      if (isChapter) continue;

      // Check for ALL CAPS headings
      if (ALLCAPS_HEADING.test(text) && text.length < 80) {
        startSection(text, 2);
        continue;
      }

      contentBuffer.push(text);
    }

    // Add page break between pages
    if (pageIdx < pages.length - 1) {
      contentBuffer.push("");
    }
  }

  flushContent();

  if (sections.length === 0) {
    // Fallback: use first meaningful text as title
    const allText = pages.flat().map(i => i.str.trim()).filter(Boolean).join(" ");
    const firstLine = allText.split(/\s{3,}/)[0]?.slice(0, 100) || "Imported Content";
    sections.push({
      id: generateId(),
      title: firstLine,
      level: 1,
      content: allText,
      children: [],
    });
  }

  return sections;
}

async function parsePdf(file: File): Promise<ParsedModule[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: TextItem[][] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const items = (textContent.items as TextItem[]).filter(
      (item) => item && typeof item.str === "string" && item.str.trim(),
    );
    pages.push(items);
  }

  const sections = buildHierarchyFromPdfItems(pages);
  const hierarchy = buildHierarchy(sections);
  return sectionsToModules(hierarchy);
}

// --- DOCX Parsing ---

function parseHtmlToSections(html: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  let contentBuffer: string[] = [];

  function flushContent(): void {
    if (currentSection) {
      currentSection.content = contentBuffer.join("\n").trim();
      contentBuffer = [];
      sections.push(currentSection);
      currentSection = null;
    }
  }

  function startSection(title: string, level: number): void {
    flushContent();
    currentSection = {
      id: generateId(),
      title,
      level,
      content: "",
      children: [],
    };
  }

  // Parse HTML to extract structure
  const bodyRegex = /<body[^>]*>([\s\S]*)<\/body>/i;
  const bodyMatch = html.match(bodyRegex);
  const htmlContent = bodyMatch ? bodyMatch[1] : html;

  // Split by block-level tags
  const blockRegex = /<(h[1-6]|p|li)(?:\s[^>]*)?>[\s\S]*?<\/\1>/gi;
  const blocks = htmlContent.match(blockRegex) || [];

  function stripTags(text: string): string {
    return text.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").trim();
  }

  for (const block of blocks) {
    const tagMatch = block.match(/^(h[1-6]|p|li)/i);
    if (!tagMatch) continue;
    const tag = tagMatch[1].toLowerCase();
    const text = stripTags(block);

    if (!text) continue;

    if (tag.startsWith("h")) {
      const level = parseInt(tag[1], 10);
      startSection(text, level);
    } else if (tag === "li") {
      // Lists get added as content with bullet prefix
      contentBuffer.push(`• ${text}`);
    } else if (tag === "p") {
      // Check if it starts with bold/strong — might be a sub-heading
      const isBoldLead = /^<(strong|b)[^>]*>[\s\S]*?<\/(strong|b)>/i.test(block);
      if (isBoldLead && text.length < 80) {
        startSection(text, 3);
      } else {
        contentBuffer.push(text);
        contentBuffer.push(""); // paragraph break
      }
    }
  }

  flushContent();

  if (sections.length === 0 && blocks.length > 0) {
    // Fallback: use first meaningful text
    const allText = blocks.map(b => stripTags(b)).filter(Boolean).join("\n\n");
    const firstLine = allText.split("\n")[0]?.slice(0, 100) || "Imported Content";
    sections.push({
      id: generateId(),
      title: firstLine,
      level: 1,
      content: allText,
      children: [],
    });
  }

  return sections;
}

async function parseDocx(file: File): Promise<ParsedModule[]> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;

  const sections = parseHtmlToSections(html);
  const hierarchy = buildHierarchy(sections);
  return sectionsToModules(hierarchy);
}

// --- Public API ---

export async function parseDocument(file: File): Promise<ParsedModule[]> {
  resetCounter();

  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "txt") {
    const text = await file.text();
    const sections = parseTxtContent(text);
    const hierarchy = buildHierarchy(sections);
    return sectionsToModules(hierarchy);
  }

  if (ext === "pdf") {
    return parsePdf(file);
  }

  if (ext === "docx") {
    return parseDocx(file);
  }

  throw new Error(`Unsupported file format: .${ext}`);
}

/**
 * Extract a suggested course title from the parsed modules.
 * Returns the first heading/module title found.
 */
export function extractDocumentTitle(modules: ParsedModule[]): string | null {
  if (modules.length === 0) return null;

  const firstModule = modules[0];
  if (firstModule.title && firstModule.title !== "Imported Content") {
    return firstModule.title;
  }

  // Try first lesson title
  if (firstModule.lessons.length > 0) {
    const firstLesson = firstModule.lessons[0];
    if (firstLesson.title && firstLesson.title !== "Imported Content") {
      return firstLesson.title;
    }
  }

  return null;
}
