"use client"

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"]
const toKey = (date: Date) => format(date, "yyyy-MM-dd")

interface DatePickerProps {
  /** ISO date (yyyy-MM-dd), or "" while empty. */
  value: string
  onChange: (value: string) => void
  id?: string
  placeholder?: string
}

/** A single day on the same calendar as the range picker: one click picks it and closes. */
function DatePicker({ value, onChange, id, placeholder = "Elegí una fecha" }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const selected = value ? parseISO(value) : null
  const [month, setMonth] = React.useState(() => startOfMonth(selected ?? new Date()))

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  })

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) setMonth(startOfMonth(selected ?? new Date()))
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            "flex h-11 w-full items-center gap-3 rounded-xl bg-card px-4 text-left text-sm tabular-nums transition-[background-color,box-shadow] duration-300 outline-none hover:bg-foreground/[0.04] focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)]"
          )}
        >
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
          {selected ? (
            <span className="flex-1">{format(selected, "d MMM yyyy", { locale: es })}</span>
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

          <div className="grid grid-cols-7">
            {days.map((day) => {
              const isSelected = selected != null && isSameDay(day, selected)
              const today = isSameDay(day, new Date())
              return (
                <div key={toKey(day)} className="flex h-9 items-center justify-center">
                  <button
                    type="button"
                    aria-label={format(day, "d 'de' MMMM yyyy", { locale: es })}
                    aria-pressed={isSelected}
                    onClick={() => {
                      onChange(toKey(day))
                      setOpen(false)
                    }}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full text-sm tabular-nums transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      !isSameMonth(day, month) && !isSelected && "text-muted-foreground/40",
                      !isSelected && "hover:bg-foreground/[0.08]",
                      today && !isSelected && "font-semibold text-primary",
                      isSelected && "bg-primary font-medium text-primary-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </button>
                </div>
              )
            })}
          </div>

          {value && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onChange("")
                  setOpen(false)
                }}
                className="rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Borrar
              </button>
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { DatePicker }
