import type { ResumeState } from "@/context/resume-state";
import type { ResumeSchema } from "@/schemas/resume.schema";

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

function validateExtractResume(raw: unknown): ResumeSchema;

function mapResumeSchemaToState(
    extraced: ResumeSchema,
    options?: {
        documentName?: string | null;
    }
): ResumeSchema;

function mapPersonalInfo(
    personalInfo: ResumeSchema["personalInfo"]
): ResumeState["personalInfo"];

function mapExperience(
    experience: ResumeSchema["experience"]
): ResumeState["experience"];

function mapEducation(
    education: ResumeSchema["education"]
): ResumeState["education"];

function mapProjects(
    projects: ResumeSchema["projects"]
): ResumeState["projects"];

function mapSkills(
    skills: ResumeSchema["skills"]
): ResumeState["skills"];

function mapLanguages(
    languages: ResumeSchema["languages"]
): ResumeState["languages"];

function mapCertifications(
    certifications: ResumeSchema["certifications"]
): ResumeState["certifications"];

function buildVisibleSections(
    mapped : pick < 
        ResumeState,
        | "summary"
        | "workExperience"
        | "education"
        | "projects"
        | "skills"
        | "languages"
        | "certifications"
    >
): ResumeState["visibleSections"];

function buildDefaultSectionsOrder (): ResumeState["sectionsOrder"];

function buildDefaultTheme(
    documentName?: string | null
): ResumeState["theme"];

function toParagraphHtml(value: string | null): string;

function toDescriptionHtml(value: string | null): string;

function createItemId(prefix: string, index: number): string;