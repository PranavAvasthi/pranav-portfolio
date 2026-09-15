import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getSkyContrast } from "@/lib/animations/sky-contrast";
import { SKY_STOPS } from "@/lib/animations/sky-palette";

describe("the public sky contrast experiment", () => {
  it("meets its stated target at every slider position, including intermediate colors", () => {
    for (let step = 0; step <= 100; step++) {
      const result = getSkyContrast(step / 100);
      assert.ok(result.normal >= 4.5, `normal text at ${step}`);
      assert.ok(result.muted >= 4.5, `muted text at ${step}`);
    }
  });
  it("keeps the named stops free of a corrective reading layer", () => {
    for (const stop of SKY_STOPS) {
      assert.equal(getSkyContrast(stop.progress).palette.scrimOpacity, 0);
    }
  });
});
