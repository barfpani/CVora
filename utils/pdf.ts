import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

/**
 * Captures the stacked resume preview and downloads it as a clean A4 PDF.
 * Each page is rendered independently to preserve multi-page layouts.
 * @param elementId The ID of the HTML element containing the resume pages.
 * @param filename The output PDF filename.
 */
export async function exportToPDF(elementId: string, filename: string = "resume.pdf") {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  const dragHandles = element.querySelectorAll<HTMLElement>("[title='Drag to reorder section']");
  const savedDisplays: string[] = [];
  let exportRoot: HTMLDivElement | null = null;

  try {
    const pages = Array.from(
      element.querySelectorAll<HTMLElement>("[data-resume-page='true']")
    );
    if (pages.length === 0) {
      console.error("No resume pages were found for export.");
      return;
    }

    dragHandles.forEach((el, i) => {
      savedDisplays[i] = el.style.display;
      el.style.display = "none";
    });

    exportRoot = document.createElement("div");
    exportRoot.setAttribute("data-export-root", "true");
    exportRoot.style.position = "fixed";
    exportRoot.style.left = "-10000px";
    exportRoot.style.top = "0";
    exportRoot.style.zIndex = "-1";
    exportRoot.style.pointerEvents = "none";
    exportRoot.style.background = "#ffffff";
    exportRoot.style.padding = "0";
    exportRoot.style.margin = "0";

    const exportPages = pages.map((page) => {
      const clone = page.cloneNode(true) as HTMLElement;
      clone.style.transform = "none";
      clone.style.margin = "0";
      clone.style.boxShadow = "none";
      clone.style.borderRadius = "0";
      clone.style.opacity = "1";
      clone.style.filter = "none";
      clone.querySelectorAll<HTMLElement>("[title='Drag to reorder section']").forEach((handle) => {
        handle.remove();
      });
      exportRoot?.appendChild(clone);
      return clone;
    });

    document.body.appendChild(exportRoot);

    // A4 dimensions in mm
    const A4_W = 210;
    const A4_H = 297;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    let isFirstPage = true;

    for (const page of exportPages) {
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: page.offsetWidth,
        height: page.offsetHeight,
      });

      if (!isFirstPage) {
        pdf.addPage("a4", "portrait");
      }

      pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, 0, A4_W, A4_H, undefined, "FAST");
      isFirstPage = false;
    }

    dragHandles.forEach((el, i) => {
      el.style.display = savedDisplays[i];
    });

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    dragHandles.forEach((el, i) => {
      el.style.display = savedDisplays[i] ?? "";
    });
    exportRoot?.remove();
  }
}
