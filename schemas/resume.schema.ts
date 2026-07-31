
import { z } from "zod";

const nullableString = z.string().trim().nullable();

export const personalInfoSchema = z.object({
    name: nullableString,
    headline: nullableString,
    email: nullableString,
    phone: nullableString,
    location: nullableString,
    website: nullableString,
    linkedin: nullableString,
    github: nullableString,
});

export const summarySchema = nullableString;

export const experienceItemSchema = z.object({
    company: nullableString,
    role: nullableString,
    location: nullableString,
    startDate: nullableString,
    endDate: nullableString,
    isCurrent: z.boolean().nullable(),
    dateText: nullableString,
    description: nullableString,
    responsibilities: z.array(z.string().trim()).default([]),
});

export const educationItemSchema = z.object({
    institution: nullableString,
    degree: nullableString,
    fieldOfStudy: nullableString,
    location: nullableString,
    startDate: nullableString,
    endDate: nullableString,
    isCurrent: z.boolean().nullable(),
    cgpa: nullableString,
    percentage: nullableString,
    description: nullableString,
});

export const projectItemSchema = z.object({
    name: nullableString,
    role: nullableString,
    description: nullableString,
    technologies: z.array(z.string().trim()).default([]),
    github: nullableString,
    liveDemo: nullableString,
});

export const skillGroupSchema = z.object({
    category: nullableString,
    items: z.array(z.string().trim()).default([]),
});

export const languageItemsSchema = z.object({
    name: nullableString,
    proficiency: nullableString,
});

export const certificationItemsSchema = z.object({
    name: nullableString,
    issuer: nullableString,
    date: nullableString,
    credentialId: nullableString,
    credentialUrl: nullableString,
});

export const resumeSchema = z.object({
    personalInfo: personalInfoSchema.nullable(),
    summary: summarySchema,
    experience: z.array(experienceItemSchema).default([]),
    education: z.array(educationItemSchema).default([]),
    projects: z.array(projectItemSchema).default([]),
    skills: z.array(skillGroupSchema).default([]),
    languages: z.array(languageItemsSchema).default([]),
    certifications: z.array(certificationItemsSchema).default([]),
});

export type ResumeSchema = z.infer<typeof resumeSchema>;
