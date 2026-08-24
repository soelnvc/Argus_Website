"use client";
import React, { useEffect, useRef } from "react";
import styles from "./Nav.module.css";

function clamp01(v) {
  return Math.min(Math.max(v, 0), 1);
}

export default function Nav() {
  const dockRef = useRef(null);

  useEffect(() => {
    const root = dockRef.current;
    if (!root) return;

    // Define items array based on DOM structure
    const dockItems = Array.from(root.querySelectorAll('[data-dock]')).map(el => ({
      el, w: 0, h: 0, v: 0, vel: 0, target: 0
    }));
    const specItems = Array.from(root.querySelectorAll('[data-spec]')).map(el => ({
      el, ang: 2.4, tAng: 2.4, br: 0, tBr: 0, focused: false,
      reach: el.classList.contains(styles.dock) ? 250 : 185
    }));

    let on = false;
    let specOn = false;
    let aimX = 0, aimY = 0, aimSeen = false, aimMoved = false;
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
      
      dockItems.forEach(st => {
        st.el.style.width = "";
        st.el.style.height = "";
        st.el.style.transform = "";
        st.el.dataset.near = "false";
        st.v = 0;
        st.vel = 0;
        st.target = 0;
      });

      dockItems.forEach(st => {
        const r = st.el.getBoundingClientRect();
        st.w = r.width;
        st.h = r.height;
      });

      live = false;
      dirty = true;
      aimMoved = aimSeen;
    }

    measureDock();

    function updatePhysics(dt) {
      if (!on) return;
      const k = 280, d = 24;
      let active = false;

      dockItems.forEach(st => {
        const diff = st.target - st.v;
        const a = diff * k - st.vel * d;
        st.vel += a * dt;
        st.v += st.vel * dt;
        if (Math.abs(diff) > 0.001 || Math.abs(st.vel) > 0.001) active = true;
        else { st.v = st.target; st.vel = 0; }
      });

      live = active;
    }

    function applyPhysics() {
      if (!on) return;
      dockItems.forEach(st => {
        const v = Math.max(0, st.v);
        const wGrow = 40 * u;
        const hGrow = 16 * u;
        if (st.w > 0) {
          st.el.style.width = `${st.w + wGrow * v}px`;
          st.el.style.height = `${st.h + hGrow * v}px`;
        }
      });
    }

    function angleLerp(a, b, t) {
      let d = (b - a) % (Math.PI * 2);
      if (d < -Math.PI) d += Math.PI * 2;
      if (d > Math.PI) d -= Math.PI * 2;
      return a + d * t;
    }

    function updateSpecular(dt) {
      if (!specOn && !keyMode) return;
      let any = false;

      specItems.forEach(st => {
        const r = st.el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = aimX - cx;
        const dy = aimY - cy;
        const dist = Math.hypot(dx, dy);

        if (st.focused) {
          st.tBr = 1;
        } else if (aimSeen && dist < st.reach) {
          const edge = Math.max(0, dist - Math.max(r.width, r.height) / 2);
          const f = clamp01(1 - edge / (st.reach - Math.max(r.width, r.height) / 2));
          st.tBr = Math.pow(f, 1.4);
          st.tAng = Math.atan2(dy, dx) + Math.PI;
        } else {
          st.tBr = 0;
        }

        const t = clamp01(1 - Math.exp(-18 * dt));
        const angT = clamp01(1 - Math.exp(-22 * dt));
        st.br += (st.tBr - st.br) * t;
        st.ang = angleLerp(st.ang, st.tAng, angT);

        if (Math.abs(st.tBr - st.br) > 0.003) any = true;

        st.el.style.setProperty("--spec-angle", `${st.ang.toFixed(3)}rad`);
        st.el.style.setProperty("--spec-bright", st.br.toFixed(3));
      });

      specDirty = any;
    }

    function update(t) {
      const dt = Math.min((t - lastTime) / 1000, 0.05);
      lastTime = t;

      if (on && (aimMoved || live)) {
        if (aimMoved) {
          aimMoved = false;
          if (aimSeen) {
            const dockRect = root.getBoundingClientRect();
            const pad = 120 * u;
            const inside =
              aimX >= dockRect.left - pad &&
              aimX <= dockRect.right + pad &&
              aimY >= dockRect.top - pad &&
              aimY <= dockRect.bottom + pad;

            if (inside) {
              const reach = 110 * u;
              dockItems.forEach(st => {
                const r = st.el.getBoundingClientRect();
                const cx = r.left + r.width / 2;
                const cy = r.top + r.height / 2;
                const d = Math.hypot(aimX - cx, aimY - cy);
                if (d < reach) {
                  const f = Math.cos((d / reach) * (Math.PI / 2));
                  st.target = Math.pow(f, 1.6);
                  st.el.dataset.near = st.target > 0.35 ? "true" : "false";
                } else {
                  st.target = 0;
                  st.el.dataset.near = "false";
                }
              });
              live = true;
            } else {
              dockItems.forEach(st => {
                st.target = 0;
                st.el.dataset.near = "false";
              });
            }
          } else {
            dockItems.forEach(st => {
              st.target = 0;
              st.el.dataset.near = "false";
            });
          }
        }

        updatePhysics(dt);
        applyPhysics();
      }

      if (specDirty || aimSeen) {
        updateSpecular(dt);
      }

      rafId = requestAnimationFrame(update);
    }

    const handleResize = () => measureDock();
    window.addEventListener("resize", handleResize, { passive: true });

    const handlePointerMove = (e) => {
      aimX = e.clientX;
      aimY = e.clientY;
      aimSeen = true;
      aimMoved = true;
      specDirty = true;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const handlePointerLeave = () => {
      aimSeen = false;
      aimMoved = true;
      specDirty = true;
    };
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    const handleFocusIn = () => {
      keyMode = true;
      specDirty = true;
    };
    root.addEventListener("focusin", handleFocusIn);

    const handleFocusOut = () => {
      keyMode = false;
      specDirty = true;
    };
    root.addEventListener("focusout", handleFocusOut);

    specItems.forEach(st => {
      st.handleFocusIn = () => { st.focused = true; specDirty = true; };
      st.handleFocusOut = () => { st.focused = false; specDirty = true; };
      st.el.addEventListener("focusin", st.handleFocusIn);
      st.el.addEventListener("focusout", st.handleFocusOut);
    });

    const handleClick = (e) => {
      const item = e.target.closest('[data-dock]');
      if (!item) return;
      // All items behave identically on click
    };
    root.addEventListener("click", handleClick);

    root.parentElement.style.opacity = "1";
    dockItems.forEach((st) => {
      st.el.style.clipPath = "none";
    });

    lastTime = performance.now();
    rafId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      root.removeEventListener("focusin", handleFocusIn);
      root.removeEventListener("focusout", handleFocusOut);
      root.removeEventListener("click", handleClick);
      specItems.forEach(st => {
        st.el.removeEventListener("focusin", st.handleFocusIn);
        st.el.removeEventListener("focusout", st.handleFocusOut);
      });
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className={styles['dock-wrap']} style={{ opacity: 0, transition: 'opacity 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) 80ms' }}>
      <nav ref={dockRef} className={`${styles.dock} ${styles['par-dock']}`} style={{ "--pd": 5 }} data-spec aria-label="Primary">
        <a className={`${styles['dock-item']} ${styles['dock-mark']}`} data-dock data-spec href="#" aria-label="Home">
          <svg viewBox="0 0 22 24" aria-hidden="true">
            <path d="M11 1.3c-2.1 0-3.95 1.2-4.75 2.95C3.95 4.55 2.3 6.25 2.3 8.35c0 2.3 1.9 4.2 4.3 4.2h8.8c2.4 0 4.3-1.9 4.3-4.2 0-2.1-1.65-3.8-4-4.1C14.95 2.5 13.1 1.3 11 1.3Z"/>
            <path d="M9.6 12.55h2.8v4.2c1.35.3 2.45 1.15 3.15 2.4-1.35.4-2.4.15-3.15-.4v4.15H9.6v-4.15c-.75.55-1.8.8-3.15.4.7-1.25 1.8-2.1 3.15-2.4v-4.2Z"/>
          </svg>
        </a>
        <a className={styles['dock-item']} data-dock data-spec href="#">
          <span className={styles.glyph} aria-hidden="true">
            <svg viewBox="0 0 16 16"><path d="M8 14V9"/><path d="M8 9c0-2.4 1.7-4.3 4-4.3.2 2.6-1.6 4.6-4 4.3Z"/><path d="M8 10.5C7.9 8.4 6.4 6.8 4.4 6.8 4.3 8.9 5.9 10.6 8 10.5Z"/></svg>
          </span>
          <span>Grove</span>
        </a>
        <a className={styles['dock-item']} data-dock data-spec href="#">
          <span className={styles.glyph} aria-hidden="true">
            <svg viewBox="0 0 16 16"><path d="M1.6 12.4c2.4-3.4 4.3-5.1 5.7-5.1 2 0 3 3.6 5 3.6 1.1 0 1.9-.5 2.4-1.4"/><path d="M4.3 6.2C5.5 4.4 6.6 3.5 7.6 3.5c1.5 0 2.2 2.4 3.7 2.4"/></svg>
          </span>
          <span>Habitats</span>
        </a>
        <a className={styles['dock-item']} data-dock data-spec href="#">
          <span className={styles.glyph} aria-hidden="true">
            <svg viewBox="0 0 16 16"><path d="M4 2.4h5.3L12 5.1v8.5H4z"/><path d="M9.2 2.4V5h2.7"/><path d="M6 8.4h4M6 10.8h2.8"/></svg>
          </span>
          <span>Journal</span>
        </a>
        <a className={styles['dock-item']} data-dock data-spec href="#">
          <span className={styles.glyph} aria-hidden="true">
            <svg viewBox="0 0 16 16"><path d="M6.6 2.5h5.1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6.6"/><path d="M2.6 8h6.6"/><path d="m7 5.6 2.4 2.4L7 10.4"/></svg>
          </span>
          <span>Enter</span>
        </a>
      </nav>
    </div>
  );
}
