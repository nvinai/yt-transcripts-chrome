// Import Required Libraries
const fs = require('fs');
const path = require('path');

// Define SVG Namespace
const SVG_NS = "http://www.w3.org/2000/svg";

// Create SVG Root Element
const svg = `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Paper -->
  <rect x="120" y="100" width="180" height="220" fill="white" stroke="#999999" stroke-width="2"/>
  <line x1="140" y1="140" x2="280" y2="140" stroke="#cccccc" stroke-width="1"/>
  <line x1="140" y1="170" x2="280" y2="170" stroke="#cccccc" stroke-width="1"/>
  <line x1="140" y1="200" x2="280" y2="200" stroke="#cccccc" stroke-width="1"/>
  <line x1="140" y1="230" x2="280" y2="230" stroke="#cccccc" stroke-width="1"/>
  <line x1="140" y1="260" x2="280" y2="260" stroke="#cccccc" stroke-width="1"/>
  
  <!-- Paper fold corner -->
  <path d="M300 100 L300 130 L270 100 Z" fill="#e6e6e6" stroke="#999999" stroke-width="1"/>
  
  <!-- Pencil - moved closer to notebook -->
  <g transform="translate(120, 150) rotate(0)">
    <rect x="0" y="0" width="150" height="15" fill="#FFD700" rx="2" ry="2"/>
    <rect x="0" y="0" width="20" height="15" fill="#FF6347" rx="2" ry="2"/>
    <polygon points="150,7.5 170,0 170,15" fill="#808080"/>
    <polygon points="170,0 180,7.5 170,15" fill="#404040"/>
  </g>
  
  <!-- Microphone - moved closer to notebook -->
  <g transform="translate(150, 260)">
    <rect x="-15" y="-50" width="30" height="70" rx="15" ry="15" fill="#444444" stroke="#222222" stroke-width="2"/>
    <path d="M -25,-10 C -25,30 25,30 25,-10" stroke="#444444" stroke-width="10" fill="none"/>
    <rect x="-5" y="30" width="10" height="30" fill="#444444"/>
    <rect x="-25" y="60" width="50" height="5" rx="2" ry="2" fill="#444444"/>
  </g>
  
  <!-- Video button icon (changed from red to black) -->
  <g transform="translate(250, 300)">
    <rect x="-45" y="-25" width="90" height="60" rx="15" ry="15" fill="#333333"/>
    <polygon points="-10,-15 20,0 -10,15" fill="white"/>
  </g>
</svg>`;

// Save SVG Content to File
const outputFile = path.join(__dirname, 'icon.svg');
fs.writeFileSync(outputFile, svg);
console.log(`SVG icon updated and saved to ${outputFile}`);

// Load Existing Manifest File
const manifestPath = path.join(__dirname, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Add Icons Property
manifest.icons = {
  "16": "icon.svg",
  "48": "icon.svg",
  "128": "icon.svg"
};

// Save Updated Manifest File
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`Manifest file updated with new icons: ${JSON.stringify(manifest.icons)}`);