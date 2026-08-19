import type { TaxonomyTerm } from "./schema";

/**
 * Shared taxonomies.
 *
 * Cakes reference these by slug rather than repeating strings, so a flavour can
 * be renamed or translated once. The gallery filters, the flavour library, and
 * the order form all read from here.
 *
 * TODO(content): replace with the bakery's real menu.
 */

export const flavours: TaxonomyTerm[] = [
  {
    slug: "saffron",
    label: { en: "Saffron", fa: "زعفران" },
    description: {
      en: "Floral and warm, steeped rather than powdered.",
      fa: "گلی و گرم، دم‌کرده به‌جای پودر.",
    },
  },
  {
    slug: "pistachio",
    label: { en: "Pistachio", fa: "پسته" },
    description: {
      en: "Ground fresh, never extract.",
      fa: "تازه آسیاب‌شده، بدون اسانس.",
    },
  },
  {
    slug: "rosewater",
    label: { en: "Rosewater", fa: "گلاب" },
    description: {
      en: "Used with restraint, so it perfumes rather than dominates.",
      fa: "با احتیاط، تا عطر بدهد نه اینکه غالب شود.",
    },
  },
  {
    slug: "cardamom",
    label: { en: "Cardamom", fa: "هل" },
    description: { en: "Freshly ground green pods.", fa: "هل سبز تازه آسیاب‌شده." },
  },
  {
    slug: "vanilla",
    label: { en: "Vanilla Bean", fa: "وانیل" },
    description: { en: "Madagascar bean, seeds visible.", fa: "وانیل ماداگاسکار." },
  },
  {
    slug: "chocolate",
    label: { en: "Dark Chocolate", fa: "شکلات تلخ" },
    description: { en: "70% couverture.", fa: "کوورتور ۷۰ درصد." },
  },
  {
    slug: "citrus",
    label: { en: "Orange Blossom", fa: "بهارنارنج" },
    description: { en: "Bright and clean against richer fillings.", fa: "روشن و تازه." },
  },
  {
    slug: "coffee",
    label: { en: "Coffee", fa: "قهوه" },
    description: { en: "Espresso soaked sponge.", fa: "کیک آغشته به اسپرسو." },
  },
];

export const fillings: TaxonomyTerm[] = [
  {
    slug: "swiss-buttercream",
    label: { en: "Swiss Meringue Buttercream", fa: "باترکریم سوئیسی" },
  },
  { slug: "cream-cheese", label: { en: "Cream Cheese", fa: "پنیر خامه‌ای" } },
  { slug: "ganache", label: { en: "Ganache", fa: "گاناش" } },
  { slug: "fresh-cream", label: { en: "Chantilly Cream", fa: "خامه شانتی" } },
  { slug: "fruit-compote", label: { en: "Fruit Compote", fa: "کمپوت میوه" } },
  { slug: "salted-caramel", label: { en: "Salted Caramel", fa: "کارامل نمکی" } },
];

export const occasions: TaxonomyTerm[] = [
  { slug: "birthday", label: { en: "Birthday", fa: "تولد" } },
  { slug: "wedding", label: { en: "Wedding", fa: "عروسی" } },
  { slug: "engagement", label: { en: "Engagement", fa: "نامزدی" } },
  { slug: "nowruz", label: { en: "Nowruz", fa: "نوروز" } },
  { slug: "yalda", label: { en: "Yalda", fa: "یلدا" } },
  { slug: "anniversary", label: { en: "Anniversary", fa: "سالگرد" } },
  { slug: "celebration", label: { en: "Celebration", fa: "جشن" } },
];

export const styles: TaxonomyTerm[] = [
  { slug: "minimal", label: { en: "Minimal", fa: "مینیمال" } },
  { slug: "floral", label: { en: "Floral", fa: "گل‌آرایی" } },
  { slug: "textured", label: { en: "Textured", fa: "بافت‌دار" } },
  { slug: "sculpted", label: { en: "Sculpted", fa: "مجسمه‌ای" } },
  { slug: "persian-motif", label: { en: "Persian Motif", fa: "نقش ایرانی" } },
  { slug: "buttercream-art", label: { en: "Buttercream Art", fa: "نقاشی با باترکریم" } },
];

export const colorFamilies: TaxonomyTerm[] = [
  { slug: "cream", label: { en: "Cream & Ivory", fa: "کرم و عاجی" } },
  { slug: "gold", label: { en: "Gold", fa: "طلایی" } },
  { slug: "green", label: { en: "Green", fa: "سبز" } },
  { slug: "pink", label: { en: "Blush", fa: "صورتی" } },
  { slug: "red", label: { en: "Deep Red", fa: "قرمز تیره" } },
  { slug: "blue", label: { en: "Blue", fa: "آبی" } },
  { slug: "chocolate", label: { en: "Chocolate", fa: "شکلاتی" } },
];

export const allergens: TaxonomyTerm[] = [
  { slug: "nuts", label: { en: "Tree nuts", fa: "آجیل" } },
  { slug: "dairy", label: { en: "Dairy", fa: "لبنیات" } },
  { slug: "gluten", label: { en: "Gluten", fa: "گلوتن" } },
  { slug: "egg", label: { en: "Egg", fa: "تخم‌مرغ" } },
  { slug: "soy", label: { en: "Soy", fa: "سویا" } },
];

/** Lookup helper shared by the gallery, filters, and modal. */
export function findTerm(terms: TaxonomyTerm[], slug: string): TaxonomyTerm | undefined {
  return terms.find((t) => t.slug === slug);
}

export const taxonomies = {
  flavours,
  fillings,
  occasions,
  styles,
  colorFamilies,
  allergens,
} as const;
