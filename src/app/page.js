"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Nav from "@/components/Nav";
import LiquidMetalButton from "@/components/LiquidMetalButton";
import WaveGlow from "@/components/WaveGlow";
import ScrollCue from "@/components/ScrollCue";
import ClickToKnow from "@/components/ClickToKnow";
import DevGrid from "@/components/DevGrid";
import LoadingScreen from "@/components/LoadingScreen";
import CCTVFrame from "@/components/CCTVFrame";
import ScrollToKnow from "@/components/ScrollToKnow";
import HowArgusSolvesIt from "@/components/HowArgusSolvesIt";
import styles from "./page.module.css";

const SLIDES_DATA = [
  {
    title: "Do you know how many workers die of falling every year?",
    stat: "Over 800 fatal falls annually in construction & manufacturing.",
  },
  {
    title: "Fire hazards are unpredictable.",
    stat: "Over 3,000 industrial fires are reported each month.",
  },
  {
    title: "Machine entanglement is a silent killer.",
    stat: "15% of all workplace fatalities are machinery-related.",
  },
];

function JourneySlide({ index, slide, cameraZ }) {
  const zDepth = (index + 1) * -2000;
  const side = index % 2 === 0 ? "left" : "right";

  // Fade in early, stay solid as we approach and fly through, fade out once it's completely behind the camera
  const opacity = useTransform(
    cameraZ,
    [-zDepth - 3500, -zDepth - 1000, -zDepth + 600, -zDepth + 1200],
    [0, 1, 1, 0],
  );

  return (
    <motion.div
      className={styles.slideLayer}
      style={{
        z: zDepth,
        opacity,
      }}
    >
      <CCTVFrame title={slide.title} stat={slide.stat} side={side} />
    </motion.div>
  );
}

function JourneyContainer({ journeyRef }) {
  // --- 3D JOURNEY SCROLL LOGIC ---
  const { scrollYProgress: journeyProgressRaw } = useScroll({
    target: journeyRef,
    offset: ["start start", "end end"],
  });
  const journeyProgress = useTransform(journeyProgressRaw, (v) =>
    Math.min(Math.max(v, 0), 1),
  );

  // 3 slides at 2000z intervals (-2000, -4000, -6000) = 6000z.
  // Fly through all 3 slides in the first 90% of scroll, then hold in deep black for the solution reveal
  const cameraZ = useTransform(journeyProgress, [0, 0.9, 1.0], [0, 7600, 8200]);

  // Camera snakes left and right to aim at the CCTV viewfinders, then centers smoothly
  const cameraX = useTransform(
    journeyProgress,
    [0, 0.3, 0.6, 0.9, 0.94, 1.0],
    ["0vw", "12vw", "-12vw", "12vw", "0vw", "0vw"],
  );

  // Smooth entry animation for "How we solve this problem" & "scroll to know"
  // Only triggers once the user has fully scrolled through the CCTV sequence
  const endSectionOpacity = useTransform(journeyProgress, [0.92, 0.98], [0, 1]);
  const titleY = useTransform(journeyProgress, [0.92, 0.98], [48, 0]);
  const titleScale = useTransform(journeyProgress, [0.92, 0.98], [0.93, 1]);
  const titleBlur = useTransform(
    journeyProgress,
    [0.92, 0.98],
    ["blur(12px)", "blur(0px)"],
  );

  const cueOpacity = useTransform(journeyProgress, [0.95, 1.0], [0, 1]);
  const cueY = useTransform(journeyProgress, [0.95, 1.0], [24, 0]);
  const cueScale = useTransform(journeyProgress, [0.95, 1.0], [0.9, 1]);
  const isPointerActive = useTransform(journeyProgress, (v) =>
    v >= 0.94 ? "auto" : "none",
  );

  return (
    <div className={styles.journeySection} ref={journeyRef}>
      <div className={styles.journeySticky}>
        <motion.div
          className={styles.cameraContainer}
          style={{
            z: cameraZ,
            x: cameraX,
          }}
        >
          {SLIDES_DATA.map((slide, i) => (
            <JourneySlide key={i} index={i} slide={slide} cameraZ={cameraZ} />
          ))}
        </motion.div>

        {/* End of CCTV sequence: "How we solve this problem" + "scroll to know" */}
        <motion.div
          className={styles.journeyEndStage}
          style={{
            opacity: endSectionOpacity,
            pointerEvents: isPointerActive,
          }}
        >
          <motion.div
            className={styles.bigHeadingWrap}
            style={{
              y: titleY,
              scale: titleScale,
              filter: titleBlur,
            }}
          >
            <h2 className={styles.bigEndHeading}>
              <span>How we solve</span>
              <span>this problem</span>
            </h2>
          </motion.div>

          <motion.div
            className={styles.scrollToKnowWrap}
            style={{
              opacity: cueOpacity,
              y: cueY,
              scale: cueScale,
            }}
          >
            <ScrollToKnow text="scroll to know" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const journeyRef = useRef(null);

  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);

  // Dev tools state for heading text
  const [headText, setHeadText] = useState("Why do we\nneed Argus");
  const [headFontSize, setHeadFontSize] = useState(219);
  const [headLineHeight, setHeadLineHeight] = useState(1.15);

  useEffect(() => {
    // Initial loading sequence
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      setShowLoadingScreen(false);
      document.body.style.overflow = "";
      setTimeout(() => setHeroReady(true), 100);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  // --- HERO SCROLL LOGIC ---
  const { scrollYProgress: heroProgressRaw } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });
  const clampedHero = useTransform(heroProgressRaw, (v) =>
    Math.min(Math.max(v, 0), 1),
  );

  const borderRadius = useTransform(clampedHero, [0, 0.45], [32, 0]);
  const maxWidth = useTransform(clampedHero, [0, 0.45], ["1540px", "100%"]);
  const maxHeight = useTransform(clampedHero, [0, 0.45], ["900px", "100vh"]);
  const containerPadding = useTransform(
    clampedHero,
    [0, 0.45],
    ["24px", "0px"],
  );
  const borderOpacity = useTransform(clampedHero, [0, 0.38], [0.08, 0]);
  const shadowOpacity = useTransform(clampedHero, [0, 0.45], [0.95, 0]);
  const stickyBg = useTransform(clampedHero, [0, 0.4], ["#050208", "#000000"]);
  const cardBg = useTransform(clampedHero, [0, 0.4], ["#000000", "#000000"]);
  const ambientOpacity = useTransform(clampedHero, [0, 0.35], [1, 0]);

  const heroBgY = useTransform(clampedHero, [0.5, 0.95], ["0vh", "-12vh"]);
  const heroContentY = useTransform(clampedHero, [0.5, 0.95], ["0vh", "-24vh"]);
  const nextSectionY = useTransform(clampedHero, [0.5, 0.95], ["100vh", "0vh"]);
  const nextSectionRadius = useTransform(
    clampedHero,
    [0.5, 0.9],
    ["48px 48px 0px 0px", "0px 0px 0px 0px"],
  );

  return (
    <>
      {showLoadingScreen && <LoadingScreen duration={2000} />}

      <DevGrid
        headText={headText}
        setHeadText={setHeadText}
        headFontSize={headFontSize}
        setHeadFontSize={setHeadFontSize}
        headLineHeight={headLineHeight}
        setHeadLineHeight={setHeadLineHeight}
      />

      {/* PERMANENT FIXED NAVBAR DOCK ONLY */}
      <motion.div
        className={styles.fixedGlobalNavbarWrap}
        initial={{ opacity: 0, y: -24 }}
        animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
        transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <Nav />
      </motion.div>

      {/* --- HERO SECTION (250vh) --- */}
      <div className={styles.scrollWrapper} ref={heroRef}>
        <motion.div
          className={styles.stickyContainer}
          style={{ padding: containerPadding, backgroundColor: stickyBg }}
        >
          <motion.div
            className={styles.heroCardMotion}
            style={{
              borderRadius,
              maxWidth,
              maxHeight,
              backgroundColor: cardBg,
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: useTransform(
                borderOpacity,
                (v) => `rgba(255, 255, 255, ${v})`,
              ),
              boxShadow: useTransform(
                shadowOpacity,
                (v) => `0 40px 120px -20px rgba(0, 0, 0, ${v})`,
              ),
            }}
          >
            <motion.div
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                inset: 0,
                y: heroBgY,
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={
                heroReady
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.96 }
              }
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <WaveGlow text="ARGUS" />
            </motion.div>

            <motion.div
              className={styles.ambientEdgeGlow}
              style={{ opacity: ambientOpacity, y: heroBgY }}
            />

            <motion.div
              className={styles.heroMovingLayer}
              style={{ y: heroContentY }}
            >
              <motion.div
                className={styles.headerLayout}
                initial={{ opacity: 0, y: -24 }}
                animate={
                  heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }
                }
                transition={{
                  duration: 0.85,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className={styles.logoSlot}>
                  <a href="#" className={styles.logo}>
                    <svg
                      className={styles.logoIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
                      <path d="M2 12c3.5-6 16.5-6 20 0-3.5 6-16.5 6-20 0z" />
                    </svg>
                    <span className={styles.logoText}>argus</span>
                  </a>
                </div>
                <div className={styles.centerSlotSpacer} />
                <div className={styles.ctaSlot}>
                  <div className={styles.buttonWrapper}>
                    <LiquidMetalButton label="Launch" />
                  </div>
                </div>
              </motion.div>

              <div className={styles.content}>
                <motion.div
                  className={styles.leftContent}
                  initial={{ opacity: 0, x: -28, filter: "blur(8px)" }}
                  animate={
                    heroReady
                      ? { opacity: 1, x: 0, filter: "blur(0px)" }
                      : { opacity: 0, x: -28, filter: "blur(8px)" }
                  }
                  transition={{
                    duration: 0.95,
                    delay: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <p className={styles.statusTitle}>
                    Indian Industrial Intelligence
                  </p>
                  <p className={styles.subtext}>Making Workspace Safe</p>
                </motion.div>
                <motion.div
                  className={styles.rightContent}
                  initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
                  animate={
                    heroReady
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: 28, filter: "blur(10px)" }
                  }
                  transition={{
                    duration: 1.05,
                    delay: 0.45,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <h1 className={styles.pitch}>
                    The hundred-eyed watchman for industrial safety &amp;
                    operational resilience.
                  </h1>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={
                    heroReady
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.88 }
                  }
                  transition={{
                    duration: 0.85,
                    delay: 0.65,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <ScrollCue />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Blank black section with massive bold white text */}
          <motion.div
            className={styles.nextBlankSection}
            style={{ y: nextSectionY, borderRadius: nextSectionRadius }}
          >
            <div className={styles.nextSectionStage}>
              <AnimatePresence>
                {showQuestion && (
                  <motion.div
                    key="questionLayer"
                    initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div className={styles.bigHeadingWrap}>
                      <h2
                        className={styles.bigHeroHeading}
                        style={{
                          fontSize: `${headFontSize}px`,
                          lineHeight: headLineHeight,
                        }}
                      >
                        {headText.split("\n").map((line, idx) => (
                          <span key={idx}>{line}</span>
                        ))}
                      </h2>
                    </div>
                    <div className={styles.clickToKnowWrap}>
                      <ClickToKnow
                        onClick={() => {
                          setShowQuestion(false);
                          // Cinematic auto-scroll into the 3D journey after text fades out
                          setTimeout(() => {
                            if (journeyRef.current) {
                              // Try lenis first, fallback to native smooth scroll
                              if (window.__lenis) {
                                window.__lenis.scrollTo(journeyRef.current, {
                                  duration: 2.0,
                                  offset: window.innerHeight * 0.72,
                                });
                              } else {
                                const targetTop =
                                  journeyRef.current.getBoundingClientRect()
                                    .top +
                                  window.scrollY +
                                  window.innerHeight * 0.72;
                                window.scrollTo({
                                  top: targetTop,
                                  behavior: "smooth",
                                });
                              }
                            }
                          }, 500);
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* --- 3D JOURNEY & HOW ARGUS SOLVES IT SECTION --- */}
      {!showQuestion && (
        <>
          <JourneyContainer journeyRef={journeyRef} />
          <HowArgusSolvesIt />
        </>
      )}
    </>
  );
}
