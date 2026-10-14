import { describe, expect, it } from 'vitest'
import {
  boltWeightEach,
  nutWeightEach,
  washerWeightEach,
  type BoltSpec,
  type NutKind,
  type WasherKind,
} from './boltWeight'

/**
 * Ground truth for the bolt weight model, taken from the original tool.
 *
 * The original computes weights on a server, so these cannot be derived from its
 * page source. Each entry is one reading from its calculator, run with a quantity
 * of 1000 so the displayed total (1 dp) gives the per-piece weight to ~4 decimals.
 *
 * Only ONE reading has been captured so far. The rest are `null` placeholders: run
 * the input on the original tool, divide the total by 1000, and paste it in. Any
 * entry with a value is asserted within `tolerance`; null entries are skipped.
 */
const tolerance = 0.03 // fractional, i.e. ±3 %

interface Reading<T> {
  label: string
  input: T
  /** lb per piece, or null until measured */
  eachLb: number | null
}

const bolts: Reading<BoltSpec>[] = [
  // Measured: 10 pcs showed 15.8 lb -> 1.58 lb each (±0.005)
  { label: 'hex 1 x 6, 3" cut thread', input: { kind: 'hex', diameter: 1, length1: 6, thread1: 3, threadType: 'cut' }, eachLb: 1.58 },
  { label: 'hex 1/2 x 4, 2" cut thread', input: { kind: 'hex', diameter: 0.5, length1: 4, thread1: 2, threadType: 'cut' }, eachLb: null },
  { label: 'hex 1 x 6, 3" rolled thread', input: { kind: 'hex', diameter: 1, length1: 6, thread1: 3, threadType: 'rolled' }, eachLb: null },
  { label: 'hex 1-1/2 x 10, 4" cut thread', input: { kind: 'hex', diameter: 1.5, length1: 10, thread1: 4, threadType: 'cut' }, eachLb: null },
  { label: 'heavy hex 1 x 6, 3" cut thread', input: { kind: 'heavyHex', diameter: 1, length1: 6, thread1: 3, threadType: 'cut' }, eachLb: null },
  { label: 'timber 1 x 6, 3" cut thread', input: { kind: 'timber', diameter: 1, length1: 6, thread1: 3, threadType: 'cut' }, eachLb: null },
  { label: 'carriage 1 x 6, 3" cut thread', input: { kind: 'carriage', diameter: 1, length1: 6, thread1: 3, threadType: 'cut' }, eachLb: null },
  { label: 'anchor rod 1 x 24, 6" + 6" thread', input: { kind: 'anchorRod', diameter: 1, length1: 24, thread1: 6, thread2: 6, threadType: 'cut' }, eachLb: null },
  { label: '90° anchor bolt 1 x 24 x 4, 6" thread', input: { kind: 'anchor90', diameter: 1, length1: 24, length2: 4, thread1: 6, threadType: 'cut' }, eachLb: null },
]

const nuts: Reading<{ kind: NutKind; d: number }>[] = (['hex', 'heavyHex', 'square', 'hexJam', 'heavyJam'] as NutKind[]).map((kind) => ({
  label: `${kind} nut, 1"`,
  input: { kind, d: 1 },
  eachLb: null,
}))

const washers: Reading<{ kind: WasherKind; d: number }>[] = (['standard', 'f436', 'ogee'] as WasherKind[]).map((kind) => ({
  label: `${kind} washer, 1"`,
  input: { kind, d: 1 },
  eachLb: null,
}))

const within = (actual: number, expected: number) => Math.abs(actual - expected) / expected <= tolerance

describe('bolt weight model vs original tool', () => {
  for (const r of bolts) {
    const run = r.eachLb === null ? it.skip : it
    run(`bolt: ${r.label}`, () => expect(within(boltWeightEach(r.input), r.eachLb!)).toBe(true))
  }
  for (const r of nuts) {
    const run = r.eachLb === null ? it.skip : it
    run(`nut: ${r.label}`, () => expect(within(nutWeightEach(r.input.kind, r.input.d), r.eachLb!)).toBe(true))
  }
  for (const r of washers) {
    const run = r.eachLb === null ? it.skip : it
    run(`washer: ${r.label}`, () => expect(within(washerWeightEach(r.input.kind, r.input.d), r.eachLb!)).toBe(true))
  }
})
