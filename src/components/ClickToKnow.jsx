"use client";
import React, { useState } from "react";
import styles from "./ClickToKnow.module.css";

export default function ClickToKnow({ onClick }) {
  const text = "click to know";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={styles.clickToKnowBtn}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Click to know why do we need Argus"
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
        →
      </span>
    </button>
  );
}
