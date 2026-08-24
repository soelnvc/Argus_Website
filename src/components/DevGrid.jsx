"use client";
import React, { useState, useEffect } from "react";
import styles from "./DevGrid.module.css";

export default function DevGrid() {
  const [gridSize, setGridSize] = useState(50);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Mouse coordinate tracker
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, visible: false });
  const [snapPos, setSnapPos] = useState({ x: 0, y: 0, pctX: "0.0", pctY: "0.0" });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!gridEnabled) return;
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
  }, [gridEnabled, gridSize]);

  // Keyboard shortcut [G] for grid
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
        setGridEnabled((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* 1. Graph Paper Boxes Grid Layer */}
      {gridEnabled && (
        <div
          className={styles.graphPaperOverlay}
          style={{
            "--grid-size": `${gridSize}px`,
            "--sub-size": `${gridSize / 5}px`,
          }}
          aria-hidden="true"
        >
          <div className={styles.subGrid} />
          <div className={styles.mainGrid} />

          {/* Coordinate Crosshair and Snapped Intersection Marker */}
          {mousePos.visible && (
            <>
              <div
                className={styles.crosshairV}
                style={{ transform: `translateX(${snapPos.x}px)` }}
              />
              <div
                className={styles.crosshairH}
                style={{ transform: `translateY(${snapPos.y}px)` }}
              />

              <div
                className={styles.snapIntersection}
                style={{
                  transform: `translate(${snapPos.x}px, ${snapPos.y}px)`,
                }}
              >
                <span className={styles.snapRing} />
                <span className={styles.snapDot} />
              </div>

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
              </div>
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
            title="Open Graph Grid Controls"
          >
            ▦ <span className={styles.activeModeText}>GRID</span>
          </button>
        ) : (
          <div className={styles.badgePanel}>
            <div className={styles.badgeHeader}>
              <div className={styles.badgeTitle}>
                <span className={styles.badgeIcon}>▦</span>
                <span>Layout Positioner</span>
              </div>
              <button
                className={styles.minimizeBtn}
                onClick={() => setCollapsed(true)}
                title="Minimize Panel"
              >
                ✕
              </button>
            </div>

            {/* Current Element Coordinates Locked Readout */}
            <div className={styles.liveCoordBox}>
              <div className={styles.liveRow}>
                <span className={styles.liveLabel}>Left Text:</span>
                <span className={styles.lockedVal}>X: 84px, Y: 262px 🔒</span>
              </div>
              <div className={styles.liveRow}>
                <span className={styles.liveLabel}>Right Heading:</span>
                <span className={styles.lockedVal}>X: 826px, Y: 44px 🔒</span>
              </div>
              <div className={styles.liveRow}>
                <span className={styles.liveLabel}>Scroll Cue:</span>
                <span className={styles.lockedVal}>X: 1129px, Y: 269px 🔒</span>
              </div>
            </div>

            {/* Grid Size & Toggle Controls */}
            <div className={styles.controlsSection}>
              <div className={styles.controlLabel}>
                <span>Graph Paper</span>
                <span className={styles.keyHint}>[G]</span>
              </div>
              <div className={styles.btnRow}>
                <button
                  className={`${styles.modeBtn} ${gridEnabled && gridSize === 25 ? styles.activeBtn : ""}`}
                  onClick={() => {
                    setGridSize(25);
                    setGridEnabled(true);
                  }}
                >
                  25px
                </button>
                <button
                  className={`${styles.modeBtn} ${gridEnabled && gridSize === 50 ? styles.activeBtn : ""}`}
                  onClick={() => {
                    setGridSize(50);
                    setGridEnabled(true);
                  }}
                >
                  50px
                </button>
                <button
                  className={`${styles.modeBtn} ${gridEnabled && gridSize === 100 ? styles.activeBtn : ""}`}
                  onClick={() => {
                    setGridSize(100);
                    setGridEnabled(true);
                  }}
                >
                  100px
                </button>
                <button
                  className={`${styles.modeBtn} ${!gridEnabled ? styles.offBtn : ""}`}
                  onClick={() => setGridEnabled(false)}
                >
                  Off
                </button>
              </div>
            </div>

            <div className={styles.badgeFooter}>
              <span>All 3 elements permanently locked in place. Press [G] to toggle graph paper.</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
