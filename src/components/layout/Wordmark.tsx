import { asset } from "@/lib/images/assetPath";
import { cn } from "@/lib/utils/cn";

/**
 * The bakery's supplied logo is a transparent raster asset; the source artwork
 * is not available as editable vector paths.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <img
      src={asset("/images/brand/mashoor-cake-logo-transparent.png")}
      alt="Mashoor Cake: my sweet dream, made with love"
      width={1254}
      height={1254}
      className={cn("block w-auto object-contain filter-none", className)}
    />
  );
}
