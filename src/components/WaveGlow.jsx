"use client";
import React, { useEffect, useRef } from "react";

export default function WaveGlow() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    }) || canvas.getContext("webgl", { alpha: true });

    if (!gl) return;

    const vertSrc = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // High contrast undulating wave fragment shader
    const fragSrc = `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;

      // Smooth noise helpers
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
        float aspect = uResolution.x / uResolution.y;
        float t = uTime * 0.55;

        // Wave profile calculations: multiple harmonic waves for realistic liquid crests
        // Peak on left, dip in middle, secondary crest on right (matching Midu design)
        float waveBase = 0.22;
        
        // Primary sweeping swell
        float w1 = sin(uv.x * 2.8 - t * 0.8) * 0.16;
        // Secondary harmonic undulation
        float w2 = cos(uv.x * 5.2 + t * 0.6) * 0.08;
        // Slow breathing crest
        float w3 = sin(uv.x * 1.4 + t * 0.35 + 1.2) * 0.22;
        // Organic noise modulation
        float n = (noise(vec2(uv.x * 3.0 + t * 0.2, t * 0.15)) - 0.5) * 0.09;

        // Mouse subtle interaction
        float mouseDist = length(uv - uMouse);
        float mouseLift = exp(-mouseDist * 3.0) * 0.08;

        // Left-biased elevation like the reference photo (strong crest on left, valley in center, rise on right)
        float leftBias = (1.0 - smoothstep(0.0, 0.65, uv.x)) * 0.24;
        float rightRise = smoothstep(0.65, 1.0, uv.x) * 0.16;

        float crestY = waveBase + w1 + w2 + w3 + n + leftBias + rightRise + mouseLift;

        // Distance from current pixel to wave ridge
        float distToCrest = uv.y - crestY;

        // Core intensity: high contrast exponential falloff
        float intensity = 0.0;
        if (distToCrest <= 0.0) {
          // Below the crest: deep saturated hot belly
          intensity = 1.0 - smoothstep(-0.45, 0.0, distToCrest) * 0.18;
          intensity = pow(intensity, 1.4);
        } else {
          // Above the crest: blazing atmospheric aurora falloff
          intensity = exp(-distToCrest * 4.2);
          // Add a second softer volumetric halo
          intensity += exp(-distToCrest * 1.8) * 0.45;
        }

        // Secondary ambient wave layered underneath for depth & rich contrast
        float crestY2 = crestY * 0.75 + 0.1 * sin(uv.x * 3.5 + t * 0.9);
        float dist2 = abs(uv.y - crestY2);
        float intensity2 = exp(-dist2 * 3.5) * 0.4;

        float totalEnergy = clamp(intensity + intensity2, 0.0, 1.5);

        // High contrast color palette:
        // 0.0 = Pure Black (#050505)
        // 0.2 = Deep Maroon Crimson (#520600)
        // 0.5 = Saturated Fiery Vermilion (#e61e00)
        // 0.85 = Neon Flame Orange-Coral (#ff5a26)
        // 1.15 = Warm Glowing Peach (#ff9f7d)
        // 1.4 = Incandescent White-Hot (#fff1ec)

        vec3 cDark     = vec3(0.02, 0.01, 0.01);
        vec3 cCrimson  = vec3(0.48, 0.03, 0.01);
        vec3 cFire     = vec3(0.95, 0.12, 0.01);
        vec3 cCoral    = vec3(1.00, 0.38, 0.16);
        vec3 cPeach    = vec3(1.00, 0.68, 0.52);
        vec3 cHotWhite = vec3(1.00, 0.96, 0.92);

        vec3 col = cDark;
        if (totalEnergy < 0.25) {
          col = mix(cDark, cCrimson, totalEnergy / 0.25);
        } else if (totalEnergy < 0.65) {
          col = mix(cCrimson, cFire, (totalEnergy - 0.25) / 0.40);
        } else if (totalEnergy < 0.95) {
          col = mix(cFire, cCoral, (totalEnergy - 0.65) / 0.30);
        } else if (totalEnergy < 1.25) {
          col = mix(cCoral, cPeach, (totalEnergy - 0.95) / 0.30);
        } else {
          col = mix(cPeach, cHotWhite, clamp((totalEnergy - 1.25) / 0.25, 0.0, 1.0));
        }

        // Contrast booster curve (S-curve)
        col = pow(col, vec3(1.25));

        // Smooth fade to card edge
        float edgeFade = smoothstep(0.0, 0.05, uv.x) * smoothstep(1.0, 0.95, uv.x) * smoothstep(1.0, 0.9, uv.y);
        
        // Output with rich alpha
        float alpha = clamp(totalEnergy * 1.3, 0.0, 1.0) * edgeFade;

        gl_FragColor = vec4(col, alpha);
      }
    `;

    function compileShader(type, src) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vert = compileShader(gl.VERTEX_SHADER, vertSrc);
    const frag = compileShader(gl.FRAGMENT_SHADER, fragSrc);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    // Geometry setup
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "position");
    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const uResLoc = gl.getUniformLocation(program, "uResolution");
    const uMouseLoc = gl.getUniformLocation(program, "uMouse");

    let animationFrameId;
    let mouse = { x: 0.3, y: 0.3, targetX: 0.3, targetY: 0.3 };

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = Math.floor(canvas.clientWidth * dpr);
      const displayHeight = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    }

    const handleMouseMove = (e) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = (e.clientX - rect.left) / rect.width;
      mouse.targetY = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", resize);
    resize();

    const startTime = performance.now();

    function render() {
      const now = performance.now();
      const elapsed = (now - startTime) * 0.001;

      resize();

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      gl.useProgram(program);
      gl.enableVertexAttribArray(posLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform2f(uMouseLoc, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        filter: "blur(22px)",
        transform: "scale(1.08)",
      }}
    />
  );
}
