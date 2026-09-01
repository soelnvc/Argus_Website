"use client";
import React, { useState, useEffect } from "react";
import styles from "./CCTVFrame.module.css";

export default function CCTVFrame({
  eyebrow = "01 — FALLS",
  badge = "13,949 total casualties",
  bigStat = "2,101",
  title = "fatal injuries caused by persons falling in India.",
  stat = "DGFASLI's 2024 data records 2,101 fatal and 11,848 non-fatal injuries caused by persons falling.",
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
          role="img"
          aria-label={`CCTV camera feed showing ${title} — industrial safety monitoring visualization`}
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
        <div className={styles.headerRow}>
          {eyebrow && <span className={styles.eyebrowTag}>{eyebrow}</span>}
          {badge && <span className={styles.badgeTag}>{badge}</span>}
        </div>

        {bigStat && (
          <div className={styles.bigStatNumber}>
            {bigStat}
          </div>
        )}

        <h3 className={styles.statsTitle}>{title}</h3>
        <p className={styles.statsData}>{stat}</p>
      </div>
    </div>
  );
}
