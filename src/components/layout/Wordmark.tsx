import { asset } from "@/lib/images/assetPath";
import { cn } from "@/lib/utils/cn";

/**
 * The bakery's supplied logo, recoloured to the site's semantic ivory,
 * espresso, saffron, and rose palette. It is deliberately a raster asset: the
 * source artwork is not available as editable vector paths.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <img
      src={asset("/images/brand/mashoor-cake-logo-recoloured.png")}
      alt="Mashoor Cake — my sweet dream, made with love"
      width={1254}
      height={1254}
      className={cn("block w-auto object-contain filter-none", className)}
    />
  );
}
