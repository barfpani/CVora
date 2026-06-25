"use client";

import React, { createContext, useContext, useReducer, useEffect, useState } from "react";

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  linkedin: string;
  location: string;
  photo: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  url: string;
  technologies: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeState {
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: SkillCategory[];
  languages: Language[];
  certifications: Certification[];
  sectionsOrder: string[];
  visibleSections: Record<string, boolean>;
  theme: {
    template: 'modern' | 'minimalist' | 'creative' | 'professional';
    primaryColor: string;
    font: 'inter' | 'serif' | 'mono' | 'outfit' | 'playfair';
  };
}

const DEFAULT_SECTIONS_ORDER = [
  "summary",
  "workExperience",
  "education",
  "projects",
  "skills",
  "languages",
  "certifications",
];

const INITIAL_STATE: ResumeState = {
  personalInfo: {
    name: "John Doe",
    title: "Senior Frontend Engineer",
    email: "john.doe@example.com",
    phone: "+1 (555) 019-2834",
    website: "johndoe.dev",
    github: "github.com/johndoe",
    linkedin: "linkedin.com/in/johndoe",
    location: "San Francisco, CA",
    photo: "",
  },
  summary: `
    <p>Dynamic and results-driven Senior Frontend Engineer with 5+ years of experience designing, building, and deploying highly responsive, user-centric web applications. Expert in React, Next.js, and modern CSS frameworks, with a strong focus on web performance, accessibility, and clean architecture.</p>
  `,
  workExperience: [
    {
      id: "exp-1",
      company: "TechCorp Inc.",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2024",
      endDate: "Present",
      current: true,
      description: `
        <ul>
          <li>Led a team of 4 developers to rebuild the core SaaS dashboard using Next.js, improving page load speeds by 40% (LCP optimized from 3.2s to 1.4s).</li>
          <li>Implemented a comprehensive design system utilizing React 19, Tailwind CSS, and Radix UI components, reducing duplicate CSS by 60%.</li>
          <li>Integrated complex real-time collaboration features using WebSockets and localized state caching.</li>
        </ul>
      `,
    },
    {
      id: "exp-2",
      company: "InnovateWeb Solutions",
      position: "Frontend Developer",
      location: "Oakland, CA",
      startDate: "Mar 2021",
      endDate: "Dec 2023",
      current: false,
      description: `
        <ul>
          <li>Developed and maintained high-traffic web applications with complex state structures, improving state retrieval times.</li>
          <li>Integrated Tiptap editors for content management and utilized @dnd-kit to build interactive, drag-and-drop workspace boards.</li>
          <li>Collaborated closely with UX designers to achieve WCAG AA accessibility compliance across all public pages.</li>
        </ul>
      `,
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      location: "Berkeley, CA",
      startDate: "Sep 2017",
      endDate: "May 2021",
      current: false,
      description: "Graduated with Honors. Specialization in Human-Computer Interaction and Software Engineering.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Resume Craft",
      role: "Creator",
      url: "https://resumecraft.vercel.app",
      technologies: "Next.js 15, React 19, Tailwind CSS, @dnd-kit, Tiptap",
      description: `
        <p>A premium resume generator built with React 19 and Next.js, featuring real-time preview, customizable templates, interactive section reordering, and direct PDF generation using html2canvas and jsPDF.</p>
      `,
    },
    {
      id: "proj-2",
      name: "DevTasker",
      role: "Solo Developer",
      url: "https://devtasker.example.com",
      technologies: "React, LocalStorage, CSS variables",
      description: `
        <p>A visual project management application with drag-and-drop task boards, rich text cards, and local storage synchronization.</p>
      `,
    },
  ],
  skills: [
    {
      id: "skill-1",
      name: "Languages",
      skills: "JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL",
    },
    {
      id: "skill-2",
      name: "Frameworks & Libraries",
      skills: "React 19, Next.js 15/16, Tailwind CSS, Redux Toolkit",
    },
    {
      id: "skill-3",
      name: "Tools & Platforms",
      skills: "Git, Vercel, Docker, Webpack, Vitest, Cypress",
    },
  ],
  languages: [
    {
      id: "lang-1",
      name: "English",
      proficiency: "Native",
    },
    {
      id: "lang-2",
      name: "Spanish",
      proficiency: "Conversational",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2025",
    },
    {
      id: "cert-2",
      name: "Next.js Advanced Certificate",
      issuer: "Vercel",
      date: "2024",
    },
  ],
  sectionsOrder: DEFAULT_SECTIONS_ORDER,
  visibleSections: {
    summary: true,
    workExperience: true,
    education: true,
    projects: true,
    skills: true,
    languages: true,
    certifications: true,
  },
  theme: {
    template: "modern",
    primaryColor: "#3b82f6", // default blue
    font: "inter",
  },
};

type ResumeAction =
  | { type: "UPDATE_PERSONAL_INFO"; payload: Partial<PersonalInfo> }
  | { type: "UPDATE_SUMMARY"; payload: string }
  // Work Experience
  | { type: "ADD_WORK_EXPERIENCE" }
  | { type: "UPDATE_WORK_EXPERIENCE"; payload: { id: string; data: Partial<WorkExperience> } }
  | { type: "DELETE_WORK_EXPERIENCE"; payload: string }
  | { type: "REORDER_WORK_EXPERIENCE"; payload: WorkExperience[] }
  // Education
  | { type: "ADD_EDUCATION" }
  | { type: "UPDATE_EDUCATION"; payload: { id: string; data: Partial<Education> } }
  | { type: "DELETE_EDUCATION"; payload: string }
  | { type: "REORDER_EDUCATION"; payload: Education[] }
  // Projects
  | { type: "ADD_PROJECT" }
  | { type: "UPDATE_PROJECT"; payload: { id: string; data: Partial<Project> } }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "REORDER_PROJECT"; payload: Project[] }
  // Skills
  | { type: "ADD_SKILL" }
  | { type: "UPDATE_SKILL"; payload: { id: string; data: Partial<SkillCategory> } }
  | { type: "DELETE_SKILL"; payload: string }
  // Languages
  | { type: "ADD_LANGUAGE" }
  | { type: "UPDATE_LANGUAGE"; payload: { id: string; data: Partial<Language> } }
  | { type: "DELETE_LANGUAGE"; payload: string }
  // Certifications
  | { type: "ADD_CERTIFICATION" }
  | { type: "UPDATE_CERTIFICATION"; payload: { id: string; data: Partial<Certification> } }
  | { type: "DELETE_CERTIFICATION"; payload: string }
  // Sections and Visibility
  | { type: "REORDER_SECTIONS"; payload: string[] }
  | { type: "TOGGLE_SECTION_VISIBILITY"; payload: string }
  // Theme
  | { type: "UPDATE_THEME"; payload: Partial<ResumeState["theme"]> }
  // Load / Reset
  | { type: "LOAD_STATE"; payload: ResumeState }
  | { type: "RESET_STATE" }
  | { type: "CLEAR_ALL" };

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case "UPDATE_PERSONAL_INFO":
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload },
      };
    case "UPDATE_SUMMARY":
      return {
        ...state,
        summary: action.payload,
      };
    case "ADD_WORK_EXPERIENCE": {
      const newItem: WorkExperience = {
        id: `exp-${Date.now()}`,
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      };
      return {
        ...state,
        workExperience: [...state.workExperience, newItem],
      };
    }
    case "UPDATE_WORK_EXPERIENCE":
      return {
        ...state,
        workExperience: state.workExperience.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case "DELETE_WORK_EXPERIENCE":
      return {
        ...state,
        workExperience: state.workExperience.filter((item) => item.id !== action.payload),
      };
    case "REORDER_WORK_EXPERIENCE":
      return {
        ...state,
        workExperience: action.payload,
      };
    case "ADD_EDUCATION": {
      const newItem: Education = {
        id: `edu-${Date.now()}`,
        school: "",
        degree: "",
        fieldOfStudy: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      };
      return {
        ...state,
        education: [...state.education, newItem],
      };
    }
    case "UPDATE_EDUCATION":
      return {
        ...state,
        education: state.education.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case "DELETE_EDUCATION":
      return {
        ...state,
        education: state.education.filter((item) => item.id !== action.payload),
      };
    case "REORDER_EDUCATION":
      return {
        ...state,
        education: action.payload,
      };
    case "ADD_PROJECT": {
      const newItem: Project = {
        id: `proj-${Date.now()}`,
        name: "",
        role: "",
        url: "",
        technologies: "",
        description: "",
      };
      return {
        ...state,
        projects: [...state.projects, newItem],
      };
    }
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((item) => item.id !== action.payload),
      };
    case "REORDER_PROJECT":
      return {
        ...state,
        projects: action.payload,
      };
    case "ADD_SKILL": {
      const newItem: SkillCategory = {
        id: `skill-${Date.now()}`,
        name: "Category",
        skills: "",
      };
      return {
        ...state,
        skills: [...state.skills, newItem],
      };
    }
    case "UPDATE_SKILL":
      return {
        ...state,
        skills: state.skills.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case "DELETE_SKILL":
      return {
        ...state,
        skills: state.skills.filter((item) => item.id !== action.payload),
      };
    case "ADD_LANGUAGE": {
      const newItem: Language = {
        id: `lang-${Date.now()}`,
        name: "",
        proficiency: "",
      };
      return {
        ...state,
        languages: [...state.languages, newItem],
      };
    }
    case "UPDATE_LANGUAGE":
      return {
        ...state,
        languages: state.languages.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case "DELETE_LANGUAGE":
      return {
        ...state,
        languages: state.languages.filter((item) => item.id !== action.payload),
      };
    case "ADD_CERTIFICATION": {
      const newItem: Certification = {
        id: `cert-${Date.now()}`,
        name: "",
        issuer: "",
        date: "",
      };
      return {
        ...state,
        certifications: [...state.certifications, newItem],
      };
    }
    case "UPDATE_CERTIFICATION":
      return {
        ...state,
        certifications: state.certifications.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case "DELETE_CERTIFICATION":
      return {
        ...state,
        certifications: state.certifications.filter((item) => item.id !== action.payload),
      };
    case "REORDER_SECTIONS":
      return {
        ...state,
        sectionsOrder: action.payload,
      };
    case "TOGGLE_SECTION_VISIBILITY":
      return {
        ...state,
        visibleSections: {
          ...state.visibleSections,
          [action.payload]: !state.visibleSections[action.payload],
        },
      };
    case "UPDATE_THEME":
      return {
        ...state,
        theme: { ...state.theme, ...action.payload },
      };
    case "LOAD_STATE":
      return action.payload;
    case "RESET_STATE":
      return INITIAL_STATE;
    case "CLEAR_ALL":
      return {
        personalInfo: {
          name: "",
          title: "",
          email: "",
          phone: "",
          website: "",
          github: "",
          linkedin: "",
          location: "",
          photo: "",
        },
        summary: "",
        workExperience: [],
        education: [],
        projects: [],
        skills: [],
        languages: [],
        certifications: [],
        sectionsOrder: DEFAULT_SECTIONS_ORDER,
        visibleSections: {
          summary: true,
          workExperience: true,
          education: true,
          projects: true,
          skills: true,
          languages: true,
          certifications: true,
        },
        theme: {
          template: "modern",
          primaryColor: "#3b82f6",
          font: "inter",
        },
      };
    default:
      return state;
  }
}

interface ResumeContextType {
  state: ResumeState;
  dispatch: React.Dispatch<ResumeAction>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("resume-craft-state");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.personalInfo && parsed.theme) {
          dispatch({ type: "LOAD_STATE", payload: parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("resume-craft-state", JSON.stringify(state));
      } catch (e) {
        console.error("Failed to save state to localStorage", e);
      }
    }
  }, [state, isLoaded]);

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
