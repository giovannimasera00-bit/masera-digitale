import type { NextConfig } from "next";

// Finché SITE_INDEXABLE non vale "true" (solo in produzione, dopo lo switch) il sito resta nascosto a Google.
const indexable = process.env.SITE_INDEXABLE === "true";

const config: NextConfig = {
  transpilePackages: ["@masera/ui", "@masera/core"],
  poweredByHeader: false,
  async headers() {
    return indexable ? [] : [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default config;
