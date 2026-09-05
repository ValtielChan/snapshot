/**
 * Generates the showcase media in docs/media/.
 *
 * 1. Screenshots scripts/demo-app.html into a demo input image.
 * 2. Drives the Snapshot editor with Playwright while recording a video.
 * 3. Grabs the still screenshots used by the README.
 * 4. Exports a few real PNGs through the app itself.
 *
 * Requires a local preview server and ffmpeg on the PATH:
 *   cd frontend && npm run build && npm run preview
 *   node scripts/record-demo.mjs
 */

import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const MEDIA = join(ROOT, 'docs', 'media')
const RAW = join(ROOT, '.demo-raw')
const APP = process.env.SNAPSHOT_URL ?? 'http://localhost:4173/snapshot/'
const INPUT = join(MEDIA, 'demo-input.png')

mkdirSync(MEDIA, { recursive: true })
rmSync(RAW, { recursive: true, force: true })
mkdirSync(RAW, { recursive: true })

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const marks = {} // seconds into the recording, used to cut the short GIFs

/* A visible cursor: Playwright's synthetic mouse draws nothing on its own. */
const CURSOR = `
  const css = document.createElement('style');
  css.textContent = \`
    #demo-cursor{position:fixed;left:0;top:0;width:22px;height:22px;z-index:2147483647;
      pointer-events:none;transform:translate(-3px,-3px);transition:opacity .2s}
    #demo-cursor svg{filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))}
    #demo-cursor.down svg{transform:scale(.82);transform-origin:4px 4px}
    #demo-ring{position:fixed;left:0;top:0;width:34px;height:34px;border-radius:50%;
      border:3px solid #111;z-index:2147483646;pointer-events:none;opacity:0;
      transform:translate(-17px,-17px) scale(.4)}
    @keyframes demo-ping{from{opacity:.9;transform:translate(-17px,-17px) scale(.35)}
      to{opacity:0;transform:translate(-17px,-17px) scale(1.15)}}
  \`;
  document.documentElement.appendChild(css);
  const c = document.createElement('div');
  c.id = 'demo-cursor';
  c.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22"><path d="M2 1 L2 17 L6.4 12.9 L9.2 19.3 L12.2 18 L9.4 11.7 L15.4 11.4 Z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  const ring = document.createElement('div');
  ring.id = 'demo-ring';
  document.documentElement.append(c, ring);
  addEventListener('mousemove', (e) => {
    c.style.left = e.clientX + 'px';
    c.style.top = e.clientY + 'px';
  }, true);
  addEventListener('mousedown', (e) => {
    c.classList.add('down');
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
    ring.style.animation = 'none';
    ring.offsetHeight;
    ring.style.animation = 'demo-ping .5s ease-out';
  }, true);
  addEventListener('mouseup', () => c.classList.remove('down'), true);
`

const browser = await chromium.launch()

/* ------------------------------------------------------------------ */
/* 1. The demo input: a fake product UI, screenshotted at 2x           */
/* ------------------------------------------------------------------ */
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 })
  await page.goto(pathToFileURL(join(HERE, 'demo-app.html')).href)
  await page.waitForTimeout(1200) // web fonts
  await page.screenshot({ path: INPUT })
  await page.close()
  console.log('wrote', INPUT)
}

/* ------------------------------------------------------------------ */
/* Shared driving helpers                                              */
/* ------------------------------------------------------------------ */
function driver(page) {
  let x = 720
  let y = 500

  const glide = async (tx, ty, steps = 26) => {
    const [fx, fy] = [x, y]
    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2 // easeInOutQuad
      await page.mouse.move(fx + (tx - fx) * e, fy + (ty - fy) * e)
      await wait(8)
    }
    x = tx
    y = ty
  }

  const center = async (loc) => {
    const b = await loc.boundingBox()
    if (!b) throw new Error('element not visible')
    return [b.x + b.width / 2, b.y + b.height / 2, b]
  }

  return {
    glide,
    async click(loc, settle = 420) {
      const [cx, cy] = await center(loc)
      await glide(cx, cy)
      await wait(120)
      await page.mouse.down()
      await wait(70)
      await page.mouse.up()
      await wait(settle)
    },
    /** Drags a range input from its current thumb to `ratio` of its track. */
    async drag(loc, ratio, settle = 500) {
      const [, cy, b] = await center(loc)
      const value = Number(await loc.inputValue())
      const min = Number(await loc.getAttribute('min'))
      const max = Number(await loc.getAttribute('max'))
      const at = (v) => b.x + 10 + ((v - min) / (max - min)) * (b.width - 20)
      await glide(at(value), cy)
      await page.mouse.down()
      const target = at(min + ratio * (max - min))
      const from = at(value)
      for (let i = 1; i <= 34; i++) {
        await page.mouse.move(from + ((target - from) * i) / 34, cy)
        await wait(14)
      }
      await page.mouse.up()
      x = target
      y = cy
      await wait(settle)
    },
  }
}

/* ------------------------------------------------------------------ */
/* 2. The recorded demo                                                */
/* ------------------------------------------------------------------ */
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: RAW, size: { width: 1440, height: 900 } },
  })
  await context.addInitScript(CURSOR)
  const t0 = Date.now()
  const page = await context.newPage()
  const d = driver(page)
  const mark = (name) => {
    marks[name] = (Date.now() - t0) / 1000
  }

  await page.goto(`${APP}#/editor`)
  await page.waitForTimeout(1400)
  mark('ready')

  // Import
  await d.glide(720, 470)
  await page.setInputFiles('.dropzone input[type=file]', INPUT)
  await page.waitForSelector('[data-testid=scene]')
  await wait(1100)

  // Backgrounds: open the panel and run through a few families
  mark('bgStart')
  await d.click(page.getByRole('button', { name: 'Background' }))
  await wait(300)
  for (const id of ['calm-13', 'calm-5', 'cosmic-10', 'cosmic-7', 'colorful-0']) {
    await d.click(page.getByRole('button', { name: id, exact: true }), 560)
  }

  // Custom gradient builder
  await d.click(page.getByRole('tab', { name: 'Custom' }))
  await wait(250)
  await d.click(page.getByRole('button', { name: 'Radial' }))
  await d.drag(page.getByLabel('Direction'), 0.72)
  await page.fill('input[aria-label="Hex color 1"]', '#ff6b00')
  await page.press('input[aria-label="Hex color 1"]', 'Enter')
  await wait(500)
  await page.fill('input[aria-label="Hex color 2"]', '#6c2bd9')
  await page.press('input[aria-label="Hex color 2"]', 'Enter')
  await wait(700)
  await d.click(page.getByRole('button', { name: 'Angular' }))
  await d.drag(page.getByLabel('Direction'), 0.2)
  await d.click(page.getByRole('button', { name: 'Close panel' }))
  await wait(400)
  mark('bgEnd')

  // Layout: padding then width
  mark('layoutStart')
  await d.click(page.getByRole('button', { name: 'Padding' }))
  await d.drag(page.getByLabel('Padding around'), 0.62)
  await d.drag(page.getByLabel('Padding around'), 0.24)
  await d.click(page.getByRole('button', { name: 'Padding' }))
  await d.click(page.getByRole('button', { name: 'Width' }))
  await d.drag(page.getByLabel('Scene width'), 0.72)
  await d.drag(page.getByLabel('Scene width'), 0.38)
  await d.click(page.getByRole('button', { name: 'Width' }))

  // Frame: theme, then off and back on
  await d.click(page.getByRole('button', { name: 'Dark' }), 700)
  await d.click(page.getByRole('button', { name: 'Light' }), 700)
  await d.click(page.getByRole('button', { name: 'Frame' }), 700)
  await d.click(page.getByRole('button', { name: 'Frame' }), 700)

  // Background visibility toggle
  await d.click(page.getByRole('button', { name: 'Show BG' }), 700)
  await d.click(page.getByRole('button', { name: 'Show BG' }), 700)
  mark('layoutEnd')

  // History: a whole drag is a single undo step
  const undo = page.getByRole('button', { name: /^Undo/ })
  await d.click(undo, 380)
  await d.click(undo, 380)
  await d.click(undo, 380)
  await d.click(page.getByRole('button', { name: /^Redo/ }), 380)
  await d.click(page.getByRole('button', { name: /^Redo/ }), 500)

  // Zoom
  await d.click(page.getByRole('button', { name: 'Zoom out' }), 350)
  await d.click(page.getByRole('button', { name: 'Zoom out' }), 500)
  await d.click(page.locator('.zoombox__value'), 600)

  // Pick a final background, then export
  await d.click(page.getByRole('button', { name: 'Background' }))
  await d.click(page.getByRole('button', { name: 'cosmic-12', exact: true }), 500)
  await d.click(page.getByRole('button', { name: 'Close panel' }))
  const dl = page.waitForEvent('download')
  await d.click(page.getByRole('button', { name: 'Download' }), 100)
  await (await dl).saveAs(join(RAW, 'example-export.png'))
  await wait(2200) // let the toast breathe
  mark('end')

  await page.close()
  await context.close()

  const webm = readdirSync(RAW).find((f) => f.endsWith('.webm'))
  renameSync(join(RAW, webm), join(RAW, 'demo.webm'))
  console.log('recorded', join(RAW, 'demo.webm'))
}

/* ------------------------------------------------------------------ */
/* 3. Still screenshots + real exports                                 */
/* ------------------------------------------------------------------ */
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  await page.goto(`${APP}#/editor`)
  await page.waitForTimeout(900)
  await page.setInputFiles('.dropzone input[type=file]', INPUT)
  await page.waitForSelector('[data-testid=scene]')
  await page.waitForTimeout(700)
  await page.getByRole('button', { name: 'Background' }).click()
  await page.getByRole('button', { name: 'cosmic-10', exact: true }).click()
  await page.waitForTimeout(600)
  await page.screenshot({ path: join(MEDIA, 'editor-backgrounds.png') })

  await page.getByRole('tab', { name: 'Custom' }).click()
  await page.getByRole('button', { name: 'Angular' }).click()
  await page.fill('input[aria-label="Hex color 1"]', '#ff6b00')
  await page.press('input[aria-label="Hex color 1"]', 'Enter')
  await page.fill('input[aria-label="Hex color 2"]', '#6c2bd9')
  await page.press('input[aria-label="Hex color 2"]', 'Enter')
  await page.waitForTimeout(600)
  await page.screenshot({ path: join(MEDIA, 'editor-custom.png') })
  await page.getByRole('button', { name: 'Close panel' }).click()

  // Four real exports, same input, four looks
  const looks = [
    { name: 'export-calm', swatch: 'calm-9', dark: true },
    { name: 'export-cosmic', swatch: 'cosmic-7', dark: true },
    { name: 'export-colorful', swatch: 'colorful-0', dark: false },
    { name: 'export-solid', swatch: 'solid-6', dark: false },
  ]
  let dark = true
  for (const look of looks) {
    await page.getByRole('button', { name: 'Background' }).click()
    await page.getByRole('button', { name: look.swatch, exact: true }).click()
    await page.getByRole('button', { name: 'Close panel' }).click()
    if (look.dark !== dark) {
      await page.getByRole('button', { name: dark ? 'Dark' : 'Light' }).click()
      dark = look.dark
    }
    await page.waitForTimeout(500)
    const dl = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download' }).click()
    await (await dl).saveAs(join(MEDIA, `${look.name}.png`))
  }

  await context.close()
}

await browser.close()

/* ------------------------------------------------------------------ */
/* 4. Video encoding                                                   */
/* ------------------------------------------------------------------ */
const ff = (args) => execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args])
const src = join(RAW, 'demo.webm')

ff(['-ss', String(marks.ready - 1), '-i', src, '-vf', 'scale=1280:-2:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow',
  '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(MEDIA, 'demo.mp4')])

const gif = (out, { from, to, speed = 1, width, fps = 12 }) => {
  const pal = join(RAW, 'palette.png')
  const cut = ['-ss', String(from), '-t', String(to - from)]
  const vf = `setpts=PTS/${speed},fps=${fps},scale=${width}:-1:flags=lanczos`
  ff([...cut, '-i', src, '-vf', `${vf},palettegen=stats_mode=diff`, pal])
  ff([...cut, '-i', src, '-i', pal, '-lavfi', `${vf} [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3`, out])
  console.log('gif', out)
}

gif(join(MEDIA, 'demo.gif'), { from: marks.ready - 1, to: marks.end, speed: 2, width: 640, fps: 10 })
gif(join(MEDIA, 'backgrounds.gif'), { from: marks.bgStart, to: marks.bgEnd, speed: 1.3, width: 680 })
gif(join(MEDIA, 'controls.gif'), { from: marks.layoutStart, to: marks.layoutEnd, speed: 1.6, width: 600, fps: 10 })

console.log('marks', JSON.stringify(marks))
console.log('raw recording kept in', RAW)
console.log('media written to', MEDIA)
for (const f of readdirSync(MEDIA)) console.log(' -', f)
