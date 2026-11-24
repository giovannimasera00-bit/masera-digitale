import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_INDEXABLE === "true") {
    return { rules: [{ userAgent: "*", allow: "/", disallow: "/staff" }] };
  }
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
