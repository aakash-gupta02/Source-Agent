import Link from "next/link";
import { Menu } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "@/features/auth/routes";

const navItems = [
  { href: "#feature", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
] as const;

export function Header() {
  return (
    <header className="border-b border-slate-200/80 bg-background">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 py-6 sm:px-9 lg:px-16">
        <Link href="/" aria-label="Source Agent homepage">
          <Logo textClassName="text-2xl sm:text-3xl tracking-[-0.04em]" />
        </Link>

        <nav
          aria-label="Page sections"
          className="hidden items-center gap-10 text-sm font-medium text-foreground xl:flex"
        >
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-primary">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={LOGIN_ROUTE}
            className="hidden text-sm font-medium text-foreground transition hover:text-primary sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href={REGISTER_ROUTE}
            className="hidden h-11 items-center rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:inline-flex"
          >
            Open the studio
          </Link>

          <details className="relative xl:hidden">
            <summary className="flex size-10 list-none items-center justify-center rounded-xl border border-border bg-card [&::-webkit-details-marker]:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </summary>
            <div className="absolute right-0 z-20 mt-3 w-56 rounded-2xl border border-border bg-card p-3 shadow-lg">
              <nav aria-label="Mobile page sections" className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                <Link
                  href={LOGIN_ROUTE}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Sign in
                </Link>
                <Link
                  href={REGISTER_ROUTE}
                  className="rounded-xl bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
                >
                  Open the studio
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
