"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "./NextBlackSection.module.css";

export default function NextBlackSection() {
  return (
    <section className={styles.nextBlackSection}>
      <div className={styles.stageContainer}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.eyebrowTag}>04 — INDUSTRIAL RESILIENCE</div>
          <h2 className={styles.mainHeading}>
            Zero latency.
            <br />
            Absolute compliance.
          </h2>
          <p className={styles.subHeading}>
            Engineered for mission-critical industrial manufacturing, high-risk
            assembly plants, and autonomous facilities.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
