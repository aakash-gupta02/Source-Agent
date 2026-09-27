import Link from "next/link";
import { Menu } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { APP_ROUTE, LOGIN_ROUTE } from "@/features/auth/routes";

const navItems = [
  { href: "#feature", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
] as const;

export function Header() {
  return (
    <header className="relative z-30 w-full bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 py-5 sm:px-9 lg:px-16">
        <Link href="/" aria-label="Source Agent homepage">
          <Logo textClassName="text-2xl tracking-[-0.04em] text-slate-900 sm:text-3xl" />
        </Link>

        <nav
          aria-label="Page sections"
          className="hidden items-center gap-10 text-sm font-medium text-slate-900/75 xl:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            render={<Link href={LOGIN_ROUTE} />}
            className="hidden text-sm font-medium text-slate-900/80 hover:bg-slate-900/5 hover:text-slate-900 sm:inline-flex"
          >
            Sign in
          </Button>

          <Button
            render={<Link href={APP_ROUTE} />}
            className="hidden h-11 rounded-2xl px-5 text-sm font-semibold shadow-sm sm:inline-flex"
          >
            Open the studio
          </Button>

          <details className="relative xl:hidden">
            <summary className="flex size-10 list-none items-center justify-center rounded-xl border border-slate-900/15 bg-white/60 text-slate-900 backdrop-blur-sm [&::-webkit-details-marker]:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </summary>

            <div className="absolute right-0 z-20 mt-3 w-56 rounded-2xl border border-border bg-card p-3 shadow-lg">
              <nav
                aria-label="Mobile page sections"
                className="flex flex-col gap-1"
              >
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

                <Button
                  render={<Link href={APP_ROUTE} />}
                  className="w-full rounded-xl bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Open the studio
                </Button>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
