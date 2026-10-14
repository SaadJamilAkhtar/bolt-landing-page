import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Glyph } from '../components/Glyph'
import { PageHero, QuoteBand, SectionHead } from '../components/Page'
import { boltWeightEach, nutWeightEach, pitchDiameter, threadsPerInch } from '../calculators/boltWeight'
import { FAQS, GLOSSARY } from '../data/site'
import { formatFraction, trimmed } from '../lib/fractions'

const trail = (label: string) => [{ label: 'Tools & Info', to: '/technical' }, { label }]
const frac = (d: number) => `${formatFraction(d, 16)}"`

/* ------------------------------------------------------------------ */
/* Hub                                                                 */
/* ------------------------------------------------------------------ */

const CALCS = [
  { to: '/technical/tools/bolt-weight-calculator', title: 'Bolt Weight Calculator', text: 'Bolts, nuts and washers, with a running order tally.', glyph: 'hexBolt' as const },
  { to: '/technical/tools/tie-rod-calculator', title: 'Tie Rod Calculator', text: 'Rod length from a pin-to-pin dimension.', glyph: 'tieRod' as const },
  { to: '/technical/tools/plate-weight-calculator', title: 'Plate Weight Calculator', text: 'Square and round plate, with or without a hole.', glyph: 'plate' as const },
]

const CHARTS = [
  { to: '/technical/bolt-torque-chart', title: 'Bolt torque chart', text: 'Installation torque estimates for structural bolts.' },
  { to: '/technical/thread-pitch-chart', title: 'Thread pitch chart', text: 'UNC, UNF and 8-UN threads with pitch and stress areas.' },
  { to: '/technical/strength-requirements-by-grade', title: 'Strength by grade', text: 'Tensile and yield minimums for common bolt specs.' },
  { to: '/technical/nut-compatibility-chart', title: 'Nut compatibility', text: 'Which nut goes with which bolt.' },
  { to: '/technical/structural-bolt-weight-chart', title: 'Structural bolt weights', text: 'Heavy hex bolt weights per 100 pieces.' },
  { to: '/technical/nut-weight-chart', title: 'Nut weight chart', text: 'Hex, heavy hex, jam and square nut weights.' },
  { to: '/technical/aashto-to-astm-conversions', title: 'AASHTO ↔ ASTM', text: 'Cross-reference of equivalent specifications.' },
  { to: '/technical/fastener-identification-markings', title: 'Head markings', text: 'Reading the grade stamped on a bolt head.' },
  { to: '/technical/specifications', title: 'Specifications', text: 'The ASTM, AASHTO and SAE standards we supply to.' },
  { to: '/technical/bolt-glossary', title: 'Glossary', text: 'Plain-English definitions of fastener terms.' },
]

export function TechnicalHub() {
  return (
    <>
      <PageHero
        title="Technical info & tools"
        eyebrow="Toolbox"
        trail={[{ label: 'Tools & Info' }]}
        lede="Calculators, charts, specifications and a database of construction fastener questions. Everything an engineer or detailer reaches for."
      />
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Calculators" title="Do the arithmetic once" />
          <div className="category-grid">
            {CALCS.map((c) => (
              <Link key={c.to} to={c.to} className="card card--reg category-card">
                <span className="mark category-card__no">Free calculator</span>
                <Glyph kind={c.glyph} className="category-card__glyph" />
                <h3>{c.title}</h3>
                <p className="mark category-card__range">{c.text}</p>
                <span className="arrow-link">Open</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--white">
        <div className="wrap">
          <SectionHead eyebrow="Reference" title="Charts & specifications" />
          <div className="chart-grid">
            {CHARTS.map((c) => (
              <Link key={c.to} to={c.to} className="chart-link">
                <strong>{c.title}</strong>
                <span>{c.text}</span>
              </Link>
            ))}
            <Link to="/technical/faqs" className="chart-link chart-link--faq">
              <strong>FAQs</strong>
              <span>{FAQS.length} answered questions on threads, galvanizing, anchor bolts and ordering.</span>
            </Link>
          </div>
        </div>
      </section>
      <QuoteBand title="Can’t find it here?" text="Ask an estimator. If the answer is useful to others it ends up in the FAQ." />
    </>
  )
}

export function ToolsIndex() {
  return <TechnicalHub />
}

/* ------------------------------------------------------------------ */
/* Charts                                                              */
/* ------------------------------------------------------------------ */

const DIAMETERS = [0.25, 0.3125, 0.375, 0.4375, 0.5, 0.5625, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.375, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4]
const UNF: Record<number, number> = { 0.25: 28, 0.3125: 24, 0.375: 24, 0.4375: 20, 0.5: 20, 0.5625: 18, 0.625: 18, 0.75: 16, 0.875: 14, 1: 12, 1.125: 12, 1.25: 12, 1.375: 12, 1.5: 12 }

function ChartShell({ title, lede, children, note }: { title: string; lede: string; children: React.ReactNode; note?: string }) {
  return (
    <>
      <PageHero title={title} eyebrow="Reference" trail={trail(title)} lede={lede} />
      <section className="section">
        <div className="wrap">
          {children}
          {note && <div className="note note--blue" style={{ marginTop: 28 }}><p>{note}</p></div>}
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

export function ThreadPitchChart() {
  const rows = DIAMETERS.map((d) => {
    const n = threadsPerInch(d)
    return {
      d,
      unc: n,
      unf: UNF[d],
      pitchDia: pitchDiameter(d),
      area: 0.7854 * (d - 0.9743 / n) ** 2,
      minor: d - 1.2269 / n,
    }
  })
  return (
    <ChartShell
      title="Thread pitch chart"
      lede="Coarse (UNC) and fine (UNF) threads per inch, with basic pitch diameter, minor diameter and tensile stress area for the coarse series."
      note="Above 1-1/2 inches the coarse column follows the 4-UN / 4-1/2-UN series that anchor rods commonly use; 8-UN is available on request. Values are computed from the standard thread formulas."
    >
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Diameter</th><th className="num">UNC (tpi)</th><th className="num">UNF (tpi)</th>
              <th className="num">Pitch (in.)</th><th className="num">Pitch dia. (in.)</th>
              <th className="num">Minor dia. (in.)</th><th className="num">Stress area (in²)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.d}>
                <th scope="row">{frac(r.d)}</th>
                <td className="num">{r.unc}</td>
                <td className="num">{r.unf ?? '—'}</td>
                <td className="num">{(1 / r.unc).toFixed(4)}</td>
                <td className="num">{r.pitchDia.toFixed(4)}</td>
                <td className="num">{r.minor.toFixed(4)}</td>
                <td className="num">{r.area.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartShell>
  )
}

const STRENGTH = [
  { spec: 'ASTM A307 Gr A', size: 'all', tensile: '60 min', yield: '—', use: 'General purpose, low-carbon steel' },
  { spec: 'ASTM A307 Gr B', size: 'all', tensile: '60 – 100', yield: '—', use: 'Flanged piping, lower strength' },
  { spec: 'ASTM A36 rod', size: 'all', tensile: '58 – 80', yield: '36 min', use: 'Tie rods, plain structural rod' },
  { spec: 'ASTM F1554 Gr 36', size: '1/4 – 4', tensile: '58 – 80', yield: '36', use: 'Anchor bolts' },
  { spec: 'ASTM F1554 Gr 55', size: '1/4 – 4', tensile: '75 – 95', yield: '55', use: 'Anchor bolts' },
  { spec: 'ASTM F1554 Gr 105', size: '1/4 – 3', tensile: '125 – 150', yield: '105', use: 'High-strength anchor bolts' },
  { spec: 'ASTM A325 (F3125)', size: '1/2 – 1', tensile: '120 min', yield: '92', use: 'Structural bolts' },
  { spec: 'ASTM A325 (F3125)', size: '1-1/8 – 1-1/2', tensile: '105 min', yield: '81', use: 'Structural bolts' },
  { spec: 'ASTM A490 (F3125)', size: '1/2 – 1-1/2', tensile: '150 – 173', yield: '130', use: 'High-strength structural bolts' },
  { spec: 'ASTM A449', size: '1/4 – 1', tensile: '120 min', yield: '92', use: 'General high-strength' },
  { spec: 'ASTM A449', size: '1-1/8 – 1-1/2', tensile: '105 min', yield: '81', use: 'General high-strength' },
  { spec: 'ASTM A449', size: '1-3/4 – 3', tensile: '90 min', yield: '58', use: 'General high-strength' },
  { spec: 'ASTM A193 B7', size: 'to 2-1/2', tensile: '125 min', yield: '105', use: 'High-temperature, pressure service' },
  { spec: 'ASTM A354 Gr BD', size: 'to 2-1/2', tensile: '150 min', yield: '130', use: 'Quenched and tempered alloy' },
  { spec: 'SAE J429 Gr 5', size: '1/4 – 1', tensile: '120 min', yield: '92', use: 'Automotive and machinery' },
  { spec: 'SAE J429 Gr 8', size: '1/4 – 1-1/2', tensile: '150 min', yield: '130', use: 'High-strength machinery' },
]

export function StrengthChart() {
  return (
    <ChartShell
      title="Strength requirements by grade"
      lede="Minimum tensile and yield strength, in ksi, for the bolt and rod specifications we work to most often."
      note="Typical published minimums. Always confirm against the current edition of the governing ASTM, SAE or AASHTO standard."
    >
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr><th>Specification</th><th>Size (in.)</th><th className="num">Tensile (ksi)</th><th className="num">Yield (ksi)</th><th>Typical use</th></tr>
          </thead>
          <tbody>
            {STRENGTH.map((r, i) => (
              <tr key={i}>
                <th scope="row">{r.spec}</th>
                <td>{r.size}</td>
                <td className="num">{r.tensile}</td>
                <td className="num">{r.yield}</td>
                <td>{r.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartShell>
  )
}

const NUT_PAIRS = [
  { bolt: 'ASTM A307 Gr A / B', nut: 'ASTM A563 Gr A', style: 'Hex', note: 'Heavy hex optional' },
  { bolt: 'ASTM F1554 Gr 36', nut: 'ASTM A563 Gr A', style: 'Heavy hex', note: 'Hex acceptable per project spec' },
  { bolt: 'ASTM F1554 Gr 55', nut: 'ASTM A563 Gr A (heavy hex)', style: 'Heavy hex', note: 'Gr B or C where specified' },
  { bolt: 'ASTM F1554 Gr 105', nut: 'ASTM A563 Gr DH', style: 'Heavy hex', note: 'Required for full strength' },
  { bolt: 'ASTM A325 (F3125)', nut: 'ASTM A563 Gr C, C3, DH or DH3', style: 'Heavy hex', note: 'Galvanized bolts take galvanized, overtapped nuts' },
  { bolt: 'ASTM A490 (F3125)', nut: 'ASTM A563 Gr DH or DH3', style: 'Heavy hex', note: 'Not for hot-dip galvanizing' },
  { bolt: 'ASTM A449', nut: 'ASTM A563 Gr C or DH', style: 'Heavy hex', note: 'DH for larger sizes' },
  { bolt: 'ASTM A193 B7', nut: 'ASTM A194 Gr 2H', style: 'Heavy hex', note: 'Pressure and high-temperature service' },
  { bolt: 'ASTM A354 Gr BD', nut: 'ASTM A563 Gr DH', style: 'Heavy hex', note: '' },
  { bolt: 'SAE J429 Gr 5', nut: 'SAE J995 Gr 5 / ASTM A563 Gr C', style: 'Hex', note: '' },
  { bolt: 'SAE J429 Gr 8', nut: 'SAE J995 Gr 8 / ASTM A563 Gr DH', style: 'Hex', note: '' },
]

export function NutCompatibility() {
  return (
    <ChartShell
      title="Nut compatibility chart"
      lede="Pair the nut to the bolt. A nut must be strong enough to carry the bolt to its full strength without stripping."
      note="Typical pairings. A project specification may require a different grade or style, and it governs."
    >
      <div className="table-scroll">
        <table className="table">
          <thead><tr><th>Bolt specification</th><th>Matching nut</th><th>Style</th><th>Notes</th></tr></thead>
          <tbody>
            {NUT_PAIRS.map((r) => (
              <tr key={r.bolt}><th scope="row">{r.bolt}</th><td>{r.nut}</td><td>{r.style}</td><td>{r.note}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartShell>
  )
}

/** AISC minimum bolt pretension, kips (Table J3.1). */
const PRETENSION: { d: number; a325: number; a490: number }[] = [
  { d: 0.5, a325: 12, a490: 15 }, { d: 0.625, a325: 19, a490: 24 }, { d: 0.75, a325: 28, a490: 35 },
  { d: 0.875, a325: 39, a490: 49 }, { d: 1, a325: 51, a490: 64 }, { d: 1.125, a325: 56, a490: 80 },
  { d: 1.25, a325: 71, a490: 102 }, { d: 1.375, a325: 85, a490: 121 }, { d: 1.5, a325: 103, a490: 148 },
]

export function TorqueChart() {
  const [k, setK] = useState(0.2)
  const torque = (d: number, kips: number) => Math.round((k * d * kips * 1000) / 12)
  return (
    <ChartShell
      title="Bolt torque chart"
      lede="Estimated installation torque to reach the minimum pretension on A325 and A490 structural bolts, from T = K × D × P."
      note="Torque is a poor proxy for tension: the nut factor K varies with lubrication, coating and thread condition. Structural joints should be tightened by turn-of-nut, calibrated wrench, twist-off bolts or DTI washers as the specification requires."
    >
      <div className="torque-controls">
        <div className="field">
          <span className="label">Nut factor K</span>
          <div className="segmented" role="radiogroup" aria-label="Nut factor">
            {[
              { v: 0.15, l: '0.15 lubricated' },
              { v: 0.2, l: '0.20 plain' },
              { v: 0.25, l: '0.25 galvanized, dry' },
            ].map((o) => (
              <label key={o.v}>
                <input type="radio" name="k" checked={k === o.v} onChange={() => setK(o.v)} />
                <span>{o.l}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr><th>Diameter</th><th className="num">A325 pretension (kips)</th><th className="num">A325 torque (ft·lb)</th><th className="num">A490 pretension (kips)</th><th className="num">A490 torque (ft·lb)</th></tr>
          </thead>
          <tbody>
            {PRETENSION.map((r) => (
              <tr key={r.d}>
                <th scope="row">{frac(r.d)}</th>
                <td className="num">{r.a325}</td>
                <td className="num">{torque(r.d, r.a325).toLocaleString()}</td>
                <td className="num">{r.a490}</td>
                <td className="num">{torque(r.d, r.a490).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartShell>
  )
}

const LENGTHS = [2, 3, 4, 5, 6, 7, 8]
const STRUCT_DIA = [0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.375, 1.5]

export function StructuralBoltWeights() {
  const rows = useMemo(
    () =>
      STRUCT_DIA.map((d) => ({
        d,
        w: LENGTHS.map((l) => {
          const thread = Math.min(l, l > 6 ? 2 * d + 0.5 : 2 * d + 0.25)
          return boltWeightEach({ kind: 'heavyHex', diameter: d, length1: l, thread1: thread, threadType: 'cut' }) * 100
        }),
      })),
    [],
  )
  return (
    <ChartShell
      title="Structural bolt weight chart"
      lede="Estimated weight in pounds per 100 heavy hex structural bolts, by diameter and length under the head."
      note="Generated from the same model as the bolt weight calculator, using the standard thread length (2D + 1/4″ up to 6″ long, 2D + 1/2″ beyond). Estimates only."
    >
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr><th>Diameter</th>{LENGTHS.map((l) => <th key={l} className="num">{l}″</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.d}>
                <th scope="row">{frac(r.d)}</th>
                {r.w.map((w, i) => <td key={i} className="num">{trimmed(w, 1)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartShell>
  )
}

export function NutWeights() {
  const dias = [0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.375, 1.5]
  return (
    <ChartShell
      title="Nut weight chart"
      lede="Estimated weight in pounds per 100 nuts. Hex, heavy hex, hex jam and square, black finish."
      note="Generated from the same model as the bolt weight calculator. Galvanized nuts weigh slightly more. Estimates only."
    >
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr><th>Diameter</th><th className="num">Hex</th><th className="num">Heavy hex</th><th className="num">Hex jam</th><th className="num">Heavy jam</th><th className="num">Square</th></tr>
          </thead>
          <tbody>
            {dias.map((d) => (
              <tr key={d}>
                <th scope="row">{frac(d)}</th>
                {(['hex', 'heavyHex', 'hexJam', 'heavyJam', 'square'] as const).map((k) => (
                  <td key={k} className="num">{trimmed(nutWeightEach(k, d) * 100, 1)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartShell>
  )
}

const CONVERSIONS = [
  { aashto: 'M164', astm: 'A325 (now F3125 Gr A325)', what: 'High-strength structural bolts' },
  { aashto: 'M253', astm: 'A490 (now F3125 Gr A490)', what: 'Alloy-steel structural bolts' },
  { aashto: 'M314', astm: 'F1554', what: 'Anchor bolts, steel' },
  { aashto: 'M291', astm: 'A563', what: 'Carbon and alloy steel nuts' },
  { aashto: 'M292', astm: 'A194', what: 'Nuts for high-pressure or high-temperature service' },
  { aashto: 'M293', astm: 'F436', what: 'Hardened steel washers' },
  { aashto: 'M232', astm: 'A153', what: 'Zinc coating on iron and steel hardware' },
  { aashto: 'M111', astm: 'A123', what: 'Zinc coating on fabricated steel products' },
  { aashto: 'M183', astm: 'A36', what: 'Structural carbon steel' },
  { aashto: 'M270', astm: 'A709', what: 'Structural steel for bridges' },
]

export function AashtoAstm() {
  return (
    <ChartShell title="AASHTO to ASTM conversions" lede="Highway specifications cite AASHTO numbers; suppliers and test reports use ASTM. Here is the cross-reference." note="Equivalent in scope, not always identical in every clause. Confirm the edition cited by the project.">
      <div className="table-scroll">
        <table className="table">
          <thead><tr><th>AASHTO</th><th>ASTM</th><th>Covers</th></tr></thead>
          <tbody>
            {CONVERSIONS.map((c) => <tr key={c.aashto}><th scope="row">{c.aashto}</th><td>{c.astm}</td><td>{c.what}</td></tr>)}
          </tbody>
        </table>
      </div>
    </ChartShell>
  )
}

function HeadMark({ lines, label, text }: { lines: number; label: string; text?: string }) {
  const cx = 60
  const cy = 60
  return (
    <figure className="head-mark">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <polygon points="60,6 106,33 106,87 60,114 14,87 14,33" fill="var(--white)" stroke="var(--ink-900)" strokeWidth="2.5" />
        <circle cx={cx} cy={cy} r={38} fill="none" stroke="var(--steel-300)" strokeWidth="1.2" />
        {lines > 0 &&
          Array.from({ length: lines }, (_, i) => {
            const a = ((Math.PI * 2) / lines) * i - Math.PI / 2
            return <path key={i} d={`M${cx + 14 * Math.cos(a)} ${cy + 14 * Math.sin(a)}L${cx + 36 * Math.cos(a)} ${cy + 36 * Math.sin(a)}`} stroke="var(--ink-900)" strokeWidth="3" strokeLinecap="round" />
          })}
        {text && <text x={cx} y={cy + 6} textAnchor="middle" fontFamily="var(--font-display)" fontWeight="900" fontSize="20" fill="var(--ink-900)">{text}</text>}
      </svg>
      <figcaption><strong>{label}</strong></figcaption>
    </figure>
  )
}

export function Markings() {
  return (
    <ChartShell
      title="Fastener identification markings"
      lede="The mark on a bolt head tells you the specification it was made to. Learn to read it before it goes in the joint."
      note="Head markings must also include the manufacturer’s identification. Nuts carry their own grade marks, and anchor rods are usually identified by color code or end stamp."
    >
      <div className="head-mark-grid">
        <HeadMark lines={0} label="SAE Grade 2 / A307: no radial lines" />
        <HeadMark lines={3} label="SAE Grade 5: three radial lines" />
        <HeadMark lines={6} label="SAE Grade 8: six radial lines" />
        <HeadMark lines={0} text="A325" label="ASTM A325 (F3125): stamped A325" />
        <HeadMark lines={0} text="A490" label="ASTM A490 (F3125): stamped A490" />
        <HeadMark lines={0} text="B7" label="ASTM A193 B7: grade stamped on the head or end" />
      </div>
    </ChartShell>
  )
}

export function Specifications() {
  const groups = [
    { id: 'astm', name: 'ASTM', items: ['A36 structural steel', 'A153 / F2329 hot-dip zinc coating on hardware', 'A193 B7 alloy-steel studs and bolts', 'A194 nuts for high-pressure service', 'A307 carbon-steel bolts', 'A354 quenched and tempered alloy bolts', 'A449 heat-treated steel bolts', 'A563 carbon and alloy nuts', 'A615 deformed reinforcing bar', 'F436 hardened washers', 'F844 flat washers', 'F959 direct tension indicators', 'F1554 anchor bolts', 'F1852 / F2280 twist-off bolts', 'F3125 structural bolts (A325, A490)'] },
    { id: 'aashto', name: 'AASHTO', items: ['M164 high-strength bolts', 'M253 alloy-steel bolts', 'M314 anchor bolts', 'M291 nuts', 'M232 zinc coating, hardware', 'M293 hardened washers', 'M180 guardrail'] },
    { id: 'sae', name: 'SAE', items: ['J429 mechanical and material requirements for bolts and screws', 'J995 mechanical and material requirements for nuts'] },
    { id: 'csa', name: 'CSA', items: ['G40.21 structural steel', 'S16 design of steel structures'] },
  ]
  return (
    <ChartShell title="Specifications" lede="The standards behind the fasteners. If a project cites one that isn’t here, ask. Odds are good it can be met.">
      <div className="spec-groups">
        {groups.map((g) => (
          <div key={g.id} id={g.id} className="card">
            <h3>{g.name}</h3>
            <ul className="dot-list">
              {g.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </ChartShell>
  )
}

export function Glossary() {
  const [q, setQ] = useState('')
  const rows = GLOSSARY.filter((g) => `${g.term} ${g.def}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <ChartShell title="Bolt glossary" lede="Plain-English definitions for the terms that turn up on fastener drawings and purchase orders.">
      <div className="field" style={{ maxWidth: 420, marginBottom: 32 }}>
        <label htmlFor="gl-q">Search terms</label>
        <input id="gl-q" className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="pitch, grip, galvanizing…" />
      </div>
      <dl className="glossary">
        {rows.map((g) => (
          <div key={g.term}>
            <dt>{g.term}</dt>
            <dd>{g.def}</dd>
          </div>
        ))}
      </dl>
      {rows.length === 0 && <p>No terms match “{q}”.</p>}
    </ChartShell>
  )
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export function FaqPage() {
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('All')
  const tags = ['All', ...Array.from(new Set(FAQS.map((f) => f.tag)))]
  const rows = FAQS.filter((f) => (tag === 'All' || f.tag === tag) && `${f.q} ${f.a}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHero title="Frequently asked questions" eyebrow="Tools & info" trail={trail('FAQs')} lede="Straight answers on threads, galvanizing, anchor bolts, nuts and ordering." />
      <section className="section">
        <div className="wrap faq-layout">
          <div className="faq-filters">
            <div className="field">
              <label htmlFor="faq-q">Search</label>
              <input id="faq-q" className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="galvanized, A325, thread…" />
            </div>
            <div className="chip-row" role="group" aria-label="Topic">
              {tags.map((t) => (
                <button key={t} type="button" className={`chip ${tag === t ? 'is-on' : ''}`} aria-pressed={tag === t} onClick={() => setTag(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="faq-list">
            {rows.map((f) => (
              <details key={f.q} className="faq">
                <summary>
                  <span>{f.q}</span>
                  <span className="tag">{f.tag}</span>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
            {rows.length === 0 && <p>No questions match. <Link to="/about/contact">Ask us directly</Link>.</p>}
          </div>
        </div>
      </section>
      <QuoteBand title="Still have a question?" text="Call or send a note. Estimators answer technical questions every day." />
    </>
  )
}

/** Routes for charts that don't have a dedicated component yet fall back to the hub. */
export function ChartRouter() {
  const { chart } = useParams()
  const map: Record<string, () => React.JSX.Element> = {
    'bolt-torque-chart': TorqueChart,
    'thread-pitch-chart': ThreadPitchChart,
    'strength-requirements-by-grade': StrengthChart,
    'nut-compatibility-chart': NutCompatibility,
    'structural-bolt-weight-chart': StructuralBoltWeights,
    'nut-weight-chart': NutWeights,
    'aashto-to-astm-conversions': AashtoAstm,
    'fastener-identification-markings': Markings,
    specifications: Specifications,
    'bolt-glossary': Glossary,
  }
  const Page = map[chart ?? '']
  return Page ? <Page /> : <TechnicalHub />
}
