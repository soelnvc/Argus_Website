"use client";
import React, { useState, useEffect } from "react";
import styles from "./DevGrid.module.css";

export default function DevGrid({
  headText,
  setHeadText,
  headFontSize,
  setHeadFontSize,
  headLineHeight,
  setHeadLineHeight,
  // Pace Section Controls
  paceProps,
}) {
  const [gridSize, setGridSize] = useState(50);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("pace"); // "hero" | "pace"

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

      {/* ─── FLOATING DEV PANEL ─── */}
      <div className={styles.panelWrapper}>
        {collapsed ? (
          <button
            className={styles.expandBtn}
            onClick={() => setCollapsed(false)}
            title="Open Layout Positioner"
          >
            <span className={styles.expandIcon}>▦</span>
            <span>Positioner</span>
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

            {/* Tab Switcher if paceProps is provided */}
            {paceProps && (
              <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
                <button
                  style={{
                    flex: 1,
                    padding: "4px 8px",
                    fontSize: "11px",
                    borderRadius: "4px",
                    background:
                      activeTab === "hero"
                        ? "rgba(168,85,247,0.3)"
                        : "rgba(255,255,255,0.06)",
                    color:
                      activeTab === "hero"
                        ? "#ffffff"
                        : "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveTab("hero")}
                >
                  Hero Section
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "4px 8px",
                    fontSize: "11px",
                    borderRadius: "4px",
                    background:
                      activeTab === "pace"
                        ? "rgba(168,85,247,0.3)"
                        : "rgba(255,255,255,0.06)",
                    color:
                      activeTab === "pace"
                        ? "#ffffff"
                        : "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveTab("pace")}
                >
                  Pace Section
                </button>
              </div>
            )}

            {/* Current Element Coordinates Readout */}
            <div className={styles.liveCoordBox}>
              {activeTab === "hero" ? (
                <>
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
                </>
              ) : (
                paceProps && (
                  <>
                    <div className={styles.liveRow}>
                      <span className={styles.liveLabel}>Headline:</span>
                      <span className={styles.lockedVal}>
                        X: {Math.round(paceProps.headPos.x)}px, Y:{" "}
                        {Math.round(paceProps.headPos.y)}px ✋
                      </span>
                    </div>
                    <div className={styles.liveRow}>
                      <span className={styles.liveLabel}>Get in Touch:</span>
                      <span className={styles.lockedVal}>
                        X: {Math.round(paceProps.btn1Pos.x)}px, Y:{" "}
                        {Math.round(paceProps.btn1Pos.y)}px ✋
                      </span>
                    </div>
                    <div className={styles.liveRow}>
                      <span className={styles.liveLabel}>Launch:</span>
                      <span className={styles.lockedVal}>
                        X: {Math.round(paceProps.btn2Pos.x)}px, Y:{" "}
                        {Math.round(paceProps.btn2Pos.y)}px ✋
                      </span>
                    </div>
                  </>
                )
              )}
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

            {/* Hero Text Controls */}
            {activeTab === "hero" && setHeadText && (
              <div className={styles.controlsSection} style={{ marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                <div className={styles.controlLabel}>
                  <span>Hero Text Editor</span>
                </div>
                <textarea 
                  value={headText} 
                  onChange={e => setHeadText(e.target.value)} 
                  style={{ 
                    width: '100%', height: '52px', background: 'rgba(0,0,0,0.5)', 
                    color: 'white', border: '1px solid rgba(192, 132, 252, 0.4)', 
                    borderRadius: '6px', padding: '6px', fontSize: '11px',
                    fontFamily: 'inherit', resize: 'none', outline: 'none'
                  }}
                  title="Use Enter for new lines"
                />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Size ({headFontSize}px)</span>
                  <input type="range" min="40" max="250" value={headFontSize} onChange={e => setHeadFontSize(Number(e.target.value))} style={{ width: '120px', cursor: 'pointer' }}/>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Line Height ({headLineHeight})</span>
                  <input type="range" min="0.5" max="2.0" step="0.01" value={headLineHeight} onChange={e => setHeadLineHeight(Number(e.target.value))} style={{ width: '120px', cursor: 'pointer' }}/>
                </div>
              </div>
            )}

            {/* Detects Section Text Controls */}
            {activeTab === "detects" && detectsProps && (
              <div className={styles.controlsSection} style={{ marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                <div className={styles.controlLabel}>
                  <span>Headline Size ({detectsProps.headSize}px)</span>
                </div>
                <input 
                  type="range" min="30" max="140" 
                  value={detectsProps.headSize} 
                  onChange={e => detectsProps.setHeadSize(Number(e.target.value))} 
                  style={{ width: '100%', cursor: 'pointer', marginBottom: '8px' }}
                />

                <div className={styles.controlLabel}>
                  <span>Sub Left Size ({detectsProps.subLeftSize}px)</span>
                </div>
                <input 
                  type="range" min="12" max="32" 
                  value={detectsProps.subLeftSize} 
                  onChange={e => detectsProps.setSubLeftSize(Number(e.target.value))} 
                  style={{ width: '100%', cursor: 'pointer', marginBottom: '8px' }}
                />

                <div className={styles.controlLabel}>
                  <span>Sub Right Size ({detectsProps.subRightSize}px)</span>
                </div>
                <input 
                  type="range" min="12" max="32" 
                  value={detectsProps.subRightSize} 
                  onChange={e => detectsProps.setSubRightSize(Number(e.target.value))} 
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
            )}

            <div className={styles.badgeFooter}>
              <span>Drag & drop elements on screen freely. Press [G] to toggle graph paper.</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
