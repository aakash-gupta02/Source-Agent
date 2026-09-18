import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { REGISTER_ROUTE } from "@/features/auth/routes";

export function GradientGridHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-9 lg:px-16">
        <div className="relative">
          <div className="relative flex min-h-[820px] w-full items-center justify-center overflow-hidden rounded-none bg-[radial-gradient(ellipse_at_center,#1e40af_0%,#1d4ed8_25%,#3b82f6_55%,#93c5fd_85%,#dbeafe_100%)] px-6 py-24 sm:rounded-2xl lg:py-32">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)
                `,
                backgroundSize: "16px 16px",
                maskImage:
                  "radial-gradient(ellipse 75% 70% at 50% 45%, black 30%, transparent 90%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 75% 70% at 50% 45%, black 30%, transparent 90%)",
              }}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
                maskImage:
                  "radial-gradient(ellipse 60% 55% at 50% 45%, black 10%, transparent 80%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 60% 55% at 50% 45%, black 10%, transparent 80%)",
              }}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 40%, rgba(15,23,42,0.35) 100%)",
              }}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />

            <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Talk to your database
              </div>

              <h1 className="font-serif text-5xl font-normal leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
                Ask your database
                <br className="hidden sm:block" />
                a question.
                <br className="hidden sm:block" />
                Watch an agent
                <br className="hidden sm:block" />
                write the SQL.
              </h1>

              <p className="mt-8 max-w-xl text-base leading-7 text-blue-50/90 sm:text-lg">
                Connect PostgreSQL, ask in plain English, and get the SQL plus
                results. Writes pause until you approve them.
              </p>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <Link
                  href={REGISTER_ROUTE}
                  className="group inline-flex items-center gap-3 bg-white px-7 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_60px_rgba(15,23,42,0.3)] active:translate-y-0"
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
          </div>
        </div>
      </div>
    </section>
  );
}
