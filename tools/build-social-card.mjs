import sharp from 'sharp';
import { profile } from '../src/data/profile.js';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f7f6f2"/>
  <rect x="960" width="240" height="630" fill="#244ad9"/>
  <path d="M1010 70h140M1080 0v140M1010 560h140M1080 490v140" stroke="#ffffff" stroke-opacity=".3"/>
  <path d="M70 543h820" stroke="#cbd0cd"/>
  <g font-family="Arial,sans-serif" fill="#172129">
    <text x="70" y="103" font-size="50" font-weight="700">h<tspan fill="#244ad9">.</tspan></text>
    <text x="70" y="174" font-size="22">${profile.name}</text>
    <text x="70" y="283" font-size="70" font-weight="700">Building across</text>
    <text x="70" y="369" font-size="70" font-weight="700" fill="#244ad9">software &amp; hardware.</text>
    <text x="70" y="461" font-size="22">Electrical + Computer Engineering · Drexel University</text>
    <text x="70" y="503" font-size="20" fill="#596269">Class of 2028 · Finance minor</text>
    <text x="70" y="588" font-size="20" fill="#596269">${profile.email}</text>
  </g>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile('public/img/social-card.png');
console.log('Created public/img/social-card.png (1200 × 630)');
