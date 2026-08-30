import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

/** Circular Voidforge mark (vortex crop). Square PWA icons live under /icons/icon-*.png. */
export function BrandMark({ size = 32, className, priority }: BrandMarkProps) {
  return (
    <Image
      src="/icons/icon-circle-192x192.png"
      alt=""
      width={size}
      height={size}
      priority={priority}
      className={cn("rounded-full shrink-0", className)}
      aria-hidden
    />
  );
}
