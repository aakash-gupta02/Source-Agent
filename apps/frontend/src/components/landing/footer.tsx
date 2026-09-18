import Link from "next/link";
import { ArrowUpRight, Layers, Sparkles } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "@/features/auth/routes";

const maker = {
  name: "Aakash Gupta",
  role: "Backend-Focused Full Stack Engineer",
  location: "Mumbai, India",
  note: "Open for collaboration",
  work: "SDE at Botspace",
  links: [
    { href: "https://aakashgupta.app", label: "Portfolio" },
    { href: "https://github.com/aakash-gupta02", label: "GitHub" },
    { href: "https://www.linkedin.com/in/aakash-gupta02", label: "LinkedIn" },
    { href: "https://x.com/aakashgupta_02", label: "X" },
  ],
} as const;

const columns = [
  {
    title: "On this page",
    icon: Layers,
    links: [
      { href: "#feature", label: "Features" },
      { href: "#how-it-works", label: "How it works" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Studio",
    icon: Sparkles,
    links: [
      { href: REGISTER_ROUTE, label: "Create an account" },
      { href: LOGIN_ROUTE, label: "Sign in" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-background">
      <div className="relative mx-auto w-full max-w-[1600px] px-5 pt-28 pr-5 pb-16 pl-5 sm:px-9 lg:px-16 lg:pt-32">
        <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-border/80 sm:left-9 md:block lg:left-16" />
        <div className="pointer-events-none absolute right-6 top-0 hidden h-full w-px bg-border/80 sm:right-9 md:block lg:right-16" />

        <div className="overflow-hidden border border-border bg-linear-to-br from-card via-muted/30 to-accent/40">
          <div className="grid border-b border-border lg:grid-cols-[1.15fr_0.95fr_1fr]">
            <div className="border-b border-border p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
              <Link href="/" aria-label="Source Agent homepage">
                <Logo textClassName="text-2xl tracking-tight" />
              </Link>

              <h3 className="mt-8 max-w-105 text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl">
                Talk to your data.
              </h3>
              <p className="mt-5 max-w-95 text-base leading-7 text-muted-foreground">
                An AI interface for PostgreSQL - inspect schema, generate SQL,
                and approve writes before they run.
              </p>
            </div>

            <div className="border-b border-border p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
              <span className="inline-flex border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground shadow-sm">
                Built by
              </span>
              <p className="mt-6 text-3xl font-semibold tracking-tight text-foreground">
                {maker.name}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {maker.role}
                <br />
                {maker.work} · {maker.location}
              </p>
              <p className="mt-3 text-sm text-foreground">{maker.note}</p>
              <ul className="mt-6 flex flex-wrap gap-3">
                {maker.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid sm:grid-cols-2">
              {columns.map((col) => {
                const Icon = col.icon;
                return (
                  <div
                    key={col.title}
                    className="border-b border-border p-8 last:border-b-0 sm:border-r sm:last:border-r-0 sm:p-10"
                  >
                    <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                      <Icon className="h-4 w-4 text-primary" />
                      {col.title}
                    </h4>
                    <ul className="mt-7 space-y-4 text-sm text-muted-foreground">
                      {col.links.map((link) => {
                        const isHash = link.href.startsWith("#");
                        const className =
                          "group flex items-center transition hover:text-primary";
                        const label = (
                          <>
                            <span className="mr-2 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary">
                              ›
                            </span>
                            {link.label}
                          </>
                        );

                        return (
                          <li key={link.href}>
                            {isHash ? (
                              <a href={link.href} className={className}>
                                {label}
                              </a>
                            ) : (
                              <Link href={link.href} className={className}>
                                {label}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid border-b border-border lg:grid-cols-[1fr_1fr]">
            <div className="border-b border-border px-8 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14">
              <p className="text-[clamp(56px,10vw,160px)] font-black leading-[0.82] tracking-[-0.09em] text-foreground">
                SOURCE
              </p>
            </div>
            <div className="flex items-end px-8 py-10 sm:px-10 lg:px-12 lg:py-14">
              <p className="max-w-xl text-[clamp(32px,5vw,80px)] font-black leading-[0.88] tracking-[-0.08em] text-primary">
                ASK FIRST.
                <br />
                WRITE LATER.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 px-8 py-7 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <p className="text-sm text-muted-foreground">
              © 2026 Source Agent. Built by{" "}
              <a
                href="https://aakashgupta.app"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground transition hover:text-primary"
              >
                {maker.name}
              </a>
              .
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#feature" className="transition hover:text-primary">
                Features
              </a>
              <div className="h-4 w-px bg-border" />
              <a href="#how-it-works" className="transition hover:text-primary">
                How it works
              </a>
              <div className="h-4 w-px bg-border" />
              <a
                href="https://aakashgupta.app"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-primary"
              >
                aakashgupta.app
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
