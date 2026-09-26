import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateContactMessage } from "@/lib/validations/contact";

describe("contact validation", () => {
  it("trims inputs while preserving international names and message formatting", () => {
    const result = validateContactMessage({
      name: "  李  ",
      email: "  visitor@example.com  ",
      message: "  Hello Pranav,\nCould we discuss an app?  ",
    });
    assert.deepEqual(result, {
      success: true,
      data: {
        name: "李",
        email: "visitor@example.com",
        message: "Hello Pranav,\nCould we discuss an app?",
      },
    });
  });

  it("rejects blank names, invalid email addresses, and whitespace-only messages", () => {
    const result = validateContactMessage({
      name: "  ",
      email: "not-an-email",
      message: "          ",
    });
    assert.equal(result.success, false);
    if (!result.success)
      assert.deepEqual(Object.keys(result.errors), [
        "name",
        "email",
        "message",
      ]);
  });

  it("rejects oversized messages and non-string field values", () => {
    const result = validateContactMessage({
      name: null,
      email: ["visitor@example.com"],
      message: "x".repeat(5001),
    });
    assert.equal(result.success, false);
    if (!result.success)
      assert.deepEqual(Object.keys(result.errors), [
        "name",
        "email",
        "message",
      ]);
  });
});
