import Link from "next/link";
import { BarChart3, Database, Shield, Sparkles } from "lucide-react";

import { REGISTER_ROUTE } from "@/features/auth/routes";

const features = [
  {
    icon: Sparkles,
    title: "Questions become tool calls",
    description:
      "The agent does not guess table names. It uses tools to list tables, inspect columns, sample values, then writes SQL.",
  },
  {
    icon: Database,
    title: "Postgres is the source of truth",
    description:
      "Point it at a real database. Schema, keys, and relationships come from the connection - not from a prompt.",
  },
  {
    icon: Shield,
    title: "Writes wait for you",
    description:
      "INSERT, UPDATE, and DELETE pause the graph. You approve or reject before anything hits the database.",
  },
  {
    icon: BarChart3,
    title: "A conversation, not a console",
    description:
      "Results come back in chat with the SQL the model used, so you can see how it got there - and catch mistakes.",
  },
];

export function FeaturesSection() {
  return (
    <section id="feature" className="relative scroll-mt-24 overflow-hidden bg-background">
      <div className="relative mx-auto w-full max-w-[1600px] px-5 pt-0 pr-5 pb-0 pl-5 sm:px-9 lg:px-16">
        <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-border/80 sm:left-9 md:block lg:left-16" />
        <div className="pointer-events-none absolute right-6 top-0 hidden h-full w-px bg-border/80 sm:right-9 md:block lg:right-16" />

        <div className="relative border-x border-border/80">
          <div className="grid gap-8 border-y border-border/80 px-6 py-16 sm:px-8 md:grid-cols-[1fr_0.72fr] md:items-end lg:px-16 lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.04em] text-primary">
                <Sparkles className="h-4 w-4" />
                Features
              </div>
              <h2 className="max-w-160 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Everything you need to{" "}
                <span className="text-primary">talk to your data.</span>
              </h2>
            </div>
            <p className="max-w-107 text-base leading-7 text-muted-foreground md:justify-self-end">
              Connect your database, choose a model, and start asking questions.
              Source Agent inspects the schema, writes the SQL, and shows its work.
            </p>
          </div>

          <div className="grid border-b border-border/80 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="group border-b border-border/80 p-10 transition-colors duration-300 hover:bg-muted/40 sm:px-8 lg:px-10 lg:py-16 xl:border-b-0 xl:border-r xl:last:border-r-0"
                >
                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="grid items-center gap-8 border-b border-border/80 px-6 py-16 sm:px-8 md:grid-cols-[1fr_1.15fr_auto] lg:px-16 lg:py-20">
            <h3 className="text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl">
              One connection.
              <br />
              <span className="text-primary">Every question answered.</span>
            </h3>
            <p className="max-w-115 text-sm leading-6 text-muted-foreground">
              Schema tools, safe SQL execution, and human approval for writes -
              in one conversation.
            </p>
            <Link
              href={REGISTER_ROUTE}
              className="inline-flex h-14 items-center justify-center rounded-[18px] bg-primary px-7 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Try a conversation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
