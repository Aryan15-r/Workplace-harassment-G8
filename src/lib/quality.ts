import type { Quality } from '@/types'

export interface QualityConfig {
  dpr: [number, number]
  antialias: boolean
  particles: number
  chain: { tubular: number; radial: number }
  shells: boolean
  glow: boolean
  centralDetail: number
  maxFocusDistance: number
}

export const QUALITY_CONFIG: Record<Quality, QualityConfig> = {
  low: {
    dpr: [0.8, 1],
    antialias: false,
    particles: 160,
    chain: { tubular: 10, radial: 3 },
    shells: false,
    glow: false,
    centralDetail: 1,
    maxFocusDistance: 26,
  },
  medium: {
    dpr: [1, 1.5],
    antialias: true,
    particles: 400,
    chain: { tubular: 16, radial: 4 },
    shells: true,
    glow: true,
    centralDetail: 2,
    maxFocusDistance: 34,
  },
  high: {
    dpr: [1, 2],
    antialias: true,
    particles: 700,
    chain: { tubular: 22, radial: 5 },
    shells: true,
    glow: true,
    centralDetail: 3,
    maxFocusDistance: 40,
  },
}

export const QUALITY_LABEL: Record<Quality, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}
