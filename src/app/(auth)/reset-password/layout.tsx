import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restablecer contraseña",
  // Only ever opened from a one-time emailed link.
  robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
