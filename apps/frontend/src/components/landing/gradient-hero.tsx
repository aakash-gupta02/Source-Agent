"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Database, Sparkles } from "lucide-react";

import { APP_ROUTE } from "@/features/auth/routes";
import { Button } from "@/components/ui/button";
import SkyGradient from "./sky-gradient";

export default function GradientHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-9 lg:px-16">
        <div className="relative overflow-hidden rounded-none sm:rounded-2xl">
          {/* Sky */}
          <div className="absolute inset-0">
            <SkyGradient className="h-full w-full" speed={10} />
          </div>

          {/* Soft white overlay */}
          {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-white/20 to-white/80" /> */}

          {/* Hero */}
          <div className="relative flex min-h-[820px] items-center justify-center px-6 py-24 lg:py-32">
            <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
              {/* Eyebrow */}
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-white/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/65 shadow-sm backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Talk to your database
              </div>

              {/* Heading */}
              <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-black sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
                Talk to your data.
                <br className="hidden sm:block" />
                Let an agent
                <br className="hidden sm:block" />
                <span className="text-black/45">handle the SQL.</span>
              </h1>

              {/* Description */}
              <p className="mt-8 max-w-xl text-base leading-7 text-black/60 sm:text-lg">
                Connect PostgreSQL, ask in plain English, and get the SQL plus
                results. Writes pause until you approve them.
              </p>

              {/* Actions */}
              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <Button
                  render={<Link href={APP_ROUTE} />}
                  className="group h-10 gap-2 rounded-lg bg-black px-4 text-xs font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-black/85"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Open the studio
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Button>

                <Button
                  variant="ghost"
                  render={<Link href="#feature" />}
                  className="h-10 gap-2 px-4 text-xs font-semibold text-black/60 hover:bg-white/30 hover:text-black"
                >
                  See what it does
                </Button>
              </div>
            </div>

            {/* Agent activity card */}
            <div className="absolute right-8 top-1/2 z-20 hidden w-64 translate-y-16 rotate-2 rounded-xl border border-black/10 bg-white/55 p-4 text-left shadow-2xl backdrop-blur-xl lg:block xl:right-16">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black/5">
                    <Sparkles className="h-3.5 w-3.5 text-black/60" />
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/50">
                    Agent activity
                  </span>
                </div>

                <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Running
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-md bg-black/[0.04] px-3 py-2">
                  <Database className="h-3.5 w-3.5 text-black/45" />

                  <span className="font-mono text-[10px] text-black/65">
                    get_table_schema
                  </span>

                  <Check className="ml-auto h-3 w-3 text-emerald-500" />
                </div>

                <div className="flex items-center gap-2 rounded-md bg-white/60 px-3 py-2">
                  <Sparkles className="h-3.5 w-3.5 text-black/50" />

                  <span className="font-mono text-[10px] text-black/80">
                    execute_sql
                  </span>

                  <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                </div>
              </div>

              <div className="mt-4 border-t border-black/10 pt-3">
                <p className="font-mono text-[9px] leading-4 text-black/40">
                  SELECT name, email
                  <br />
                  FROM users
                  <br />
                  WHERE ...
                </p>
              </div>
            </div>

            {/* Bottom metadata */}
            <div className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-black/35 sm:flex">
              <span>PostgreSQL</span>
              <span className="h-1 w-1 rounded-full bg-black/20" />
              <span>Tool calling</span>
              <span className="h-1 w-1 rounded-full bg-black/20" />
              <span>Human approval</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
