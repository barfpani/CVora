/**
 * Opens a dedicated print route that renders the real resume HTML.
 * The browser print dialog can then save a text-based PDF instead of a raster snapshot.
 */
export async function exportToPDF(_elementId: string, filename: string = "resume.pdf") {
  const printUrl = new URL("/print", window.location.origin);
  printUrl.searchParams.set("filename", filename);
  printUrl.searchParams.set("ts", String(Date.now()));

  const printWindow = window.open(printUrl.toString(), "_blank", "noopener,noreferrer");

  if (!printWindow) {
    console.error("Unable to open the print window. Please allow pop-ups for this site.");
  }
}
