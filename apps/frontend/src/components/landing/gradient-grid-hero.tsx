import Link from "next/link";
import { ArrowUpRight, Check, Database, Sparkles } from "lucide-react";

import { REGISTER_ROUTE } from "@/features/auth/routes";

export function GradientGridHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-9 lg:px-16">
        <div className="relative">
          <div
            className="
              relative flex min-h-[820px] w-full items-center justify-center
              overflow-hidden rounded-none px-6 py-24
              sm:rounded-2xl lg:py-32
              bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.55),transparent_32%),linear-gradient(180deg,#0b2da8_0%,#06145b_100%)]
            "
          >
            {/* Main grid */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(
                    to right,
                    rgba(255,255,255,0.14) 1px,
                    transparent 1px
                  ),
                  linear-gradient(
                    to bottom,
                    rgba(255,255,255,0.14) 1px,
                    transparent 1px
                  )
                `,
                backgroundSize: "16px 16px",
                maskImage:
                  "radial-gradient(ellipse 75% 70% at 50% 45%, black 25%, transparent 90%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 75% 70% at 50% 45%, black 25%, transparent 90%)",
              }}
            />

            {/* Small dot field */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "6px 6px",
                maskImage:
                  "radial-gradient(ellipse 55% 55% at 50% 42%, black 0%, transparent 78%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 55% 55% at 50% 42%, black 0%, transparent 78%)",
              }}
            />

            {/* Right dotted panel */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-64 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
                backgroundSize: "6px 6px",
                maskImage:
                  "linear-gradient(to left, black, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to left, black, transparent)",
              }}
            />

            {/* Ambient glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-400/20 blur-3xl"
            />

            <div
              aria-hidden
              className="pointer-events-none absolute -right-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-blue-300/15 blur-3xl"
            />

            {/* Vignette */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 35%, rgba(2,6,23,0.42) 100%)",
              }}
            />

            {/* Borders */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />

            {/* Small agent card */}
            <div className="absolute right-8 top-1/2 z-10 hidden w-64 translate-y-16 rotate-2 rounded-xl border border-white/15 bg-white/[0.08] p-4 text-left shadow-2xl backdrop-blur-md lg:block xl:right-16">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10">
                    <Sparkles className="h-3.5 w-3.5 text-blue-100" />
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    Agent activity
                  </span>
                </div>

                <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Running
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-md bg-black/15 px-3 py-2">
                  <Database className="h-3.5 w-3.5 text-blue-200" />
                  <span className="font-mono text-[10px] text-white/80">
                    get_table_schema
                  </span>
                  <Check className="ml-auto h-3 w-3 text-emerald-300" />
                </div>

                <div className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2">
                  <Sparkles className="h-3.5 w-3.5 text-blue-100" />
                  <span className="font-mono text-[10px] text-white">
                    execute_sql
                  </span>
                  <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-blue-200" />
                </div>
              </div>

              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="font-mono text-[9px] leading-4 text-white/45">
                  SELECT name, email
                  <br />
                  FROM users
                  <br />
                  WHERE ...
                </p>
              </div>
            </div>

            {/* Hero content */}
            <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center text-center">
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Talk to your database
              </div>

              <h1 className="font-serif text-5xl font-normal leading-[1.04] tracking-[-0.025em] text-white sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
                Talk to your data.
                <br className="hidden sm:block" />
                Let an agent
                <br className="hidden sm:block" />
                handle the SQL.
              </h1>

              <p className="mt-8 max-w-xl text-base leading-7 text-blue-50/90 sm:text-lg">
                Connect PostgreSQL, ask in plain English, and get the SQL plus
                results. Writes pause until you approve them.
              </p>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <Link
                  href={REGISTER_ROUTE}
                  className="group inline-flex items-center gap-3 bg-white px-7 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_60px_rgba(15,23,42,0.4)] active:translate-y-0"
                >
                  <Sparkles className="h-4 w-4" />
                  Open the studio
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <a
                  href="#feature"
                  className="inline-flex items-center gap-2 px-5 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-white/90 transition hover:text-white"
                >
                  See what it does
                </a>
              </div>
            </div>

            {/* Tiny bottom status */}
            <div className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 sm:flex">
              <span>PostgreSQL</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>Tool calling</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>Human approval</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}