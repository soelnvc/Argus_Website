"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, animate } from "framer-motion";
import styles from "./WhatArgusDetects.module.css";

const HAZARDS = [
  {
    id: "fire-smoke",
    title: "Fire & Smoke",
    subtitle: "Thermal & Flame Detection",
    tags: ["Thermal Vision", "0.2s Alert"],
    cctvLabel: "CAM_04 // ZONE_B",
    image:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "falls",
    title: "Falls",
    subtitle: "Pose Estimation & Scaffolding",
    tags: ["Pose Estimation", "High Altitude"],
    cctvLabel: "CAM_12 // SCAFFOLD_03",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "no-helmet",
    title: "No Helmet",
    subtitle: "PPE Compliance Monitoring",
    tags: ["PPE Inspection", "Active Floor"],
    cctvLabel: "CAM_08 // ASSEMBLY_L2",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "restricted-zones",
    title: "Restricted Zones",
    subtitle: "Perimeter & Geo-Fence Breach",
    tags: ["Geo-Fence", "Access Control"],
    cctvLabel: "CAM_01 // HAZMAT_SECTOR",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "blocked-exits",
    title: "Blocked Exits",
    subtitle: "Egress & Obstacle Tracking",
    tags: ["Egress Safety", "Fire Code"],
    cctvLabel: "CAM_09 // CORRIDOR_EAST",
    image:
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "unattended-machinery",
    title: "Unattended Machinery",
    subtitle: "Robotics & Heavy Press Unit",
    tags: ["Robotics Cell", "Auto-Halt"],
    cctvLabel: "CAM_03 // PRESS_UNIT_B",
    image:
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "spills",
    title: "Spills & Trip Hazards",
    subtitle: "Surface Scan & Liquid Leak",
    tags: ["Surface Scan", "Slip Hazard"],
    cctvLabel: "CAM_07 // LOGISTICS_DOCK",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "smoking",
    title: "Smoking",
    subtitle: "Hazardous Area Compliance",
    tags: ["Vapor Detection", "Zero Tolerance"],
    cctvLabel: "CAM_11 // SILO_BAY_04",
    image:
      "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=80",
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
  const scrollRef = useRef(null);
  const scrollAnimationRef = useRef(null);
  const targetScrollRef = useRef(0);

  const handleContainerScroll = () => {
    if (!scrollAnimationRef.current && scrollRef.current) {
      targetScrollRef.current = scrollRef.current.scrollLeft;
    }
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const cardElement = container.querySelector(`.${styles.hazardCard}`);
    const cardWidth = cardElement ? cardElement.getBoundingClientRect().width : 360;
    const gap = 24;
    const step = cardWidth + gap;

    const startScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    let target;
    if (scrollAnimationRef.current && targetScrollRef.current !== undefined) {
      target =
        direction === "left"
          ? Math.max(0, targetScrollRef.current - step)
          : Math.min(maxScroll, targetScrollRef.current + step);
    } else {
      target =
        direction === "left"
          ? Math.max(0, startScroll - step)
          : Math.min(maxScroll, startScroll + step);
    }

    targetScrollRef.current = target;

    if (scrollAnimationRef.current) {
      scrollAnimationRef.current.stop();
    }

    // 120fps RAF-driven smooth, slow, and elegant glide
    scrollAnimationRef.current = animate(startScroll, target, {
      duration: 1.15,
      ease: [0.16, 1, 0.3, 1], // High-end quintic deceleration curve
      onUpdate: (latest) => {
        container.scrollLeft = latest;
      },
      onComplete: () => {
        scrollAnimationRef.current = null;
      },
    });
  };

  return (
    <section className={styles.detectsSection} id="safety">
      {/* Header Container (Permanently Locked Positions & Sizes) */}
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

      {/* Horizontal Cards Showcase (Clean Full Image - No Top Containers) */}
      <div className={styles.cardsTrackWrapper}>
        <div
          className={styles.cardsScrollContainer}
          ref={scrollRef}
          onScroll={handleContainerScroll}
        >
          {HAZARDS.map((hazard, index) => (
            <motion.div
              key={hazard.id}
              className={hazard.id === "fire-smoke" ? `${styles.hazardCard} ${styles.hazardCardDark}` : styles.hazardCard}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Full Background Image */}
              <img
                src={hazard.image}
                alt={hazard.title}
                className={styles.cardBgImage}
                loading="lazy"
              />

              {/* Vignette Overlay for Text Legibility */}
              <div className={styles.cardVignette} />

              {/* Spacer so bottom row stays pinned cleanly at the bottom */}
              <div style={{ flex: 1 }} />

              {/* Bottom Row: Title, Subtitle & Round Plus Button */}
              <div className={styles.cardBottomRow}>
                <div className={styles.cardTextContent}>
                  <h3 className={styles.hazardTitle}>{hazard.title}</h3>
                  <p className={styles.hazardSubtitle}>{hazard.subtitle}</p>
                </div>

                <button
                  className={styles.plusButton}
                  aria-label={`View details for ${hazard.title}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Carousel Navigation Arrows */}
        <div className={styles.navArrowsWrapper}>
          <button
            type="button"
            className={styles.navArrowBtn}
            onClick={() => scroll("left")}
            aria-label="Previous cards"
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
            className={styles.navArrowBtn}
            onClick={() => scroll("right")}
            aria-label="Next cards"
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
