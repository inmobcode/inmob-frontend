// Lives outside the client sidebar module so server components can import
// the plain string (values exported from a "use client" file become
// client references on the server).
export const SIDEBAR_COOKIE = "sidebar_collapsed";

// While the sidebar tweens its width the page behind it reflows on every
// frame. Panels that measure their content (like the scroll blur) wait for
// this attribute to go away, then re-measure once on the event.
export const SIDEBAR_ANIMATING_ATTR = "data-sidebar-animating";
export const SIDEBAR_SETTLED_EVENT = "sidebar-settled";
