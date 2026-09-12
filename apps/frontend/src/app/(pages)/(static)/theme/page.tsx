import { Button } from "@/components/ui/button";

const colors = [
  { name: "Primary", token: "bg-primary", hex: "#111111" },
  { name: "Primary Tint", token: "bg-primary-tint", hex: "#F4F4F4" },
  { name: "Ink / Text", token: "bg-ink", hex: "#111111" },
  { name: "Gray 600", token: "bg-gray-600", hex: "#666666" },
  { name: "Gray 400", token: "bg-gray-400", hex: "#999999" },
  { name: "Border", token: "bg-border", hex: "#E5E5E5" },
  { name: "Surface", token: "bg-surface", hex: "#F5F5F5" },
  { name: "Background", token: "bg-background", hex: "#FAFAFA" },
  { name: "White", token: "bg-white", hex: "#FFFFFF" },
  { name: "Rating", token: "bg-rating", hex: "#666666" },
  { name: "Success", token: "bg-success", hex: "#333333" },
  { name: "Success Tint", token: "bg-success-tint", hex: "#F0F0F0" },
  { name: "Error", token: "bg-error", hex: "#222222" },
  { name: "Error Tint", token: "bg-error-tint", hex: "#EEEEEE" },
] as const;

const typeScale = [
  { name: "Display / 44 SemiBold", className: "text-display font-semibold" },
  { name: "H1 / 32 SemiBold", className: "text-h1 font-semibold" },
  { name: "H2 / 24 SemiBold", className: "text-h2 font-semibold" },
  { name: "H3 / 20 SemiBold", className: "text-h3 font-semibold" },
  { name: "H4 / 16 SemiBold", className: "text-h4 font-semibold" },
  {
    name: "Body Emphasis / 14 Medium",
    className: "text-body-emphasis font-medium",
  },
  {
    name: "Body / 13 Regular",
    className: "text-body font-normal",
  },
  {
    name: "Caption / 12 Regular",
    className: "text-caption font-normal text-gray-600",
  },
  {
    name: "Overline / 11 SemiBold",
    className:
      "text-overline font-semibold uppercase tracking-wider text-gray-600",
    sample: "AI DATA AGENT",
  },
] as const;

export default function Home() {
  return (
    <div className="min-h-full bg-background">
      <main className="mx-auto w-full max-w-5xl space-y-12 px-6 py-12">
        <header className="space-y-2 border-b border-border pb-8">
          <p className="text-overline font-semibold uppercase tracking-wider text-ink">
            Source Agent
          </p>

          <h1 className="text-h1 font-semibold text-ink">
            Theme preview
          </h1>

          <p className="text-body text-gray-600">
            Colors and typography for the Source Agent design system.
            Components use a minimal black, white, and gray palette.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-h3 font-semibold text-ink">
            01 · Color
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {colors.map((color) => (
              <div key={color.name} className="space-y-2">
                <div
                  className={`h-16 w-full rounded-lg border border-border ${color.token}`}
                />

                <div>
                  <p className="text-caption font-medium text-ink">
                    {color.name}
                  </p>

                  <p className="text-caption text-gray-400">
                    {color.hex}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-h3 font-semibold text-ink">
            02 · Typography — Inter
          </h2>

          <div className="space-y-6 rounded-xl border border-border bg-white p-6">
            {typeScale.map((item) => (
              <div
                key={item.name}
                className="space-y-1 border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <p className="text-caption text-gray-400">
                  {item.name}
                </p>

                <p className={`${item.className} text-ink`}>
                  {"sample" in item
                    ? item.sample
                    : "Ask questions. Query data. Get intelligent answers."}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-h3 font-semibold text-ink">
            03 · Semantic usage
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-border bg-white p-5">
              <p className="text-overline font-semibold uppercase tracking-wider text-gray-600">
                Buttons
              </p>

              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">
                  Destructive
                </Button>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-white p-5">
              <p className="text-overline font-semibold uppercase tracking-wider text-gray-600">
                Status surfaces
              </p>

              <div className="space-y-2">
                <div className="rounded-lg bg-primary-tint px-3 py-2 text-body-emphasis font-medium text-ink">
                  Primary tint surface
                </div>

                <div className="rounded-lg bg-success-tint px-3 py-2 text-body-emphasis font-medium text-success">
                  Success surface
                </div>

                <div className="rounded-lg bg-error-tint px-3 py-2 text-body-emphasis font-medium text-error">
                  Error surface
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-body-emphasis font-medium text-ink">
                  <span className="size-2 rounded-full bg-rating" />
                  Neutral accent
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
