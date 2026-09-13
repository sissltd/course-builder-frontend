import type { ParsedModule, ParsedLesson, ParsedSection } from "../types/documentImport";

let sectionCounter = 0;

function generateId(): string {
  sectionCounter += 1;
  return `sec-${sectionCounter}`;
}

function resetCounter(): void {
  sectionCounter = 0;
}

function parseTxtContent(text: string): ParsedSection[] {
  const lines = text.split("\n");
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  let contentBuffer: string[] = [];

  const headingRegex = /^(#{1,6})\s+(.+)/;
  const numberedRegex = /^(\d+[\.\)]\s*)(.+)/;

  for (const line of lines) {
    const headingMatch = line.match(headingRegex);
    const numberedMatch = line.match(numberedRegex);

    if (headingMatch || numberedMatch) {
      if (currentSection) {
        currentSection.content = contentBuffer.join("\n").trim();
        contentBuffer = [];
        sections.push(currentSection);
      }

      const level = headingMatch
        ? headingMatch[1].length
        : numberedMatch && numberedMatch[1].includes(".")
          ? 1
          : 2;
      const title = headingMatch ? headingMatch[2].trim() : numberedMatch![2].trim();

      currentSection = {
        id: generateId(),
        title,
        level,
        content: "",
        children: [],
      };
    } else {
      contentBuffer.push(line);
    }
  }

  if (currentSection) {
    currentSection.content = contentBuffer.join("\n").trim();
    sections.push(currentSection);
  }

  if (sections.length === 0 && text.trim()) {
    sections.push({
      id: generateId(),
      title: "Imported Content",
      level: 1,
      content: text.trim(),
      children: [],
    });
  }

  return sections;
}

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
        lessons.push({
          id: child.id,
          title: child.title,
          content: child.content || child.children.map((c) => c.content).filter(Boolean).join("\n\n"),
          type: "text",
        });
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
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items as Array<{ str: string }>;
      const pageText = textItems
        .filter((item) => item && typeof item.str === "string")
        .map((item) => item.str)
        .join(" ");
      fullText += pageText + "\n\n";
    }

    const sections = parseTxtContent(fullText);
    const hierarchy = buildHierarchy(sections);
    return sectionsToModules(hierarchy);
  }

  if (ext === "docx") {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;

    const sections = parseTxtContent(text);
    const hierarchy = buildHierarchy(sections);
    return sectionsToModules(hierarchy);
  }

  throw new Error(`Unsupported file format: .${ext}`);
}
