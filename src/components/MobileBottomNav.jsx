"use client";

import React, {
  useCallback,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./MobileBottomNav.module.css";
import { triggerCurtainNavigation } from "./CurtainTransition";

const NAV_TITLES = {
  top: "Argus",
  "why-how": "How We Solve This",
  safety: "Safety Hazards",
  privacy: "Responsible Surveillance",
  use: "Choose Your Pace",
};

const NAV_ITEMS = [
  {
    id: "top",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5ZM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3Z"
        />
      </svg>
    ),
  },
  {
    id: "why-how",
    label: "How",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 14V9" />
        <path d="M8 9c0-2.4 1.7-4.3 4-4.3.2 2.6-1.6 4.6-4 4.3Z" />
        <path d="M8 10.5C7.9 8.4 6.4 6.8 4.4 6.8 4.3 8.9 5.9 10.6 8 10.5Z" />
      </svg>
    ),
  },
  {
    id: "safety",
    label: "Safety",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1.6 12.4c2.4-3.4 4.3-5.1 5.7-5.1 2 0 3 3.6 5 3.6 1.1 0 1.9-.5 2.4-1.4" />
        <path d="M4.3 6.2C5.5 4.4 6.6 3.5 7.6 3.5c1.5 0 2.2 2.4 3.7 2.4" />
      </svg>
    ),
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2.4h5.3L12 5.1v8.5H4z" />
        <path d="M9.2 2.4V5h2.7" />
        <path d="M6 8.4h4M6 10.8h2.8" />
      </svg>
    ),
  },
  {
    id: "use",
    label: "Use",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.6 2.5h5.1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6.6" />
        <path d="M2.6 8h6.6" />
        <path d="m7 5.6 2.4 2.4L7 10.4" />
      </svg>
    ),
  },
];

const STRETCH_MS = 280;
const SETTLE_MS = 500;

export default function MobileBottomNav() {
  const [activeId, setActiveId] = useState("top");
  const [phase, setPhase] = useState("idle"); // 'idle' | 'stretch' | 'settle'
  const [indicator, setIndicator] = useState(null);
  const [itemRects, setItemRects] = useState({});
  const buttonsRef = useRef(new Map());
  const phaseRef = useRef("idle");
  const timeoutRef = useRef(null);

  useLayoutEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useLayoutEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const measure = useCallback((id) => {
    const button = buttonsRef.current.get(id);
    if (!button) return null;
    return { left: button.offsetLeft, width: button.offsetWidth };
  }, []);

  const updateRects = useCallback(() => {
    const next = {};
    buttonsRef.current.forEach((button, id) => {
      next[id] = { left: button.offsetLeft, width: button.offsetWidth };
    });
    setItemRects(next);

    if (phaseRef.current === "stretch") return;
    const rect = next[activeId];
    if (rect) setIndicator(rect);
  }, [activeId]);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(updateRects);
    buttonsRef.current.forEach((button) => observer.observe(button));

    window.addEventListener("resize", updateRects);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateRects);
    };
  }, [updateRects]);

  // Section observer on scroll to keep activeId in sync when user scrolls naturally
  useEffect(() => {
    const sections = [
      { id: "top", el: document.getElementById("top") || document.body },
      { id: "why-how", el: document.getElementById("why-how") },
      { id: "safety", el: document.getElementById("safety") },
      { id: "privacy", el: document.getElementById("privacy") },
      { id: "use", el: document.getElementById("use") },
    ].filter((s) => s.el);

    const handleScroll = () => {
      if (phaseRef.current !== "idle") return;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const windowHeight = window.innerHeight;
      const triggerY = scrollY + windowHeight * 0.4;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        const rect = sec.el.getBoundingClientRect();
        const top = rect.top + scrollY;
        if (triggerY >= top) {
          if (sec.id !== activeId) {
            setActiveId(sec.id);
          }
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeId]);

  function isCoveredByIndicator(rect) {
    if (!indicator || !rect) return false;
    const indicatorRight = indicator.left + indicator.width;
    return (
      rect.left >= indicator.left - 1 &&
      rect.left + rect.width <= indicatorRight + 1
    );
  }

  function handleSelect(id) {
    if (phaseRef.current !== "idle" || id === activeId) return;

    const startRect = indicator ?? measure(activeId);
    const targetRect = measure(id);
    if (!startRect || !targetRect) return;

    // Trigger page navigation
    const title = NAV_TITLES[id] || id;
    triggerCurtainNavigation(id, title);

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setActiveId(id);
      setIndicator(targetRect);
      return;
    }

    const left = Math.min(startRect.left, targetRect.left);
    const right = Math.max(
      startRect.left + startRect.width,
      targetRect.left + targetRect.width
    );

    setPhase("stretch");
    setIndicator({ left, width: right - left });

    timeoutRef.current = setTimeout(() => {
      setActiveId(id);
      setPhase("settle");

      timeoutRef.current = setTimeout(() => {
        setPhase("idle");
      }, SETTLE_MS + 100);
    }, STRETCH_MS);
  }

  function handleIndicatorTransitionEnd(e) {
    if (e.propertyName !== "width") return;
    if (phaseRef.current !== "settle") return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPhase("idle");
  }

  return (
    <div className={styles.mobileNavWrap}>
      <div className={styles.navContainer}>
        <div role="tablist" aria-label="Mobile Navigation" className={styles.tablist}>
          {indicator && (
            <span
              aria-hidden="true"
              onTransitionEnd={handleIndicatorTransitionEnd}
              className={styles.indicator}
              style={{
                left: indicator.left,
                width: indicator.width,
                transitionProperty: "left, width",
                transitionDuration: `${phase === "stretch" ? STRETCH_MS : SETTLE_MS}ms`,
                transitionTimingFunction:
                  phase === "stretch"
                    ? "cubic-bezier(0.16, 1, 0.3, 1)"
                    : "cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <span className={styles.indicatorPill} />
            </span>
          )}

          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeId;
            const isColorActive =
              isActive || isCoveredByIndicator(itemRects[item.id]);

            return (
              <button
                key={item.id}
                ref={(node) => {
                  if (node) buttonsRef.current.set(item.id, node);
                  else buttonsRef.current.delete(item.id);
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelect(item.id)}
                className={`${styles.tabButton} ${isColorActive ? styles.tabButtonActive : ""}`}
              >
                <span className={styles.tabIcon} aria-hidden="true">
                  {item.icon}
                </span>

                <span
                  className={styles.labelGrid}
                  style={{ gridTemplateColumns: isActive ? "1fr" : "0fr" }}
                >
                  <span className={styles.labelOverflow}>
                    <span className={styles.labelText}>{item.label}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
