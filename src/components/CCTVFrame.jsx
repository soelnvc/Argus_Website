"use client";
import React, { useState, useEffect } from "react";
import styles from "./CCTVFrame.module.css";

export default function CCTVFrame({
  eyebrow = "Did you know?",
  title,
  stat,
  image = "/cctv_fire.jpg",
  camLabel = "CAM-01",
  side = "left",
}) {
  const [timeStr, setTimeStr] = useState("12:00:00");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTimeStr(`${h}:${m}:${s}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`${styles.cctvContainer} ${side === "left" ? styles.alignLeft : styles.alignRight}`}
    >
      {/* CCTV Viewfinder */}
      <div className={styles.viewfinder}>
        {/* Dynamic Background Image */}
        <div
          className={styles.cameraFeed}
          style={{ backgroundImage: `url(${image})` }}
        />

        {/* Scanlines / CRT Overlay */}
        <div className={styles.crtOverlay} />

        {/* HUD Top Bar */}
        <div className={styles.hudTop}>
          <span className={styles.camLabel}>{camLabel}</span>
          <span className={styles.recBadge}>
            <span className={styles.recDot} /> REC
          </span>
        </div>

        {/* Red Corner Brackets */}
        <div className={`${styles.bracket} ${styles.topLeft}`} />
        <div className={`${styles.bracket} ${styles.topRight}`} />
        <div className={`${styles.bracket} ${styles.bottomLeft}`} />
        <div className={`${styles.bracket} ${styles.bottomRight}`} />

        {/* Timestamp */}
        <div className={styles.timestamp}>{timeStr}</div>
      </div>

      {/* Stats / Story Panel */}
      <div className={styles.statsPanel}>
        {eyebrow && <span className={styles.eyebrowTag}>{eyebrow}</span>}
        <h3 className={styles.statsTitle}>{title}</h3>
        <p className={styles.statsData}>{stat}</p>
      </div>
    </div>
  );
}
