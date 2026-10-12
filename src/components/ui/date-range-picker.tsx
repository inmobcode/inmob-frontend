"use client"

import { cn } from "cn"
import {
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { es } from "date-fns/locale"
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"
import * as React from "react"

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"]
const toKey = (date: Date) => format(date, "yyyy-MM-dd")

interface DateRangePickerProps {
  /** ISO dates (yyyy-MM-dd), or "" while empty. */
  start: string
  end: string
  onChange: (start: string, end: string) => void
  id?: string
  placeholder?: string
}

/** Pick a check-in and a check-out on one calendar: first click opens the range, second closes it. */
function DateRangePicker({ start, end, onChange, id, placeholder = "Elegí las fechas" }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const startDate = start ? parseISO(start) : null
  const endDate = end ? parseISO(end) : null

  const [month, setMonth] = React.useState(() => startOfMonth(startDate ?? new Date()))
  // While the range is half-picked, the start lives here until the end is chosen.
  const [anchor, setAnchor] = React.useState<Date | null>(null)
  const [hover, setHover] = React.useState<Date | null>(null)

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  })

  const rangeStart = anchor ?? startDate
  const rangeEnd = anchor ? (hover && isAfter(hover, anchor) ? hover : null) : endDate
  const nights = rangeStart && rangeEnd ? differenceInCalendarDays(rangeEnd, rangeStart) : 0

  function pick(day: Date) {
    if (!anchor || !isAfter(day, anchor)) {
      setAnchor(day)
      setHover(null)
      return
    }
    onChange(toKey(anchor), toKey(day))
    setAnchor(null)
    setHover(null)
    setOpen(false)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) setMonth(startOfMonth(startDate ?? new Date()))
    else {
      setAnchor(null)
      setHover(null)
    }
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            "flex h-11 w-full items-center gap-3 rounded-xl border border-transparent bg-foreground/[0.07] px-4 text-left text-sm transition-[background-color,box-shadow,border-color] duration-300 outline-none hover:bg-foreground/10 focus-visible:border-primary/20 focus-visible:bg-card data-[state=open]:bg-card data-[state=open]:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] dark:bg-foreground/10"
          )}
        >
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
          {startDate && endDate ? (
            <span className="flex flex-1 items-center gap-2 tabular-nums">
              {format(startDate, "d MMM yyyy", { locale: es })}
              <ArrowRight className="size-3.5 text-muted-foreground" />
              {format(endDate, "d MMM yyyy", { locale: es })}
            </span>
          ) : (
            <span className="flex-1 text-muted-foreground">{placeholder}</span>
          )}
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="z-[60] w-[19.5rem] rounded-3xl bg-popover p-4 text-popover-foreground shadow-[0_24px_60px_-12px_oklch(0.3_0.05_160/0.35)] ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Mes anterior"
              onClick={() => setMonth((current) => addMonths(current, -1))}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ChevronLeft className="size-4" />
            </button>
            <p className="font-display text-lg capitalize" aria-live="polite">
              {format(month, "MMMM yyyy", { locale: es })}
            </p>
            <button
              type="button"
              aria-label="Mes siguiente"
              onClick={() => setMonth((current) => addMonths(current, 1))}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
            {WEEKDAYS.map((weekday, index) => (
              <span key={index} className="flex h-8 items-center justify-center">
                {weekday}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7" onMouseLeave={() => setHover(null)}>
            {days.map((day) => {
              const outside = !isSameMonth(day, month)
              const isStart = rangeStart != null && isSameDay(day, rangeStart)
              const isEnd = rangeEnd != null && isSameDay(day, rangeEnd)
              const inside = rangeStart != null && rangeEnd != null && isAfter(day, rangeStart) && isBefore(day, rangeEnd)
              const today = isSameDay(day, new Date())
              return (
                <div
                  key={toKey(day)}
                  className={cn(
                    "flex h-9 items-center justify-center",
                    (inside || (isStart && rangeEnd)) && "bg-primary/10",
                    isStart && rangeEnd && "rounded-l-full",
                    isEnd && "rounded-r-full bg-primary/10",
                    inside && day.getDay() === 1 && "rounded-l-full",
                    inside && day.getDay() === 0 && "rounded-r-full"
                  )}
                >
                  <button
                    type="button"
                    aria-label={format(day, "d 'de' MMMM yyyy", { locale: es })}
                    aria-pressed={isStart || isEnd}
                    onClick={() => pick(day)}
                    onMouseEnter={() => anchor && setHover(day)}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full text-sm tabular-nums transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      outside && !inside && !isStart && !isEnd && "text-muted-foreground/40",
                      !isStart && !isEnd && "hover:bg-foreground/[0.08]",
                      today && !isStart && !isEnd && "font-semibold text-primary",
                      (isStart || isEnd) && "bg-primary font-medium text-primary-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="mt-3 flex min-h-8 items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">
              {anchor && !rangeEnd
                ? "Ahora elegí el check-out"
                : nights > 0
                  ? `${nights} ${nights === 1 ? "noche" : "noches"}`
                  : "Elegí el check-in"}
            </span>
            {(start || end || anchor) && (
              <button
                type="button"
                onClick={() => {
                  onChange("", "")
                  setAnchor(null)
                  setHover(null)
                }}
                className="rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Borrar
              </button>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { DateRangePicker }
