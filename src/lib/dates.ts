/**
 * The API stores timestamps in UTC but sends most of them without a timezone
 * ("2026-10-13T02:30:00"), which browsers read as local time — off by the
 * user's UTC offset. This reads those as UTC and leaves complete ones as is.
 */
export function parseApiDate(value: string) {
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(value);
  return new Date(hasZone ? value : `${value}Z`);
}
