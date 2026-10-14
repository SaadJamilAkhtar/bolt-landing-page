import type { ReactNode } from 'react'
import type { GlyphKind } from '../data/catalog'

/**
 * Original technical line drawings for every product type.
 * Drawn in a 240×140 box with currentColor strokes. Bar stock is drawn as a
 * "tube" (outer stroke + inner stroke in --glyph-bg) so bends read as real bar.
 */

const SW = 1.8
const CY = 70

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: SW, strokeLinejoin: 'round', strokeLinecap: 'round' } as const

function Tube({ d, w = 13 }: { d: string; w?: number }) {
  return (
    <g fill="none" strokeLinecap="butt" strokeLinejoin="round">
      <path d={d} stroke="currentColor" strokeWidth={w + SW * 2} />
      <path d={d} stroke="var(--glyph-bg, transparent)" strokeWidth={w} />
    </g>
  )
}

/** Diagonal thread ticks across a horizontal shank. */
function ThreadsH({ x1, x2, y1 = CY - 8, y2 = CY + 8, step = 6 }: { x1: number; x2: number; y1?: number; y2?: number; step?: number }) {
  const n = Math.max(Math.floor((x2 - x1) / step), 0)
  return (
    <g {...line} strokeWidth={1.3}>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M${x1 + i * step} ${y2} l${step * 0.75} ${y1 - y2}`} />
      ))}
    </g>
  )
}

/** Thread ticks across a vertical bar, between y1 and y2, centred on x. */
function ThreadsV({ x, y1, y2, w = 13, step = 6 }: { x: number; y1: number; y2: number; w?: number; step?: number }) {
  const n = Math.max(Math.floor((y2 - y1) / step), 0)
  return (
    <g {...line} strokeWidth={1.3}>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M${x - w / 2} ${y1 + i * step + step * 0.75} l${w} ${-step * 0.75}`} />
      ))}
    </g>
  )
}

type Head = 'hex' | 'heavy' | 'square' | 'dome' | 'flat' | 'flange' | 'none' | 'tc' | 'step'

function HeadShape({ kind }: { kind: Head }) {
  switch (kind) {
    case 'hex':
      return <g {...line}><path d="M30 38h24v64H30z" /><path d="M30 54h24M30 86h24" /></g>
    case 'heavy':
      return <g {...line}><path d="M26 30h30v80H26z" /><path d="M26 50h30M26 90h30" /></g>
    case 'square':
      return <g {...line}><path d="M30 40h24v60H30z" /><path d="M30 48h24" /></g>
    case 'dome':
      return <g {...line}><path d="M56 38C34 38 26 52 26 70s8 32 30 32z" /><path d="M56 62v16" strokeWidth={1} /></g>
    case 'flat':
      return <g {...line}><path d="M28 36v68l28-26V62z" /></g>
    case 'flange':
      return <g {...line}><path d="M24 32h8v76h-8z" /><path d="M32 46h22v48H32z" /><path d="M32 62h22M32 78h22" /></g>
    case 'tc':
      return <g {...line}><path d="M28 36h22l6 10v48l-6 10H28z" /><path d="M214 62h16v16h-16z" /></g>
    case 'step':
      return <g {...line}><path d="M30 40h22v60H30z" /></g>
    default:
      return null
  }
}

interface BoltProps {
  head?: Head
  end?: number
  thread?: 'tip' | 'full' | 'both' | 'none'
  threadLen?: number
  tip?: 'flat' | 'point' | 'chisel'
  dia?: number
  neck?: boolean
  extra?: ReactNode
}

function Bolt({ head = 'hex', end = 218, thread = 'tip', threadLen = 64, tip = 'flat', dia = 16, neck = false, extra }: BoltProps) {
  const start = head === 'none' ? 20 : head === 'heavy' ? 56 : 54
  const t = CY - dia / 2
  const b = CY + dia / 2
  const body = `M${start} ${t}H${end}${tip === 'point' ? `L${end + 18} ${CY}L${end} ${b}` : tip === 'chisel' ? `L${end + 14} ${CY - 3}V${CY + 3}L${end} ${b}` : `V${b}`}H${start}`
  return (
    <g>
      <HeadShape kind={head} />
      {neck && <path {...line} d={`M${start - 6} ${t - 4}h8v${dia + 8}h-8z`} />}
      <path {...line} d={`${body}${tip === 'flat' ? 'z' : ''}`} />
      {thread !== 'none' && (
        <ThreadsH
          x1={thread === 'full' || thread === 'both' ? start + 4 : end - threadLen}
          x2={end - 2}
          y1={t}
          y2={b}
        />
      )}
      {thread === 'both' && <ThreadsH x1={start + 4} x2={start + threadLen} y1={t} y2={b} />}
      {extra}
    </g>
  )
}

/** Hexagon (pointy sides left/right) centred at cx,cy. */
const hexPts = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')

function Nut({ shape = 'hex', r = 52, rings = 1, side }: { shape?: 'hex' | 'square'; r?: number; rings?: number; side?: 'jam' | 'long' }) {
  return (
    <g {...line}>
      {shape === 'hex' ? (
        <polygon points={hexPts(side === 'long' ? 70 : 100, CY, r)} />
      ) : (
        <rect x={(side ? 70 : 100) - r * 0.85} y={CY - r * 0.85} width={r * 1.7} height={r * 1.7} />
      )}
      <circle cx={side ? 70 : 100} cy={CY} r={r * 0.34} />
      {rings > 1 && <circle cx={side ? 70 : 100} cy={CY} r={r * 0.62} />}
      <circle cx={side ? 70 : 100} cy={CY} r={r * 0.82} strokeWidth={1} strokeDasharray="3 3" />
      {side === 'jam' && <path d="M168 40h14v60h-14zM168 54h14M168 86h14" />}
    </g>
  )
}

function Washer({ od = 52, id = 16, extra }: { od?: number; id?: number; extra?: ReactNode }) {
  return (
    <g {...line}>
      <circle cx={100} cy={CY} r={od} />
      <circle cx={100} cy={CY} r={id} />
      {extra}
      <path d="M176 44h10v52h-10z" />
    </g>
  )
}

function Plate({ holes = 4 }: { holes?: number }) {
  const pts = [[70, 52], [170, 52], [70, 96], [170, 96], [120, 74]].slice(0, holes)
  return (
    <g {...line}>
      <path d="M40 36h160v72H40z" />
      <path d="M40 36l14-12h160l-14 12M214 24v72l-14 12" />
      {pts.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={7} />
      ))}
    </g>
  )
}

const clevisAt = (x: number, dir: 1 | -1) => (
  <g {...line}>
    <path d={`M${x} ${CY - 22}h${dir * 30}v44h${-dir * 30}`} />
    <path d={`M${x + dir * 30} ${CY - 22}c${dir * 12} 0 ${dir * 12} 44 0 44`} />
    <circle cx={x + dir * 40} cy={CY} r={5} />
    <path d={`M${x} ${CY - 8}h${-dir * 8}v16h${dir * 8}`} />
  </g>
)

export function Glyph({ kind, className, label }: { kind: GlyphKind; className?: string; label?: string }) {
  return (
    <svg
      className={`glyph ${className ?? ''}`}
      viewBox="0 0 240 140"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {draw(kind)}
    </svg>
  )
}

function draw(kind: GlyphKind): ReactNode {
  switch (kind) {
    /* headed bolts */
    case 'hexBolt': return <Bolt head="hex" />
    case 'heavyHexBolt': return <Bolt head="heavy" dia={20} />
    case 'structuralBolt': return <Bolt head="heavy" dia={18} threadLen={48} />
    case 'squareBolt': return <Bolt head="square" />
    case 'timberBolt': return <Bolt head="dome" threadLen={40} />
    case 'headedAnchor': return <Bolt head="heavy" thread="tip" threadLen={70} dia={18} extra={<path {...line} d="M26 30v80" strokeWidth={3} />} />
    case 'lag': return <Bolt head="hex" tip="point" end={196} thread="full" threadLen={140} />
    case 'squareLag': return <Bolt head="square" tip="point" end={196} thread="full" threadLen={140} />
    case 'carriage': return <Bolt head="dome" neck threadLen={60} />
    case 'spike': return <Bolt head="flat" thread="none" tip="chisel" dia={12} />
    case 'machine': return <Bolt head="square" thread="tip" threadLen={80} />
    case 'washerHead': return <Bolt head="flange" />
    case 'roundHead': return <Bolt head="dome" thread="tip" threadLen={60} />
    case 'tcBolt': return <Bolt head="dome" thread="tip" end={206} threadLen={60} extra={<path {...line} d="M206 62h16v16h-16zM210 62v16M214 62v16M218 62v16" strokeWidth={1.2} />} />
    case 'countersunk': return <Bolt head="flat" threadLen={70} />
    case 'stepBolt': return <Bolt head="step" threadLen={50} extra={<path {...line} d="M54 70H20v-26h14" />} />
    case 'customHead': return <Bolt head="hex" extra={<path {...line} d="M30 38l-10 8v48l10 8" />} />
    case 'guardrail': return <Bolt head="dome" thread="tip" threadLen={40} neck />

    /* rods */
    case 'anchorRod': return <Bolt head="none" thread="both" end={220} threadLen={50} />
    case 'allThread': return <Bolt head="none" thread="full" end={220} />
    case 'tieRod':
      return (
        <g>
          <path {...line} d="M70 62h100v16H70z" />
          <ThreadsH x1={70} x2={90} y1={62} y2={78} />
          <ThreadsH x1={150} x2={170} y1={62} y2={78} />
          {clevisAt(70, -1)}
          {clevisAt(170, 1)}
        </g>
      )
    case 'driftPin': return <Bolt head="none" thread="none" end={214} tip="point" dia={14} />
    case 'swedged':
      return (
        <g>
          <path {...line} d="M20 58h60l10 6h124v12H90l-10 6H20z" />
          <ThreadsH x1={24} x2={74} y1={58} y2={82} />
        </g>
      )
    case 'rebar':
      return (
        <g>
          <Bolt head="none" thread="both" end={220} threadLen={36} dia={18} />
          <g {...line} strokeWidth={1.2}>
            {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${72 + i * 14} ${CY - 9}l7 18`} />)}
          </g>
        </g>
      )

    /* bent bolts */
    case 'lBolt':
      return (
        <g>
          <Tube d="M176 12V104Q176 122 158 122H62" />
          <ThreadsV x={176} y1={12} y2={60} />
        </g>
      )
    case 'uRound':
      return (
        <g>
          <Tube d="M70 12V76A50 50 0 0 0 170 76V12" />
          <ThreadsV x={70} y1={12} y2={50} />
          <ThreadsV x={170} y1={12} y2={50} />
        </g>
      )
    case 'uSquare':
      return (
        <g>
          <Tube d="M70 12V116H170V12" />
          <ThreadsV x={70} y1={12} y2={50} />
          <ThreadsV x={170} y1={12} y2={50} />
        </g>
      )
    case 'eyeClosed':
      return (
        <g>
          <circle cx={62} cy={CY} r={28} fill="none" stroke="currentColor" strokeWidth={13 + SW * 2} />
          <circle cx={62} cy={CY} r={28} fill="none" stroke="var(--glyph-bg, transparent)" strokeWidth={13} />
          <Tube d="M90 70H224" />
          <ThreadsH x1={164} x2={222} />
        </g>
      )
    case 'eyeOpen':
      return (
        <g>
          <Tube d="M224 70H92M92 70A28 28 0 1 0 74 44" />
          <ThreadsH x1={164} x2={222} />
        </g>
      )
    case 'hookRound':
      return (
        <g>
          <Tube d="M224 104H100A34 34 0 0 1 100 36" />
          <ThreadsH x1={166} x2={222} y1={97.5} y2={110.5} />
        </g>
      )
    case 'hookSquare':
      return (
        <g>
          <Tube d="M224 104H80V36H118" />
          <ThreadsH x1={166} x2={222} y1={97.5} y2={110.5} />
        </g>
      )
    case 'jBolt':
      return (
        <g>
          <Tube d="M180 12V96A28 28 0 0 1 124 96V70" />
          <ThreadsV x={180} y1={12} y2={56} />
        </g>
      )
    case 'customHook':
      return (
        <g>
          <Tube d="M200 12V100Q200 124 176 124H112L66 84L98 56" />
          <ThreadsV x={200} y1={12} y2={54} />
        </g>
      )

    /* nuts */
    case 'nutHex': return <Nut />
    case 'nutHeavy': return <Nut r={58} />
    case 'nutSquare': return <Nut shape="square" />
    case 'nutJam': return <Nut side="jam" r={46} />
    case 'nutLock': return <Nut rings={2} />
    case 'nutRecessed': return <Nut rings={2} r={56} />
    case 'nutCoupling':
      return (
        <g {...line}>
          <path d="M30 40h180v60H30z" />
          <path d="M30 54h180M30 86h180M120 40v60" />
          <path d="M30 70h180" strokeDasharray="4 4" strokeWidth={1} />
        </g>
      )
    case 'nutSleeve':
      return (
        <g {...line}>
          <path d="M30 46h180v48H30z" />
          <ellipse cx={30} cy={CY} rx={8} ry={24} />
          <path d="M104 46v48M136 46v48" strokeWidth={1.2} />
          <path d="M30 70h180" strokeDasharray="4 4" strokeWidth={1} />
        </g>
      )

    /* washers */
    case 'washerFlat': return <Washer />
    case 'washerHard': return <Washer extra={<circle cx={100} cy={CY} r={44} strokeWidth={1} />} />
    case 'washerLock':
      return (
        <g {...line}>
          <path d="M100 18a52 52 0 1 0 14 2" strokeWidth={9} stroke="currentColor" />
          <path d="M100 18a52 52 0 1 0 14 2" strokeWidth={5} stroke="var(--glyph-bg, transparent)" />
          <circle cx={100} cy={CY} r={16} strokeWidth={1} />
          <path d="M176 60h14l-4 10 4 10h-14" />
        </g>
      )
    case 'washerMalleable':
      return (
        <Washer
          extra={
            <g strokeWidth={1.1}>
              {Array.from({ length: 12 }, (_, i) => {
                const a = (Math.PI / 6) * i
                return <path key={i} d={`M${100 + 24 * Math.cos(a)} ${CY + 24 * Math.sin(a)}L${100 + 46 * Math.cos(a)} ${CY + 46 * Math.sin(a)}`} />
              })}
            </g>
          }
        />
      )
    case 'washerRound':
      return (
        <g {...line}>
          <circle cx={100} cy={CY} r={54} />
          <circle cx={100} cy={CY} r={13} />
          <path d="M46 70v12a54 54 0 0 0 108 0V70" strokeWidth={1.3} />
          <path d="M176 38h12v64h-12z" />
        </g>
      )
    case 'washerSquare':
      return (
        <g {...line}>
          <path d="M50 28h96v96H50z" />
          <circle cx={98} cy={76} r={14} />
          <path d="M50 28l14-12h96l-14 12M160 16v96l-14 12" />
        </g>
      )
    case 'washerOgee':
      return <Washer od={56} extra={<><circle cx={100} cy={CY} r={42} strokeWidth={1.1} /><circle cx={100} cy={CY} r={28} strokeWidth={1.1} /></>} />
    case 'washerBevel':
      return (
        <g {...line}>
          <circle cx={100} cy={CY} r={50} />
          <circle cx={100} cy={CY} r={15} />
          <path d="M170 40h20v54l-20-14z" />
          <path d="M60 70a40 40 0 0 1 80 0" strokeWidth={1} strokeDasharray="3 3" />
        </g>
      )
    case 'washerDti':
      return (
        <Washer
          extra={
            <g>
              {Array.from({ length: 8 }, (_, i) => {
                const a = (Math.PI / 4) * i + 0.39
                return <circle key={i} cx={100 + 36 * Math.cos(a)} cy={CY + 36 * Math.sin(a)} r={4} />
              })}
            </g>
          }
        />
      )
    case 'washerRosette':
      return (
        <g {...line}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (Math.PI / 4) * i
            return <circle key={i} cx={100 + 40 * Math.cos(a)} cy={CY + 40 * Math.sin(a)} r={14} />
          })}
          <circle cx={100} cy={CY} r={26} />
          <circle cx={100} cy={CY} r={12} />
        </g>
      )
    case 'washerHillside':
      return (
        <g {...line}>
          <ellipse cx={100} cy={CY} rx={56} ry={40} />
          <ellipse cx={104} cy={CY} rx={14} ry={10} />
          <path d="M176 44l22 14v36l-22 14z" />
        </g>
      )
    case 'washerClipped':
      return (
        <g {...line}>
          <path d="M60 26h58A52 52 0 0 1 118 122H60A52 52 0 0 1 60 26z" strokeWidth={0} />
          <path d="M52 40A52 52 0 1 0 52 100V40z" transform="translate(48 0)" />
          <circle cx={100} cy={CY} r={16} />
          <path d="M176 44h10v52h-10z" />
        </g>
      )

    /* other */
    case 'plate': return <Plate />
    case 'turnbuckle':
      return (
        <g>
          <path {...line} d="M80 50h80v40H80z" />
          <path {...line} d="M80 50c-8 6-8 34 0 40M160 50c8 6 8 34 0 40" />
          <path {...line} d="M60 64h20v12H60zM160 64h20v12h-20z" />
          <ThreadsH x1={60} x2={80} y1={64} y2={76} step={5} />
          <ThreadsH x1={160} x2={180} y1={64} y2={76} step={5} />
          <circle {...line} cx={36} cy={CY} r={20} />
          <circle {...line} cx={36} cy={CY} r={9} />
          <path {...line} d="M56 70h4M180 70h4" />
          <circle {...line} cx={204} cy={CY} r={20} />
          <circle {...line} cx={204} cy={CY} r={9} />
        </g>
      )
    case 'clevis':
      return (
        <g>
          {clevisAt(70, 1)}
          <path {...line} d="M70 62h-50v16h50" />
          <ThreadsH x1={24} x2={64} y1={62} y2={78} />
        </g>
      )
    case 'barrierPin':
      return (
        <g {...line}>
          <path d="M40 40h18v60H40z" />
          <path d="M58 56h140v28H58z" />
          <path d="M198 56l20 8v12l-20 8" />
          <circle cx={170} cy={70} r={5} />
        </g>
      )
    case 'sleeve':
      return (
        <g {...line}>
          <path d="M40 30h12v80H40z" />
          <path d="M52 44h150v52H52z" />
          <path d="M52 70h150" strokeDasharray="4 4" strokeWidth={1} />
          <ellipse cx={202} cy={70} rx={8} ry={26} />
        </g>
      )
    case 'shearPlate':
      return (
        <g {...line}>
          <circle cx={100} cy={CY} r={50} />
          <circle cx={100} cy={CY} r={20} />
          <circle cx={100} cy={CY} r={26} strokeWidth={1} />
          <path d="M168 50h14v40h-14z" />
        </g>
      )
    case 'tool':
      return (
        <g {...line}>
          <path d="M30 60h110v20H30z" />
          <path d="M140 52l50 6v24l-50 6z" />
          <path d="M190 58l16-6v36l-16-6z" />
          <path d="M44 60v20M58 60v20M72 60v20" strokeWidth={1.2} />
        </g>
      )
    case 'splitRing':
      return (
        <g {...line}>
          <circle cx={100} cy={CY} r={52} />
          <circle cx={100} cy={CY} r={40} />
          <path d="M96 18l8 0M96 30l8 0" strokeWidth={0} />
          <path d="M148 40l8-4M150 46l8-4" />
          <path d="M176 56h16v28h-16z" />
        </g>
      )
    case 'boatSpike':
      return (
        <g {...line}>
          <path d="M26 54h28v32H26z" />
          <path d="M54 62h140l24 6v4l-24 6H54z" />
          <path d="M70 62v16M90 62v16" strokeWidth={1} />
        </g>
      )
    case 'spikeGrid':
      return (
        <g {...line}>
          <path d="M30 70h180" />
          {Array.from({ length: 10 }, (_, i) => (
            <g key={i}>
              <path d={`M${40 + i * 18} 70l7-34l7 34`} />
              <path d={`M${40 + i * 18} 70l7 34l7-34`} />
            </g>
          ))}
        </g>
      )
    default:
      return null
  }
}
