import { Database, Sparkles } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 overflow-hidden bg-background"
    >
      <div className="relative mx-auto w-full max-w-[1600px] px-5 sm:px-9 lg:px-16">
        <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-border/80 sm:left-9 md:block lg:left-16" />
        <div className="pointer-events-none absolute right-6 top-0 hidden h-full w-px bg-border/80 sm:right-9 md:block lg:right-16" />

        <div className="relative border-y border-border/80">
          <div className="grid gap-8 px-0 py-20 md:grid-cols-[0.9fr_1fr] md:items-end lg:px-12 lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                <Sparkles className="h-4 w-4" />
                How it works
              </div>
              <h2 className="max-w-[620px] text-4xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Connect, inspect,{" "}
                <span className="text-primary">then ask.</span>
              </h2>
            </div>
            <p className="max-w-[460px] text-base leading-7 text-muted-foreground md:justify-self-end">
              Three steps from a Postgres connection to an answer - with the
              SQL visible, and writes waiting on you.
            </p>
          </div>

          <div className="grid border-t border-border/80 lg:grid-cols-3">
            <article className="group relative min-h-[420px] border-b border-border/80 p-10 transition hover:bg-muted/40 lg:border-b-0 lg:border-r lg:p-14">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">01</span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border">
                  Connect
                </span>
              </div>

              <div className="mt-12 flex h-44 items-center justify-center">
                <div className="relative w-full max-w-[250px] rounded-2xl border border-border bg-card p-5 shadow-[0_22px_55px_rgba(15,23,42,0.08)]">
                  <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Database className="h-4 w-4 text-primary" />
                    New connection
                  </div>
                  <div className="space-y-2.5 text-xs font-medium text-muted-foreground">
                    {["Postgres URL", "AI provider", "Model + key"].map((label) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-lg bg-muted px-3 py-2"
                      >
                        {label}
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
                  Plug in Postgres and a model.
                </h3>
                <p className="mt-4 max-w-[360px] text-sm leading-6 text-muted-foreground">
                  Credentials stay encrypted. The agent only sees schema and
                  the rows it is allowed to query.
                </p>
              </div>
            </article>

            <article className="group relative min-h-[420px] overflow-hidden border-b border-border/80 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.55),transparent_32%),linear-gradient(180deg,#0b2da8_0%,#06145b_100%)] p-10 text-white shadow-[0_24px_70px_rgba(29,78,216,0.22)] lg:border-b-0 lg:border-r lg:p-14">
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-56 opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
                  backgroundSize: "6px 6px",
                }}
              />

              <div className="relative flex items-center justify-between">
                <span className="text-sm font-medium text-blue-100">02</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-50 ring-1 ring-white/15">
                  Inspect
                </span>
              </div>

              <div className="relative mt-12 flex h-44 items-center justify-center">
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-[0_0_38px_rgba(96,165,250,0.75)]">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="w-[180px] rounded-2xl border border-blue-300/40 bg-blue-700/45 p-5 shadow-[0_0_38px_rgba(96,165,250,0.35)] backdrop-blur">
                    <p className="text-xs text-blue-100">Tool loop</p>
                    <p className="mt-3 text-sm font-semibold text-emerald-200">
                      ● get_table_schema
                    </p>
                    <p className="mt-5 text-xs text-blue-100">Then</p>
                    <p className="text-2xl font-semibold tracking-tight">
                      execute_sql
                    </p>
                    <p className="mt-4 text-xs text-blue-100">or interrupt →</p>
                  </div>
                </div>
              </div>

              <div className="relative mt-10">
                <h3 className="text-2xl font-semibold leading-tight tracking-tight">
                  Ask in plain English.
                </h3>
                <p className="mt-4 max-w-[360px] text-sm leading-6 text-blue-100">
                  The graph picks tools, retries bad SQL, and shows the query
                  it ran so you can follow the reasoning.
                </p>
              </div>
            </article>

            <article className="group relative min-h-[420px] p-10 transition hover:bg-muted/40 lg:p-14">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">03</span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border">
                  Approve
                </span>
              </div>

              <div className="mt-12 flex h-44 items-center justify-center">
                <div className="w-full max-w-[250px] rounded-2xl border border-border bg-card p-5 shadow-[0_22px_55px_rgba(15,23,42,0.08)]">
                  <div className="mb-4 flex items-center justify-between text-xs font-semibold text-foreground">
                    <span>Write query</span>
                    <span className="text-muted-foreground">paused</span>
                  </div>
                  <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-[11px] leading-relaxed text-foreground">
                    {`UPDATE users
SET email = '...'
WHERE name = 'Aakash';`}
                  </pre>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Waiting for your approval
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
                  Reads run. Writes wait.
                </h3>
                <p className="mt-4 max-w-[360px] text-sm leading-6 text-muted-foreground">
                  SELECT comes back immediately. Anything that changes rows
                  interrupts the graph until you say yes.
                </p>
              </div>
            </article>
          </div>

          <div className="grid gap-6 border-t border-border/80 px-0 py-16 md:grid-cols-[1fr_auto] md:items-center lg:px-12 lg:py-20">
            <div>
              <p className="text-3xl font-semibold leading-tight tracking-tight text-foreground">
                From a question to a query you can audit.
              </p>
              <p className="mt-1 text-3xl font-semibold leading-tight tracking-tight text-muted-foreground/40">
                One chat. Clear SQL.
              </p>
            </div>
            <a
              href="#faq"
              className="inline-flex h-14 items-center justify-center rounded-[18px] bg-primary px-7 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Common questions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
