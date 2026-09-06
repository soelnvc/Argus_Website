const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/GlassSurface.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Divide the scale by 10 to prevent massive out-of-bounds displacement which causes Chrome to drop the filter
content = content.replace(
  /scale={\(distortionScale \+ redOffset\)\.toString\(\)}/g,
  'scale={((distortionScale + redOffset) * 0.1).toString()}'
);
content = content.replace(
  /scale={\(distortionScale \+ greenOffset\)\.toString\(\)}/g,
  'scale={((distortionScale + greenOffset) * 0.1).toString()}'
);
content = content.replace(
  /scale={\(distortionScale \+ blueOffset\)\.toString\(\)}/g,
  'scale={((distortionScale + blueOffset) * 0.1).toString()}'
);

fs.writeFileSync(filePath, content);
console.log('Successfully fixed GlassSurface.jsx scale');
