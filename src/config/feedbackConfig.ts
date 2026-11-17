/**
 * Workplace Harassment G8 — Feedback Configuration
 */

// Default deployed Google Apps Script Web App endpoint for Group 8
export const DEFAULT_FEEDBACK_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwuzsup3x8PDKnVhUv7tqnfTXZWnejSVM7QT1qyRhIRw5EvmjzX4H0y0UUagZ5LA_MS/exec'

export const FEEDBACK_ENDPOINT = (
  import.meta.env.VITE_FEEDBACK_ENDPOINT || DEFAULT_FEEDBACK_ENDPOINT
).trim()

// Default fallback public production URL
export const DEFAULT_PRODUCTION_URL = 'https://workplace-harassment-g8.pages.dev'

export const CONFIGURED_SITE_URL = (
  import.meta.env.VITE_SITE_URL || DEFAULT_PRODUCTION_URL
).trim()

/**
 * Returns true if running on a local development host.
 */
export function isLocalhost(): boolean {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]'
}

/**
 * Returns the canonical feedback URL to be embedded in the QR Code.
 * Ensures the QR code never embeds a useless 'localhost' address.
 */
export function getFeedbackQrUrl(): string {
  if (CONFIGURED_SITE_URL) {
    return `${CONFIGURED_SITE_URL.replace(/\/+$/, '')}/feedback`
  }

  if (typeof window !== 'undefined') {
    if (!isLocalhost() && window.location.origin && window.location.origin !== 'null') {
      return `${window.location.origin.replace(/\/+$/, '')}/feedback`
    }
  }

  return `${DEFAULT_PRODUCTION_URL}/feedback`
}

export const RATING_DESCRIPTIONS: Record<number, string> = {
  1: 'Needs Improvement',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
}
