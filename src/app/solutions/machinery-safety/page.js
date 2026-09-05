import SolutionTemplate from "@/components/SolutionTemplate";

export const metadata = {
  title: "AI Machinery Safety Monitoring | Industrial IoT | Argus",
  description: "Monitor heavy machinery and automated equipment safely. Argus AI detects human proximity to moving parts and identifies unattended running machines.",
  alternates: {
    canonical: "/solutions/machinery-safety",
  },
};

export default function MachinerySafetyPage() {
  return (
    <SolutionTemplate
      title="Machinery Safety Monitoring"
      pitch="Monitor heavy machinery safely. Detect dangerous human proximity to moving parts and identify unattended running equipment."
      seoText="— Argus prevents factory accidents by using computer vision to monitor the interaction between workers and heavy mechanical equipment."
      heroImage="/images/machine.webp"
      cameraLabel="CAM-MACH [EQUIPMENT]"
      solutionDetails={{ shortDesc: "Machinery Safety Active" }}
    />
  );
}