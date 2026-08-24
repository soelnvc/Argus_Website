"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen({ onComplete, duration = 4400 }) {
  const canvasRef = useRef(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    const startTime = performance.now();

    // Full Screen Viewport Setup
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }
    resize();

    window.addEventListener("resize", resize);

    // Typography & Metrics
    const text = "Argus";
    const fontSize = Math.max(52, Math.min(76, Math.round(width * 0.05)));
    const fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    // Logo dimensions
    const logoSize = Math.round(fontSize * 0.88);
    const gap = 24;

    // Helper: Draw curved container path
    function createContainerPath(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    }

    // Helper: Compute point along rounded rectangle perimeter (p from 0 to 1)
    function getPointOnRoundedRect(p, x, y, w, h, r) {
      const straightW = w - 2 * r;
      const straightH = h - 2 * r;
      const arcLen = (Math.PI / 2) * r;
      const totalPerimeter = 2 * straightW + 2 * straightH + 4 * arcLen;

      let d = (Math.max(0, Math.min(p, 1))) * totalPerimeter;

      // 1. Top straight
      if (d <= straightW) {
        return { x: x + r + d, y: y };
      }
      d -= straightW;

      // 2. Top-Right Arc
      if (d <= arcLen) {
        const ang = -Math.PI / 2 + (d / arcLen) * (Math.PI / 2);
        return { x: x + w - r + Math.cos(ang) * r, y: y + r + Math.sin(ang) * r };
      }
      d -= arcLen;

      // 3. Right straight
      if (d <= straightH) {
        return { x: x + w, y: y + r + d };
      }
      d -= straightH;

      // 4. Bottom-Right Arc
      if (d <= arcLen) {
        const ang = 0 + (d / arcLen) * (Math.PI / 2);
        return { x: x + w - r + Math.cos(ang) * r, y: y + h - r + Math.sin(ang) * r };
      }
      d -= arcLen;

      // 5. Bottom straight
      if (d <= straightW) {
        return { x: x + w - r - d, y: y + h };
      }
      d -= straightW;

      // 6. Bottom-Left Arc
      if (d <= arcLen) {
        const ang = Math.PI / 2 + (d / arcLen) * (Math.PI / 2);
        return { x: x + r + Math.cos(ang) * r, y: y + h - r + Math.sin(ang) * r };
      }
      d -= arcLen;

      // 7. Left straight
      if (d <= straightH) {
        return { x: x, y: y + h - r - d };
      }
      d -= straightH;

      // 8. Top-Left Arc
      const ang = Math.PI + (d / arcLen) * (Math.PI / 2);
      return { x: x + r + Math.cos(ang) * r, y: y + r + Math.sin(ang) * r };
    }

    // Draw Eye Logo - Full 100% Solid Opacity
    function drawEyeLogo(cx, cy, size, scale, opacity, irisScale = 1, blackPupilScale = 0) {
      const s = Math.max(0, scale);
      const op = Math.max(0, Math.min(opacity, 1));

      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = `rgba(255, 255, 255, ${op})`;
      ctx.fillStyle = `rgba(255, 255, 255, ${op})`;
      // Dynamic physical stroke width that scales realistically with zoom
      ctx.lineWidth = Math.max(3.5, 4.5 * Math.min(s, 8.0));
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.scale(s, s);

      // Outer Eye contour
      ctx.beginPath();
      ctx.moveTo(-size / 2, 0);
      ctx.bezierCurveTo(-size / 4, -size * 0.45, size / 4, -size * 0.45, size / 2, 0);
      ctx.bezierCurveTo(size / 4, size * 0.45, -size / 4, size * 0.45, -size / 2, 0);
      ctx.stroke();

      // White Center Iris Ring
      const irisRadius = Math.max(0, size * 0.16 * irisScale);
      if (irisRadius > 0.1) {
        ctx.beginPath();
        ctx.arc(0, 0, irisRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Deep 100% Solid Black Pupil
      const pupilRadius = Math.max(0, irisRadius * 0.55 * blackPupilScale);
      if (pupilRadius > 0.1) {
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.arc(0, 0, pupilRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function render(now) {
      const elapsed = Math.max(0, now - startTime);
      const t = Math.max(0, Math.min(elapsed / duration, 1));

      ctx.clearRect(0, 0, width, height);

      // Container Dimensions matching Hero Card (1540x900 capped with 24px padding)
      const pad = 24;
      const cardW = Math.min(width - pad * 2, 1540);
      const cardH = Math.min(height - pad * 2, 900);
      const cardX = (width - cardW) / 2;
      const cardY = (height - cardH) / 2;
      const cardRadius = 32;

      // ─── STAGE 0: PURE HIGH-EXPOSURE WHITE LASER (0.00 -> 0.35) ───
      const laserDuration = 0.35;
      const isLaserStage = t <= laserDuration;

      if (isLaserStage) {
        const u = t / laserDuration; // 0 to 1
        const headP = 1 - Math.pow(1 - u, 3.8);
        const tailP = Math.pow(u, 1.25);

        const straightW = cardW - 2 * cardRadius;
        const straightH = cardH - 2 * cardRadius;
        const arcLen = (Math.PI / 2) * cardRadius;
        const totalPerimeter = 2 * straightW + 2 * straightH + 4 * arcLen;

        // Subtle resting path (Pure neutral 0.08)
        ctx.save();
        createContainerPath(ctx, cardX, cardY, cardW, cardH, cardRadius);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1;
        ctx.setLineDash([headP * totalPerimeter, totalPerimeter]);
        ctx.stroke();

        // Tapered Laser Body: Thin at tail (0.5px), crisp & exposed at head (2.8px)
        const sampleCount = 60;
        const headDistance = headP * totalPerimeter;
        const tailDistance = tailP * totalPerimeter;
        const trailSpan = Math.max(0, headDistance - tailDistance);

        if (trailSpan > 2) {
          for (let s = 0; s < sampleCount; s++) {
            const frac1 = s / sampleCount;
            const frac2 = (s + 1) / sampleCount;

            const dist1 = tailDistance + frac1 * trailSpan;
            const dist2 = tailDistance + frac2 * trailSpan;

            const p1 = getPointOnRoundedRect(dist1 / totalPerimeter, cardX, cardY, cardW, cardH, cardRadius);
            const p2 = getPointOnRoundedRect(dist2 / totalPerimeter, cardX, cardY, cardW, cardH, cardRadius);

            const segAlpha = Math.pow(frac2, 2.0);
            const segWidth = 0.5 + frac2 * 2.3;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${segAlpha * 0.95})`;
            ctx.lineWidth = segWidth;
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }

        // Subtly Shiny High-Exposure Head Point
        const headPt = getPointOnRoundedRect(headP, cardX, cardY, cardW, cardH, cardRadius);

        ctx.beginPath();
        const glowGrad = ctx.createRadialGradient(headPt.x, headPt.y, 0, headPt.x, headPt.y, 14);
        glowGrad.addColorStop(0, "rgba(255, 255, 255, 0.55)");
        glowGrad.addColorStop(0.35, "rgba(255, 255, 255, 0.18)");
        glowGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = glowGrad;
        ctx.arc(headPt.x, headPt.y, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 10;
        ctx.arc(headPt.x, headPt.y, 2.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else {
        // Container fully closed -> subtle resting white border
        ctx.save();
        createContainerPath(ctx, cardX, cardY, cardW, cardH, cardRadius);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // ─── STAGE 1+: TRIGGER ANIMATION INSIDE CONTAINER ───
      if (t >= laserDuration) {
        const logoT = (t - laserDuration) / (1 - laserDuration);

        // Clip all intro and zoom graphics strictly inside the formed container boundaries
        ctx.save();
        createContainerPath(ctx, cardX, cardY, cardW, cardH, cardRadius);
        ctx.clip();

        ctx.font = `600 ${fontSize}px ${fontFamily}`;
        ctx.textBaseline = "middle";
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const totalWidth = logoSize + gap + textWidth;

        const startX = (width - totalWidth) / 2;
        const centerY = height / 2;
        const initialLogoCx = startX + logoSize / 2;
        const screenCenterCx = width / 2;

        const chars = text.split("");

        if (logoT <= 0.44) {
          // Logo Entrance at left of lockup
          const logoProgress = Math.max(0, Math.min(logoT / 0.24, 1));
          const logoEase = 1 - Math.pow(1 - logoProgress, 4);
          const logoOpacity = Math.min((t - laserDuration) / 0.06, 1);
          drawEyeLogo(initialLogoCx, centerY, logoSize, 0.6 + 0.4 * logoEase, logoOpacity, logoEase, 0);

          // Letters Cascade Entrance from bottom
          let currentX = startX + logoSize + gap;
          chars.forEach((char, i) => {
            const charWidth = ctx.measureText(char).width;
            const charDelay = 0.04 + i * 0.032;
            const charT = Math.max(0, Math.min((logoT - charDelay) / 0.16, 1));
            const charEase = 1 - Math.pow(1 - charT, 3);

            const yOffset = (1 - charEase) * 28;
            const charOpacity = Math.max(0, Math.min(charT * 1.8, 1));

            ctx.save();
            ctx.beginPath();
            ctx.rect(currentX - 4, centerY - fontSize, charWidth + 8, fontSize * 2);
            ctx.clip();

            ctx.globalAlpha = charOpacity;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(char, currentX, centerY + yOffset);

            // Specular Sweep
            if (logoT > 0.20 && logoT < 0.42) {
              const sweepT = (logoT - 0.20) / 0.22;
              const sweepX = startX + sweepT * (totalWidth + 120) - 60;
              const grad = ctx.createLinearGradient(sweepX - 40, centerY, sweepX + 40, centerY);
              grad.addColorStop(0, "rgba(255, 255, 255, 0)");
              grad.addColorStop(0.5, "rgba(235, 210, 255, 0.9)");
              grad.addColorStop(1, "rgba(255, 255, 255, 0)");

              ctx.globalCompositeOperation = "source-atop";
              ctx.fillStyle = grad;
              ctx.fillText(char, currentX, centerY + yOffset);
            }

            ctx.restore();
            currentX += charWidth;
          });
        } else if (logoT <= 0.70) {
          // Suction, Centering & Black Pupil formation
          const suckProgress = Math.max(0, Math.min((logoT - 0.44) / 0.26, 1));

          const centerEase = 1 - Math.pow(1 - suckProgress, 3);
          const currentEyeCx = initialLogoCx + (screenCenterCx - initialLogoCx) * centerEase;

          const eyePulse = (1 + (centerEase * 0.08)) * (1 + Math.sin(suckProgress * Math.PI) * 0.14);
          const irisExpansion = 1 + Math.sin(suckProgress * Math.PI) * 0.45;

          const blackPupilEase = 1 - Math.pow(1 - suckProgress, 2.5);
          const blackPupilScale = Math.min(blackPupilEase * 1.05, 1);

          drawEyeLogo(currentEyeCx, centerY, logoSize, eyePulse, 1, irisExpansion, blackPupilScale);

          let currentX = startX + logoSize + gap;
          chars.forEach((char, i) => {
            const charWidth = ctx.measureText(char).width;
            const suckDelay = (chars.length - 1 - i) * 0.032;
            const charSuckT = Math.max(0, Math.min((suckProgress - suckDelay) / 0.18, 1));
            const charSuckEase = Math.pow(charSuckT, 2.8);

            const startCharX = currentX;
            const startCharY = centerY;

            const posX = startCharX + (currentEyeCx - startCharX) * charSuckEase;
            const posY = startCharY + (centerY - startCharY) * charSuckEase;
            const scale = Math.max(0, 1 - charSuckEase);
            const opacity = Math.max(0, 1 - charSuckEase * 1.25);

            if (scale > 0.01 && opacity > 0.01) {
              ctx.save();
              ctx.translate(posX, posY);
              const stretchX = scale * (1 + charSuckEase * 0.8);
              const stretchY = scale * (1 - charSuckEase * 0.5);
              ctx.scale(stretchX, stretchY);
              ctx.globalAlpha = opacity;
              ctx.fillStyle = "#ffffff";
              ctx.fillText(char, 0, 0);
              ctx.restore();
            }

            currentX += charWidth;
          });
        } else {
          // ─── PHASE 4: TRUE PHYSICAL ZOOM CLIPPED STRICTLY TO CONTAINER ───
          const zoomProgress = Math.max(0, Math.min((logoT - 0.70) / 0.30, 1));
          // Kinetic cubic rush scaling up to 160x, solid 100% white opacity
          const zoomEase = Math.pow(zoomProgress, 3.4);
          const hyperScale = 1.08 + zoomEase * 160.0;

          // Draw full solid white Eye geometry (NO opacity decrease)
          drawEyeLogo(screenCenterCx, centerY, logoSize, hyperScale, 1.0, 1.2, 0);

          // Draw solid pure black pupil expanding outwards inside the container
          const solidPupilRadius = (logoSize * 0.16 * 1.2 * 0.55) * hyperScale;
          ctx.beginPath();
          ctx.fillStyle = "#000000";
          ctx.arc(screenCenterCx, centerY, solidPupilRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore(); // Restore container clipping
      }

      if (elapsed < duration) {
        animId = requestAnimationFrame(render);
      } else {
        setIsDone(true);
        if (onComplete) onComplete();
      }
    }

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.15, ease: "easeOut" },
          }}
        >
          <canvas ref={canvasRef} className={styles.introCanvas} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
