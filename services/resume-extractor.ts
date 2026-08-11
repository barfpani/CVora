import { extractStructuredResume } from "@/lib/gemini";
import type { ResumeState } from "@/context/resume-state";
import { resumeSchema, type ResumeSchema } from "@/schemas/resume.schema";


export interface ExtractedResumeTextInput {
    resumeText: string;
    fileName?: string | null;
}

export interface ExtractedResumeFromPdfInput {
    pdfBase64: string;
    mimeType: "application/pdf";
    fileName?: string | null;
}

export type ExtractedResumeInput = | ExtractedResumeTextInput | ExtractedResumeFromPdfInput;

export interface ExtractResumeSuccess {
    ok: true;
    extracted: ResumeSchema;
    mapped: ResumeState;
}

export interface ExtractedResumeFailure {
    ok: false;
    stage: "extract" | "validate" | "map";
    message: string;
    issues?: string[];
}

export type ExtractResumeResult  = | ExtractResumeSuccess | ExtractedResumeFailure;

const DEFAULT_SECTIONS_ORDER: ResumeState["sectionsOrder"] = [
    "summary",
    "workExperience",
    "education",
    "projects",
    "skills",
    "languages",
    "certifications"
];

export async function extractResume (
    input: ExtractedResumeInput
): Promise<ExtractResumeResult> {
    let raw: unknown;

    try{
        raw = await extractStructuredResume(
            "resumeText" in input
            ? { resumeText: input.resumeText }
            : {
                pdfBase64: input.pdfBase64,
                mimeType: input.mimeType,
                fileName: input.fileName ?? undefined,
            }
        );
    }
    catch(error) {
        return {
            ok: false,
            stage: "extract",
            message: error instanceof Error ? error.message : "Failed to extract resume data.",
        };
    }

    let extracted: ResumeSchema;

    try {
        extracted = validateExtractResume(raw);
    }
    catch(error){
        return{
            ok: false,
            stage: "validate",
            message: "The extracted response did not match the resume schema,",
            issues: error instanceof Error ? [error.message] : ["Unknown validation error."],
        };
    }

    try {
        const mapped = mapResumeSchemaToState(extracted, {
            documentName: input.fileName ?? null,
        });

        return {
            ok: true,
            extracted,
            mapped,
        };
    }
    catch(error) {
        return {
            ok: false,
            stage: "map",
            message: error instanceof Error ? error.message: "failed to map extracted resume data.",
        };
    }
}

function validateExtractResume(raw: unknown): ResumeSchema {
    const parsed = resumeSchema.safeParse(raw);

    if(!parsed.success) {
        throw new Error(
            parsed.error.issues.map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`).join("; ")
        );
    }

    return parsed.data
}

function mapResumeSchemaToState(
    extracted: ResumeSchema,
    options?: {
        documentName?: string | null;
    }
): ResumeState {
    const mappedContent = {
        summary: toParagraphHtml(extracted.summary),
        workExperience: mapExperience(extracted.experience),
        education: mapEducation(extracted.education),
        projects: mapProjects(extracted.projects),
        skills: mapSkills(extracted.skills),
        languages: mapLanguages(extracted.languages),
        certifications: mapCertifications(extracted.certifications),
    };

    return {
        personalInfo: mapPersonalInfo(extracted.personalInfo),
        summary: mappedContent.summary,
        workExperience: mappedContent.workExperience,
        education: mappedContent.education,
        projects: mappedContent.projects,
        skills: mappedContent.skills,
        languages: mappedContent.languages,
        certifications: mappedContent.certifications,
        sectionsOrder: buildDefaultSectionsOrder(),
        visibleSections: buildVisibleSections(mappedContent),
        theme: buildDefaultTheme(options?.documentName ?? null),
    };
}



function mapPersonalInfo(
    personalInfo: ResumeSchema["personalInfo"]
): ResumeState["personalInfo"]{
    return {
        name: personalInfo.name,
        title: personalInfo.title ?? "",
        email: personalInfo.email,
        phone: personalInfo.phone ?? "",
        website: personalInfo.website ?? "",
        github: personalInfo.github ?? "",
        linkedin: personalInfo.linkedin ?? "",
        location: personalInfo.location ?? "",
    };
}


function mapExperience(
    experience: ResumeSchema["experience"]
): ResumeState["workExperience"] {
    return experience.map((item, index) => ({
        id: createItemId("exp", index),
        company: item.company,
        position: item.position,
        location: item.location ?? "",
        startDate: item.startDate,
        endDate: item.endDate ?? (item.isCurrent ? "Present" : ""),
        current: item.isCurrent,
        description: toDescriptionHtml(item.description),
    }));
}

function mapEducation(
    education: ResumeSchema["education"]
): ResumeState["education"]{
    return education.map((item, index) => ({
        id: createItemId("edu", index),
        school: item.institution,
        degree: item.degree,
        fieldOfStudy: item.fieldOfStudy ?? "",
        location: item.location ?? "",
        startDate: item.startDate,
        endDate: item.endDate ?? (item.isCurrent ? "Present" : ""),
        current: item.isCurrent,
        description: item.description ?? "",
    }));
}

function mapProjects(
    projects: ResumeSchema["projects"]
): ResumeState["projects"] {
    return projects.map((item, index) => ({
        id: createItemId("proj", index),
        name: item.name,
        role: item.role ?? "",
        url: item.url ?? "",
        technologies: item.technologies.join(", "),
        description: toParagraphHtml(item.description),
    }));
}

function mapSkills(
    skills: ResumeSchema["skills"]
): ResumeState["skills"] {
    return skills.map((item, index) => ({
        id: createItemId("skill", index),
        name: item.category ?? "",
        skills: item.items.join(", "),
    }));
}

function mapLanguages(
    languages: ResumeSchema["languages"]
): ResumeState["languages"]{
    return languages.map((item, index) => ({
        id: createItemId("lang", index),
        name: item.name,
        proficiency: item.proficiency ?? "",
    }));
}

function mapCertifications(
    certifications: ResumeSchema["certifications"]
): ResumeState["certifications"]{
    return certifications.map((item, index) => ({
        id: createItemId("cert", index),
        name: item.name,
        issuer: item.issuer,
        date: item.date ?? "",
    }));
}

function buildVisibleSections(
    mapped : Pick < 
        ResumeState,
        | "summary"
        | "workExperience"
        | "education"
        | "projects"
        | "skills"
        | "languages"
        | "certifications"
    >
): ResumeState["visibleSections"]{
    return {
        summary: mapped.summary.trim() != "",
        workExperience: mapped.workExperience.length > 0,
        education: mapped.education.length > 0,
        projects: mapped.projects.length > 0,
        skills: mapped.skills.length > 0,
        languages: mapped.languages.length > 0,
        certifications: mapped.certifications.length > 0,
    };
}

function buildDefaultSectionsOrder (): ResumeState["sectionsOrder"] {
    return [
        "summary",
        "workExperience",
        "education",
        "projects",
        "skills",
        "languages",
        "certifications"
    ];
}

function buildDefaultTheme(
    documentName?: string | null
): ResumeState["theme"] {
    return {
        template: "modern",
        primaryColor: "#3b82f6",
        font: "inter",
        documentName: documentName?.replace(/\.pdf$/i, "") || "Extracted Resume",
        contentFontSize: 12,
        sectionFonts: {
            personalDetails: "inter",
            summary: "inter",
            workExperience: "inter",
            education: "inter",
            projects: "inter",
            skills: "inter",
            languages: "inter",
            certifications: "inter",
        },
    };
}

function toParagraphHtml(value: string | null): string {
  const trimmed = value?.trim();

  if (!trimmed) return "";

  return `<p>${escapeHtml(trimmed)}</p>`;
}

function toDescriptionHtml(value: string | null): string {
  const trimmed = value?.trim();

  if (!trimmed) return "";

  const lines = trimmed
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const bulletLines = lines
    .map((line) => line.replace(/^[•\-*]\s*/, "").trim())
    .filter(Boolean);

  if (lines.length > 1 || /^[•\-*]/.test(trimmed)) {
    return `<ul>${bulletLines
      .map((line) => `<li>${escapeHtml(line)}</li>`)
      .join("")}</ul>`;
  }

  return `<p>${escapeHtml(trimmed)}</p>`;
}

function createItemId(prefix: string, index: number): string {
  return `${prefix}-${index + 1}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}