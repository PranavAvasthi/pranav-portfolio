# Pranav’s portfolio

A statically rendered Next.js 16.3 App Router portfolio that moves from dawn to night as the visitor scrolls. TypeScript is strict; Bun is the only package manager. Read `AGENTS.md` and `.claude/skills/nextjs/SKILL.md` before changing the project.

## Run

```sh
bun install
bun run dev
bun run lint
bun run test
bun run build
```

Open `http://localhost:3000`. Bricolage Grotesque and Great Vibes use `next/font/google`, so the first build needs access to Google Fonts. In environments that prohibit Turbopack’s internal process/port binding, use `bun run dev --webpack` and `bun run build --webpack`.

## Content

Edit the JSON fixtures; components read them through async accessors in `lib/data/`.

- `data/site-config.json`: name, role, introduction, email, and social links.
- `data/experience.json`: one employer record with ordered role tenures and employment context.
- `data/projects.json`: Talenzap, Nutralis, SolarSense, LuckyDraw, Industry Connect, VerifyFlow, and the portfolio case study. Projects can supply typed logos or screenshots, platform labels, and linked proof metrics.
- `data/skills.json`: initial skill content, constellation groups, desktop/mobile percentage coordinates, and connection IDs. Review the initial skill set before publishing.

The home page composes six Server Components in `app/(site)/page.tsx`. Project deep-dives use statically generated `app/(site)/projects/[slug]/page.tsx` routes. The layout mounts a client scene around server-rendered children, and no component imports JSON directly.

## One shared sky

The section-aware scroll store caches section positions on resize and publishes progress at most once per animation frame. CSS custom properties update the sky and text without React renders. Expanding project details or the skill list recalibrates the timeline through ResizeObserver.

| Progress | State            | Upper sky | Horizon sky |
| -------- | ---------------- | --------- | ----------- |
| 0        | Apricot dawn     | `#8CBAD9` | `#F6CFAD`   |
| 0.18     | Clear midday     | `#78BCE5` | `#D8EAF0`   |
| 0.37     | Bronze afternoon | `#8D796F` | `#B19577`   |
| 0.54     | Velvet dusk      | `#261637` | `#462A40`   |
| 0.72     | Blue hour        | `#1E2D50` | `#394562`   |
| 1        | Deep indigo      | `#111D3D` | `#263557`   |

`lib/animations/sky-palette.ts` linearly interpolates RGB channels between stops. Foreground and secondary text are selected against the full composite sky for at least 4.5:1 contrast; the dramatic dusk stops need no flattening layer.

Both bodies use `t = clamp((progress - start) / (end - start))`, `x = 56 + 38t`, `y = 106 - 94sin(πt)`. Coordinates use viewport width and small viewport height. The sun’s range is `-0.05–0.62`, beginning just above the horizon; the moon’s is `0.60–1.18`, remaining aloft at the close. The same fixed mountain silhouette occludes both below the horizon. The right-side arc leaves the main reading column open.

Star alpha uses `t²(3−2t)` with `t = clamp((progress − (0.34 + 0.12s)) / 0.48)` and a deterministic per-star stagger `s` in `[0,1]`. The first 18 desktop / 7 mobile points use a shared ambient floor of `0.1 + 0.9 * smoothstep(0.25, 0.82, progress)`, so the same sparse points are barely present in the Hero and grow into the full field. There are 130 stars on desktop and 48 on mobile. They are drawn on the existing canvas, with no ambient animation loop and no DOM star nodes.

The fixed identity accent is vermilion `#FF6238`, with `#14233A` ink where text sits inside the accent. It is used for CTA fills, link rules, chips, focus rings, and constellation glows. The accent keeps at least 4.5:1 contrast against its ink and reads as a warm constant thread against both the pale day stops and deep indigo night.

The page uses Bricolage Grotesque for body, UI, and display type. The hero name uses two distinct geometries: hand-authored open centerline routes in `lib/animations/signature-strokes.ts` for the writing, and actual Great Vibes glyph fills parsed on the server in `lib/animations/signature-path.ts` for the finished ink. Hershey Text JS was investigated, but its letterforms do not align with the required Great Vibes resting state. The custom routes reuse letters at the font’s advances; adding a new character requires authoring its routes (otherwise the whole name renders filled immediately). `signature-motion.ts` contains pure timing, tangent, and lift geometry. `components/sections/hero/signature.tsx` owns the finite frame loop: a minimal nib follows getPointAtLength on each open stroke, lifts between strokes, pauses longer between letters, and each completed letter crossfades into its actual fill before the next letter begins. Reduced motion renders the fill immediately, including before hydration. The loop pauses in hidden tabs and stops on completion or unmount.

The skill canvas draws on resize or selection only. Each skill has a 44px native button over its canvas point, supporting hover, tap, focus, and Escape. A native disclosure provides all names and descriptions as a regular list.

Reduced motion uses day/dusk/night states at thresholds `0.38` and `0.62`, with 160ms crossfades and stationary bodies. Preference changes work without reloading. Canvas redraws happen only when needed: an initial visible paint, a coarse state change, a resize, or explicit skill interaction. No ongoing loop runs in either motion mode. Off-screen canvases and hidden documents suspend scheduled drawing.

## Verification

Scene checks were performed on September 13, 2026. Signature checks, lint, tests, and build were rechecked on September 14, 2026:

- `bun run lint`: passed without warnings.
- `bun run test`: 14 tests passed, covering arcs, staggered stars, section interpolation, reduced-motion states, touch-target spacing, contrast at 1,001 progress values across 11 vertical positions and the mountain silhouette, signature fill geometry, open stroke order, pacing, nib tangents, and pen lifts.
- `bun run build --webpack`: passed, including strict type checking; `/` is statically prerendered. Turbopack’s default build hit this environment’s internal port-binding restriction.
- Headless Chrome at 1440×1000 and a 390×844 touch/mobile viewport: no runtime errors or horizontal overflow; navigation, project disclosure, pointer/touch skill selection, keyboard focus, and Escape passed.
- Instrumented canvas checks: no idle redraws, no off-screen redraws, and no redraws while scrolling within a reduced-motion state. Day/dusk/night state transitions and stationary body transforms passed.
- Final five-second scroll sweeps: 300–301 frames, 16.8ms desktop / 16.7ms mobile p95 frame interval, a 33.2ms maximum mobile interval, and no long tasks. These are local Chromium emulation measurements, not a physical-device or cross-browser guarantee.
- The signature component was hydrated in an isolated local-file Chrome harness with React Strict Mode at desktop and 390px touch/mobile sizes. Deterministic frame checks measured less than 0.001px between nib and stroke endpoint, persistent completed letters, visible lift phases, no frames scheduled after completion or with reduced motion, live reduced-motion cancellation, and a visible no-JavaScript fallback. No test server was started for these signature checks.
