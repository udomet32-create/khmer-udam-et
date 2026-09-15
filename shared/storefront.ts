export const storefrontCategories = ["ទាំងអស់", "កាបូប", "សម្រស់", "ស្បែកជើង", "គ្រឿងបន្លាស់"] as const;

export function formatStorefrontPrice(value: number) {
  return `$${value.toFixed(2)}`;
}
