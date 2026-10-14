/**
 * Inch-dimension parsing and formatting.
 *
 * Fastener drawings mix fractions and decimals freely ("1-1/2", "1 1/2",
 * "3/4", "0.375"), so every calculator input goes through parseDimension.
 */

/** Parse "1-1/2", "1 1/2", "3/4", "0.375", '1.5"' into inches. Returns null when invalid. */
export function parseDimension(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null

  const s = raw
    .trim()
    .replace(/(?:["”″]|in\.?)$/i, '')
    .trim()
  if (!s) return null

  const mixed = s.match(/^(\d+)[\s-]+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const den = Number(mixed[3])
    return den === 0 ? null : Number(mixed[1]) + Number(mixed[2]) / den
  }

  const simple = s.match(/^(\d+)\s*\/\s*(\d+)$/)
  if (simple) {
    const den = Number(simple[2])
    return den === 0 ? null : Number(simple[1]) / den
  }

  if (/^(?:\d+\.?\d*|\.\d+)$/.test(s)) return parseFloat(s)
  return null
}

/** Format inches as a reduced mixed fraction to the nearest 1/denominator (default 1/16). */
export function formatFraction(value: number, denominator = 16): string {
  if (!Number.isFinite(value)) return ''
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  let whole = Math.floor(abs)
  let num = Math.round((abs - whole) * denominator)
  let den = denominator
  if (num === den) {
    whole += 1
    num = 0
  }
  if (num === 0) return `${sign}${whole}`
  const g = gcd(num, den)
  num /= g
  den /= g
  return whole === 0 ? `${sign}${num}/${den}` : `${sign}${whole}-${num}/${den}`
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

/** Round to `dp` places and drop trailing zeros (19.4375 -> "19.438", 48.000 -> "48"). */
export function trimmed(value: number, dp = 3): string {
  return String(parseFloat(value.toFixed(dp)))
}

/** Round half away from zero to `dp` places, matching Math.round(x * 10^dp) / 10^dp. */
export function roundTo(value: number, dp: number): number {
  const f = 10 ** dp
  return Math.round(value * f) / f
}
