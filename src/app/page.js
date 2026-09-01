"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Nav from "@/components/Nav";
import MobileBottomNav from "@/components/MobileBottomNav";
import LiquidMetalButton from "@/components/LiquidMetalButton";
import RocketLaunchButton from "@/components/RocketLaunchButton";
import WaveGlow from "@/components/WaveGlow";
import ScrollCue from "@/components/ScrollCue";
import LoadingScreen from "@/components/LoadingScreen";
import CCTVFrame from "@/components/CCTVFrame";
import ScrollToKnow from "@/components/ScrollToKnow";
import HowArgusSolvesIt from "@/components/HowArgusSolvesIt";
import WhatArgusDetects from "@/components/WhatArgusDetects";
import ResponsibleSurveillance from "@/components/ResponsibleSurveillance";
import ChooseYourPace from "@/components/ChooseYourPace";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

const SLIDES_DATA = [
  {
    eyebrow: "01 — FALLS",
    badge: "13,949 total casualties",
    bigStat: "2,101",
    title: "fatal injuries caused by persons falling in India.",
    stat: "DGFASLI's 2024 data records 2,101 fatal and 11,848 non-fatal injuries caused by persons falling.",
    image: "/images/fall.png",
    camLabel: "CAM-01 [FALL HAZARD]",
  },
  {
    eyebrow: "02 — MACHINERY",
    badge: "10,617 total casualties",
    bigStat: "1,231",
    title: "fatal injuries involving powered machinery in India.",
    stat: "DGFASLI's 2024 data records 1,231 fatal and 9,386 non-fatal injuries involving machinery moved by mechanical power.",
    image: "/images/machine.png",
    camLabel: "CAM-02 [MACHINERY]",
  },
  {
    eyebrow: "03 — INDUSTRIAL FIRES",
    badge: "5,000+ burn casualties",
    bigStat: "₹15,000 Cr+",
    title: "economic toll inflicted each year across Indian factories.",
    stat: "Chemical units, textile mills, and factories bear direct property losses topping ₹2,500 crore, with electrical short circuits driving over 70% of all workplace fire incidents.",
    image: "/cctv_fire.jpg",
    camLabel: "CAM-03 [FIRE HAZARD]",
  },
];

function JourneySlide({ index, slide, cameraZ }) {
  // Slide 0 starts at 1500z due to overlap. Slides 1 & 2 use original targetZ to preserve the cinematic end pause.
  const targetZ = index === 0 ? 1500 : index === 1 ? 3400 : 5200;
  const zDepth = -targetZ;
  const side = index % 2 === 0 ? "left" : "right";

  // Fades in entirely while hidden behind the curtain, waiting to be revealed
  const opacity = useTransform(
    cameraZ,
    index === 0
      ? [0, 400, targetZ + 300, targetZ + 900]
      : [targetZ - 1300, targetZ - 400, targetZ + 300, targetZ + 900],
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
      <CCTVFrame
        eyebrow={slide.eyebrow}
        badge={slide.badge}
        bigStat={slide.bigStat}
        title={slide.title}
        stat={slide.stat}
        image={slide.image}
        camLabel={slide.camLabel}
        side={side}
      />
    </motion.div>
  );
}

function MobileJourneySection() {
  const mobileRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: mobileRef,
    offset: ["start start", "end end"],
  });

  // Phase 1: 3 cards fade in (0.0 to 0.2), stay (0.2 to 0.65), fade out (0.65 to 0.82)
  const cardsOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.22, 0.65, 0.82],
    [0, 1, 1, 0],
  );
  const cardsY = useTransform(
    scrollYProgress,
    [0.0, 0.22, 0.65, 0.82],
    [40, 0, 0, -30],
  );
  const cardsScale = useTransform(
    scrollYProgress,
    [0.0, 0.22, 0.65, 0.82],
    [0.94, 1, 1, 0.96],
  );
  const cardsPointer = useTransform(scrollYProgress, (v) =>
    v >= 0.15 && v <= 0.75 ? "auto" : "none",
  );

  // Phase 2: "How we solve this problem" fades in (0.76 to 0.94) and holds
  const endOpacity = useTransform(scrollYProgress, [0.76, 0.92], [0, 1]);
  const endY = useTransform(scrollYProgress, [0.76, 0.92], [40, 0]);
  const endScale = useTransform(scrollYProgress, [0.76, 0.92], [0.92, 1]);
  const endPointer = useTransform(scrollYProgress, (v) =>
    v >= 0.8 ? "auto" : "none",
  );

  return (
    <div className={styles.mobileJourneyTrack} ref={mobileRef}>
      <div className={styles.mobileJourneySticky}>
        {/* Step 2: Fade in the 3 Cards 2-halves layout all at once */}
        <motion.div
          className={styles.mobileCardsStage}
          style={{
            opacity: cardsOpacity,
            y: cardsY,
            scale: cardsScale,
            pointerEvents: cardsPointer,
          }}
        >
          <div className={styles.mobileCardsList}>
            {SLIDES_DATA.map((slide, i) => {
              const side = i % 2 === 0 ? "left" : "right";
              return (
                <div key={i} className={styles.mobileCardItem}>
                  <CCTVFrame
                    eyebrow={slide.eyebrow}
                    badge={slide.badge}
                    bigStat={slide.bigStat}
                    title={slide.title}
                    stat={slide.stat}
                    image={slide.image}
                    camLabel={slide.camLabel}
                    side={side}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Step 3: Fade in "How we solve this problem" */}
        <motion.div
          className={styles.mobileJourneyEndStage}
          style={{
            opacity: endOpacity,
            y: endY,
            scale: endScale,
            pointerEvents: endPointer,
          }}
        >
          <div className={styles.bigHeadingWrap}>
            <h2 className={styles.bigEndHeading}>
              <span>How we solve</span>
              <span>this problem</span>
            </h2>
          </div>
          <div className={styles.scrollToKnowWrap}>
            <ScrollToKnow text="scroll to know" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function JourneyContainer({ journeyRef }) {
  // --- 3D JOURNEY SCROLL LOGIC (DESKTOP) ---
  const { scrollYProgress: journeyProgressRaw } = useScroll({
    target: journeyRef,
    offset: ["start start", "end end"],
  });
  const journeyProgress = useTransform(journeyProgressRaw, (v) =>
    Math.min(Math.max(v, 0), 1),
  );

  // Fly through all 3 slides in the first 90% of scroll, then hold in deep black for the solution reveal
  const cameraZ = useTransform(journeyProgress, [0, 0.9, 1.0], [0, 6800, 7400]);

  // Camera snakes left and right smoothly like a wave to aim at the CCTV viewfinders
  const cameraX = useTransform(
    journeyProgress,
    [
      0, 0.10, 0.20, 0.26, 0.325, 0.39, 0.45, 0.51, 0.57, 0.63, 0.69, 0.80, 0.90, 0.95, 1.0,
    ],
    [
      "0vw",
      "8.5vw",
      "12vw",
      "8.5vw",
      "0vw",
      "-8.5vw",
      "-12vw",
      "-8.5vw",
      "0vw",
      "8.5vw",
      "12vw",
      "12vw",
      "0vw",
      "0vw",
      "0vw",
    ],
  );

  // Smooth entry animation for "How we solve this problem" & "scroll to know"
  const endSectionOpacity = useTransform(journeyProgress, [0.92, 0.98], [0, 1]);
  const titleY = useTransform(journeyProgress, [0.92, 0.98], [48, 0]);
  const titleScale = useTransform(journeyProgress, [0.92, 0.98], [0.93, 1]);

  const cueOpacity = useTransform(journeyProgress, [0.95, 1.0], [0, 1]);
  const cueY = useTransform(journeyProgress, [0.95, 1.0], [24, 0]);
  const cueScale = useTransform(journeyProgress, [0.95, 1.0], [0.9, 1]);
  const isPointerActive = useTransform(journeyProgress, (v) =>
    v >= 0.94 ? "auto" : "none",
  );

  return (
    <>
      {/* DESKTOP 3D JOURNEY (Visible on screens > 768px) */}
      <div className={styles.desktopJourneyWrap}>
        <div className={styles.journeySection} ref={journeyRef} id="journey">
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
      </div>

      {/* MOBILE NATURAL FLOWING SECTION (Visible on screens <= 768px) */}
      <div className={styles.mobileJourneyWrap}>
        <MobileJourneySection />
      </div>
    </>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const journeyRef = useRef(null);

  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [heroReady, setHeroReady] = useState(false);


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

  // Restored smooth, slow, and cinematic hero expansion (using scale for GPU acceleration to fix reverse scroll glitch)
  const borderRadius = useTransform(clampedHero, [0, 0.3], [32, 0]);
  const heroCardScale = useTransform(clampedHero, [0, 0.3], [0.92, 1]);
  const borderOpacity = useTransform(clampedHero, [0, 0.25], [0.08, 0]);
  const shadowOpacity = useTransform(clampedHero, [0, 0.3], [0.95, 0]);
  const stickyBg = useTransform(clampedHero, [0, 0.3], ["#050208", "#000000"]);
  const cardBg = useTransform(clampedHero, [0, 0.3], ["#000000", "#000000"]);
  const ambientOpacity = useTransform(clampedHero, [0, 0.25], [1, 0]);

  // Restored majestic, smooth entrance of Why do we need Argus
  const heroBgY = useTransform(clampedHero, [0.3, 0.65], ["0vh", "-12vh"]);
  const heroContentY = useTransform(clampedHero, [0.3, 0.65], ["0vh", "-24vh"]);
  const nextSectionY = useTransform(clampedHero, [0.3, 0.65], ["100vh", "0vh"]);
  const nextSectionRadius = useTransform(
    clampedHero,
    [0.3, 0.6],
    ["48px 48px 0px 0px", "0px 0px 0px 0px"],
  );

  // Fade out the entire black curtain to seamlessly reveal the 3D slides underneath
  const nextSectionOpacity = useTransform(clampedHero, [0.85, 1.0], [1, 0]);

  // Continuous fluid movement to eliminate "pause" feel
  const questionOpacity = useTransform(clampedHero, [0.75, 0.98], [1, 0]);
  const questionScale = useTransform(clampedHero, [0.65, 0.98], [1, 1.1]);
  const questionY = useTransform(clampedHero, [0.65, 0.98], ["0vh", "-15vh"]);
  const isQuestionPointerActive = useTransform(clampedHero, (v) =>
    v > 0.95 ? "none" : "auto",
  );

  const handleScrollToJourney = () => {
    if (journeyRef.current) {
      if (window.__lenis) {
        window.__lenis.scrollTo(journeyRef.current, {
          duration: 1.8,
          offset: 0,
        });
      } else {
        journeyRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {showLoadingScreen && <LoadingScreen duration={2000} />}


      {/* PERMANENT FIXED NAVBAR DOCK (Desktop: Top dock, Mobile: Bottom stretching pill nav) */}
      <motion.div
        className={styles.fixedGlobalNavbarWrap}
        initial={{ opacity: 0, y: -24 }}
        animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
        transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <Nav />
      </motion.div>

      {/* MOBILE BOTTOM NAVBAR ONLY (Controlled entirely via CSS media queries) */}
      <MobileBottomNav />

      {/* --- HERO SECTION (250vh) --- */}
      <div className={styles.scrollWrapper} ref={heroRef}>
        <motion.div
          className={styles.stickyContainer}
          style={{ 
            backgroundColor: stickyBg,
            opacity: nextSectionOpacity
          }}
        >
          <motion.div
            className={styles.heroCardMotion}
            style={{
              borderRadius,
              scale: heroCardScale,
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
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        fill="currentColor"
                        stroke="none"
                      />
                      <path d="M2 12c3.5-6 16.5-6 20 0-3.5 6-16.5 6-20 0z" />
                    </svg>
                    <span className={styles.logoText}>argus</span>
                  </a>
                </div>
                <div className={styles.centerSlotSpacer} />
                <div className={styles.ctaSlot}>
                  <div className={styles.desktopLaunchWrapper}>
                    <LiquidMetalButton label="Launch" />
                  </div>
                  <div className={styles.mobileLaunchWrapper}>
                    <RocketLaunchButton label="Launch" />
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
            id="why-need-argus"
            className={styles.nextBlankSection}
            style={{ 
              y: nextSectionY, 
              borderRadius: nextSectionRadius 
            }}
          >
            <div className={styles.nextSectionStage}>
              <motion.div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                  opacity: questionOpacity,
                  scale: questionScale,
                  y: questionY,
                  pointerEvents: isQuestionPointerActive,
                }}
              >
                <div className={styles.bigHeadingWrap}>
                  <h2 className={styles.bigHeroHeading}>
                    <span>Why do we</span>
                    <span>need Argus</span>
                  </h2>
                </div>
                <div className={styles.clickToKnowWrap}>
                  <ScrollToKnow
                    text="scroll to know"
                    onClick={handleScrollToJourney}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* --- 3D JOURNEY, HOW ARGUS SOLVES IT, WHAT ARGUS DETECTS, RESPONSIBLE SURVEILLANCE, & CHOOSE YOUR PACE --- */}
      <JourneyContainer journeyRef={journeyRef} />
      <HowArgusSolvesIt />
      <WhatArgusDetects />
      <ResponsibleSurveillance />
      <ChooseYourPace />
      <FAQ />
      <Footer />
    </>
  );
}
