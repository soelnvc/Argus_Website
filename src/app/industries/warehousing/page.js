import SolutionTemplate from "@/components/SolutionTemplate";

export const metadata = {
  title: "AI Safety for Warehousing & Logistics | Argus",
  description: "Ensure warehouse safety with AI. Argus detects forklift accidents, blocked emergency exits, and worker falls in logistics centers.",
  alternates: {
    canonical: "/industries/warehousing",
  },
};

export default function WarehousingPage() {
  return (
    <SolutionTemplate
      title="Safety for Warehousing"
      pitch="Ensure warehouse and logistics safety. Detect forklift hazards, blocked emergency exits, and slip/trip incidents across massive distribution centers."
      seoText="— Argus optimizes safety in warehouses by using AI to monitor logistics operations, loading docks, and worker safety in real time."
      heroImage="/images/fall.png"
      cameraLabel="CAM-WHS [DISTRIBUTION]"
      solutionDetails={{ shortDesc: "Warehouse Monitoring" }}
    />
  );
}