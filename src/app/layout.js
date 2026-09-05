import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ProgressiveBlur from "@/components/ProgressiveBlur";
import CurtainTransition from "@/components/CurtainTransition";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI-Powered Industrial Safety Monitoring | Argus",
  description:
    "Argus is an AI-powered industrial safety monitoring system that uses computer vision to detect workplace hazards, PPE violations, falls, fire, restricted zones and machinery risks using existing cameras.",
  metadataBase: new URL("https://argusintelligence.in"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    title: "AI-Powered Industrial Safety Monitoring | Argus",
    description:
      "Real-time AI-powered industrial safety monitoring using computer vision to detect PPE violations, falls, fire, and workplace hazards.",
    url: "https://argusintelligence.in/",
    siteName: "Argus",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Argus — AI-Powered Industrial Safety Monitoring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Powered Industrial Safety Monitoring | Argus",
    description:
      "Real-time AI-powered industrial safety monitoring using computer vision.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "AI industrial safety monitoring",
    "AI workplace safety",
    "industrial computer vision",
    "AI CCTV safety monitoring",
    "PPE detection",
    "fall detection",
    "fire detection",
    "smoke detection",
    "industrial hazard detection",
    "factory safety monitoring",
    "workplace safety software",
    "AI safety solutions",
    "Argus",
  ],
};

/* ── JSON-LD structured data ─────────────────────────────────── */
const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Argus",
  url: "https://argusintelligence.in/",
  description:
    "AI-powered industrial safety monitoring system using computer vision and existing cameras.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "argusintelligence.ai@gmail.com",
    contactType: "customer service",
  },
  sameAs: [
    "https://www.linkedin.com/in/argus-intelligence-16742b427/",
    "https://www.instagram.com/argusintelligence.ai?igsi=MXZsaGVrd2RsdzIwbg==",
    "https://x.com/argus_intel_",
  ],
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Argus",
  url: "https://argusintelligence.in/",
  description:
    "AI-powered industrial safety monitoring — detect PPE violations, falls, fire, restricted zones and machinery risks using existing cameras.",
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Argus",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Cloud-based",
  description:
    "AI-powered industrial safety monitoring system that uses computer vision to detect eight categories of workplace hazards in real time.",
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    priceCurrency: "INR",
    price: "0",
    description: "Contact for pricing",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebSite),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSoftware),
          }}
        />
      </head>
      <body className={inter.className}>
        <CurtainTransition />
        <SmoothScroll>{children}</SmoothScroll>
        <ProgressiveBlur
          position="bottom"
          height="60px"
          className="fixed bottom-0 left-0 right-0 z-50"
        />
      </body>
    </html>
  );
}
