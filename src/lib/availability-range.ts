import { addDays, format, parseISO } from "date-fns";

const next = (iso: string) => format(addDays(parseISO(iso), 1), "yyyy-MM-dd");

/**
 * Whether every night of a stay [start, end) is free, given the days a listing
 * has blocked (yyyy-MM-dd). A booking blocks its days from check-in to
 * check-out, so a night is taken when that day and the next are both blocked:
 * the check-out day itself is free to arrive on.
 */
export function isFreeFor(blockedDates: string[], start: string, end: string) {
  const blocked = new Set(blockedDates);
  for (let night = start; night < end; night = next(night)) {
    if (blocked.has(night) && blocked.has(next(night))) return false;
  }
  return true;
}
