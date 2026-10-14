/**
 * Dimension-line primitives for the live drawings in the calculators.
 * Blueprint blue, arrowheads at both ends, label centred on the line.
 */

const ARROW = 6

export function DimDefs() {
  return (
    <defs>
      <marker id="dim-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth={ARROW} markerHeight={ARROW} orient="auto-start-reverse">
        <path d="M0 1L10 5L0 9z" fill="currentColor" />
      </marker>
    </defs>
  )
}

interface DimProps {
  x1: number
  y1: number
  x2: number
  y2: number
  label: string
  /** Offset of the label perpendicular to the line (negative = above / left). */
  offset?: number
  /** Extension lines from the feature to the dimension line. */
  ext?: [number, number, number, number][]
  active?: boolean
}

export function Dim({ x1, y1, x2, y2, label, offset = -8, ext = [], active = true }: DimProps) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const vertical = Math.abs(x2 - x1) < Math.abs(y2 - y1)
  return (
    <g className={`dim ${active ? '' : 'dim--idle'}`} color="var(--blue-300)" stroke="currentColor" fill="none" strokeWidth={1}>
      {ext.map(([a, b, c, d], i) => (
        <path key={i} d={`M${a} ${b}L${c} ${d}`} strokeDasharray="2 3" opacity={0.7} />
      ))}
      <path d={`M${x1} ${y1}L${x2} ${y2}`} markerStart="url(#dim-arrow)" markerEnd="url(#dim-arrow)" />
      <text
        x={vertical ? mx + offset : mx}
        y={vertical ? my : my + offset}
        textAnchor={vertical ? 'end' : 'middle'}
        dominantBaseline={vertical ? 'middle' : 'auto'}
        fill="currentColor"
        stroke="none"
        fontFamily="var(--font-mono)"
        fontSize="11"
        letterSpacing="0.04em"
      >
        {label}
      </text>
    </g>
  )
}
