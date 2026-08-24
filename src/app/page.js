"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Nav from "@/components/Nav";
import LiquidMetalButton from "@/components/LiquidMetalButton";
import WaveGlow from "@/components/WaveGlow";
import ScrollCue from "@/components/ScrollCue";
import DevGrid from "@/components/DevGrid";
import LoadingScreen from "@/components/LoadingScreen";
import styles from "./page.module.css";

export default function Home() {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // Check sessionStorage: only triggers on first land / opening in new session.
    // Page reloads and navigation inside the session will NOT trigger it again.
    // Closing the browser tab/window and reopening clears sessionStorage and triggers it fresh.
    const hasSeenIntro = sessionStorage.getItem("argus_intro_seen");
    if (!hasSeenIntro) {
      setIsLoading(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem("argus_intro_seen", "true");
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll transformation: container merges into pure black full screen
  const borderRadius = useTransform(scrollYProgress, [0, 0.75], [32, 0]);
  const maxWidth = useTransform(scrollYProgress, [0, 0.75], ["1540px", "100vw"]);
  const maxHeight = useTransform(scrollYProgress, [0, 0.75], ["900px", "100vh"]);
  const containerPadding = useTransform(scrollYProgress, [0, 0.75], ["24px", "0px"]);
  const borderOpacity = useTransform(scrollYProgress, [0, 0.6], [0.08, 0]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.75], [0.95, 0]);

  // Transition charcoal/ambient background to pure OLED black (#000000)
  const stickyBg = useTransform(scrollYProgress, [0, 0.6], ["#050208", "#000000"]);
  const cardBg = useTransform(scrollYProgress, [0, 0.6], ["#000000", "#000000"]);
  const ambientOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <>
      {/* Laser Container Formation + ThreeUI Intro Preloader with Black Pupil Camera Rush */}
      {hasMounted && isLoading && (
        <LoadingScreen
          duration={4400}
          onComplete={handleLoadingComplete}
        />
      )}

      <div className={styles.scrollWrapper} ref={containerRef}>
        {/* Interactive Visual Layout Positioner & Grid Overlay */}
        <DevGrid />

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
            {/* Dynamic undulating wave shader with integrated text masking & pure black top */}
            <motion.div
              style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
              initial={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.96 : 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <WaveGlow text="ARGUS" />
            </motion.div>

            {/* Ambient atmospheric edge glow */}
            <motion.div
              className={styles.ambientEdgeGlow}
              style={{ opacity: ambientOpacity }}
              aria-hidden="true"
            />

            {/* Header Bar - Logo, Navbar & Launch Button with entrance reveal */}
            <motion.header
              className={styles.header}
              initial={{ opacity: isLoading ? 0 : 1, y: isLoading ? -20 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: isLoading ? 0.15 : 0, ease: [0.16, 1, 0.3, 1] }}
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

              {/* Centered Floating Dock Navbar */}
              <div className={styles.navSlot}>
                <Nav />
              </div>

              {/* Launch Button */}
              <div className={styles.ctaSlot}>
                <div className={styles.buttonWrapper}>
                  <LiquidMetalButton label="Launch" />
                </div>
              </div>
            </motion.header>

            {/* Center/Lower Content Container with staggered entrance animations */}
            <div className={styles.content}>
              {/* Left Content Entrance */}
              <motion.div
                className={styles.leftContent}
                initial={{ opacity: isLoading ? 0 : 1, x: isLoading ? -24 : 0, filter: isLoading ? "blur(6px)" : "blur(0px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: isLoading ? 0.35 : 0, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className={styles.statusTitle}>Indian Industrial Intelligence</p>
                <p className={styles.subtext}>Making Workspace Safe</p>
              </motion.div>

              {/* Right Pitch Heading Entrance */}
              <motion.div
                className={styles.rightContent}
                initial={{ opacity: isLoading ? 0 : 1, y: isLoading ? 24 : 0, filter: isLoading ? "blur(8px)" : "blur(0px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.0, delay: isLoading ? 0.45 : 0, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className={styles.pitch}>
                  The hundred-eyed watchman for industrial safety &amp; operational resilience.
                </h1>
              </motion.div>

              {/* Scroll Cue Entrance */}
              <motion.div
                initial={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.9 : 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: isLoading ? 0.65 : 0, ease: [0.16, 1, 0.3, 1] }}
              >
                <ScrollCue />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
