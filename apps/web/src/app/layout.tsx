import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, DM_Sans } from "next/font/google";
import "./globals.css";

// next/font scarica i font in fase di build e li serve dal nostro sito: il browser non contatta Google.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const indexable = process.env.SITE_INDEXABLE === "true";

export const metadata: Metadata = {
  title: { default: "Farmacia Masera · Seregno", template: "%s · Farmacia Masera" },
  description: "Medicina per tradizione. Dal 1908. Farmacia Masera, Via Garibaldi 103, Seregno.",
  robots: indexable ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#2E3F2D" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${bodoni.variable} ${dmSans.variable}`}>
      <body>
        <noscript>
          {/* Senza JavaScript le animazioni non partono: mostriamo tutto subito. */}
          <style>{`.fm-arch path,.fm-rise-line,.fm-bar-fill{animation:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
