/**
 * Triggers the browser print dialog from the current window so the user can
 * save a text-based PDF generated from real HTML.
 */
export async function exportToPDF(_elementId: string, filename: string = "resume.pdf") {
  const originalTitle = document.title;
  const printTitle = filename.replace(/\.pdf$/i, "");

  document.title = printTitle;

  try {
    window.print();
  } finally {
    requestAnimationFrame(() => {
      document.title = originalTitle;
    });
  }
}
