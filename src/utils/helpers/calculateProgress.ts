export function calculateProgress(
  completedItems: number,
  totalItems: number
): number {
  if (!totalItems || totalItems <= 0) return 0;

  return Math.round((completedItems / totalItems) * 100);
}
