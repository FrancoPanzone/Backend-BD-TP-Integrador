// utils/parseId.ts
export function parseId(id: string | undefined): number {
  if (!id) throw new Error('ID is required');
  const parsed = parseInt(id);
  if (isNaN(parsed)) throw new Error('ID must be a number');
  return parsed;
}
