import React, { useState, useEffect } from 'react';
import styles from './CCTVFrame.module.css';

export default function CCTVFrame({ title, stat, side = 'left', active = false }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${h}:${m}:${s}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${styles.cctvContainer} ${side === 'left' ? styles.alignLeft : styles.alignRight}`}>
      {/* CCTV Viewfinder */}
      <div className={styles.viewfinder}>
        {/* The Fire Video / Image Background */}
        <div 
          className={styles.cameraFeed} 
          style={{ backgroundImage: 'url(/cctv_fire.jpg)' }} 
        />
        
        {/* Scanlines / CRT Overlay */}
        <div className={styles.crtOverlay} />

        {/* Red Corner Brackets */}
        <div className={`${styles.bracket} ${styles.topLeft}`} />
        <div className={`${styles.bracket} ${styles.topRight}`} />
        <div className={`${styles.bracket} ${styles.bottomLeft}`} />
        <div className={`${styles.bracket} ${styles.bottomRight}`} />

        {/* Timestamp */}
        <div className={styles.timestamp}>{timeStr}</div>
      </div>

      {/* Text / Data */}
      <div className={styles.statsPanel}>
        <h3 className={styles.statsTitle}>{title}</h3>
        <p className={styles.statsData}>{stat}</p>
      </div>
    </div>
  );
}
