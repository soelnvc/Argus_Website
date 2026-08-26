"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
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
    headline: "Connect your existing camera feed.",
    description:
      "Argus bridges directly into your on-premise RTSP and IP camera feeds without hardware replacement. Instant zero-latency streaming with edge-level optimization.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    id: "02",
    tag: "02 — Understand",
    title: "Understand",
    headline:
      "Argus analyzes the scene and evaluates potential hazards against safety criteria.",
    description:
      "Real-time neural computer vision monitors machinery clearance, PPE compliance, fall risks, and forklift exclusion zones simultaneously 24/7.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M4.93 4.93l1.41 1.41" />
        <path d="M17.66 17.66l1.41 1.41" />
        <path d="M4.93 19.07l1.41-1.41" />
        <path d="M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    id: "03",
    tag: "03 — Verify",
    title: "Verify",
    headline: "Temporal verification filters out transient visual anomalies.",
    description:
      "Multi-frame temporal tracking eliminates false positives caused by steam, shadows, or momentary occlusions, confirming genuine safety threats before triggering.",
    icon: (
      <svg
        width="28"
        height="28"
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
    headline:
      "Confirmed incidents are logged and dispatched to your safety team.",
    description:
      "Automated alerts broadcast directly to floor managers via dashboard, push notifications, and sound beacons within 200 milliseconds of verified detection.",
    icon: (
      <svg
        width="28"
        height="28"
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

function StepVisualizer({ activeStep }) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`,
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.mockupContainer}>
      <AnimatePresence mode="wait">
        {activeStep === 0 && (
          <motion.div
            key="step-0"
            className={styles.mockupCard}
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.feedHeader}>
              <div className={styles.feedLiveTag}>
                <span className={styles.livePulse} />
                LIVE RTSP STREAM
              </div>
              <span className={styles.timeTag}>{timeStr || "12:45:00"}</span>
            </div>

            <div className={styles.cameraGrid}>
              <div className={`${styles.camSlot} ${styles.camActive}`}>
                <div className={styles.camLabel}>
                  CAM 01 — Heavy Assembly Bay
                </div>
                <div className={styles.streamBadge}>
                  1080p • 60 FPS • Encrypted
                </div>
                <div className={styles.scanlineEffect} />
              </div>
              <div className={styles.camSlot}>
                <div className={styles.camLabel}>CAM 02 — Loading Dock 4</div>
                <div className={styles.streamBadge}>720p • 30 FPS</div>
              </div>
            </div>

            <div className={styles.statusFooter}>
              <span className={styles.feedCount}>4 Streams Active</span>
              <span className={styles.latencyTag}>14ms latency</span>
            </div>
          </motion.div>
        )}

        {activeStep === 1 && (
          <motion.div
            key="step-1"
            className={styles.mockupCard}
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.aiVisionStage}>
              <div className={styles.aiOverlayLayer}>
                <div className={styles.hazardBoxPrimary}>
                  <div className={styles.hazardTagPrimary}>
                    FORKLIFT ZONE PROXIMITY [98.4%]
                  </div>
                  <div className={styles.hazardDistance}>
                    Distance: 1.2m (Limit: 3.0m)
                  </div>
                </div>

                <div className={styles.hazardBoxSecondary}>
                  <div className={styles.hazardTagSecondary}>
                    WORKER: PPE VERIFIED
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.aiDiagnostics}>
              <div className={styles.diagItem}>
                <span className={styles.diagLabel}>Spatial Inference</span>
                <span className={styles.diagValue}>12.4 TFLOPS</span>
              </div>
              <div className={styles.diagItem}>
                <span className={styles.diagLabel}>Hazard Level</span>
                <span className={styles.diagAlert}>HIGH HAZARD</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeStep === 2 && (
          <motion.div
            key="step-2"
            className={styles.mockupCard}
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.temporalHeader}>
              <span>Multi-Frame Temporal Analysis</span>
              <span className={styles.verifiedTag}>VERIFIED</span>
            </div>

            <div className={styles.waveformStage}>
              <div className={styles.waveBarGroup}>
                {[45, 62, 78, 92, 98, 99, 99, 99].map((h, i) => (
                  <motion.div
                    key={i}
                    className={styles.waveBar}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  />
                ))}
              </div>
              <div className={styles.thresholdLine} />
            </div>

            <div className={styles.filterStats}>
              <div className={styles.statLine}>
                <span>Transient Noise Filtered</span>
                <span className={styles.statHighlight}>
                  100% (Steam & Occlusions)
                </span>
              </div>
              <div className={styles.statLine}>
                <span>Confidence Stability</span>
                <span className={styles.statHighlight}>99.8% (8/8 Frames)</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeStep === 3 && (
          <motion.div
            key="step-3"
            className={styles.mockupCard}
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.alertHeader}>
              <div className={styles.alertBadge}>
                <span className={styles.alertPulse} />
                CRITICAL DISPATCH
              </div>
              <span className={styles.dispatchTime}>+180ms</span>
            </div>

            <div className={styles.alertContent}>
              <div className={styles.alertTitle}>
                Machinery Safety Protocol Triggered
              </div>
              <div className={styles.alertMeta}>
                Sector 03 • Conveyor Unit B4 • Operator Notified
              </div>
            </div>

            <div className={styles.dispatchPills}>
              <span className={styles.dispatchedPill}>SMS Alert Sent</span>
              <span className={styles.dispatchedPill}>Beacon Active</span>
              <span className={styles.dispatchedPill}>Log Recorded</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
    <motion.div
      className={styles.showcaseCard}
      style={{ y, opacity }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.stepIconWrap}>{step.icon}</div>
        <h3 className={styles.stepHeadline}>{step.headline}</h3>
      </div>
      <div className={styles.cardBody}>
        <StepVisualizer activeStep={idx} />
      </div>
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
    else if (latest < 0.60) nextStep = 2;
    else nextStep = 3;
    setActiveStep((prev) => (prev !== nextStep ? nextStep : prev));
  });

  return (
    <section
      className={styles.solvesSection}
      ref={containerRef}
      id="why-how"
    >
      <div className={styles.solvesSticky}>
        <motion.div
          className={styles.bgParallaxLayer}
          style={{ y: bgParallaxY }}
        />

        <motion.div
          className={styles.sectionContainer}
          style={{ y: exitSlowY }}
        >
          {/* Left Column */}
          <div className={styles.leftColumn}>
            <div className={styles.eyebrowTag}>03 — HOW Argus Solves it</div>
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
                No clutter. No complicated setup.
                <br />
                Just real-time vision, clearly dispatched.
              </p>
            </div>
          </div>

          {/* Right Column: 4 Continuous Scroll Cards */}
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
