"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Nav from "@/components/Nav";
import LiquidMetalButton from "@/components/LiquidMetalButton";
import WaveGlow from "@/components/WaveGlow";
import styles from "./page.module.css";

export default function Home() {
  const containerRef = useRef(null);

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
    <div className={styles.scrollWrapper} ref={containerRef}>
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
          <WaveGlow text="ARGUS" />

          {/* Ambient atmospheric edge glow that fades out to pure black on transition */}
          <motion.div
            className={styles.ambientEdgeGlow}
            style={{ opacity: ambientOpacity }}
            aria-hidden="true"
          />

          {/* Header Bar - Logo, Navbar & Launch Button aligned on exact vertical center */}
          <header className={styles.header}>
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

            {/* Centered Floating Dock Navbar with 30% Dark Purple Accent */}
            <div className={styles.navSlot}>
              <Nav />
            </div>

            {/* Launch Button with exact same 46px height moved to right corner */}
            <div className={styles.ctaSlot}>
              <div className={styles.buttonWrapper}>
                <LiquidMetalButton label="Launch" />
              </div>
            </div>
          </header>

          {/* Center/Lower Content */}
          <div className={styles.content}>
            {/* Positioned directly above "A" on the vertical Y axis */}
            <div className={styles.leftContent}>
              <div className={styles.statusRow}>
                <span className={styles.statusDot} />
                <span className={styles.statusTitle}>Indian Industrial Intelligence</span>
              </div>
              <p className={styles.subtext}>Making Workspace Safe</p>
            </div>

            <div className={styles.rightContent}>
              <h1 className={styles.pitch}>
                The hundred-eyed watchman for industrial safety &amp; operational resilience.
              </h1>
              <div className={styles.scrollCue}>
                Scroll to expand <span>↓</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
