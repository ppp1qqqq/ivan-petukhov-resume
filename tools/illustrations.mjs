#!/usr/bin/env node
/**
 * Draws the site's illustrations as SVG files in images/.
 * One palette (the site tokens), one light direction (window light from the
 * left), soft ink-tinted shadows and no lettering, so every image sits in a
 * polaroid like a photograph would. Re-run after editing a scene:
 *
 *   node tools/illustrations.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../images');
mkdirSync(OUT, { recursive: true });

const C = {
  desk: '#ece4d1', desk2: '#e4d9c1', sheet: '#fffdf7', sheet2: '#f7f3e8', ink: '#19203d', ink2: '#394062',
  muted: '#9aa0b6', rule: '#dcd6c6', cobalt: '#2343c4', cobaltDeep: '#19319b', sky: '#86aaf0', skyPale: '#dfe8fb',
  hl: '#f6e04c', yellow: '#f9ea92', pink: '#f6c8d7', aqua: '#c2e5f1', marker: '#c4571a', orange: '#ec8a3d',
  red: '#d6463c', green: '#3c9a55', board: '#25282e', steel: '#c9ccd1', dark: '#22283a',
};

/* Lucide-style glyphs (24 viewBox), drawn as strokes */
const G = {
  send: '<path d="M14.5 21.7a.5.5 0 0 0 .9 0l6.5-19a.5.5 0 0 0-.6-.6l-19 6.5a.5.5 0 0 0 0 .9l7.9 3.2a2 2 0 0 1 1.1 1.1zM21.9 2.1 10.9 13.1"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
  spark: '<path d="M9.9 15.5A2 2 0 0 0 8.5 14l-6.1-1.6a.5.5 0 0 1 0-1L8.5 9.9A2 2 0 0 0 9.9 8.5l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0z"/>',
  bug: '<path d="m8 2 1.9 1.9M14.1 3.9 16 2M9 7.1v-1a3 3 0 1 1 6 0v1M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6M12 20v-9M6.5 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M21 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  gear: '<path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  server: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
  db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  table: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
};

/* ---------------------------- primitives ---------------------------- */
const tr = (x, y, r = 0, s = 1) => `transform="translate(${x} ${y})${r ? ` rotate(${r})` : ''}${s !== 1 ? ` scale(${s})` : ''}"`;
const glyph = (name, x, y, size, color, sw = 2) =>
  `<g ${tr(x - size / 2, y - size / 2, 0, size / 24)} fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${G[name]}</g>`;

function defs() {
  return `<defs>
  <filter id="sh" x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="7" dy="13" stdDeviation="11" flood-color="#19203d" flood-opacity=".17"/><feDropShadow dx="1" dy="2" stdDeviation="1.4" flood-color="#19203d" flood-opacity=".16"/></filter>
  <filter id="shs" x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="3" dy="5" stdDeviation="4" flood-color="#19203d" flood-opacity=".16"/><feDropShadow dx="0" dy="1" stdDeviation=".8" flood-color="#19203d" flood-opacity=".18"/></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .32 0 0 0 0 .27 0 0 0 0 .16 0 0 0 .11 0"/></filter>
  <filter id="blur18"><feGaussianBlur stdDeviation="18"/></filter>
  <linearGradient id="light" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset=".45" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#5c4e2a" stop-opacity=".08"/></linearGradient>
  <radialGradient id="vig" cx=".45" cy=".45" r=".75"><stop offset=".6" stop-color="#3a2f17" stop-opacity="0"/><stop offset="1" stop-color="#3a2f17" stop-opacity=".16"/></radialGradient>
  <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="steelH" x1="0" x2="1"><stop offset="0" stop-color="#8d939a"/><stop offset=".2" stop-color="#eef0ef"/><stop offset=".5" stop-color="#b3b8bd"/><stop offset=".75" stop-color="#f6f7f5"/><stop offset="1" stop-color="#868c93"/></linearGradient>
  <radialGradient id="heat"><stop offset="0" stop-color="#d6463c" stop-opacity=".95"/><stop offset=".32" stop-color="#ec8a3d" stop-opacity=".8"/><stop offset=".62" stop-color="#f6e04c" stop-opacity=".55"/><stop offset="1" stop-color="#f6e04c" stop-opacity="0"/></radialGradient>
  <radialGradient id="heatCool"><stop offset="0" stop-color="#ec8a3d" stop-opacity=".7"/><stop offset=".5" stop-color="#f6e04c" stop-opacity=".45"/><stop offset="1" stop-color="#86aaf0" stop-opacity="0"/></radialGradient>
  <radialGradient id="coffee" cx=".4" cy=".38" r=".7"><stop offset="0" stop-color="#8a5a35"/><stop offset=".7" stop-color="#5b3820"/><stop offset="1" stop-color="#3f2614"/></radialGradient>
  <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#86aaf0" stroke-opacity=".35" stroke-width="1"/></pattern>
  <pattern id="ruled" width="10" height="30" patternUnits="userSpaceOnUse"><path d="M0 29.5H10" stroke="#2343c4" stroke-opacity=".14" stroke-width="1"/></pattern>
  <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.4" fill="#2343c4" fill-opacity=".22"/></pattern>
</defs>`;
}

function ground(w, h, color = C.desk) {
  return `<rect width="${w}" height="${h}" fill="${color}"/>
  <path d="M0 ${h * 0.18}C${w * 0.3} ${h * 0.12} ${w * 0.6} ${h * 0.26} ${w} ${h * 0.2}" stroke="#d8cbb0" stroke-opacity=".35" stroke-width="2" fill="none"/>
  <path d="M0 ${h * 0.62}C${w * 0.35} ${h * 0.56} ${w * 0.7} ${h * 0.7} ${w} ${h * 0.64}" stroke="#d8cbb0" stroke-opacity=".3" stroke-width="2" fill="none"/>
  <rect width="${w}" height="${h}" fill="url(#light)"/>`;
}
const finish = (w, h) => `<rect width="${w}" height="${h}" filter="url(#grain)" opacity=".9"/><rect width="${w}" height="${h}" fill="url(#vig)"/>`;

function sticky(x, y, w, h, r, color, inner = '') {
  const f = Math.round(Math.min(w, h) * 0.16);
  return `<g ${tr(x, y, r)} filter="url(#shs)"><path d="M0 0H${w}V${h - f}L${w - f} ${h}H0Z" fill="${color}"/><path d="M0 0H${w}V${h * 0.35}H0Z" fill="url(#shine)"/><path d="M${w - f} ${h}V${h - f}H${w}Z" fill="#19203d" fill-opacity=".12"/>${inner}</g>`;
}
function sheet(x, y, w, h, r, inner = '', fill = C.sheet, filter = 'sh') {
  return `<g ${tr(x, y, r)}><rect width="${w}" height="${h}" rx="3" fill="${fill}" filter="url(#${filter})"/>${inner}</g>`;
}
function tape(x, y, w, r, h = 30) {
  return `<g ${tr(x, y, r)}><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#cec29e" fill-opacity=".62"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h * 0.3}" fill="#fff" fill-opacity=".25"/></g>`;
}
function lines(x, y, w, n, gap = 16, color = C.rule, sw = 7, seed = 1) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const k = ((i * 37 + seed * 13) % 10) / 10;
    const lw = i === n - 1 ? w * (0.45 + k * 0.2) : w * (0.78 + k * 0.22);
    s += `<path d="M${x} ${y + i * gap}h${lw.toFixed(1)}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
  }
  return s;
}
function mug(x, y, r, color = C.cobalt) {
  return `<g ${tr(x, y)} filter="url(#sh)">
    <rect x="${r * 0.72}" y="${-r * 0.24}" width="${r * 0.72}" height="${r * 0.48}" rx="${r * 0.24}" fill="none" stroke="${color}" stroke-width="${r * 0.18}"/>
    <circle r="${r}" fill="${color}"/><circle r="${r * 0.84}" fill="#fffdf7"/><circle r="${r * 0.74}" fill="url(#coffee)"/>
    <ellipse cx="${-r * 0.25}" cy="${-r * 0.28}" rx="${r * 0.22}" ry="${r * 0.12}" fill="#fff" fill-opacity=".18" transform="rotate(-30 ${-r * 0.25} ${-r * 0.28})"/>
  </g>`;
}
function pencil(x, y, len, r, color = C.cobalt) {
  const w = 16;
  return `<g ${tr(x, y, r)} filter="url(#shs)">
    <rect x="0" y="${-w / 2}" width="${len}" height="${w}" fill="${color}"/><rect x="0" y="${-w / 2}" width="${len}" height="${w / 3}" fill="#fff" fill-opacity=".25"/>
    <rect x="${-22}" y="${-w / 2}" width="16" height="${w}" rx="3" fill="#f2a7b8"/><rect x="${-8}" y="${-w / 2}" width="10" height="${w}" fill="#c9ccd1"/>
    <path d="M${len} ${-w / 2}L${len + 30} 0L${len} ${w / 2}Z" fill="#e9c99a"/><path d="M${len + 20} -2.7L${len + 30} 0L${len + 20} 2.7Z" fill="${C.ink}"/>
  </g>`;
}
function keyboard(x, y, w, h, r, accent = C.cobalt) {
  const cols = 14, rows = 5, pad = 16, gx = 6;
  const kw = (w - pad * 2 - gx * (cols - 1)) / cols, kh = (h - pad * 2 - gx * (rows - 1)) / rows;
  let keys = '';
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let kx = pad + i * (kw + gx), wid = kw;
      if (j === 4) {
        if (i < 3 || i > 10) { /* modifiers */ } else if (i === 3) { wid = kw * 8 + gx * 7; } else continue;
      }
      let fill = '#fbfaf6';
      if (j === 0 && i === 0) fill = C.hl;
      if (j === 2 && i === 13) fill = accent;
      if (j === 4 && i === 12) fill = C.pink;
      keys += `<rect x="${kx.toFixed(1)}" y="${(pad + j * (kh + gx)).toFixed(1)}" width="${wid.toFixed(1)}" height="${kh.toFixed(1)}" rx="5" fill="${fill}"/><rect x="${kx.toFixed(1)}" y="${(pad + j * (kh + gx) + kh - 4).toFixed(1)}" width="${wid.toFixed(1)}" height="4" rx="2" fill="#19203d" fill-opacity=".08"/>`;
    }
  }
  return `<g ${tr(x, y, r)} filter="url(#sh)"><rect width="${w}" height="${h}" rx="16" fill="#dcd8cc"/><rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="14" fill="#e8e4d9"/>${keys}</g>`;
}
function mouse(x, y, r, color = '#fbfaf6') {
  return `<g ${tr(x, y, r)} filter="url(#sh)"><path d="M0 -70C40 -70 52 -40 52 0S40 78 0 78-52 40-52 0-40 -70 0 -70Z" fill="${color}"/><path d="M0 -70V-14M-52 -14H52" stroke="#19203d" stroke-opacity=".12" stroke-width="3" fill="none"/><rect x="-6" y="-52" width="12" height="24" rx="6" fill="${C.ink2}"/><path d="M-30 -50C-22 -62 -10 -66 0 -66" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".8"/></g>`;
}
function phone(x, y, w, h, r, screen) {
  return `<g ${tr(x, y, r)}><rect width="${w}" height="${h}" rx="${w * 0.14}" fill="#1d2233" filter="url(#sh)"/>
    <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="${w * 0.13}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>
    <g transform="translate(${w * 0.045} ${w * 0.045})"><rect width="${w * 0.91}" height="${h - w * 0.09}" rx="${w * 0.1}" fill="#f7f5ef"/>${screen}</g>
    <rect x="${w / 2 - w * 0.13}" y="${w * 0.07}" width="${w * 0.26}" height="${w * 0.07}" rx="${w * 0.035}" fill="#1d2233"/></g>`;
}
function bubble(x, y, w, h, side, fill, lineColor) {
  const tail = side === 'r' ? `<path d="M${w - 18} ${h - 2}L${w + 8} ${h + 6}L${w - 4} ${h - 16}Z" fill="${fill}"/>` : `<path d="M18 ${h - 2}L-8 ${h + 6}L4 ${h - 16}Z" fill="${fill}"/>`;
  const lc = lineColor || (fill === C.cobalt ? '#fff' : C.rule);
  const n = Math.max(1, Math.floor((h - 18) / 18));
  return `<g ${tr(x, y)}>${tail}<rect width="${w}" height="${h}" rx="16" fill="${fill}"/>${lines(16, 20, w - 34, n, 18, lc, 7, Math.round(x + y))}</g>`;
}
function token(x, y, r, bg, g, fg = '#fff') {
  return `<g filter="url(#shs)"><circle cx="${x}" cy="${y}" r="${r}" fill="${bg}"/><circle cx="${x}" cy="${y}" r="${r - 7}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-dasharray="4 5"/></g>${glyph(g, x, y, r * 0.95, fg, 2)}`;
}
function paperclip(x, y, r, color = C.green, s = 1) {
  return `<g ${tr(x, y, r, s)} fill="none" stroke-linecap="round"><path d="M9 22v34a6 6 0 0 0 12 0V12a9 9 0 0 0-18 0v46a12 12 0 0 0 24 0V24" stroke="${color}" stroke-width="3.4"/><path d="M8.4 21.4v34a6 6 0 0 0 12 0V11.4" stroke="#fff" stroke-opacity=".4" stroke-width="1"/></g>`;
}
function headset(x, y, r) {
  return `<g ${tr(x, y, r)} filter="url(#sh)">
    <path d="M-120 20C-120 -90 120 -90 120 20" fill="none" stroke="#2b3145" stroke-width="22" stroke-linecap="round"/>
    <path d="M-120 20C-120 -90 120 -90 120 20" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="6" stroke-linecap="round" transform="translate(0 -6)"/>
    <rect x="-162" y="0" width="74" height="104" rx="30" fill="#2b3145"/><rect x="-150" y="12" width="50" height="80" rx="22" fill="${C.cobalt}"/>
    <rect x="88" y="0" width="74" height="104" rx="30" fill="#2b3145"/><rect x="100" y="12" width="50" height="80" rx="22" fill="${C.cobalt}"/>
    <path d="M-125 96C-110 160 -60 178 -10 176" fill="none" stroke="#2b3145" stroke-width="9" stroke-linecap="round"/><rect x="-22" y="164" width="34" height="22" rx="11" fill="#2b3145"/>
  </g>`;
}
function server(x, y, w, units, r = 0) {
  let s = '';
  for (let i = 0; i < units; i++) {
    const uy = i * 58;
    s += `<rect y="${uy}" width="${w}" height="50" rx="8" fill="#2a3044"/><rect y="${uy}" width="${w}" height="14" rx="7" fill="#fff" fill-opacity=".06"/>`;
    for (let k = 0; k < 7; k++) s += `<rect x="${w * 0.42 + k * 14}" y="${uy + 16}" width="6" height="20" rx="3" fill="#fff" fill-opacity=".14"/>`;
    s += `<circle cx="22" cy="${uy + 25}" r="6" fill="${i === 1 ? C.hl : '#6fd08a'}"/><circle cx="42" cy="${uy + 25}" r="6" fill="#6fd08a" fill-opacity="${i % 2 ? 1 : 0.35}"/>`;
  }
  return `<g ${tr(x, y, r)} filter="url(#sh)">${s}</g>`;
}
function browser(x, y, w, h, r, content) {
  return `<g ${tr(x, y, r)}><rect width="${w}" height="${h}" rx="14" fill="${C.sheet}" filter="url(#sh)"/>
    <path d="M0 14a14 14 0 0 1 14-14h${w - 28}a14 14 0 0 1 14 14v34H0Z" fill="#ebe6d8"/>
    <circle cx="28" cy="24" r="7" fill="${C.red}" fill-opacity=".8"/><circle cx="50" cy="24" r="7" fill="${C.hl}"/><circle cx="72" cy="24" r="7" fill="${C.green}" fill-opacity=".8"/>
    <rect x="${w * 0.22}" y="12" width="${w * 0.56}" height="24" rx="12" fill="#fffdf7"/><rect x="${w * 0.25}" y="21" width="${w * 0.2}" height="6" rx="3" fill="${C.rule}"/>
    <g transform="translate(0 48)">${content}</g></g>`;
}
function cursor(x, y, s = 1, r = -8) {
  return `<g ${tr(x, y, r, s)} filter="url(#shs)"><path d="M0 0L0 46L12 35L21 56L30 52L21 32L37 31Z" fill="#fff" stroke="${C.ink}" stroke-width="3.2" stroke-linejoin="round"/></g>`;
}
function bars(x, y, w, h, vals, colors) {
  const bw = w / (vals.length * 1.6);
  let s = `<path d="M${x} ${y + h}h${w}" stroke="${C.ink2}" stroke-opacity=".35" stroke-width="2"/>`;
  vals.forEach((v, i) => { const bh = h * v; s += `<rect x="${x + i * bw * 1.6 + bw * 0.3}" y="${y + h - bh}" width="${bw}" height="${bh}" rx="3" fill="${colors[i % colors.length]}"/>`; });
  return s;
}
function donut(cx, cy, r, parts, colors, sw = 22) {
  const c = 2 * Math.PI * r; let off = 0, s = '';
  parts.forEach((p, i) => { s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colors[i]}" stroke-width="${sw}" stroke-dasharray="${(c * p).toFixed(1)} ${c.toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`; off += c * p; });
  return s;
}
function arrow(d, color = C.ink2, sw = 3.5, head = true) {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${head ? ' marker-end="url(#ah)"' : ''}/>`;
}
const arrowDef = (color = C.ink2) => `<defs><marker id="ah" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1L10 6L1 11" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>`;
function book(x, y, w, h, r, color, stripe = '#fff') {
  return `<g ${tr(x, y, r)} filter="url(#sh)"><rect width="${w}" height="${h}" rx="5" fill="${color}"/><rect x="${w - 14}" y="0" width="14" height="${h}" rx="4" fill="#fff" fill-opacity=".85"/><path d="M${w - 12} 8V${h - 8}M${w - 7} 8V${h - 8}" stroke="#d9d3c3" stroke-width="1.5"/><rect x="18" y="${h * 0.18}" width="${w * 0.5}" height="10" rx="5" fill="${stripe}" fill-opacity=".85"/><rect x="18" y="${h * 0.18 + 20}" width="${w * 0.32}" height="8" rx="4" fill="${stripe}" fill-opacity=".55"/></g>`;
}
function duck(x, y, s = 1, r = 0) {
  return `<g ${tr(x, y, r, s)} filter="url(#sh)">
    <path d="M-70 10C-74 -26 -40 -40 0 -36C30 -34 46 -20 64 -26C70 -6 62 30 30 44C0 56 -56 52 -70 10Z" fill="#f6d23c"/>
    <circle cx="-24" cy="-58" r="38" fill="#f6d23c"/><path d="M-60 -50C-78 -52 -92 -44 -94 -38C-84 -34 -70 -36 -58 -40Z" fill="${C.orange}"/>
    <circle cx="-34" cy="-66" r="6" fill="${C.ink}"/><circle cx="-36" cy="-68" r="2" fill="#fff"/>
    <path d="M-12 -2C8 -10 30 -6 40 8C22 22 -2 18 -12 -2Z" fill="#e8bd22"/>
    <path d="M-46 -82C-36 -94 -16 -96 -4 -88" stroke="#fff" stroke-opacity=".6" stroke-width="6" stroke-linecap="round" fill="none"/>
  </g>`;
}
function svg(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs()}${arrowDef()}${body}</svg>\n`;
}

/* ------------------------------ scenes ------------------------------ */
const scenes = {};

/* AI assistant: one phone, four channels, a server under the desk lamp */
scenes['mei-bot'] = () => {
  const W = 1536, H = 1024;
  const screen = (() => {
    const sw = 300 * 0.91;
    let s = `<rect width="${sw}" height="54" rx="30" fill="${C.cobalt}"/><rect y="30" width="${sw}" height="24" fill="${C.cobalt}"/><circle cx="34" cy="28" r="14" fill="#fff" fill-opacity=".9"/>${glyph('spark', 34, 28, 18, C.cobalt, 2.2)}<rect x="58" y="20" width="96" height="8" rx="4" fill="#fff" fill-opacity=".9"/><rect x="58" y="34" width="60" height="6" rx="3" fill="#fff" fill-opacity=".55"/>`;
    s += bubble(sw - 186, 80, 166, 56, 'r', C.cobalt);
    s += bubble(20, 160, 200, 92, 'l', '#fff');
    s += bubble(sw - 150, 280, 130, 40, 'r', C.cobalt);
    s += bubble(20, 344, 214, 110, 'l', '#fff');
    s += `<g transform="translate(20 478)"><rect width="78" height="36" rx="18" fill="#fff"/><circle cx="22" cy="18" r="5" fill="${C.muted}"/><circle cx="39" cy="18" r="5" fill="${C.muted}" fill-opacity=".7"/><circle cx="56" cy="18" r="5" fill="${C.muted}" fill-opacity=".45"/></g>`;
    s += `<rect x="12" y="536" width="${sw - 24}" height="44" rx="22" fill="#fff" stroke="${C.rule}" stroke-width="2"/><circle cx="${sw - 36}" cy="558" r="16" fill="${C.cobalt}"/>${glyph('send', sw - 37, 558, 18, '#fff', 2.2)}`;
    return s;
  })();
  return svg(W, H, `${ground(W, H)}
    ${sticky(150, 150, 230, 210, -6, C.yellow, lines(28, 48, 160, 4, 30, '#c9b85a', 8, 3) + glyph('check', 186, 160, 40, C.green, 3))}
    ${pencil(190, 760, 300, -18, C.cobalt)}
    ${mug(1290, 210, 96, C.hl)}
    <g stroke="${C.cobalt}" stroke-width="4" stroke-dasharray="2 13" stroke-linecap="round" fill="none" opacity=".55">
      <path d="M910 330C990 300 1010 250 1060 250"/><path d="M910 440C1010 440 1040 420 1100 420"/><path d="M910 560C1010 580 1040 600 1100 600"/><path d="M910 680C990 720 1010 770 1060 770"/>
    </g>
    ${phone(580, 140, 300, 690, -5, screen)}
    ${token(1090, 250, 62, C.cobalt, 'send')}
    ${token(1150, 420, 62, '#3f6fd0', 'chat')}
    ${token(1150, 600, 62, C.marker, 'spark')}
    ${token(1090, 770, 62, C.green, 'globe')}
    ${server(1250, 690, 210, 3, 4)}
    ${tape(1355, 680, 120, -6)}
    ${finish(W, H)}`);
};

/* AI assistant detail: the architecture sketch on grid paper */
scenes['mei-bot-detail'] = () => {
  const W = 1200, H = 800;
  const box = (x, y, w, h, fill, g, gc) => `<g filter="url(#shs)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}"/></g>${glyph(g, x + w / 2, y + h / 2 - 10, 54, gc, 2)}<rect x="${x + w * 0.22}" y="${y + h - 34}" width="${w * 0.56}" height="9" rx="4.5" fill="${gc}" fill-opacity=".45"/>`;
  const inner = `<rect width="960" height="620" fill="url(#grid)"/>
    <g>${token(90, 120, 40, C.cobalt, 'send')}${token(90, 245, 40, '#3f6fd0', 'chat')}${token(90, 370, 40, C.marker, 'spark')}${token(90, 495, 40, C.green, 'globe')}</g>
    ${arrow('M140 120C190 140 200 250 248 290')}${arrow('M140 245C180 255 200 290 246 302')}${arrow('M140 370C180 360 200 330 246 318')}${arrow('M140 495C190 480 200 360 248 330')}
    ${box(258, 230, 170, 170, C.cobalt, 'server', '#fff')}
    ${arrow('M440 300C470 290 488 290 512 294')}
    <g filter="url(#shs)"><rect x="522" y="200" width="200" height="200" rx="18" fill="#fff"/></g>
    <g transform="translate(548 228)">${[0, 1, 2, 3, 4].map((i) => `<rect y="${i * 30}" width="148" height="22" rx="4" fill="${i === 2 ? C.hl : '#efebe0'}"/>`).join('')}</g>
    ${glyph('search', 668, 330, 70, C.cobalt, 2.4)}
    ${arrow('M620 412C620 450 640 470 676 478')}
    ${box(690, 420, 170, 140, C.pink, 'spark', C.cobaltDeep)}
    ${arrow('M760 410C780 340 800 280 820 236')}
    <g filter="url(#shs)"><path d="M770 90h150a18 18 0 0 1 18 18v80a18 18 0 0 1-18 18H830l-26 26v-26h-34a18 18 0 0 1-18-18v-80a18 18 0 0 1 18-18Z" fill="${C.cobalt}"/></g>${lines(790, 126, 120, 3, 22, '#fff', 8, 2)}
    <g transform="translate(260 470)" filter="url(#shs)"><rect width="96" height="40" rx="6" fill="${C.aqua}"/><rect x="10" y="-30" width="76" height="34" rx="6" fill="${C.sky}"/><rect x="22" y="-58" width="52" height="32" rx="6" fill="${C.cobalt}"/></g>
    <g transform="translate(392 456)" filter="url(#shs)"><rect width="70" height="70" rx="35" fill="${C.green}"/></g>${glyph('lock', 427, 491, 38, '#fff', 2.4)}
    ${arrow('M360 470C380 440 380 420 360 404', C.muted, 3, false)}`;
  return svg(W, H, `${ground(W, H, C.desk2)}
    ${sheet(110, 80, 960, 620, -1.5, inner)}
    ${tape(170, 92, 130, -32)}${tape(1020, 96, 130, 28)}
    ${pencil(760, 728, 250, -4, C.marker)}
    ${finish(W, H)}`);
};

/* Operator centre: the panel wireframe with sessions and a conversation */
scenes['mei-operator'] = () => {
  const W = 1536, H = 1024;
  const pw = 1000, ph = 640;
  let rows = '';
  const dots = [C.green, C.hl, C.green, C.muted, C.red, C.muted];
  for (let i = 0; i < 6; i++) {
    const y = 90 + i * 84;
    rows += `<g transform="translate(108 ${y})"><rect width="290" height="70" rx="12" fill="${i === 1 ? C.skyPale : '#fff'}"/><circle cx="36" cy="35" r="20" fill="${[C.aqua, C.pink, C.yellow, C.aqua, C.pink, C.yellow][i]}"/>${glyph('users', 36, 35, 20, C.cobaltDeep, 2)}<rect x="68" y="20" width="${130 - (i % 3) * 20}" height="9" rx="4.5" fill="${C.ink2}" fill-opacity=".6"/><rect x="68" y="40" width="${170 - (i % 2) * 40}" height="8" rx="4" fill="${C.rule}"/><circle cx="268" cy="35" r="7" fill="${dots[i]}"/></g>`;
  }
  const chat = `<g transform="translate(426 90)"><rect width="540" height="504" rx="14" fill="#f4f1e8"/>
    ${bubble(24, 24, 260, 74, 'l', '#fff')}${bubble(250, 124, 266, 56, 'r', C.cobalt)}${bubble(24, 210, 300, 92, 'l', '#fff')}${bubble(300, 330, 216, 56, 'r', C.cobalt)}
    <rect x="18" y="436" width="504" height="50" rx="25" fill="#fff" stroke="${C.rule}" stroke-width="2"/><circle cx="494" cy="461" r="18" fill="${C.cobalt}"/>${glyph('send', 493, 461, 20, '#fff', 2.2)}</g>`;
  const side = `<rect width="80" height="${ph}" rx="14" fill="${C.cobalt}"/><rect x="66" width="14" height="${ph}" fill="${C.cobalt}"/>${['chat', 'clock', 'gear', 'users'].map((g, i) => `<rect x="18" y="${40 + i * 76}" width="44" height="44" rx="10" fill="#fff" fill-opacity="${i === 0 ? 0.22 : 0.08}"/>${glyph(g, 40, 62 + i * 76, 24, '#fff', 2)}`).join('')}`;
  const top = `<rect x="108" y="28" width="300" height="40" rx="20" fill="#fff" stroke="${C.rule}" stroke-width="2"/>${glyph('search', 134, 48, 20, C.muted, 2)}<rect x="152" y="44" width="110" height="8" rx="4" fill="${C.rule}"/><rect x="426" y="34" width="120" height="28" rx="14" fill="${C.yellow}"/><rect x="558" y="34" width="96" height="28" rx="14" fill="${C.aqua}"/>`;
  return svg(W, H, `${ground(W, H)}
    ${sticky(120, 170, 200, 190, -7, C.pink, glyph('clock', 100, 95, 78, C.cobaltDeep, 2.4))}
    ${sticky(1240, 690, 190, 180, 6, C.aqua, glyph('gear', 95, 90, 74, C.cobaltDeep, 2.2))}
    ${mug(1330, 230, 90, C.cobalt)}
    <g ${tr(270, 190, -2)}><rect width="${pw}" height="${ph}" rx="16" fill="${C.sheet}" filter="url(#sh)"/>${side}${top}${rows}${chat}</g>
    ${tape(770, 186, 150, -3)}
    ${pencil(180, 860, 280, -10, C.hl)}
    ${finish(W, H)}`);
};

/* Operator centre detail: three sections around one SQLite file */
scenes['mei-operator-detail'] = () => {
  const W = 1200, H = 800;
  const card = (x, y, r, color, g, inner) => sticky(x, y, 250, 230, r, color, glyph(g, 125, 76, 72, C.cobaltDeep, 2.2) + inner);
  const db = `<g transform="translate(600 410)" filter="url(#sh)"><path d="M-110 -110v220a110 34 0 0 0 220 0v-220" fill="${C.cobalt}"/><ellipse cy="-110" rx="110" ry="34" fill="#3f6fd0"/><path d="M-110 -36a110 34 0 0 0 220 0M-110 38a110 34 0 0 0 220 0" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4"/><ellipse cy="-110" rx="70" ry="18" fill="#fff" fill-opacity=".14"/></g>`;
  return svg(W, H, `${ground(W, H, C.desk2)}
    ${sheet(80, 60, 1040, 680, 0.8, '<rect width="1040" height="680" fill="url(#dots)"/>')}
    <g stroke="${C.cobalt}" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round" fill="none" opacity=".55"><path d="M390 250C460 280 480 320 500 340"/><path d="M810 250C740 280 720 320 700 340"/><path d="M600 640V560"/></g>
    ${card(150, 110, -4, C.yellow, 'chat', lines(52, 150, 150, 3, 22, '#c9b85a', 8, 1))}
    ${card(800, 110, 4, C.pink, 'clock', lines(52, 150, 150, 3, 22, '#d99aae', 8, 2))}
    ${db}
    ${sticky(475, 600, 250, 120, 1.5, C.aqua, glyph('gear', 64, 60, 52, C.cobaltDeep, 2.2) + `<rect x="112" y="38" width="96" height="16" rx="8" fill="#fff"/><circle cx="196" cy="46" r="11" fill="${C.green}"/><rect x="112" y="70" width="96" height="16" rx="8" fill="#fff"/><circle cx="124" cy="78" r="11" fill="${C.muted}"/>`)}
    ${tape(300, 100, 120, -10)}${tape(930, 100, 120, 12)}
    ${finish(W, H)}`);
};

/* Web analytics: the admissions site wireframe under a heat map and a session replay */
scenes['mei-analytics'] = () => {
  const W = 1536, H = 1024;
  const bw = 1060, bh = 700;
  const site = `
    <rect x="40" y="26" width="120" height="30" rx="8" fill="${C.cobalt}"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${460 + i * 108}" y="34" width="80" height="12" rx="6" fill="${C.ink2}" fill-opacity=".45"/>`).join('')}
    <rect x="40" y="88" width="${bw - 80}" height="240" rx="12" fill="${C.skyPale}"/>
    <rect x="80" y="128" width="420" height="30" rx="8" fill="${C.ink}" fill-opacity=".85"/><rect x="80" y="172" width="320" height="30" rx="8" fill="${C.ink}" fill-opacity=".85"/>
    ${lines(80, 236, 360, 2, 20, '#9fb1df', 8, 4)}
    <rect x="80" y="276" width="190" height="40" rx="20" fill="${C.cobalt}"/><rect x="286" y="276" width="170" height="40" rx="20" fill="none" stroke="${C.cobalt}" stroke-width="3"/>
    <rect x="620" y="118" width="360" height="180" rx="12" fill="#c8d6f7"/><circle cx="700" cy="190" r="34" fill="${C.hl}"/><path d="M640 290L760 200L840 260L900 220L980 290Z" fill="${C.sky}"/>
    ${[0, 1, 2].map((i) => `<g transform="translate(${40 + i * 334} 356)"><rect width="312" height="140" rx="12" fill="#f4f1e8"/><rect x="22" y="24" width="44" height="44" rx="10" fill="${[C.yellow, C.pink, C.aqua][i]}"/><rect x="82" y="30" width="150" height="12" rx="6" fill="${C.ink2}" fill-opacity=".6"/>${lines(22, 92, 250, 2, 20, C.rule, 8, i)}</g>`).join('')}
    <g transform="translate(40 518)"><rect width="${bw - 80}" height="120" rx="12" fill="#f4f1e8"/>${[0, 1, 2].map((i) => `<rect x="${24 + i * 260}" y="34" width="236" height="48" rx="10" fill="#fff" stroke="${C.rule}" stroke-width="2"/>`).join('')}<rect x="808" y="34" width="150" height="48" rx="24" fill="${C.marker}"/></g>`;
  const heat = `<g style="mix-blend-mode:multiply">
    <circle cx="175" cy="296" r="120" fill="url(#heat)"/><circle cx="520" cy="40" r="70" fill="url(#heatCool)"/><circle cx="626" cy="40" r="60" fill="url(#heatCool)"/>
    <circle cx="883" cy="566" r="110" fill="url(#heat)"/><circle cx="182" cy="566" r="90" fill="url(#heatCool)"/><circle cx="440" cy="566" r="80" fill="url(#heat)" opacity=".7"/>
    <circle cx="200" cy="420" r="60" fill="url(#heatCool)" opacity=".6"/></g>`;
  const trail = `<path d="M980 150C900 210 760 120 640 220S330 250 260 300 170 420 300 470 520 540 600 560 800 590 870 570" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-dasharray="3 11" stroke-linecap="round" opacity=".6"/>
    <circle cx="260" cy="300" r="18" fill="none" stroke="${C.cobalt}" stroke-width="3"/><circle cx="260" cy="300" r="32" fill="none" stroke="${C.cobalt}" stroke-width="2" opacity=".5"/>`;
  return svg(W, H, `${ground(W, H)}
    ${sticky(80, 640, 220, 210, -8, C.yellow, glyph('search', 108, 100, 92, C.cobaltDeep, 2.2))}
    ${browser(260, 150, bw, bh, -1.4, site + heat + trail + cursor(870, 566, 1.3, -6))}
    ${tape(320, 168, 140, -38)}${tape(1290, 150, 140, 34)}
    ${mug(1390, 820, 84, C.hl)}
    ${finish(W, H)}`);
};

/* Web analytics detail: the twelve-page report fanned out with a highlighter */
scenes['mei-analytics-detail'] = () => {
  const W = 1200, H = 800;
  const page = (x, y, r, inner) => sheet(x, y, 400, 560, r, inner);
  const p3 = `<rect x="40" y="44" width="200" height="16" rx="8" fill="${C.ink2}" fill-opacity=".6"/>${lines(40, 96, 320, 4, 22, C.rule, 8, 5)}<rect x="40" y="210" width="320" height="200" rx="10" fill="${C.skyPale}"/><circle cx="130" cy="290" r="60" fill="url(#heat)"/><circle cx="270" cy="350" r="44" fill="url(#heatCool)"/>${lines(40, 450, 320, 3, 22, C.rule, 8, 6)}`;
  const p2 = `<rect x="40" y="44" width="240" height="16" rx="8" fill="${C.ink2}" fill-opacity=".6"/>${donut(200, 250, 90, [0.46, 0.3, 0.24], [C.cobalt, C.hl, C.pink])}${lines(40, 400, 320, 5, 22, C.rule, 8, 7)}`;
  const p1 = `<rect x="40" y="44" width="260" height="20" rx="10" fill="${C.cobalt}"/>${lines(40, 96, 320, 3, 22, C.rule, 8, 8)}
    <rect x="40" y="170" width="320" height="210" rx="10" fill="#f6f3ea"/>${bars(70, 196, 260, 160, [0.42, 0.7, 0.5, 0.92, 0.62], [C.cobalt, C.sky, C.cobalt, C.marker, C.sky])}
    <rect x="36" y="408" width="210" height="22" fill="${C.hl}" fill-opacity=".75"/>${lines(40, 420, 320, 4, 22, C.ink2, 7, 9).replace(/stroke="#394062"/g, 'stroke="#394062" stroke-opacity=".35"')}`;
  return svg(W, H, `${ground(W, H, C.desk2)}
    ${page(560, 120, 9, p3)}${page(420, 100, 3, p2)}${page(250, 120, -5, p1)}
    ${paperclip(300, 70, -8, C.green, 2.2)}
    <g ${tr(860, 640, -28)} filter="url(#sh)"><rect width="250" height="54" rx="14" fill="${C.hl}"/><rect width="250" height="18" rx="9" fill="#fff" fill-opacity=".3"/><rect x="-46" y="6" width="56" height="42" rx="8" fill="#d8bd2c"/><path d="M-46 12L-74 20V34L-46 42Z" fill="${C.ink}" fill-opacity=".75"/><rect x="190" y="0" width="10" height="54" fill="#fff" fill-opacity=".35"/></g>
    ${sticky(70, 520, 170, 160, -6, C.pink, glyph('check', 85, 80, 70, C.green, 3))}
    ${finish(W, H)}`);
};

/* Greenatom: a support desk with a headset, a ticket and a squashed bug */
scenes['role-greenatom'] = () => {
  const W = 1536, H = 1024;
  const ticket = `<rect x="34" y="36" width="140" height="18" rx="9" fill="${C.ink2}" fill-opacity=".6"/><rect x="200" y="32" width="90" height="26" rx="13" fill="${C.green}" fill-opacity=".85"/>${lines(34, 92, 250, 4, 26, C.rule, 8, 3)}<rect x="34" y="210" width="110" height="34" rx="17" fill="${C.skyPale}"/><rect x="156" y="210" width="90" height="34" rx="17" fill="${C.yellow}"/>`;
  return svg(W, H, `${ground(W, H)}
    ${headset(420, 300, -12)}
    ${sticky(760, 170, 220, 200, 6, C.yellow, glyph('bug', 110, 100, 100, C.marker, 2.2) + `<path d="M40 40L180 160" stroke="${C.red}" stroke-width="7" stroke-linecap="round"/>`)}
    ${sticky(1010, 215, 190, 175, -5, C.aqua, glyph('check', 95, 88, 84, C.green, 3))}
    ${mug(1320, 290, 92, C.green)}
    ${keyboard(260, 520, 660, 240, -3)}
    ${mouse(1010, 640, 14)}
    ${sheet(1110, 560, 320, 280, 4, ticket)}
    ${paperclip(1150, 520, 10, C.green, 2)}
    ${pencil(330, 860, 300, -6, C.green)}
    ${finish(W, H)}`);
};

/* Stolichny Dom Karery: a meeting table with the weekly report, notes and two mugs */
scenes['role-sdk'] = () => {
  const W = 1536, H = 1024;
  const nb = `<rect width="640" height="430" rx="10" fill="${C.sheet}"/><rect x="318" width="4" height="430" fill="#19203d" fill-opacity=".1"/>
    <rect x="0" y="0" width="320" height="430" fill="url(#ruled)"/><rect x="322" y="0" width="318" height="430" fill="url(#ruled)"/>
    ${bars(40, 70, 240, 170, [0.35, 0.55, 0.48, 0.8, 0.66], [C.cobalt, C.sky, C.cobalt, C.marker, C.sky])}
    ${lines(40, 290, 240, 4, 30, C.ink2, 5, 4).replace(/stroke="#394062"/g, 'stroke="#394062" stroke-opacity=".35"')}
    ${donut(480, 150, 70, [0.5, 0.28, 0.22], [C.cobalt, C.hl, C.pink], 26)}
    ${lines(362, 290, 240, 4, 30, C.ink2, 5, 6).replace(/stroke="#394062"/g, 'stroke="#394062" stroke-opacity=".35"')}`;
  const ph = (() => { const sw = 210 * 0.91; return `<rect width="${sw}" height="44" rx="22" fill="${C.cobalt}"/><rect y="22" width="${sw}" height="22" fill="${C.cobalt}"/>${bubble(sw - 130, 64, 112, 44, 'r', C.cobalt)}${bubble(14, 128, 140, 64, 'l', '#fff')}${bubble(sw - 110, 216, 92, 36, 'r', C.cobalt)}`; })();
  return svg(W, H, `${ground(W, H)}
    ${mug(250, 230, 86, C.cobalt)}${mug(1300, 790, 86, C.marker)}
    ${sheet(150, 470, 300, 400, -8, `<rect x="30" y="34" width="180" height="16" rx="8" fill="${C.cobalt}"/>${lines(30, 80, 240, 3, 22, C.rule, 8, 1)}${bars(40, 170, 220, 130, [0.5, 0.8, 0.62, 0.9], [C.cobalt, C.sky, C.cobalt, C.marker])}${lines(30, 340, 240, 2, 22, C.rule, 8, 2)}`)}
    <g ${tr(470, 250, 2)} filter="url(#sh)">${nb}</g>
    ${phone(1170, 180, 210, 440, 8, ph)}
    ${sticky(560, 730, 200, 170, -4, C.pink, glyph('users', 100, 80, 80, C.cobaltDeep, 2.2))}
    ${sticky(800, 740, 200, 170, 5, C.yellow, glyph('check', 100, 84, 80, C.green, 3))}
    ${pencil(1040, 690, 260, 32, C.hl)}
    ${finish(W, H)}`);
};

/* College: lecture notes with flowcharts, a stack of textbooks and a pencil */
scenes['edu-college'] = () => {
  const W = 1200, H = 800;
  const flow = `<rect width="560" height="440" rx="8" fill="${C.sheet}"/><rect x="278" width="4" height="440" fill="#19203d" fill-opacity=".1"/><rect width="560" height="440" fill="url(#ruled)"/>
    <g fill="none" stroke="${C.cobalt}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="90" y="40" width="110" height="46" rx="23"/><path d="M145 86V118"/><rect x="80" y="122" width="130" height="54" rx="4"/><path d="M145 176V204"/>
      <path d="M145 206L205 246L145 286L85 246Z"/><path d="M205 246H246V310"/><path d="M145 286V326"/><rect x="80" y="330" width="130" height="54" rx="4"/>
    </g>
    <g stroke-linecap="round" stroke-width="7">
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => { const ind = [0, 1, 2, 2, 1, 2, 3, 1, 0][i]; const col = [C.cobalt, C.marker, C.green, C.ink2][i % 4]; return `<path d="M${318 + ind * 22} ${56 + i * 40}h${30 + (i % 3) * 14}" stroke="${col}" stroke-opacity=".75"/><path d="M${318 + ind * 22 + 44 + (i % 3) * 14} ${56 + i * 40}h${80 - ind * 14}" stroke="#394062" stroke-opacity=".3"/>`; }).join('')}
    </g>`;
  return svg(W, H, `${ground(W, H, C.desk2)}
    ${book(80, 120, 300, 420, -8, C.cobalt)}${book(120, 150, 280, 400, 4, C.marker)}${book(150, 180, 270, 380, -2, C.green)}
    <g ${tr(470, 150, 3)} filter="url(#sh)">${flow}</g>
    ${pencil(560, 680, 300, -3, C.hl)}
    <g ${tr(1030, 610, 18)} filter="url(#shs)"><rect width="90" height="50" rx="8" fill="${C.pink}"/><rect width="34" height="50" rx="6" fill="${C.cobalt}"/></g>
    ${sticky(950, 90, 180, 170, 7, C.aqua, glyph('check', 90, 82, 70, C.green, 3))}
    ${finish(W, H)}`);
};

/* Skills desk: keyboard, a rubber duck for debugging, notes and coffee */
scenes['desk-dev'] = () => {
  const W = 1200, H = 800;
  const braces = `<g fill="none" stroke="${C.cobalt}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M76 40C52 40 52 62 52 80S40 104 30 106C40 108 52 114 52 132S52 172 76 172"/><path d="M164 40C188 40 188 62 188 80S200 104 210 106C200 108 188 114 188 132S188 172 164 172"/></g><rect x="92" y="96" width="56" height="18" rx="9" fill="${C.hl}"/>`;
  return svg(W, H, `${ground(W, H)}
    ${keyboard(120, 380, 620, 230, -2)}
    ${mouse(840, 480, 10)}
    ${duck(980, 260, 1.25, -6)}
    ${sheet(120, 70, 280, 230, -6, braces.replace('<g ', '<g transform="translate(20 10)" '))}
    ${sticky(440, 90, 170, 160, 5, C.yellow, lines(26, 46, 110, 3, 30, '#c9b85a', 8, 1))}
    ${sticky(630, 120, 170, 160, -4, C.pink, glyph('bug', 85, 80, 76, C.marker, 2.2))}
    ${sticky(250, 640, 170, 140, 3, C.aqua, glyph('check', 85, 70, 64, C.green, 3))}
    ${mug(1040, 640, 80, C.cobalt)}
    <path d="M720 440C780 380 760 300 860 300S960 360 1000 340" stroke="#2b3145" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/>
    ${pencil(500, 700, 260, -12, C.marker)}
    ${finish(W, H)}`);
};

for (const [name, fn] of Object.entries(scenes)) {
  const out = fn();
  writeFileSync(`${OUT}/${name}.svg`, out);
  console.log(`${String(Math.round(out.length / 1024)).padStart(4)} KB  images/${name}.svg`);
}
