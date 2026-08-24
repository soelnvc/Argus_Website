"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./DevGrid.module.css";

export default function DevGrid() {
  // Modes: "50px" | "25px" | "100px" | "off"
  const [gridSize, setGridSize] = useState(50); // 50px default graph paper boxes
  const [enabled, setEnabled] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState(null);

  // Mouse & Snapping state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, visible: false });
  const [snapPos, setSnapPos] = useState({ x: 0, y: 0, pctX: "0.0", pctY: "0.0" });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!enabled) return;
      const x = e.clientX;
      const y = e.clientY;

      const snapX = Math.round(x / gridSize) * gridSize;
      const snapY = Math.round(y / gridSize) * gridSize;

      const pctX = ((x / window.innerWidth) * 100).toFixed(1);
      const pctY = ((y / window.innerHeight) * 100).toFixed(1);

      setMousePos({ x, y, visible: true });
      setSnapPos({ x: snapX, y: snapY, pctX, pctY });
    };

    const handleMouseLeave = () => {
      setMousePos((prev) => ({ ...prev, visible: false }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enabled, gridSize]);

  // Keyboard shortcut [G]
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }

      if (e.key === "g" || e.key === "G") {
        setEnabled((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const copyCoord = useCallback(
    (e) => {
      if (!enabled) return;
      // If clicking inside the dev badge, ignore
      if (e.target.closest(`.${styles.devBadge}`)) return;

      const text = `X: ${snapPos.x}px, Y: ${snapPos.y}px (${snapPos.pctX}%, ${snapPos.pctY}%)`;
      navigator.clipboard?.writeText(text);

      setToast(`Copied: ${text}`);
      setTimeout(() => setToast(null), 2400);
    },
    [enabled, snapPos]
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("click", copyCoord);
    return () => window.removeEventListener("click", copyCoord);
  }, [enabled, copyCoord]);

  return (
    <>
      {/* 1. Graph Paper Boxes Grid Layer */}
      {enabled && (
        <div
          className={styles.graphPaperOverlay}
          style={{
            "--grid-size": `${gridSize}px`,
            "--sub-size": `${gridSize / 5}px`,
          }}
          aria-hidden="true"
        >
          {/* Subtle sub-grid */}
          <div className={styles.subGrid} />
          {/* Primary square graph paper boxes */}
          <div className={styles.mainGrid} />

          {/* Coordinate Crosshair and Snapped Intersection Marker */}
          {mousePos.visible && (
            <>
              {/* Full height/width crosshair guides aligned with intersection */}
              <div
                className={styles.crosshairV}
                style={{ transform: `translateX(${snapPos.x}px)` }}
              />
              <div
                className={styles.crosshairH}
                style={{ transform: `translateY(${snapPos.y}px)` }}
              />

              {/* Glowing Snapped Intersection Point */}
              <div
                className={styles.snapIntersection}
                style={{
                  transform: `translate(${snapPos.x}px, ${snapPos.y}px)`,
                }}
              >
                <span className={styles.snapRing} />
                <span className={styles.snapDot} />
              </div>

              {/* Floating Coordinate Tag */}
              <div
                className={styles.coordTooltip}
                style={{
                  transform: `translate(${mousePos.x + 16}px, ${mousePos.y + 16}px)`,
                }}
              >
                <div className={styles.coordHeader}>
                  <span className={styles.coordDot} />
                  <span>INTERSECTION</span>
                </div>
                <div className={styles.coordValues}>
                  <div className={styles.coordCol}>
                    <span className={styles.coordLabel}>X:</span>
                    <span className={styles.coordVal}>{snapPos.x}px</span>
                  </div>
                  <div className={styles.coordCol}>
                    <span className={styles.coordLabel}>Y:</span>
                    <span className={styles.coordVal}>{snapPos.y}px</span>
                  </div>
                  <div className={styles.coordColPct}>
                    <span>({snapPos.pctX}%, {snapPos.pctY}%)</span>
                  </div>
                </div>
                <div className={styles.coordHint}>Click anywhere to copy</div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. Toast Notification on Copy */}
      {toast && (
        <div className={styles.toast}>
          <span className={styles.toastIcon}>✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* 3. Floating Dev Control Badge */}
      <div className={styles.devBadge}>
        {collapsed ? (
          <button
            className={styles.collapsedBtn}
            onClick={() => setCollapsed(false)}
            title="Open Graph Grid Controls"
          >
            ▦ Grid:{" "}
            <span className={styles.activeModeText}>
              {enabled ? `${gridSize}px` : "OFF"}
            </span>
          </button>
        ) : (
          <div className={styles.badgePanel}>
            <div className={styles.badgeHeader}>
              <div className={styles.badgeTitle}>
                <span className={styles.badgeIcon}>▦</span>
                <span>Graph Paper Grid</span>
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
                className={`${styles.modeBtn} ${enabled && gridSize === 25 ? styles.activeBtn : ""}`}
                onClick={() => {
                  setGridSize(25);
                  setEnabled(true);
                }}
              >
                25px
              </button>
              <button
                className={`${styles.modeBtn} ${enabled && gridSize === 50 ? styles.activeBtn : ""}`}
                onClick={() => {
                  setGridSize(50);
                  setEnabled(true);
                }}
              >
                50px
              </button>
              <button
                className={`${styles.modeBtn} ${enabled && gridSize === 100 ? styles.activeBtn : ""}`}
                onClick={() => {
                  setGridSize(100);
                  setEnabled(true);
                }}
              >
                100px
              </button>
              <button
                className={`${styles.modeBtn} ${!enabled ? styles.offBtn : ""}`}
                onClick={() => setEnabled(false)}
              >
                Off
              </button>
            </div>

            <div className={styles.badgeFooter}>
              <span>Hover over intersections for coordinates • Click to copy</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
