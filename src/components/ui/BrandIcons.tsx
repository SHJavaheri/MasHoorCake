import type { SVGProps } from "react";

/**
 * Brand marks for the messaging channels.
 *
 * Hand-drawn rather than pulled from an icon set: lucide-react removed its
 * brand icons for trademark reasons, and the remaining generic alternatives
 * ("a camera", "a paper plane") do not read as the services customers are
 * looking for. Stroke weights match lucide's 1.5-on-24 grid so they sit
 * consistently beside Mail and Phone.
 */

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Speech bubble with the tail at the lower start edge. */}
      <path d="M3.5 20.5l1.3-4a8.2 8.2 0 1 1 3 2.9l-4.3 1.1Z" />
      <path
        d="M9 9.4c.2 1.1.8 2.2 1.7 3.1.9.9 2 1.5 3.1 1.7l.9-1.2 1.6.8c-.2.9-1 1.5-2 1.4a7.6 7.6 0 0 1-6.3-6.3c0-1 .5-1.8 1.4-2l.8 1.6L9 9.4Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 4.5 2.8 11.3c-.6.2-.6 1 0 1.2l4.6 1.5L20 5.6" />
      <path d="M7.4 14 9 19.3c.2.6 1 .7 1.3.2l2.3-3.1L21 4.5" />
      <path d="m9 19.5 3.6-3.1" />
    </svg>
  );
}
