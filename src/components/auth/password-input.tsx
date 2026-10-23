"use client";

import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { AUTH_INPUT } from "@/components/auth/form-parts";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** A password field with a button to show what you typed. */
export function PasswordInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  const t = useTranslations("auth");
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <Input
        {...props}
        type={shown ? "text" : "password"}
        className={cn(AUTH_INPUT, "pr-12", className)}
      />
      <button
        type="button"
        aria-label={shown ? t("hidePassword") : t("showPassword")}
        aria-pressed={shown}
        onClick={() => setShown((current) => !current)}
        className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-quiet transition-colors outline-none hover:bg-mist hover:text-ink focus-visible:ring-2 focus-visible:ring-forest"
      >
        {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
