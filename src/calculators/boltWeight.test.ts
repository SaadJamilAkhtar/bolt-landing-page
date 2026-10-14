import { describe, expect, it } from 'vitest'
import {
  boltWeightEach,
  describeItem,
  itemWeight,
  nutWeightEach,
  washerWeightEach,
  validateBolt,
  type BoltSpec,
} from './boltWeight'

const hex = (diameter: number, length1: number, thread1: number, threadType: 'cut' | 'rolled' = 'cut'): BoltSpec => ({
  kind: 'hex', diameter, length1, thread1, threadType,
})

describe('boltWeight model', () => {
  it('1 x 6 hex bolt, 3" cut thread ≈ 1.58 lb (live tool: 15.8 lb per 10)', () => {
    expect(boltWeightEach(hex(1, 6, 3))).toBeGreaterThan(1.5)
    expect(boltWeightEach(hex(1, 6, 3))).toBeLessThan(1.66)
    expect(itemWeight({ category: 'bolt', bolt: hex(1, 6, 3), hardware: {}, finish: 'black' }, 10).total).toBeCloseTo(15.8, 0)
  })

  it('is monotonic in diameter and length', () => {
    expect(boltWeightEach(hex(0.75, 6, 3))).toBeLessThan(boltWeightEach(hex(1, 6, 3)))
    expect(boltWeightEach(hex(1, 6, 3))).toBeLessThan(boltWeightEach(hex(1, 8, 3)))
  })

  it('galvanizing adds a small amount of weight', () => {
    const black = boltWeightEach(hex(1, 6, 3), 'black')
    const galv = boltWeightEach(hex(1, 6, 3), 'galvanized')
    expect(galv / black).toBeGreaterThan(1.005)
    expect(galv / black).toBeLessThan(1.06)
  })

  it('heavy hex head is heavier than regular hex at the same size', () => {
    const regular = boltWeightEach(hex(1, 6, 3))
    const heavy = boltWeightEach({ kind: 'heavyHex', diameter: 1, length1: 6, thread1: 3, threadType: 'cut' })
    expect(heavy).toBeGreaterThan(regular * 0.98)
  })

  it('nut and washer ordering makes physical sense', () => {
    // Absolute values get pinned against the live tool once spot-checked.
    expect(nutWeightEach('heavyHex', 1)).toBeGreaterThan(nutWeightEach('hex', 1))
    expect(nutWeightEach('hex', 1)).toBeGreaterThan(nutWeightEach('hexJam', 1))
    expect(nutWeightEach('heavyHex', 1)).toBeGreaterThan(nutWeightEach('heavyJam', 1))
    expect(nutWeightEach('hex', 1)).toBeGreaterThan(nutWeightEach('hex', 0.5))
    expect(washerWeightEach('standard', 1)).toBeGreaterThan(washerWeightEach('standard', 0.5))
    expect(washerWeightEach('f436', 1)).toBeGreaterThan(0)
  })

  it('adds hardware per bolt', () => {
    const bolt = hex(1, 6, 3)
    const bare = itemWeight({ category: 'bolt', bolt, hardware: {}, finish: 'black' }, 1).eachExact
    const dressed = itemWeight(
      {
        category: 'bolt', bolt, finish: 'black',
        hardware: { nuts: { kind: 'hex', count: 2 }, washers: { kind: 'standard', count: 1 } },
      },
      1,
    ).eachExact
    expect(dressed).toBeCloseTo(bare + 2 * nutWeightEach('hex', 1) + washerWeightEach('standard', 1), 6)
  })

  it('validates impossible bolts', () => {
    expect(validateBolt(hex(1, 6, 8))).toMatch(/longer/)
    expect(validateBolt(hex(0, 6, 3))).toMatch(/diameter/)
    expect(validateBolt({ kind: 'anchor90', diameter: 1, length1: 24, thread1: 6 })).toMatch(/hook/)
    expect(validateBolt(hex(1, 6, 3))).toBeNull()
  })

  it('describes items in plain English', () => {
    expect(describeItem({ category: 'bolt', bolt: hex(1, 6, 3), hardware: {}, finish: 'black' })).toBe(
      '1" x 6" Black Hex Bolt with 3" of thread',
    )
  })

  it('prints a reference table for eyeballing', () => {
    const rows = [
      ['hex 1/2 x 4 T2', boltWeightEach(hex(0.5, 4, 2))],
      ['hex 3/4 x 6 T3', boltWeightEach(hex(0.75, 6, 3))],
      ['hex 1 x 6 T3', boltWeightEach(hex(1, 6, 3))],
      ['hex 1 x 6 T3 rolled', boltWeightEach(hex(1, 6, 3, 'rolled'))],
      ['hex 1-1/2 x 10 T4', boltWeightEach(hex(1.5, 10, 4))],
      ['nut hex 1', nutWeightEach('hex', 1)],
      ['nut heavy 1', nutWeightEach('heavyHex', 1)],
      ['nut square 1', nutWeightEach('square', 1)],
      ['washer std 1', washerWeightEach('standard', 1)],
      ['washer f436 1', washerWeightEach('f436', 1)],
      ['washer ogee 1', washerWeightEach('ogee', 1)],
    ] as const
    console.log(rows.map(([n, w]) => `${n.padEnd(22)} ${w.toFixed(4)} lb`).join('\n'))
    expect(rows.length).toBeGreaterThan(0)
  })
})
