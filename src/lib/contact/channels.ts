import { Mail, Phone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { site } from "@/config/site";

export type ContactChannel = {
  id: string;
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/**
 * Builds the list of enabled contact channels.
 *
 * Derived from `site.contact` so a channel is added, removed, or reordered in
 * one place and every surface (footer, contact page, order page) follows.
 *
 * `greeting` seeds the chat apps with an opening message, so someone arriving
 * via WhatsApp does not land on an empty thread having to explain themselves.
 * It is passed in from a dictionary rather than written here, because no
 * customer-visible copy belongs in a lib module.
 */
export function contactChannels(greeting: string): ContactChannel[] {
  const { contact } = site;
  const channels: ContactChannel[] = [];

  if (contact.instagram.enabled) {
    channels.push({
      id: "instagram",
      label: contact.instagram.handle,
      href: contact.instagram.url,
      Icon: InstagramIcon,
    });
  }

  if (contact.whatsapp.enabled) {
    channels.push({
      id: "whatsapp",
      label: "WhatsApp",
      href: `${contact.whatsapp.url}?text=${encodeURIComponent(greeting)}`,
      Icon: WhatsAppIcon,
    });
  }

  if (contact.telegram.enabled) {
    channels.push({
      id: "telegram",
      label: "Telegram",
      href: contact.telegram.url,
      Icon: TelegramIcon,
    });
  }

  if (contact.email.enabled) {
    channels.push({
      id: "email",
      label: contact.email.address,
      href: `mailto:${contact.email.address}`,
      Icon: Mail,
    });
  }

  if (contact.phone.enabled) {
    channels.push({
      id: "phone",
      label: contact.phone.number,
      href: `tel:${contact.phone.number.replace(/\s/g, "")}`,
      Icon: Phone,
    });
  }

  return channels;
}
