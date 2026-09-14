import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getLocalTime } from "@/lib/utils/local-time";

describe("the visitor’s local wall-clock time", () => {
  it("uses the supplied IANA zone rather than the server clock", () => {
    const date = new Date("2026-09-13T12:00:00Z");
    assert.equal(getLocalTime(date, "Asia/Kolkata").time, "17:30");
    assert.equal(getLocalTime(date, "Asia/Kolkata").period, "evening");
    assert.equal(getLocalTime(date, "America/New_York").period, "morning");
    assert.equal(getLocalTime(date, "Asia/Tokyo").period, "night");
    assert.equal(getLocalTime(date, "Europe/London").period, "afternoon");
  });

  it("respects daylight saving transitions and period boundaries", () => {
    assert.equal(
      getLocalTime(new Date("2026-03-08T06:59:00Z"), "America/New_York").time,
      "01:59",
    );
    assert.equal(
      getLocalTime(new Date("2026-03-08T07:00:00Z"), "America/New_York").time,
      "03:00",
    );
    for (const [hour, period] of [
      [0, "night"],
      [5, "morning"],
      [12, "afternoon"],
      [17, "evening"],
      [21, "night"],
    ] as const) {
      assert.equal(
        getLocalTime(new Date(Date.UTC(2026, 8, 13, hour)), "UTC").period,
        period,
      );
    }
  });
});
