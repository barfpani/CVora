"use client";

import React, { useState } from "react";
import { useResume, WorkExperience, Education, Project, SkillCategory, Language, Certification } from "../../context/resume-state";
import RichTextEditor from "./RichTextEditor";
import {
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Cpu,
  Languages,
  Award,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Eye,
  EyeOff,
  Settings
} from "lucide-react";

export default function EditorPanel() {
  const { state, dispatch } = useResume();
  const [activeTab, setActiveTab] = useState<string>("personal");

  const tabs = [
    { id: "personal", label: "Personal Details", icon: User },
    { id: "summary", label: "Professional Summary", icon: FileText },
    { id: "experience", label: "Work Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "skills", label: "Skills", icon: Cpu },
    { id: "languages", label: "Languages", icon: Languages },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "visibility", label: "Sections Order", icon: Settings },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-md">
      {/* Tab Navigation */}
      <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-2 lg:w-64 shrink-0 gap-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 shrink-0 lg:shrink lg:w-full ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-140px)]">
        {activeTab === "personal" && <PersonalInfoForm />}
        {activeTab === "summary" && <SummaryForm />}
        {activeTab === "experience" && <ExperienceForm />}
        {activeTab === "education" && <EducationForm />}
        {activeTab === "projects" && <ProjectsForm />}
        {activeTab === "skills" && <SkillsForm />}
        {activeTab === "languages" && <LanguagesForm />}
        {activeTab === "certifications" && <CertificationsForm />}
        {activeTab === "visibility" && <VisibilityForm />}
      </div>
    </div>
  );
}

function PersonalInfoForm() {
  const { state, dispatch } = useResume();
  const { personalInfo } = state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "UPDATE_PERSONAL_INFO",
      payload: { [e.target.name]: e.target.value },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Personal Details</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Provide your contact info and personal links.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Full Name</label>
          <input
            type="text"
            name="name"
            value={personalInfo.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Job Title</label>
          <input
            type="text"
            name="title"
            value={personalInfo.title}
            onChange={handleChange}
            placeholder="Senior Frontend Developer"
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Email Address</label>
          <input
            type="email"
            name="email"
            value={personalInfo.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={personalInfo.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Location</label>
          <input
            type="text"
            name="location"
            value={personalInfo.location}
            onChange={handleChange}
            placeholder="San Francisco, CA"
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Personal Website</label>
          <input
            type="text"
            name="website"
            value={personalInfo.website}
            onChange={handleChange}
            placeholder="johndoe.dev"
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">GitHub Link</label>
          <input
            type="text"
            name="github"
            value={personalInfo.github}
            onChange={handleChange}
            placeholder="github.com/johndoe"
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">LinkedIn Link</label>
          <input
            type="text"
            name="linkedin"
            value={personalInfo.linkedin}
            onChange={handleChange}
            placeholder="linkedin.com/in/johndoe"
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Profile Photo URL (Optional)</label>
          <input
            type="text"
            name="photo"
            value={personalInfo.photo}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/... or base64"
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

function SummaryForm() {
  const { state, dispatch } = useResume();

  const handleEditorChange = (html: string) => {
    dispatch({ type: "UPDATE_SUMMARY", payload: html });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Professional Summary</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Write a brief statement highlighting your core qualifications and objectives.</p>
      </div>

      <RichTextEditor value={state.summary} onChange={handleEditorChange} />
    </div>
  );
}

function ExperienceForm() {
  const { state, dispatch } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(
    state.workExperience[0]?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const updateItem = (id: string, data: Partial<WorkExperience>) => {
    dispatch({ type: "UPDATE_WORK_EXPERIENCE", payload: { id, data } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Work Experience</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Detail your past employment, roles, and major projects.</p>
        </div>
        <button
          onClick={() => {
            dispatch({ type: "ADD_WORK_EXPERIENCE" });
            // Expand the newly added item
            setTimeout(() => {
              const lastItem = state.workExperience[state.workExperience.length - 1];
              if (lastItem) setExpandedId(lastItem.id);
            }, 50);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Job
        </button>
      </div>

      <div className="space-y-3">
        {state.workExperience.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500 text-sm">
            No work experience added yet. Click "Add Job" to begin.
          </div>
        ) : (
          state.workExperience.map((exp, idx) => {
            const isExpanded = expandedId === exp.id;
            return (
              <div
                key={exp.id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50/30 dark:bg-zinc-900/10 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                {/* Header Toggle */}
                <div
                  className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 cursor-pointer select-none"
                  onClick={() => toggleExpand(exp.id)}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                      {exp.position || "New Role"}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {exp.company || "New Company"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => dispatch({ type: "DELETE_WORK_EXPERIENCE", payload: exp.id })}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleExpand(exp.id)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-md transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                {isExpanded && (
                  <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase">Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updateItem(exp.id, { position: e.target.value })}
                          placeholder="e.g. Senior Frontend Architect"
                          className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateItem(exp.id, { company: e.target.value })}
                          placeholder="e.g. Google Inc."
                          className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateItem(exp.id, { location: e.target.value })}
                          placeholder="e.g. San Francisco, CA"
                          className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-zinc-500 uppercase">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => updateItem(exp.id, { startDate: e.target.value })}
                            placeholder="e.g. Jun 2021"
                            className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-zinc-500 uppercase">End Date</label>
                          <input
                            type="text"
                            value={exp.current ? "" : exp.endDate}
                            disabled={exp.current}
                            onChange={(e) => updateItem(exp.id, { endDate: e.target.value })}
                            placeholder={exp.current ? "Present" : "e.g. Dec 2023"}
                            className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-zinc-50 dark:disabled:bg-zinc-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-job-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) => updateItem(exp.id, { current: e.target.checked })}
                        className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`current-job-${exp.id}`} className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                        I am currently working in this role
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase">Description / Key Achievements</label>
                      <RichTextEditor
                        value={exp.description}
                        onChange={(html) => updateItem(exp.id, { description: html })}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function EducationForm() {
  const { state, dispatch } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(
    state.education[0]?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const updateItem = (id: string, data: Partial<Education>) => {
    dispatch({ type: "UPDATE_EDUCATION", payload: { id, data } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Education</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">List your degrees, certifications, and institutions.</p>
        </div>
        <button
          onClick={() => {
            dispatch({ type: "ADD_EDUCATION" });
            setTimeout(() => {
              const lastItem = state.education[state.education.length - 1];
              if (lastItem) setExpandedId(lastItem.id);
            }, 50);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add School
        </button>
      </div>

      <div className="space-y-3">
        {state.education.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500 text-sm">
            No education history added yet. Click "Add School" to begin.
          </div>
        ) : (
          state.education.map((edu, idx) => {
            const isExpanded = expandedId === edu.id;
            return (
              <div
                key={edu.id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50/30 dark:bg-zinc-900/10 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                {/* Header Toggle */}
                <div
                  className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 cursor-pointer select-none"
                  onClick={() => toggleExpand(edu.id)}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                      {edu.degree ? `${edu.degree} in ${edu.fieldOfStudy || "Field"}` : "New Degree"}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {edu.school || "New Institution"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => dispatch({ type: "DELETE_EDUCATION", payload: edu.id })}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleExpand(edu.id)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-md transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                {isExpanded && (
                  <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase">School / University</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => updateItem(edu.id, { school: e.target.value })}
                          placeholder="e.g. UC Berkeley"
                          className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateItem(edu.id, { degree: e.target.value })}
                          placeholder="e.g. B.S. or M.S."
                          className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase">Field of Study</label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateItem(edu.id, { fieldOfStudy: e.target.value })}
                          placeholder="e.g. Computer Science"
                          className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase">Location</label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => updateItem(edu.id, { location: e.target.value })}
                          placeholder="e.g. Berkeley, CA"
                          className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-zinc-500 uppercase">Start Date</label>
                          <input
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => updateItem(edu.id, { startDate: e.target.value })}
                            placeholder="e.g. Sep 2017"
                            className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-zinc-500 uppercase">Graduation / End Date</label>
                          <input
                            type="text"
                            value={edu.current ? "" : edu.endDate}
                            disabled={edu.current}
                            onChange={(e) => updateItem(edu.id, { endDate: e.target.value })}
                            placeholder={edu.current ? "Ongoing" : "e.g. May 2021"}
                            className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-zinc-50 dark:disabled:bg-zinc-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-edu-${edu.id}`}
                        checked={edu.current}
                        onChange={(e) => updateItem(edu.id, { current: e.target.checked })}
                        className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`current-edu-${edu.id}`} className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                        I am currently studying here
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase">Additional Info / Accomplishments</label>
                      <textarea
                        value={edu.description}
                        onChange={(e) => updateItem(edu.id, { description: e.target.value })}
                        placeholder="e.g. GPA 3.9, Courses in AI, President of Hackers club..."
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ProjectsForm() {
  const { state, dispatch } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(
    state.projects[0]?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const updateItem = (id: string, data: Partial<Project>) => {
    dispatch({ type: "UPDATE_PROJECT", payload: { id, data } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Projects</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Showcase relevant personal or open-source software projects.</p>
        </div>
        <button
          onClick={() => {
            dispatch({ type: "ADD_PROJECT" });
            setTimeout(() => {
              const lastItem = state.projects[state.projects.length - 1];
              if (lastItem) setExpandedId(lastItem.id);
            }, 50);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Project
        </button>
      </div>

      <div className="space-y-3">
        {state.projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500 text-sm">
            No projects added yet. Click "Add Project" to begin.
          </div>
        ) : (
          state.projects.map((proj, idx) => {
            const isExpanded = expandedId === proj.id;
            return (
              <div
                key={proj.id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50/30 dark:bg-zinc-900/10 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                {/* Header Toggle */}
                <div
                  className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 cursor-pointer select-none"
                  onClick={() => toggleExpand(proj.id)}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                      {proj.name || "New Project"}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {proj.role || "Creator / Contributor"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => dispatch({ type: "DELETE_PROJECT", payload: proj.id })}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleExpand(proj.id)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-md transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                {isExpanded && (
                  <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateItem(proj.id, { name: e.target.value })}
                          placeholder="e.g. Resume Craft"
                          className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase">Your Role</label>
                        <input
                          type="text"
                          value={proj.role}
                          onChange={(e) => updateItem(proj.id, { role: e.target.value })}
                          placeholder="e.g. Lead Developer / Creator"
                          className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase">Project URL</label>
                        <input
                          type="text"
                          value={proj.url}
                          onChange={(e) => updateItem(proj.id, { url: e.target.value })}
                          placeholder="e.g. https://resumecraft.dev"
                          className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase">Technologies Used</label>
                        <input
                          type="text"
                          value={proj.technologies}
                          onChange={(e) => updateItem(proj.id, { technologies: e.target.value })}
                          placeholder="e.g. Next.js, React, Tailwind CSS"
                          className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase">Description</label>
                      <RichTextEditor
                        value={proj.description}
                        onChange={(html) => updateItem(proj.id, { description: html })}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function SkillsForm() {
  const { state, dispatch } = useResume();

  const updateItem = (id: string, data: Partial<SkillCategory>) => {
    dispatch({ type: "UPDATE_SKILL", payload: { id, data } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Skills Categories</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Organize your skillsets into categories (e.g. Languages, Libraries).</p>
        </div>
        <button
          onClick={() => dispatch({ type: "ADD_SKILL" })}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Category
        </button>
      </div>

      <div className="space-y-4">
        {state.skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500 text-sm">
            No skills added yet. Click "Add Category" to begin.
          </div>
        ) : (
          state.skills.map((skill, idx) => (
            <div
              key={skill.id}
              className="flex flex-col md:flex-row items-start gap-4 p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="w-full md:w-1/3 space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Category Name</label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateItem(skill.id, { name: e.target.value })}
                  placeholder="e.g. Libraries & APIs"
                  className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
              </div>
              <div className="w-full md:w-2/3 space-y-1 flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={skill.skills}
                    onChange={(e) => updateItem(skill.id, { skills: e.target.value })}
                    placeholder="e.g. React, Next.js, Redux, Tailwind"
                    className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => dispatch({ type: "DELETE_SKILL", payload: skill.id })}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors cursor-pointer shrink-0"
                  title="Delete Category"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function LanguagesForm() {
  const { state, dispatch } = useResume();

  const updateItem = (id: string, data: Partial<Language>) => {
    dispatch({ type: "UPDATE_LANGUAGE", payload: { id, data } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Languages</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">List languages you speak and your proficiency level.</p>
        </div>
        <button
          onClick={() => dispatch({ type: "ADD_LANGUAGE" })}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Language
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {state.languages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500 text-sm">
            No languages added yet. Click "Add Language" to begin.
          </div>
        ) : (
          state.languages.map((lang) => (
            <div
              key={lang.id}
              className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={lang.name}
                  onChange={(e) => updateItem(lang.id, { name: e.target.value })}
                  placeholder="e.g. English"
                  className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  value={lang.proficiency}
                  onChange={(e) => updateItem(lang.id, { proficiency: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Proficiency</option>
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Professional">Professional</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Beginner">Beginner</option>
                </select>
              </div>
              <button
                onClick={() => dispatch({ type: "DELETE_LANGUAGE", payload: lang.id })}
                className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CertificationsForm() {
  const { state, dispatch } = useResume();

  const updateItem = (id: string, data: Partial<Certification>) => {
    dispatch({ type: "UPDATE_CERTIFICATION", payload: { id, data } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Certifications & Awards</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">List certifications, credentials, or awards you've earned.</p>
        </div>
        <button
          onClick={() => dispatch({ type: "ADD_CERTIFICATION" })}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Entry
        </button>
      </div>

      <div className="space-y-3">
        {state.certifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500 text-sm">
            No certifications added yet. Click "Add Entry" to begin.
          </div>
        ) : (
          state.certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex items-start md:items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateItem(cert.id, { name: e.target.value })}
                  placeholder="e.g. AWS Certified Architect"
                  className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateItem(cert.id, { issuer: e.target.value })}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  value={cert.date}
                  onChange={(e) => updateItem(cert.id, { date: e.target.value })}
                  placeholder="e.g. 2025"
                  className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => dispatch({ type: "DELETE_CERTIFICATION", payload: cert.id })}
                className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function VisibilityForm() {
  const { state, dispatch } = useResume();
  const { visibleSections } = state;

  const sectionLabels: Record<string, string> = {
    summary: "Professional Summary",
    workExperience: "Work Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    languages: "Languages",
    certifications: "Certifications & Awards",
  };

  const handleToggle = (key: string) => {
    dispatch({ type: "TOGGLE_SECTION_VISIBILITY", payload: key });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Section Visibility</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Toggle sections off or on. Hidden sections will not render in the live preview or PDF.</p>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
        {state.sectionsOrder.map((sectionId) => {
          const isVisible = visibleSections[sectionId] !== false;
          const label = sectionLabels[sectionId] || sectionId;

          return (
            <div key={sectionId} className="flex items-center justify-between p-4 bg-zinc-50/10 dark:bg-zinc-900/5">
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{label}</span>
              <button
                onClick={() => handleToggle(sectionId)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  isVisible
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100"
                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100"
                }`}
              >
                {isVisible ? (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    Visible
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    Hidden
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-950/30 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-normal">
          <strong>Pro-Tip:</strong> To rearrange the physical layout of your resume sections, simply hover over a section on the <strong>Right-Side Live Preview</strong> and drag it to your desired order.
        </p>
      </div>
    </div>
  );
}
