#!/usr/bin/env node

/**
 * Image Optimization Script for Argus Website
 * Converts all PNG/JPG images to optimized WebP at correct display sizes.
 * 
 * Usage: node scripts/optimize-images.js
 */

import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = 'public';

// Max display dimensions per image category
const SIZE_MAP = {
  // Hazard card images — displayed at ~240×380 on desktop, 2x for retina
  'hazard images': { maxWidth: 480, maxHeight: 854, quality: 80 },
  // CCTV journey images — displayed in CCTV frame, ~640px wide max
  'images/fall.png': { maxWidth: 800, maxHeight: 600, quality: 80 },
  'images/machine.png': { maxWidth: 800, maxHeight: 600, quality: 80 },
  'images/restricted.png': { maxWidth: 800, maxHeight: 534, quality: 80 },
  'images/step_watch.jpg': { maxWidth: 480, quality: 80 },
  'images/step_understand.jpg': { maxWidth: 480, quality: 80 },
  'images/step_verify.jpg': { maxWidth: 480, quality: 80 },
  'images/step_act.jpg': { maxWidth: 480, quality: 80 },
  'cctv_fire.jpg': { maxWidth: 640, maxHeight: 640, quality: 80 },
  'og-image.png': { maxWidth: 1200, maxHeight: 630, quality: 85 },
};

const DEFAULT_CONFIG = { maxWidth: 800, quality: 80 };

function getConfig(relativePath) {
  // Check exact match first
  if (SIZE_MAP[relativePath]) return SIZE_MAP[relativePath];
  
  // Check directory-level match
  for (const [pattern, config] of Object.entries(SIZE_MAP)) {
    if (relativePath.startsWith(pattern + '/') || relativePath.startsWith(pattern)) {
      return config;
    }
  }
  
  return DEFAULT_CONFIG;
}

async function findImages(dir, baseDir = dir) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip copy directories and .next
      if (entry.name.endsWith(' copy') || entry.name === '.next' || entry.name === 'node_modules') continue;
      results.push(...await findImages(fullPath, baseDir));
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        // Skip SVG, favicon, icon files
        if (entry.name === 'favicon.png' || entry.name === 'icon.png') continue;
        
        const relativePath = fullPath.replace(baseDir + '/', '');
        results.push({ fullPath, relativePath, ext });
      }
    }
  }
  
  return results;
}

async function optimizeImage(image) {
  const config = getConfig(image.relativePath);
  const webpPath = image.fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  
  try {
    const originalStats = await stat(image.fullPath);
    const originalSize = originalStats.size;
    
    let pipeline = sharp(image.fullPath);
    
    // Resize to max dimensions while maintaining aspect ratio
    const resizeOptions = { 
      fit: 'inside', 
      withoutEnlargement: true 
    };
    if (config.maxWidth) resizeOptions.width = config.maxWidth;
    if (config.maxHeight) resizeOptions.height = config.maxHeight;
    
    pipeline = pipeline.resize(resizeOptions);
    
    // Convert to WebP
    pipeline = pipeline.webp({ 
      quality: config.quality || 80,
      effort: 6, // Higher effort = better compression (0-6)
    });
    
    await pipeline.toFile(webpPath);
    
    const newStats = await stat(webpPath);
    const newSize = newStats.size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    
    console.log(
      `✓ ${image.relativePath}: ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${savings}% smaller)`
    );
    
    return { original: originalSize, optimized: newSize, path: image.relativePath };
  } catch (err) {
    console.error(`✗ ${image.relativePath}: ${err.message}`);
    return null;
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
  return (bytes / (1024 * 1024)).toFixed(2) + 'MB';
}

async function main() {
  console.log('🔍 Scanning for images in public/...\n');
  
  const images = await findImages(PUBLIC_DIR);
  console.log(`Found ${images.length} images to optimize.\n`);
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  for (const image of images) {
    const result = await optimizeImage(image);
    if (result) {
      totalOriginal += result.original;
      totalOptimized += result.optimized;
    }
  }
  
  console.log('\n' + '─'.repeat(60));
  console.log(`Total: ${formatBytes(totalOriginal)} → ${formatBytes(totalOptimized)}`);
  console.log(`Savings: ${formatBytes(totalOriginal - totalOptimized)} (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
  console.log('─'.repeat(60));
  console.log('\n⚠️  Original files preserved. Update source code references to use .webp files.');
  console.log('   Then delete the original .png/.jpg files manually.\n');
}

main().catch(console.error);
