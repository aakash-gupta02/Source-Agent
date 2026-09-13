import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "text" | "icon" | "both";
  iconClassName?: string;
  textClassName?: string;
};

/** Source Agent brand logo — use across auth, nav, and marketing. */
export function Logo({
  className,
  variant = "both",
  iconClassName,
  textClassName,
}: LogoProps) {
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
          className={cn("size-8 object-contain", iconClassName)}
        />
      )}

      {showText && (
        <span
          className={cn(
            "text-h2 font-semibold tracking-tight text-ink",
            textClassName,
          )}
        >
          Source Agent
        </span>
      )}
    </span>
  );
}
