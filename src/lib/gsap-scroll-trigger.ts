import { ScrollTrigger } from "gsap/ScrollTrigger";

import { gsap } from "@/lib/gsap";

// ScrollTrigger on its own, so only the pages that tie motion to scroll load it.
gsap.registerPlugin(ScrollTrigger);

export { ScrollTrigger };
