"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import LiquidMetalButton from "@/components/LiquidMetalButton";
import WaveGlow from "@/components/WaveGlow";
import ScrollCue from "@/components/ScrollCue";
import ClickToKnow from "@/components/ClickToKnow";
import DevGrid from "@/components/DevGrid";
import LoadingScreen from "@/components/LoadingScreen";
import styles from "./page.module.css";

export default function Home() {
  const containerRef = useRef(null);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);

  // Dev tools state for heading text
  const [headText, setHeadText] = useState("Why do we\nneed Argus");
  const [headFontSize, setHeadFontSize] = useState(219);
  const [headLineHeight, setHeadLineHeight] = useState(1.15);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("argus_intro_seen");
    if (!hasSeenIntro) {
      setShowLoadingScreen(true);
      setHeroReady(false);
    } else {
      setShowLoadingScreen(false);
      setHeroReady(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem("argus_intro_seen", "true");
    setShowLoadingScreen(false);
    setHeroReady(true);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ─── SCROLL PHASE 1: Hero container opens & merges into full screen (0.00 -> 0.45) ───
  const borderRadius = useTransform(scrollYProgress, [0, 0.45], [32, 0]);
  const maxWidth = useTransform(scrollYProgress, [0, 0.45], ["1540px", "100%"]);
  const maxHeight = useTransform(scrollYProgress, [0, 0.45], ["900px", "100vh"]);
  const containerPadding = useTransform(scrollYProgress, [0, 0.45], ["24px", "0px"]);
  const borderOpacity = useTransform(scrollYProgress, [0, 0.38], [0.08, 0]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.45], [0.95, 0]);

  const stickyBg = useTransform(scrollYProgress, [0, 0.40], ["#050208", "#000000"]);
  const cardBg = useTransform(scrollYProgress, [0, 0.40], ["#000000", "#000000"]);
  const ambientOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // ─── SCROLL PHASE 2: MULTI-LAYER PARALLAX (0.50 -> 1.00) ───
  // 1. Slowest: Hero BG WaveGlow shader drifts subtly upwards (-12vh)
  const heroBgY = useTransform(scrollYProgress, [0.50, 1.00], ["0vh", "-12vh"]);

  // 2. Slow: Hero Contents (Logo, Launch Button, Left text, Right pitch, Scroll Cue) drift upwards (-24vh)
  const heroContentY = useTransform(scrollYProgress, [0.50, 1.00], ["0vh", "-24vh"]);

  // 3. Fast: New incoming section rises swiftly to top (100vh -> 0vh) where it settles permanently at 1.00
  const nextSectionY = useTransform(scrollYProgress, [0.50, 1.00], ["100vh", "0vh"]);
  const nextSectionRadius = useTransform(scrollYProgress, [0.50, 0.95], ["48px 48px 0px 0px", "0px 0px 0px 0px"]);

  // Lock scroll when the second section settles
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((v) => {
      // If we've reached the settled state and the question is still active, lock the scroll
      if (v >= 0.99 && showQuestion) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    });
    return () => {
      unsubscribe();
      document.body.style.overflow = "unset";
    };
  }, [scrollYProgress, showQuestion]);

  return (
    <>
      {/* Laser Container Formation + ThreeUI Intro Preloader */}
      {showLoadingScreen && (
        <LoadingScreen
          duration={4400}
          onComplete={handleLoadingComplete}
        />
      )}

      <div className={styles.scrollWrapper} ref={containerRef}>
        {/* Interactive Visual Layout Positioner & Grid Overlay */}
        <DevGrid 
          headText={headText} setHeadText={setHeadText}
          headFontSize={headFontSize} setHeadFontSize={setHeadFontSize}
          headLineHeight={headLineHeight} setHeadLineHeight={setHeadLineHeight}
        />

        {/* Sticky viewport frame that holds the morphing hero */}
        <motion.div
          className={styles.stickyContainer}
          style={{
            padding: containerPadding,
            backgroundColor: stickyBg,
          }}
        >
          {/* Animated Hero Card that smoothly expands to full screen on scroll */}
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
                (v) => `rgba(255, 255, 255, ${v})`
              ),
              boxShadow: useTransform(
                shadowOpacity,
                (v) => `0 40px 120px -20px rgba(0, 0, 0, ${v})`
              ),
            }}
          >
            {/* 1. SLOWEST LAYER: Hero BG WaveGlow shader with subtle -12vh parallax */}
            <motion.div
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                inset: 0,
                y: heroBgY,
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={heroReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <WaveGlow text="ARGUS" />
            </motion.div>

            {/* Ambient atmospheric edge glow */}
            <motion.div
              className={styles.ambientEdgeGlow}
              style={{ opacity: ambientOpacity, y: heroBgY }}
              aria-hidden="true"
            />

            {/* 2. SLOW LAYER: Hero Contents (Logo, Launch Button, Left text, Right pitch, Scroll cue) with -24vh parallax */}
            <motion.div
              className={styles.heroMovingLayer}
              style={{
                y: heroContentY,
              }}
            >
              {/* Header Elements: Logo left, Launch right */}
              <motion.div
                className={styles.headerLayout}
                initial={{ opacity: 0, y: -24 }}
                animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
                transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.logoSlot}>
                  <a href="#" className={styles.logo} aria-label="Argus Home">
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

                <div className={styles.centerSlotSpacer} aria-hidden="true" />

                <div className={styles.ctaSlot}>
                  <div className={styles.buttonWrapper}>
                    <LiquidMetalButton label="Launch" />
                  </div>
                </div>
              </motion.div>

              {/* Locked text elements inside content area */}
              <div className={styles.content}>
                {/* Left Content */}
                <motion.div
                  className={styles.leftContent}
                  initial={{ opacity: 0, x: -28, filter: "blur(8px)" }}
                  animate={heroReady ? { opacity: 1, x: 0, filter: "blur(0px)" } : { opacity: 0, x: -28, filter: "blur(8px)" }}
                  transition={{ duration: 0.95, delay: 0.30, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className={styles.statusTitle}>Indian Industrial Intelligence</p>
                  <p className={styles.subtext}>Making Workspace Safe</p>
                </motion.div>

                {/* Right Pitch Heading */}
                <motion.div
                  className={styles.rightContent}
                  initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
                  animate={heroReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 28, filter: "blur(10px)" }}
                  transition={{ duration: 1.05, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1 className={styles.pitch}>
                    The hundred-eyed watchman for industrial safety &amp; operational resilience.
                  </h1>
                </motion.div>

                {/* Scroll Cue */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={heroReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.85, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ScrollCue />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* ─── 3. FAST LAYER: Blank black section with massive bold white text (z-index: 30) ─── */}
          <motion.div
            className={styles.nextBlankSection}
            style={{
              y: nextSectionY,
              borderRadius: nextSectionRadius,
            }}
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
                      gap: "20px"
                    }}
                  >
                    {/* Massive 3-Line Bold White Heading */}
                    <div className={styles.bigHeadingWrap}>
                      <h2 
                        className={styles.bigHeroHeading}
                        style={{
                          fontSize: `${headFontSize}px`,
                          lineHeight: headLineHeight
                        }}
                      >
                        {headText.split("\n").map((line, idx) => (
                          <span key={idx}>{line}</span>
                        ))}
                      </h2>
                    </div>

                    {/* Subtext: "click to know" with 3D character flipping hover */}
                    <div className={styles.clickToKnowWrap}>
                      <ClickToKnow onClick={() => setShowQuestion(false)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* 4. ONLY NAVBAR: Fixed on absolute top-most foreground (z-index: 100) */}
          <motion.div
            className={styles.standaloneNavbarWrap}
            initial={{ opacity: 0, y: -24 }}
            animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <Nav />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
