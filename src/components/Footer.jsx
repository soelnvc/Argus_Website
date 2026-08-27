"use client";
import React from "react";
import { motion } from "framer-motion";
import { Anton } from "next/font/google";
import SocialOrbs from "./SocialOrbs";
import styles from "./Footer.module.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        {/* ─── LETS CONNECT SECTION ─── */}
        <motion.div
          className={styles.connectSection}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className={styles.connectHeading}>
            <span className={styles.greyText}>Lets </span>
            <span className={styles.whiteText}>Connect</span>
          </h2>
          <SocialOrbs />
        </motion.div>

        {/* ─── BOTTOM BAR: Copyright + Legal ─── */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            2026 ARGUS.
            <br />
            ALL RIGHTS RESERVED
          </p>
          <div className={styles.legalLinks}>
            <a className={styles.legalLink} href="#">
              TERMS
            </a>
            <a className={styles.legalLink} href="#">
              PRIVACY POLICY
            </a>
          </div>
        </div>
      </div>

      {/* ─── GIANT BRAND WATERMARK (EDGE-TO-EDGE) ─── */}
      <div className={styles.brandWatermark}>
        <svg
          viewBox="0 0 1000 270"
          className={styles.brandSvg}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="argusFooterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#07050d" />
              <stop offset="28%" stopColor="#07050d" />
              <stop offset="36%" stopColor="#2e0854" />
              <stop offset="50%" stopColor="#581c87" />
              <stop offset="66%" stopColor="#7e22ce" />
              <stop offset="82%" stopColor="#9333ea" />
              <stop offset="94%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          <text
            x="50%"
            y="94%"
            textAnchor="middle"
            className={`${anton.className} ${styles.svgText}`}
            fill="url(#argusFooterGrad)"
            textLength="100%"
            lengthAdjust="spacingAndGlyphs"
          >
            ARGUS
          </text>
        </svg>
      </div>
    </footer>
  );
}
