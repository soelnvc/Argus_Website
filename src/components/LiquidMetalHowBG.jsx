"use client";

import React, { useEffect, useRef } from "react";
import GlassSurface from "./GlassSurface";
import styles from "./LiquidMetalHowBG.module.css";

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float t = u_time * 0.32;

  // Diagonal rotation matching the sweeping silk curves in the reference image
  float ang = 0.58;
  mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  vec2 q = rot * p;

  // Liquid metal multi-octave fluid warping
  vec2 d = q;
  for (int i = 1; i <= 4; i++) {
    float fi = float(i);
    d += vec2(
      sin(d.y * fi * 0.9 + t * 0.45 + fi * 1.4) * 0.36 / fi,
      cos(d.x * fi * 0.85 - t * 0.38 + fi * 0.8) * 0.36 / fi
    );
  }

  // Primary undulating fold wave
  float fold = sin(d.x * 2.2 + sin(d.y * 1.7 + t * 0.35) * 1.35 + t * 0.45);
  
  // Secondary silk ridge ripples
  float ridge = sin(d.x * 4.4 + d.y * 2.2 - t * 0.55);
  float normRidge = pow(max(0.0, ridge * 0.5 + 0.5), 2.4);

  // Exact user palette (Hex values):
  // #000000 - Pure Black
  vec3 c_black    = vec3(0.0, 0.0, 0.0);
  // #050418 - Deep Midnight Navy
  vec3 c_obsidian = vec3(0.0196, 0.0157, 0.0941);
  // #000839 - Rich Indigo
  vec3 c_indigo   = vec3(0.0, 0.0314, 0.2235);
  // #6400FF - Electric Violet
  vec3 c_violet   = vec3(0.3922, 0.0, 1.0);
  // #D45BF0 - Luminous Magenta-Pink
  vec3 c_magenta  = vec3(0.8314, 0.3569, 0.9412);
  // Glossy specular highlight
  vec3 c_glint    = vec3(0.98, 0.88, 1.0);

  // Fluid color grading through the folds
  vec3 color = mix(c_black, c_obsidian, smoothstep(-0.4, 0.15, fold));
  color = mix(color, c_indigo, smoothstep(0.0, 0.45, fold));
  color = mix(color, c_violet, smoothstep(0.35, 0.75, fold));
  color = mix(color, c_magenta, smoothstep(0.68, 0.98, fold));

  // Add rich magenta-pink secondary ridge highlights
  color += c_magenta * normRidge * 0.45;

  // Glossy liquid specular glints running along the crests
  float spec1 = pow(max(0.0, sin(d.x * 2.2 + sin(d.y * 1.7 + t * 0.35) * 1.35 + t * 0.45 + 0.2)), 14.0);
  float spec2 = pow(max(0.0, cos(d.y * 3.6 + d.x * 1.9 - t * 0.65)), 22.0);
  color += c_glint * (spec1 * 0.65 + spec2 * 0.45);

  // Soft edge vignette for seamless transition into adjacent sections
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float vig = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
  vig = clamp(pow(16.0 * vig, 0.38), 0.0, 1.0);
  color *= mix(0.7, 1.0, vig);

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function LiquidMetalHowBG({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { alpha: false, antialias: false }) ||
      canvas.getContext("experimental-webgl");
    if (!gl) return;

    // Helper: compile shader
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Full screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uTime = gl.getUniformLocation(prog, "u_time");

    let animId;
    let startTime = performance.now();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (animId) cancelAnimationFrame(animId);
          animId = null;
        } else {
          startTime = performance.now();
          if (!animId) render(performance.now());
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // Dynamic DPR: 1 on mobile, 2 on desktop to save mobile GPU
    const dpr = typeof window !== 'undefined' && window.innerWidth <= 768 ? 1 : Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas || !gl) return;
      const rect = canvas.getBoundingClientRect();
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    resize();
    window.addEventListener("resize", resize);

    const render = (now) => {
      const elapsed = (now - startTime) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <div className={`${styles.bgContainer} ${className}`}>
      {/* 1. Underlying live WebGL liquid metal fluid canvas */}
      <canvas ref={canvasRef} className={styles.liquidCanvas} />

      {/* 2. GlassSurface from HowSectionBGLiquidMetalShader.txt providing chromatic refraction */}
      <GlassSurface
        width="100%"
        height="100%"
        borderRadius={0}
        borderWidth={0.06}
        brightness={55}
        opacity={0.92}
        blur={12}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        className={styles.glassSurfaceFilter}
      />

      {/* 3. Dark gradient overlays to integrate with page header and footer seamlessly */}
      <div className={styles.darkFadeOverlay} />
    </div>
  );
}
