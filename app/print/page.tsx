"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useResume } from "../../context/resume-state";
import ResumeSheet from "../../components/preview/ResumeSheet";

export default function PrintPage() {
  const { state, isLoaded } = useResume();
  const searchParams = useSearchParams();
  const hasPrintedRef = useRef(false);

  const filename = searchParams.get("filename") ?? `${state.theme.documentName || "resume"}.pdf`;
  const documentTitle = useMemo(() => filename.replace(/\.pdf$/i, ""), [filename]);

  useEffect(() => {
    document.title = documentTitle;
  }, [documentTitle]);

  useEffect(() => {
    if (!isLoaded || hasPrintedRef.current) return;

    hasPrintedRef.current = true;

    const frame = requestAnimationFrame(() => {
      window.print();
    });

    const handleAfterPrint = () => {
      window.close();
    };

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [isLoaded]);

  return (
    <>
      <style>{`
        @page {
          size: A4;
          margin: 0;
        }

        html, body {
          background: #ffffff;
        }

        @media print {
          body {
            margin: 0;
            background: #ffffff !important;
          }

          #print-shell {
            padding: 0 !important;
            background: #ffffff !important;
          }

          #resume-preview-stack {
            gap: 0 !important;
          }

          [data-resume-page="true"] {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            break-after: page;
            page-break-after: always;
          }

          [data-resume-page="true"]:last-child {
            break-after: auto;
            page-break-after: auto;
          }
        }
      `}</style>

      <main
        id="print-shell"
        className="min-h-screen bg-white px-4 py-6 text-zinc-900 print:min-h-0 print:p-0"
      >
        <div className="mx-auto flex w-fit flex-col gap-7 print:gap-0">
          <ResumeSheet />
        </div>
      </main>
    </>
  );
}
