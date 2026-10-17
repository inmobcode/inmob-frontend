import type { Metadata } from "next";

import { Plan404 } from "@/components/not-found/plan-404";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return <Plan404 />;
}
