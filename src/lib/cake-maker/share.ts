import type { ComponentType, SVGProps } from "react";

import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { site } from "@/config/site";

import type { SummaryModel } from "@/lib/cake-maker/summary";

/**
 * Handing the request to the baker.
 *
 * The point of the whole feature: the customer arrives in her inbox with a
 * complete, structured description of the cake, so neither of them has to
 * retype anything. This composes that message and the links that carry it.
 *
 * Nothing here creates an order. The message says so in as many words, because
 * a long structured message can otherwise read like a confirmed booking.
 */

/**
 * After encodeURIComponent a message this long lands near ~2000 URL characters,
 * which is the safe ceiling for `mailto:` on Windows and Outlook. The same
 * limit also keeps WhatsApp messages comfortably shareable.
 */
export const MESSAGE_MAX = 1500;

export type ShareTarget = {
  id: "whatsapp" | "email" | "copy" | "native";
  label: string;
  /** Absent for `copy` and `native`, which are actions rather than links. */
  href?: string;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

export function composeRequestMessage(model: SummaryModel, shareUrl: string): string {
  const lines: string[] = [`Cake Request: ${site.name}`, ""];

  const width = Math.max(...model.rows.map((row) => row.label.length));
  for (const row of model.rows) {
    lines.push(`${row.label.padEnd(width)}  ${row.value}`);
  }

  if (model.writing) lines.push("", `Writing: "${model.writing}"`);
  if (model.notes) lines.push("", `Notes: ${model.notes}`);

  lines.push(
    "",
    `Estimated starting price: ${model.estimate}`,
    "(An estimate only. Please confirm the final price.)",
  );

  if (model.hasReferenceImage) {
    lines.push("", "I have a reference photo. I'll send it right after this message.");
  }

  lines.push("", `My design: ${shareUrl}`, "", "This is a request, not an order.");

  return truncate(lines.join("\n"));
}

/**
 * Trims the notes first rather than chopping the end off, so the estimate, the
 * design link and the "not an order" line always survive.
 */
function truncate(message: string): string {
  if (message.length <= MESSAGE_MAX) return message;

  const overflow = message.length - MESSAGE_MAX;
  const notesMatch = message.match(/\nNotes: ([\s\S]*?)\n\nEstimated/);

  if (notesMatch) {
    const notes = notesMatch[1];
    const suffix = "… (full notes are in the attached PDF)";
    const keep = Math.max(0, notes.length - overflow - suffix.length);

    if (keep > 40) {
      return message.replace(notes, notes.slice(0, keep).trimEnd() + suffix);
    }
  }

  return `${message.slice(0, MESSAGE_MAX - 1)}…`;
}

/**
 * The channels the message can go out on.
 *
 * Built from the same `site.contact` enabled flags that lib/contact/channels.ts
 * uses, so disabling a channel hides it everywhere at once. It does not reuse
 * `contactChannels()` directly because that only injects text into WhatsApp,
 * and every target here needs the composed message.
 */
export function shareTargets(
  message: string,
  shareUrl: string,
  subject: string,
): ShareTarget[] {
  const encoded = encodeURIComponent(message);
  const targets: ShareTarget[] = [];
  const { contact } = site;

  if (contact.whatsapp.enabled) {
    targets.push({
      id: "whatsapp",
      label: "WhatsApp",
      href: `${contact.whatsapp.url}?text=${encoded}`,
      Icon: WhatsAppIcon,
    });
  }

  if (contact.email.enabled) {
    targets.push({
      id: "email",
      label: "Email",
      href: `mailto:${contact.email.address}?subject=${encodeURIComponent(subject)}&body=${encoded}`,
    });
  }

  // Always last, and always present: the only target guaranteed to work inside
  // an embedded browser where the others may be blocked.
  targets.push({ id: "copy", label: "Copy details" });

  return targets;
}

/** Instagram cannot receive a composed message; it is a link out, not a target. */
export const instagramProfile = site.contact.instagram.enabled
  ? { href: site.contact.instagram.url, label: "Instagram", Icon: InstagramIcon }
  : null;
