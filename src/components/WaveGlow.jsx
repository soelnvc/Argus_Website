"use client";
import React, { useEffect, useRef, useState } from "react";

export default function WaveGlow({ text = "ARGUS" }) {
  const bgCanvasRef = useRef(null);
  const fgCanvasRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    if (!bgCanvas || !fgCanvas) return;

    // Initialize WebGL context for both canvases
    function setupGL(canvas) {
      const gl =
        canvas.getContext("webgl2", {
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }) || canvas.getContext("webgl", { alpha: true });
      return gl;
    }

    const glBg = setupGL(bgCanvas);
    const glFg = setupGL(fgCanvas);
    if (!glBg || !glFg) return;

    const vertSrc = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Master Wave Shader: High Contrast Fiery Plasma Aurora
    const fragSrc = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uIsForeground; // 0.0 for ambient background, 1.0 for crisp text fill

      // High quality noise & hash
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        float t = uTime * 0.42; // Organic leisurely wave cycle

        // Dual-harmonic traveling wave profile matching Midu design (peaks and moving valleys)
        float w1 = sin(uv.x * 2.6 - t * 0.85) * 0.20;
        float w2 = cos(uv.x * 4.8 + t * 0.55 + 0.8) * 0.10;
        float w3 = sin(uv.x * 1.5 + t * 0.35 + 2.1) * 0.16;
        float n  = (noise(vec2(uv.x * 3.5 + t * 0.2, uv.y * 2.0 + t * 0.1)) - 0.5) * 0.07;

        // Base height anchor near lower third of the card
        float baseHeight = 0.24;
        float crestY = baseHeight + w1 + w2 + w3 + n;

        float dist = uv.y - crestY;

        float intensity = 0.0;
        if (dist <= 0.0) {
          // Inside the fiery body: rich, deep incandescent heat
          float depth = -dist;
          intensity = 1.0 + (1.0 - smoothstep(0.0, 0.35, depth)) * 0.35;
          intensity = mix(intensity, 0.85, smoothstep(0.2, 0.5, depth));
        } else {
          // Atmospheric falloff above wave crest
          intensity = exp(-dist * 4.6) * 1.15;
          intensity += exp(-dist * 1.8) * 0.35; // Soft secondary bloom
        }

        // Add traveling hot spots along the wave crests (matching the peach hotspots on M and U)
        float crestHotspot = max(0.0, 1.0 - abs(dist) * 4.5);
        float crestPeakBoost = max(0.0, w1 + w3) * 1.4;
        intensity += crestHotspot * crestPeakBoost * 0.65;

        // High Contrast Palette directly matched from reference frames:
        vec3 cVoid     = vec3(0.03, 0.01, 0.01); // Pure deep card black #080202
        vec3 cDarkRed  = vec3(0.38, 0.02, 0.00); // Deep rich crimson #610500
        vec3 cFireRed  = vec3(0.92, 0.10, 0.01); // Vivid fiery red #eb1a02
        vec3 cOrange   = vec3(1.00, 0.38, 0.12); // Hot flame orange #ff611f
        vec3 cCoral    = vec3(1.00, 0.62, 0.40); // Incandescent coral #ff9e66
        vec3 cPeach    = vec3(1.00, 0.85, 0.72); // Creamy warm peach #ffd9b8
        vec3 cWhiteHot = vec3(1.00, 0.96, 0.92); // White-hot core highlight

        vec3 col = cVoid;
        if (intensity < 0.20) {
          col = mix(cVoid, cDarkRed, intensity / 0.20);
        } else if (intensity < 0.55) {
          col = mix(cDarkRed, cFireRed, (intensity - 0.20) / 0.35);
        } else if (intensity < 0.88) {
          col = mix(cFireRed, cOrange, (intensity - 0.55) / 0.33);
        } else if (intensity < 1.18) {
          col = mix(cOrange, cCoral, (intensity - 0.88) / 0.30);
        } else if (intensity < 1.45) {
          col = mix(cCoral, cPeach, (intensity - 1.18) / 0.27);
        } else {
          col = mix(cPeach, cWhiteHot, clamp((intensity - 1.45) / 0.35, 0.0, 1.0));
        }

        // Dynamic S-curve contrast boost
        col = pow(col, vec3(1.22));

        // Film grain noise for signature analog dither / stipple effect
        float grain = (hash(gl_FragCoord.xy + fract(uTime * 17.13)) - 0.5) * 0.065;
        col = clamp(col + vec3(grain * 1.2, grain * 0.4, grain * 0.2), 0.0, 1.0);

        // Alpha calculation
        float alpha = clamp(intensity * 1.25, 0.0, 1.0);
        if (uIsForeground > 0.5) {
          // Foreground text is crisp and fully opaque where color exists
          alpha = 1.0;
        } else {
          // Background fades smoothly at top edges
          alpha *= smoothstep(1.0, 0.85, uv.y);
        }

        gl_FragColor = vec4(col, alpha);
      }
    `;

    function createProgram(gl) {
      const vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vs, vertSrc);
      gl.compileShader(vs);

      const fs = gl.createShader(gl.FRAGMENT_SHADER, fragSrc);
      gl.shaderSource(fs, fragSrc);
      gl.compileShader(fs);

      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );

      const posLoc = gl.getAttribLocation(prog, "position");
      const uTimeLoc = gl.getUniformLocation(prog, "uTime");
      const uResLoc = gl.getUniformLocation(prog, "uResolution");
      const uIsFgLoc = gl.getUniformLocation(prog, "uIsForeground");

      return { gl, prog, buf, posLoc, uTimeLoc, uResLoc, uIsFgLoc };
    }

    const bgProg = createProgram(glBg);
    const fgProg = createProgram(glFg);

    function resizeCanvas(canvas, gl) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    function resize() {
      if (bgCanvas && glBg) resizeCanvas(bgCanvas, glBg);
      if (fgCanvas && glFg) resizeCanvas(fgCanvas, glFg);
    }

    window.addEventListener("resize", resize);
    resize();

    let animId;
    const startTime = performance.now();

    function render() {
      const elapsed = (performance.now() - startTime) * 0.001;

      // Draw Background Canvas (Atmospheric Glow)
      if (glBg && bgProg) {
        glBg.useProgram(bgProg.prog);
        glBg.enableVertexAttribArray(bgProg.posLoc);
        glBg.bindBuffer(glBg.ARRAY_BUFFER, bgProg.buf);
        glBg.vertexAttribPointer(bgProg.posLoc, 2, glBg.FLOAT, false, 0, 0);

        glBg.uniform1f(bgProg.uTimeLoc, elapsed);
        glBg.uniform2f(bgProg.uResLoc, bgCanvas.width, bgCanvas.height);
        glBg.uniform1f(bgProg.uIsFgLoc, 0.0);

        glBg.drawArrays(glBg.TRIANGLES, 0, 6);
      }

      // Draw Foreground Canvas (Clipped to Text)
      if (glFg && fgProg) {
        glFg.useProgram(fgProg.prog);
        glFg.enableVertexAttribArray(fgProg.posLoc);
        glFg.bindBuffer(glFg.ARRAY_BUFFER, fgProg.buf);
        glFg.vertexAttribPointer(fgProg.posLoc, 2, glFg.FLOAT, false, 0, 0);

        glFg.uniform1f(fgProg.uTimeLoc, elapsed);
        glFg.uniform2f(fgProg.uResLoc, fgCanvas.width, fgCanvas.height);
        glFg.uniform1f(fgProg.uIsFgLoc, 1.0);

        glFg.drawArrays(glFg.TRIANGLES, 0, 6);
      }

      animId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {/* 1. Ambient Background Glow (Atmospheric bleeding aura) */}
      <canvas
        ref={bgCanvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          filter: "blur(32px)",
          transform: "scale(1.08)",
          opacity: 0.92,
        }}
      />

      {/* 2. Text-Masked Foreground Canvas (Crisp letters filled with the exact living wave) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMax meet"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
          }}
        >
          <defs>
            <mask id="argusTextMask">
              <rect width="100%" height="100%" fill="black" />
              <text
                x="50%"
                y="94%"
                textAnchor="middle"
                fill="white"
                fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                fontWeight="900"
                fontSize="385"
                letterSpacing="-0.045em"
              >
                {text}
              </text>
            </mask>
          </defs>

          {/* ForeignObject embeds the unblurred WebGL canvas masked by the giant text */}
          <foreignObject
            width="100%"
            height="100%"
            mask="url(#argusTextMask)"
            style={{ width: "100%", height: "100%" }}
          >
            <canvas
              ref={fgCanvasRef}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
              }}
            />
          </foreignObject>
        </svg>
      </div>

      {/* 3. Subtle Film Grain Dither Overlay */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.22,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
