"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./LavaBackground.module.css";

export default function LavaBackground({ children, className = "" }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Parallax Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Background deep layer parallax (slower scroll & subtle scale)
  const canvasY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const canvasScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.94]);

  // Center glass box foreground parallax (floating rate)
  const boxY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const boxScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.97]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animationFrameId;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x05040a, 1);
    
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

    const resize = () => {
      const width = Math.max(1, container.clientWidth || window.innerWidth);
      const height = Math.max(1, container.clientHeight || window.innerHeight);
      renderer.setSize(width, height, false);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      const aspect = width / height;
      camera.left = -aspect;
      camera.right = aspect;
      camera.bottom = -1;
      camera.top = 1;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", resize);
    resize();
    camera.position.z = 1;

    // Dense grid covering full screen with parallax headroom
    const gridSizeX = 60;
    const gridSizeY = 36;
    const spacing = 0.085;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const scales = [];

    for (let x = -gridSizeX; x <= gridSizeX; x++) {
      for (let y = -gridSizeY; y <= gridSizeY; y++) {
        positions.push(x * spacing, y * spacing, 0);
        scales.push(1);
      }
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new THREE.Float32BufferAttribute(scales, 1));

    // Dynamic Purple Shaded Palette
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorDark: { value: new THREE.Color(0x4c1d95) },  // Deep royal violet
        colorMid: { value: new THREE.Color(0xa855f7) },   // Vivid electric purple
        colorLight: { value: new THREE.Color(0xf3e8ff) }, // Luminous lilac glow
      },
      vertexShader: `
        attribute float scale;
        varying vec2 vUv;
        varying float vScale;
        varying float vIntensity;
        uniform float time;
        
        void main() {
          vUv = position.xy;
          float dist = length(position.xy);
          float wave = sin(dist * 5.0 - time * 2.5) * 0.5 + 0.5;
          vIntensity = wave;
          float animatedScale = scale * wave;
          vScale = animatedScale;
          
          gl_PointSize = animatedScale * 9.5; 
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorDark;
        uniform vec3 colorMid;
        uniform vec3 colorLight;
        varying vec2 vUv;
        varying float vScale;
        varying float vIntensity;
        
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if(dist > 0.5) discard;
          
          // Smooth radial dot profile
          float dotShape = smoothstep(0.5, 0.15, dist);
          
          // Shaded purple gradient driven by wave intensity
          vec3 purpleGradient;
          if (vIntensity < 0.5) {
            purpleGradient = mix(colorDark, colorMid, vIntensity * 2.0);
          } else {
            purpleGradient = mix(colorMid, colorLight, (vIntensity - 0.5) * 2.0);
          }
          
          // Radial highlight in center of each dot
          vec3 finalColor = mix(purpleGradient, colorLight, (1.0 - dist * 2.0) * 0.35);
          
          gl_FragColor = vec4(finalColor, vScale * dotShape * 0.95);
        }
      `,
      transparent: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      material.uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResizeSafe);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };

    function handleResizeSafe() {
      resize();
    }
  }, []);

  return (
    <div ref={containerRef} className={`${styles.lavaWrapper} ${className}`}>
      {/* Background Parallax Canvas */}
      <motion.div 
        className={styles.canvasStickyHolder}
        style={{ y: canvasY, scale: canvasScale }}
      >
        <canvas ref={canvasRef} className={styles.lavaCanvas} />
      </motion.div>
      
      <div className={styles.contentLayer}>
        {/* Transparent, purely blurry center box with foreground parallax */}
        <div className={styles.centerBoxWrapper}>
          <motion.div 
            className={styles.glassBox}
            style={{ y: boxY, scale: boxScale }}
          >
            <div className={styles.glassContent}>
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
