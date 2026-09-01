import SolutionTemplate from "@/components/SolutionTemplate";

export const metadata = {
  title: "AI PPE Detection System | Real-Time Safety Compliance | Argus",
  description: "Automate Personal Protective Equipment (PPE) compliance with Argus. Our AI computer vision detects missing helmets, vests, and goggles in real time.",
  alternates: {
    canonical: "/solutions/ppe-detection",
  },
};

export default function PPEDetectionPage() {
  return (
    <SolutionTemplate
      title="AI PPE Detection"
      pitch="Automate safety compliance by detecting missing helmets, vests, and safety goggles in real time using your existing CCTV cameras."
      seoText="— Argus uses advanced industrial computer vision to ensure 100% Personal Protective Equipment (PPE) compliance on the factory floor, preventing injuries and regulatory fines."
      heroImage="/images/helmet.png"
      cameraLabel="CAM-PPE [HELMET COMPLIANCE]"
      solutionDetails={{
        shortDesc: "PPE Compliance Check Active"
      }}
    />
  );
}
