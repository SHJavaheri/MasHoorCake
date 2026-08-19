import type { Cake } from "./schema";

/**
 * The cake portfolio.
 *
 * TODO(content): every entry below is placeholder work paired with generated
 * stand-in imagery. Replace wholesale once real photography and details arrive.
 * The shape is what matters for now — it is designed so that adding dedicated
 * per-cake pages later is a routing change, not a data migration.
 *
 * Adding a cake: drop photos in public/images/cakes/, run `npm run images`,
 * then copy an entry below. See CONTENT-GUIDE.md.
 */
export const cakes: Cake[] = [
  {
    slug: "saffron-pistachio-celebration",
    name: { en: "Saffron & Pistachio", fa: "زعفران و پسته" },
    description: {
      en: "Saffron steeped sponge layered with pistachio cream and a whisper of rosewater, finished in soft ivory buttercream.",
      fa: "کیک زعفرانی با لایه‌های کرم پسته و کمی گلاب، با روکش باترکریم عاجی.",
    },
    images: [
      {
        src: "/images/cakes/placeholder-01.jpg",
        width: 1600,
        height: 2000,
        alt: {
          en: "Two tier ivory buttercream cake decorated with a gold geometric topper",
          fa: "کیک دو طبقه با باترکریم عاجی و تزئین هندسی طلایی",
        },
      },
    ],
    flavours: ["saffron", "pistachio"],
    fillings: ["swiss-buttercream"],
    occasions: ["celebration", "nowruz"],
    styles: ["minimal", "persian-motif"],
    colorFamilies: ["cream", "gold"],
    tiers: 2,
    servings: { min: 30, max: 40 },
    dimensions: '6" + 8"',
    ingredients: [
      { en: "Saffron", fa: "زعفران" },
      { en: "Pistachio", fa: "پسته" },
      { en: "Rosewater", fa: "گلاب" },
      { en: "Butter", fa: "کره" },
    ],
    allergens: ["nuts", "dairy", "gluten", "egg"],
    priceFrom: 180,
    featured: true,
    date: "2025-11-02",
  },
  {
    slug: "yalda-pomegranate",
    name: { en: "Yalda Pomegranate", fa: "انار یلدا" },
    description: {
      en: "Deep red pomegranate compote between vanilla layers, finished with burnished textured buttercream.",
      fa: "کمپوت انار قرمز میان لایه‌های وانیلی، با باترکریم بافت‌دار.",
    },
    images: [
      {
        src: "/images/cakes/placeholder-02.jpg",
        width: 1600,
        height: 1600,
        alt: {
          en: "Single tier cake with textured deep red buttercream",
          fa: "کیک یک طبقه با باترکریم قرمز تیره بافت‌دار",
        },
      },
    ],
    flavours: ["vanilla"],
    fillings: ["fruit-compote", "swiss-buttercream"],
    occasions: ["yalda", "celebration"],
    styles: ["textured"],
    colorFamilies: ["red"],
    tiers: 1,
    servings: { min: 12, max: 16 },
    dimensions: '7"',
    ingredients: [
      { en: "Pomegranate", fa: "انار" },
      { en: "Vanilla bean", fa: "وانیل" },
    ],
    allergens: ["dairy", "gluten", "egg"],
    priceFrom: 95,
    featured: true,
    date: "2025-12-20",
  },
  {
    slug: "rose-cardamom-wedding",
    name: { en: "Rose & Cardamom", fa: "گل سرخ و هل" },
    description: {
      en: "Three tiers of cardamom sponge with rose scented Swiss buttercream and hand piped sugar florals.",
      fa: "سه طبقه کیک هل با باترکریم گلاب و گل‌های قندی دست‌ساز.",
    },
    images: [
      {
        src: "/images/cakes/placeholder-03.jpg",
        width: 1600,
        height: 1200,
        alt: {
          en: "Three tier pale cake covered in hand piped sugar flowers",
          fa: "کیک سه طبقه روشن پوشیده از گل‌های قندی دست‌ساز",
        },
      },
    ],
    flavours: ["cardamom", "rosewater"],
    fillings: ["swiss-buttercream"],
    occasions: ["wedding", "engagement"],
    styles: ["floral", "minimal"],
    colorFamilies: ["cream", "pink"],
    tiers: 3,
    servings: { min: 70, max: 90 },
    dimensions: '6" + 8" + 10"',
    ingredients: [
      { en: "Cardamom", fa: "هل" },
      { en: "Rosewater", fa: "گلاب" },
    ],
    allergens: ["dairy", "gluten", "egg"],
    priceFrom: 420,
    featured: true,
    date: "2025-09-14",
  },
  {
    slug: "dark-chocolate-orange",
    name: { en: "Dark Chocolate & Orange Blossom", fa: "شکلات تلخ و بهارنارنج" },
    description: {
      en: "Seventy percent ganache against bright orange blossom, under a smooth chocolate finish.",
      fa: "گاناش ۷۰ درصد در کنار بهارنارنج، با روکش صاف شکلاتی.",
    },
    images: [
      {
        src: "/images/cakes/placeholder-04.jpg",
        width: 1600,
        height: 2133,
        alt: {
          en: "Tall dark chocolate cake with a smooth glossy finish",
          fa: "کیک بلند شکلات تلخ با روکش براق",
        },
      },
    ],
    flavours: ["chocolate", "citrus"],
    fillings: ["ganache"],
    occasions: ["birthday", "celebration"],
    styles: ["minimal"],
    colorFamilies: ["chocolate"],
    tiers: 1,
    servings: { min: 14, max: 18 },
    ingredients: [
      { en: "70% couverture chocolate", fa: "شکلات کوورتور ۷۰ درصد" },
      { en: "Orange blossom", fa: "بهارنارنج" },
    ],
    allergens: ["dairy", "gluten", "egg", "soy"],
    priceFrom: 110,
    featured: false,
    date: "2025-10-05",
  },
  {
    slug: "nowruz-sabzeh",
    name: { en: "Nowruz Sabzeh", fa: "سبزه نوروز" },
    description: {
      en: "Pistachio sponge under fresh green buttercream, finished with a hand painted Haft Sin motif.",
      fa: "کیک پسته با باترکریم سبز و نقش هفت‌سین دست‌نقاشی.",
    },
    images: [
      {
        src: "/images/cakes/placeholder-05.jpg",
        width: 1600,
        height: 2000,
        alt: {
          en: "Green buttercream cake hand painted with a Persian spring motif",
          fa: "کیک با باترکریم سبز و نقاشی دستی با نقش بهاری ایرانی",
        },
      },
    ],
    flavours: ["pistachio", "cardamom"],
    fillings: ["cream-cheese"],
    occasions: ["nowruz"],
    styles: ["buttercream-art", "persian-motif"],
    colorFamilies: ["green"],
    tiers: 2,
    servings: { min: 24, max: 32 },
    ingredients: [
      { en: "Pistachio", fa: "پسته" },
      { en: "Cardamom", fa: "هل" },
    ],
    allergens: ["nuts", "dairy", "gluten", "egg"],
    priceFrom: 165,
    featured: true,
    date: "2026-03-18",
  },
  {
    slug: "coffee-walnut-anniversary",
    name: { en: "Coffee & Walnut", fa: "قهوه و گردو" },
    description: {
      en: "Espresso soaked sponge with salted caramel and toasted walnut, finished in a dark textured sweep.",
      fa: "کیک آغشته به اسپرسو با کارامل نمکی و گردوی برشته.",
    },
    images: [
      {
        src: "/images/cakes/placeholder-06.jpg",
        width: 1600,
        height: 1600,
        alt: {
          en: "Coffee coloured cake with sweeping textured sides",
          fa: "کیک قهوه‌ای با کناره‌های بافت‌دار",
        },
      },
    ],
    flavours: ["coffee"],
    fillings: ["salted-caramel", "swiss-buttercream"],
    occasions: ["anniversary", "birthday"],
    styles: ["textured"],
    colorFamilies: ["chocolate"],
    tiers: 1,
    servings: { min: 12, max: 16 },
    ingredients: [
      { en: "Espresso", fa: "اسپرسو" },
      { en: "Walnut", fa: "گردو" },
    ],
    allergens: ["nuts", "dairy", "gluten", "egg"],
    priceFrom: 100,
    featured: false,
    date: "2025-08-22",
  },
  {
    slug: "blush-ombre-birthday",
    name: { en: "Blush Ombré", fa: "اُمبره صورتی" },
    description: {
      en: "Vanilla bean layers with fresh cream and berries, graduating from deep blush to ivory.",
      fa: "لایه‌های وانیلی با خامه تازه و توت‌ها، از صورتی پررنگ تا عاجی.",
    },
    images: [
      {
        src: "/images/cakes/placeholder-07.jpg",
        width: 1600,
        height: 1200,
        alt: {
          en: "Cake with a pink to ivory graduated buttercream finish",
          fa: "کیک با روکش باترکریم از صورتی تا عاجی",
        },
      },
    ],
    flavours: ["vanilla"],
    fillings: ["fresh-cream", "fruit-compote"],
    occasions: ["birthday"],
    styles: ["minimal"],
    colorFamilies: ["pink", "cream"],
    tiers: 2,
    servings: { min: 26, max: 34 },
    ingredients: [
      { en: "Vanilla bean", fa: "وانیل" },
      { en: "Seasonal berries", fa: "توت‌های فصلی" },
    ],
    allergens: ["dairy", "gluten", "egg"],
    priceFrom: 150,
    featured: false,
    date: "2025-07-11",
  },
  {
    slug: "gold-leaf-engagement",
    name: { en: "Gold Leaf", fa: "ورق طلا" },
    description: {
      en: "Ivory buttercream with hand applied edible gold leaf and a single sugar magnolia.",
      fa: "باترکریم عاجی با ورق طلای خوراکی و یک گل مگنولیای قندی.",
    },
    images: [
      {
        src: "/images/cakes/placeholder-08.jpg",
        width: 1600,
        height: 2133,
        alt: {
          en: "Ivory cake with gold leaf detail and a single sugar flower",
          fa: "کیک عاجی با جزئیات ورق طلا و یک گل قندی",
        },
      },
    ],
    flavours: ["vanilla", "citrus"],
    fillings: ["swiss-buttercream"],
    occasions: ["engagement", "wedding"],
    styles: ["minimal", "floral"],
    colorFamilies: ["cream", "gold"],
    tiers: 2,
    servings: { min: 28, max: 36 },
    ingredients: [
      { en: "Vanilla bean", fa: "وانیل" },
      { en: "Edible gold leaf", fa: "ورق طلای خوراکی" },
    ],
    allergens: ["dairy", "gluten", "egg"],
    priceFrom: 210,
    featured: false,
    date: "2025-06-28",
  },
  {
    slug: "citrus-poppy-spring",
    name: { en: "Citrus & Poppy Seed", fa: "مرکبات و خشخاش" },
    description: {
      en: "Bright citrus sponge with poppy seed and cream cheese, finished in a clean smooth ivory.",
      fa: "کیک مرکبات با دانه خشخاش و پنیر خامه‌ای، با روکش صاف عاجی.",
    },
    images: [
      {
        src: "/images/cakes/placeholder-09.jpg",
        width: 1600,
        height: 2000,
        alt: {
          en: "Pale citrus cake with a clean smooth finish",
          fa: "کیک مرکبات روشن با روکش صاف",
        },
      },
    ],
    flavours: ["citrus"],
    fillings: ["cream-cheese"],
    occasions: ["celebration", "birthday"],
    styles: ["minimal"],
    colorFamilies: ["cream"],
    tiers: 1,
    servings: { min: 10, max: 14 },
    ingredients: [
      { en: "Orange and lemon zest", fa: "پوست پرتقال و لیمو" },
      { en: "Poppy seed", fa: "دانه خشخاش" },
    ],
    allergens: ["dairy", "gluten", "egg"],
    priceFrom: 85,
    featured: false,
    date: "2025-05-16",
  },
  {
    slug: "persian-tile-wedding",
    name: { en: "Persian Tile", fa: "کاشی ایرانی" },
    description: {
      en: "Hand piped tilework in cobalt and turquoise across four tiers, echoing Isfahan mosque ceramics.",
      fa: "کاشی‌کاری دست‌ساز آبی و فیروزه‌ای در چهار طبقه، با الهام از کاشی‌های اصفهان.",
    },
    images: [
      {
        src: "/images/cakes/placeholder-10.jpg",
        width: 1600,
        height: 1600,
        alt: {
          en: "Four tier cake hand piped with blue Persian tile patterns",
          fa: "کیک چهار طبقه با نقش کاشی ایرانی آبی",
        },
      },
    ],
    flavours: ["cardamom", "rosewater", "pistachio"],
    fillings: ["swiss-buttercream"],
    occasions: ["wedding"],
    styles: ["persian-motif", "buttercream-art"],
    colorFamilies: ["blue"],
    tiers: 4,
    servings: { min: 110, max: 140 },
    dimensions: '5" + 7" + 9" + 11"',
    ingredients: [
      { en: "Cardamom", fa: "هل" },
      { en: "Pistachio", fa: "پسته" },
      { en: "Rosewater", fa: "گلاب" },
    ],
    allergens: ["nuts", "dairy", "gluten", "egg"],
    priceFrom: 680,
    featured: true,
    date: "2025-08-30",
  },
  {
    slug: "chocolate-hazelnut-birthday",
    name: { en: "Chocolate Hazelnut", fa: "شکلات و فندق" },
    description: {
      en: "Chocolate sponge, hazelnut praline, and a crackling feuilletine layer for texture.",
      fa: "کیک شکلاتی، پرالینه فندق و لایه ترد فویتین.",
    },
    images: [
      {
        src: "/images/cakes/placeholder-11.jpg",
        width: 1600,
        height: 1200,
        alt: {
          en: "Chocolate cake with visible praline layers",
          fa: "کیک شکلاتی با لایه‌های پرالینه",
        },
      },
    ],
    flavours: ["chocolate"],
    fillings: ["ganache", "salted-caramel"],
    occasions: ["birthday"],
    styles: ["textured"],
    colorFamilies: ["chocolate"],
    tiers: 1,
    servings: { min: 12, max: 16 },
    ingredients: [
      { en: "Hazelnut praline", fa: "پرالینه فندق" },
      { en: "Dark chocolate", fa: "شکلات تلخ" },
    ],
    allergens: ["nuts", "dairy", "gluten", "egg", "soy"],
    priceFrom: 105,
    featured: false,
    date: "2025-04-09",
  },
  {
    slug: "ivory-minimal-anniversary",
    name: { en: "Ivory Minimal", fa: "عاجی مینیمال" },
    description: {
      en: "One clean tier, one sharp edge, one sprig of dried wheat. Nothing else.",
      fa: "یک طبقه ساده، یک لبه تیز، یک شاخه گندم خشک. همین.",
    },
    images: [
      {
        src: "/images/cakes/placeholder-12.jpg",
        width: 1600,
        height: 2133,
        alt: {
          en: "Sharp edged ivory cake with a single sprig of dried wheat",
          fa: "کیک عاجی با لبه تیز و یک شاخه گندم خشک",
        },
      },
    ],
    flavours: ["vanilla"],
    fillings: ["swiss-buttercream"],
    occasions: ["anniversary", "celebration"],
    styles: ["minimal"],
    colorFamilies: ["cream"],
    tiers: 1,
    servings: { min: 10, max: 14 },
    ingredients: [{ en: "Vanilla bean", fa: "وانیل" }],
    allergens: ["dairy", "gluten", "egg"],
    priceFrom: 90,
    featured: false,
    date: "2025-03-21",
  },
];
