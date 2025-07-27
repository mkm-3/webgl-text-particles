export function assertNonNullable<T extends object>(
  value: unknown
): NonNullable<T> {
  if (value == null) throw new Error("value is null.");

  return value as T;
}
