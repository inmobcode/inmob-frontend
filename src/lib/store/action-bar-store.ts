import { create } from "zustand";

interface ActionBarState {
  title: string | null;
  isSubmitting: boolean;
  canSubmit: boolean;
  onSave: (() => void) | null;
  onPublish: (() => void) | null;
  onCancel: (() => void) | null;
  saveLabel: string;
  publishLabel: string;
  setActions: (actions: Partial<Omit<ActionBarState, "setActions" | "reset">>) => void;
  reset: () => void;
}

const initialState = {
  title: null,
  isSubmitting: false,
  canSubmit: true,
  onSave: null,
  onPublish: null,
  onCancel: null,
  saveLabel: "Guardar borrador",
  publishLabel: "Publicar",
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
