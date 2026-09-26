import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { submitContact } from "@/lib/api/submit-contact";

const message = {
  name: "Test Visitor",
  email: "visitor@example.com",
  message: "A mocked contact message.",
};
const accessKey = "00000000-0000-4000-8000-000000000000";

const originalFetch = globalThis.fetch;

function interceptFetch(response: () => Promise<Response>) {
  const calls: Parameters<typeof fetch>[] = [];
  globalThis.fetch = (...args) => {
    calls.push(args);
    return response();
  };
  return calls;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("Web3Forms submission (mocked network only)", () => {
  it("sends a customized notification with reply details and source context", async () => {
    const calls = interceptFetch(async () => Response.json({ success: true }));
    assert.deepEqual(await submitContact(message, accessKey), {
      success: true,
    });
    const [url, options] = calls[0];
    assert.equal(url, "https://api.web3forms.com/submit");
    assert.equal(options?.method, "POST");
    assert.equal(options?.credentials, "omit");
    assert.equal(typeof options?.body, "string");
    if (typeof options?.body === "string") {
      assert.deepEqual(JSON.parse(options.body), {
        ...message,
        access_key: accessKey,
        subject: "New portfolio enquiry from Test Visitor",
        from_name: "Test Visitor via Pranav's portfolio",
        replyto: "visitor@example.com",
        source: "pranavavasthi.vercel.app",
        botcheck: false,
      });
    }
  });

  it("normalizes whitespace before using a visitor name in email headers", async () => {
    const calls = interceptFetch(async () => Response.json({ success: true }));
    await submitContact({ ...message, name: "Test\n  Visitor" }, accessKey);
    const options = calls[0][1];
    assert.equal(typeof options?.body, "string");
    if (typeof options?.body === "string") {
      const body = JSON.parse(options.body) as Record<string, unknown>;
      assert.equal(body.subject, "New portfolio enquiry from Test Visitor");
      assert.equal(body.from_name, "Test Visitor via Pranav's portfolio");
      assert.equal(body.name, "Test\n  Visitor");
    }
  });

  it("requires both a successful HTTP status and an explicit boolean success response", async () => {
    for (const response of [
      Response.json({ success: false }),
      Response.json({ success: "true" }),
      Response.json({ message: "accepted" }),
      Response.json({ success: true }, { status: 500 }),
    ]) {
      interceptFetch(async () => response);
      assert.equal((await submitContact(message, accessKey)).success, false);
    }
  });

  it("handles provider rate limits without automatically resubmitting", async () => {
    const calls = interceptFetch(
      async () => new Response("Too many requests", { status: 429 }),
    );
    const result = await submitContact(message, accessKey);
    assert.equal(result.success, false);
    if (!result.success) assert.match(result.message, /wait a little/);
    assert.equal(calls.length, 1);
  });

  it("handles malformed responses without claiming the message was delivered", async () => {
    interceptFetch(async () => new Response("<html>Unavailable</html>"));
    assert.equal((await submitContact(message, accessKey)).success, false);
  });

  it("handles offline errors and leaves retry decisions to the visitor", async () => {
    const calls = interceptFetch(async () => {
      throw new TypeError("Failed to fetch");
    });
    const result = await submitContact(message, accessKey);
    assert.equal(result.success, false);
    if (!result.success) assert.match(result.message, /connection/);
    assert.equal(calls.length, 1);
  });

  it("passes cancellation to the request", async () => {
    const controller = new AbortController();
    controller.abort();
    const calls = interceptFetch(async () => {
      throw new DOMException("Aborted", "AbortError");
    });
    assert.equal(
      (await submitContact(message, accessKey, controller.signal)).success,
      false,
    );
    assert.equal(calls[0][1]?.signal?.aborted, true);
  });
});
