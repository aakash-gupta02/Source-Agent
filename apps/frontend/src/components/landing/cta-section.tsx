import Link from "next/link";
import { ArrowUpRight, BookOpen, Database, Sparkles } from "lucide-react";

import { LOGIN_ROUTE, REGISTER_ROUTE } from "@/features/auth/routes";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative mx-auto w-full max-w-[1600px] px-5 pt-28 pr-5 pb-16 pl-5 sm:px-9 lg:px-16">
        <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-border/80 sm:left-9 md:block lg:left-16" />
        <div className="pointer-events-none absolute right-6 top-0 hidden h-full w-px bg-border/80 sm:right-9 md:block lg:right-16" />

        <div className="border border-border bg-card p-10 shadow-[0_12px_40px_rgba(15,23,42,0.03)] sm:p-16 lg:p-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-6 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                <div className="grid grid-cols-2 gap-0.5">
                  <span className="h-1.5 w-1.5 bg-primary" />
                  <span className="h-1.5 w-1.5 bg-primary" />
                  <span className="h-1.5 w-1.5 bg-primary" />
                  <span className="h-1.5 w-1.5 bg-primary" />
                </div>
                Ready when you are
              </div>

              <h2 className="text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                Bring a database.{" "}
                <span className="text-primary">Ask it something real.</span>
              </h2>

              <p className="mt-6 text-lg leading-7 text-muted-foreground">
                Sign in, connect Postgres, pick a model, and start asking
                questions your schema can actually answer.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={REGISTER_ROUTE}
                  className="inline-flex h-14 items-center justify-center rounded-[18px] bg-primary px-7 font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Open the studio
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href={LOGIN_ROUTE}
                  className="inline-flex h-14 items-center justify-center rounded-[18px] border border-border bg-background px-7 font-semibold text-foreground transition hover:bg-muted"
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2.5 border border-border bg-muted/40 px-4 py-2">
                  <Database className="h-4 w-4 text-primary" />
                  Your Postgres
                </div>
                <div className="flex items-center gap-2.5 border border-border bg-muted/40 px-4 py-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Your model key
                </div>
                <div className="flex items-center gap-2.5 border border-border bg-muted/40 px-4 py-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Human approval
                </div>
              </div>
            </div>

            <div className="relative flex min-h-90 w-full items-center justify-center lg:h-full">
              <CentralGraphic />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CentralGraphic() {
  return (
    <div className="relative h-90 w-full max-w-105">
      <style>{`
        @keyframes grid-pan { 0% { transform: translateY(0); } 100% { transform: translateY(24px); } }
        @keyframes orbit-spin { 0% { transform: rotateX(65deg) rotateZ(0deg); } 100% { transform: rotateX(65deg) rotateZ(360deg); } }
        @keyframes orbit-spin-reverse { 0% { transform: rotateX(65deg) rotateZ(360deg); } 100% { transform: rotateX(65deg) rotateZ(0deg); } }
        @keyframes pulse-aura { 0%,100% { opacity: .3; filter: blur(24px); transform: scale(1); } 50% { opacity: .7; filter: blur(32px); transform: scale(1.3); } }
        @keyframes float-y { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes pulse-dot { 0%,100% { transform: scale(1); opacity: .8; } 50% { transform: scale(1.2); opacity: 1; } }
      `}</style>

      <div
        className="pointer-events-none absolute inset-[-50%] opacity-40"
        style={{
          backgroundImage: "radial-gradient(rgba(148,163,184,0.6) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          animation: "grid-pan 3s linear infinite",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center transform-3d pointer-events-none">
        <div
          className="absolute h-80 w-[320px] rounded-full border-[1.5px] border-dashed border-border shadow-[inset_0_0_30px_rgba(148,163,184,0.15)]"
          style={{ animation: "orbit-spin 24s linear infinite" }}
        />
        <div
          className="absolute h-45 w-45 rounded-full border-[1.5px] border-dashed border-primary/40 shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]"
          style={{ animation: "orbit-spin-reverse 16s linear infinite" }}
        />
      </div>

      <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 border-l border-dashed border-border/80" />
      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-border/80" />

      <div
        className="absolute left-1/2 top-1/2 z-10 flex h-26 w-26 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-card/90 shadow-[0_0_40px_rgba(29,78,216,0.15)] ring-1 ring-border backdrop-blur-md"
        style={{ animation: "float-y 5s ease-in-out infinite" }}
      >
        <div
          className="absolute -inset-8 rounded-full bg-primary/25"
          style={{ animation: "pulse-aura 4s ease-in-out infinite", zIndex: -1 }}
        />
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 0.4, 1.2, 0.8].map((delay, i) => (
            <span
              key={i}
              className="h-4 w-4 rounded-[3px] bg-primary"
              style={{ animation: `pulse-dot 2s ease-in-out infinite`, animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>

      {[
        { top: "1.5rem", left: "50%", label: "DB" },
        { bottom: "1.5rem", left: "50%", label: "AI" },
        { top: "50%", left: "1.5rem", label: "SQL" },
        { top: "50%", right: "1.5rem", label: "HITL" },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={pos as React.CSSProperties}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card/80 text-primary shadow-[0_15px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm"
            style={{ animation: `float-y 4s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}
          >
            <span className="text-xs font-bold">{pos.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
