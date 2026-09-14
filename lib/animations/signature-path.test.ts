import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { Font, Glyph, Path, parse } from "opentype.js";
import { getSignaturePaths } from "@/lib/animations/signature-path";

describe("font-outline signature geometry", () => {
  it("preserves closed contours and measures their complete length", () => {
    const path = new Path();
    path.moveTo(0, 0);
    path.lineTo(100, 0);
    path.lineTo(100, 100);
    path.lineTo(0, 100);
    path.close();
    const font = new Font({
      familyName: "Geometry",
      styleName: "Regular",
      unitsPerEm: 1000,
      ascender: 800,
      descender: -200,
      glyphs: [
        new Glyph({ name: ".notdef", advanceWidth: 200, path: new Path() }),
        new Glyph({ name: "A", unicode: 65, advanceWidth: 200, path }),
      ],
    });
    const signature = getSignaturePaths("A", font);
    assert.equal(signature.paths.length, 1);
    assert.equal(signature.paths[0].length, 40);
    assert.ok(signature.paths[0].d.includes("Z"));
    assert.ok(signature.paths[0].d.includes("-10"));
  });

  it("extracts the actual Great Vibes name, retaining spacing and source glyphs", () => {
    const buffer = readFileSync("public/fonts/GreatVibes-Regular.ttf");
    const font = parse(
      buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      ),
    );
    const original = JSON.stringify(font.charToGlyph("P").path.commands);
    const signature = getSignaturePaths("Pranav Avasthi", font);
    assert.equal(signature.paths.length, 13);
    assert.ok(
      signature.paths.every(
        (path) =>
          path.length > 0 && path.d.startsWith("M") && !path.d.includes("NaN"),
      ),
    );
    assert.ok(signature.width > signature.height * 5);
    assert.ok(signature.paths.every((letter) => letter.strokes.length > 0));
    assert.deepEqual(
      signature.paths
        .filter((letter) => letter.wordStart)
        .map((letter) => letter.character),
      ["P", "A"],
    );
    assert.equal(getSignaturePaths("X", font).paths[0].strokes.length, 0);
    assert.ok(
      getSignaturePaths("A A", font).width >
        getSignaturePaths("AA", font).width,
    );
    assert.equal(JSON.stringify(font.charToGlyph("P").path.commands), original);
    assert.deepEqual(getSignaturePaths("", font), {
      paths: [],
      viewBox: "0 0 1 1",
      width: 1,
      height: 1,
    });
  });
});
