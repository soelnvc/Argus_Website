import SolutionTemplate from "@/components/SolutionTemplate";

export const metadata = {
  title: "AI Fall Detection System | Workplace Safety | Argus",
  description: "Detect worker falls instantly with Argus AI fall detection. Provide immediate medical response to slip and trip hazards using your existing security cameras.",
  alternates: {
    canonical: "/solutions/fall-detection",
  },
};

export default function FallDetectionPage() {
  return (
    <SolutionTemplate
      title="AI Fall Detection"
      pitch="Detect worker falls instantly. Provide immediate medical response and track slip and trip hazards using your existing security cameras."
      seoText="— Argus uses AI pose estimation and industrial computer vision to detect fallen workers in real time, reducing emergency response times."
      heroImage="/images/fall.png"
      cameraLabel="CAM-FALL [FALL HAZARD]"
      solutionDetails={{ shortDesc: "Fall Detection Active" }}
    />
  );
}