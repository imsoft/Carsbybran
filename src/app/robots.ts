import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/preview/",
          "/login",
          "/register",
          "/en-US/login",
          "/es-MX/login",
          "/en-US/register",
          "/es-MX/register",
          "/en-US/favorites",
          "/es-MX/favorites",
          "/en-US/profile",
          "/es-MX/profile",
          "/en-US/my-reviews",
          "/es-MX/my-reviews",
          "/api/",
        ],
      },
    ],
    sitemap: "https://carsbybran.com/sitemap.xml",
  };
}
