import { formatFraction, roundTo } from '../lib/fractions'

/**
 * Bolt / nut / washer weight estimator.
 *
 * The live tool computes weights on a server from "theoretical and sampled"
 * tables. This is an independent physical model instead: nominal head, nut and
 * washer dimensions from the ASME B18 series, shank and thread volumes from
 * geometry, steel at 0.2833 lb/in³. Anything off the standard size charts is
 * interpolated or scaled, which is what the original says it does as well.
 *
 * Every tunable constant lives in MODEL so calibration is one edit.
 */

export const MODEL = {
  steelDensity: 0.2833, // lb/in³ (same constant the plate calculator uses)
  zincDensity: 0.2578, // lb/in³
  zincThickness: 0.003, // in. – typical hot-dip coating on fasteners
  headChamferLoss: 0.06, // fraction of a hex head volume removed by the 30° chamfer
  nutChamferLoss: 0.1, // double-chamfered nuts lose a little more
  /** Effective area of a cut thread, as a diameter: pitch diameter (D − 0.6495/n). */
  cutThreadBasis: 'pitch' as 'pitch' | 'minor',
  /** Rolled-thread stock is drawn down towards the pitch diameter. Fraction of D − E removed from the body. */
  rolledBodyReduction: 1,
  bendAllowance: 2, // × D taken off L1 + L2 for the 90° bend
}

export type BoltKind = 'hex' | 'heavyHex' | 'timber' | 'carriage' | 'anchorRod' | 'anchor90'
export type NutKind = 'hex' | 'heavyHex' | 'square' | 'hexJam' | 'heavyJam'
export type WasherKind = 'standard' | 'f436' | 'ogee'
export type Finish = 'black' | 'galvanized'
export type ThreadType = 'cut' | 'rolled'

export const BOLT_LABELS: Record<BoltKind, string> = {
  hex: 'Hex Bolt',
  heavyHex: 'Heavy Hex Bolt',
  timber: 'Timber Bolt',
  carriage: 'Carriage Bolt',
  anchorRod: 'Anchor Rod',
  anchor90: '90° Anchor Bolt',
}

export const NUT_LABELS: Record<NutKind, string> = {
  hex: 'Hex Nut',
  heavyHex: 'Heavy Hex Nut',
  square: 'Square Nut',
  hexJam: 'Hex Jam Nut',
  heavyJam: 'Heavy Jam Nut',
}

export const WASHER_LABELS: Record<WasherKind, string> = {
  standard: 'Standard Flat Washer',
  f436: 'F436 Hardened Washer',
  ogee: 'Ogee Washer',
}

/* ------------------------------------------------------------------ */
/* Standard size charts (inches)                                       */
/* ------------------------------------------------------------------ */

type Row = readonly number[]

/** Hex bolt, ASME B18.2.1: [D, width across flats F, head height H] */
const HEX_BOLT: Row[] = [
  [0.25, 0.4375, 0.1719], [0.3125, 0.5, 0.2188], [0.375, 0.5625, 0.25], [0.4375, 0.625, 0.2969],
  [0.5, 0.75, 0.3438], [0.5625, 0.8125, 0.3906], [0.625, 0.9375, 0.4219], [0.75, 1.125, 0.5],
  [0.875, 1.3125, 0.5781], [1, 1.5, 0.6719], [1.125, 1.6875, 0.75], [1.25, 1.875, 0.8438],
  [1.375, 2.0625, 0.9063], [1.5, 2.25, 1],
]

/** Heavy hex structural bolt, ASME B18.2.6: [D, F, H] */
const HEAVY_HEX_BOLT: Row[] = [
  [0.5, 0.875, 0.3125], [0.625, 1.0625, 0.3906], [0.75, 1.25, 0.4688], [0.875, 1.4375, 0.5469],
  [1, 1.625, 0.6094], [1.125, 1.8125, 0.6875], [1.25, 2, 0.7813], [1.375, 2.1875, 0.8438],
  [1.5, 2.375, 0.9375],
]

/** Regular hex nut, ASME B18.2.2: [D, F, thickness] */
const HEX_NUT: Row[] = [
  [0.25, 0.4375, 0.2188], [0.3125, 0.5, 0.2656], [0.375, 0.5625, 0.3281], [0.4375, 0.6875, 0.375],
  [0.5, 0.75, 0.4375], [0.5625, 0.875, 0.4844], [0.625, 0.9375, 0.5469], [0.75, 1.125, 0.6406],
  [0.875, 1.3125, 0.75], [1, 1.5, 0.8594], [1.125, 1.6875, 0.9688], [1.25, 1.875, 1.0625],
  [1.375, 2.0625, 1.1719], [1.5, 2.25, 1.2813],
]

/** Heavy hex nut, ASME B18.2.2: [D, F, thickness] (thickness = D − 1/64 above 1/2") */
const HEAVY_HEX_NUT: Row[] = [
  [0.5, 0.875, 0.4844], [0.625, 1.0625, 0.6094], [0.75, 1.25, 0.7344], [0.875, 1.4375, 0.8594],
  [1, 1.625, 0.9844], [1.125, 1.8125, 1.1094], [1.25, 2, 1.2344], [1.375, 2.1875, 1.3594],
  [1.5, 2.375, 1.4844],
]

/** Hex jam nut: [D, F, thickness] */
const HEX_JAM_NUT: Row[] = [
  [0.25, 0.4375, 0.1563], [0.3125, 0.5, 0.1875], [0.375, 0.5625, 0.2188], [0.4375, 0.6875, 0.25],
  [0.5, 0.75, 0.3125], [0.5625, 0.875, 0.3438], [0.625, 0.9375, 0.375], [0.75, 1.125, 0.4219],
  [0.875, 1.3125, 0.4844], [1, 1.5, 0.5469], [1.125, 1.6875, 0.6094], [1.25, 1.875, 0.7188],
  [1.375, 2.0625, 0.7813], [1.5, 2.25, 0.8438],
]

/** Square nut: [D, F, thickness] */
const SQUARE_NUT: Row[] = [
  [0.25, 0.4375, 0.2188], [0.3125, 0.5625, 0.2656], [0.375, 0.625, 0.3281], [0.4375, 0.75, 0.375],
  [0.5, 0.8125, 0.4375], [0.625, 1, 0.5469], [0.75, 1.125, 0.6563], [0.875, 1.3125, 0.7656],
  [1, 1.5, 0.875], [1.125, 1.6875, 1], [1.25, 1.875, 1.0938], [1.375, 2.0625, 1.2031],
  [1.5, 2.25, 1.3125],
]

/** Standard (USS wide) flat washer, ASME B18.22.1: [D, ID, OD, t] */
const STANDARD_WASHER: Row[] = [
  [0.25, 0.281, 0.734, 0.065], [0.3125, 0.344, 0.875, 0.083], [0.375, 0.406, 1, 0.083],
  [0.4375, 0.469, 1.125, 0.083], [0.5, 0.531, 1.25, 0.109], [0.5625, 0.594, 1.469, 0.109],
  [0.625, 0.656, 1.75, 0.134], [0.75, 0.812, 2, 0.148], [0.875, 0.938, 2.25, 0.165],
  [1, 1.062, 2.5, 0.165], [1.125, 1.25, 2.75, 0.165], [1.25, 1.375, 3, 0.165],
  [1.375, 1.5, 3.25, 0.18], [1.5, 1.625, 3.5, 0.18],
]

/** F436 hardened structural washer: [D, ID, OD, t] */
const F436_WASHER: Row[] = [
  [0.5, 0.5625, 1.0625, 0.136], [0.625, 0.6875, 1.3125, 0.149], [0.75, 0.8125, 1.4688, 0.149],
  [0.875, 0.9375, 1.75, 0.156], [1, 1.125, 2, 0.156], [1.125, 1.25, 2.25, 0.156],
  [1.25, 1.375, 2.5, 0.156], [1.375, 1.5, 2.75, 0.156], [1.5, 1.625, 3, 0.156],
]

/** Threads per inch, UNC to 1-1/2 then the 4-pitch series. */
const TPI: Row[] = [
  [0.25, 20], [0.3125, 18], [0.375, 16], [0.4375, 14], [0.5, 13], [0.5625, 12], [0.625, 11],
  [0.75, 10], [0.875, 9], [1, 8], [1.125, 7], [1.25, 7], [1.375, 6], [1.5, 6], [1.75, 5],
  [2, 4.5], [2.25, 4.5], [2.5, 4], [3, 4], [4, 4],
]

/** Linear interpolation between chart rows; scales proportionally outside the chart. */
function chart(rows: Row[], d: number, col: number): number {
  const first = rows[0]
  const last = rows[rows.length - 1]
  if (d <= first[0]) return (first[col] * d) / first[0]
  if (d >= last[0]) return (last[col] * d) / last[0]
  for (let i = 1; i < rows.length; i++) {
    if (d <= rows[i][0]) {
      const a = rows[i - 1]
      const b = rows[i]
      const t = (d - a[0]) / (b[0] - a[0])
      return a[col] + (b[col] - a[col]) * t
    }
  }
  return last[col]
}

/* ------------------------------------------------------------------ */
/* Geometry primitives                                                 */
/* ------------------------------------------------------------------ */

interface Solid {
  volume: number
  /** Exposed surface area, used for the zinc coating allowance. */
  area: number
}

const circleArea = (d: number) => (Math.PI / 4) * d * d
const hexArea = (f: number) => (Math.sqrt(3) / 2) * f * f

function hexPrism(f: number, h: number, chamferLoss: number): Solid {
  return {
    volume: hexArea(f) * h * (1 - chamferLoss),
    area: 2 * hexArea(f) + 6 * (f / Math.sqrt(3)) * h,
  }
}

function cylinder(dia: number, length: number): Solid {
  return { volume: circleArea(dia) * length, area: Math.PI * dia * length }
}

const add = (...parts: Solid[]): Solid => ({
  volume: parts.reduce((s, p) => s + p.volume, 0),
  area: parts.reduce((s, p) => s + p.area, 0),
})

export const threadsPerInch = (d: number) => chart(TPI, d, 1)
export const pitchDiameter = (d: number) => d - 0.6495 / threadsPerInch(d)
const minorDiameter = (d: number) => d - 1.2269 / threadsPerInch(d)

function threadedDiameter(d: number): number {
  return MODEL.cutThreadBasis === 'pitch' ? pitchDiameter(d) : minorDiameter(d)
}

/** Round-bar body of an externally threaded part. */
function bar(d: number, plain: number, threaded: number, threadType: ThreadType): Solid {
  const e = threadedDiameter(d)
  const body = threadType === 'rolled' ? d - (d - e) * MODEL.rolledBodyReduction : d
  return add(cylinder(body, plain), cylinder(e, threaded))
}

/* ------------------------------------------------------------------ */
/* Items                                                               */
/* ------------------------------------------------------------------ */

export interface BoltSpec {
  kind: BoltKind
  diameter: number
  length1: number
  /** 90° anchor bolt hook leg */
  length2?: number
  thread1?: number
  /** Anchor rods only: threaded length on the second end */
  thread2?: number
  threadType?: ThreadType
}

export type SpecError = { ok: false; error: string }

export function validateBolt(spec: BoltSpec): string | null {
  const { kind, diameter, length1 } = spec
  if (!(diameter > 0) || diameter > 6) return 'Enter a diameter between 0 and 6 inches.'
  if (!(length1 > 0)) return 'Enter a length.'
  const t1 = spec.thread1 ?? 0
  const t2 = spec.thread2 ?? 0
  if (t1 < 0 || t2 < 0) return 'Thread length cannot be negative.'
  if (kind === 'anchorRod') {
    if (t1 + t2 > length1) return 'Thread lengths add up to more than the rod length.'
  } else if (t1 > length1) {
    return 'Thread length cannot be longer than the bolt.'
  }
  if (kind === 'anchor90' && !(spec.length2 && spec.length2 > 0)) return 'Enter the hook length (L2).'
  return null
}

function headSolid(kind: BoltKind, d: number): Solid {
  switch (kind) {
    case 'hex':
      return hexPrism(chart(HEX_BOLT, d, 1), chart(HEX_BOLT, d, 2), MODEL.headChamferLoss)
    case 'heavyHex':
      // Below 1/2" there is no structural size; fall back to the regular hex chart.
      return d < 0.5
        ? headSolid('hex', d)
        : hexPrism(chart(HEAVY_HEX_BOLT, d, 1), chart(HEAVY_HEX_BOLT, d, 2), MODEL.headChamferLoss)
    case 'carriage': {
      // Round dome head over a square neck.
      const a = (2 * d + 0.094) / 2
      const h = 0.625 * d
      const dome = (Math.PI * h * (3 * a * a + h * h)) / 6
      const neckLen = 0.55 * d
      const neck = (d * d - circleArea(d)) * neckLen
      return { volume: dome + neck, area: 2 * Math.PI * a * h + 4 * d * neckLen }
    }
    case 'timber': {
      // Low round head, no square neck.
      const a = (1.9 * d) / 2
      const h = 0.45 * d
      return {
        volume: (Math.PI * h * (3 * a * a + h * h)) / 6,
        area: 2 * Math.PI * a * h,
      }
    }
    default:
      return { volume: 0, area: 0 }
  }
}

function boltSolid(spec: BoltSpec): Solid {
  const { kind, diameter: d, length1: l1 } = spec
  const t1 = spec.thread1 ?? 0
  const tt = spec.threadType ?? 'cut'

  if (kind === 'anchorRod') {
    const t2 = spec.thread2 ?? 0
    return bar(d, l1 - t1 - t2, t1 + t2, tt)
  }
  if (kind === 'anchor90') {
    const total = Math.max(l1 + (spec.length2 ?? 0) - MODEL.bendAllowance * d, 0)
    return bar(d, Math.max(total - t1, 0), t1, tt)
  }
  return add(headSolid(kind, d), bar(d, l1 - t1, t1, tt))
}

function nutSolid(kind: NutKind, d: number): Solid {
  const rows =
    kind === 'hex' ? HEX_NUT
    : kind === 'heavyHex' ? HEAVY_HEX_NUT
    : kind === 'square' ? SQUARE_NUT
    : kind === 'hexJam' ? HEX_JAM_NUT
    : HEAVY_HEX_NUT
  const f = chart(rows, d, 1)
  // Heavy jam nuts: heavy-hex width across flats on a jam-nut thickness.
  const t = kind === 'heavyJam' ? chart(HEX_JAM_NUT, d, 2) : chart(rows, d, 2)
  const hole = threadedDiameter(d)
  const outer =
    kind === 'square'
      ? { volume: f * f * t * (1 - MODEL.nutChamferLoss * 0.6), area: 2 * f * f + 4 * f * t }
      : hexPrism(f, t, MODEL.nutChamferLoss)
  return {
    volume: outer.volume - circleArea(hole) * t,
    area: outer.area + Math.PI * hole * t,
  }
}

function washerSolid(kind: WasherKind, d: number): Solid {
  let id: number, od: number, t: number
  if (kind === 'ogee') {
    // Dished cast washer: modelled as a ring at 70 % of a flat disc's volume.
    od = 3 * d + 0.75
    id = d + 0.0625
    t = 0.28 * d + 0.2
    const ring = (circleArea(od) - circleArea(id)) * t * 0.7
    return { volume: ring, area: 2 * (circleArea(od) - circleArea(id)) + Math.PI * (od + id) * t }
  }
  const rows = kind === 'f436' ? F436_WASHER : STANDARD_WASHER
  id = chart(rows, d, 1)
  od = chart(rows, d, 2)
  t = chart(rows, d, 3)
  const face = circleArea(od) - circleArea(id)
  return { volume: face * t, area: 2 * face + Math.PI * (od + id) * t }
}

const weightOf = (s: Solid, finish: Finish) =>
  s.volume * MODEL.steelDensity +
  (finish === 'galvanized' ? s.area * MODEL.zincThickness * MODEL.zincDensity : 0)

export const boltWeightEach = (spec: BoltSpec, finish: Finish = 'black') =>
  weightOf(boltSolid(spec), finish)
export const nutWeightEach = (kind: NutKind, d: number, finish: Finish = 'black') =>
  weightOf(nutSolid(kind, d), finish)
export const washerWeightEach = (kind: WasherKind, d: number, finish: Finish = 'black') =>
  weightOf(washerSolid(kind, d), finish)

/* ------------------------------------------------------------------ */
/* Line items (what ends up in the calculation history)                */
/* ------------------------------------------------------------------ */

export interface Hardware {
  nuts?: { kind: NutKind; count: number }
  washers?: { kind: WasherKind; count: number }
}

export type ItemSpec =
  | { category: 'bolt'; bolt: BoltSpec; hardware: Hardware; finish: Finish }
  | { category: 'nut'; kind: NutKind; diameter: number; finish: Finish }
  | { category: 'washer'; kind: WasherKind; diameter: number; finish: Finish }

export interface WeightResult {
  /** Pounds per assembled piece (bolt plus any hardware), unrounded. */
  eachExact: number
  each: number
  total: number
  totalExact: number
}

export function itemWeight(item: ItemSpec, quantity: number): WeightResult {
  let each: number
  if (item.category === 'bolt') {
    each = boltWeightEach(item.bolt, item.finish)
    const { nuts, washers } = item.hardware
    if (nuts) each += nutWeightEach(nuts.kind, item.bolt.diameter, item.finish) * nuts.count
    if (washers) each += washerWeightEach(washers.kind, item.bolt.diameter, item.finish) * washers.count
  } else if (item.category === 'nut') {
    each = nutWeightEach(item.kind, item.diameter, item.finish)
  } else {
    each = washerWeightEach(item.kind, item.diameter, item.finish)
  }
  const totalExact = each * quantity
  return {
    eachExact: each,
    each: roundTo(each, 2),
    total: roundTo(totalExact, 1),
    totalExact,
  }
}

/* "1 x 6 Black Hex Bolt with 3 of thread" style descriptions */

const q = (v: number) => `${formatFraction(v, 16)}"`
const finishWord = (f: Finish) => (f === 'galvanized' ? 'Galvanized' : 'Black')

export function describeItem(item: ItemSpec): string {
  if (item.category === 'nut') {
    return `${q(item.diameter)} ${finishWord(item.finish)} ${NUT_LABELS[item.kind]}`
  }
  if (item.category === 'washer') {
    return `${q(item.diameter)} ${finishWord(item.finish)} ${WASHER_LABELS[item.kind]}`
  }
  const { bolt, finish, hardware } = item
  const base = `${q(bolt.diameter)} x ${q(bolt.length1)}`
  let text: string
  if (bolt.kind === 'anchorRod') {
    text = `${base} ${finishWord(finish)} Rod with ${q(bolt.thread1 ?? 0)} of thread one end and ${q(bolt.thread2 ?? 0)} of thread other end`
  } else if (bolt.kind === 'anchor90') {
    text = `${base} x ${q(bolt.length2 ?? 0)} x ${q(bolt.thread1 ?? 0)} ${finishWord(finish)} 90° Bent Anchor Bolt`
  } else {
    const thread = bolt.thread1 ? ` with ${q(bolt.thread1)} of thread` : ''
    text = `${base} ${finishWord(finish)} ${BOLT_LABELS[bolt.kind]}${thread}`
  }
  const extras: string[] = []
  if (hardware.nuts) extras.push(`${hardware.nuts.count} ${NUT_LABELS[hardware.nuts.kind]}${hardware.nuts.count > 1 ? 's' : ''}`)
  if (hardware.washers) extras.push(`${hardware.washers.count} ${WASHER_LABELS[hardware.washers.kind]}${hardware.washers.count > 1 ? 's' : ''}`)
  return extras.length ? `${text} + ${extras.join(' + ')}` : text
}
