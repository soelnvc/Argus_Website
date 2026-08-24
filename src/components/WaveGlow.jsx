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

    // Master Wave Shader: 50% Pure Black Top + High Saturation Purple/Pink/White Wave
    const fragSrc = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uIsForeground; // 0.0 for ambient background glow, 1.0 for crisp text

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
        float t = uTime * 0.48; // Smooth fluid wave undulation

        // Traveling harmonic wave undulation
        float w1 = sin(uv.x * 3.14159 * 1.5 - t * 0.9) * 0.048;
        float w2 = cos(uv.x * 3.14159 * 3.2 + t * 0.6) * 0.024;
        float w3 = sin(uv.x * 3.14159 * 0.8 + t * 0.35) * 0.035;
        float n  = (noise(vec2(uv.x * 4.0 + t * 0.2, uv.y * 3.0 + t * 0.1)) - 0.5) * 0.018;

        // Wave elevation offset that undulates the gradient boundary organically
        float waveOffset = w1 + w2 + w3 + n;
        float y = uv.y - waveOffset;

        // Palette Color Stops (Pure Black, Deep Velvet Purple, Electric Purple, Light Purple-Pink, White)
        vec3 cPureBlack   = vec3(0.015, 0.008, 0.025); // #040206 (50% Pure Black)
        vec3 cDeepPurple  = vec3(0.22, 0.01, 0.44);    // #380270 (Dark saturated purple)
        vec3 cMidPurple   = vec3(0.52, 0.02, 0.88);    // #8505e0 (High Saturation electric purple)
        vec3 cBrightPurp  = vec3(0.70, 0.10, 0.96);    // #b31af5 (Vibrant purple)
        vec3 cPinkPurple  = vec3(0.92, 0.32, 0.86);    // #eb52dc (Light purple-pink)
        vec3 cSoftPink    = vec3(0.98, 0.62, 0.86);    // #fa9edb (Radiant pink)
        vec3 cWhiteBlend  = vec3(1.00, 0.98, 1.00);    // #ffffff (5% White blend)

        vec3 col = cPureBlack;

        // 1. Top 50% (y >= 0.50): 100% Pure Black
        if (y >= 0.50) {
          col = cPureBlack;
        }
        // 2. Next 10% (0.40 <= y < 0.50): Black blending into Deep Purple
        else if (y >= 0.40) {
          float f = (0.50 - y) / 0.10;
          float easeF = smoothstep(0.0, 1.0, f);
          col = mix(cPureBlack, cDeepPurple, easeF);
        }
        // 3. Next 25% (0.15 <= y < 0.40): 25% Dark-Medium Purple (High Saturation)
        else if (y >= 0.15) {
          float f = (0.40 - y) / 0.25;
          if (f < 0.5) {
            col = mix(cDeepPurple, cMidPurple, f / 0.5);
          } else {
            col = mix(cMidPurple, cBrightPurp, (f - 0.5) / 0.5);
          }
        }
        // 4. Next 10% (0.05 <= y < 0.15): 10% Light Purple-Pink
        else if (y >= 0.05) {
          float f = (0.15 - y) / 0.10;
          col = mix(cBrightPurp, cPinkPurple, f * 0.7);
          col = mix(col, cSoftPink, smoothstep(0.4, 1.0, f));
        }
        // 5. Bottom 5% (0.00 <= y < 0.05): 5% White Blend
        else {
          float f = clamp((0.05 - y) / 0.05, 0.0, 1.0);
          col = mix(cSoftPink, cWhiteBlend, f);
        }

        // Color saturation & richness booster
        col = pow(col, vec3(1.12));

        // Film grain noise for signature analog dither / stipple effect
        float grain = (hash(gl_FragCoord.xy + fract(uTime * 19.31)) - 0.5) * 0.05;
        col = clamp(col + vec3(grain * 0.8, grain * 0.4, grain * 0.9), 0.0, 1.0);

        // Alpha calculation
        float alpha = 1.0;
        if (uIsForeground < 0.5) {
          // Background atmospheric aura falloff
          alpha = smoothstep(0.54, 0.46, y);
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

      // Draw Background Glow Canvas
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

      // Draw Foreground Text Canvas
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
      {/* 1. Ambient Background Glow (Atmospheric Purple/Pink Bleed) */}
      <canvas
        ref={bgCanvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          filter: "blur(28px)",
          transform: "scale(1.06)",
          opacity: 0.95,
        }}
      />

      {/* 2. Text-Masked Foreground Canvas (Giant text overflowing the canvas) */}
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
            overflow: "visible",
          }}
        >
          <defs>
            <mask id="argusTextMask">
              <rect width="100%" height="100%" fill="black" />
              <text
                x="50%"
                y="96%"
                textAnchor="middle"
                fill="white"
                fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                fontWeight="900"
                fontSize="490"
                letterSpacing="-0.045em"
              >
                {text}
              </text>
            </mask>
          </defs>

          {/* ForeignObject with giant overflowing text mask */}
          <foreignObject
            width="100%"
            height="100%"
            mask="url(#argusTextMask)"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
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
          opacity: 0.20,
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
