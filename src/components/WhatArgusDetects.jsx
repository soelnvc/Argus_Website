"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, animate } from "framer-motion";
import styles from "./WhatArgusDetects.module.css";
import RoundCarousel from "./RoundCarousel";

const HAZARDS = [
  {
    id: "fire-smoke",
    title: "Fire & Smoke",
    altText: "AI-powered fire and smoke detection identifying thermal anomalies in an industrial facility using computer vision",
    subtitle: "Thermal & Flame Detection",
    tags: ["Thermal Vision", "0.2s Alert"],
    cctvLabel: "CAM_04 // ZONE_B",
    image: "/hazard images/fire.webp",
  },
  {
    id: "falls",
    title: "Falls",
    altText: "AI fall detection system using pose estimation to identify a fallen worker on a construction site",
    subtitle: "Pose Estimation & Scaffolding",
    tags: ["Pose Estimation", "High Altitude"],
    cctvLabel: "CAM_12 // SCAFFOLD_03",
    image: "/hazard images/fall.webp",
  },
  {
    id: "no-helmet",
    title: "No Helmet",
    altText: "AI PPE compliance monitoring detecting a missing safety helmet on an active factory floor",
    subtitle: "PPE Compliance Monitoring",
    tags: ["PPE Inspection", "Active Floor"],
    cctvLabel: "CAM_08 // ASSEMBLY_L2",
    image: "/hazard images/nohelmet.webp",
  },
  {
    id: "restricted-zones",
    title: "Restricted Zones",
    subtitle: "Perimeter & Geo-Fence Breach",
    tags: ["Geo-Fence", "Access Control"],
    cctvLabel: "CAM_01 // HAZMAT_SECTOR",
    image: "/hazard images/restrictedzone.webp",
  },
  {
    id: "blocked-exits",
    title: "Blocked Exits",
    altText: "AI monitoring system identifying blocked emergency exit in an industrial facility",
    subtitle: "Egress & Obstacle Tracking",
    tags: ["Egress Safety", "Fire Code"],
    cctvLabel: "CAM_09 // CORRIDOR_EAST",
    image: "/hazard images/blockedexit.webp",
  },
  {
    id: "unattended-machinery",
    title: "Unattended Machinery",
    subtitle: "Robotics & Heavy Press Unit",
    tags: ["Robotics Cell", "Auto-Halt"],
    cctvLabel: "CAM_03 // PRESS_UNIT_B",
    image: "/hazard images/unattendedmech.webp",
  },
  {
    id: "spills",
    title: "Spills & Trip Hazards",
    subtitle: "Surface Scan & Liquid Leak",
    tags: ["Surface Scan", "Slip Hazard"],
    cctvLabel: "CAM_07 // LOGISTICS_DOCK",
    image: "/hazard images/spilledhazard.webp",
  },
  {
    id: "smoking",
    title: "Smoking",
    altText: "AI detecting a worker smoking near flammable materials in a restricted industrial zone",
    subtitle: "Hazardous Area Compliance",
    tags: ["Vapor Detection", "Zero Tolerance"],
    cctvLabel: "CAM_11 // SILO_BAY_04",
    image: "/hazard images/smoking.webp",
  },
];

function ExpandingEvidenceShowcase() {
  const showcaseRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: showcaseRef,
    offset: ["start end", "center center"],
  });

  // Smooth GPU scale transform with 0 layout reflows
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0.65, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <div className={styles.showcaseOuterTrack} ref={showcaseRef}>
      <motion.div
        className={styles.expandingShowcaseCard}
        style={{
          scale,
          opacity,
          y,
        }}
      >
        <img
          src="/images/restricted.webp"
          alt="Argus Evidence Incident Visualizer"
          className={styles.evidenceImage}
          loading="lazy"
        />
      </motion.div>
    </div>
  );
}

export default function WhatArgusDetects() {
  const carouselRef = useRef(null);

  return (
    <section className={styles.detectsSection} id="safety">
      {/* Header Container */}
      <div className={styles.headerContainer}>
        {/* 1. Main Headline (Center Aligned) */}
        <div className={styles.headlineCenterWrapper}>
          <h2 className={styles.mainHeadline}>
            One system.{" "}
            <span className={styles.mutedText}>
              Eight safety
              <br />
              hazards.
            </span>
          </h2>
        </div>

        {/* 2 & 3. Subheadings */}
        <div className={styles.subheadingsRow}>
          <div>
            <p className={styles.subLeft}>
              We deploy with{" "}
              <strong>
                industrial plants, high-risk assembly lines, and warehouse
                facilities
              </strong>{" "}
              to catch critical safety events with sub-second response times.
            </p>
          </div>

          <div className={styles.subRightWrapper}>
            <p className={styles.subRight}>
              Explore how Argus connects to standard camera infrastructure to
              analyze edge feeds and dispatch real-time incident verification.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 3D CYLINDRICAL ROUND CAROUSEL SHOWCASE ─── */}
      <div className={styles.carouselSectionWrapper}>
        <RoundCarousel
          ref={carouselRef}
          images={HAZARDS}
          imageWidth={350}
          imageHeight={450}
          spacing={2.4}
          tilt={-7}
          perspective={3000}
          speed={3.0}
          cornerRadius={28}
          innerDim={3.5}
          pauseOnHover={false}
        />
      </div>

      {/* Evidence Block (Under cards on same black background) */}
      <div className={styles.evidenceContainer}>
        <motion.div
          className={styles.evidenceRow}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.evidenceLeft}>
            <h2 className={styles.evidenceHeadline}>
              Every alert{" "}
              <span className={styles.mutedText}>
                comes with
                <br />
                evidence.
              </span>
            </h2>
          </div>

          <div className={styles.evidenceRight}>
            <p className={styles.evidenceSubhead}>
              <strong>Argus doesn&apos;t just report a hazard.</strong>
              <span>It shows why it was detected.</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Expanding Evidence Showcase (70% -> 85% on scroll) */}
      <ExpandingEvidenceShowcase />

      {/* The Watchman for The New India Showcase */}
      <div className={styles.watchmanContainer}>
        <motion.div
          className={styles.watchmanContent}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className={styles.watchmanHeadline}>
            The Watchman who never sleeps
            <br />
            for The New <span className={styles.tricolorText}>India</span>
          </h2>

          <p className={styles.watchmanSubhead}>
            <span className={styles.subheadGrey}>
              Experts have put their trust in the product.
            </span>{" "}
            <span className={styles.subheadWhite}>#1 @ Ship to scale.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
