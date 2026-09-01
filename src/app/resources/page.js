import React from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import WaveGlow from "@/components/WaveGlow";
import { getSortedPostsData } from "@/lib/posts";
import styles from "@/components/SolutionTemplate.module.css"; // Reuse template styling

export const metadata = {
  title: "Safety Resources & Case Studies | Argus",
  description: "Read the latest research, technical guides, and case studies on AI-powered industrial safety monitoring.",
  alternates: {
    canonical: "/resources",
  }
};

export default function ResourcesHub() {
  const allPostsData = getSortedPostsData();

  return (
    <main id="top" className={styles.templateMain}>
      <Nav />
      <MobileBottomNav />

      <section style={{ paddingTop: "120px", paddingBottom: "60px", minHeight: "100vh", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <WaveGlow />
        </div>
        
        <div style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "0 auto", padding: "0 5%" }}>
          <h1 style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 700, marginBottom: "1rem", background: "linear-gradient(135deg, #fff 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Safety Resources
          </h1>
          <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.7)", marginBottom: "3rem", maxWidth: "600px" }}>
            Insights, case studies, and technical guides on building safer industrial environments using computer vision.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
            {allPostsData.map(({ slug, date, title, description, category }) => (
              <Link href={`/resources/${slug}`} key={slug} style={{ display: "block", textDecoration: "none" }}>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "16px", padding: "2rem", height: "100%", transition: "all 0.3s ease" }}>
                  <div style={{ fontSize: "0.85rem", color: "#a855f7", marginBottom: "1rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {category || "Article"} • {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric"})}
                  </div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#fff", marginBottom: "1rem", lineHeight: 1.3 }}>
                    {title}
                  </h2>
                  <p style={{ color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.5, fontSize: "1rem" }}>
                    {description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
