import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Dim, DimDefs } from '../../components/Dim'
import { PageHero, QuoteBand } from '../../components/Page'
import { LB_TO_KG, plateWeight, type PlateShape } from '../../calculators/plateWeight'
import { parseDimension, roundTo } from '../../lib/fractions'

type FieldKey = 'thickness' | 'width' | 'length' | 'od' | 'hole' | 'qty'

function PlateDrawing({ shape, v, holeRatio }: { shape: PlateShape; v: Record<FieldKey, string>; holeRatio: number }) {
  const lab = (s: string, fallback: string) => (s.trim() ? `${s.trim()}"` : fallback)
  const r = Math.min(Math.max(holeRatio, 0.06), 0.8)
  return (
    <svg className="tool-drawing" viewBox="0 0 440 270" role="img" aria-label="Plate drawing with dimensions">
      <DimDefs />
      {shape === 'square' ? (
        <g fill="var(--ink-800)" stroke="var(--blue-300)" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M80 168h220v36H80z" />
          <path d="M300 168l64-48v36l-64 48z" />
          <path d="M80 168l64-48h220l-64 48z" fill="var(--ink-700)" />
          <ellipse cx={222} cy={144} rx={52 * r * 1.4} ry={14 * r * 1.4} fill="var(--ink-950)" />
          <Dim x1={80} y1={228} x2={300} y2={228} label={lab(v.length, 'L')} offset={18} ext={[[80, 204, 80, 232], [300, 204, 300, 232]]} />
          <Dim x1={310} y1={226} x2={374} y2={178} label={lab(v.width, 'W')} offset={0} ext={[[300, 204, 314, 230], [364, 156, 378, 182]]} />
          <Dim x1={52} y1={168} x2={52} y2={204} label={lab(v.thickness, 'T')} offset={-8} ext={[[80, 168, 48, 168], [80, 204, 48, 204]]} />
        </g>
      ) : (
        <g fill="var(--ink-800)" stroke="var(--blue-300)" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M104 150v36a116 38 0 0 0 232 0v-36z" />
          <ellipse cx={220} cy={150} rx={116} ry={38} fill="var(--ink-700)" />
          <ellipse cx={220} cy={150} rx={116 * r} ry={38 * r} fill="var(--ink-950)" />
          <Dim x1={104} y1={110} x2={336} y2={110} label={lab(v.od, 'OD')} offset={-8} ext={[[104, 150, 104, 106], [336, 150, 336, 106]]} />
          <Dim x1={70} y1={150} x2={70} y2={186} label={lab(v.thickness, 'T')} offset={-8} ext={[[104, 150, 66, 150], [104, 186, 66, 186]]} />
          {v.hole.trim() && (
            <Dim x1={220 - 116 * r} y1={150} x2={220 + 116 * r} y2={150} label={`⌀${v.hole.trim()}"`} offset={4} active />
          )}
        </g>
      )}
    </svg>
  )
}

export default function PlateWeight() {
  const [shape, setShape] = useState<PlateShape>('square')
  const [v, setV] = useState<Record<FieldKey, string>>({ thickness: '', width: '', length: '', od: '', hole: '', qty: '1' })
  const [kg, setKg] = useState(false)

  const set = (k: FieldKey) => (e: React.ChangeEvent<HTMLInputElement>) => setV((s) => ({ ...s, [k]: e.target.value }))

  const parsed = useMemo(() => {
    const p = (s: string) => (s.trim() ? parseDimension(s) : undefined)
    return {
      thickness: p(v.thickness),
      width: p(v.width),
      length: p(v.length),
      od: p(v.od),
      hole: p(v.hole),
      qty: p(v.qty),
    }
  }, [v])

  const bad = (k: FieldKey) => v[k].trim() !== '' && parsed[k] === null

  const needed: FieldKey[] = shape === 'square' ? ['thickness', 'width', 'length'] : ['thickness', 'od']
  const incomplete = needed.some((k) => !v[k].trim()) || !v.qty.trim()
  const invalid = (['thickness', 'width', 'length', 'od', 'hole', 'qty'] as FieldKey[]).some(bad)

  const result = useMemo(() => {
    if (incomplete || invalid) return null
    return plateWeight({
      shape,
      thickness: parsed.thickness ?? 0,
      width: parsed.width ?? undefined,
      length: parsed.length ?? undefined,
      outsideDiameter: parsed.od ?? undefined,
      holeDiameter: parsed.hole ?? 0,
      quantity: parsed.qty ?? 0,
    })
  }, [shape, parsed, incomplete, invalid])

  const holeRatio =
    parsed.hole && parsed.hole > 0
      ? parsed.hole / (shape === 'round' ? parsed.od || parsed.hole * 3 : Math.min(parsed.width || parsed.hole * 3, parsed.length || parsed.hole * 3))
      : 0

  const show = (n: number, dp: number) => (kg ? roundTo(n * LB_TO_KG, dp) : n)
  const unit = kg ? 'kg' : 'lbs'

  // A render function (not a component) so inputs keep focus between keystrokes.
  const input = (k: FieldKey, label: string, hint?: string) => (
    <div className="field" key={k}>
      <label htmlFor={`pw-${k}`}>{label}</label>
      <div className="input-wrap">
        <input
          id={`pw-${k}`}
          className={`input ${k === 'qty' ? '' : 'has-suffix'}`}
          inputMode="decimal"
          autoComplete="off"
          value={v[k]}
          onChange={set(k)}
          aria-invalid={bad(k) || undefined}
          aria-describedby={bad(k) ? `pw-${k}-err` : undefined}
          placeholder={hint}
        />
        {k !== 'qty' && <span className="input-suffix">in.</span>}
      </div>
      {bad(k) && <span id={`pw-${k}-err`} className="field-error">Use a number or fraction, like 3/4 or 1-1/2.</span>}
    </div>
  )

  return (
    <>
      <PageHero
        title="Plate Weight Calculator"
        eyebrow="Tools & info"
        trail={[{ label: 'Tools & Info', to: '/technical' }, { label: 'Calculators', to: '/technical/tools' }, { label: 'Plate Weight' }]}
        lede="Estimate the weight of carbon steel plate. Round or square, with or without a hole. Fractions and decimals both work."
      />
      <section className="section tool-section">
        <div className="wrap tool-layout">
          <div className="tool-main">
            <div className="tool-panel card">
              <div className="tool-panel__head">
                <h2>Plate</h2>
                <div className="segmented" role="radiogroup" aria-label="Plate type">
                  {(['square', 'round'] as PlateShape[]).map((s) => (
                    <label key={s}>
                      <input type="radio" name="shape" checked={shape === s} onChange={() => setShape(s)} />
                      <span>{s === 'square' ? 'Square' : 'Round'}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field-grid">
                {input('thickness', 'Thickness', '1-1/2')}
                {shape === 'square' ? (
                  <>
                    {input('width', 'Width', '10')}
                    {input('length', 'Length', '10')}
                  </>
                ) : (
                  input('od', 'Outside diameter', '10')
                )}
                {input('hole', 'Hole diameter (optional)', '2')}
                {input('qty', 'Quantity')}
              </div>

              <div className="readout" aria-live="polite">
                <div className="readout__cell">
                  <span className="mark">Weight each</span>
                  <output className="readout__value">{result?.ok ? show(result.each, 2).toFixed(2) : '—'}</output>
                  <span className="mark readout__unit">{unit}</span>
                </div>
                <div className="readout__cell readout__cell--main">
                  <span className="mark">Total weight</span>
                  <output className="readout__value">{result?.ok ? show(result.total, 1).toFixed(1) : '—'}</output>
                  <span className="mark readout__unit">{unit}</span>
                </div>
              </div>

              {result && !result.ok && <p className="field-error" role="alert">{result.error}</p>}
              {!result && !invalid && <p className="field-hint">Fill in the dimensions to see the weight.</p>}

              <div className="btn-row tool-actions">
                <div className="segmented" role="radiogroup" aria-label="Units">
                  <label><input type="radio" name="unit" checked={!kg} onChange={() => setKg(false)} /><span>lb</span></label>
                  <label><input type="radio" name="unit" checked={kg} onChange={() => setKg(true)} /><span>kg</span></label>
                </div>
                <Link className="btn btn--sm" to="/quick-quote?item=Plate">Get a quick quote</Link>
              </div>
            </div>

            <figure className="tool-figure on-dark grid-bg">
              <PlateDrawing shape={shape} v={v} holeRatio={holeRatio} />
              <figcaption className="mark">Live drawing · dimensions follow your inputs</figcaption>
            </figure>
          </div>

          <aside className="tool-aside">
            <div className="card">
              <h3>How it works</h3>
              <p>Weight is volume times the density of carbon steel, 0.2833 lb/in³. A hole is subtracted as a cylinder through the full thickness.</p>
              <p className="mark" style={{ color: 'var(--steel-500)' }}>
                {shape === 'square' ? '(W × L − π·(hole/2)²) × T' : '(π·(OD/2)² − π·(hole/2)²) × T'}
              </p>
              <p>Each-weight rounds to two decimals and the total to one, so each × quantity can differ slightly from the total shown.</p>
            </div>
            <div className="card">
              <h3>Other tools</h3>
              <ul className="link-list">
                <li><Link to="/technical/tools/bolt-weight-calculator">Bolt weight calculator</Link></li>
                <li><Link to="/technical/tools/tie-rod-calculator">Tie rod calculator</Link></li>
                <li><Link to="/technical/nut-weight-chart">Nut weight chart</Link></li>
                <li><Link to="/products/others/plates">Fabricated plates</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <QuoteBand title="Plate washers and base plates, cut to print" />
    </>
  )
}
