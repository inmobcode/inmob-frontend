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

export type DayKind = "free" | "busy" | "in" | "out" | "turnover";

/**
 * How a listing's day looks in a calendar: free, taken for the whole day
 * (inside a booking), a check-in day (taken from the afternoon), a check-out
 * day (taken until the morning) or both at once (a one-day block).
 */
export function dayKind(blocked: Set<string>, day: string): DayKind {
  if (!blocked.has(day)) return "free";
  const prev = format(addDays(parseISO(day), -1), "yyyy-MM-dd");
  const checkIn = !blocked.has(prev);
  const checkOut = !blocked.has(next(day));
  if (checkIn && checkOut) return "turnover";
  if (checkIn) return "in";
  if (checkOut) return "out";
  return "busy";
}

/** Whether somebody sleeps there that night (the day and the next one are both blocked). */
export function nightTaken(blocked: Set<string>, day: string) {
  return blocked.has(day) && blocked.has(next(day));
}

/** The nights a drag from one day to another covers, either direction: [first, last] and the check-out day. */
export function stayFromDrag(a: string, b: string) {
  const [first, last] = a <= b ? [a, b] : [b, a];
  const nights = Math.round((parseISO(last).getTime() - parseISO(first).getTime()) / 86_400_000) + 1;
  return { first, last, checkOut: next(last), nights };
}
