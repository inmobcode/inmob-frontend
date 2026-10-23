"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { StatusAction, StatusButton, StatusScreen } from "./status-screen";

/** Shared body of every `error.tsx` boundary. */
export function ErrorScreen({
  error,
  reset,
  homeHref = "/",
  compact = false,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  homeHref?: string;
  compact?: boolean;
}) {
  const t = useTranslations("errors.server");
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      code="500"
      compact={compact}
      title={t("title")}
      tail={t("tail")}
      actions={
        <>
          <StatusAction onClick={reset}>{t("retry")}</StatusAction>
          <StatusButton href={homeHref}>{t("home")}</StatusButton>
        </>
      }
    />
  );
}
