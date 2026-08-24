"use client";
import React, { useEffect, useRef } from "react";
import styles from "./Nav.module.css";

function clamp01(v) {
  return Math.min(Math.max(v, 0), 1);
}

export default function Nav() {
  const dockRef = useRef(null);
  const itemsRef = useRef([]);

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
      // Using window.innerWidth to get the stage equivalent width assuming full viewport width.
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

    function dockRest() {
      live = false;
      dirty = true;
      dockItems.forEach(st => {
        st.target = 0;
        st.el.dataset.near = "false";
      });
    }

    function update(time) {
      const dtRaw = (time - lastTime) / 1000;
      lastTime = time;
      const dt = Math.min(dtRaw, 1 / 20); // cap delta time to 50ms

      if (on) {
        if (aimSeen && aimMoved && !keyMode) {
          const rr = root.getBoundingClientRect();
          if (aimX > rr.left - 48 && aimX < rr.right + 48 && aimY > rr.top - 44 && aimY < rr.bottom + 104) {
            dockItems.forEach(st => {
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

        if (dirty) {
          let moving = false;
          dockItems.forEach(st => {
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
            const isMark = st.el.classList.contains(styles['dock-mark']);
            const ew = isMark ? 14 * u : Math.min(18 * u, st.w * 0.24);
            const eh = isMark ? 14 * u : 16 * u;
            
            st.el.style.width = (st.w + ew * v).toFixed(2) + "px";
            st.el.style.height = (st.h + eh * v).toFixed(2) + "px";
            st.el.style.transform = `translateY(${(v * 3.5 * u).toFixed(2)}px)`;
          });
          if (!moving) dirty = false;
        }
      }

      if (specOn) {
        if (aimSeen && aimMoved) {
          specItems.forEach(st => {
            const r = st.el.getBoundingClientRect();
            const cx = r.left + r.width * 0.5;
            const cy = r.top + r.height * 0.5;
            const dx = Math.max(r.left - aimX, 0, aimX - r.right);
            const dy = Math.max(r.top - aimY, 0, aimY - r.bottom);
            const d = Math.sqrt(dx * dx + dy * dy);
            
            st.tAng = d === 0
              ? Math.atan2(2 / Math.max(r.height, 1), -2 / Math.max(r.width, 1)) +
                ((aimX - cx) / Math.max(r.width * 0.5, 1)) * 0.30 +
                ((cy - aimY) / Math.max(r.height * 0.5, 1)) * 0.15
              : Math.atan2(cy - aimY, aimX - cx);
              
            const raw = clamp01(1 - d / (st.reach * u));
            st.tBr = Math.max(raw * raw * (3 - 2 * raw), st.focused ? 0.9 : 0);
          });
          specDirty = true;
        }

        if (specDirty) {
          let moving = false;
          specItems.forEach(st => {
            const diff = ((st.tAng - st.ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
            st.ang += diff * (1 - Math.exp(-dt * 8));
            st.br += (st.tBr - st.br) * (1 - Math.exp(-dt * 9));
            if (Math.abs(diff) < 0.001 && Math.abs(st.tBr - st.br) < 0.002) {
              st.ang = st.tAng;
              st.br = st.tBr;
            } else {
              moving = true;
            }
            st.el.style.setProperty('--spec-angle', st.ang.toFixed(4) + 'rad');
            st.el.style.setProperty('--spec-bright', (clamp01(st.br) * 0.92).toFixed(3));
          });
          if (!moving) specDirty = false;
        }
      }

      rafId = requestAnimationFrame(update);
    }

    measureDock();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureDock);
    }
    
    const handleResize = () => measureDock();
    window.addEventListener("resize", handleResize);

    const handlePointerMove = (e) => {
      if (e.pointerType === "touch") return;
      aimX = e.clientX; aimY = e.clientY; aimSeen = true; aimMoved = true; keyMode = false;
      dirty = specDirty = true;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const handlePointerLeave = () => {
      aimSeen = false;
      dockRest();
      specItems.forEach(st => { st.tBr = st.focused ? 0.9 : 0; });
      specDirty = true;
    };
    window.addEventListener("pointerleave", handlePointerLeave);

    const handleFocusIn = (e) => {
      const item = e.target.closest('[data-dock]');
      if (!item || !on) return;
      const idx = dockItems.findIndex(st => st.el === item);
      dockItems.forEach((st, i) => {
        st.target = i === idx ? 1 : Math.abs(i - idx) === 1 ? 0.24 : 0;
        st.el.dataset.near = st.target > 0.08 ? "true" : "false";
      });
      live = false; keyMode = true; dirty = true;
    };
    root.addEventListener("focusin", handleFocusIn);

    const handleFocusOut = () => {
      requestAnimationFrame(() => {
        if (!root.contains(document.activeElement)) { keyMode = false; dockRest(); }
      });
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
      e.preventDefault();
      if (!item.classList.contains(styles['dock-mark'])) {
        dockItems.forEach(st => st.el.classList.remove(styles['is-active']));
        item.classList.add(styles['is-active']);
      }
    };
    root.addEventListener("click", handleClick);

    // Initial play animation (opacity and sliding in)
    root.parentElement.style.opacity = "1";
    dockItems.forEach((st, i) => {
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
        <a className={`${styles['dock-item']} ${styles['dock-mark']}`} data-dock data-spec href="#" aria-label="Sylva — home">
          <svg viewBox="0 0 22 24" aria-hidden="true">
            <path d="M11 1.3c-2.1 0-3.95 1.2-4.75 2.95C3.95 4.55 2.3 6.25 2.3 8.35c0 2.3 1.9 4.2 4.3 4.2h8.8c2.4 0 4.3-1.9 4.3-4.2 0-2.1-1.65-3.8-4-4.1C14.95 2.5 13.1 1.3 11 1.3Z"/>
            <path d="M9.6 12.55h2.8v4.2c1.35.3 2.45 1.15 3.15 2.4-1.35.4-2.4.15-3.15-.4v4.15H9.6v-4.15c-.75.55-1.8.8-3.15.4.7-1.25 1.8-2.1 3.15-2.4v-4.2Z"/>
          </svg>
        </a>
        <a className={`${styles['dock-item']} ${styles['is-active']}`} data-dock data-spec href="#">
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
        <a className={`${styles['dock-item']} ${styles['dock-item--enter']}`} data-dock data-spec href="#">
          <span className={styles.glyph} aria-hidden="true">
            <svg viewBox="0 0 16 16"><path d="M6.6 2.5h5.1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6.6"/><path d="M2.6 8h6.6"/><path d="m7 5.6 2.4 2.4L7 10.4"/></svg>
          </span>
          <span>Enter</span>
        </a>
      </nav>
    </div>
  );
}
