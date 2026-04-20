import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendMailMock, createTransportMock } = vi.hoisted(() => {
  const sendMail = vi.fn();
  const createTransport = vi.fn(() => ({
    sendMail,
  }));

  return {
    sendMailMock: sendMail,
    createTransportMock: createTransport,
  };
});

vi.mock("nodemailer", () => ({
  default: {
    createTransport: createTransportMock,
  },
}));

import handler from "./lead";

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

describe("lead api handler", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    sendMailMock.mockReset();
    createTransportMock.mockClear();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("rejects non-POST methods", async () => {
    const req = { method: "GET", body: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
    expect(res.payload.error).toContain("Method not allowed");
  });

  it("requires name, email, and phone", async () => {
    const req = {
      method: "POST",
      body: { name: "Hiring Manager", email: "", phone: "" },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.payload.error).toContain("required");
  });

  it("fails when SMTP is not configured", async () => {
    const req = {
      method: "POST",
      body: { name: "Hiring Manager", email: "hm@company.com", phone: "555-1212" },
    };
    const res = createMockRes();

    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.payload.error).toContain("not configured");
  });

  it("sends the lead email and returns success", async () => {
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_USER = "smtp-user";
    process.env.SMTP_PASS = "smtp-pass";
    process.env.LEAD_INBOX_EMAIL = "owner@example.com";
    process.env.LEAD_FROM_EMAIL = "portfolio@example.com";

    const req = {
      method: "POST",
      body: {
        name: "Alex Recruiter",
        email: "alex@company.com",
        phone: "555-2323",
        company: "Acme Corp",
        message: "Director role discussion",
      },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(createTransportMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock.mock.calls[0][0]).toMatchObject({
      to: "owner@example.com",
      from: "portfolio@example.com",
      replyTo: "alex@company.com",
    });
    expect(res.statusCode).toBe(200);
    expect(res.payload.success).toBe(true);
  });
});
