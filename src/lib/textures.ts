import * as THREE from 'three'

/**
 * Procedurally generated textures — nothing is downloaded, so the site works
 * completely offline after `npm install`.
 */

let glowTexture: THREE.Texture | null = null
let environmentTexture: THREE.Texture | null = null

/** Soft radial gradient used for the ambient halo behind glowing nodes. */
export function getGlowTexture(): THREE.Texture {
  if (glowTexture) return glowTexture
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas context unavailable')

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255, 240, 166, 0.95)')
  gradient.addColorStop(0.18, 'rgba(255, 226, 130, 0.55)')
  gradient.addColorStop(0.42, 'rgba(255, 205, 80, 0.22)')
  gradient.addColorStop(0.7, 'rgba(233, 176, 50, 0.07)')
  gradient.addColorStop(1, 'rgba(230, 170, 40, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  glowTexture = new THREE.CanvasTexture(canvas)
  glowTexture.colorSpace = THREE.SRGBColorSpace
  return glowTexture
}

/**
 * A tiny studio-style equirectangular environment, built from gradients.
 * Gives the metallic chain links and node surfaces believable reflections
 * without loading an HDR file from a CDN.
 */
export function getEnvironmentTexture(): THREE.Texture {
  if (environmentTexture) return environmentTexture

  const width = 1024
  const height = 512
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas context unavailable')

  // Base: cold near-black with a slight vertical falloff.
  const base = ctx.createLinearGradient(0, 0, 0, height)
  base.addColorStop(0, '#1a1a1e')
  base.addColorStop(0.45, '#0d0d10')
  base.addColorStop(1, '#050506')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, width, height)

  const softbox = (cx: number, cy: number, rx: number, ry: number, color: string, alpha: number) => {
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry))
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.5, `${color}`)
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.translate(cx, cy)
    ctx.scale(1, ry / Math.max(rx, ry))
    ctx.translate(-cx, -cy)
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(cx, cy, Math.max(rx, ry), 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Warm key light above, cool fill behind: what polished metal needs to read as metal.
  softbox(width * 0.32, height * 0.18, 260, 150, 'rgba(255, 226, 170, 0.95)', 0.85)
  softbox(width * 0.76, height * 0.26, 190, 110, 'rgba(255, 255, 255, 0.8)', 0.5)
  softbox(width * 0.08, height * 0.62, 150, 220, 'rgba(120, 150, 200, 0.55)', 0.35)
  softbox(width * 0.55, height * 0.88, 320, 90, 'rgba(255, 190, 90, 0.35)', 0.4)

  const texture = new THREE.CanvasTexture(canvas)
  texture.mapping = THREE.EquirectangularReflectionMapping
  texture.colorSpace = THREE.SRGBColorSpace
  environmentTexture = texture
  return texture
}
