"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useUrlSearch, setUrlSearch } from "@/hooks/useUrlSearch";
import type { Locale } from "@/lib/i18n/config";

import { designFromParams, designToParams, hasDesignParams } from "@/lib/cake-maker/encode";
import { clearSeed, readDesign, readSeed, saveDesign } from "@/lib/cake-maker/persistence";
import { estimatePrice, type PriceEstimate } from "@/lib/cake-maker/pricing";
import { revokeReferenceImage, type ReferenceImage } from "@/lib/cake-maker/referenceImage";
import {
  designReducer,
  initialDesign,
  normalise,
  type CakeDesign,
  type DesignAction,
} from "@/lib/cake-maker/state";
import { buildSummaryModel, type SummaryModel } from "@/lib/cake-maker/summary";

/**
 * Cake Maker state.
 *
 * Split into several contexts on purpose. The option grid and the live preview
 * are siblings in different columns that swap position between breakpoints, so
 * prop drilling is not an option — but a single context would re-render forty
 * option cards on every keystroke in the notes field. Design, dispatch and the
 * reference image change at completely different rates, so they are separate.
 */

const DesignContext = createContext<CakeDesign | null>(null);
const DispatchContext = createContext<Dispatch<DesignAction> | null>(null);
const DerivedContext = createContext<Derived | null>(null);
const ReferenceContext = createContext<ReferenceContextValue | null>(null);

type Derived = {
  locale: Locale;
  estimate: PriceEstimate;
  summary: SummaryModel;
  /** Whether the first client-side hydration pass has run. */
  ready: boolean;
  /** Set when the design was seeded from a gallery cake. */
  seededFrom: string | null;
};

type ReferenceContextValue = {
  image: ReferenceImage | null;
  setImage: (image: ReferenceImage | null) => void;
};

/**
 * The provider's own state, wrapping the design.
 *
 * `ready` and `seededFrom` live in the same reducer as the design rather than
 * in their own `useState`s so that hydrating from the URL or from storage is a
 * single dispatch, not three cascading state updates in one effect.
 */
type MakerState = {
  design: CakeDesign;
  ready: boolean;
  seededFrom: string | null;
};

type MakerAction =
  DesignAction | { type: "hydrated"; design: CakeDesign; seededFrom: string | null };

function makerReducer(state: MakerState, action: MakerAction): MakerState {
  if (action.type === "hydrated") {
    return { design: action.design, ready: true, seededFrom: action.seededFrom };
  }
  return { ...state, design: designReducer(state.design, action) };
}

export function CakeMakerProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(makerReducer, undefined, () => ({
    design: initialDesign(),
    ready: false,
    seededFrom: null,
  }));
  const { design, ready, seededFrom } = state;

  const [image, setImageState] = useState<ReferenceImage | null>(null);

  const search = useUrlSearch();
  const hydrated = useRef(false);

  /**
   * Hydration, in priority order: a shared link always wins, then a seed handed
   * over from the gallery or the explorers, then a design left in this session.
   *
   * This runs in an effect rather than during render because the page is
   * prerendered — the server has no access to any of these, so the first client
   * render must match `initialDesign()` exactly or React discards the tree.
   */
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const base = initialDesign();
    const params = new URLSearchParams(window.location.search);

    // A shared link always wins.
    if (hasDesignParams(params)) {
      dispatch({
        type: "hydrated",
        design: designFromParams(params, base),
        seededFrom: null,
      });
      return;
    }

    // Then a seed handed over from the gallery or the explorers.
    const seed = readSeed();
    if (seed) {
      clearSeed();
      const { fromCakeName = null, capturedAt, ...selections } = seed;
      void capturedAt;

      dispatch({
        type: "hydrated",
        design: normalise({ ...base, ...selections }),
        seededFrom: fromCakeName,
      });
      return;
    }

    // Then whatever was left in this session.
    dispatch({
      type: "hydrated",
      design: readDesign(base) ?? base,
      seededFrom: null,
    });
  }, []);

  /**
   * Mirror the design into the URL and into sessionStorage. Debounced so that
   * typing does not thrash either, and `replaceState` (via setUrlSearch) so
   * refining a cake does not stack thirty history entries.
   */
  const persisted = useDebouncedValue(design, 350);

  useEffect(() => {
    if (!ready) return;

    saveDesign(persisted);

    const next = designToParams(persisted).toString();
    if (next !== search.replace(/^\?/, "")) setUrlSearch(next);
    // `search` is deliberately excluded: this effect writes the URL, and
    // reacting to its own write would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persisted, ready]);

  /** Object URLs leak until revoked, including when one image replaces another. */
  const setImage = useMemo(
    () => (next: ReferenceImage | null) => {
      setImageState((previous) => {
        if (previous && previous !== next) revokeReferenceImage(previous);
        return next;
      });
      dispatch({ type: "setReference", present: next !== null });
    },
    [],
  );

  useEffect(() => () => revokeReferenceImage(image), [image]);

  const derived = useMemo<Derived>(
    () => ({
      locale,
      estimate: estimatePrice(design),
      summary: buildSummaryModel(design, locale),
      ready,
      seededFrom,
    }),
    [design, locale, ready, seededFrom],
  );

  const reference = useMemo<ReferenceContextValue>(
    () => ({ image, setImage }),
    [image, setImage],
  );

  return (
    <DesignContext.Provider value={design}>
      <DispatchContext.Provider value={dispatch}>
        <DerivedContext.Provider value={derived}>
          <ReferenceContext.Provider value={reference}>{children}</ReferenceContext.Provider>
        </DerivedContext.Provider>
      </DispatchContext.Provider>
    </DesignContext.Provider>
  );
}

function required<T>(value: T | null, hook: string): T {
  if (value === null) throw new Error(`${hook} must be used inside <CakeMakerProvider>`);
  return value;
}

export function useDesign(): CakeDesign {
  return required(useContext(DesignContext), "useDesign");
}

export function useDesignDispatch(): Dispatch<DesignAction> {
  return required(useContext(DispatchContext), "useDesignDispatch");
}

export function useDerived(): Derived {
  return required(useContext(DerivedContext), "useDerived");
}

export function useReferenceImage(): ReferenceContextValue {
  return required(useContext(ReferenceContext), "useReferenceImage");
}
