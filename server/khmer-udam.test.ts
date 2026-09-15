import { describe, expect, it } from "vitest";
import { formatStorefrontPrice, storefrontCategories } from "../shared/storefront";

describe("Khmer Udam ET storefront utilities", () => {
  it("formats product prices with two decimal places", () => {
    expect(formatStorefrontPrice(29.9)).toBe("$29.90");
    expect(formatStorefrontPrice(14)).toBe("$14.00");
  });

  it("keeps the customer-facing category order stable", () => {
    expect(storefrontCategories).toEqual(["ទាំងអស់", "កាបូប", "សម្រស់", "ស្បែកជើង", "គ្រឿងបន្លាស់"]);
  });
});
