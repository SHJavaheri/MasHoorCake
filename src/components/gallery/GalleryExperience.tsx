"use client";

import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { CakeModal } from "@/components/gallery/CakeModal";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { Button } from "@/components/ui/Button";
import { KhatamStar } from "@/components/ui/Ornament";
import type { Cake } from "@/content/schema";
import { setUrlSearch, useUrlSearch } from "@/hooks/useUrlSearch";
import {
  emptyFilters,
  filterCakes,
  filtersFromParams,
  filtersToParams,
  toggleFilter,
  type FilterCategory,
} from "@/lib/gallery/filters";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { transition } from "@/lib/motion/tokens";

const PAGE_SIZE = 12;

/**
 * The gallery.
 *
 * Filters and the open cake live in the URL, not in React state. That makes a
 * filtered view shareable, bookmarkable, and correct under the back button, and
 * it means there is exactly one source of truth rather than state mirrored into
 * the address bar by a sync effect.
 *
 * `?cake=slug` already uses the same slug a future `/gallery/[slug]` page will,
 * so adding real detail pages later changes no links.
 */
export function GalleryExperience({
  cakes,
  locale,
  dict,
}: {
  cakes: Cake[];
  locale: Locale;
  dict: Dictionary;
}) {
  const search = useUrlSearch();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const params = useMemo(() => new URLSearchParams(search), [search]);
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const openSlug = params.get("cake");

  const filtered = useMemo(() => filterCakes(cakes, filters), [cakes, filters]);

  function commit(nextFilters = filters, cakeSlug = openSlug) {
    const next = filtersToParams(nextFilters);
    if (cakeSlug) next.set("cake", cakeSlug);
    setUrlSearch(next.toString());
  }

  function handleToggle(category: FilterCategory, slug: string) {
    setVisible(PAGE_SIZE);
    commit(toggleFilter(filters, category, slug));
  }

  function handleClear() {
    setVisible(PAGE_SIZE);
    commit(emptyFilters);
  }

  const openCake = filtered.find((c) => c.slug === openSlug) ?? null;
  const openIndex = openCake ? filtered.indexOf(openCake) : -1;
  const shown = filtered.slice(0, visible);

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
        {/* A collapsible panel on small screens, a sticky rail on large. */}
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            className="w-full lg:hidden"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            {dict.gallery.filterBy}
          </Button>

          <div className={filtersOpen ? "mt-6 lg:mt-0" : "hidden lg:block"}>
            <GalleryFilters
              cakes={cakes}
              filters={filters}
              onToggle={handleToggle}
              onClear={handleClear}
              resultCount={filtered.length}
              locale={locale}
              dict={dict}
            />
          </div>
        </div>

        <div>
          {shown.length > 0 ? (
            /* CSS columns rather than a JS masonry library: deterministic, no
               measurement pass, and no layout thrash on resize. */
            <div className="columns-1 gap-5 sm:columns-2 xl:columns-3">
              <AnimatePresence mode="popLayout">
                {shown.map((cake, index) => (
                  <GalleryCard
                    key={cake.slug}
                    cake={cake}
                    locale={locale}
                    servingsLabel={dict.common.servings}
                    priority={index < 3}
                    onOpen={() => commit(filters, cake.slug)}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={transition.entrance}
              className="border-border flex flex-col items-center gap-5 rounded-[2rem] border border-dashed px-8 py-24 text-center"
            >
              <KhatamStar className="text-accent size-10 opacity-50" />
              <p className="text-text-muted max-w-sm">{dict.gallery.empty}</p>
              <Button variant="secondary" size="sm" onClick={handleClear}>
                {dict.gallery.clearFilters}
              </Button>
            </motion.div>
          )}

          {visible < filtered.length && (
            <div className="mt-12 flex justify-center">
              <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                {dict.gallery.loadMore}
              </Button>
            </div>
          )}
        </div>
      </div>

      <CakeModal
        cake={openCake}
        locale={locale}
        dict={dict}
        onClose={() => commit(filters, null)}
        onPrev={openIndex > 0 ? () => commit(filters, filtered[openIndex - 1].slug) : undefined}
        onNext={
          openIndex >= 0 && openIndex < filtered.length - 1
            ? () => commit(filters, filtered[openIndex + 1].slug)
            : undefined
        }
      />
    </>
  );
}
