import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Dim, DimDefs } from '../../components/Dim'
import { PageHero, QuoteBand } from '../../components/Page'
import {
  CLEVIS_DIMENSION,
  CLEVIS_OPTIONS,
  CONFIG_LABELS,
  ROD_DIAMETERS,
  TURNBUCKLE_LENGTHS,
  clevisDeduction,
  decodeFormState,
  encodeFormState,
  engagement,
  formatRod,
  formatRodFraction,
  tieRod,
  type RodDiameter,
  type TieRodConfig,
  type TieRodFormState,
} from '../../calculators/tieRod'
import { parseDimension, trimmed } from '../../lib/fractions'

const CONFIGS: { id: TieRodConfig; title: string; sub: string }[] = [
  { id: 'single', title: 'Single rod', sub: 'Clevis · rod · clevis' },
  { id: 'equal', title: 'Equal rods', sub: 'Two matching rods and a turnbuckle' },
  { id: 'different', title: 'Different rods', sub: 'One rod fixed, solve the other' },
]

/** Tiny schematic used on the configuration picker. */
function ConfigIcon({ id }: { id: TieRodConfig }) {
  return (
    <svg viewBox="0 0 160 40" className="config-icon" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <circle cx="12" cy="20" r="7" />
        <circle cx="148" cy="20" r="7" />
        {id === 'single' && <path d="M19 20h122" />}
        {id !== 'single' && (
          <>
            <path d="M19 20h46M95 20h46" />
            <rect x="65" y="13" width="30" height="14" />
            <path d="M72 13v14M88 13v14" strokeWidth="1" />
          </>
        )}
        {id === 'different' && <path d="M19 20h30" strokeWidth="4" opacity="0.35" />}
      </g>
    </svg>
  )
}

function Diagram({
  config,
  pin,
  rods,
  clevis,
  turnbuckle,
}: {
  config: TieRodConfig
  pin: string
  rods: string[]
  clevis: string
  turnbuckle: number
}) {
  const L = 80
  const R = 560
  const rodTop = 96
  const rodH = 14
  const midL = 270
  const midR = 370
  const single = config === 'single'
  const rodEnds: [number, number][] = single ? [[L + 38, R - 38]] : [[L + 38, midL], [midR, R - 38]]

  return (
    <svg className="tool-drawing" viewBox="0 0 640 210" role="img" aria-label="Tie rod assembly diagram">
      <DimDefs />
      <g fill="var(--ink-900)" stroke="var(--blue-300)" strokeWidth="1.8" strokeLinejoin="round">
        {/* clevis ends */}
        {[L, R].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={rodTop + rodH / 2} r={20} />
            <circle cx={x} cy={rodTop + rodH / 2} r={8} fill="var(--ink-950)" />
            <path d={i === 0 ? `M${x + 18} ${rodTop - 6}h22v${rodH + 12}h-22z` : `M${x - 40} ${rodTop - 6}h22v${rodH + 12}h-22z`} />
          </g>
        ))}
        {/* rods */}
        {rodEnds.map(([a, b], i) => (
          <g key={i}>
            <rect x={a} y={rodTop} width={b - a} height={rodH} />
            <g strokeWidth="1.2">
              {Array.from({ length: 6 }, (_, k) => (
                <path key={k} d={`M${(i === 0 ? a : b - 36) + k * 6} ${rodTop + rodH}l4 ${-rodH}`} />
              ))}
            </g>
          </g>
        ))}
        {!single && (
          <g>
            <rect x={midL - 14} y={rodTop - 8} width={midR - midL + 28} height={rodH + 16} />
            <path d={`M${(midL + midR) / 2} ${rodTop - 8}v${rodH + 16}`} strokeWidth="1" />
          </g>
        )}
      </g>

      <g fontFamily="var(--font-mono)" fontSize="10.5" fill="var(--blue-300)" letterSpacing="0.06em" textAnchor="middle">
        <text x={L} y={rodTop - 32}>#{clevis}</text>
        <text x={R} y={rodTop - 32}>#{clevis}</text>
        <text x={L + 54} y={rodTop - 10}>RH</text>
        {single ? <text x={R - 54} y={rodTop - 10}>LH</text> : <text x={R - 54} y={rodTop - 10}>RH</text>}
        {!single && <text x={midL - 26} y={rodTop - 10}>RH</text>}
        {!single && <text x={midR + 26} y={rodTop - 10}>LH</text>}
      </g>

      <Dim x1={L} y1={44} x2={R} y2={44} label={pin ? `${pin}" PIN TO PIN` : 'PIN TO PIN'} offset={-8} ext={[[L, 70, L, 40], [R, 70, R, 40]]} />
      {single ? (
        <Dim x1={L + 38} y1={162} x2={R - 38} y2={162} label={rods[0] ?? 'ROD'} offset={22} ext={[[L + 38, 116, L + 38, 166], [R - 38, 116, R - 38, 166]]} />
      ) : (
        <>
          <Dim x1={L + 38} y1={162} x2={midL} y2={162} label={rods[0] ?? 'ROD A'} offset={22} ext={[[L + 38, 116, L + 38, 166], [midL, 116, midL, 166]]} />
          <Dim x1={midR} y1={162} x2={R - 38} y2={162} label={rods[1] ?? 'ROD B'} offset={22} ext={[[midR, 116, midR, 166], [R - 38, 116, R - 38, 166]]} />
          <text x={(midL + midR) / 2} y={134} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--blue-300)">{turnbuckle}" TURNBUCKLE</text>
        </>
      )}
    </svg>
  )
}

export default function TieRodCalculator() {
  const [s, setS] = useState<TieRodFormState>(() => decodeFormState(window.location.hash))
  const [copied, setCopied] = useState(false)

  // keep the URL hash in step with the form so links are shareable (same format as the original tool)
  useEffect(() => {
    const hash = encodeFormState(s)
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${hash}`)
  }, [s])

  const patch = (p: Partial<TieRodFormState>) => setS((cur) => ({ ...cur, ...p }))

  const onDiameter = (d: RodDiameter) => {
    const opts = CLEVIS_OPTIONS[d]
    patch({ d, cNum: opts.includes(s.cNum) ? s.cNum : opts[0] })
  }

  const p2p = s.p2p.trim() ? parseDimension(s.p2p) : undefined
  const fixed = s.fixed.trim() ? parseDimension(s.fixed) : undefined
  const p2pBad = p2p === null
  const fixedBad = fixed === null

  const result = useMemo(() => {
    if (!p2p || (s.config === 'different' && !fixed)) return null
    return tieRod({
      config: s.config,
      pinToPin: p2p,
      fixedRod: fixed ?? undefined,
      diameter: s.d,
      clevis: s.cNum,
      turnbuckle: s.config === 'single' ? undefined : s.t,
    })
  }, [s, p2p, fixed])

  const rodsText = result?.ok ? result.rods.map(formatRod) : []

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable: the URL bar already holds the link */
    }
  }

  const d = parseDimension(s.d) ?? 0
  const dim = CLEVIS_DIMENSION[s.cNum]

  return (
    <>
      <PageHero
        title="Tie Rod Calculator"
        eyebrow="Tools & info"
        trail={[{ label: 'Tools & Info', to: '/technical' }, { label: 'Calculators', to: '/technical/tools' }, { label: 'Tie Rod' }]}
        lede="Drawings usually give the length between clevis pin holes, not the rod. Enter that dimension and get the rod length(s) to order."
      />
      <section className="section tool-section">
        <div className="wrap tool-layout">
          <div className="tool-main">
            <div className="tool-panel card">
              <fieldset className="config-picker">
                <legend className="mark">1 · Select a configuration</legend>
                <div className="config-picker__grid">
                  {CONFIGS.map((c) => (
                    <label key={c.id} className={`config-option ${s.config === c.id ? 'is-on' : ''}`}>
                      <input type="radio" name="config" checked={s.config === c.id} onChange={() => patch({ config: c.id })} />
                      <ConfigIcon id={c.id} />
                      <strong>{c.title}</strong>
                      <small>{c.sub}</small>
                    </label>
                  ))}
                </div>
              </fieldset>

              <p className="mark" style={{ marginBlock: '24px 12px' }}>2 · Set the dimensions</p>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="tr-p2p">Pin to pin</label>
                  <div className="input-wrap">
                    <input id="tr-p2p" className="input has-suffix" inputMode="decimal" autoComplete="off" placeholder="48" value={s.p2p} onChange={(e) => patch({ p2p: e.target.value })} aria-invalid={p2pBad || undefined} />
                    <span className="input-suffix">in.</span>
                  </div>
                  {p2pBad && <span className="field-error">Use a number or fraction, like 48 or 47-3/4.</span>}
                </div>

                {s.config === 'different' && (
                  <div className="field">
                    <label htmlFor="tr-fixed">Fixed rod size</label>
                    <div className="input-wrap">
                      <input id="tr-fixed" className="input has-suffix" inputMode="decimal" autoComplete="off" placeholder="20" value={s.fixed} onChange={(e) => patch({ fixed: e.target.value })} aria-invalid={fixedBad || undefined} />
                      <span className="input-suffix">in.</span>
                    </div>
                    {fixedBad && <span className="field-error">Use a number or fraction.</span>}
                  </div>
                )}

                <div className="field">
                  <label htmlFor="tr-d">Rod diameter</label>
                  <select id="tr-d" className="select" value={s.d} onChange={(e) => onDiameter(e.target.value as RodDiameter)}>
                    {ROD_DIAMETERS.map((x) => <option key={x} value={x}>{x}"</option>)}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="tr-c">Clevis</label>
                  <select id="tr-c" className="select" value={s.cNum} onChange={(e) => patch({ cNum: e.target.value })}>
                    {CLEVIS_OPTIONS[s.d].map((c) => <option key={c} value={c}>#{c}</option>)}
                  </select>
                </div>

                {s.config !== 'single' && (
                  <div className="field">
                    <label htmlFor="tr-t">Turnbuckle length</label>
                    <select id="tr-t" className="select" value={s.t} onChange={(e) => patch({ t: Number(e.target.value) })}>
                      {TURNBUCKLE_LENGTHS.map((t) => <option key={t} value={t}>{t}"</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="readout readout--rods" aria-live="polite">
                {result?.ok ? (
                  result.rods.map((r, i) => (
                    <div key={i} className={`readout__cell ${i === 0 ? 'readout__cell--main' : ''}`}>
                      <span className="mark">
                        {result.rods.length === 1 ? 'Rod length' : s.config === 'equal' ? (i === 0 ? 'Each rod' : 'Other rod') : i === 0 ? 'Rod to order' : 'Fixed rod'}
                      </span>
                      <output className="readout__value">{trimmed(r, 3)}</output>
                      <span className="mark readout__unit">in. · ≈ {formatRodFraction(r)}</span>
                    </div>
                  ))
                ) : (
                  <div className="readout__cell"><span className="mark">Rod length</span><output className="readout__value">—</output></div>
                )}
              </div>
              {result && !result.ok && <p className="field-error" role="alert">{result.error}</p>}
              {!result && !p2pBad && !fixedBad && <p className="field-hint">Enter a pin-to-pin length{s.config === 'different' ? ' and the fixed rod size' : ''} to see the rod length.</p>}

              <div className="btn-row tool-actions">
                <button type="button" className="btn btn--ghost btn--sm" onClick={copyLink}>{copied ? 'Link copied' : 'Copy link to this result'}</button>
                <Link className="btn btn--sm" to="/quick-quote?item=Tie%20rod%20assembly">Get a quick quote</Link>
              </div>
            </div>

            <figure className="tool-figure on-dark grid-bg">
              <Diagram
                config={s.config}
                pin={p2p ? trimmed(p2p, 3) : ''}
                rods={rodsText}
                clevis={s.cNum}
                turnbuckle={s.t}
              />
              <figcaption className="mark">{CONFIG_LABELS[s.config]} · clevis #{s.cNum}</figcaption>
            </figure>

            {result?.ok && (
              <details className="math card" open>
                <summary className="mark">Show the math</summary>
                <ol>
                  <li>
                    Clevis #{s.cNum} measures <strong>{trimmed(dim, 4)}"</strong> from pin centre to the end of the thread. A {s.d}" rod engages up to <strong>{trimmed(engagement(d), 4)}"</strong> (the greater of half the diameter or 1/2").
                  </li>
                  <li>
                    Each end gives up <strong>{trimmed(clevisDeduction(s.d, s.cNum) ?? 0, 4)}"</strong>, so both clevises take <strong>{trimmed(2 * (clevisDeduction(s.d, s.cNum) ?? 0), 4)}"</strong> from the pin-to-pin length.
                  </li>
                  {s.config !== 'single' && (
                    <li>
                      Each rod runs a quarter of the {s.t}" turnbuckle into it, so the turnbuckle adds <strong>{trimmed(s.t / 2, 4)}"</strong> of its own (turnbuckle − 2 × ¼ × turnbuckle).
                    </li>
                  )}
                  <li>
                    What is left, {trimmed(result.pinToPin - 2 * result.perEndDeduction - (result.turnbuckle ? result.turnbuckle / 2 : 0), 4)}",{' '}
                    {s.config === 'single' ? 'is the rod.' : s.config === 'equal' ? 'is split between the two rods.' : 'is shared by the two rods, after the fixed rod is taken out.'}
                  </li>
                </ol>
              </details>
            )}
          </div>

          <aside className="tool-aside">
            <div className="card">
              <h3>Instructions</h3>
              <ul className="dot-list">
                <li>Clevis sizes follow the AISC Manual of Steel Construction, 13th ed., page 15-15.</li>
                <li>Overall length varies with grip size, rod diameter and the turnbuckle or sleeve nut used.</li>
                <li>Turnbuckles and sleeve nuts come in other sizes than this tool offers.</li>
                <li>Maximum clevis engagement from the end of the nut is half the rod diameter, or 1/2", whichever is greater.</li>
                <li>Each rod engages 1/4 of the turnbuckle length.</li>
                <li>Inputs take fractions and decimals.</li>
              </ul>
            </div>
            <div className="card">
              <h3>Other tools</h3>
              <ul className="link-list">
                <li><Link to="/technical/tools/bolt-weight-calculator">Bolt weight calculator</Link></li>
                <li><Link to="/technical/tools/plate-weight-calculator">Plate weight calculator</Link></li>
                <li><Link to="/products/rods/tie-rods">About tie rods</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <QuoteBand title="Need custom tie rod assemblies?" text="We build rod, clevis and turnbuckle assemblies to your drawing, with galvanizing in-house." />
    </>
  )
}
