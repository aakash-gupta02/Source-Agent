const stack = [
  "PostgreSQL",
  "LangGraph",
  "LangChain",
  "Next.js",
  "Express",
  "Prisma",
  "TypeScript",
  "Ollama",
  "Gemini",
];

export function TrustedMarquee() {
  return (
    <section className="border-t border-border bg-background px-6 py-20 sm:px-9 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1600px]">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <p className="text-center text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Works with your stack
        </p>

        <div
          className="relative mt-8 overflow-hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div
            className="flex w-[max-content] items-center"
            style={{ animation: "marquee 40s linear infinite" }}
          >
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center gap-16 pr-16">
                {stack.map((name) => (
                  <span
                    key={`${dup}-${name}`}
                    className="text-2xl font-semibold tracking-tight text-muted-foreground/70"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
