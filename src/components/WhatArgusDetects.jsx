"use client";
import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import styles from "./WhatArgusDetects.module.css";
// RoundCarousel removed - restoring fanned deck arc showcase

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
        <Image
          src="/images/restricted.webp"
          alt="Argus Evidence Incident Visualizer"
          className={styles.evidenceImage}
          width={1200}
          height={800}
          style={{ width: "100%", height: "auto" }}
          priority={true}
        />
      </motion.div>
    </div>
  );
}

function getCardTransform(offset, hoverProgress) {
  const absOffset = Math.abs(offset);
  const x = offset * 132;
  let y = 17 * Math.pow(absOffset, 1.85);
  let rotate = offset * 8.2;
  let scale = Math.max(0.72, 1 - 0.065 * Math.pow(absOffset, 1.15));

  let opacity = 1;
  if (absOffset > 2.2) {
    opacity = Math.max(0, 1 - (absOffset - 2.2) / 1.3);
  }

  let filter = "blur(0px) brightness(1)";
  if (absOffset > 2.2) {
    const blurAmount = (absOffset - 2.2) * 5;
    const brightnessAmount = Math.max(0.3, 1 - (absOffset - 2.2) * 0.45);
    filter = `blur(${blurAmount.toFixed(1)}px) brightness(${brightnessAmount.toFixed(2)})`;
  }

  let zIndex = Math.max(1, Math.round((10 - absOffset * 2.2) * 10));

  // Subtly smooth hover elevation, rotation straightening, and scale
  if (hoverProgress > 0.001) {
    y -= 38 * hoverProgress;
    rotate *= 1 - (0.6 * hoverProgress);
    scale *= 1 + (0.05 * hoverProgress);
    zIndex = Math.round(zIndex + hoverProgress * 200);
  }

  const pointerEvents = absOffset < 2.6 ? "auto" : "none";

  return { x, y, rotate, scale, opacity, filter, zIndex, pointerEvents };
}

export default function WhatArgusDetects() {
  const cardRefs = useRef([]);
  const hoverValuesRef = useRef(new Float32Array(HAZARDS.length));
  const progressRef = useRef(3); // Start with Restricted Zones in center
  const targetProgressRef = useRef(null);
  const hoveredIndexRef = useRef(null);

  // Drag / touch gesture tracking
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartProgressRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const dragVelocityRef = useRef(0);

  // Very slow continuous speed (~45 seconds per full 8-card revolution)
  const ROTATION_SPEED = 0.18; // cards per second

  // Window-level safety: ensure dragging state is reliably released even if dropped outside container
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        targetProgressRef.current = null;
        setTimeout(() => {
          didDragRef.current = false;
        }, 50);
      }
    };

    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointercancel", handleGlobalPointerUp);
    return () => {
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointercancel", handleGlobalPointerUp);
    };
  }, []);

  useEffect(() => {
    let rafId;
    let lastTime = performance.now();

    const tick = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Handle programmatic glide (from arrow clicks or card click)
      if (targetProgressRef.current !== null) {
        const diff = targetProgressRef.current - progressRef.current;
        if (Math.abs(diff) < 0.008) {
          progressRef.current = targetProgressRef.current;
          targetProgressRef.current = null;
        } else {
          progressRef.current += diff * Math.min(1, delta * 7.5);
        }
      } else if (!isDraggingRef.current) {
        // Continuous smooth slow rotation: resumes immediately from dropped location
        progressRef.current += ROTATION_SPEED * delta;
      }

      const p = progressRef.current;
      const count = HAZARDS.length;
      const normP = ((p % count) + count) % count;

      cardRefs.current.forEach((el, index) => {
        if (!el) return;

        // Smoothly interpolate hover progress with gentle deceleration
        const isTargetHovered = !isDraggingRef.current && hoveredIndexRef.current === index;
        const targetHover = isTargetHovered ? 1 : 0;
        hoverValuesRef.current[index] += (targetHover - hoverValuesRef.current[index]) * Math.min(1, delta * 7.5);
        const hoverProgress = hoverValuesRef.current[index];

        // Continuous circular offset in [-count/2, count/2)
        const offset = (((index - normP + count / 2) % count + count) % count) - count / 2;
        const style = getCardTransform(offset, hoverProgress);

        el.style.transform = `translate3d(${style.x}px, ${style.y}px, 0) rotate(${style.rotate}deg) scale(${style.scale})`;
        el.style.opacity = style.opacity;
        el.style.zIndex = style.zIndex;
        el.style.filter = style.filter;
        el.style.pointerEvents = style.pointerEvents;
        el.style.borderColor = Math.abs(offset) < 0.5 || hoverProgress > 0.3 ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.12)";
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handlePrev = () => {
    const current = targetProgressRef.current !== null ? targetProgressRef.current : progressRef.current;
    targetProgressRef.current = Math.ceil(current - 1.05);
  };

  const handleNext = () => {
    const current = targetProgressRef.current !== null ? targetProgressRef.current : progressRef.current;
    targetProgressRef.current = Math.floor(current + 1.05);
  };

  const handleCardClick = (index) => {
    if (didDragRef.current) return;
    const p = progressRef.current;
    const count = HAZARDS.length;
    const normP = ((p % count) + count) % count;
    const offset = (((index - normP + count / 2) % count + count) % count) - count / 2;
    targetProgressRef.current = p + offset;
  };

  // Robust HTML5 pointer capture: works for mouse drag and mobile touch alike
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    isDraggingRef.current = true;
    didDragRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartProgressRef.current = progressRef.current;
    lastDragTimeRef.current = performance.now();
    dragVelocityRef.current = 0;
    targetProgressRef.current = null;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 4) {
      didDragRef.current = true;
    }
    // 132px matches exact card offset spacing for 1:1 tactile drag
    progressRef.current = dragStartProgressRef.current - deltaX / 132;

    const now = performance.now();
    const dt = (now - lastDragTimeRef.current) / 1000;
    if (dt > 0.01) {
      dragVelocityRef.current = (deltaX / 132) / dt;
      lastDragTimeRef.current = now;
    }
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    try {
      if (e && e.currentTarget && e.pointerId !== undefined) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
    isDraggingRef.current = false;

    // Resume scrolling directly from the exact dropped position without snapping or jumping
    targetProgressRef.current = null;
    setTimeout(() => {
      didDragRef.current = false;
    }, 50);
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

      {/* ─── FANNED DECK ARC SHOWCASE (Continuous Slow Auto-Rotation) ─── */}
      <div
        className={styles.fanDeckSectionWrapper}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className={styles.fanDeckStage}>
          {HAZARDS.map((hazard, index) => {
            return (
              <div
                key={hazard.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className={styles.hazardCard}
                onClick={() => handleCardClick(index)}
                onMouseEnter={() => { hoveredIndexRef.current = index; }}
                onMouseLeave={() => { hoveredIndexRef.current = null; }}
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
              </div>
            );
          })}
        </div>

        {/* Carousel Navigation Arrows */}
        <div className={styles.navArrowsWrapper}>
          <button
            type="button"
            className={styles.navArrowBtn}
            onClick={handlePrev}
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
            className={styles.navArrowBtn}
            onClick={handleNext}
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
