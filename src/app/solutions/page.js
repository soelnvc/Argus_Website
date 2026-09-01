import SolutionTemplate from "@/components/SolutionTemplate";

export const metadata = {
  title: "AI Safety Solutions | Computer Vision for Industry | Argus",
  description: "Explore Argus AI safety solutions: PPE detection, fall detection, fire monitoring, and machinery safety designed for industrial environments.",
  alternates: {
    canonical: "/solutions",
  },
};

export default function SolutionsHubPage() {
  return (
    <SolutionTemplate
      title="Industrial Safety Solutions"
      pitch="Explore our suite of AI-powered safety monitoring tools designed to protect workers and operations in the world’s most demanding environments."
      seoText="— Argus provides a comprehensive computer vision platform for industrial safety, including PPE detection, fall detection, and fire monitoring."
      heroImage="/cctv_fire.jpg"
      cameraLabel="CAM-HUB [ALL HAZARDS]"
      solutionDetails={{ shortDesc: "Comprehensive Monitoring" }}
    />
  );
}