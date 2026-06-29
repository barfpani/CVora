"use client";

import React, { useState, useEffect } from "react";
import { useResume } from "../context/resume-state";
import { useTheme } from "next-themes";
import EditorPanel from "../components/editor/Forms";
import ResumeSheet, {
  RESUME_PAGE_GAP,
  RESUME_PAGE_HEIGHT,
  RESUME_PAGE_WIDTH,
} from "../components/preview/ResumeSheet";
import { exportToPDF } from "../utils/pdf";
import {
  Download,
  Trash2,
  RefreshCw,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  FileCheck,
} from "lucide-react";

export default function Home() {
  const { state, dispatch } = useResume();
  const { theme, personalInfo } = state;
  const { theme: currentTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [zoomScale, setZoomScale] = useState<number>(0.60); // Default zoom scale to fit standard laptops
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

        {/* Right Side: Live Preview */}
        <section className="lg:col-span-6 xl:col-span-5 flex flex-col gap-4">
          {/* Preview Controls */}
          <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
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
                  onClick={() => setZoomScale(0.60)}
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
            <div className="overflow-auto max-h-[calc(100vh-280px)] min-h-[500px] p-6 relative">
              <div
                  className="mx-auto"             
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
                    transformOrigin: "top left",
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
