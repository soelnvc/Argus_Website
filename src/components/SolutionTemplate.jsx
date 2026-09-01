"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import MobileBottomNav from "@/components/MobileBottomNav";
import WaveGlow from "@/components/WaveGlow";
import ScrollCue from "@/components/ScrollCue";
import HowArgusSolvesIt from "@/components/HowArgusSolvesIt";
import ResponsibleSurveillance from "@/components/ResponsibleSurveillance";
import ChooseYourPace from "@/components/ChooseYourPace";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import styles from "./SolutionTemplate.module.css";
import CCTVFrame from "@/components/CCTVFrame";
import RocketLaunchButton from "@/components/RocketLaunchButton";

export default function SolutionTemplate({
  title,
  pitch,
  seoText,
  heroImage,
  cameraLabel,
  solutionDetails,
}) {
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <main id="top" role="main" className={styles.templateMain}>
      <Nav />
      <MobileBottomNav />

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <div className={styles.gridOverlay} />
          <WaveGlow />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroTextContent}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className={styles.heroTitle}>
                {title}
                {seoText && <span className={styles.srOnly}>{seoText}</span>}
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className={styles.heroPitch}>{pitch}</p>
            </motion.div>

            <motion.div
              className={styles.heroCTA}
              initial={{ opacity: 0, y: 30 }}
              animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hidden md:block">
                <RocketLaunchButton />
              </div>
            </motion.div>
          </div>

          <motion.div 
            className={styles.heroImageWrapper}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Reuse CCTVFrame for cinematic effect on the hero image */}
            <CCTVFrame
              eyebrow={title}
              badge="LIVE"
              bigStat="ON"
              title={solutionDetails?.shortDesc || pitch}
              stat="Monitoring Active"
              image={heroImage}
              camLabel={cameraLabel || "CAM-01 [ACTIVE]"}
              side="right"
            />
          </motion.div>
        </div>
        
        <motion.div
          className={styles.scrollCueWrapper}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={heroReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
          transition={{ duration: 0.85, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <ScrollCue />
        </motion.div>
      </section>

      {/* REUSABLE SECTIONS */}
      <HowArgusSolvesIt />
      <ResponsibleSurveillance />
      <ChooseYourPace />
      <FAQ />
      <Footer />
    </main>
  );
}
