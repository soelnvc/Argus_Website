import SolutionTemplate from "@/components/SolutionTemplate";

export const metadata = {
  title: "AI Restricted Zone Monitoring | Intrusion Detection | Argus",
  description: "Prevent accidents with AI restricted zone monitoring. Argus detects unauthorized entry into hazardous areas, machine perimeters, and secure zones in real time.",
  alternates: {
    canonical: "/solutions/restricted-zone-monitoring",
  },
};

export default function RestrictedZonePage() {
  return (
    <SolutionTemplate
      title="Restricted Zone Monitoring"
      pitch="Prevent accidents by detecting unauthorized entry into hazardous areas, machine perimeters, and secure zones in real time."
      seoText="— Argus ensures perimeter security and safety compliance by alerting supervisors when personnel enter geofenced dangerous zones."
      heroImage="/images/restricted.webp"
      cameraLabel="CAM-ZONE [PERIMETER]"
      solutionDetails={{ shortDesc: "Zone Monitoring Active" }}
    />
  );
}