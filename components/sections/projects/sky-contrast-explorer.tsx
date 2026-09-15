"use client";

import { useId, useState } from "react";
import { getSkyContrast } from "@/lib/animations/sky-contrast";

export function SkyContrastExplorer() {
  const id = useId();
  const [position, setPosition] = useState(54);
  const { palette, normal, muted } = getSkyContrast(position / 100);

  return (
    <fieldset className="mt-8 min-w-0 border-t border-current/20 pt-6">
      <legend className="pr-3 text-base font-semibold">
        Try the sky’s contrast
      </legend>
      <div
        className="relative isolate my-4 overflow-hidden rounded-sm px-6 py-8"
        style={{
          background: `linear-gradient(${palette.top}, ${palette.bottom})`,
          color: palette.foreground,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background: palette.readingSurface,
            opacity: palette.scrimOpacity,
          }}
        />
        <span className="block text-[28px] leading-tight font-semibold">
          A sky that stays readable.
        </span>
        <span className="mt-3 block text-sm" style={{ color: palette.muted }}>
          Supporting text follows the light, too.
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2"
          style={{ background: palette.horizon }}
        />
      </div>
      <label htmlFor={id} className="flex justify-between gap-4 text-sm">
        <span>Dawn to deep night</span>
        <span className="tabular-nums">{position}%</span>
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-describedby={`${id}-help ${id}-result`}
        className="my-2 h-11 w-full cursor-pointer accent-(--accent) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--accent)"
      />
      <div
        id={`${id}-result`}
        className="flex flex-wrap gap-x-6 gap-y-2 text-sm tabular-nums"
      >
        <span>Text: {normal.toFixed(2)}:1</span>
        <span>Supporting text: {muted.toFixed(2)}:1</span>
        <span>Target: 4.5:1</span>
      </div>
      <p id={`${id}-help`} className="text-xs leading-relaxed text-(--muted)">
        Uses this page’s palette functions. Minimum calculated contrast across
        21 gradient samples and the horizon, including the reading layer. This
        checks palette colors, not every overlapping element or overall
        accessibility. Adjusting it only changes this preview.
      </p>
    </fieldset>
  );
}
