import { Flip } from "gsap/Flip";

import { gsap } from "@/lib/gsap";

// Flip on its own, so only the pages that animate layout changes load it.
gsap.registerPlugin(Flip);

export { Flip };
