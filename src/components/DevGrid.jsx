"use client";
import React, { useState, useEffect } from "react";
import styles from "./DevGrid.module.css";

export default function DevGrid() {
  // Modes: "columns" | "modular" | "crosshairs" | "off"
  const [mode, setMode] = useState("columns");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input or textarea
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }

      if (e.key === "g" || e.key === "G") {
        setMode((prev) => {
          if (prev === "off") return "columns";
          if (prev === "columns") return "modular";
          if (prev === "modular") return "crosshairs";
          return "off";
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* 1. Visual Grid Overlays (Pointer events none) */}
      {mode !== "off" && (
        <div className={styles.gridOverlay} aria-hidden="true">
          {/* A. 12-Column Layout Grid */}
          {(mode === "columns" || mode === "modular") && (
            <div className={styles.columnContainer}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={styles.gridCol}>
                  <span className={styles.colLabel}>{i + 1}</span>
                </div>
              ))}
            </div>
          )}

          {/* B. Modular Horizontal Baseline Grid */}
          {mode === "modular" && <div className={styles.baselineGrid} />}

          {/* C. Center & Section Crosshair Alignment Guides */}
          {(mode === "crosshairs" || mode === "modular") && (
            <>
              {/* Vertical Center Axis */}
              <div className={styles.centerLineV} />
              {/* Horizontal Center Axis */}
              <div className={styles.centerLineH} />
              {/* Header Baseline */}
              <div className={styles.headerGuide} />
              {/* Lower Content Baseline */}
              <div className={styles.contentGuide} />
            </>
          )}
        </div>
      )}

      {/* 2. Floating Dev Control Badge */}
      <div className={styles.devBadge}>
        {collapsed ? (
          <button
            className={styles.collapsedBtn}
            onClick={() => setCollapsed(false)}
            title="Open Dev Grid Settings"
          >
            ▦ Grid: <span className={styles.activeModeText}>{mode.toUpperCase()}</span>
          </button>
        ) : (
          <div className={styles.badgePanel}>
            <div className={styles.badgeHeader}>
              <div className={styles.badgeTitle}>
                <span className={styles.badgeIcon}>▦</span>
                <span>Dev Grid</span>
                <span className={styles.keyHint}>[G]</span>
              </div>
              <button
                className={styles.minimizeBtn}
                onClick={() => setCollapsed(true)}
                title="Minimize Panel"
              >
                ✕
              </button>
            </div>

            <div className={styles.btnRow}>
              <button
                className={`${styles.modeBtn} ${mode === "columns" ? styles.activeBtn : ""}`}
                onClick={() => setMode("columns")}
              >
                12-Cols
              </button>
              <button
                className={`${styles.modeBtn} ${mode === "modular" ? styles.activeBtn : ""}`}
                onClick={() => setMode("modular")}
              >
                Modular
              </button>
              <button
                className={`${styles.modeBtn} ${mode === "crosshairs" ? styles.activeBtn : ""}`}
                onClick={() => setMode("crosshairs")}
              >
                Guides
              </button>
              <button
                className={`${styles.modeBtn} ${mode === "off" ? styles.activeBtn : ""}`}
                onClick={() => setMode("off")}
              >
                Off
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
