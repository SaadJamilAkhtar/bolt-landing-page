import { roundTo } from '../lib/fractions'

/**
 * Carbon-steel plate weight.
 *
 * Reverse-engineered from the live calculator's behaviour:
 *  - density constant 0.2833 lb/in³
 *  - square plate:  (width × length − π(hole/2)²) × thickness
 *  - round plate:   (π(OD/2)² − π(hole/2)²) × thickness
 *  - "weight each" is shown to 2 decimals, "total" to 1 decimal
 */
export const PLATE_DENSITY_LB_PER_IN3 = 0.2833
export const LB_TO_KG = 0.45359237

export type PlateShape = 'square' | 'round'

export interface PlateInput {
  shape: PlateShape
  thickness: number
  width?: number
  length?: number
  outsideDiameter?: number
  holeDiameter?: number
  quantity: number
}

export interface PlateResult {
  ok: true
  /** Rounded for display (2 dp) */
  each: number
  /** Rounded for display (1 dp) */
  total: number
  eachExact: number
  totalExact: number
  /** Net volume in cubic inches */
  volume: number
}

export interface PlateError {
  ok: false
  error: string
}

const circleArea = (d: number) => Math.PI * (d / 2) ** 2

export function plateWeight(input: PlateInput): PlateResult | PlateError {
  const { shape, thickness, quantity } = input
  const hole = input.holeDiameter ?? 0

  if (!(thickness > 0)) return { ok: false, error: 'Enter a thickness greater than zero.' }
  if (!(quantity > 0)) return { ok: false, error: 'Enter a quantity of at least 1.' }
  if (hole < 0) return { ok: false, error: 'Hole diameter cannot be negative.' }

  let grossArea: number
  let limiting: number
  if (shape === 'square') {
    const { width, length } = input
    if (!(width && width > 0) || !(length && length > 0)) {
      return { ok: false, error: 'Enter both a width and a length.' }
    }
    grossArea = width * length
    limiting = Math.min(width, length)
  } else {
    const od = input.outsideDiameter
    if (!(od && od > 0)) return { ok: false, error: 'Enter an outside diameter.' }
    grossArea = circleArea(od)
    limiting = od
  }

  if (hole >= limiting) {
    return { ok: false, error: 'The hole has to be smaller than the plate.' }
  }

  const volume = (grossArea - (hole > 0 ? circleArea(hole) : 0)) * thickness
  const eachExact = volume * PLATE_DENSITY_LB_PER_IN3
  const totalExact = eachExact * quantity

  return {
    ok: true,
    each: roundTo(eachExact, 2),
    total: roundTo(totalExact, 1),
    eachExact,
    totalExact,
    volume,
  }
}
