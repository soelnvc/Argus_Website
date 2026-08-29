"use client";
import React, { useEffect, useRef } from "react";
import styles from "./SocialOrbs.module.css";

const TAU = Math.PI * 2;
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v) => {
  v = clamp01(v);
  return v * v * (3 - 2 * v);
};
const lerp = (a, b, m) => a + (b - a) * m;

/* deterministic hash noise */
const hash = (x, y) => {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

/* yaw+tilt rotation and orthographic projection */
const proj = (yaw, tilt, cx, cy, s) => {
  const st = Math.sin(tilt),
    ct = Math.cos(tilt);
  const sy = Math.sin(yaw),
    cyw = Math.cos(yaw);
  return (x, y, z) => {
    const px = x * cyw + z * sy,
      pz = -x * sy + z * cyw;
    const py = y * ct - pz * st,
      z2 = y * st + pz * ct;
    return [cx + px * s, cy - py * s, z2];
  };
};

const rscale = (S) => Math.pow(S / 300, 0.6);

function paint(ctx, dots, accent, sat, rMin) {
  dots.sort((a, b) => a.z - b.z);
  for (const d of dots) {
    const al = d.a ?? 1;
    if (al < 0.02) continue;
    const v = clamp01(d.v);
    const g = v * 255;
    const acc = d.c || accent;
    const st = d.c ? 0.95 : sat;
    let r = g,
      gg = g,
      b = g;
    if (acc && st) {
      const lift = Math.min(1, v * 1.12);
      r = g * (1 - st) + acc[0] * lift * st;
      gg = g * (1 - st) + acc[1] * lift * st;
      b = g * (1 - st) + acc[2] * lift * st;
    }
    if (v > 0.85) {
      const w = ((v - 0.85) / 0.15) * 0.45;
      r += (255 - r) * w;
      gg += (255 - gg) * w;
      b += (255 - b) * w;
    }
    ctx.fillStyle = `rgba(${r | 0},${gg | 0},${b | 0},${al})`;
    ctx.beginPath();
    ctx.arc(d.x, d.y, Math.max(rMin, d.r), 0, TAU);
    ctx.fill();
  }
}

function perimeter(pts) {
  const n = pts.length,
    seg = [];
  let L = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[i],
      b = pts[(i + 1) % n];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    seg.push(l);
    L += l;
  }
  return (u) => {
    let d = (((u % 1) + 1) % 1) * L,
      i = 0;
    while (d > seg[i] && i < n - 1) {
      d -= seg[i];
      i++;
    }
    const a = pts[i],
      b = pts[(i + 1) % n],
      f = seg[i] ? d / seg[i] : 0;
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  };
}

const MARK_PATHS = {
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  x: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
  instagram:
    "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

const maskCache = new Map();
function pathDots(key, d, N, vb, strokeW, inv, rc) {
  if (typeof document === "undefined") return [];
  const ck = key + "-" + N + "-" + (inv || "") + (rc ? "-rc" : "");
  if (maskCache.has(ck)) return maskCache.get(ck);
  const px = 200,
    c = document.createElement("canvas");
  c.width = c.height = px;
  const g = c.getContext("2d");
  g.setTransform(px / (vb || 24), 0, 0, px / (vb || 24), 0, 0);
  if (strokeW) {
    g.strokeStyle = "#fff";
    g.lineWidth = strokeW;
    g.lineJoin = "round";
    g.lineCap = "round";
    g.stroke(new Path2D(d));
  } else {
    g.fillStyle = "#fff";
    g.fill(new Path2D(d));
  }
  const img = g.getImageData(0, 0, px, px).data;
  let x0 = px,
    x1 = -1,
    y0 = px,
    y1 = -1;
  for (let j = 0; j < px; j++)
    for (let i = 0; i < px; i++)
      if (img[(j * px + i) * 4 + 3] > 128) {
        if (i < x0) x0 = i;
        if (i > x1) x1 = i;
        if (j < y0) y0 = j;
        if (j > y1) y1 = j;
      }
  const mx = (x0 + x1) / 2,
    my = (y0 + y1) / 2,
    m = Math.max(x1 - x0, y1 - y0);
  const pts = [];
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const sx = mx + (((i + 0.5) / N) * 2 - 1) * (m / 2),
        sy = my + (((j + 0.5) / N) * 2 - 1) * (m / 2);
      const ix = Math.round(sx),
        iy = Math.round(sy);
      if (ix < 0 || iy < 0 || ix >= px || iy >= px) continue;
      const on = img[(iy * px + ix) * 4 + 3] > 128;
      const nx = (sx - mx) / (m / 2),
        ny = (sy - my) / (m / 2);
      if (inv) {
        if (on) continue;
        if (inv === "circle" && Math.hypot(nx, ny) > 0.96) continue;
        if (
          inv === "box" &&
          Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4) > Math.pow(0.9, 4)
        )
          continue;
      } else if (!on) continue;
      pts.push([nx, ny]);
    }
  if (rc && pts.length) {
    let ax0 = 1e9,
      ax1 = -1e9,
      ay0 = 1e9,
      ay1 = -1e9;
    for (const [qx, qy] of pts) {
      if (qx < ax0) ax0 = qx;
      if (qx > ax1) ax1 = qx;
      if (qy < ay0) ay0 = qy;
      if (qy > ay1) ay1 = qy;
    }
    const ox = (ax0 + ax1) / 2,
      oy = (ay0 + ay1) / 2;
    for (const q of pts) {
      q[0] -= ox;
      q[1] -= oy;
    }
  }
  maskCache.set(ck, pts);
  return pts;
}

function drawMark(ctx, S, t, o, cfg) {
  const cx = S / 2,
    cy = S / 2,
    R = (S / 2) * (cfg.fit ?? 0.88);
  const rs = rscale(S) * (o.mini ? 1.8 : 1);
  const p = proj(0.15 * Math.sin(t * 0.4), 0.13 * Math.sin(t * 0.31), cx, cy, R);
  const pts = pathDots(
    cfg.key,
    MARK_PATHS[cfg.key],
    o.mini ? cfg.nMini ?? 12 : cfg.n ?? 26,
    cfg.vb,
    cfg.stroke,
    cfg.invert,
    cfg.recenter
  );
  const wave = (((t * (cfg.speed ?? 0.4)) % 1 + 1) % 1) * 2.4 - 1.2;
  const dots = [];
  for (const [gx, gy] of pts) {
    let crest;
    if (cfg.motion === "scan")
      crest = Math.exp(-Math.pow(gy - wave, 2) / 0.05);
    else if (cfg.motion === "sweep") {
      const ph = ((Math.atan2(gy, gx) / TAU + 0.5 - t * 0.3) % 1 + 1) % 1;
      crest = Math.exp(-Math.pow(ph - 0.5, 2) / 0.014);
    } else crest = Math.exp(-Math.pow((gx - gy) * 0.5 - wave, 2) / 0.05);
    const [x, y, z] = p(gx, -gy, 0);
    const dep = (z + 1) / 2;
    const d = {
      x,
      y,
      z,
      r: (0.78 + 0.72 * dep + 0.45 * crest) * rs,
      v: (cfg.v ?? 0.58) + 0.15 * dep + 0.3 * crest,
    };
    if (cfg.grad) {
      const m = clamp01((gy + 1) / 2);
      d.c = [
        lerp(cfg.grad[0][0], cfg.grad[1][0], m),
        lerp(cfg.grad[0][1], cfg.grad[1][1], m),
        lerp(cfg.grad[0][2], cfg.grad[1][2], m),
      ];
    }
    dots.push(d);
  }
  paint(ctx, dots, cfg.accent ?? null, cfg.accent ? 0.9 : 0, 0.3);
}

const mk = (cfg) => (ctx, S, t, o) => drawMark(ctx, S, t, o, cfg);

/* Envelope / Email Mark */
function drawEmail(ctx, S, t, o) {
  const cx = S / 2,
    cy = S / 2,
    R = (S / 2) * 0.8;
  const rs = rscale(S) * (o.mini ? 1.8 : 1);
  const p = proj(0.14 * Math.sin(t * 0.4), 0.14 * Math.sin(t * 0.3), cx, cy, R);
  const w = 0.88,
    h = 0.6,
    r = 0.24;
  const cyc = ((t * 0.3) % 1 + 1) % 1;
  const lift = smooth(Math.sin(clamp01(cyc * 1.5) * Math.PI));
  const show = clamp01((lift - 0.2) / 0.3);
  const step = o.mini ? 0.28 : 0.128;
  const dots = [];

  const dot = (gx, gy, z0, v, mul) => {
    const [x, y, z] = p(gx, -gy, z0 || 0);
    const dep = (z + 1) / 2;
    dots.push({
      x,
      y,
      z,
      r: (0.82 + 1.5 * dep) * rs,
      v: v + 0.44 * dep,
      a: (0.62 + 0.38 * dep) * (mul ?? 1),
    });
  };
  const node = (gx, gy, z0, mul) => {
    const [x, y, z] = p(gx, -gy, z0 || 0);
    const dep = (z + 1) / 2;
    dots.push({
      x,
      y,
      z,
      r: (1.22 + 1.5 * dep) * rs,
      v: 0.62 + 0.4 * dep,
      a: (0.68 + 0.32 * dep) * (mul ?? 1),
    });
  };
  const line = (ax, ay, bx, by, v, z0, mul) => {
    const L = Math.hypot(bx - ax, by - ay),
      n = Math.max(2, Math.round(L / step));
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      dot(ax + (bx - ax) * f, ay + (by - ay) * f, z0, v, mul);
    }
  };

  const body = [];
  const arc = (ax, ay, a0, a1) => {
    for (let i = 0; i <= 5; i++) {
      const a = a0 + ((a1 - a0) * i) / 5;
      body.push([ax + Math.cos(a) * r, ay + Math.sin(a) * r]);
    }
  };
  body.push([-w + r, -h], [w - r, -h]);
  arc(w - r, -h + r, -Math.PI / 2, 0);
  body.push([w, h - r]);
  arc(w - r, h - r, 0, Math.PI / 2);
  body.push([-w + r, h]);
  arc(-w + r, h - r, Math.PI / 2, Math.PI);
  body.push([-w, -h + r]);
  arc(-w + r, -h + r, Math.PI, Math.PI * 1.5);

  let perLen = 0;
  for (let i = 0; i < body.length; i++) {
    const a = body[i],
      b = body[(i + 1) % body.length];
    perLen += Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  const bodyPath = perimeter(body);
  const N = Math.max(8, Math.round(perLen / step));
  for (let i = 0; i < N; i++) {
    const [gx, gy] = bodyPath((i + 0.5) / N);
    dot(gx, gy, 0, 0.5);
  }

  const kx = w - r * 0.3,
    ky = h - r * 0.3;
  node(-kx, -ky);
  node(kx, -ky);
  node(kx, ky);
  node(-kx, ky);

  if (show > 0.02) {
    const lw = w * 0.6,
      lh = h * 0.62,
      lr = 0.1,
      lz = -0.06;
    const ly = 0;
    line(-lw + lr, ly - lh, lw - lr, ly - lh, 0.56, lz, show);
    line(-lw + lr, ly + lh, lw - lr, ly + lh, 0.56, lz, show);
    line(-lw, ly - lh + lr, -lw, ly + lh - lr, 0.56, lz, show);
    line(lw, ly - lh + lr, lw, ly + lh - lr, 0.56, lz, show);
    if (!o.mini) {
      line(-lw * 0.55, ly - lh * 0.3, lw * 0.55, ly - lh * 0.3, 0.5, lz, show);
      line(-lw * 0.55, ly + lh * 0.12, lw * 0.28, ly + lh * 0.12, 0.5, lz, show);
    }
    node(-lw, ly - lh, lz, show);
    node(lw, ly - lh, lz, show);
  }

  const apex = lerp(0.34 * h, -1.5 * h, lift);
  const fx = w - r * 0.4,
    fy = -h + r * 0.1;
  line(-fx, fy, 0, apex, 0.6, 0.07);
  line(fx, fy, 0, apex, 0.6, 0.07);
  node(0, apex, 0.08);
  paint(ctx, dots, null, 0, 0.3);
}

const MODES = {
  github: {
    draw: mk({
      key: "github",
      n: 30,
      nMini: 13,
      motion: "diag",
      invert: "circle",
      recenter: true,
      v: 0.62,
    }),
    accent: null,
    speed: 1,
  },
  x: {
    draw: mk({ key: "x", n: 30, nMini: 12, motion: "sweep", fit: 0.7, v: 0.64 }),
    accent: null,
    speed: 1,
  },
  instagram: {
    draw: mk({
      key: "instagram",
      n: 28,
      nMini: 13,
      motion: "sweep",
      fit: 0.74,
      grad: [
        [151, 78, 200],
        [250, 140, 70],
      ],
      v: 0.68,
    }),
    accent: null,
    speed: 1,
  },
  linkedin: {
    draw: mk({
      key: "linkedin",
      n: 30,
      nMini: 13,
      motion: "scan",
      speed: 0.38,
      invert: "box",
      accent: [40, 130, 220],
      v: 0.66,
    }),
    accent: null,
    speed: 1,
  },
  email: { draw: drawEmail, accent: null, speed: 1 },
};

const SOCIALS = [
  {
    mode: "x",
    name: "Twitter / X",
    shimmer: "Posting…",
    href: "https://x.com/argus_intel_",
  },
  {
    mode: "linkedin",
    name: "LinkedIn",
    shimmer: "Connecting…",
    href: "https://www.linkedin.com/in/argus-intelligence-16742b427/",
  },
  {
    mode: "instagram",
    name: "Instagram",
    shimmer: "Sharing…",
    href: "https://www.instagram.com/argusintelligence.ai?igsi=MXZsaGVrd2RsdzIwbg==",
  },
  {
    mode: "email",
    name: "Email",
    shimmer: "Sending…",
    href: "mailto:argusintelligence.ai@gmail.com",
  },
];

export default function SocialOrbs() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const canvases = containerRef.current.querySelectorAll("canvas[data-mode]");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const anims = [];
    const size = 80;

    canvases.forEach((canvas) => {
      const modeKey = canvas.dataset.mode;
      const mode = MODES[modeKey];
      if (!mode) return;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const animObj = {
        canvas,
        visible: true,
        frame: (t) => {
          ctx.clearRect(0, 0, size, size);
          mode.draw(ctx, size, t * mode.speed, { mini: false });
        },
      };
      anims.push(animObj);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const found = anims.find((a) => a.canvas === e.target);
        if (found) found.visible = e.isIntersecting;
      });
    });
    anims.forEach((a) => observer.observe(a.canvas));

    let rafId;
    const tick = () => {
      if (document.visibilityState !== "hidden") {
        const hasVisible = anims.some((a) => a.visible);
        if (hasVisible) {
          const t = performance.now() / 1000;
          for (const a of anims) {
            if (a.visible) a.frame(t);
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className={styles.orbsRow}>
        {SOCIALS.map((soc) => {
          const isMail = soc.href.startsWith("mailto:");
          return (
            <a
              key={soc.mode}
              href={soc.href}
              target={isMail ? "_self" : "_blank"}
              rel={isMail ? undefined : "noopener noreferrer"}
              className={styles.socialOrb}
              aria-label={soc.name}
              title={soc.name}
              onClick={(e) => {
                if (isMail) {
                  e.preventDefault();
                  window.location.href = soc.href;
                }
              }}
            >
              <canvas
                data-mode={soc.mode}
                className={styles.orbCanvas}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
