"use client";
import React, { useEffect, useRef } from "react";
import styles from "./Nav.module.css";

function clamp01(v) {
  return Math.min(Math.max(v, 0), 1);
}

export default function Nav() {
  const dockRef = useRef(null);

  const handleNavClick = (id, e) => {
    e.preventDefault();
    if (id === "top") {
      if (typeof window !== "undefined") {
        if (window.__lenis) {
          window.__lenis.scrollTo(0, { duration: 1.5 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.scrollTo(el, { duration: 1.5, offset: -20 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const root = dockRef.current;
    if (!root) return;

    const dockItems = Array.from(root.querySelectorAll("[data-dock]")).map((el) => ({
      el,
      w: 0,
      h: 0,
      v: 0,
      vel: 0,
      target: 0,
    }));

    const specItems = Array.from(root.parentElement.querySelectorAll("[data-spec]")).map((el) => ({
      el,
      ang: 2.4,
      tAng: 2.4,
      br: 0,
      tBr: 0,
      focused: false,
      reach: el.classList.contains(styles.dock) ? 250 : 185,
    }));

    let on = false;
    let specOn = false;
    let aimX = 0,
      aimY = 0,
      aimSeen = false,
      aimMoved = false;
    let keyMode = false;
    let dirty = true;
    let specDirty = true;
    let u = 1;
    let live = false;
    let rafId = null;
    let lastTime = performance.now();

    const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function fineHover() {
      return !REDUCED && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }

    function measureDock() {
      if (!root) return;
      on = fineHover();
      specOn = on;
      const isNarrow = window.matchMedia("(max-width: 900px)").matches;
      u = window.innerWidth / (isNarrow ? 760 : 1600);

      dockItems.forEach((st) => {
        st.el.style.width = "";
        st.el.style.height = "";
        st.el.style.transform = "";
        st.el.dataset.near = "false";
        st.v = 0;
        st.vel = 0;
        st.target = 0;
      });

      dockItems.forEach((st) => {
        const r = st.el.getBoundingClientRect();
        st.w = r.width;
        st.h = r.height;
      });

      live = false;
      dirty = true;
      aimMoved = aimSeen;
    }

    measureDock();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureDock);
    }

    function dockRest() {
      live = false;
      dirty = true;
      dockItems.forEach((st) => {
        st.target = 0;
        st.el.dataset.near = "false";
      });
    }

    function drawDock(dt) {
      if (!root || !on) return;

      if (aimSeen && aimMoved && !keyMode) {
        const isHovered = root.matches(":hover");
        const rr = root.getBoundingClientRect();
        if (
          isHovered &&
          aimX > rr.left - 48 &&
          aimX < rr.right + 48 &&
          aimY > rr.top - 44 &&
          aimY < rr.bottom + 104
        ) {
          dockItems.forEach((st) => {
            const r = st.el.getBoundingClientRect();
            const prox = clamp01(1 - Math.abs(aimX - (r.left + r.width * 0.5)) / (128 * u));
            st.target = prox * prox * (3 - 2 * prox);
            st.el.dataset.near = st.target > 0.08 ? "true" : "false";
          });
          live = true;
          dirty = true;
        } else if (live) {
          dockRest();
        }
      }

      if (!dirty) return;
      let moving = false;

      dockItems.forEach((st) => {
        st.vel += (st.target - st.v) * 190 * dt;
        st.vel *= Math.exp(-23 * dt);
        st.v += st.vel * dt;

        if (Math.abs(st.target - st.v) < 0.001 && Math.abs(st.vel) < 0.004) {
          st.v = st.target;
          st.vel = 0;
        } else {
          moving = true;
        }

        const v = Math.min(Math.max(st.v, 0), 1.08);
        const isMark = st.el.classList.contains(styles["dock-mark"]);
        const ew = isMark ? 14 * u : Math.min(18 * u, st.w * 0.24);
        const eh = isMark ? 14 * u : 16 * u;

        st.el.style.width = (st.w + ew * v).toFixed(2) + "px";
        st.el.style.height = (st.h + eh * v).toFixed(2) + "px";
        st.el.style.transform = "translateY(" + (v * 3.5 * u).toFixed(2) + "px)";
      });

      if (!moving) dirty = false;
    }

    function drawSpec(dt) {
      if (!specOn) return;

      if (aimSeen && aimMoved) {
        specItems.forEach((st) => {
          const r = st.el.getBoundingClientRect();
          const cx = r.left + r.width * 0.5;
          const cy = r.top + r.height * 0.5;
          const dx = Math.max(r.left - aimX, 0, aimX - r.right);
          const dy = Math.max(r.top - aimY, 0, aimY - r.bottom);
          const d = Math.sqrt(dx * dx + dy * dy);

          st.tAng =
            d === 0
              ? Math.atan2(2 / Math.max(r.height, 1), -2 / Math.max(r.width, 1)) +
                ((aimX - cx) / Math.max(r.width * 0.5, 1)) * 0.3 +
                ((cy - aimY) / Math.max(r.height * 0.5, 1)) * 0.15
              : Math.atan2(cy - aimY, aimX - cx);

          const raw = clamp01(1 - d / (st.reach * u));
          st.tBr = Math.max(raw * raw * (3 - 2 * raw), st.focused ? 0.9 : 0);
        });
        specDirty = true;
      }

      if (!specDirty) return;
      let moving = false;

      specItems.forEach((st) => {
        const diff = ((st.tAng - st.ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        st.ang += diff * (1 - Math.exp(-dt * 8));
        st.br += (st.tBr - st.br) * (1 - Math.exp(-dt * 9));

        if (Math.abs(diff) < 0.001 && Math.abs(st.tBr - st.br) < 0.002) {
          st.ang = st.tAng;
          st.br = st.tBr;
        } else {
          moving = true;
        }

        st.el.style.setProperty("--spec-angle", st.ang.toFixed(4) + "rad");
        st.el.style.setProperty("--spec-bright", (clamp01(st.br) * 0.92).toFixed(3));
      });

      if (!moving) specDirty = false;
    }

    function update(t) {
      const dt = Math.min((t - lastTime) / 1000, 0.05);
      lastTime = t;

      drawDock(dt);
      drawSpec(dt);

      rafId = requestAnimationFrame(update);
    }

    const handleResize = () => measureDock();
    window.addEventListener("resize", handleResize, { passive: true });

    const handlePointerMove = (e) => {
      if (e.pointerType === "touch") return;
      aimX = e.clientX;
      aimY = e.clientY;
      aimSeen = true;
      aimMoved = true;
      keyMode = false;
      dirty = true;
      specDirty = true;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const handlePointerLeave = () => {
      aimSeen = false;
      dockRest();
      specItems.forEach((st) => {
        st.tBr = st.focused ? 0.9 : 0;
      });
      specDirty = true;
    };
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    const handleFocusIn = (e) => {
      const item = e.target.closest("[data-dock]");
      if (!item || !on) return;
      const idx = dockItems.map((st) => st.el).indexOf(item);
      if (idx >= 0) {
        keyMode = true;
        dockItems.forEach((st, i) => {
          const prox = clamp01(1 - Math.abs(i - idx) / 2.2);
          st.target = prox * prox * (3 - 2 * prox);
          st.el.dataset.near = st.target > 0.08 ? "true" : "false";
        });
        live = true;
        dirty = true;
      }
    };
    root.addEventListener("focusin", handleFocusIn);

    const handleFocusOut = () => {
      keyMode = false;
      dockRest();
    };
    root.addEventListener("focusout", handleFocusOut);

    specItems.forEach((st) => {
      st.handleFocusIn = () => {
        st.focused = true;
        specDirty = true;
      };
      st.handleFocusOut = () => {
        st.focused = false;
        specDirty = true;
      };
      st.el.addEventListener("focusin", st.handleFocusIn);
      st.el.addEventListener("focusout", st.handleFocusOut);
    });

    root.parentElement.style.opacity = "1";

    lastTime = performance.now();
    rafId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      root.removeEventListener("focusin", handleFocusIn);
      root.removeEventListener("focusout", handleFocusOut);
      specItems.forEach((st) => {
        st.el.removeEventListener("focusin", st.handleFocusIn);
        st.el.removeEventListener("focusout", st.handleFocusOut);
      });
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className={styles["dock-wrap"]}
      style={{
        opacity: 0,
        transition: "opacity 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) 80ms",
      }}
    >
      <nav
        ref={dockRef}
        className={`${styles.dock} ${styles["par-dock"]}`}
        style={{ "--pd": 5 }}
        data-spec
        aria-label="Primary"
      >
        {/* Home / Top */}
        <a
          className={`${styles["dock-item"]} ${styles["dock-mark"]}`}
          data-dock
          data-spec
          href="#top"
          onClick={(e) => handleNavClick("top", e)}
          aria-label="Home"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5ZM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3Z"
            />
          </svg>
        </a>

        {/* 1. How */}
        <a
          className={styles["dock-item"]}
          data-dock
          data-spec
          href="#why-how"
          onClick={(e) => handleNavClick("why-how", e)}
        >
          <span>How</span>
        </a>

        {/* 2. Safety */}
        <a
          className={styles["dock-item"]}
          data-dock
          data-spec
          href="#safety"
          onClick={(e) => handleNavClick("safety", e)}
        >
          <span>Safety</span>
        </a>

        {/* 3. Privacy */}
        <a
          className={styles["dock-item"]}
          data-dock
          data-spec
          href="#privacy"
          onClick={(e) => handleNavClick("privacy", e)}
        >
          <span>Privacy</span>
        </a>

        {/* 4. Use */}
        <a
          className={styles["dock-item"]}
          data-dock
          data-spec
          href="#use"
          onClick={(e) => handleNavClick("use", e)}
        >
          <span>Use</span>
        </a>
      </nav>
    </div>
  );
}
