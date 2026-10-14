import type { Project } from '../data/site'
import type { Location } from '../data/site'
import { Dim, DimDefs } from './Dim'

/** Hero: an anchor bolt cast into a footing, drawn as a blueprint with live-feeling dimension lines. */
export function HeroDrawing() {
  const bar = 'M260 26V372Q260 404 292 404H398'
  return (
    <svg className="hero-drawing" viewBox="0 0 560 470" role="img" aria-label="Technical drawing of an anchor bolt cast into a concrete footing, with projection and embedment dimensions">
      <DimDefs />
      <defs>
        <pattern id="conc" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <path d="M0 0v14" stroke="var(--blue-300)" strokeOpacity="0.28" strokeWidth="1.2" />
        </pattern>
      </defs>

      {/* footing */}
      <g fill="none" stroke="var(--blue-300)" strokeWidth="1.5">
        <rect x="70" y="210" width="420" height="232" fill="url(#conc)" />
        <path d="M70 210H490" strokeWidth="2.5" />
      </g>

      {/* bar: outline + inner fill */}
      <g fill="none" strokeLinejoin="round">
        <path className="draw" pathLength="1" d={bar} stroke="var(--blue-300)" strokeWidth="26" />
        <path d={bar} stroke="var(--ink-900)" strokeWidth="22" />
      </g>

      {/* threads along projection */}
      <g stroke="var(--blue-300)" strokeWidth="1.3">
        {Array.from({ length: 22 }, (_, i) => (
          <path key={i} d={`M249 ${44 + i * 6 + 5}l22 -5`} />
        ))}
      </g>

      {/* base plate, leveling nut, top nut + washer */}
      <g fill="var(--ink-900)" stroke="var(--blue-300)" strokeWidth="1.8" strokeLinejoin="round">
        <rect x="150" y="190" width="220" height="20" />
        <path d="M232 210v-0" />
        {/* leveling nut + washer under plate */}
        <path d="M232 214h56v22H232zM232 225h56" />
        {/* washer + top nut over plate */}
        <path d="M226 178h68v12h-68z" />
        <path d="M234 144h52v34h-52zM234 156h52M234 166h52" />
      </g>

      {/* hook leg lengthening mark */}
      <path d="M398 394v20" stroke="var(--blue-300)" strokeWidth="1.2" />

      {/* dimensions */}
      <Dim x1={116} y1={26} x2={116} y2={190} label="PROJECTION" offset={-10} ext={[[116, 26, 250, 26], [116, 190, 150, 190]]} />
      <Dim x1={116} y1={210} x2={116} y2={404} label="EMBEDMENT" offset={-10} ext={[[116, 404, 250, 404]]} />
      <Dim x1={292} y1={436} x2={398} y2={436} label="HOOK 4D" offset={-8} ext={[[292, 418, 292, 440], [398, 418, 398, 440]]} />
      <Dim x1={150} y1={118} x2={370} y2={118} label="PLATE" offset={-8} ext={[[150, 190, 150, 114], [370, 190, 370, 114]]} />

      {/* callouts */}
      <g fontFamily="var(--font-mono)" fontSize="11" fill="var(--blue-300)" letterSpacing="0.06em">
        <text x="306" y="64">F1554 GR 55</text>
        <text x="306" y="80">HOT-DIP GALV</text>
        <text x="304" y="162">HEAVY HEX NUT</text>
        <text x="380" y="204">BASE PLATE</text>
        <text x="300" y="232">LEVELING NUT</text>
      </g>

      {/* title block */}
      <g fill="none" stroke="var(--blue-300)" strokeWidth="1">
        <rect x="372" y="14" width="176" height="44" />
        <path d="M372 36H548" />
      </g>
      <g fontFamily="var(--font-mono)" fontSize="10" fill="var(--steel-300)" letterSpacing="0.08em">
        <text x="380" y="30">ANCHOR BOLT / 90°</text>
        <text x="380" y="50">SCALE NTS · REV C</text>
      </g>
    </svg>
  )
}

/** Small line-art for each featured project. */
export function ProjectArt({ kind }: { kind: Project['kind'] }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round' } as const
  return (
    <svg viewBox="0 0 200 110" className="project-art" aria-hidden="true" focusable="false">
      <g {...s}>
        {kind === 'bridge' && (
          <>
            <path d="M10 70h180M10 78h180" />
            <path d="M20 70C60 20 140 20 180 70" />
            <path d="M44 70V48M70 70V33M100 70V28M130 70V33M156 70V48" strokeWidth={1.4} />
            <path d="M30 78v22M170 78v22" />
          </>
        )}
        {kind === 'covered' && (
          <>
            <path d="M14 58L100 20l86 38" />
            <path d="M24 58v30h152V58" />
            <path d="M24 88v14M176 88v14M100 88v14" />
            <path d="M24 88h152M52 62v22M80 62v22M108 62v22M136 62v22M164 62v22" strokeWidth={1.2} />
          </>
        )}
        {kind === 'marine' && (
          <>
            <path d="M10 62h180" />
            <path d="M30 62v40M70 62v40M110 62v40M150 62v40" />
            <path d="M10 76q10-6 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0" strokeWidth={1.4} />
            <path d="M92 62V40h36v22M110 40V28" />
          </>
        )}
        {kind === 'stadium' && (
          <>
            <ellipse cx={100} cy={64} rx={84} ry={30} />
            <ellipse cx={100} cy={64} rx={52} ry={16} strokeWidth={1.4} />
            <path d="M16 64V40Q100-6 184 40v24" />
            <path d="M60 22v-0M100 14v20M140 22v14M60 28v14" strokeWidth={1.2} />
          </>
        )}
        {kind === 'power' && (
          <>
            <path d="M100 10L70 100M100 10l30 90" />
            <path d="M86 52h28M78 76h44" />
            <path d="M40 30h120M54 30l46-20l46 20" />
            <path d="M44 30v14M156 30v14" />
          </>
        )}
        {kind === 'industrial' && (
          <>
            <path d="M30 100V30h22v70" />
            <path d="M30 40h22M30 52h22" strokeWidth={1.2} />
            <path d="M70 100V60h60v40M70 60Q100 42 130 60" />
            <path d="M146 100V46h26v54" />
            <path d="M20 100h170" />
          </>
        )}
      </g>
    </svg>
  )
}

/** Coast-to-coast ruler: plants placed by longitude on a graduated scale. */
export function CoastRuler({ locations }: { locations: Location[] }) {
  const W = 1000
  const SPAN = 65 // degrees of longitude shown: 125°W → 60°W
  const x = (lon: number) => 40 + ((lon + 125) / SPAN) * (W - 80)
  const ticks = [-120, -110, -100, -90, -80, -70, -60]
  // Labels read left-to-right from each pin, so pins further east must be shorter than
  // the label to their west: heights step down west → east and nothing crosses.
  const height: Record<string, number> = {
    'ferrowright-northwest': 70,
    'ferrowright-southeast': 190,
    'ferrowright-charlotte': 150,
    'ferrowright-northeast': 110,
    'ferrowright-tensioning': 70,
  }
  return (
    <svg className="coast-ruler" viewBox="0 0 1000 300" role="img" aria-label="Plants placed along a west-to-east scale: Portland, Oregon; Charlotte and North Augusta in the Carolinas; Jordan, New York; Bellows Falls, Vermont">
      <g stroke="var(--steel-500)" strokeWidth="1.2" fill="none">
        <path d="M30 230H970" strokeWidth="2" />
        {Array.from({ length: SPAN + 1 }, (_, i) => {
          const lon = -125 + i
          const major = ticks.includes(lon)
          return <path key={i} d={`M${x(lon)} 230v${major ? 16 : 8}`} />
        })}
      </g>
      <g fontFamily="var(--font-mono)" fontSize="11" fill="var(--steel-400)" textAnchor="middle" letterSpacing="0.08em">
        {ticks.map((lon) => (
          <text key={lon} x={x(lon)} y="270">{Math.abs(lon)}°W</text>
        ))}
      </g>
      {locations.map((l) => {
        const px = x(l.lon)
        const h = height[l.slug] ?? 70
        const flag = 'start'
        const dx = 18
        return (
          <g key={l.slug}>
            <path d={`M${px} 230V${230 - h}`} stroke="var(--forge-500)" strokeWidth="1.5" />
            <polygon points={`${px},${230 - h - 14} ${px + 10},${230 - h - 8} ${px + 10},${230 - h + 4} ${px},${230 - h + 10} ${px - 10},${230 - h + 4} ${px - 10},${230 - h - 8}`} fill="var(--forge-500)" />
            <text x={px + dx} y={230 - h - 2} textAnchor={flag} fontFamily="var(--font-display)" fontWeight="800" fontSize="22" fill="var(--white)" letterSpacing="0.04em" style={{ textTransform: 'uppercase' }}>
              {l.city}, {l.state}
            </text>
            <text x={px + dx} y={230 - h + 14} textAnchor={flag} fontFamily="var(--font-mono)" fontSize="10.5" fill="var(--steel-400)" letterSpacing="0.1em" style={{ textTransform: 'uppercase' }}>
              {l.role}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
