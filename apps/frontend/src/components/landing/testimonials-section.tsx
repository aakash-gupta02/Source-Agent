"use client";

import { Quote, Sparkles } from "lucide-react";
import { WordReveal } from "./word-reveal";

const testimonials = [
  {
    quote:
      "Source Agent cut our data request turnaround from days to seconds. Our analysts now answer their own questions without writing SQL.",
    name: "Maya Chen",
    role: "Head of Data",
    company: "Clearline Analytics",
    image:
      "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg",
    rotate: "xl:-rotate-2",
    bg: "bg-card",
  },
  {
    quote:
      "The AI-generated SQL is surprisingly accurate, and the schema awareness means it never hallucinates table names. Game changer.",
    name: "Arjun Patel",
    role: "Engineering Lead",
    company: "Summit Labs",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&h=96&q=80",
    rotate: "xl:rotate-1",
    bg: "bg-emerald-50/40 dark:bg-emerald-950/20",
  },
  {
    quote:
      "We onboarded the whole product team in a week. Now PMs, support, and ops all query the database directly - safely.",
    name: "Elena Rodriguez",
    role: "VP of Operations",
    company: "Northpeak",
    image:
      "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg",
    rotate: "xl:-mx-1",
    bg: "bg-primary/5 border-primary",
  },
  {
    quote:
      "The audit logs and read-only enforcement made security review painless. Our DBA approved it in one meeting.",
    name: "David Park",
    role: "Head of Platform",
    company: "Lumen",
    image:
      "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg",
    rotate: "xl:rotate-2",
    bg: "bg-orange-50/40 dark:bg-orange-950/20",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="sm:px-9 lg:pt-0 lg:pl-16 lg:pr-16 lg:pb-0 w-full max-w-[1600px] mx-auto pt-0 pr-16 pb-0 pl-16 relative">
        <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-border/80 sm:left-9 md:block lg:left-16" />
        <div className="pointer-events-none absolute right-6 top-0 hidden h-full w-px bg-border/80 sm:right-9 md:block lg:right-16" />

        <div className="relative border-y border-border/80">
          {/* Header */}
          <div className="grid gap-8 md:grid-cols-[0.9fr_1fr] md:items-end lg:px-12 lg:py-24 pt-20 pr-0 pb-20 pl-0">
            <div>
              <div className="mb-6 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                <Sparkles className="h-4 w-4" />
                Testimonials
              </div>
              <h2 className="max-w-[620px] text-4xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                <WordReveal>Loved</WordReveal>{" "}
                <WordReveal>by</WordReveal>{" "}
                <WordReveal>data</WordReveal>{" "}
                <WordReveal>teams</WordReveal>{" "}
                <span className="text-primary">
                  <WordReveal>everywhere.</WordReveal>
                </span>
              </h2>
            </div>
            <p className="max-w-[460px] text-base leading-7 text-muted-foreground md:justify-self-end">
              From startups to enterprises, teams use Source Agent to make their
              databases conversational.
            </p>
          </div>

          {/* Testimonial cards */}
          <div className="group grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-0">
            {testimonials.map((t, i) => (
              <article
                key={t.name}
                className={`group/card relative border border-border p-8 shadow-[0_24px_70px_rgba(15,23,42,0.07)] backdrop-blur transition-all duration-500 ease-out hover:z-20 hover:-translate-y-2 hover:scale-[1.02] hover:border-primary hover:shadow-[0_28px_80px_rgba(37,99,235,0.16)] sm:p-9 ${t.rotate} ${t.bg} ${
                  i < testimonials.length - 1 ? "xl:-mr-4" : ""
                } ${i === 0 ? "xl:mt-7" : ""} ${i === 1 ? "xl:mt-5" : ""} ${
                  i === 3 ? "xl:mt-8 xl:-ml-4" : ""
                }`}
              >
                <Quote className="mb-6 h-8 w-8 fill-primary/10 text-primary transition-all duration-500 group-hover/card:scale-110" />
                <p className="text-lg font-normal leading-8 text-foreground">
                  &quot;{t.quote}&quot;
                </p>
                <div className="mt-12 flex items-center gap-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover ring-1 ring-border transition-all duration-500 group-hover/card:scale-110 group-hover/card:ring-primary/30"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{t.role}</p>
                    <p className="text-sm text-muted-foreground">{t.company}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="grid items-center gap-8 border-t border-border/80 pt-16 pb-16 lg:grid-cols-[1fr_auto] lg:px-12 lg:py-20">
            <div>
              <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                Real teams. Real results.
              </h3>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-muted-foreground/40">
                One chat. Every answer.
              </p>
            </div>
            <a
              href="/testimonials"
              className="inline-flex h-14 items-center justify-center rounded-[18px] bg-primary px-7 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              More stories
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

