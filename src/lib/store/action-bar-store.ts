import type { ReactNode } from "react";
import { create } from "zustand";

interface ActionBarState {
  title: string | null;
  /** Link back to the page's listing, shown first in the bar. */
  back: { href: string; label: string } | null;
  /** Optional navigation rendered in place of the title (e.g. section menus). */
  navigation: ReactNode | null;
  /** Page-specific actions shown before the save buttons (e.g. links to share or preview). */
  extra: ReactNode | null;
  isSubmitting: boolean;
  /** True when the form has edits that are not saved yet. */
  isDirty: boolean;
  canSubmit: boolean;
  onSave: (() => void) | null;
  onPublish: (() => void) | null;
  onCancel: (() => void) | null;
  saveLabel: string;
  publishLabel: string;
  setActions: (
    actions: Partial<Omit<ActionBarState, "setActions" | "reset">>,
  ) => void;
  reset: () => void;
}

const initialState = {
  title: null,
  back: null,
  navigation: null,
  extra: null,
  isSubmitting: false,
  isDirty: false,
  canSubmit: true,
  onSave: null,
  onPublish: null,
  onCancel: null,
  // Empty: the bar shows its own translated "Guardar" / "Publicar".
  saveLabel: "",
  publishLabel: "",
};

/**
 * Lets a form page (e.g. property/offer editors) drive the Save/Publish/Cancel
 * buttons rendered by the dashboard header, without lifting the form tree up.
 */
export const useActionBarStore = create<ActionBarState>((set) => ({
  ...initialState,
  setActions: (actions) => set(actions),
  reset: () => set(initialState),
}));
