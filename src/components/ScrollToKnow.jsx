"use client";
import React, { useState } from "react";
import styles from "./ScrollToKnow.module.css";

export default function ScrollToKnow({ text = "scroll to know", onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.scrollToKnowBtn}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={text}
    >
      <div className={styles.charContainer}>
        {text.split("").map((char, index) => (
          <span
            key={index}
            className={`${styles.char} ${isHovered ? styles.flipping : ""}`}
            style={{
              "--char-index": index,
              "--total-chars": text.length,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
      <span className={`${styles.arrow} ${isHovered ? styles.arrowGlow : ""}`}>
        ↓
      </span>
    </div>
  );
}
