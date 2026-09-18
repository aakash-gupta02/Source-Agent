import Link from "next/link";
import { ArrowUpRight, HelpCircle } from "lucide-react";

import { REGISTER_ROUTE } from "@/features/auth/routes";

const faqs = [
  {
    question: "How does Source Agent connect to my database?",
    answer:
      "Add a PostgreSQL connection string. Source Agent inspects tables, columns, primary keys, and foreign keys - then uses that schema to answer questions.",
  },
  {
    question: "Which databases are supported?",
    answer:
      "PostgreSQL. The tools read Postgres catalogs for schema, keys, and relationships.",
  },
  {
    question: "Does the model see my whole database?",
    answer:
      "It sees what the tools return: table lists, schemas, samples, and query results. Credentials are encrypted at rest.",
  },
  {
    question: "Why does it stop on UPDATE or DELETE?",
    answer:
      "Write queries pause the agent. You approve or reject the SQL before it runs against your database.",
  },
  {
    question: "Which models can I use?",
    answer:
      "Bring your own provider and key. Configure it in the studio and the agent binds tools to that model.",
  },
  {
    question: "Where do I start?",
    answer:
      "Create an account, add a database, pick a model, and ask something your schema can actually answer.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="relative scroll-mt-24 overflow-hidden bg-background">
      <div className="relative mx-auto w-full max-w-[1600px] px-5 sm:px-9 lg:px-16">
        <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-border/80 sm:left-9 md:block lg:left-16" />
        <div className="pointer-events-none absolute right-6 top-0 hidden h-full w-px bg-border/80 sm:right-9 md:block lg:right-16" />

        <section className="relative border-x border-y border-border/80 bg-card">
          <div className="grid border-b border-border/80 lg:grid-cols-[1.35fr_1fr]">
            <div className="px-8 pb-24 pt-20 sm:px-12 lg:px-16 lg:pb-32 lg:pt-28">
              <div className="mb-7 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-primary">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </div>
              <h2 className="max-w-4xl text-5xl font-medium leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Frequently asked{" "}
                <span className="text-primary">questions.</span>
              </h2>
            </div>
            <div className="flex items-center px-8 pb-20 sm:px-12 lg:px-16 lg:pb-0 lg:pt-28">
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                How Source Agent connects, writes SQL, and keeps writes behind
                your approval.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="border-b border-border/80 px-8 py-16 sm:px-12 lg:border-b-0 lg:border-r lg:px-16 lg:py-20">
              <div className="border border-border bg-muted/40 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">
                  Studio
                </p>
                <h3 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
                  Ready to try it?
                </h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Create an account, add a database, pick a model, and ask
                  something your schema can actually answer.
                </p>
                <Link
                  href={REGISTER_ROUTE}
                  className="mt-8 inline-flex h-14 w-full items-center justify-center rounded-[18px] bg-primary px-7 font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Open the studio
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-2 border border-border">
                <div className="border-r border-border p-5">
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    HITL
                  </p>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    Writes pause
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    PG
                  </p>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    Postgres only
                  </p>
                </div>
              </div>
            </aside>

            <div className="px-8 py-16 sm:px-12 lg:px-16 lg:py-20">
              <div className="divide-y divide-border border-y border-border">
                {faqs.map((faq, i) => (
                  <details key={faq.question} className="group py-6" open={i === 0}>
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-8">
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                        {faq.question}
                      </h3>
                      <span className="mt-2 text-3xl font-light leading-none text-primary transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
