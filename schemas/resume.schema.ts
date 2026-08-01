
import { z } from "zod";

const nullableString = z.string().trim().nullable();

export const personalInfoSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    title: nullableString,
    email: z.string().trim().email("Invalid email address"),
    phone: nullableString,
    website: nullableString,
    github: nullableString,
    linkedin: nullableString,
    location: nullableString,
});

export const summarySchema = nullableString;

export const experienceItemSchema = z.object({
    company: z.string().trim().min(1, "Company is required"),
    position: z.string().trim().min(1, "Position is required"),
    location: nullableString,
    startDate: z.string().trim().min(1, "Start date is required"),
    endDate: nullableString,
    isCurrent: z.boolean(),
    description: nullableString,
});

export const educationItemSchema = z.object({
    institution: z.string().trim().min(1, "Institution is required"),
    degree: z.string().trim().min(1, "Degree is required"),
    fieldOfStudy: nullableString,
    location: nullableString,
    startDate: z.string().trim().min(1, "Start date is required"),
    endDate: nullableString,
    isCurrent: z.boolean(),
    description: nullableString,
});

export const projectItemSchema = z.object({
    name: z.string().trim().min(1, "Project name is required"),
    role: nullableString,
    url: nullableString,
    description: nullableString,
    technologies: z.array(z.string().trim()).default([]),
});

export const skillGroupSchema = z.object({
    category: nullableString,
    items: z.array(z.string().trim()).default([]),
});

export const languageItemsSchema = z.object({
    name: z.string().trim().min(1, "Language name is required"),
    proficiency: nullableString,
});

export const certificationItemsSchema = z.object({
    name: z.string().trim().min(1, "Certification name is required"),
    issuer: z.string().trim().min(1, "Issuer is required"),
    date: nullableString,
});

export const resumeSchema = z.object({
    personalInfo: personalInfoSchema,
    summary: summarySchema,
    experience: z.array(experienceItemSchema).default([]),
    education: z.array(educationItemSchema).default([]),
    projects: z.array(projectItemSchema).default([]),
    skills: z.array(skillGroupSchema).default([]),
    languages: z.array(languageItemsSchema).default([]),
    certifications: z.array(certificationItemsSchema).default([]),
});

export type ResumeSchema = z.infer<typeof resumeSchema>;
