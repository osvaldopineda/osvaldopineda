import { writeFileSync } from 'node:fs'

const THEMES = {
  light: { bg:'#F3EFE6', ink:'#1C1A17', clay:'#C56A4B', muted:'#6B645A', line:'#1C1A17',
    frame:0.13, grain:'0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.035 0' },
  dark:  { bg:'#16140F', ink:'#ECE7DC', clay:'#E08763', muted:'#A29A8C', line:'#ECE7DC',
    frame:0.14, grain:'0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0' },
}
const SERIF = "Georgia,'Times New Roman',serif"
const SANS  = "'Helvetica Neue',Arial,sans-serif"
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')

function svg(h, t, body, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 ${h}" width="1200" height="${h}" role="img" aria-label="${esc(label)}">
  <defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="${t.grain}"/></filter></defs>
  <rect width="1200" height="${h}" fill="${t.bg}"/>
  <rect width="1200" height="${h}" filter="url(#grain)"/>
  <rect x="20" y="20" width="1160" height="${h-40}" fill="none" stroke="${t.line}" stroke-opacity="${t.frame}"/>
${body}
</svg>\n`
}
const txt = (x,y,s,size,fill,font,extra='') => `  <text x="${x}" y="${y}" font-family="${font}" font-size="${size}" fill="${fill}"${extra}>${esc(s)}</text>`
const hr  = (y,t) => `  <line x1="64" y1="${y}" x2="1136" y2="${y}" stroke="${t.line}" stroke-opacity="0.1"/>`

// ---- Selected work : stacked label + 2 desc lines ----
const WORK = [
  { label:'Google Search', lines:[
    'Resolved WCAG 2.1 / 2.2 AA accessibility defects and shipped UI directly on the',
    'Search engine; frontend components integrated over gRPC microservices.'] },
  { label:'Stitch Fix · Life.Church', lines:[
    'Built React / Next.js features for high-traffic products and led a headless-CMS',
    'migration to Contentstack for +25% user engagement.'] },
  { label:'Invex · Compartamos · Fondeadora', lines:[
    'PCI-DSS micro-frontends for 50k+ banking customers, an offline-first financial-',
    'inclusion platform, and a B2B payments system handling $1M+/month.'] },
]
function workPanel(t) {
  let b = ''
  WORK.forEach((e,i) => {
    const y = 92 + 136*i
    b += txt(64, y, e.label, 26, t.clay, SERIF) + '\n'
    b += txt(64, y+32, e.lines[0], 18, t.ink, SANS) + '\n'
    b += txt(64, y+58, e.lines[1], 18, t.ink, SANS) + '\n'
    if (i < WORK.length-1) b += hr(y+92, t) + '\n'
  })
  const label = 'Selected work. ' + WORK.map(e => e.label+': '+e.lines.join(' ')).join(' ')
  return svg(470, t, b.trimEnd(), label)
}

// ---- Building : label + desc + meta ----
const BUILD = [
  { label:'El Mundo Conocido',
    desc:'Immersive interactive map of Westeros: clickable regions, a lore timeline, and procedural ambient sound.',
    meta:'React · Leaflet · Web Audio · Zustand' },
  { label:'FinDash',
    desc:'Mobile-first personal finance dashboard with real-time projections and Supabase sync.',
    meta:'React · TypeScript · Supabase · Tailwind' },
]
function buildPanel(t) {
  let b = ''
  BUILD.forEach((e,i) => {
    const y = 96 + 136*i
    b += txt(64, y, e.label, 26, t.clay, SERIF) + '\n'
    b += txt(64, y+32, e.desc, 18, t.ink, SANS) + '\n'
    b += txt(64, y+60, e.meta, 15, t.muted, SANS, ' letter-spacing="0.3"') + '\n'
    if (i < BUILD.length-1) b += hr(y+92, t) + '\n'
  })
  const label = 'Building. ' + BUILD.map(e => e.label+': '+e.desc+' Stack: '+e.meta).join(' ')
  return svg(340, t, b.trimEnd(), label)
}

for (const [name, t] of Object.entries(THEMES)) {
  writeFileSync(`work-${name}.svg`, workPanel(t))
  writeFileSync(`building-${name}.svg`, buildPanel(t))
}
console.log('wrote work-{light,dark}.svg building-{light,dark}.svg')
