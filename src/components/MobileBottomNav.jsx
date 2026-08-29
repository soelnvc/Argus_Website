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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: "why-how",
    label: "How",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    id: "safety",
    label: "Safety",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="11" x="4" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: "use",
    label: "Use",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
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
