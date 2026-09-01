import { getAllPostSlugs } from "@/lib/posts";

export default function sitemap() {
  const baseUrl = "https://argusintelligence.in";
  
  const staticRoutes = [
    "",
    "/solutions",
    "/solutions/ppe-detection",
    "/solutions/fall-detection",
    "/solutions/fire-smoke-detection",
    "/solutions/restricted-zone-monitoring",
    "/solutions/machinery-safety",
    "/industries/manufacturing",
    "/industries/warehousing",
    "/resources"
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : (route === "/resources" ? 0.9 : 0.8),
  }));

  // Dynamic Blog Routes
  const posts = getAllPostSlugs();
  const dynamicUrls = posts.map((post) => ({
    url: `${baseUrl}/resources/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticUrls, ...dynamicUrls];
}
