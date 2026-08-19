// Type-only: erased at build, so importing it here does not pull jsPDF into
// the route's bundle. The runtime import stays inside buildRequestPdf.
import type { jsPDF } from "jspdf";

import { site } from "@/config/site";

import type { CakeDesign } from "@/lib/cake-maker/state";
import { toEmbeddablePng, type ReferenceImage } from "@/lib/cake-maker/referenceImage";
import type { SummaryModel } from "@/lib/cake-maker/summary";

/**
 * The downloadable Cake Request Summary.
 *
 * Drawn programmatically rather than screenshotted, so the text stays real
 * vector text — selectable, searchable, and crisp at any zoom — and the file
 * lands around 60 KB instead of the megabytes a rasterised page would cost. The
 * cake goes in as true vector too, via svg2pdf.
 *
 * Both libraries are imported INSIDE the function. Next code-splits them into
 * their own chunk, so the /design route ships nothing for a button most
 * visitors will not press.
 *
 * Known limitation: jsPDF's built-in fonts have no Arabic coverage and it does
 * no bidi shaping, so this is English-only for now — consistent with the Cake
 * Maker shipping English-first. Persian users get the Print path, which uses
 * the browser's own text engine and is already correct. When FA copy lands,
 * this function is the single seam to change.
 */

export type RequestPdfInput = {
  design: CakeDesign;
  summary: SummaryModel;
  image: ReferenceImage | null;
  shareUrl: string;
};

const MARGIN = 16;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT = PAGE_WIDTH - MARGIN * 2;

export async function downloadRequestPdf(input: RequestPdfInput): Promise<void> {
  const blob = await buildRequestPdf(input);

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mashoor-cake-request-${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Revoking immediately can cancel the download in some browsers.
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export async function buildRequestPdf({
  summary,
  image,
  shareUrl,
}: RequestPdfInput): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const { svg2pdf } = await import("svg2pdf.js");

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  let y = MARGIN;

  /* Header ---------------------------------------------------------------- */
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(120, 130, 128);
  doc.text(site.name.toUpperCase(), MARGIN, y);
  doc.text(new Date().toLocaleDateString("en-GB"), PAGE_WIDTH - MARGIN, y, {
    align: "right",
  });

  y += 9;
  doc.setFontSize(22).setTextColor(18, 23, 22);
  doc.text("Cake Request Summary", MARGIN, y);

  y += 5;
  doc.setDrawColor(188, 199, 195).setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);

  /* The cake -------------------------------------------------------------- */
  const svg = document.getElementById("pdf-cake")?.querySelector("svg");
  if (svg) {
    const height = 62;
    const width = height * (400 / 440);
    await svg2pdf(svg as SVGSVGElement, doc, {
      x: (PAGE_WIDTH - width) / 2,
      y: y + 6,
      width,
      height,
    });
    y += height + 12;
  } else {
    y += 8;
  }

  /* Selections ------------------------------------------------------------ */
  doc.setFontSize(10);
  for (const row of summary.rows) {
    doc.setTextColor(120, 130, 128).text(row.label, MARGIN, y);
    doc.setTextColor(18, 23, 22);

    const value = doc.splitTextToSize(row.value, CONTENT - 42) as string[];
    doc.text(value, MARGIN + 42, y);

    y += Math.max(6, value.length * 5);
    y = pageBreak(doc, y);
  }

  /* Free text ------------------------------------------------------------- */
  if (summary.writing) {
    y = block(doc, y, "Writing", `"${summary.writing}"`);
  }
  if (summary.notes) {
    y = block(doc, y, "Special requests", summary.notes);
  }

  /* Reference photo ------------------------------------------------------- */
  if (image) {
    try {
      const embedded = await toEmbeddablePng(image, 700);
      const width = Math.min(70, CONTENT / 2);
      const height = (embedded.height / embedded.width) * width;

      y = pageBreak(doc, y, height + 14);
      doc.setFontSize(9).setTextColor(120, 130, 128);
      doc.text("Reference photo", MARGIN, y);

      doc.addImage(embedded.dataUrl, "PNG", MARGIN, y + 3, width, height);
      y += height + 10;
    } catch {
      // A photo that will not decode is not a reason to lose the request.
    }
  }

  /* Estimate -------------------------------------------------------------- */
  y = pageBreak(doc, y, 34);
  y += 4;

  doc.setFillColor(227, 244, 240).setDrawColor(46, 114, 102);
  doc.roundedRect(MARGIN, y, CONTENT, 26, 2, 2, "FD");

  doc.setFontSize(10).setTextColor(120, 130, 128);
  doc.text("Estimated Price", MARGIN + 5, y + 8);

  doc.setFontSize(15).setTextColor(18, 23, 22);
  doc.text(summary.estimate, PAGE_WIDTH - MARGIN - 5, y + 8, { align: "right" });

  doc.setFontSize(8.5).setTextColor(70, 83, 79);
  doc.text(
    doc.splitTextToSize(
      `This is an estimate only. Final pricing will be confirmed directly by ${site.name} after reviewing your request.`,
      CONTENT - 10,
    ) as string[],
    MARGIN + 5,
    y + 15,
  );

  y += 34;

  /* The disclaimer, and the link back to the design ----------------------- */
  y = pageBreak(doc, y, 24);
  doc.setFontSize(8.5).setTextColor(94, 110, 105);
  doc.text(
    doc.splitTextToSize(
      `This is a request, not an order. Nothing has been booked and no payment has been taken. ${site.name} will be in touch to confirm everything personally.`,
      CONTENT,
    ) as string[],
    MARGIN,
    y,
  );

  y += 12;
  doc.setTextColor(46, 114, 102);
  doc.text(doc.splitTextToSize(shareUrl, CONTENT) as string[], MARGIN, y);

  /* Footer on every page -------------------------------------------------- */
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFontSize(8).setTextColor(138, 153, 149);
    doc.text(
      "This is not an order. No payment has been taken.",
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 10,
      { align: "center" },
    );
  }

  return doc.output("blob");
}

/** Starts a new page when `needed` millimetres will not fit. */
function pageBreak(doc: jsPDF, y: number, needed = 10): number {
  if (y + needed > PAGE_HEIGHT - MARGIN - 8) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function block(doc: jsPDF, y: number, label: string, value: string): number {
  const lines = doc.splitTextToSize(value, CONTENT) as string[];
  let next = pageBreak(doc, y + 4, lines.length * 5 + 8);

  doc.setFontSize(9).setTextColor(120, 130, 128);
  doc.text(label, MARGIN, next);

  doc.setFontSize(10).setTextColor(18, 23, 22);
  doc.text(lines, MARGIN, next + 5);

  next += lines.length * 5 + 7;
  return next;
}
