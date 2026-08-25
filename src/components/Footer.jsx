"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./Footer.module.css";

export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
      setTime(formatted);
    }
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        {/* ─── TOP ROW: Tagline + Nav Columns ─── */}
        <motion.div
          className={styles.topRow}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.leftCol}>
            <p className={styles.metaLine}>
              <span className={styles.metaDot} />
              {time} India, IST
            </p>
            <h3 className={styles.tagline}>
              Intelligent surveillance for those
              <br />
              who build a safer tomorrow.
            </h3>
          </div>

          <div className={styles.navColumns}>
            <div className={styles.navColumn}>
              <p className={styles.navColumnTitle}>Explore</p>
              <a className={styles.navLink} href="#">
                Home
              </a>
              <a className={styles.navLink} href="#">
                Product
              </a>
              <a className={styles.navLink} href="#">
                How it works
              </a>
            </div>
            <div className={styles.navColumn}>
              <p className={styles.navColumnTitle}>Socials</p>
              <a className={styles.navLink} href="#">
                LinkedIn
              </a>
              <a className={styles.navLink} href="#">
                Twitter / X
              </a>
              <a className={styles.navLink} href="#">
                GitHub
              </a>
            </div>
          </div>
        </motion.div>

        {/* ─── GET IN TOUCH BUTTON ─── */}
        <motion.div
          className={styles.ctaRow}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <button className={styles.ctaButton}>
            <span className={styles.ctaStar}>✦</span>
            <span>Get in touch</span>
          </button>
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
