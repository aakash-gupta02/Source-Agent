# Frontend Theme Guide

Use this document for every UI screen. Prefer theme tokens and typography utilities over one-off hex values or ad-hoc font sizes.

Source of truth for CSS variables: `src/app/globals.css`

---

## Brand colors

| Token | Hex | Tailwind | Use for |
|-------|-----|----------|---------|
| Primary | `#1EC9A7` | `bg-primary` / `text-primary` | Primary buttons, active links, focus rings, key CTAs |
| Primary Tint | `#E6FAF6` | `bg-primary-tint` | Soft primary surfaces, selected rows, info chips |
| Ink / Text | `#111111` | `text-ink` / `text-foreground` | Headings, body copy, logos |
| Gray 600 | `#6E6E6E` | `text-gray-600` | Supporting copy, subtitles, muted labels |
| Gray 400 | `#9A9A9A` | `text-gray-400` | Placeholders, dividers text, meta |
| Border | `#EAEAEA` | `border-border` | Input borders, card borders, separators |
| Surface | `#F5F5F5` | `bg-surface` | Subtle fills, hover on outline buttons, secondary panels |
| Background | `#FAFAFA` | `bg-background` | App page canvas (non-auth) |
| White | `#FFFFFF` | `bg-white` | Cards, inputs, dialogs |
| Rating Amber | `#F5A524` | `text-rating` / `bg-rating` | Star ratings only |
| Success | `#16A34A` | `text-success` / `bg-success` | Success states, positive badges |
| Success Tint | `#E8F7EE` | `bg-success-tint` | Success banners / soft badges |
| Error | `#E5484D` | `text-error` / `text-destructive` | Errors, destructive text |
| Error Tint | `#FDECEC` | `bg-error-tint` | Error banners / soft badges |

### Do / don’t

- **Do** use `text-primary` for text links and `bg-primary` for primary buttons.
- **Do** use `border-border` on inputs and cards.
- **Don’t** invent new blues/greens for CTAs — primary is always `#1EC9A7` (mint).
- **Don’t** hardcode hex in components unless adding a documented token to `globals.css`.

---

## Typography (Inter)

Font is wired via `layout.tsx` (`--font-sans` = Inter). Use the scale utilities:

| Style | Utility | Weight | Use for |
|-------|---------|--------|---------|
| Display / 44 | `text-display font-semibold` | SemiBold | Rare marketing heroes |
| H1 / 32 | `text-h1 font-semibold` | SemiBold | Page titles |
| H2 / 24 | `text-h2 font-semibold` | SemiBold | Auth titles (“Welcome back”), section titles |
| H3 / 20 | `text-h3 font-semibold` | SemiBold | Card titles, dialog titles |
| H4 / 16 | `text-h4 font-semibold` | SemiBold | Sub-section titles |
| Body Emphasis / 14 | `text-body-emphasis font-medium` | Medium | Labels, button labels, emphasized body |
| Body / 13 | `text-body` | Regular | Default body, helper text |
| Caption / 12 | `text-caption` | Regular | Field errors, fine print |
| Overline / 11 | `text-overline font-semibold uppercase tracking-wider` | SemiBold | Section eyebrows |

Pair text color intentionally:

- Titles → `text-ink`
- Subtitles / helpers → `text-gray-600`
- Placeholders → `placeholder:text-gray-400`
- Links / CTA text → `text-primary`

---

## Components — what to use where

### Logo

```ts
import { Logo } from "@/components/shared/logo";
```

- Use on auth, nav, marketing — **everywhere** the brand mark appears.
- Do not recreate “Thread” wordmarks in feature folders.

### Buttons (`@/components/ui/button`)

| Need | Variant |
|------|---------|
| Main CTA (Sign in, Save, Continue) | `variant="default"` → primary blue |
| Secondary / neutral | `variant="secondary"` or outline on `bg-surface` |
| Google / bordered actions | `variant="outline"` + `border-border bg-white` |
| Text actions | `variant="link"` |
| Dangerous | `variant="destructive"` |

Prefer `size="lg"` + `h-11 w-full rounded-xl` on auth full-width actions.

### Inputs (`@/components/ui/input`)

- Always pair with `Label` from `@/components/ui/label`.
- Auth / forms: `className="h-11 rounded-xl border-border bg-white …"`.
- Errors: set `aria-invalid` and show `text-caption text-error` under the field.
- Do **not** hand-roll `<input>` with custom border stacks.

### Labels (`@/components/ui/label`)

- Use `text-body-emphasis text-ink` for field labels.
- Always associate with `htmlFor` matching the input `id`.

### Separators (`@/components/ui/separator`)

- Use for “or” dividers and section rules — not raw `<hr>` / border divs when a separator fits.

### Toasts (`@/lib/toast`)

- Success / failure feedback → `toast.success` / `toast.apiError(error)`.
- Do not invent parallel notification UIs.

### Forms

- Schemas live in the feature (`schema.ts`).
- Wire with `useZodForm` from `@/lib/form`.
- Mutations come from feature hooks (`useLogin`, etc.).

---

## Auth screens pattern

Reference: `src/app/(pages)/(auth)/login/page.tsx`

1. Full-viewport atmospheric background (grain / gradient) is fine for **auth only**.
2. Content sits in a **white** card (`bg-white rounded-3xl`) — not `bg-card/95` glass stacks.
3. Structure: `Logo` → title (`text-h2`) → subtitle (`text-body text-gray-600`) → fields → primary button → separator → outline social → footer link.
4. Primary actions and links use **brand primary** (`#1EC9A7` mint).
5. Auth login background: `/images/auth/login.jpg` via CSS `background-image` (full bleed behind the card).
5. Use shadcn `Button`, `Input`, `Label`, `Separator` — no custom icon-decorated inputs unless product asks for them.

---

## Surfaces & layout

| Surface | Token | Where |
|---------|-------|--------|
| App canvas | `bg-background` | Dashboards, lists, settings |
| Elevated card | `bg-white` + `border-border` | Forms, tables, auth card |
| Soft panel | `bg-surface` | Sidebars, muted sections |
| Selected / focus soft | `bg-primary-tint` | Active nav, selected chips |

Radius: prefer `rounded-xl` for controls, `rounded-3xl` for large auth/marketing cards.

---

## Status colors

| State | Text | Soft bg |
|-------|------|---------|
| Success | `text-success` | `bg-success-tint` |
| Error | `text-error` | `bg-error-tint` |
| Warning / rating | `text-rating` | — |
| Info / primary soft | `text-primary` | `bg-primary-tint` |

---

## Quick checklist before shipping UI

- [ ] No raw hex except inside `globals.css`
- [ ] Typography uses `text-h*` / `text-body*` / `text-caption` / `text-overline`
- [ ] Primary CTA is `Button` default (blue)
- [ ] Fields use shadcn `Input` + `Label`
- [ ] Brand mark is `<Logo />` from `@/components/shared/logo`
- [ ] Errors use `text-error` / `toast.apiError`
- [ ] Borders use `border-border`
- [ ] Supporting text uses `text-gray-600`, not a random gray
