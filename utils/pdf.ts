import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

/**
 * Captures the resume sheet DOM element and downloads it as a clean A4 PDF.
 * The element must be sized at exactly 794×1123px (A4 at 96dpi).
 * @param elementId The ID of the HTML element representing the resume sheet.
 * @param filename The output PDF filename.
 */
export async function exportToPDF(elementId: string, filename: string = "resume.pdf") {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  try {
    // Temporarily freeze the element size and hide drag handles for a clean capture
    const originalBoxShadow = element.style.boxShadow;
    const originalBorderRadius = element.style.borderRadius;
    element.style.boxShadow = "none";
    element.style.borderRadius = "0";

    // Hide all drag handle overlays during capture
    const dragHandles = element.querySelectorAll<HTMLElement>("[title='Drag to reorder section']");
    const savedDisplays: string[] = [];
    dragHandles.forEach((el, i) => {
      savedDisplays[i] = el.style.display;
      el.style.display = "none";
    });

    // Render the element at 2× scale for sharp output
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      // Explicitly specify the element's A4 pixel dimensions so html2canvas
      // doesn't infer them from a CSS transform-scaled parent
      width: 794,
      height: 1123,
    });

    // Restore original styles
    element.style.boxShadow = originalBoxShadow;
    element.style.borderRadius = originalBorderRadius;
    dragHandles.forEach((el, i) => {
      el.style.display = savedDisplays[i];
    });

    // A4 dimensions in mm
    const A4_W = 210;
    const A4_H = 297;

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // Fit the captured image exactly to one A4 page
    pdf.addImage(imgData, "JPEG", 0, 0, A4_W, A4_H, undefined, "FAST");

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}
