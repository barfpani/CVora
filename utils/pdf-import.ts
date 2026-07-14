import { ResumeState } from "../context/resume-state";

type SectionKey =
  | "summary"
  | "workExperience"
  | "education"
  | "projects"
  | "skills"
  | "languages"
  | "certifications";

const SECTION_LABELS: Record<SectionKey, string[]> = {
  summary: ["PROFESSIONAL SUMMARY", "SUMMARY", "PROFILE", "ABOUT"],
  workExperience: ["WORK EXPERIENCE", "EXPERIENCE", "PROFESSIONAL EXPERIENCE", "EMPLOYMENT"],
  education: ["EDUCATION", "ACADEMIC BACKGROUND"],
  projects: ["PROJECTS", "PROJECT EXPERIENCE"],
  skills: ["SKILLS", "TECHNICAL SKILLS", "CORE SKILLS"],
  languages: ["LANGUAGES", "LANGUAGE"],
  certifications: ["CERTIFICATIONS", "CERTIFICATIONS & AWARDS", "AWARDS"],
};

const URL_PATTERN = /(https?:\/\/\S+|www\.\S+|[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\/\S*)?)/g;
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_PATTERN = /(?:\+?\d[\d()\-\s]{7,}\d)/g;

export async function importResumeFromPdf(
  pdfData: Uint8Array,
  currentState: ResumeState,
  sourceName: string
): Promise<ResumeState> {
  const lines = await extractPdfTextLines(pdfData);

  if (lines.length === 0) {
    throw new Error("No readable text was found in this PDF.");
  }

  const sections = splitSections(lines);
  const headerLines = sections.header;
  const headerBlob = headerLines.join(" | ");

  const email = matchFirst(headerBlob, EMAIL_PATTERN);
  const phone = matchFirst(headerBlob, PHONE_PATTERN);
  const urls = [...new Set(headerBlob.match(URL_PATTERN) ?? [])];

  const usedHeaderLines = new Set<string>();
  if (email) markContainingLine(headerLines, email, usedHeaderLines);
  if (phone) markContainingLine(headerLines, phone, usedHeaderLines);
  urls.forEach((url) => markContainingLine(headerLines, url, usedHeaderLines));

  const meaningfulHeaderLines = headerLines.filter((line) => !usedHeaderLines.has(line));
  const name = meaningfulHeaderLines[0] ?? currentState.personalInfo.name;
  const title = meaningfulHeaderLines.slice(1).join(" ").trim();

  return {
    ...currentState,
    personalInfo: {
      ...currentState.personalInfo,
      name: cleanInlineText(name),
      title: cleanInlineText(title),
      email: email ?? "",
      phone: phone ?? "",
      website: pickWebsite(urls),
      github: pickByKeyword(urls, "github"),
      linkedin: pickByKeyword(urls, "linkedin"),
      location: pickLocation(headerLines, { email, phone, urls }),
      photo: "",
    },
    summary: sectionLinesToHtml(sections.summary),
    workExperience: parseExperience(sections.workExperience),
    education: parseEducation(sections.education),
    projects: parseProjects(sections.projects),
    skills: parseSkills(sections.skills),
    languages: parseLanguages(sections.languages),
    certifications: parseCertifications(sections.certifications),
    visibleSections: {
      summary: sections.summary.length > 0,
      workExperience: sections.workExperience.length > 0,
      education: sections.education.length > 0,
      projects: sections.projects.length > 0,
      skills: sections.skills.length > 0,
      languages: sections.languages.length > 0,
      certifications: sections.certifications.length > 0,
    },
    theme: {
      ...currentState.theme,
      documentName: sourceName.replace(/\.pdf$/i, ""),
    },
  };
}

async function extractPdfTextLines(pdfData: Uint8Array) {
  const decoder = new TextDecoder("latin1");
  const rawText = decoder.decode(pdfData);
  const streamRegex = /stream\r?\n([\s\S]*?)endstream/g;
  const lines: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = streamRegex.exec(rawText))) {
    const streamStart = match.index + match[0].indexOf(match[1]);
    const streamEnd = streamStart + match[1].length;
    const streamBytes = pdfData.slice(streamStart, streamEnd);
    const dictText = rawText.slice(Math.max(0, match.index - 400), match.index);
    const inflated = dictText.includes("/FlateDecode")
      ? await inflatePdfStream(streamBytes)
      : decoder.decode(streamBytes);

    if (!inflated.includes("BT")) continue;
    lines.push(...extractLinesFromContentStream(inflated));
  }

  return normalizeLines(lines);
}

async function inflatePdfStream(streamBytes: Uint8Array) {
  try {
    const buffer = streamBytes.buffer.slice(
      streamBytes.byteOffset,
      streamBytes.byteOffset + streamBytes.byteLength
    ) as ArrayBuffer;
    const ds = new DecompressionStream("deflate");
    const decompressed = new Response(
      new Blob([buffer]).stream().pipeThrough(ds)
    );
    return await decompressed.text();
  } catch {
    return new TextDecoder("latin1").decode(streamBytes);
  }
}

function extractLinesFromContentStream(content: string) {
  const blocks = content.match(/BT[\s\S]*?ET/g) ?? [];
  const lines: string[] = [];

  for (const block of blocks) {
    let currentLine = "";
    const tokenRegex =
      /(\[(?:\\.|[^\]])*?\]\s*TJ|\((?:\\.|[^\\()])*\)\s*Tj|<[\dA-Fa-f\s]+>\s*Tj|T\*|[-\d.]+\s+[-\d.]+\s+Td|[-\d.]+\s+[-\d.]+\s+TD|[-\d.]+\s+[-\d.]+\s+[-\d.]+\s+[-\d.]+\s+[-\d.]+\s+[-\d.]+\s+Tm)/g;

    let tokenMatch: RegExpExecArray | null;
    while ((tokenMatch = tokenRegex.exec(block))) {
      const token = tokenMatch[1];

      if (token.endsWith("Tj")) {
        currentLine += extractTextFromTextOperator(token);
        continue;
      }

      if (token.endsWith("TJ")) {
        currentLine += extractTextFromArrayOperator(token);
        continue;
      }

      const isLineBreak = token === "T*" || token.endsWith(" Td") || token.endsWith(" TD") || token.endsWith(" Tm");
      if (isLineBreak && currentLine.trim()) {
        lines.push(currentLine);
        currentLine = "";
      }
    }

    if (currentLine.trim()) {
      lines.push(currentLine);
    }
  }

  return lines;
}

function extractTextFromTextOperator(token: string) {
  const literalMatch = token.match(/\(([\s\S]*)\)\s*Tj$/);
  if (literalMatch) {
    return decodePdfLiteralString(literalMatch[1]);
  }

  const hexMatch = token.match(/<([\dA-Fa-f\s]+)>\s*Tj$/);
  if (hexMatch) {
    return decodePdfHexString(hexMatch[1]);
  }

  return "";
}

function extractTextFromArrayOperator(token: string) {
  const arrayContent = token.replace(/\]\s*TJ$/, "").replace(/^\[/, "");
  const textParts = arrayContent.match(/\((?:\\.|[^\\()])*\)|<[\dA-Fa-f\s]+>/g) ?? [];

  return textParts
    .map((part) => {
      if (part.startsWith("(")) {
        return decodePdfLiteralString(part.slice(1, -1));
      }
      return decodePdfHexString(part.slice(1, -1));
    })
    .join("");
}

function decodePdfLiteralString(value: string) {
  return value
    .replace(/\\([\\()])/g, "$1")
    .replace(/\\r/g, "\r")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\([0-7]{1,3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8)));
}

function decodePdfHexString(value: string) {
  const sanitized = value.replace(/\s+/g, "");
  const padded = sanitized.length % 2 === 0 ? sanitized : `${sanitized}0`;
  const bytes = new Uint8Array(
    padded.match(/.{1,2}/g)?.map((pair) => parseInt(pair, 16)) ?? []
  );
  return new TextDecoder().decode(bytes);
}

function normalizeLines(lines: string[]) {
  return lines
    .map((line) => cleanInlineText(line))
    .filter(Boolean)
    .filter((line, index, array) => line.length > 1 && array.indexOf(line) === index);
}

function cleanInlineText(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/[•·]+\s*/g, " ")
    .replace(/\s+\|\s+/g, " | ")
    .trim();
}

function splitSections(lines: string[]) {
  const normalizedLabels = new Map<string, SectionKey>();
  (Object.entries(SECTION_LABELS) as [SectionKey, string[]][]).forEach(([key, labels]) => {
    labels.forEach((label) => normalizedLabels.set(normalizeHeading(label), key));
  });

  const buckets: Record<"header" | SectionKey, string[]> = {
    header: [],
    summary: [],
    workExperience: [],
    education: [],
    projects: [],
    skills: [],
    languages: [],
    certifications: [],
  };

  let currentSection: "header" | SectionKey = "header";

  for (const line of lines) {
    const section = normalizedLabels.get(normalizeHeading(line));
    if (section) {
      currentSection = section;
      continue;
    }
    buckets[currentSection].push(line);
  }

  return buckets;
}

function normalizeHeading(value: string) {
  return value.replace(/[^A-Za-z]/g, "").toUpperCase();
}

function sectionLinesToHtml(lines: string[]) {
  if (lines.length === 0) return "";
  return `<p>${escapeHtml(lines.join(" "))}</p>`;
}

function parseExperience(lines: string[]): ResumeState["workExperience"] {
  return linesToBlocks(lines).map((block, index) => {
    const [headline = "", subline = "", ...rest] = block;
    const { location, dates } = splitTrailingMetadata(subline || headline);

    return {
      id: `pdf-exp-${index}`,
      company: cleanInlineText(headline),
      position: cleanInlineText(
        subline === headline ? "" : subline.replace(location, "").replace(dates.raw, "")
      ),
      location,
      startDate: dates.startDate,
      endDate: dates.endDate,
      current: dates.current,
      description: linesToListHtml(rest),
    };
  });
}

function parseEducation(lines: string[]): ResumeState["education"] {
  return linesToBlocks(lines).map((block, index) => {
    const [headline = "", subline = ""] = block;
    const { location, dates } = splitTrailingMetadata(headline);

    return {
      id: `pdf-edu-${index}`,
      school: cleanInlineText(headline.replace(location, "").replace(dates.raw, "")),
      degree: cleanInlineText(subline),
      fieldOfStudy: "",
      location,
      startDate: dates.startDate,
      endDate: dates.endDate,
      current: dates.current,
      description: block.slice(2).join(" "),
    };
  });
}

function parseProjects(lines: string[]): ResumeState["projects"] {
  return linesToBlocks(lines).map((block, index) => {
    const [headline = "", ...rest] = block;
    const urls = headline.match(URL_PATTERN) ?? [];
    const url = urls[0] ?? "";
    const cleanedHeadline = cleanInlineText(headline.replace(url, ""));
    const roleMatch = cleanedHeadline.match(/\(([^)]+)\)/);

    return {
      id: `pdf-proj-${index}`,
      name: cleanInlineText(cleanedHeadline.replace(/\(([^)]+)\)/, "")),
      role: roleMatch?.[1] ?? "",
      url,
      technologies: extractTechnologies(block),
      description: sectionLinesToHtml(rest),
    };
  });
}

function parseSkills(lines: string[]): ResumeState["skills"] {
  const categories: ResumeState["skills"] = [];
  let current: ResumeState["skills"][number] | null = null;

  lines.forEach((line, index) => {
    const skillMatch = line.match(/^([^:]{2,40}):\s*(.+)$/);
    if (skillMatch) {
      current = {
        id: `pdf-skill-${index}`,
        name: cleanInlineText(skillMatch[1]),
        skills: cleanInlineText(skillMatch[2]),
      };
      categories.push(current);
      return;
    }

    if (current) {
      current.skills = `${current.skills}, ${cleanInlineText(line)}`;
    }
  });

  return categories;
}

function parseLanguages(lines: string[]): ResumeState["languages"] {
  return lines.map((line, index) => {
    const [name, ...rest] = cleanInlineText(line).split(/\s+/);
    return {
      id: `pdf-lang-${index}`,
      name,
      proficiency: rest.join(" "),
    };
  });
}

function parseCertifications(lines: string[]): ResumeState["certifications"] {
  return lines.map((line, index) => {
    const dateMatch = line.match(/\b(19|20)\d{2}\b/);
    const date = dateMatch?.[0] ?? "";
    const withoutDate = cleanInlineText(line.replace(date, ""));
    const [name, issuer = ""] = withoutDate.split(/\s+[–-]\s+/);

    return {
      id: `pdf-cert-${index}`,
      name: cleanInlineText(name),
      issuer: cleanInlineText(issuer),
      date,
    };
  });
}

function linesToBlocks(lines: string[]) {
  const blocks: string[][] = [];
  let current: string[] = [];

  lines.forEach((line) => {
    if (looksLikeBlockStart(line) && current.length > 0) {
      blocks.push(current);
      current = [line];
    } else {
      current.push(line);
    }
  });

  if (current.length > 0) {
    blocks.push(current);
  }

  return blocks;
}

function looksLikeBlockStart(line: string) {
  URL_PATTERN.lastIndex = 0;
  return (
    URL_PATTERN.test(line) ||
    /^[A-Z][A-Za-z0-9&,.()/' -]{3,}$/.test(line) ||
    /\b(19|20)\d{2}\b/.test(line)
  );
}

function splitTrailingMetadata(line: string) {
  const pipeParts = line.split("|").map((part) => cleanInlineText(part));
  const location = pipeParts.length > 1 ? pipeParts[pipeParts.length - 1] : "";
  const datesRaw = pipeParts.find((part) => /\b(19|20)\d{2}\b/.test(part)) ?? "";
  const dateParts = datesRaw.split(/\s*[-–]\s*/);

  return {
    location: location === datesRaw ? "" : location,
    dates: {
      raw: datesRaw,
      startDate: dateParts[0] ?? "",
      endDate: dateParts[1] ?? "",
      current: /present|current|ongoing/i.test(datesRaw),
    },
  };
}

function linesToListHtml(lines: string[]) {
  const cleaned = lines.map((line) => cleanInlineText(line)).filter(Boolean);
  if (cleaned.length === 0) return "";
  return `<ul>${cleaned.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`;
}

function extractTechnologies(lines: string[]) {
  const techLine = lines.find((line) =>
    /(react|next|tailwind|typescript|javascript|node|docker|sql|css|html)/i.test(line)
  );
  return techLine ? cleanInlineText(techLine) : "";
}

function pickWebsite(urls: string[]) {
  return urls.find((url) => !/github|linkedin/i.test(url)) ?? "";
}

function pickByKeyword(urls: string[], keyword: string) {
  return urls.find((url) => url.toLowerCase().includes(keyword)) ?? "";
}

function pickLocation(
  headerLines: string[],
  values: { email: string | null; phone: string | null; urls: string[] }
) {
  const blacklist = new Set([values.email, values.phone, ...values.urls].filter(Boolean));
  return (
    headerLines.find((line) => {
      if (blacklist.has(line)) return false;
      EMAIL_PATTERN.lastIndex = 0;
      PHONE_PATTERN.lastIndex = 0;
      URL_PATTERN.lastIndex = 0;
      return !EMAIL_PATTERN.test(line) && !PHONE_PATTERN.test(line) && !URL_PATTERN.test(line);
    }) ?? ""
  );
}

function matchFirst(value: string, pattern: RegExp) {
  pattern.lastIndex = 0;
  return value.match(pattern)?.[0] ?? null;
}

function markContainingLine(lines: string[], value: string, bucket: Set<string>) {
  const line = lines.find((item) => item.includes(value));
  if (line) bucket.add(line);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
