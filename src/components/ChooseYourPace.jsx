"use client";
import React from "react";
import { motion } from "framer-motion";
import LiquidMetalButton from "@/components/LiquidMetalButton";
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

      {/* Main Content & Headline (Locked in exact screenshot placement) */}
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

        {/* CTA Buttons (Locked horizontally side by side on left) */}
        <motion.div
          className={styles.buttonGroup}
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

          <div className={`${styles.liquidBtnWrap} ${styles.launchBtnWrap}`}>
            <LiquidMetalButton
              label="Launch"
              style={{
                "--h": "64px",
                "--bw": "calc(1600 * (64px / 516))",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
