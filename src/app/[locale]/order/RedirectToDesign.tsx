"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { localePath, type Locale } from "@/lib/i18n/config";

/**
 * Sends /order on to /design.
 *
 * `replace`, not `push`, and not a <meta http-equiv="refresh"> — a refresh
 * leaves the stub in history, so the back button bounces the customer straight
 * forward again.
 */
export function RedirectToDesign({ locale }: { locale: Locale }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(localePath(locale, "/design"));
  }, [router, locale]);

  return null;
}
