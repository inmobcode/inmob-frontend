"use client";

import { Building2, CalendarCheck, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { LogoIcon } from "@/components/logo-icon";
import { cn } from "@/lib/utils";

/** A house in a lush garden (Unsplash, free license). */
const PHOTO =
  "https://images.unsplash.com/photo-1636301587190-88cbb412fea0?w=1800&q=80&fm=jpg&fit=crop";

const POINTS = [
  { icon: Building2, key: "all" },
  { icon: FileText, key: "offers" },
  { icon: CalendarCheck, key: "payments" },
] as const;

const NEXT_STEPS = ["agency", "properties", "team"] as const;

/**
 * The right-hand panel of the auth screens: the photo with what Tivvu does at
 * its foot. Someone signing up also sees what comes next, on the solid green
 * the photo fades into.
 */
export function AuthAside() {
  const t = useTranslations("auth.aside");
  const pathname = usePathname();
  const signingUp = pathname.startsWith("/register");

  return (
    <aside className="hidden p-3 lg:sticky lg:top-0 lg:flex lg:h-svh">
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-forest">
        <div className="relative flex min-h-0 flex-1 flex-col justify-between">
          <Image
            src={PHOTO}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 52vw, 0px"
            className="object-cover object-[40%_50%]"
          />
          {/* The garden fades into the brand green so the copy at the bottom always reads. */}
          <div
            aria-hidden
            className={cn(
              "absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent",
              // Sign-up fades fully into the steps block below; sign-in keeps some of the garden showing.
              signingUp ? "h-1/3 from-forest" : "h-3/4 from-forest/85 via-forest/60",
            )}
          />

          <span className="relative m-10 flex size-11 items-center justify-center rounded-lg bg-forest-deep/70 backdrop-blur xl:m-12">
            <LogoIcon className="h-5 text-lime" />
          </span>

          {!signingUp && (
            <div className="relative flex flex-col gap-7 p-10 text-paper xl:p-12">
              <p className="max-w-md font-logo text-[clamp(2.25rem,3.4vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
                {t("title")}
              </p>
              <ul className="flex flex-col gap-3.5">
                {POINTS.map((point) => (
                  <li
                    key={point.key}
                    className="flex items-center gap-3 text-paper/90"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-paper/12">
                      <point.icon className="size-4" />
                    </span>
                    {t(`points.${point.key}`)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {signingUp && (
          <section
            aria-labelledby="next-steps"
            className="flex flex-col gap-6 px-10 pt-2 pb-10 text-paper xl:px-12 xl:pb-12"
          >
            <h2
              id="next-steps"
              className="font-logo text-2xl font-semibold tracking-tight"
            >
              {t("nextTitle")}
            </h2>
            <ol className="grid gap-6 xl:grid-cols-3 xl:gap-8">
              {NEXT_STEPS.map((step, index) => (
                <li
                  key={step}
                  className="flex flex-col gap-2 border-t border-paper/20 pt-4"
                >
                  <span className="text-sm text-lime tabular-nums">
                    {t("step", { number: index + 1 })}
                  </span>
                  <p className="font-semibold">{t(`steps.${step}.title`)}</p>
                  <p className="text-sm text-pretty text-paper/70">
                    {t(`steps.${step}.text`)}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </aside>
  );
}
