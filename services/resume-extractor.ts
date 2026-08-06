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

