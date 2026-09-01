import SolutionTemplate from "@/components/SolutionTemplate";

export const metadata = {
  title: "AI Fire & Smoke Detection | Early Warning System | Argus",
  description: "Detect fires and smoke in seconds before they spread. Argus AI fire detection provides early warnings for industrial facilities, warehouses, and factories.",
  alternates: {
    canonical: "/solutions/fire-smoke-detection",
  },
};

export default function FireSmokeDetectionPage() {
  return (
    <SolutionTemplate
      title="AI Fire & Smoke Detection"
      pitch="Detect fires and smoke in seconds before they spread. Provide early warnings for industrial facilities using advanced thermal and optical AI."
      seoText="— Argus AI fire detection provides early warnings for industrial facilities, warehouses, and factories to prevent catastrophic damage."
      heroImage="/cctv_fire.jpg"
      cameraLabel="CAM-FIRE [THERMAL/OPTICAL]"
      solutionDetails={{ shortDesc: "Fire Monitoring Active" }}
    />
  );
}