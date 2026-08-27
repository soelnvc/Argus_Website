"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";
import styles from "./CurtainTransition.module.css";

const inter = Inter({
  weight: ["300", "400"],
  subsets: ["latin"],
  display: "swap",
});

/**
 * Global helper function to trigger the curtain navigation from anywhere
 */
export function triggerCurtainNavigation(targetId, title) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("argus-curtain-navigate", {
        detail: { targetId, title },
      })
    );
  }
}

const charVariants = {
  hidden: {
    opacity: 0,
    rotateX: -90,
    y: 12,
    filter: "blur(4px)",
  },
  visible: (i) => ({
    opacity: 1,
    rotateX: 0,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.32,
      delay: 0.06 + i * 0.018,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function CurtainTransition() {
  const [active, setActive] = useState(false);
  const [data, setData] = useState({ targetId: "", title: "" });
  const [phase, setPhase] = useState("idle"); // "idle" | "down" | "hold" | "up"
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const handleNavigate = (e) => {
      if (isNavigatingRef.current) return;
      const { targetId, title } = e.detail;

      isNavigatingRef.current = true;
      setData({ targetId, title });
      setActive(true);
      setPhase("down");

      // 1. Curtain slides down (400ms)
      setTimeout(() => {
        setPhase("hold");

        // 2. Instant teleport while screen is completely black
        const SECTION_OFFSETS = {
          top: 0,
          "why-how": 70,
          safety: 4,
          privacy: 70,
          use: 100,
        };

        const targetOffset =
          SECTION_OFFSETS[targetId] !== undefined
            ? SECTION_OFFSETS[targetId]
            : 0;

        if (targetId === "top") {
          if (window.__lenis) {
            window.__lenis.scrollTo(0, { immediate: true, force: true });
          } else {
            window.scrollTo({ top: 0, behavior: "instant" });
          }
        } else {
          const el = document.getElementById(targetId);
          if (el) {
            if (window.__lenis) {
              window.__lenis.scrollTo(el, {
                immediate: true,
                force: true,
                offset: targetOffset,
              });
            } else {
              const rect = el.getBoundingClientRect();
              const scrollTop =
                window.scrollY || window.pageYOffset || 0;
              window.scrollTo({
                top: rect.top + scrollTop + targetOffset,
                behavior: "instant",
              });
            }
          }
        }

        // 3. Crisp hold of 300ms, then collapse upward at matching speed
        setTimeout(() => {
          setPhase("up");

          // 4. Reset once animation finishes collapsing up (400ms)
          setTimeout(() => {
            setActive(false);
            setPhase("idle");
            isNavigatingRef.current = false;
          }, 410);
        }, 300);
      }, 400);
    };

    window.addEventListener("argus-curtain-navigate", handleNavigate);
    return () => {
      window.removeEventListener("argus-curtain-navigate", handleNavigate);
    };
  }, []);

  if (!active) return null;

  const words = data.title ? data.title.split(" ") : [];
  let globalCharIndex = 0;

  return (
    <div className={styles.curtainPortal} aria-hidden="true">
      <motion.div
        className={styles.curtainCanvas}
        initial={{ y: "-100%" }}
        animate={
          phase === "down" || phase === "hold"
            ? { y: "0%" }
            : { y: "-100%" }
        }
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1], // Symmetrical high-speed curve
        }}
      >
        {/* Brutalist Content Stage */}
        <AnimatePresence mode="wait">
          {(phase === "down" || phase === "hold") && (
            <motion.div
              className={styles.textStage}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                y: -14,
                transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
              }}
            >
              <h2 className={`${styles.brutalistTitle} ${inter.className}`}>
                {words.map((word, wIdx) => (
                  <span key={wIdx} className={styles.wordWrap}>
                    {word.split("").map((char, cIdx) => {
                      const charIdx = globalCharIndex++;
                      return (
                        <motion.span
                          key={cIdx}
                          className={styles.charSpan}
                          custom={charIdx}
                          initial="hidden"
                          animate="visible"
                          variants={charVariants}
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                  </span>
                ))}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
