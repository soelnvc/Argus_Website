"use client";
import React from "react";
import { motion } from "framer-motion";
import SocialOrbs from "./SocialOrbs";
import styles from "./Footer.module.css";

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

      {/* ─── GIANT BRAND WATERMARK ─── */}
      <div className={styles.brandWatermark}>
        <p className={styles.brandText}>ARGUS</p>
      </div>
    </footer>
  );
}
