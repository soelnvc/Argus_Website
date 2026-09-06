const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/GlassSurface.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Completely rewrite GlassSurface.jsx to be clean and simple, using native feTurbulence in the DOM
const newComponentCode = `"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useId } from "react";
import "./GlassSurface.css";

const GlassSurface = ({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07, // Unused in pure turbulence map, kept for API compat
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = "R",
  yChannel = "G",
  mixBlendMode = "difference",
  className = "",
  style = {},
}) => {
  const uniqueId = useId().replace(/:/g, "-");
  const filterId = \`glass-filter-\${uniqueId}\`;

  const [svgSupported, setSvgSupported] = useState(false);

  useEffect(() => {
    setSvgSupported(supportsSVGFilters());
  }, []);

  const supportsSVGFilters = () => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return false;
    }

    const isWebkit =
      /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);

    if (isWebkit || isFirefox) {
      return false;
    }

    const div = document.createElement("div");
    div.style.backdropFilter = \`url(#\${filterId})\`;
    return div.style.backdropFilter !== "";
  };

  const containerStyle = {
    ...style,
    width: typeof width === "number" ? \`\${width}px\` : width,
    height: typeof height === "number" ? \`\${height}px\` : height,
    borderRadius: typeof borderRadius === "number" ? \`\${borderRadius}px\` : borderRadius,
    "--glass-frost": backgroundOpacity,
    "--glass-saturation": saturation,
    "--filter-id": \`url(#\${filterId})\`,
  };

  return (
    <div
      className={\`glass-surface \${svgSupported ? "glass-surface--svg" : "glass-surface--fallback"} \${className}\`}
      style={containerStyle}
    >
      {svgSupported && (
        <svg className="glass-surface__filter" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter
              id={filterId}
              colorInterpolationFilters="sRGB"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
            >
              {/* Generate thick liquid glass ripples natively in the DOM */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012"
                numOctaves="2"
                result="noise"
              />
              <feGaussianBlur in="noise" stdDeviation={1.5} result="liquidMap" />

              <feDisplacementMap
                in="SourceGraphic"
                in2="liquidMap"
                scale={(distortionScale + redOffset).toString()}
                xChannelSelector={xChannel}
                yChannelSelector={yChannel}
                result="dispRed"
              />
              <feColorMatrix
                in="dispRed"
                type="matrix"
                values="1 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
                result="red"
              />

              <feDisplacementMap
                in="SourceGraphic"
                in2="liquidMap"
                scale={(distortionScale + greenOffset).toString()}
                xChannelSelector={xChannel}
                yChannelSelector={yChannel}
                result="dispGreen"
              />
              <feColorMatrix
                in="dispGreen"
                type="matrix"
                values="0 0 0 0 0
                        0 1 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
                result="green"
              />

              <feDisplacementMap
                in="SourceGraphic"
                in2="liquidMap"
                scale={(distortionScale + blueOffset).toString()}
                xChannelSelector={xChannel}
                yChannelSelector={yChannel}
                result="dispBlue"
              />
              <feColorMatrix
                in="dispBlue"
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 1 0 0
                        0 0 0 1 0"
                result="blue"
              />

              <feBlend in="red" in2="green" mode="screen" result="rg" />
              <feBlend in="rg" in2="blue" mode="screen" result="output" />
              
              {/* Apply general blur to the refracted output */}
              <feGaussianBlur in="output" stdDeviation={displace.toString()} result="blurred" />
              
              {/* Saturate the final result */}
              <feColorMatrix type="saturate" values={saturation} in="blurred" />
            </filter>
          </defs>
        </svg>
      )}

      <div className="glass-surface__content">{children}</div>
    </div>
  );
};

export default GlassSurface;
`;

fs.writeFileSync(filePath, newComponentCode);
console.log('Successfully rewritten GlassSurface.jsx');
