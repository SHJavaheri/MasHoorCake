import { asset } from "@/lib/images/assetPath";
import { cn } from "@/lib/utils/cn";

/** A one-colour, text-free silhouette derived from the bakery's real logo. */
export function LogoSilhouette({ className }: { className?: string }) {
  return (
    <img
      src={asset("/images/brand/mashoor-cake-logo-silhouette.png")}
      alt=""
      aria-hidden="true"
      className={cn("block h-auto w-auto object-contain", className)}
    />
  );
}

/** A faded logo silhouette for large decorative surfaces. */
export function LogoSilhouettePattern({
  className,
  opacity = 0.16,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ opacity }}
    >
      <LogoSilhouette className="absolute -top-28 -end-20 w-[28rem] max-w-none sm:-top-40 sm:-end-28 sm:w-[38rem]" />
      <LogoSilhouette className="absolute -bottom-40 -start-28 w-[24rem] max-w-none sm:-bottom-52 sm:-start-36 sm:w-[32rem]" />
    </div>
  );
}

/** A small standalone logo silhouette. */
export function LogoSilhouetteMark({ className }: { className?: string }) {
  return <LogoSilhouette className={cn("h-6 w-6", className)} />;
}

/** Section divider with a small logo silhouette at its centre. */
export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("text-secondary flex items-center justify-center gap-5", className)}
      aria-hidden="true"
    >
      <span className="to-secondary h-px w-16 bg-gradient-to-r from-transparent sm:w-28" />
      <LogoSilhouetteMark className="h-5 w-5 opacity-70" />
      <span className="to-secondary h-px w-16 bg-gradient-to-l from-transparent sm:w-28" />
    </div>
  );
}
