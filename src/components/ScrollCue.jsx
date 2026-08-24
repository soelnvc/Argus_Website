"use client";
import React, { useState } from "react";
import styles from "./ScrollCue.module.css";

export default function ScrollCue() {
  const text = "Scroll to expand";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.scrollCue}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
