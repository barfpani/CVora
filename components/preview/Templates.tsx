"use client";

import React from "react";
import { ResumeState, WorkExperience, Education, Project, SkillCategory, Language, Certification } from "../../context/resume-state";
import { Mail, Phone, Globe, MapPin } from "lucide-react";

function Github({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function Linkedin({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface SectionProps {
  state: ResumeState;
  primaryColor: string;
}

// -------------------------------------------------------------
// Helper to format HTML safely from Tiptap editor
// -------------------------------------------------------------
function RichTextDisplay({ content, className }: { content: string; className?: string }) {
  if (!content) return null;
  return (
    <div
      className={`prose max-w-none dark:prose-invert text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

// -------------------------------------------------------------
// Font Mapper Helper
// -------------------------------------------------------------
export function getFontClass(font: ResumeState["theme"]["font"]): string {
  switch (font) {
    case "serif":
      return "font-serif";
    case "mono":
      return "font-mono";
    case "outfit":
      return "font-sans font-outfit";
    case "playfair":
      return "font-serif font-playfair";
    case "inter":
    default:
      return "font-sans font-inter";
  }
}

// -------------------------------------------------------------
// TEMPLATE HEADER RENDERER
// -------------------------------------------------------------
export function TemplateHeader({ state, primaryColor }: SectionProps) {
  const { personalInfo, theme } = state;
  const { template } = theme;

  // Modern Template Header
  if (template === "modern") {
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt={personalInfo.name}
              className="w-20 h-20 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800"
            />
          )}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50" style={{ color: primaryColor }}>
              {personalInfo.name || "Your Name"}
            </h1>
            <p className="text-sm font-semibold tracking-wide text-zinc-500 uppercase mt-1">
              {personalInfo.title || "Job Title"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" style={{ color: primaryColor }} />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" style={{ color: primaryColor }} />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" style={{ color: primaryColor }} />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" style={{ color: primaryColor }} />
              {personalInfo.website}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1.5">
              <Github className="h-3.5 w-3.5" style={{ color: primaryColor }} />
              {personalInfo.github}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="h-3.5 w-3.5" style={{ color: primaryColor }} />
              {personalInfo.linkedin}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Minimalist Template Header
  if (template === "minimalist") {
    return (
      <div className="text-center pb-5 border-b border-zinc-100 dark:border-zinc-900">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {personalInfo.name || "Your Name"}
        </h1>
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mt-1" style={{ color: primaryColor }}>
          {personalInfo.title || "Job Title"}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl mx-auto">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
          {personalInfo.github && <span>• {personalInfo.github}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </div>
    );
  }

  // Creative Template Header
  if (template === "creative") {
    return (
      <div className="relative p-6 -mx-8 -mt-8 mb-6 rounded-t-xl" style={{ backgroundColor: `${primaryColor}12` }}>
        <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primaryColor }} />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
              {personalInfo.name || "Your Name"}
            </h1>
            <p className="text-sm font-bold tracking-wide mt-1" style={{ color: primaryColor }}>
              {personalInfo.title || "Job Title"}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 md:text-right">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {(personalInfo.website || personalInfo.github) && (
              <span>
                {personalInfo.website && `${personalInfo.website} `}
                {personalInfo.github && `| ${personalInfo.github}`}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Professional Template Header (default)
  return (
    <div className="pb-5 border-b-2 border-zinc-800 dark:border-zinc-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {personalInfo.name || "Your Name"}
          </h1>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1">
            {personalInfo.title || "Job Title"}
          </p>
        </div>
        <div className="flex flex-col text-xs text-zinc-600 dark:text-zinc-400 md:text-right mt-3 md:mt-0">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <span className="font-semibold" style={{ color: primaryColor }}>{personalInfo.email}</span>}
          <div className="flex items-center gap-2 mt-1 md:justify-end text-[10px]">
            {personalInfo.website && <span>{personalInfo.website}</span>}
            {personalInfo.github && <span>• {personalInfo.github}</span>}
            {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TEMPLATE SECTION TITLE
// -------------------------------------------------------------
export function TemplateSectionTitle({ title, primaryColor, template }: { title: string; primaryColor: string; template: string }) {
  if (template === "modern") {
    return (
      <div className="mb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className="w-1.5 h-3.5 rounded" style={{ backgroundColor: primaryColor }} />
          {title}
        </h3>
      </div>
    );
  }

  if (template === "minimalist") {
    return (
      <div className="mb-3 mt-4 border-b border-zinc-200 dark:border-zinc-800 pb-1">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
          {title}
        </h3>
      </div>
    );
  }

  if (template === "creative") {
    return (
      <div className="mb-3.5 mt-5">
        <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 pb-1 border-b-2" style={{ borderColor: `${primaryColor}40` }}>
          <span className="px-2 py-0.5 rounded text-[11px] text-white font-bold mr-2 align-middle" style={{ backgroundColor: primaryColor }}>
            //
          </span>
          {title}
        </h3>
      </div>
    );
  }

  // Professional Template Title
  return (
    <div className="mb-3 mt-4 border-b border-zinc-300 dark:border-zinc-700 pb-1">
      <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: primaryColor }}>
        {title}
      </h3>
    </div>
  );
}

// -------------------------------------------------------------
// SECTIONS RENDERERS
// -------------------------------------------------------------
export function RenderSummary({ state, primaryColor }: SectionProps) {
  const { summary, theme } = state;
  if (!summary || summary.trim() === "<p></p>" || summary.trim() === "") return null;

  return (
    <div className="resume-section">
      <TemplateSectionTitle title="Professional Summary" primaryColor={primaryColor} template={theme.template} />
      <RichTextDisplay content={summary} className="text-zinc-700 dark:text-zinc-300" />
    </div>
  );
}

export function RenderExperience({ state, primaryColor }: SectionProps) {
  const { workExperience, theme } = state;
  const activeExps = workExperience.filter(exp => exp.company || exp.position);
  if (activeExps.length === 0) return null;

  return (
    <div className="resume-section">
      <TemplateSectionTitle title="Work Experience" primaryColor={primaryColor} template={theme.template} />
      <div className="space-y-4">
        {activeExps.map((exp) => (
          <div key={exp.id} className="space-y-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {exp.position}
                </span>
                {exp.company && (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    at <span className="font-semibold text-zinc-700 dark:text-zinc-300">{exp.company}</span>
                  </span>
                )}
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                {exp.location && ` | ${exp.location}`}
              </div>
            </div>
            <RichTextDisplay content={exp.description} className="mt-1 pl-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RenderEducation({ state, primaryColor }: SectionProps) {
  const { education, theme } = state;
  const activeEdu = education.filter(edu => edu.school || edu.degree);
  if (activeEdu.length === 0) return null;

  return (
    <div className="resume-section">
      <TemplateSectionTitle title="Education" primaryColor={primaryColor} template={theme.template} />
      <div className="space-y-3">
        {activeEdu.map((edu) => (
          <div key={edu.id} className="space-y-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
              <div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{edu.degree}</span>
                {edu.fieldOfStudy && (
                  <span className="text-xs text-zinc-600 dark:text-zinc-400"> in {edu.fieldOfStudy}</span>
                )}
                {edu.school && (
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">{edu.school}</div>
                )}
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                {edu.startDate} – {edu.current ? "Ongoing" : edu.endDate}
                {edu.location && ` | ${edu.location}`}
              </div>
            </div>
            {edu.description && (
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 pl-1 leading-normal">
                {edu.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RenderProjects({ state, primaryColor }: SectionProps) {
  const { projects, theme } = state;
  const activeProjs = projects.filter(p => p.name);
  if (activeProjs.length === 0) return null;

  return (
    <div className="resume-section">
      <TemplateSectionTitle title="Projects" primaryColor={primaryColor} template={theme.template} />
      <div className="space-y-4">
        {activeProjs.map((proj) => (
          <div key={proj.id} className="space-y-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{proj.name}</span>
                {proj.role && <span className="text-[10px] text-zinc-500 font-medium">({proj.role})</span>}
                {proj.url && (
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Link
                  </a>
                )}
              </div>
              {proj.technologies && (
                <div className="text-[10px] text-zinc-500 font-semibold max-w-xs truncate">
                  {proj.technologies}
                </div>
              )}
            </div>
            <RichTextDisplay content={proj.description} className="mt-1 pl-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RenderSkills({ state, primaryColor }: SectionProps) {
  const { skills, theme } = state;
  const activeSkills = skills.filter(s => s.name && s.skills);
  if (activeSkills.length === 0) return null;

  return (
    <div className="resume-section">
      <TemplateSectionTitle title="Skills" primaryColor={primaryColor} template={theme.template} />
      <div className="space-y-2">
        {activeSkills.map((category) => {
          const tags = category.skills.split(",").map(t => t.trim()).filter(Boolean);
          return (
            <div key={category.id} className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-xs">
              <span className="font-bold text-zinc-800 dark:text-zinc-200 sm:w-1/4 shrink-0">
                {category.name}:
              </span>
              <div className="flex flex-wrap gap-1.5 sm:w-3/4">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-350 text-[10px] font-medium rounded border border-zinc-200 dark:border-zinc-800/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RenderLanguages({ state, primaryColor }: SectionProps) {
  const { languages, theme } = state;
  const activeLangs = languages.filter(l => l.name);
  if (activeLangs.length === 0) return null;

  return (
    <div className="resume-section">
      <TemplateSectionTitle title="Languages" primaryColor={primaryColor} template={theme.template} />
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
        {activeLangs.map((lang) => (
          <div key={lang.id} className="flex items-center gap-2">
            <span className="font-bold text-zinc-850 dark:text-zinc-150">{lang.name}</span>
            {lang.proficiency && (
              <span className="text-[10px] text-zinc-500 font-semibold bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-150 dark:border-zinc-800">
                {lang.proficiency}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RenderCertifications({ state, primaryColor }: SectionProps) {
  const { certifications, theme } = state;
  const activeCerts = certifications.filter(c => c.name);
  if (activeCerts.length === 0) return null;

  return (
    <div className="resume-section">
      <TemplateSectionTitle title="Certifications & Awards" primaryColor={primaryColor} template={theme.template} />
      <div className="space-y-2">
        {activeCerts.map((cert) => (
          <div key={cert.id} className="flex justify-between items-baseline text-xs">
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{cert.name}</span>
              {cert.issuer && <span className="text-zinc-500 dark:text-zinc-400"> – {cert.issuer}</span>}
            </div>
            {cert.date && (
              <span className="text-[10px] text-zinc-500 font-semibold">{cert.date}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
