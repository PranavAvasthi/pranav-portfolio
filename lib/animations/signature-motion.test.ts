import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getSignatureStrokes } from "@/lib/animations/signature-strokes";
import {
  getPenLift,
  getPenPose,
  getSignatureTimeline,
  getWrittenLength,
  SIGNATURE_SETTLE_MS,
} from "@/lib/animations/signature-motion";

describe("centerline handwriting", () => {
  it("uses separate, open pen routes for every letter and for the P bowl, t crossbar, and i dot", () => {
    for (const character of "PranavAvasthi") {
      const strokes = getSignatureStrokes(character);
      assert.ok(strokes.length > 0);
      for (const d of strokes) {
        assert.equal((d.match(/M/g) ?? []).length, 1);
        assert.ok(!/[zZ]/.test(d));
      }
    }
    assert.equal(getSignatureStrokes("P").length, 2);
    assert.equal(getSignatureStrokes("t").length, 2);
    assert.equal(getSignatureStrokes("i").length, 2);
  });

  it("leaves time for lifts and settles each letter before the next starts", () => {
    const [stem, bowl, r, capitalA] = getSignatureTimeline([
      { lengths: [90, 150], wordStart: true },
      { lengths: [100], wordStart: false },
      { lengths: [100], wordStart: true },
    ]);
    assert.ok(bowl.start > stem.end);
    assert.ok(r.start - bowl.end > bowl.start - stem.end);
    assert.ok(r.start - bowl.end >= SIGNATURE_SETTLE_MS);
    assert.ok(capitalA.start - r.end > r.start - bowl.end);
    let previous = 0;
    for (let step = 0; step <= 100; step++) {
      const length = getWrittenLength(150, step / 100);
      assert.ok(length >= previous && length <= 150);
      previous = length;
    }
    assert.equal(getWrittenLength(150, -1), 0);
    assert.equal(getWrittenLength(150, 2), 150);
  });

  it("keeps the nib at the ink endpoint and uses a valid tangent even at stroke ends", () => {
    const sample = (distance: number) => ({ x: distance, y: distance });
    assert.deepEqual(getPenPose(sample, 100, 30, 80), {
      x: 110,
      y: 30,
      angle: 45,
    });
    assert.equal(getPenPose(sample, 100, 100).angle, 45);
    const from = { x: 0, y: 0, angle: 170 };
    const to = { x: 30, y: 0, angle: -170 };
    assert.deepEqual(getPenLift(from, to, 0), from);
    const middle = getPenLift(from, to, 0.5);
    assert.ok(middle.y < 0);
    assert.equal(middle.angle, 180);
    const end = getPenLift(from, to, 1);
    assert.equal(end.x, to.x);
    assert.ok(Math.abs(end.y - to.y) < 0.00001);
    assert.equal(end.angle % 360, 190);
  });
});
