/**
 * Workplace Harassment G8 — QR Code Generation & Download Utilities
 */

import QRCode from 'qrcode'

export interface QrRenderOptions {
  width?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
}

/**
 * Draws a QR code onto an existing canvas element.
 */
export async function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  options: QrRenderOptions = {},
): Promise<void> {
  await QRCode.toCanvas(canvas, text, {
    width: options.width ?? 280,
    margin: options.margin ?? 2,
    color: {
      dark: options.color?.dark ?? '#0a0a0b',
      light: options.color?.light ?? '#ffffff',
    },
    errorCorrectionLevel: 'M',
  })
}

/**
 * Generates a high-resolution, branded PNG image for printing or presentation slides,
 * and triggers a browser download.
 */
export async function downloadHighResQrPng(
  url: string,
  filename = 'workplace-harassment-feedback-qr.png',
): Promise<void> {
  const canvasSize = 1200
  const canvas = document.createElement('canvas')
  canvas.width = canvasSize
  canvas.height = canvasSize
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get 2D canvas context')

  // 1. Background — Dark graphite matching website identity
  ctx.fillStyle = '#0a0a0b'
  ctx.fillRect(0, 0, canvasSize, canvasSize)

  // 2. Subtle golden border frame
  ctx.strokeStyle = '#ffd34e'
  ctx.lineWidth = 8
  ctx.strokeRect(36, 36, canvasSize - 72, canvasSize - 72)

  // Thin inner subtle border
  ctx.strokeStyle = 'rgba(255, 211, 78, 0.25)'
  ctx.lineWidth = 2
  ctx.strokeRect(48, 48, canvasSize - 96, canvasSize - 96)

  // 3. Header Text
  ctx.textAlign = 'center'

  // Kicker
  ctx.fillStyle = '#d9a52e'
  ctx.font = '600 24px "JetBrains Mono", monospace'
  ctx.fillText('COLLEGE ETHICS PRESENTATION · GROUP 8', canvasSize / 2, 115)

  // Title
  ctx.fillStyle = '#f5f5f5'
  ctx.font = '700 48px "Space Grotesk", sans-serif'
  ctx.fillText('Share Your Feedback', canvasSize / 2, 180)

  // Subtitle
  ctx.fillStyle = '#a3a3a3'
  ctx.font = '400 26px "Inter", sans-serif'
  ctx.fillText('Scan with your phone to submit your review', canvasSize / 2, 226)

  // 4. Generate QR matrix onto an off-screen canvas
  const qrCanvas = document.createElement('canvas')
  await QRCode.toCanvas(qrCanvas, url, {
    width: 680,
    margin: 3,
    color: {
      dark: '#0a0a0b',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  })

  // 5. White card with rounded corners backing the QR code for maximum contrast & scanning speed
  const qrCardX = (canvasSize - 720) / 2
  const qrCardY = 270
  const qrCardSize = 720
  const radius = 24

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.roundRect(qrCardX, qrCardY, qrCardSize, qrCardSize, radius)
  ctx.fill()

  // Draw QR code centered inside white card
  ctx.drawImage(qrCanvas, (canvasSize - 680) / 2, qrCardY + 20)

  // 6. Target URL badge at bottom
  ctx.fillStyle = '#191919'
  ctx.beginPath()
  ctx.roundRect((canvasSize - 800) / 2, 1030, 800, 60, 16)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255, 211, 78, 0.35)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#ffd34e'
  ctx.font = '500 22px "JetBrains Mono", monospace'
  ctx.fillText(url, canvasSize / 2, 1068)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.font = '400 20px "Inter", sans-serif'
  ctx.fillText('Workplace Harassment — Interactive Knowledge Universe', canvasSize / 2, 1125)

  // 7. Trigger download
  const dataUrl = canvas.toDataURL('image/png')
  const downloadLink = document.createElement('a')
  downloadLink.download = filename
  downloadLink.href = dataUrl
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}
