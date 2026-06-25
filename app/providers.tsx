"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { ResumeProvider } from "../context/resume-state";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ResumeProvider>{children}</ResumeProvider>
    </ThemeProvider>
  );
}
