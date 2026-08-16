/**
 * Ordering configuration.
 *
 * Orders are taken through a Google Form for now, then finalised personally.
 * Everything the site needs to know about that is here, so replacing it with a
 * native form later means editing this file and one adapter — no page, CTA, or
 * copy has to change.
 */
export const orderForm = {
  /**
   * TODO(content): the live Google Form URL.
   * Use the "shortened" or full /viewform link.
   */
  formUrl: "https://docs.google.com/forms/d/e/PLACEHOLDER/viewform",

  /**
   * Pre-fill field IDs.
   *
   * To obtain these: open the form, choose "Get pre-filled link" from the
   * overflow menu, fill in recognisable dummy values, then "Get link". The
   * resulting URL contains `entry.XXXXXXX=` pairs — map each one below.
   *
   * Set to `null` until they are supplied: the order link then falls back to
   * the plain form rather than sending malformed query parameters.
   */
  entries: null as null | {
    cake?: string;
    flavour?: string;
    filling?: string;
    occasion?: string;
    tiers?: string;
    servings?: string;
  },

  /** Shown on the order page so customers arrive prepared. */
  checklist: {
    en: [
      "The date of your event, and when you need the cake",
      "Roughly how many people you are serving",
      "Any flavours you love, and anything to avoid",
      "Allergies or dietary needs",
      "A photo or two for inspiration, if you have them",
    ],
    fa: [
      "تاریخ جشن و زمانی که کیک را لازم دارید",
      "تعداد تقریبی مهمان‌ها",
      "طعم‌هایی که دوست دارید و آنچه باید پرهیز شود",
      "حساسیت‌های غذایی یا نیازهای خاص",
      "یکی دو عکس برای الهام، اگر دارید",
    ],
  },
} as const;
