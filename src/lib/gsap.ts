import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Single registration point. Import gsap and its plugins from here, never
// from "gsap" directly, so every plugin is registered exactly once.
// Only use these in client components ("use client").
gsap.registerPlugin(useGSAP, Flip, ScrollTrigger, SplitText);

export { gsap, useGSAP, Flip, ScrollTrigger, SplitText };
