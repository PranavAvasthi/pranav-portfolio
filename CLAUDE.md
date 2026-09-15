<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portfolio Project Rules

This file is the source of truth for how this codebase is organized and why. It is a living document — any agent (human or AI) that changes the structure, adds a pattern, or makes an architectural decision updates this file in the same commit. Stale docs are worse than no docs.

`CLAUDE.md` mirrors this file exactly. If your OS/deploy setup handles symlinks cleanly, make it one (`ln -s AGENTS.md CLAUDE.md`); otherwise keep it a plain copy, but never edit the two separately — treat `AGENTS.md` as the source and re-copy after every edit.

## 1. Project structure

```
app/                      # App Router: routes, layouts, metadata only
  (site)/                 # route group for the main site
    page.tsx
    layout.tsx
  api/                    # only if/when a real backend is introduced
  globals.css
  layout.tsx
  favicon.ico
components/
  ui/                     # primitives: Button, Input, Badge, Card shell...
  icons/                  # custom SVG icons not covered by lucide-react
  common/                 # cross-section shared composites (Header, Footer, SectionHeading...)
  sections/
    hero/
    about/
    projects/
    experience/
    skills/               # server-rendered section with a client canvas constellation
    contact/
data/
  projects.json
  experience.json
  skills.json
  site-config.json
lib/
  data/                   # accessor layer — see §2
  utils/                  # pure helper functions
  animations/             # shared motion variants/configs
  validations/            # zod schemas (contact form, etc.)
hooks/
  use-scroll-progress.ts
  use-media-query.ts
types/
  project.ts
  experience.ts
  skill.ts
  site-config.ts
  index.ts
public/
  images/
  fonts/                  # only if self-hosting non-next/font files
```

This project doesn't use a `src/` directory — everything sits at the repo root, sibling to `app/`. Keep it that way; don't introduce `src/` later without updating this file and the `@/*` path alias in `tsconfig.json`.

Rules:

- `app/` holds routing concerns only — pages compose sections, they don't contain markup logic themselves. `globals.css` stays in `app/` (Next's default) — don't create a separate `styles/` folder for it.
- Every folder that can grow gets an `index.ts` barrel **only** where it meaningfully reduces import noise (e.g. `components/ui/index.ts`). Don't barrel `sections/` — direct imports keep it obvious where a component lives.
- No file mixes unrelated concerns: a section file renders; a hook manages state/side-effects; a lib function is pure and testable in isolation.

## 2. Data layer (JSON now, API later without a rewrite)

Since there's no backend yet, `data/*.json` plays the role of a database seed / API response fixture. The rule that keeps this swappable later: **components never import JSON directly.** They call a function from `lib/data/`.

```
data/projects.json           <- raw "response shape" data
lib/data/get-projects.ts     <- the only file that reads projects.json
types/project.ts             <- Project type, shared by both
```

```ts
// lib/data/get-projects.ts
import projects from "@/data/projects.json";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  return projects as Project[];
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  const all = await getProjects();
  return all.find((project) => project.slug === slug);
}
```

- Functions are `async` from day one, even though JSON reads are sync. This means swapping the body for a `fetch()` call to a real API later touches **zero** call sites.
- Every JSON file has a matching type in `types/`, and the type is what components/sections import — not `typeof import(...)`.
- Server Components call these functions directly. No client-side fetching for static content — this is a portfolio, not a dashboard; render at build time.
- If a JSON file grows unwieldy or needs relations (e.g. project ↔ tech stack ↔ case study), split it rather than nesting deeply, and join in the accessor function.

## 3. Component conventions

- **One component, one export, one file.** No default-exporting a component and named-exporting three helpers from the same file. Helpers that aren't components go in `lib/utils/` or a colocated `*.utils.ts`.
- **`components/ui/`** — primitives only (Button, Input, Textarea, Badge, Card, Tooltip, Dialog...). These know nothing about the portfolio's content; they'd survive being copy-pasted into an unrelated project. Build variants with `class-variance-authority` (`cva`) rather than boolean prop soup.
- **`components/icons/`** — reach for `lucide-react` first, always. Only add a file here for a custom mark (logo, a brand icon lucide doesn't have) — one icon per file, sized via props, not hardcoded.
- **`components/common/`** — composite, content-aware pieces reused across sections (site header, footer, section heading pattern, animated cursor, theme toggle).
- **`components/sections/<name>/`** — one folder per homepage section. A section folder can contain its own small subcomponents (e.g. `sections/projects/project-card.tsx`) if they're not reused elsewhere; promote to `ui/` or `common/` the moment a second section wants it.
- Colocate a component's types in the same file if they're only used there; otherwise put them in `types/`.
- Props interfaces are named `<ComponentName>Props` and declared directly above the component, not in a separate file, unless shared.

## 4. Next.js / React conventions

- **Package manager: bun.** Use `bun install` / `bun add` / `bun run <script>` — don't mix in `npm`/`yarn`/`pnpm` lockfiles.
- **Server Components by default.** Add `"use client"` only where interactivity/state/browser APIs genuinely require it (form inputs, animation triggers driven by scroll/hover, theme toggle). Keep client boundaries as small and as low in the tree as possible — don't mark an entire section client just because one button inside it needs `onClick`.
- Use the **Metadata API** (`generateMetadata` / static `metadata` export) per route — no manual `<head>` tags.
- Images: always `next/image`, always with explicit `width`/`height` or `fill` + a sized parent, always meaningful `alt` text.
- Fonts: `next/font/google` or `next/font/local`, loaded once in the root layout, exposed as CSS variables — never a `<link>` to Google Fonts.
- Use route groups (`(site)`) to keep the root layout clean if auth/dashboard routes are ever added later.
- Add `loading.tsx` and `error.tsx` boundaries at the route level even for a single-page portfolio if any section does async work.
- Absolute imports via the `@/*` path alias — no `../../../` chains.
- TypeScript `strict: true`. No `any` — if a shape is genuinely unknown, type it as `unknown` and narrow.
- Environment variables (even unused today, for the future API) go through a validated `env.ts` (e.g. `zod`-parsed), never raw `process.env.X` scattered through the codebase.
- Respect `prefers-reduced-motion` for every non-essential animation.

### Celestial scene

- `components/common/celestial-scene/celestial-scene.tsx` is a small Client Component wrapper in `(site)/layout.tsx`. Its children remain Server Components; only the scene and skill interaction need client JavaScript.
- `hooks/use-scroll-progress.ts` subscribes to one shared, passive, requestAnimationFrame-throttled store in `hooks/scroll-progress-store.ts`. Measure section offsets on resize, then interpolate cached landmarks without layout reads on scroll. Section IDs and progress anchors live in `lib/animations/scroll-timeline.ts`; mark each section with `data-timeline-section`.
- Scroll updates scoped CSS custom properties directly, never React state. Sky colors, contrast selection, star opacity, and the parameterized sun/moon arc live in pure `lib/animations/` helpers. Colocated `*.test.ts` files run with `bun run test`.
- Both canvases use `hooks/use-visible-canvas.ts`: one dirty frame per change, no recurring animation loop, IntersectionObserver suspension off-screen, and cancellation while the document is hidden. Canvas drawing is in colocated `*.utils.ts` files; `lib/animations/` stays pure. Background stars stop redrawing before night and once fully visible. Mobile uses 48 stars and caps canvas pixel density at 1.5; desktop uses 130 and caps it at 2.
- Skills have stable IDs, groups, desktop/mobile percentage positions, and `connectsTo` edges in `data/skills.json`, typed by `types/skill.ts` and read via `getSkills()`. The canvas has 44px keyboard/touch controls and a native list alternative.
- Reduced motion quantizes progress into day (`0.18`), dusk (`0.54`), and night (`1`) at `0.38`/`0.62`. Fixed layers crossfade for 160ms; bodies stay stationary. Preference changes are handled live. No clouds, shooting stars, or additional celestial bodies are included.
- The installed Next.js 16.3 error boundary uses `retry()`; route files delegate error/loading markup to `components/common/`.
- Career entries are explicitly illustrative until replaced. Nullable email and social links in `data/site-config.json` control contact actions; never invent an address or publish a dead contact button.

## 5. Code style

- No comments that narrate what the code already says (`// loop through projects`). A comment earns its place only by explaining **why**, when the reasoning isn't obvious from the code itself (a workaround, a non-obvious business rule, a deliberate trade-off).
- Names carry the meaning: `getFeaturedProjects()`, not `getData()`. If a function needs a comment to explain what it does, rename it instead.
- No dead code, no commented-out blocks, no `console.log` left behind.
- Prefer composition over configuration: small components combined, not one component with ten boolean props branching internally.

## 6. Design direction

This portfolio's visual identity is a deliberate choice, not a template. Before adding any new UI:

- Avoid the common AI-generated defaults: warm-cream-and-terracotta or near-black-with-one-neon-accent palettes, all-caps tracked-out eyebrow labels, `01 / 02 / 03` numbering unless content is truly sequential, identical rounded cards with the same soft shadow everywhere, an arrow appended to every link.
- Pick one moment to be bold (the hero, a signature interaction, a distinctive type treatment) and keep everything else disciplined around it — restraint elsewhere makes the bold choice land.
- Motion is deliberate: one orchestrated entrance/reveal beats fade-up-on-every-section. Interaction-triggered motion (hover, expand, drag) is welcome; scattered ambient motion is not.
- Typography does real work — pick a type scale and stick to it; don't reach for a serif+terracotta combo by default.
- Every new visual pattern gets a short rationale added to this section so the design stays coherent as sections are added over time.

Use Tailwind utilities for static component layout, spacing, and small type treatments. Keep `app/globals.css` for the shared sky and contrast variables, scroll-driven or SVG/canvas states, and responsive geometry that must stay coordinated across the scene. This keeps ordinary structure next to its markup while preserving the single orchestrated visual system.

The continuous sky is the single expressive gesture. Six sky/horizon pairs anchor it: apricot dawn `#8CBAD9`/`#F6CFAD`, clear midday `#78BCE5`/`#D8EAF0`, bronze afternoon `#8D796F`/`#B19577`, velvet dusk `#261637`/`#462A40`, blue hour `#26375F`/`#66628A`, and deep indigo `#111D3D`/`#263557`. Text colors are selected against the full composite background for at least 4.5:1 contrast; no dusk flattening layer is needed at the named stops.

Sun and moon share `x = 56 + 38t`, `y = 106 - 94sin(πt)` with clamped local arc progress. The right-side arc keeps bodies clear of the primary reading column; the sun begins slightly before zero (`-0.05` to `0.62`) so it is already above the horizon on arrival, and the moon runs `0.60` to `1.18` to stay aloft at the close. One unchanging mountain silhouette grounds every section. Bricolage Grotesque supplies the body, UI, and display type; the one hero entrance flourish follows hand-authored, ordered centerline pen routes fitted to Great Vibes at a 100px baseline scale. `lib/animations/signature-strokes.ts` holds the reusable letter routes; `signature-motion.ts` holds pure pacing, tangent, and lift geometry. `signature.tsx` owns the finite requestAnimationFrame loop and minimal nib, samples the active stroke with getPointAtLength, and settles each completed letter into its server-generated Great Vibes fill. The loop pauses while the document is hidden, cancels on unmount, and skips directly to the complete fill for reduced motion. This intentionally replaces the old signature hook; the component owns this entrance loop per the signature specification. New unsupported letters render the whole signature filled without animation until matching routes are authored. Vermilion `#FF6238` is a fixed identity accent for all interactive elements, regardless of sky state. Stars use a low ambient floor in every section, then gain density/opacity and constellation lines toward night. The optional mouse-only night parallax is capped at 8px and disabled for touch or reduced motion. The local-time readout is the only added utility chrome. Open space, thin rules, and native project disclosures keep content quiet; no card tilt, recurring decorative loops, or per-element entrance effects.

## 7. Keeping this file current

Identity, role, introduction, email, and social destinations have one source in `data/site-config.json`; the hero, About section, contact, footer, and metadata receive them through `getSiteConfig()`. Sample projects and experience stay visibly labeled until replaced. Project case studies live in the typed project fixture and are rendered on the server; the optional `sky-contrast` experiment is a small client boundary using the same palette functions as the scene. Its results describe sampled palette contrast, not whole-page accessibility compliance. Optional skill evidence links connect to real project anchors. The shorter hero headline keeps role, introduction, and work actions prominent.

The hero-only phone is a live, non-interactive iframe of `/?embed=true`, mounted after hydration only at viewport widths of at least 900px. The page awaits the Next.js 16 `searchParams` promise and suppresses the phone when `embed=true`, which prevents recursive iframes. Its small idle movement stops under reduced motion. This deliberate product proof balances the hero without expanding the celestial scene.

The header exposes every story section. Its home link stays as a compact `PA` monogram on touch and narrow screens; precise mouse hover or keyboard focus on larger screens expands the name in two stable pieces—`ranav` after `P`, then `vasthi` after `A`—and draws one vermilion curve beneath it. Section links share a left-to-right vermilion underline on hover and focus. This avoids repeating the full signature while keeping the owner identity available in the navigation.

Primary actions keep the fixed vermilion identity color. Hover sweeps a lighter vermilion fill from left to right and lifts the control slightly with a soft foreground-derived shadow; reduced motion keeps the fill response and removes the movement.

Update this file whenever you:

- Add a new top-level folder or change what a folder is responsible for.
- Introduce a new shared pattern (a new primitive category, a new data-fetching convention, a new animation utility).
- Make and settle a non-obvious architectural decision (e.g. "why does `lib/data` return promises for sync JSON reads").

Keep entries terse and current — delete guidance that no longer reflects the codebase rather than letting it accumulate.
