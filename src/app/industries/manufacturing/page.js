import SolutionTemplate from "@/components/SolutionTemplate";

export const metadata = {
  title: "AI Safety for Manufacturing & Factories | Argus",
  description: "Protect factory floors and assembly lines with Argus. Our AI CCTV monitoring detects PPE violations, machinery risks, and fires in manufacturing plants.",
  alternates: {
    canonical: "/industries/manufacturing",
  },
};

export default function ManufacturingPage() {
  return (
    <SolutionTemplate
      title="Safety for Manufacturing"
      pitch="Protect your factory floors and assembly lines. Monitor heavy machinery, ensure PPE compliance, and prevent industrial fires without adding new cameras."
      seoText="— Argus is built for the manufacturing sector, providing AI CCTV monitoring for factories to reduce accidents and ensure OSHA/DGFASLI compliance."
      heroImage="/images/machine.png"
      cameraLabel="CAM-MFG [FACTORY FLOOR]"
      solutionDetails={{ shortDesc: "Factory Monitoring Active" }}
    />
  );
}