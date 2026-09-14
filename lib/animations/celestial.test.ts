import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CELESTIAL_ARCS,
  getCelestialArc,
} from "@/lib/animations/celestial-arc";
import { contrastRatio, interpolateColor } from "@/lib/animations/interpolate";
import {
  getReducedProgress,
  getSkyPalette,
  getStarOpacity,
  getAmbientStarOpacity,
  SKY_STOPS,
} from "@/lib/animations/sky-palette";
import { getTimelineProgress } from "@/lib/animations/scroll-timeline";
import { getSkills } from "@/lib/data/get-skills";

describe("a continuous celestial scene", () => {
  it("uses one arc with a shared apex and below-horizon endpoints for either body", () => {
    for (const range of Object.values(CELESTIAL_ARCS)) {
      assert.equal(getCelestialArc(range.start, range).y, 106);
      assert.ok(
        Math.abs(getCelestialArc((range.start + range.end) / 2, range).y - 12) <
          0.0001,
      );
      assert.ok(Math.abs(getCelestialArc(range.end, range).y - 106) < 0.0001);
      assert.equal(getCelestialArc(range.end + 0.1, range).visible, false);
      assert.equal(getCelestialArc(range.start - 0.1, range).visible, false);
    }
    assert.ok(getCelestialArc(0, CELESTIAL_ARCS.sun).y < 90);
    assert.ok(getCelestialArc(1, CELESTIAL_ARCS.moon).y < 90);
  });

  it("fades stars gradually, staggers their arrival, and reverses without state", () => {
    assert.equal(getStarOpacity(0.34), 0);
    assert.equal(getStarOpacity(0.82), 1);
    assert.ok(Math.abs(getStarOpacity(0.58) - 0.5) < 0.00001);
    assert.ok(getStarOpacity(0.7, 0.8) < getStarOpacity(0.7, 0.1));
    assert.equal(getStarOpacity(0), 0);
    assert.equal(getStarOpacity(1, 1), 1);
    assert.equal(getAmbientStarOpacity(0), 0.1);
    assert.equal(getAmbientStarOpacity(0.18), 0.1);
    assert.ok(getAmbientStarOpacity(0.5) > getAmbientStarOpacity(0.3));
    assert.equal(getAmbientStarOpacity(1), 1);
  });

  it("keeps every named stop readable without flattening the gradient", () => {
    for (const stop of SKY_STOPS) {
      const palette = getSkyPalette(stop.progress);
      assert.equal(palette.scrimOpacity, 0, stop.name);
      for (const background of [palette.top, palette.bottom, palette.horizon]) {
        assert.ok(
          contrastRatio(palette.foreground, background) >= 4.5,
          stop.name,
        );
        assert.ok(contrastRatio(palette.muted, background) >= 4.5, stop.name);
      }
    }
    const dusk = getSkyPalette(0.54);
    const night = getSkyPalette(1);
    assert.ok(
      contrastRatio(dusk.muted, dusk.bottom) >
        contrastRatio(night.muted, night.bottom),
    );
    assert.ok(contrastRatio("#FF6238", "#14233A") >= 4.5);
  });

  it("keeps normal and muted text above 4.5:1 across the full sky transition", () => {
    for (let step = 0; step <= 1000; step++) {
      const progress = step / 1000;
      const palette = getSkyPalette(progress);
      for (const foreground of [palette.foreground, palette.muted]) {
        assert.ok(contrastRatio(foreground, palette.horizon) >= 4.5);
      }
      for (let height = 0; height <= 10; height++) {
        const sky = interpolateColor(palette.top, palette.bottom, height / 10);
        const background = interpolateColor(
          sky,
          palette.readingSurface,
          palette.scrimOpacity,
        );
        for (const foreground of [palette.foreground, palette.muted]) {
          assert.ok(
            contrastRatio(foreground, background) >= 4.5,
            `Contrast at progress ${progress}, height ${height}`,
          );
        }
      }
    }
  });

  it("reduces the scene to exactly three coarse stationary states", () => {
    assert.equal(getReducedProgress(0), 0.18);
    assert.equal(getReducedProgress(0.379), 0.18);
    assert.equal(getReducedProgress(0.38), 0.54);
    assert.equal(getReducedProgress(0.619), 0.54);
    assert.equal(getReducedProgress(0.62), 1);
    assert.equal(getReducedProgress(1), 1);
  });

  it("calibrates progress to section landmarks even when their heights differ", () => {
    const landmarks = [
      { offset: 0, progress: 0 },
      { offset: 100, progress: 0.2 },
      { offset: 900, progress: 0.58 },
      { offset: 1200, progress: 1 },
    ];
    assert.equal(getTimelineProgress(100, landmarks), 0.2);
    assert.ok(Math.abs(getTimelineProgress(500, landmarks) - 0.39) < 0.00001);
    assert.equal(getTimelineProgress(1200, landmarks), 1);
    assert.equal(getTimelineProgress(-10, landmarks), 0);
    assert.equal(getTimelineProgress(0, []), 0);
  });

  it("has unique, connected skills with non-overlapping mobile touch targets", async () => {
    const skills = await getSkills();
    const ids = new Set(skills.map((skill) => skill.id));
    assert.equal(ids.size, skills.length);
    for (const skill of skills) {
      for (const id of skill.connectsTo) assert.ok(ids.has(id));
      for (const point of [skill.position, skill.mobilePosition]) {
        assert.ok(
          point.x >= 8 && point.x <= 92 && point.y >= 5 && point.y <= 95,
        );
      }
      for (const other of skills) {
        if (skill === other) continue;
        const x =
          (Math.abs(skill.mobilePosition.x - other.mobilePosition.x) * 276) /
          100;
        const y =
          (Math.abs(skill.mobilePosition.y - other.mobilePosition.y) * 590) /
          100;
        assert.ok(x >= 44 || y >= 44, `${skill.id} overlaps ${other.id}`);
      }
    }
  });
});
