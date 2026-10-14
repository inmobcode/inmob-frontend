import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Single registration point. Import gsap from here, never from "gsap"
// directly, so it is registered exactly once. Plugins live in their own
// modules (see gsap-flip.ts) so a page only downloads the ones it uses —
// this file is imported by the sidebar and by Select, i.e. everywhere.
// Only use these in client components ("use client").
gsap.registerPlugin(useGSAP);

export { gsap, useGSAP };
