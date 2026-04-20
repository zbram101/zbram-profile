import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "./chat";

function createMockRes() {
  return {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
  };
}

function okJsonResponse(payload) {
  return {
    ok: true,
    json: async () => payload,
    text: async () => JSON.stringify(payload),
  };
}

describe("chat api handler", () => {
  const originalApiKey = process.env.OPENAI_API_KEY;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = "test-key";
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    process.env.OPENAI_API_KEY = originalApiKey;
  });

  it("returns method not allowed for non-POST requests", async () => {
    const req = { method: "GET", body: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
    expect(res.payload.error).toContain("Method not allowed");
  });

  it("returns an error when API key is missing", async () => {
    process.env.OPENAI_API_KEY = "";
    const req = { method: "POST", body: { messages: [{ role: "user", content: "hi" }] } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.payload.error).toContain("OPENAI_API_KEY");
  });

  it("returns validation error for missing conversation messages", async () => {
    const req = { method: "POST", body: { messages: [] } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.payload.error).toContain("conversation payload");
  });

  it("processes tool calls and returns final assistant text", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        okJsonResponse({
          output: [
            {
              type: "function_call",
              name: "get_role_fit",
              call_id: "call_1",
              arguments: JSON.stringify({ target_role: "Director of Engineering" }),
            },
          ],
        })
      )
      .mockResolvedValueOnce(
        okJsonResponse({
          output: [
            {
              type: "message",
              role: "assistant",
              content: [{ type: "output_text", text: "Director-fit summary from profile data." }],
            },
          ],
        })
      );

    vi.stubGlobal("fetch", fetchMock);

    const req = {
      method: "POST",
      body: {
        messages: [{ role: "user", content: "How does he fit a director role?" }],
      },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(res.statusCode).toBe(200);
    expect(res.payload.text).toContain("Director-fit summary");
    expect(res.payload.toolsUsed).toContain("Get Role Fit");
  });

  it("surfaces upstream response errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
      ok: false,
      text: async () => "upstream request failed",
    })
    );

    const req = {
      method: "POST",
      body: {
        messages: [{ role: "user", content: "Summarize role fit" }],
      },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.payload.error).toContain("upstream request failed");
  });
});
