import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function contextFor(role: "user" | "admin"): TrpcContext {
  const now = new Date();
  return {
    user: { id: 7, openId: `test-${role}`, email: "test@example.com", name: "Test", loginMethod: "test", role, createdAt: now, updatedAt: now, lastSignedIn: now },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("adminProducts permissions", () => {
  it("rejects catalog access for a regular user", async () => {
    const caller = appRouter.createCaller(contextFor("user"));
    await expect(caller.adminProducts.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows the admin boundary to be reached", async () => {
    const caller = appRouter.createCaller(contextFor("admin"));
    const products = await caller.adminProducts.list();
    expect(Array.isArray(products)).toBe(true);
  });
});
