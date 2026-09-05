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
import LiquidMetalHowBG from "./LiquidMetalHowBG";
import GlassSurface from "./GlassSurface";

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
        width="26"
        height="26"
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
        width="26"
        height="26"
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
        width="26"
        height="26"
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
        width="26"
        height="26"
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
        {/* Step 1: Ingest Live Feeds */}
        {activeStep === 0 && (
          <motion.div
            key="step-0"
            className={styles.mockupCard}
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.stageHeader}>
              <div className={styles.statusIndicator}>
                <span className={styles.livePulse} />
                <span className={styles.statusLabel}>RTSP INGESTION ACTIVE</span>
              </div>
              <span className={styles.monoTime}>UTC {timeStr || "12:45:00"}</span>
            </div>

            <div className={styles.feedList}>
              <div className={styles.feedItem}>
                <div className={styles.feedPrimary}>
                  <span className={styles.feedTag}>CAM 01</span>
                  <span className={styles.feedTitle}>Heavy Assembly Bay North</span>
                </div>
                <div className={styles.feedMeta}>1080p • 60 FPS • Edge TLS Encrypted</div>
              </div>

              <div className={styles.feedItem}>
                <div className={styles.feedPrimary}>
                  <span className={styles.feedTag}>CAM 02</span>
                  <span className={styles.feedTitle}>Loading Dock 04 Logistics</span>
                </div>
                <div className={styles.feedMeta}>720p • 30 FPS • Synchronized</div>
              </div>
            </div>

            <div className={styles.stageFooter}>
              <span className={styles.telemetryMuted}>4 Channels Ingested</span>
              <span className={styles.telemetryHighlight}>12ms Zero-Latency</span>
            </div>
          </motion.div>
        )}

        {/* Step 2: Neural Spatial Analysis */}
        {activeStep === 1 && (
          <motion.div
            key="step-1"
            className={styles.mockupCard}
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.stageHeader}>
              <div className={styles.statusIndicator}>
                <span className={styles.livePulse} />
                <span className={styles.statusLabel}>NEURAL INFERENCE ENGINE</span>
              </div>
              <span className={styles.monoTime}>12.4 TFLOPS</span>
            </div>

            <div className={styles.feedList}>
              <div className={styles.feedItem}>
                <div className={styles.feedPrimary}>
                  <span className={styles.feedTag}>HAZARD</span>
                  <span className={styles.feedTitle}>Forklift Zone Proximity Limit</span>
                </div>
                <div className={styles.feedMeta}>
                  Clearance: 1.18m (Safe: 3.00m) • Confidence: 98.4%
                </div>
              </div>

              <div className={styles.feedItem}>
                <div className={styles.feedPrimary}>
                  <span className={styles.feedTag}>PPE</span>
                  <span className={styles.feedTitle}>Personnel Clearance Verified</span>
                </div>
                <div className={styles.feedMeta}>
                  Helmet: Pass • Hi-Vis Vest: Pass • Zone: Clearance Bay
                </div>
              </div>
            </div>

            <div className={styles.stageFooter}>
              <span className={styles.telemetryMuted}>Inference Speed: 4.2ms</span>
              <span className={styles.telemetryHighlight}>Continuous 24/7 Scan</span>
            </div>
          </motion.div>
        )}

        {/* Step 3: Temporal Stability Filter */}
        {activeStep === 2 && (
          <motion.div
            key="step-2"
            className={styles.mockupCard}
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.stageHeader}>
              <div className={styles.statusIndicator}>
                <span className={styles.livePulse} />
                <span className={styles.statusLabel}>TEMPORAL ANOMALY FILTER</span>
              </div>
              <span className={styles.monoTime}>8/8 FRAMES VERIFIED</span>
            </div>

            <div className={styles.waveformStage}>
              <div className={styles.waveBarGroup}>
                {[45, 62, 78, 92, 98, 99, 99, 99].map((h, i) => (
                  <motion.div
                    key={i}
                    className={styles.waveBar}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.35, delay: i * 0.03 }}
                  />
                ))}
              </div>
            </div>

            <div className={styles.feedList}>
              <div className={styles.feedItem}>
                <div className={styles.feedPrimary}>
                  <span className={styles.feedTag}>FILTER</span>
                  <span className={styles.feedTitle}>Transient Anomaly Suppression</span>
                </div>
                <div className={styles.feedMeta}>
                  Steam & momentary shadows eliminated (100% false-positive rejection)
                </div>
              </div>
            </div>

            <div className={styles.stageFooter}>
              <span className={styles.telemetryMuted}>Temporal Consistency</span>
              <span className={styles.telemetryHighlight}>99.8% Stability</span>
            </div>
          </motion.div>
        )}

        {/* Step 4: Automated Incident Dispatch */}
        {activeStep === 3 && (
          <motion.div
            key="step-3"
            className={styles.mockupCard}
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.stageHeader}>
              <div className={styles.statusIndicator}>
                <span className={styles.livePulse} />
                <span className={styles.statusLabel}>INCIDENT PROTOCOL DISPATCH</span>
              </div>
              <span className={styles.monoTime}>+180ms DISPATCH</span>
            </div>

            <div className={styles.feedList}>
              <div className={styles.feedItem}>
                <div className={styles.feedPrimary}>
                  <span className={styles.feedTag}>ACTION</span>
                  <span className={styles.feedTitle}>Machinery Safety Protocol Triggered</span>
                </div>
                <div className={styles.feedMeta}>
                  Sector 03 • Conveyor Unit B4 • Operator Audio-Visual Alert
                </div>
              </div>
            </div>

            <div className={styles.actionGrid}>
              <span className={styles.actionItem}>Floor Dashboard Dispatched</span>
              <span className={styles.actionItem}>Beacon Sound Active</span>
              <span className={styles.actionItem}>Secure Audit Log Recorded</span>
            </div>

            <div className={styles.stageFooter}>
              <span className={styles.telemetryMuted}>Incident Broadcast</span>
              <span className={styles.telemetryHighlight}>Immediate Dispatch</span>
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
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateMedia = () => {
      setIsDesktop(typeof window !== "undefined" && window.innerWidth > 768);
    };
    updateMedia();
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const bgParallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const exitSlowY = useTransform(scrollYProgress, [0.72, 1.0], ["0vh", "-12vh"]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let nextStep = 0;
    if (latest < 0.25) nextStep = 0;
    else if (latest < 0.50) nextStep = 1;
    else if (latest < 0.75) nextStep = 2;
    else nextStep = 3;
    setActiveStep((prev) => (prev !== nextStep ? nextStep : prev));
  });

  const handleStepClick = (idx) => {
    setActiveStep(idx);
    if (!containerRef.current || typeof window === "undefined") return;

    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const containerTop = rect.top + scrollTop;
    const containerHeight = containerRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollableDistance = containerHeight - windowHeight;

    const stepProgress = [0.05, 0.30, 0.55, 0.80];
    const targetScrollY = containerTop + stepProgress[idx] * scrollableDistance;

    if (window.__lenis) {
      window.__lenis.scrollTo(targetScrollY, { duration: 1.0 });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    }
  };

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
        >
          <LiquidMetalHowBG />
        </motion.div>

        <motion.div
          className={styles.sectionContainer}
          style={{ y: exitSlowY }}
        >
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
                    onClick={() => handleStepClick(idx)}
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
                      >
                        {isDesktop && (
                          <GlassSurface
                            width="100%"
                            height="100%"
                            borderRadius={10}
                            borderWidth={0.08}
                            brightness={60}
                            opacity={0.94}
                            blur={10}
                            distortionScale={-180}
                            redOffset={0}
                            greenOffset={10}
                            blueOffset={20}
                            backgroundOpacity={0.06}
                            saturation={1.2}
                            style={{
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              pointerEvents: "none",
                            }}
                            className={styles.desktopGlassPill}
                          />
                        )}
                      </motion.div>
                    )}
                    <span className={styles.pillText}>{step.tag}</span>
                  </button>
                );
              })}
            </div>

            {/* Left Footer Subtext */}
            <div className={styles.leftFooter}>
              <p className={styles.subCopy}>
                Full Installation Guidance and Support by Argus Team
              </p>
              <div className={styles.mobileSeparator} aria-hidden="true" />
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
