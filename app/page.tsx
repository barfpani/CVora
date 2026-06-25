"use client";

import React, { useState, useEffect } from "react";
import { SECTION_FONT_KEYS, SectionFontKey, useResume } from "../context/resume-state";
import { useTheme } from "next-themes";
import EditorPanel from "../components/editor/Forms";
import ResumeSheet, {
  RESUME_PAGE_GAP,
  RESUME_PAGE_HEIGHT,
  RESUME_PAGE_WIDTH,
} from "../components/preview/ResumeSheet";
import { exportToPDF } from "../utils/pdf";
import {
  Sparkles,
  Download,
  Trash2,
  RefreshCw,
  Sun,
  Moon,
  Palette,
  Type,
  LayoutTemplate,
  ZoomIn,
  ZoomOut,
  FileCheck,
  FileText,
  TextCursorInput,
} from "lucide-react";

const COLOR_PRESETS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Slate", value: "#4b5563" },
];

const FONT_OPTIONS = [
  { name: "Inter (Sans)", value: "inter" },
  { name: "Outfit (Modern)", value: "outfit" },
  { name: "Merriweather (Serif)", value: "serif" },
  { name: "Playfair Display (Elegant)", value: "playfair" },
  { name: "Roboto Mono (Monospace)", value: "mono" },
];

const TEMPLATE_OPTIONS = [
  { name: "Modern Sidebar", value: "modern" },
  { name: "Clean Minimalist", value: "minimalist" },
  { name: "Corporate Professional", value: "professional" },
  { name: "Creative Bold", value: "creative" },
];

const SECTION_LABELS: Record<SectionFontKey, string> = {
  summary: "Summary",
  workExperience: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  languages: "Languages",
  certifications: "Certifications",
};

export default function Home() {
  const { state, dispatch } = useResume();
  const { theme, personalInfo } = state;
  const { theme: currentTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [zoomScale, setZoomScale] = useState<number>(0.65); // Default zoom scale to fit standard laptops
  const [pageCount, setPageCount] = useState(1);

  // Prevent hydration mismatches
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    const sanitizedName = (theme.documentName || personalInfo.name || "Resume")
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "")
      .replace(/\s+/g, "_");
    await exportToPDF("resume-preview-stack", `${sanitizedName || "Resume"}.pdf`);
    setIsExporting(false);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to load the sample data? This will overwrite your current progress.")) {
      dispatch({ type: "RESET_STATE" });
    }
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all data? This will empty all inputs.")) {
      dispatch({ type: "CLEAR_ALL" });
    }
  };

  const handleThemeChange = (
    field: "template" | "primaryColor" | "font" | "documentName",
    value: string
  ) => {
    dispatch({ type: "UPDATE_THEME", payload: { [field]: value } });
  };

  const handleSectionFontChange = (sectionId: SectionFontKey, value: string) => {
    dispatch({
      type: "UPDATE_THEME",
      payload: {
        sectionFonts: {
          ...theme.sectionFonts,
          [sectionId]: value as typeof theme.font,
        },
      },
    });
  };

  const handleContentFontSizeChange = (value: number) => {
    dispatch({
      type: "UPDATE_THEME",
      payload: { contentFontSize: value },
    });
  };

  const scaledPreviewHeight =
    (pageCount * RESUME_PAGE_HEIGHT + Math.max(0, pageCount - 1) * RESUME_PAGE_GAP) * zoomScale;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Navbar / Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
                Resume Craft
              </h1>
              <p className="text-[10px] text-zinc-500 font-medium">Free Resume Generator</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
              className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors"
              title="Toggle Dark Mode"
            >
              {currentTheme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Load Sample
            </button>

            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear All
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 rounded-lg shadow-md shadow-blue-500/10 transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Dashboard */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Editor Section */}
        <section className="lg:col-span-6 xl:col-span-7 h-full">
          <EditorPanel />
        </section>

        {/* Right Side: Customize & Live Preview */}
        <section className="lg:col-span-6 xl:col-span-5 flex flex-col gap-4">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Customize Template
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <label className="text-[11px] font-bold text-zinc-550 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-zinc-400" />
                  Resume File Name
                </label>
                <input
                  type="text"
                  value={theme.documentName}
                  onChange={(e) => handleThemeChange("documentName", e.target.value)}
                  placeholder="My Resume"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Template Style */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-550 uppercase tracking-wide flex items-center gap-1.5">
                  <LayoutTemplate className="h-3.5 w-3.5 text-zinc-400" />
                  Template
                </label>
                <select
                  value={theme.template}
                  onChange={(e) => handleThemeChange("template", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                >
                  {TEMPLATE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Family */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-550 uppercase tracking-wide flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5 text-zinc-400" />
                  Personal Details Font
                </label>
                <select
                  value={theme.font}
                  onChange={(e) => handleThemeChange("font", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                >
                  {FONT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-zinc-100 dark:border-zinc-900 p-3">
              <div className="flex items-center justify-between gap-3">
                <label className="text-[11px] font-bold text-zinc-550 uppercase tracking-wide flex items-center gap-1.5">
                  <TextCursorInput className="h-3.5 w-3.5 text-zinc-400" />
                  Section Font Size
                </label>
                <span className="text-[11px] font-semibold text-zinc-500">{theme.contentFontSize}px</span>
              </div>
              <input
                type="range"
                min={10}
                max={15}
                step={0.5}
                value={theme.contentFontSize}
                onChange={(e) => handleContentFontSizeChange(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-[11px] text-zinc-500">
                Applies to all resume sections below the personal details header.
              </p>
            </div>

            <div className="space-y-2 rounded-lg border border-zinc-100 dark:border-zinc-900 p-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-550 uppercase tracking-wide flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5 text-zinc-400" />
                  Section Fonts
                </label>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Each section can use its own font. Personal details stay controlled separately above.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {SECTION_FONT_KEYS.map((sectionId) => (
                  <div key={sectionId} className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      {SECTION_LABELS[sectionId]}
                    </label>
                    <select
                      value={theme.sectionFonts[sectionId]}
                      onChange={(e) => handleSectionFontChange(sectionId, e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    >
                      {FONT_OPTIONS.map((opt) => (
                        <option key={`${sectionId}-${opt.value}`} value={opt.value}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Accent Color Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-550 uppercase tracking-wide flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-zinc-400" />
                Accent Color
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected = theme.primaryColor.toLowerCase() === preset.value.toLowerCase();
                  return (
                    <button
                      key={preset.value}
                      onClick={() => handleThemeChange("primaryColor", preset.value)}
                      className={`h-6 w-6 rounded-full border transition-all duration-150 relative cursor-pointer ${isSelected
                        ? "border-zinc-900 scale-110 dark:border-zinc-100 shadow-md ring-2 ring-blue-500/20"
                        : "border-transparent hover:scale-105"
                        }`}
                      style={{ backgroundColor: preset.value }}
                      title={preset.name}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
                      )}
                    </button>
                  );
                })}

                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

                {/* Custom Color Input */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    id="custom-accent-color"
                    value={theme.primaryColor}
                    onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                    className="h-6 w-6 rounded-full border border-zinc-200 dark:border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden outline-none"
                    title="Choose Custom Color"
                  />
                  <label htmlFor="custom-accent-color" className="text-[10px] text-zinc-500 font-semibold cursor-pointer">
                    Custom Hex
                  </label>
                </div>
              </div>
            </div>

            {/* Scale/Zoom Selector */}
            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 pt-3">
              <span className="text-xs font-semibold text-zinc-500">Preview Scale: {Math.round(zoomScale * 100)}%</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoomScale(Math.max(0.5, zoomScale - 0.05))}
                  className="p-1 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded text-zinc-500 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setZoomScale(0.65)}
                  className="px-2 py-0.5 text-[10px] border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer"
                >
                  Reset Fit
                </button>
                <button
                  onClick={() => setZoomScale(Math.min(1.2, zoomScale + 0.05))}
                  className="p-1 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded text-zinc-500 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Container */}
          <div className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col relative">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 tracking-wide uppercase">Live PDF Document Sheet</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Scaled Preview Wrapper */}
            <div className="overflow-auto max-h-[calc(100vh-280px)] min-h-[500px] flex justify-center items-start py-6 relative">
              <div
                style={{
                  width: `${RESUME_PAGE_WIDTH * zoomScale}px`,
                  height: `${scaledPreviewHeight}px`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${RESUME_PAGE_WIDTH}px`,
                    transform: `scale(${zoomScale})`,
                    transformOrigin: "top center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  <ResumeSheet onPageCountChange={setPageCount} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
