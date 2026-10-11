"use client";

import { Button } from "@/components/ui/button";
import { useActionBarStore } from "@/lib/store/action-bar-store";

export function ActionBar() {
  const { title, isSubmitting, canSubmit, onSave, onPublish, onCancel, saveLabel, publishLabel } =
    useActionBarStore();

  if (!title && !onSave && !onPublish) return null;

  return (
    <div className="flex items-center justify-between border-b bg-white px-6 py-3 dark:bg-zinc-950">
      <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{title}</h2>
      <div className="flex gap-2">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
        {onSave && (
          <Button
            variant="outline"
            onClick={onSave}
            disabled={!canSubmit || isSubmitting}
          >
            {saveLabel}
          </Button>
        )}
        {onPublish && (
          <Button onClick={onPublish} disabled={!canSubmit || isSubmitting}>
            {publishLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
