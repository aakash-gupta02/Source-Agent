import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "text" | "icon" | "both";
};

/** Source Agent brand logo — use across auth, nav, and marketing. */
export function Logo({ className, variant = "both" }: LogoProps) {
  const showIcon = variant === "icon" || variant === "both";
  const showText = variant === "text" || variant === "both";

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {showIcon && (
        <Image
          src="/images/icons/android-chrome-512x512.png"
          alt="Source Agent"
          width={32}
          height={32}
          className="size-8 object-contain"
        />
      )}

      {showText && (
        <span className="text-h2 font-semibold tracking-tight text-ink">
          Source Agent
        </span>
      )}
    </span>
  );
}
