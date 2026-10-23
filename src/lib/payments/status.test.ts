import { describe, expect, it } from "vitest";
import { normalizePaymentStatus } from "./status";

describe("normalizePaymentStatus", () => {
  it("maps known success statuses", () => {
    expect(normalizePaymentStatus("mockpay", "success")).toBe("successful");
    expect(normalizePaymentStatus("paystack", "success")).toBe("successful");
    expect(normalizePaymentStatus("flutterwave", "successful")).toBe(
      "successful",
    );
    expect(normalizePaymentStatus("mtn_momo", "SUCCESSFUL")).toBe("successful");
  });

  it("maps in-progress statuses to pending, never success", () => {
    expect(normalizePaymentStatus("mockpay", "processing")).toBe("pending");
    expect(normalizePaymentStatus("paystack", "ongoing")).toBe("pending");
    expect(normalizePaymentStatus("mockpay", "authorized")).toBe("pending");
  });

  it("maps failure and reversal statuses", () => {
    expect(normalizePaymentStatus("mockpay", "declined")).toBe("failed");
    expect(normalizePaymentStatus("mtn_momo", "rejected")).toBe("failed");
    expect(normalizePaymentStatus("mockpay", "chargeback")).toBe("reversed");
    expect(normalizePaymentStatus("mtn_momo", "refunded")).toBe("reversed");
  });

  it("treats timeouts and unrecognized states as unknown", () => {
    expect(normalizePaymentStatus("mtn_momo", "timeout")).toBe("unknown");
    expect(normalizePaymentStatus("mockpay", "definitely-not-a-status")).toBe(
      "unknown",
    );
  });

  it("treats unknown providers and missing input as unknown", () => {
    expect(normalizePaymentStatus("some-new-provider", "success")).toBe(
      "unknown",
    );
    expect(normalizePaymentStatus("mockpay", null)).toBe("unknown");
    expect(normalizePaymentStatus("mockpay", undefined)).toBe("unknown");
    expect(normalizePaymentStatus("mockpay", "")).toBe("unknown");
  });

  it("is case- and whitespace-insensitive", () => {
    expect(normalizePaymentStatus(" MockPay ", "  Success ")).toBe(
      "successful",
    );
  });
});
