"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ScanSearch,
  BrainCircuit,
  Wallet,
  Radar,
  PlugZap,
  Check,
  FileSearch,
  WalletCards,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import { Header } from "./header";
import { WordReveal } from "./word-reveal";


export function HeroSection() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-[1600px] px-5 sm:px-9 lg:px-16">
      {/* Vertical guide lines */}
      <div className="pointer-events-none absolute left-5 top-0 hidden h-full w-px bg-border/80 sm:left-9 md:block lg:left-16" />
      <div className="pointer-events-none absolute right-5 top-0 hidden h-full w-px bg-border/80 sm:right-9 md:block lg:right-16" />

      <Header />

      <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:pb-32 lg:pt-24 pt-16 pr-16 pb-24 pl-16 gap-x-12 gap-y-12 items-center">
        {/* Left content */}
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.08em] text-primary">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent">
              <Sparkles className="h-[18px] w-[18px]" />
            </span>
            Talk to Your Database
          </div>

          <h1 className="max-w-[760px] text-[3.15rem] font-semibold leading-[1.03] tracking-[-0.065em] text-foreground sm:text-6xl lg:text-[4.55rem] xl:text-[5.05rem]">
            <WordReveal>Query your data</WordReveal>{" "}
            <WordReveal>with AI,</WordReveal>{" "}
            <WordReveal>from</WordReveal>{" "}
            <span className="text-primary">
              <WordReveal>question</WordReveal>{" "}
              <WordReveal>to</WordReveal>{" "}
              <WordReveal>insight.</WordReveal>
            </span>
          </h1>

          <p className="mt-7 max-w-[590px] text-lg leading-8 text-muted-foreground sm:text-xl">
            Source Agent connects to your PostgreSQL database and AI provider,
            letting you chat naturally with your data - no SQL required.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:gap-5">
            <Button size="lg" className="rounded-[18px] h-14">
              <Link href="/get-started">
                Start free trial
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-[18px] h-14"
            >
              <Link href="/demo">
                <Calendar className="mr-2 h-5 w-5" />
                Book demo
              </Link>
            </Button>
          </div>
        </div>

        {/* Right visual - Dashboard mockup */}
        <div className="relative mx-auto h-[620px] w-full max-w-[760px]">
          <div className="absolute right-[2%] top-[17%] h-[360px] w-[360px] rounded-full bg-primary/5 blur-3xl" />

          {/* Chat interface card */}
          <div className="absolute left-0 top-[8%] w-[88%] overflow-hidden rounded-[18px] border border-border bg-card/85 backdrop-blur-xl shadow-[0_16px_44px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
                  <ScanSearch className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Database Chat Console
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    Connected to production_db
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-semibold text-green-600 dark:border-green-900 dark:bg-green-950 dark:text-green-400">
                Live
              </span>
            </div>

            <div className="grid lg:grid-cols-[180px_1fr]">
              <aside className="hidden border-r border-border bg-muted/40 p-4 lg:block">
                <div className="space-y-2 text-xs font-semibold text-muted-foreground">
                  <button className="flex w-full items-center gap-2 rounded-lg border border-primary/30 px-3 py-2 text-primary">
                    <BrainCircuit className="h-4 w-4" />
                    Chat
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2">
                    <Wallet className="h-4 w-4" />
                    Queries
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2">
                    <Radar className="h-4 w-4" />
                    Schema
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2">
                    <PlugZap className="h-4 w-4" />
                    Connections
                  </button>
                </div>
              </aside>

              <div className="p-5 sm:p-7">
                {/* Chat messages */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      You
                    </span>
                    <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm">
                      Show me the top 5 customers by total order value this quarter
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-primary">
                          Generated SQL
                        </span>
                        <span className="text-xs text-muted-foreground">
                          0.4s
                        </span>
                      </div>
                      <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-[11px] leading-relaxed text-foreground">
{`SELECT c.name, SUM(o.total) AS value
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.created_at >= NOW() - INTERVAL '3 months'
GROUP BY c.name
ORDER BY value DESC
LIMIT 5;`}
                      </pre>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div className="rounded-2xl rounded-tl-sm bg-accent/50 border border-primary/10 px-4 py-3">
                      <div className="space-y-2">
                        {[
                          { name: "Acme Corp", value: "$284,500" },
                          { name: "Northwind", value: "$198,200" },
                          { name: "Globex Inc", value: "$156,800" },
                        ].map((row) => (
                          <div
                            key={row.name}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="font-medium text-foreground">
                              {row.name}
                            </span>
                            <span className="font-semibold text-primary">
                              {row.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SQL result card */}
          <div className="absolute bottom-[11%] right-0 w-[360px] max-w-[72%] rounded-[18px] border border-primary/30 bg-[radial-gradient(circle_at_90%_20%,rgba(96,165,250,0.85),transparent_16%),linear-gradient(135deg,#0b2da8_0%,#071855_56%,#0c37c8_100%)] p-6 text-white shadow-[0_30px_60px_rgba(29,78,216,0.34),inset_0_1px_0_rgba(255,255,255,0.28)]">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-50">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-primary">
                  <Check className="h-3 w-3" />
                </span>
                Query complete
              </span>
              <WalletCards className="h-8 w-8" />
            </div>
            <p className="mt-6 text-4xl font-semibold tracking-[-0.04em]">
              5 rows
            </p>
            <p className="mt-3 text-sm leading-6 text-blue-50">
              Results returned in 420ms with AI-generated explanation and
              chart suggestions.
            </p>
          </div>

          {/* Schema card */}
          <div className="absolute bottom-[4%] left-[8%] w-[250px] rounded-[16px] border border-border bg-card p-5 shadow-[0_16px_44px_rgba(15,23,42,0.07)]">
            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white">
                <Check className="h-3 w-3" />
              </span>
              <p className="text-sm font-semibold text-foreground">
                Schema synced
              </p>
            </div>
            <div className="mt-5 flex items-end gap-2">
              <span className="w-5 rounded-t bg-primary/20" style={{ height: 42 }} />
              <span className="w-5 rounded-t bg-primary/40" style={{ height: 58 }} />
              <span className="w-5 rounded-t bg-primary/20" style={{ height: 36 }} />
              <span className="w-5 rounded-t bg-primary" style={{ height: 76 }} />
              <span className="w-5 rounded-t bg-cyan-200" style={{ height: 48 }} />
              <span className="w-5 rounded-t bg-primary/20" style={{ height: 64 }} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              24 tables · 186 columns
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

