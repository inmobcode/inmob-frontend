import {
  Bell,
  CalendarCheck,
  Inbox,
  KanbanSquare,
  ListChecks,
  Sparkles,
} from "lucide-react";

import { useTranslations } from "next-intl";

import { SECTION, WRAP } from "@/components/landing/layout";
import { Heading } from "@/components/landing/sections";
import { cn } from "@/lib/utils";

const EXTRAS = [
  { icon: Inbox, key: "inbox" },
  { icon: KanbanSquare, key: "board" },
  { icon: ListChecks, key: "tasks" },
  { icon: Bell, key: "notifications" },
  { icon: Sparkles, key: "services" },
  { icon: CalendarCheck, key: "pending" },
] as const;

export function More() {
  const t = useTranslations("landing.more");
  return (
    <section
      id="y-ademas"
      aria-labelledby="y-ademas-titulo"
      className="scroll-mt-16 border-b border-line"
    >
      <div className={cn(WRAP, SECTION, "flex flex-col gap-14")}>
        <Heading
          id="y-ademas-titulo"
          claim={t("claim")}
          rest={t("rest")}
          className="max-w-3xl"
        />
        <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
          {EXTRAS.map((item) => (
            <li
              key={item.key}
              className="flex flex-col gap-3 border-t border-line py-8"
            >
              <item.icon className="size-5 text-forest" aria-hidden />
              <h3 className="font-logo text-lg font-semibold">{t(`items.${item.key}.title`)}</h3>
              <p className="text-base leading-snug text-pretty text-quiet">
                {t(`items.${item.key}.text`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
