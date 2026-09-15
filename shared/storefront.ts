export const storefrontCategories = ["ទាំងអស់", "កាបូប", "ស្បែកជើង", "ខ្សែក្រវ៉ាត់", "ម៉េកអាប់"] as const;

export function formatStorefrontPrice(value: number) {
  return `$${value.toFixed(2)}`;
}
