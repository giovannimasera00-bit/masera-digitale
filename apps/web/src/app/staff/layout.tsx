import type { Metadata } from "next";
import type { ReactNode } from "react";

// Area riservata al personale: mai su Google, mai in cache.
export const metadata: Metadata = {
  title: { default: "Agenda del personale", template: "%s · Agenda Masera" },
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-carta text-nero">{children}</div>;
}
