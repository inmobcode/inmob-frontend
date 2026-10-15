"use client"

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
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { es } from "date-fns/locale"
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The app's only date pickers: one day (DatePicker) or a range (DateRangePicker).
 * Both share the same trigger, popover and month grid, so a date looks and
 * behaves the same everywhere. Don't use <input type="date">: the browser's own
 * picker changes with the browser and clashes with the rest of the interface.
 */

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"]
const toKey = (date: Date) => format(date, "yyyy-MM-dd")

interface SharedProps {
  id?: string
  placeholder?: string
  /** Earliest day that can be picked; earlier ones show disabled. */
  minDate?: Date
  /** Latest day that can be picked. */
  maxDate?: Date
  /** `card` is for a picker that sits on a white card, `muted` (default) on the page background. */
  surface?: "muted" | "card"
  size?: "default" | "sm"
  className?: string
  disabled?: boolean
}

const ARROW =
  "flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-30"

const LINK_BUTTON =
  "rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"

/** Rules for which days can be picked, from `minDate` and `maxDate`. */
function useLimits({ minDate, maxDate }: Pick<SharedProps, "minDate" | "maxDate">) {
  const min = minDate ? startOfDay(minDate) : null
  const max = maxDate ? startOfDay(maxDate) : null
  return {
    min,
    max,
    isOff: (day: Date) => (min != null && isBefore(day, min)) || (max != null && isAfter(day, max)),
  }
}

function Trigger({
  id,
  surface = "muted",
  size = "default",
  className,
  disabled,
  children,
}: Pick<SharedProps, "id" | "surface" | "size" | "className" | "disabled"> & { children: React.ReactNode }) {
  return (
    <PopoverPrimitive.Trigger asChild>
      <button
        id={id}
        type="button"
        disabled={disabled}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-transparent px-4 text-left text-sm tabular-nums transition-[background-color,box-shadow,border-color] duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)]",
          size === "sm" ? "h-10" : "h-11",
          surface === "card"
            ? "bg-card hover:bg-foreground/[0.04]"
            : "bg-foreground/[0.07] hover:bg-foreground/10 focus-visible:border-primary/20 focus-visible:bg-card data-[state=open]:bg-card dark:bg-foreground/10",
          className
        )}
      >
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
        {children}
      </button>
    </PopoverPrimitive.Trigger>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align="start"
        sideOffset={8}
        collisionPadding={16}
        className="z-[60] w-[19.5rem] rounded-3xl bg-popover p-4 text-popover-foreground shadow-[0_24px_60px_-12px_oklch(0.3_0.05_160/0.35)] ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

/** Month title with the arrows, the weekday letters and the grid of days. */
function MonthGrid({
  month,
  onMonthChange,
  min,
  max,
  renderDay,
  onLeave,
}: {
  month: Date
  onMonthChange: (month: Date) => void
  min: Date | null
  max: Date | null
  renderDay: (day: Date, outside: boolean) => React.ReactNode
  onLeave?: () => void
}) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  })

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Mes anterior"
          // Nothing to pick before the minimum's month.
          disabled={min != null && !isAfter(month, startOfMonth(min))}
          onClick={() => onMonthChange(addMonths(month, -1))}
          className={ARROW}
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="font-display text-lg capitalize" aria-live="polite">
          {format(month, "MMMM yyyy", { locale: es })}
        </p>
        <button
          type="button"
          aria-label="Mes siguiente"
          disabled={max != null && !isBefore(month, startOfMonth(max))}
          onClick={() => onMonthChange(addMonths(month, 1))}
          className={ARROW}
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

      <div className="grid grid-cols-7" onMouseLeave={onLeave}>
        {days.map((day) => (
          <React.Fragment key={toKey(day)}>{renderDay(day, !isSameMonth(day, month))}</React.Fragment>
        ))}
      </div>
    </>
  )
}

const DAY_BUTTON =
  "flex size-9 items-center justify-center rounded-full text-sm tabular-nums transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
const DAY_OFF = "pointer-events-none text-muted-foreground/30 line-through decoration-muted-foreground/30"

interface DatePickerProps extends SharedProps {
  /** ISO date (yyyy-MM-dd), or "" while empty. */
  value: string
  onChange: (value: string) => void
}

/** A single day: one click picks it and closes. */
function DatePicker({
  value,
  onChange,
  placeholder = "Elegí una fecha",
  minDate,
  maxDate,
  ...trigger
}: DatePickerProps) {
  const { min, max, isOff } = useLimits({ minDate, maxDate })
  const [open, setOpen] = React.useState(false)
  const selected = value ? parseISO(value) : null
  const [month, setMonth] = React.useState(() => startOfMonth(selected ?? new Date()))

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) setMonth(startOfMonth(selected ?? new Date()))
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <Trigger {...trigger}>
        {selected ? (
          <span className="flex-1">{format(selected, "d MMM yyyy", { locale: es })}</span>
        ) : (
          <span className="flex-1 text-muted-foreground">{placeholder}</span>
        )}
      </Trigger>

      <Panel>
        <MonthGrid
          month={month}
          onMonthChange={setMonth}
          min={min}
          max={max}
          renderDay={(day, outside) => {
            const isSelected = selected != null && isSameDay(day, selected)
            const today = isSameDay(day, new Date())
            const off = isOff(day)
            return (
              <div className="flex h-9 items-center justify-center">
                <button
                  type="button"
                  aria-label={format(day, "d 'de' MMMM yyyy", { locale: es })}
                  aria-pressed={isSelected}
                  disabled={off}
                  onClick={() => {
                    onChange(toKey(day))
                    setOpen(false)
                  }}
                  className={cn(
                    DAY_BUTTON,
                    outside && !isSelected && "text-muted-foreground/40",
                    !isSelected && "hover:bg-foreground/[0.08]",
                    today && !isSelected && "font-semibold text-primary",
                    isSelected && "bg-primary font-medium text-primary-foreground",
                    off && DAY_OFF
                  )}
                >
                  {format(day, "d")}
                </button>
              </div>
            )
          }}
        />

        {value && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onChange("")
                setOpen(false)
              }}
              className={LINK_BUTTON}
            >
              Borrar
            </button>
          </div>
        )}
      </Panel>
    </PopoverPrimitive.Root>
  )
}

interface DateRangePickerProps extends SharedProps {
  /** ISO dates (yyyy-MM-dd), or "" while empty. */
  start: string
  end: string
  onChange: (start: string, end: string) => void
  /**
   * What the range counts: `nights` for a stay (check-in to check-out, which
   * must be a later day) or `days` for a period whose last day is included
   * (and which can be a single day).
   */
  countAs?: "nights" | "days"
  /** Hints under the calendar: before the first click and after it. */
  hints?: { first: string; second: string }
}

const STAY_HINTS = { first: "Elegí el check-in", second: "Ahora elegí el check-out" }

/** A range on one calendar: the first click opens it, the second closes it. */
function DateRangePicker({
  start,
  end,
  onChange,
  placeholder = "Elegí las fechas",
  minDate,
  maxDate,
  countAs = "nights",
  hints = STAY_HINTS,
  ...trigger
}: DateRangePickerProps) {
  const { min, max, isOff } = useLimits({ minDate, maxDate })
  const [open, setOpen] = React.useState(false)
  const startDate = start ? parseISO(start) : null
  const endDate = end ? parseISO(end) : null

  const [month, setMonth] = React.useState(() => startOfMonth(startDate ?? new Date()))
  // While the range is half-picked, the start lives here until the end is chosen.
  const [anchor, setAnchor] = React.useState<Date | null>(null)
  const [hover, setHover] = React.useState<Date | null>(null)

  const closesRange = (day: Date, from: Date) => (countAs === "days" ? !isBefore(day, from) : isAfter(day, from))

  const rangeStart = anchor ?? startDate
  const rangeEnd = anchor ? (hover && closesRange(hover, anchor) ? hover : null) : endDate
  const span = rangeStart && rangeEnd ? differenceInCalendarDays(rangeEnd, rangeStart) + (countAs === "days" ? 1 : 0) : 0
  const unit = countAs === "days" ? ["día", "días"] : ["noche", "noches"]

  function pick(day: Date) {
    if (isOff(day)) return
    if (!anchor || !closesRange(day, anchor)) {
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
      <Trigger {...trigger}>
        {startDate && endDate ? (
          <span className="flex flex-1 items-center gap-2">
            {format(startDate, "d MMM yyyy", { locale: es })}
            <ArrowRight className="size-3.5 text-muted-foreground" />
            {format(endDate, "d MMM yyyy", { locale: es })}
          </span>
        ) : (
          <span className="flex-1 text-muted-foreground">{placeholder}</span>
        )}
      </Trigger>

      <Panel>
        <MonthGrid
          month={month}
          onMonthChange={setMonth}
          min={min}
          max={max}
          onLeave={() => setHover(null)}
          renderDay={(day, outside) => {
            const isStart = rangeStart != null && isSameDay(day, rangeStart)
            const isEnd = rangeEnd != null && isSameDay(day, rangeEnd)
            const inside = rangeStart != null && rangeEnd != null && isAfter(day, rangeStart) && isBefore(day, rangeEnd)
            const today = isSameDay(day, new Date())
            const off = isOff(day)
            return (
              <div
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
                  disabled={off}
                  onClick={() => pick(day)}
                  onMouseEnter={() => anchor && !off && setHover(day)}
                  className={cn(
                    DAY_BUTTON,
                    outside && !inside && !isStart && !isEnd && "text-muted-foreground/40",
                    !isStart && !isEnd && "hover:bg-foreground/[0.08]",
                    today && !isStart && !isEnd && "font-semibold text-primary",
                    (isStart || isEnd) && "bg-primary font-medium text-primary-foreground",
                    off && DAY_OFF
                  )}
                >
                  {format(day, "d")}
                </button>
              </div>
            )
          }}
        />

        <div className="mt-3 flex min-h-8 items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            {anchor && !rangeEnd ? hints.second : span > 0 ? `${span} ${span === 1 ? unit[0] : unit[1]}` : hints.first}
          </span>
          {(start || end || anchor) && (
            <button
              type="button"
              onClick={() => {
                onChange("", "")
                setAnchor(null)
                setHover(null)
              }}
              className={LINK_BUTTON}
            >
              Borrar
            </button>
          )}
        </div>
      </Panel>
    </PopoverPrimitive.Root>
  )
}

export { DatePicker, DateRangePicker }
