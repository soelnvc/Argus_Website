const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/GlassSurface.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add feImageRef
content = content.replace(
  'const containerRef = useRef(null);',
  'const containerRef = useRef(null);\n  const feImageRef = useRef(null);'
);

// 2. Add generateDisplacementMap and updateDisplacementMap
const generateMapCode = `
  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = Math.max(1, Math.round(rect?.width || 200));
    const actualHeight = Math.max(1, Math.round(rect?.height || 60));

    const svgContent = \`
      <svg viewBox="0 0 \${actualWidth} \${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="1.5" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    \`;

    return \`data:image/svg+xml,\${encodeURIComponent(svgContent)}\`;
  };

  const updateDisplacementMap = () => {
    const mapUrl = generateDisplacementMap();
    if (feImageRef.current) {
      feImageRef.current.setAttribute("href", mapUrl);
      feImageRef.current.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", mapUrl);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateDisplacementMap, 0);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setTimeout(updateDisplacementMap, 0);
  }, [width, height]);

  useEffect(() => {
    updateDisplacementMap();
`;
content = content.replace('  useEffect(() => {', generateMapCode);

// 3. Update the filter to use feImage again
const filterRegex = /<svg className="glass-surface__filter".*?<\/svg>/s;
const newFilterCode = `<svg className="glass-surface__filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feImage
              ref={feImageRef}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />

            <feDisplacementMap
              ref={redChannelRef}
              in="SourceGraphic"
              in2="map"
              id="redchannel"
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
              ref={greenChannelRef}
              in="SourceGraphic"
              in2="map"
              id="greenchannel"
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
              ref={blueChannelRef}
              in="SourceGraphic"
              in2="map"
              id="bluechannel"
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
            <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" result="blurred" />
            <feColorMatrix type="saturate" values={saturation} in="blurred" />
          </filter>
        </defs>
      </svg>`;

content = content.replace(filterRegex, newFilterCode);

fs.writeFileSync(filePath, content);
console.log('Successfully updated GlassSurface.jsx');
