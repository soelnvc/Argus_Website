"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import styles from "./HowArgusSolvesIt.module.css";

const STEPS = [
  {
    id: "01",
    tag: "01 — Watch",
    title: "Watch",
    headline: "Connect your existing cameras.",
    description:
      "Argus bridges directly into your on-premise RTSP and IP camera feeds without hardware replacement — streaming with edge-level optimization.",
    image: "/images/step_watch.jpg",
    alt: "Argus RTSP Live Camera Feed Hub",
    auraClass: styles.auraPurple,
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="3" ry="3" />
      </svg>
    ),
  },
  {
    id: "02",
    tag: "02 — Understand",
    title: "Understand",
    headline: "Neural vision evaluates every hazard.",
    description:
      "Real-time spatial computer vision monitors machinery clearance, PPE compliance, fall risks, and forklift exclusion zones simultaneously 24/7.",
    image: "/images/step_understand.jpg",
    alt: "Argus 3D Spatial Neural Vision Analytics",
    auraClass: styles.auraIndigo,
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <path d="M6 9v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9" />
        <path d="M18 15v-3a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v3" />
      </svg>
    ),
  },
  {
    id: "03",
    tag: "03 — Verify",
    title: "Verify",
    headline: "Temporal filters eliminate false alerts.",
    description:
      "Multi-frame temporal tracking eliminates false positives caused by steam, shadows, or momentary occlusions, confirming genuine safety threats before triggering.",
    image: "/images/step_verify.jpg",
    alt: "Argus Multi-Frame Temporal Verification",
    auraClass: styles.auraEmerald,
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "04",
    tag: "04 — Act",
    title: "Act",
    headline: "Instant dispatch to floor managers.",
    description:
      "Automated alerts broadcast directly to safety managers via dashboard, push notifications, and sound beacons within 200 milliseconds of verified detection.",
    image: "/images/step_act.jpg",
    alt: "Argus Instant Safety Protocol Dispatch",
    auraClass: styles.auraAmber,
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

function ContinuousScrollCard({ step, idx, progress }) {
  let yTransformConfig;
  let opacityTransformConfig;

  if (idx === 0) {
    yTransformConfig = {
      input: [0, 0.22],
      output: ["0%", "-140%"],
    };
    opacityTransformConfig = {
      input: [0, 1],
      output: [1, 1],
    };
  } else if (idx === 1) {
    yTransformConfig = {
      input: [0, 0.22, 0.44],
      output: ["140%", "0%", "-140%"],
    };
    opacityTransformConfig = {
      input: [0, 0.22, 1],
      output: [0, 1, 1],
    };
  } else if (idx === 2) {
    yTransformConfig = {
      input: [0.22, 0.44, 0.66],
      output: ["140%", "0%", "-140%"],
    };
    opacityTransformConfig = {
      input: [0.22, 0.44, 1],
      output: [0, 1, 1],
    };
  } else {
    // idx === 3
    yTransformConfig = {
      input: [0.44, 0.66, 1.0],
      output: ["140%", "0%", "0%"],
    };
    opacityTransformConfig = {
      input: [0.44, 0.66, 1.0],
      output: [0, 1, 1],
    };
  }

  const y = useTransform(
    progress,
    yTransformConfig.input,
    yTransformConfig.output
  );
  const opacity = useTransform(
    progress,
    opacityTransformConfig.input,
    opacityTransformConfig.output
  );

  return (
    <motion.div className={styles.showcaseCard} style={{ y, opacity }}>
      {/* Top Left: Monochrome Icon & Headline */}
      <div className={styles.cardHeader}>
        <div className={styles.stepIconWrap}>{step.icon}</div>
        <h3 className={styles.stepHeadline}>{step.headline}</h3>
      </div>

      {/* Center: Polished Distinct Product Interface Image (Uniform Ratio & Size) */}
      <div className={styles.cardBody}>
        <div className={`${styles.productFrameWrap} ${step.auraClass}`}>
          <div className={styles.productImageContainer}>
            <Image
              src={step.image}
              alt={step.alt}
              fill
              sizes="(max-width: 768px) 100vw, 380px"
              className={styles.productImage}
              priority={idx === 0}
            />
          </div>
        </div>
      </div>

      {/* Bottom: Minimal Secondary Paragraph */}
      <div className={styles.cardFooter}>
        <p className={styles.stepDescription}>{step.description}</p>
      </div>
    </motion.div>
  );
}

export default function HowArgusSolvesIt() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const bgParallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const exitSlowY = useTransform(scrollYProgress, [0.72, 1.0], ["0vh", "-12vh"]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let nextStep = 0;
    if (latest < 0.16) nextStep = 0;
    else if (latest < 0.38) nextStep = 1;
    else if (latest < 0.6) nextStep = 2;
    else nextStep = 3;
    setActiveStep((prev) => (prev !== nextStep ? nextStep : prev));
  });

  return (
    <section className={styles.solvesSection} ref={containerRef} id="why-how">
      <div className={styles.solvesSticky}>
        <motion.div
          className={styles.bgParallaxLayer}
          style={{ y: bgParallaxY }}
        />

        <motion.div className={styles.sectionContainer} style={{ y: exitSlowY }}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            <h2 className={styles.mainHeadline}>
              From camera
              <br />
              to action.
            </h2>

            {/* Step Selector Pills */}
            <div className={styles.pillsList}>
              {STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className={`${styles.stepPill} ${isActive ? styles.stepPillActive : ""}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePillBackground"
                        className={styles.activePillHighlight}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className={styles.pillText}>{step.tag}</span>
                  </button>
                );
              })}
            </div>

            {/* Left Footer Subtext */}
            <div className={styles.leftFooter}>
              <p className={styles.subCopy}>
                Full installation guidance and support provided.
              </p>
            </div>
          </div>

          {/* Right Column: 4 Continuous Scroll Minimal Monochrome Cards */}
          <div className={styles.rightColumn}>
            {STEPS.map((step, idx) => (
              <ContinuousScrollCard
                key={step.id}
                step={step}
                idx={idx}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
