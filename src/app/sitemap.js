export default function sitemap() {
  const baseUrl = "https://argusintelligence.in";
  
  const routes = [
    "",
    "/solutions",
    "/solutions/ppe-detection",
    "/solutions/fall-detection",
    "/solutions/fire-smoke-detection",
    "/solutions/restricted-zone-monitoring",
    "/solutions/machinery-safety",
    "/industries/manufacturing",
    "/industries/warehousing"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
