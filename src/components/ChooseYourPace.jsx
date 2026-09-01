"use client";
import React from "react";
import { motion } from "framer-motion";
import LiquidMetalButton from "@/components/LiquidMetalButton";
import RocketLaunchButton from "@/components/RocketLaunchButton";
import styles from "./ChooseYourPace.module.css";

export default function ChooseYourPace() {
  return (
    <section className={styles.depthSection} id="use">
      {/* Curved Glowing Arc emerging from backside of previous white section */}
      <div className={styles.curvedGlowContainer}>
        <div className={styles.curvedGlowArc} />
        <div className={styles.curvedRimHighlight} />
      </div>
      <div className={styles.noiseOverlay} />

      {/* Main Content & Headline */}
      <div className={styles.contentContainer}>
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className={styles.mainHeadline}
        >
          Make your cameras proactive.
          <br />
          <span className={styles.mutedText}>
            Turn existing surveillance into an
            <br />
            intelligent safety system.
          </span>
        </motion.h2>

        {/* Desktop CTA Buttons (Both LiquidMetal) */}
        <motion.div
          className={styles.desktopButtonGroup}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.liquidBtnWrap}>
            <LiquidMetalButton
              label="Get in touch"
              style={{
                "--h": "64px",
                "--bw": "calc(2300 * (64px / 516))",
              }}
            />
          </div>

          <div className={styles.liquidBtnWrap}>
            <LiquidMetalButton
              label="Launch"
              style={{
                "--h": "64px",
                "--bw": "calc(1600 * (64px / 516))",
              }}
            />
          </div>
        </motion.div>

        {/* Mobile CTA Buttons (Get in Touch + Rocket Launch Button) */}
        <motion.div
          className={styles.mobileButtonGroup}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.mobileLiquidWrap}>
            <LiquidMetalButton
              label="Get in touch"
              style={{
                "--h": "56px",
                "--bw": "calc(2100 * (56px / 516))",
              }}
            />
          </div>

          <div className={styles.mobileRocketWrap}>
            <RocketLaunchButton label="Launch" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
