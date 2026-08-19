/**
 * The optional reference photo.
 *
 * Three facts govern this file, and the UI copy has to state all three plainly
 * rather than leaving them implied:
 *
 *  1. It is NEVER UPLOADED. This is a statically exported site — there is no
 *     server to upload to, and adding one would be a privacy decision nobody
 *     asked for. The image stays in the browser tab.
 *
 *  2. It CANNOT TRAVEL IN A SHARED LINK or a WhatsApp message composed from
 *     one. So the message ends by saying the customer will send the photo
 *     separately, and the field says so before they get that far.
 *
 *  3. It IS EMBEDDED IN THE PDF, which is the one artefact that can carry it.
 *     "Download the PDF and attach that" is therefore the recommended flow.
 */

export const MAX_REFERENCE_BYTES = 8 * 1024 * 1024;

export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export type ReferenceImage = {
  file: File;
  /** Object URL for display. Must be revoked — see revokeReferenceImage. */
  objectUrl: string;
  name: string;
  sizeBytes: number;
};

export type AcceptResult =
  { ok: true; image: ReferenceImage } | { ok: false; reason: "type" | "size" };

export function acceptReferenceFile(file: File): AcceptResult {
  if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
    return { ok: false, reason: "type" };
  }
  if (file.size > MAX_REFERENCE_BYTES) {
    return { ok: false, reason: "size" };
  }

  return {
    ok: true,
    image: {
      file,
      objectUrl: URL.createObjectURL(file),
      name: file.name,
      sizeBytes: file.size,
    },
  };
}

export function revokeReferenceImage(image: ReferenceImage | null): void {
  if (image) URL.revokeObjectURL(image.objectUrl);
}

/**
 * A downscaled PNG data URL for embedding in the PDF.
 *
 * Downscaled because a modern phone photo is several thousand pixels wide and
 * would turn a 60 KB request summary into a 6 MB one for no visible gain at
 * print size.
 */
export async function toEmbeddablePng(
  image: ReferenceImage,
  maxEdge = 900,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const bitmap = await createImageBitmap(image.file);

  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context unavailable");

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return { dataUrl: canvas.toDataURL("image/png"), width, height };
}
