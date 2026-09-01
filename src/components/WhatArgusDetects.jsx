"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, animate } from "framer-motion";
import styles from "./WhatArgusDetects.module.css";

const HAZARDS = [
  {
    id: "fire-smoke",
    title: "Fire & Smoke",
    altText: "AI-powered fire and smoke detection identifying thermal anomalies in an industrial facility using computer vision",
    subtitle: "Thermal & Flame Detection",
    tags: ["Thermal Vision", "0.2s Alert"],
    cctvLabel: "CAM_04 // ZONE_B",
    image: "/hazard images/fire.jpg",
  },
  {
    id: "falls",
    title: "Falls",
    altText: "AI fall detection system using pose estimation to identify a fallen worker on a construction site",
    subtitle: "Pose Estimation & Scaffolding",
    tags: ["Pose Estimation", "High Altitude"],
    cctvLabel: "CAM_12 // SCAFFOLD_03",
    image: "/hazard images/fall.png",
  },
  {
    id: "no-helmet",
    title: "No Helmet",
    altText: "AI PPE compliance monitoring detecting a missing safety helmet on an active factory floor",
    subtitle: "PPE Compliance Monitoring",
    tags: ["PPE Inspection", "Active Floor"],
    cctvLabel: "CAM_08 // ASSEMBLY_L2",
    image: "/hazard images/nohelmet.png",
  },
  {
    id: "restricted-zones",
    title: "Restricted Zones",
    subtitle: "Perimeter & Geo-Fence Breach",
    tags: ["Geo-Fence", "Access Control"],
    cctvLabel: "CAM_01 // HAZMAT_SECTOR",
    image: "/hazard images/restrictedzone.png",
  },
  {
    id: "blocked-exits",
    title: "Blocked Exits",
    altText: "AI monitoring system identifying blocked emergency exit in an industrial facility",
    subtitle: "Egress & Obstacle Tracking",
    tags: ["Egress Safety", "Fire Code"],
    cctvLabel: "CAM_09 // CORRIDOR_EAST",
    image: "/hazard images/blockedexit.png",
  },
  {
    id: "unattended-machinery",
    title: "Unattended Machinery",
    subtitle: "Robotics & Heavy Press Unit",
    tags: ["Robotics Cell", "Auto-Halt"],
    cctvLabel: "CAM_03 // PRESS_UNIT_B",
    image: "/hazard images/unattendedmech.png",
  },
  {
    id: "spills",
    title: "Spills & Trip Hazards",
    subtitle: "Surface Scan & Liquid Leak",
    tags: ["Surface Scan", "Slip Hazard"],
    cctvLabel: "CAM_07 // LOGISTICS_DOCK",
    image: "/hazard images/spilledhazard.png",
  },
  {
    id: "smoking",
    title: "Smoking",
    altText: "AI detecting a worker smoking near flammable materials in a restricted industrial zone",
    subtitle: "Hazardous Area Compliance",
    tags: ["Vapor Detection", "Zero Tolerance"],
    cctvLabel: "CAM_11 // SILO_BAY_04",
    image: "/hazard images/smoking.png",
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
          src="/images/restricted.png"
          alt="Argus Evidence Incident Visualizer"
          className={styles.evidenceImage}
          loading="lazy"
        />
      </motion.div>
    </div>
  );
}

export default function WhatArgusDetects() {
  const [activeIndex, setActiveIndex] = React.useState(2);
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchDeltaX = useRef(0);
  const touchDeltaY = useRef(0);

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(HAZARDS.length - 1, prev + 1));
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 30;
    const velocityThreshold = 180;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -swipeThreshold || velocity < -velocityThreshold) {
      handleNext();
    } else if (offset > swipeThreshold || velocity > velocityThreshold) {
      handlePrev();
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
    touchDeltaY.current = 0;
  };

  const handleTouchMove = (e) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    touchDeltaY.current = e.touches[0].clientY - touchStartY.current;
  };

  const handleTouchEnd = () => {
    const dx = touchDeltaX.current;
    const dy = touchDeltaY.current;
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const getCardStyle = (offset, index) => {
    const absOffset = Math.abs(offset);
    if (absOffset > 3) {
      return {
        x: offset > 0 ? 520 : -520,
        y: 180,
        rotate: offset > 0 ? 30 : -30,
        scale: 0.72,
        opacity: 0,
        filter: "blur(10px) brightness(0.3)",
        zIndex: 0,
        pointerEvents: "none",
      };
    }

    const isHovered = hoveredIndex === index;

    // ─── SNEAK PEEK FOR INCOMING / OUTGOING CARDS (absOffset === 3) ───
    if (absOffset === 3) {
      return {
        x: offset * 130,
        y: 125,
        rotate: offset * 8.2,
        scale: 0.8,
        zIndex: 2,
        opacity: 0.32,
        filter: "blur(6px) brightness(0.45)",
        pointerEvents: "auto",
      };
    }

    // ─── 5 VISIBLE MAIN DECK CARDS (absOffset <= 2) ───
    const xOffset = offset * 132;
    let yOffset = absOffset === 0 ? 0 : absOffset === 1 ? 22 : 68;
    let rotation = offset * 8.2;
    let scale = absOffset === 0 ? 1 : absOffset === 1 ? 0.95 : 0.88;
    let zIndex = 10 - absOffset * 2;
    let filter = "blur(0px) brightness(1)";

    // Hover state: lift up, straighten angle, enlarge, and bring to front
    if (isHovered) {
      yOffset -= 38;
      rotation = rotation * 0.4;
      scale = scale * 1.05;
      zIndex = 30;
    }

    return {
      x: xOffset,
      y: yOffset,
      rotate: rotation,
      scale,
      zIndex,
      opacity: 1,
      filter,
      pointerEvents: "auto",
    };
  };

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

      {/* ─── FANNED DECK ARC SHOWCASE (With Touch Swipe & Drag Support) ─── */}
      <div
        className={styles.fanDeckSectionWrapper}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.fanDeckStage}>
          {HAZARDS.map((hazard, index) => {
            const offset = index - activeIndex;
            const cardStyle = getCardStyle(offset, index);

            return (
              <motion.div
                key={hazard.id}
                className={`${styles.hazardCard} ${offset === 0 ? styles.activeCenterCard : ""}`}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={handleDragEnd}
                animate={{
                  x: cardStyle.x,
                  y: cardStyle.y,
                  rotate: cardStyle.rotate,
                  scale: cardStyle.scale,
                  opacity: cardStyle.opacity,
                  filter: cardStyle.filter,
                  zIndex: cardStyle.zIndex,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1], // Fluid quintic deceleration
                }}
                style={{
                  pointerEvents: cardStyle.pointerEvents,
                }}
              >
                {/* Full Background Image */}
                <img
                  src={hazard.image}
                  alt={hazard.altText || hazard.title}
                  className={styles.cardBgImage}
                  loading="lazy"
                  draggable="false"
                />

                {/* Vignette Overlay for Text Legibility */}
                <div className={styles.cardVignette} />

                {/* Spacer so bottom row stays pinned cleanly at the bottom */}
                <div style={{ flex: 1 }} />

                {/* Bottom Row: Title and Subtitle */}
                <div className={styles.cardBottomRow}>
                  <div className={styles.cardTextContent}>
                    <h3 className={styles.hazardTitle}>{hazard.title}</h3>
                    <p className={styles.hazardSubtitle}>{hazard.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Navigation Arrows */}
        <div className={styles.navArrowsWrapper}>
          <button
            type="button"
            className={`${styles.navArrowBtn} ${activeIndex === 0 ? styles.disabledArrow : ""}`}
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous hazard card"
          >
            <svg
              className={styles.arrowIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <button
            type="button"
            className={`${styles.navArrowBtn} ${activeIndex === HAZARDS.length - 1 ? styles.disabledArrow : ""}`}
            onClick={handleNext}
            disabled={activeIndex === HAZARDS.length - 1}
            aria-label="Next hazard card"
          >
            <svg
              className={styles.arrowIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
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
