---
name: nextjs
description: App Router conventions, routing, metadata, and data-fetching patterns for this portfolio project. Use whenever creating or editing anything under app/, wiring up routes, layouts, metadata, or Server/Client component boundaries. This project is App Router only - there is no pages/ directory and there never will be, so no migration guidance is needed.
---

# Next.js (App Router) - this project

This project was scaffolded directly with the App Router. There is no `pages/` directory, no `_app.tsx`, no `_document.tsx`, and no migration to do - if you ever see a suggestion to create one of those, it's wrong for this codebase. See `AGENTS.md` at the repo root for folder structure, component conventions, and the data-layer pattern; this skill covers App Router mechanics specifically.

## Check the installed version before writing routing code

`params` and `searchParams` became **async (Promises)** in Next.js 15, which is a breaking change from the examples you may have seen elsewhere. Before writing any `page.tsx`, `layout.tsx`, or `generateMetadata`, confirm the installed version:

```bash
cat node_modules/next/package.json | grep '"version"'
```

If Next.js 15+: `params` and `searchParams` must be typed as `Promise<...>` and awaited (see below). If you're ever unsure of current API shape, read `node_modules/next/dist/docs/` directly rather than relying on memory - per the root `AGENTS.md` instruction.

## File conventions

- `layout.tsx` - shared UI for a segment and its children; preserves state across navigation; does not re-render on route change.
- `page.tsx` - unique UI for a route; the only file (besides `route.ts`) that makes a segment publicly accessible.
- `loading.tsx` - Suspense-based loading UI for the segment.
- `error.tsx` - Error boundary for the segment (must be a Client Component).
- `not-found.tsx` - 404 UI.
- `route.ts` - Route Handler (API endpoint) - only needed if/when a real backend replaces the JSON data layer.

Anything else colocated in `app/` (components, utils) is **not** routable - only `page.tsx` and `route.ts` create public routes. Prefer colocating a route's one-off subcomponents in `components/sections/<name>/` per `AGENTS.md` rather than inside `app/`, unless a piece is genuinely route-specific and used nowhere else.

## Server Components by default

Every component under `app/` is a Server Component unless marked otherwise. Add `'use client'` only where you actually need:

- Interactivity (`onClick`, `onChange`, form state)
- React hooks (`useState`, `useEffect`, `useContext`)
- Browser-only APIs (`window`, `localStorage`, `IntersectionObserver` for scroll-triggered animation)

Keep the `'use client'` boundary as small and as low in the tree as possible - a section with one interactive button should not force the whole section client-side; extract just the interactive piece.

```tsx
// components/sections/contact/contact-form.tsx
"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  // ...
}
```

## Params and searchParams (Next.js 15+ shape)

```tsx
// app/(site)/projects/[slug]/page.tsx
type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return <ProjectCaseStudy project={project} />;
}
```

Same rule for `searchParams: Promise<{ [key: string]: string | string[] | undefined }>` - await it before reading a key.

## Data fetching - use the accessor layer, not raw fetch

This project has no backend yet; data lives in `data/*.json`, read through `lib/data/*.ts` accessor functions (see `AGENTS.md` §2). Don't `fetch()` external URLs or import JSON directly inside a page or component.

```tsx
// app/(site)/projects/page.tsx
import { getProjects } from "@/lib/data/get-projects";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsList projects={projects} />;
}
```

If a page needs more than one independent data source, fetch them in parallel rather than sequentially:

```tsx
const [projects, experience] = await Promise.all([
  getProjects(),
  getExperience(),
]);
```

## generateStaticParams - for project case-study routes

If/when individual project pages exist at `app/(site)/projects/[slug]/page.tsx`, pre-render them from the same accessor layer:

```tsx
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false; // unknown slugs 404 - all cases are known at build time
```

`generateStaticParams` only runs in Server Components - never combine it with `'use client'` in the same file, and it must be exported, not just defined.

## Metadata

Static metadata goes on the layout or page that owns it; dynamic metadata (e.g. a project case-study title) uses `generateMetadata`. Never use `next/head` - it doesn't exist in the App Router.

```tsx
// app/(site)/projects/[slug]/page.tsx
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  return {
    title: project ? `${project.title} - Your Name` : "Project not found",
    description: project?.summary,
  };
}
```

The root `app/layout.tsx` sets the site-wide defaults (title template, description, OG image) once - individual pages only override what's different.

## Navigation

Always `next/link` for internal links, never a plain `<a>` - plain anchors trigger a full page reload and lose client-side transitions.

```tsx
import Link from "next/link";
<Link href="/projects">Projects</Link>;
```

## TypeScript - no `any`, ever

This project has `@typescript-eslint/no-explicit-any` enabled; `any` fails the build.

```tsx
// ❌
function handleSubmit(e: any) { ... }

// ✅
function handleSubmit(e: React.FormEvent<HTMLFormElement>) { ... }
```

If a shape is genuinely unknown at the boundary (e.g. parsing untrusted JSON), type it `unknown` and narrow with a type guard or a `zod` schema from `lib/validations/` - never fall back to `any`.

## Common mistakes to avoid here specifically

- **Forgetting `params`/`searchParams` are Promises** (Next 15+) - the single most common breakage when copying examples from older tutorials or older skill files.
- **Treating `app/` files as a dumping ground** - a one-off component belongs in `components/sections/<name>/`, not loose inside the route folder, per `AGENTS.md`.
- **Reaching for `fetch()` or importing `data/*.json` directly** instead of going through `lib/data/` - breaks the swap-to-real-API path documented in `AGENTS.md` §2.
- **Marking a whole page `'use client'`** to handle one interactive element - extract the interactive piece instead.
- **Missing `<html>`/`<body>` in `app/layout.tsx`** - the root layout must include both; nested layouts must not repeat them.

## When implementing, actually write the files

If asked to add a route, layout, or metadata: edit the real files under `app/` (and `lib/data/`, `types/` as needed) directly - don't just print code in a chat response and stop there.
