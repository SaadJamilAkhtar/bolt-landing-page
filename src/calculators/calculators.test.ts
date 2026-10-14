import { describe, expect, it } from 'vitest'
import { formatFraction, parseDimension, trimmed } from '../lib/fractions'
import { plateWeight } from './plateWeight'
import {
  CLEVIS_OPTIONS,
  ROD_DIAMETERS,
  decodeFormState,
  encodeFormState,
  tieRod,
  type RodDiameter,
} from './tieRod'

describe('parseDimension', () => {
  it('reads fractions, mixed numbers and decimals', () => {
    expect(parseDimension('1-1/2')).toBe(1.5)
    expect(parseDimension('1 1/2')).toBe(1.5)
    expect(parseDimension('3/4')).toBe(0.75)
    expect(parseDimension('0.375')).toBe(0.375)
    expect(parseDimension('.5')).toBe(0.5)
    expect(parseDimension('1.5"')).toBe(1.5)
  })
  it('rejects junk', () => {
    expect(parseDimension('')).toBeNull()
    expect(parseDimension('abc')).toBeNull()
    expect(parseDimension('1/0')).toBeNull()
  })
  it('formats and trims', () => {
    expect(formatFraction(41.875)).toBe('41-7/8')
    expect(formatFraction(0.5)).toBe('1/2')
    expect(trimmed(19.4375)).toBe('19.438')
    expect(trimmed(48)).toBe('48')
  })
})

/* Ground truth captured from the live calculator. */
describe('plateWeight (matches live tool)', () => {
  it('square 1 x 10 x 10, no hole', () => {
    const r = plateWeight({ shape: 'square', thickness: 1, width: 10, length: 10, quantity: 1 })
    expect(r.ok && r.total).toBe(28.3)
  })
  it('square 1 x 10 x 10 with 2" hole, qty 3', () => {
    const r = plateWeight({
      shape: 'square', thickness: 1, width: 10, length: 10, holeDiameter: 2, quantity: 3,
    })
    expect(r.ok && r.each).toBe(27.44)
    expect(r.ok && r.total).toBe(82.3)
  })
  it('round 1-1/2 thick, 10 OD, 2" hole', () => {
    const r = plateWeight({
      shape: 'round', thickness: 1.5, outsideDiameter: 10, holeDiameter: 2, quantity: 1,
    })
    expect(r.ok && r.each).toBe(32.04)
    expect(r.ok && r.total).toBe(32)
  })
  it('rejects a hole bigger than the plate', () => {
    const r = plateWeight({
      shape: 'round', thickness: 1, outsideDiameter: 4, holeDiameter: 5, quantity: 1,
    })
    expect(r.ok).toBe(false)
  })
})

/* Single-rod length at 100" pin-to-pin, for every diameter / clevis pair the live tool offers. */
const SINGLE_ROD_AT_100: Record<string, Record<string, number>> = {
  '1/2': { '2': 93.875 },
  '5/8': { '2': 93.875, '2-1/2': 93 },
  '3/4': { '2-1/2': 93 },
  '7/8': { '2-1/2': 93, '3': 90.875 },
  '1': { '3': 90.875 },
  '1-1/8': { '3': 91, '3-1/2': 89.125 },
  '1-1/4': { '3': 91.125, '3-1/2': 89.25 },
  '1-3/8': { '3': 91.25, '3-1/2': 89.375, '4': 89.5 },
  '1-1/2': { '3-1/2': 89.5, '4': 89.625, '5': 87.5 },
  '1-5/8': { '4': 89.75, '5': 87.625 },
  '1-3/4': { '4': 89.875, '5': 87.75 },
  '1-7/8': { '5': 87.875 },
  '2': { '5': 88, '6': 86 },
  '2-1/4': { '6': 86.25, '7': 84.25 },
  '2-1/2': { '6': 86.5, '7': 84.5 },
  '2-3/4': { '7': 84.75, '8': 82.5 },
  '3': { '7': 85, '8': 82.75 },
  '3-1/4': { '8': 83 },
  '3-1/2': { '8': 83.25 },
  '3-3/4': { '8': 83.5 },
  '4': { '8': 83.75 },
}

describe('tieRod (matches live tool)', () => {
  it('covers every diameter/clevis pair in the lookup', () => {
    for (const d of ROD_DIAMETERS) {
      expect(Object.keys(SINGLE_ROD_AT_100[d]).sort()).toEqual([...CLEVIS_OPTIONS[d]].sort())
    }
  })

  it('single rod, all 36 diameter/clevis pairs', () => {
    for (const d of ROD_DIAMETERS) {
      for (const clevis of CLEVIS_OPTIONS[d]) {
        const r = tieRod({ config: 'single', pinToPin: 100, diameter: d as RodDiameter, clevis })
        expect(r.ok && r.rods[0], `${d} / #${clevis}`).toBeCloseTo(SINGLE_ROD_AT_100[d][clevis], 6)
      }
    }
  })

  it('equal rods, 48" 1/2" #2 clevis, 6" turnbuckle -> 19.438" each', () => {
    const r = tieRod({ config: 'equal', pinToPin: 48, diameter: '1/2', clevis: '2', turnbuckle: 6 })
    expect(r.ok && r.rods).toEqual([19.4375, 19.4375])
  })

  it('different rods, fixed 20" -> 18.875"', () => {
    const r = tieRod({
      config: 'different', pinToPin: 48, fixedRod: 20, diameter: '1/2', clevis: '2', turnbuckle: 6,
    })
    expect(r.ok && r.rods).toEqual([18.875, 20])
  })

  it('flags impossible geometry', () => {
    expect(tieRod({ config: 'single', pinToPin: 5, diameter: '1/2', clevis: '2' }).ok).toBe(false)
    expect(
      tieRod({
        config: 'different', pinToPin: 48, fixedRod: 60, diameter: '1/2', clevis: '2', turnbuckle: 6,
      }).ok,
    ).toBe(false)
  })

  it('round-trips the shareable hash state', () => {
    const state = { config: 'different' as const, p2p: '48', fixed: '20', d: '1/2' as const, cNum: '2', t: 6 }
    const hash = encodeFormState(state)
    expect(hash).toBe('config=Different%20length%20rods&p2p=48&fixed=20&d=1%2F2&cNum=2&t=6')
    expect(decodeFormState(`#${hash}`)).toEqual(state)
  })
})
