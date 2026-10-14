import { formatFraction, parseDimension, trimmed } from '../lib/fractions'

/**
 * Tie rod length calculator.
 *
 * Given a pin-to-pin length (centre of one clevis pin hole to the other), work
 * out the rod length(s) to order. Rules, as observed on the live tool:
 *
 *  - Clevis sizes follow the AISC Manual of Steel Construction (13th ed., p. 15-15).
 *  - Each rod engages its clevis up to max(rod diameter / 2, 1/2") from the nut end.
 *  - Each rod engages 1/4 of the turnbuckle length, so a turnbuckle of length T
 *    contributes T - 2·(T/4) = T/2 to the overall length.
 *
 * Per clevis end the deduction is   c = clevisDimension - engagement(d)
 *   single rod:      rod  = P2P - 2c
 *   equal rods:      rod  = (P2P - 2c - T/2) / 2        (each)
 *   different rods:  rodB = P2P - 2c - T/2 - rodA
 */

export type TieRodConfig = 'single' | 'equal' | 'different'

export const CONFIG_LABELS: Record<TieRodConfig, string> = {
  single: 'Single rod',
  equal: 'Equal length rods',
  different: 'Different length rods',
}

/** Nominal rod diameters offered, as the fraction strings shown in the UI. */
export const ROD_DIAMETERS = [
  '1/2', '5/8', '3/4', '7/8', '1', '1-1/8', '1-1/4', '1-3/8', '1-1/2', '1-5/8',
  '1-3/4', '1-7/8', '2', '2-1/4', '2-1/2', '2-3/4', '3', '3-1/4', '3-1/2', '3-3/4', '4',
] as const

export type RodDiameter = (typeof ROD_DIAMETERS)[number]

/** Clevis number → pin-centre-to-thread-end dimension (in.). */
export const CLEVIS_DIMENSION: Record<string, number> = {
  '2': 3.5625,
  '2-1/2': 4,
  '3': 5.0625,
  '3-1/2': 6,
  '4': 5.9375,
  '5': 7,
  '6': 8,
  '7': 9,
  '8': 10.125,
}

/** Which clevis sizes fit which rod diameter. */
export const CLEVIS_OPTIONS: Record<RodDiameter, string[]> = {
  '1/2': ['2'],
  '5/8': ['2', '2-1/2'],
  '3/4': ['2-1/2'],
  '7/8': ['2-1/2', '3'],
  '1': ['3'],
  '1-1/8': ['3', '3-1/2'],
  '1-1/4': ['3', '3-1/2'],
  '1-3/8': ['3', '3-1/2', '4'],
  '1-1/2': ['3-1/2', '4', '5'],
  '1-5/8': ['4', '5'],
  '1-3/4': ['4', '5'],
  '1-7/8': ['5'],
  '2': ['5', '6'],
  '2-1/4': ['6', '7'],
  '2-1/2': ['6', '7'],
  '2-3/4': ['7', '8'],
  '3': ['7', '8'],
  '3-1/4': ['8'],
  '3-1/2': ['8'],
  '3-3/4': ['8'],
  '4': ['8'],
}

export const TURNBUCKLE_LENGTHS = [6, 9, 12] as const
export type TurnbuckleLength = (typeof TURNBUCKLE_LENGTHS)[number]

export interface TieRodInput {
  config: TieRodConfig
  pinToPin: number
  /** Only for the "different length rods" configuration */
  fixedRod?: number
  diameter: RodDiameter
  clevis: string
  turnbuckle?: number
}

export interface TieRodSuccess {
  ok: true
  config: TieRodConfig
  pinToPin: number
  /** Rod lengths in diagram order (left → right). */
  rods: number[]
  /** Deduction at each clevis end. */
  perEndDeduction: number
  turnbuckle: number | null
}

export interface TieRodFailure {
  ok: false
  error: string
}

export const engagement = (diameter: number) => Math.max(diameter / 2, 0.5)

export function clevisDeduction(diameter: RodDiameter, clevis: string): number | null {
  const dim = CLEVIS_DIMENSION[clevis]
  const d = parseDimension(diameter)
  if (dim === undefined || d === null) return null
  return dim - engagement(d)
}

export function tieRod(input: TieRodInput): TieRodSuccess | TieRodFailure {
  const { config, pinToPin, diameter, clevis } = input

  if (!(pinToPin > 0)) return { ok: false, error: 'Enter the pin-to-pin length.' }
  if (!CLEVIS_OPTIONS[diameter]?.includes(clevis)) {
    return { ok: false, error: 'Choose a clevis size for this rod diameter.' }
  }
  const c = clevisDeduction(diameter, clevis)
  if (c === null) return { ok: false, error: 'Unknown clevis size.' }

  const tooShort = {
    ok: false as const,
    error: 'That pin-to-pin length is too short for this clevis and hardware.',
  }

  if (config === 'single') {
    const rod = pinToPin - 2 * c
    if (rod <= 0) return tooShort
    return { ok: true, config, pinToPin, rods: [rod], perEndDeduction: c, turnbuckle: null }
  }

  const t = input.turnbuckle
  if (!t || !(t > 0)) return { ok: false, error: 'Choose a turnbuckle length.' }
  const remaining = pinToPin - 2 * c - t / 2

  if (config === 'equal') {
    const rod = remaining / 2
    if (rod <= 0) return tooShort
    return { ok: true, config, pinToPin, rods: [rod, rod], perEndDeduction: c, turnbuckle: t }
  }

  const fixed = input.fixedRod
  if (!(fixed && fixed > 0)) return { ok: false, error: 'Enter the fixed rod length.' }
  const other = remaining - fixed
  if (other <= 0) {
    return { ok: false, error: 'The fixed rod is too long for this pin-to-pin length.' }
  }
  return { ok: true, config, pinToPin, rods: [other, fixed], perEndDeduction: c, turnbuckle: t }
}

/** Display a rod length the way the live tool does: up to 3 decimals, trailing zeros dropped. */
export const formatRod = (v: number) => `${trimmed(v, 3)}"`
/** Same length rounded to the nearest 1/16 for people who prefer fractions. */
export const formatRodFraction = (v: number) => `${formatFraction(v, 16)}"`

/* ---------- shareable state (same hash format as the original page) ---------- */

export interface TieRodFormState {
  config: TieRodConfig
  p2p: string
  fixed: string
  d: RodDiameter
  cNum: string
  t: number
}

export const DEFAULT_FORM: TieRodFormState = {
  config: 'single',
  p2p: '',
  fixed: '',
  d: '1/2',
  cNum: '2',
  t: 6,
}

export function encodeFormState(s: TieRodFormState): string {
  const p = new URLSearchParams()
  p.set('config', CONFIG_LABELS[s.config])
  p.set('p2p', s.p2p)
  p.set('fixed', s.fixed)
  p.set('d', s.d)
  p.set('cNum', s.cNum)
  p.set('t', String(s.t))
  return p.toString().replace(/\+/g, '%20')
}

export function decodeFormState(hash: string): TieRodFormState {
  const p = new URLSearchParams(hash.replace(/^#/, ''))
  const label = p.get('config')
  const config =
    (Object.keys(CONFIG_LABELS) as TieRodConfig[]).find((k) => CONFIG_LABELS[k] === label) ??
    DEFAULT_FORM.config

  const d = (ROD_DIAMETERS as readonly string[]).includes(p.get('d') ?? '')
    ? (p.get('d') as RodDiameter)
    : DEFAULT_FORM.d
  const options = CLEVIS_OPTIONS[d]
  const cNum = options.includes(p.get('cNum') ?? '') ? (p.get('cNum') as string) : options[0]
  const t = Number(p.get('t'))

  return {
    config,
    p2p: p.get('p2p') ?? '',
    fixed: p.get('fixed') ?? '',
    d,
    cNum,
    t: (TURNBUCKLE_LENGTHS as readonly number[]).includes(t) ? t : DEFAULT_FORM.t,
  }
}
