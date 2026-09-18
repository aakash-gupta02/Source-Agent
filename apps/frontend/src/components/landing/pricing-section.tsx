"use client";

import { Check, Sparkles, Shield, ArrowUpRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WordReveal } from "./word-reveal";

const plans = [
  {
    step: "01",
    name: "Starter",
    description: "Perfect for solo developers and small teams exploring conversational data access.",
    price: "$29",
    period: "/mo",
    note: "Best for a single database and personal projects.",
    features: [
      "1 database connection",
      "100 queries / month",
      "GPT-4o mini & Claude Haiku",
      "Query history",
      "Email support",
    ],
    cta: "Start free trial",
    variant: "outline" as const,
  },
  {
    step: "02",
    name: "Growth",
    description: "Built for teams that want unlimited questions and multiple databases.",
    price: "$99",
    period: "/mo",
    note: "The full experience with all AI providers and unlimited queries.",
    features: [
      "5 database connections",
      "Unlimited queries",
      "GPT-4o, Claude Sonnet, Gemini",
      "Team workspaces",
      "Audit logs & RBAC",
      "Priority support",
    ],
    cta: "Start free trial",
    variant: "default" as const,
    popular: true,
  },
  {
    step: "03",
    name: "Enterprise",
    description: "For organizations with compliance, scale, and custom requirements.",
    price: "Custom",
    note: "Pricing based on volume, SSO, and dedicated infrastructure.",
    features: [
      "Unlimited connections",
      "Self-hosted option",
      "SSO / SAML",
      "Custom AI providers",
      "Dedicated support",
      "SLA & onboarding",
    ],
    cta: "Talk to sales",
    variant: "outline" as const,
  },
];

export function PricingSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="sm:px-9 lg:pt-0 lg:pl-16 lg:pr-16 lg:pb-0 w-full max-w-[1600px] mx-auto pt-0 pr-16 pb-0 pl-16 relative">
        <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-border/80 sm:left-9 md:block lg:left-16" />
        <div className="pointer-events-none absolute right-6 top-0 hidden h-full w-px bg-border/80 sm:right-9 md:block lg:right-16" />

        <div className="relative border-x border-y border-border/80">
          {/* Header */}
          <div className="grid border-b border-border/80 lg:grid-cols-[1.35fr_1fr]">
            <div className="px-8 pb-24 pt-20 sm:px-12 lg:px-16 lg:pb-32 lg:pt-28">
              <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <Sparkles className="h-4 w-4" />
                Pricing
              </div>
              <h2 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                <WordReveal>Simple</WordReveal>{" "}
                <WordReveal>pricing</WordReveal>{" "}
                <WordReveal>that</WordReveal>{" "}
                <span className="text-primary">
                  <WordReveal>scales</WordReveal>{" "}
                  <WordReveal>with</WordReveal>{" "}
                  <WordReveal>you.</WordReveal>
                </span>
              </h2>
            </div>
            <div className="flex items-center px-8 pb-20 sm:px-12 lg:px-16 lg:pb-0 lg:pt-28">
              <div>
                <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                  Start free, upgrade when you need more databases, more AI
                  providers, or team features.
                </p>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="grid border-b border-border/80 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex min-h-[560px] flex-col px-8 py-14 sm:px-12 lg:px-14 lg:py-20 ${
                  plan.popular
                    ? "overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.55),transparent_38%),linear-gradient(150deg,#020617_0%,#06145b_54%,#020617_100%)] text-white"
                    : "border-b border-border/80 bg-card lg:border-b-0 lg:border-r last:lg:border-r-0"
                }`}
              >
                {plan.popular && (
                  <div
                    className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-35"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.42) 1px, transparent 1px)",
                      backgroundSize: "18px 18px",
                    }}
                  />
                )}

                <div className="relative mb-8 flex items-center justify-between">
                  <span
                    className={`text-base font-medium ${
                      plan.popular ? "text-blue-100" : "text-muted-foreground"
                    }`}
                  >
                    {plan.step}
                  </span>
                  <span
                    className={`border px-4 py-1.5 text-sm font-medium ${
                      plan.popular
                        ? "border-white/15 bg-white/10 text-blue-50"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {plan.popular ? "Most popular" : plan.name}
                  </span>
                </div>

                <div className="relative mb-8">
                  <h3
                    className={`text-3xl font-semibold tracking-tight ${
                      plan.popular ? "text-white" : "text-foreground"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`mt-3 text-base leading-7 ${
                      plan.popular ? "text-blue-100" : "text-muted-foreground"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div
                  className={`relative mb-8 border p-6 ${
                    plan.popular
                      ? "border-white/15 bg-white/10 shadow-[0_28px_80px_rgba(0,0,0,0.22)]"
                      : "border-border bg-card shadow-[0_24px_70px_rgba(15,23,42,0.06)]"
                  }`}
                >
                  <div className="flex items-end gap-1">
                    <span
                      className={`text-5xl font-semibold tracking-tight ${
                        plan.popular ? "text-white" : "text-primary"
                      }`}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span
                        className={`mb-2 text-base ${
                          plan.popular ? "text-blue-100" : "text-muted-foreground"
                        }`}
                      >
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-3 text-sm leading-6 ${
                      plan.popular ? "text-blue-100" : "text-muted-foreground"
                    }`}
                  >
                    {plan.note}
                  </p>
                </div>

                <ul
                  className={`relative mb-10 space-y-4 text-base leading-6 ${
                    plan.popular ? "text-blue-50" : "text-muted-foreground"
                  }`}
                >
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center ${
                          plan.popular
                            ? "bg-primary-foreground/20 text-white"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.variant}
                  size="lg"
                  className="relative mt-auto h-14 rounded-[18px]"
                >
                  <a href="/get-started">{plan.cta}</a>
                </Button>
              </article>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="grid items-center gap-8 px-8 pt-16 pb-16 sm:px-12 lg:grid-cols-[1fr_auto] lg:px-16 lg:py-24">
            <div>
              <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                Start free. Scale when your team is ready.
              </h3>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-muted-foreground/40">
                No setup fees. Cancel anytime.
              </p>
            </div>
            <Button size="lg" className="h-14 rounded-[18px]">
              <a href="/get-started">
                Book a demo
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

