import * as THREE from 'three'

/** Shared palette. Hex strings for CSS, THREE.Color instances for the scene. */
export const PALETTE = {
  bg: '#0a0a0b',
  bgPanel: '#101010',
  bgPanelSoft: '#191919',
  gold: '#FFD34E',
  amber: '#D9A52E',
  glow: '#FFF0A6',
  chain: '#F2F2F2',
  text: '#F5F5F5',
  muted: '#A3A3A3',
} as const

export const CHAIN_COLORS = {
  base: new THREE.Color('#ECECEC'),
  active: new THREE.Color('#FFD98A'),
  dim: new THREE.Color('#3C3A34'),
  emissiveBase: new THREE.Color('#000000'),
  emissiveActive: new THREE.Color('#8A6A16'),
}

export const NODE_COLORS = {
  gold: new THREE.Color('#FFD34E'),
  amber: new THREE.Color('#D9A52E'),
  dark: new THREE.Color('#1D1A13'),
  darkDim: new THREE.Color('#141312'),
}
