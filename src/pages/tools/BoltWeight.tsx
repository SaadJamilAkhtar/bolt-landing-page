import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dim, DimDefs } from '../../components/Dim'
import { Glyph } from '../../components/Glyph'
import { PageHero, QuoteBand } from '../../components/Page'
import {
  BOLT_LABELS,
  NUT_LABELS,
  WASHER_LABELS,
  describeItem,
  itemWeight,
  validateBolt,
  type BoltKind,
  type Finish,
  type ItemSpec,
  type NutKind,
  type ThreadType,
  type WasherKind,
} from '../../calculators/boltWeight'
import type { GlyphKind } from '../../data/catalog'
import { parseDimension, roundTo } from '../../lib/fractions'

type Tab = 'bolts' | 'nuts' | 'washers'
type Choice = { tab: 'bolts'; kind: BoltKind } | { tab: 'nuts'; kind: NutKind } | { tab: 'washers'; kind: WasherKind }

const BOLT_TILES: { kind: BoltKind; glyph: GlyphKind }[] = [
  { kind: 'hex', glyph: 'hexBolt' },
  { kind: 'heavyHex', glyph: 'heavyHexBolt' },
  { kind: 'timber', glyph: 'timberBolt' },
  { kind: 'carriage', glyph: 'carriage' },
  { kind: 'anchorRod', glyph: 'anchorRod' },
  { kind: 'anchor90', glyph: 'lBolt' },
]
const NUT_TILES: { kind: NutKind; glyph: GlyphKind }[] = [
  { kind: 'hex', glyph: 'nutHex' },
  { kind: 'heavyHex', glyph: 'nutHeavy' },
  { kind: 'square', glyph: 'nutSquare' },
  { kind: 'hexJam', glyph: 'nutJam' },
  { kind: 'heavyJam', glyph: 'nutJam' },
]
const WASHER_TILES: { kind: WasherKind; glyph: GlyphKind }[] = [
  { kind: 'standard', glyph: 'washerFlat' },
  { kind: 'f436', glyph: 'washerHard' },
  { kind: 'ogee', glyph: 'washerOgee' },
]

interface Fields {
  diameter: string
  length1: string
  length2: string
  thread1: string
  thread2: string
  threadType: ThreadType
  finish: Finish
  quantity: string
  nutsOn: boolean
  nutKind: NutKind
  nutCount: string
  washersOn: boolean
  washerKind: WasherKind
  washerCount: string
}

const EMPTY: Fields = {
  diameter: '', length1: '', length2: '', thread1: '', thread2: '', threadType: 'cut', finish: 'black',
  quantity: '', nutsOn: false, nutKind: 'hex', nutCount: '1', washersOn: false, washerKind: 'standard', washerCount: '1',
}

interface TallyRow {
  id: string
  qty: number
  item: ItemSpec
}

const STORE = 'fw-bolt-tally'
const loadTally = (): TallyRow[] => {
  try {
    const raw = localStorage.getItem(STORE)
    return raw ? (JSON.parse(raw) as TallyRow[]) : []
  } catch {
    return []
  }
}

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

function BoltDrawing({ choice, f }: { choice: Choice | null; f: Fields }) {
  const lab = (s: string, fb: string) => (s.trim() ? `${s.trim()}"` : fb)
  const d = parseDimension(f.diameter)
  const l1 = parseDimension(f.length1)
  const ratio = (t: string, l: number | null, max = 0.9) => {
    const tv = parseDimension(t)
    return tv && l && l > 0 ? Math.min(Math.max(tv / l, 0.06), max) : 0.3
  }
  const kind = choice?.tab === 'bolts' ? choice.kind : null

  if (choice && choice.tab !== 'bolts') {
    return (
      <svg className="tool-drawing" viewBox="0 0 420 200" role="img" aria-label="Fastener drawing">
        <DimDefs />
        <g transform="translate(110 20) scale(1.3)" color="var(--blue-300)">
          <Glyph kind={choice.tab === 'nuts' ? NUT_TILES.find((t) => t.kind === choice.kind)!.glyph : WASHER_TILES.find((t) => t.kind === choice.kind)!.glyph} className="" />
        </g>
        <Dim x1={120} y1={176} x2={290} y2={176} label={lab(f.diameter, 'D')} offset={-8} />
      </svg>
    )
  }

  if (kind === 'anchor90') {
    const th = ratio(f.thread1, l1, 0.7)
    return (
      <svg className="tool-drawing" viewBox="0 0 420 220" role="img" aria-label="90 degree anchor bolt drawing">
        <DimDefs />
        <g fill="var(--ink-900)" stroke="var(--blue-300)" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M300 24V160H120V188H316a16 16 0 0 0 0-0V24z" fill="none" strokeWidth="0" />
          <path d="M286 24h28v136a28 28 0 0 1-28 28H130v-28h156z" />
          {Array.from({ length: Math.round(th * 22) }, (_, i) => (
            <path key={i} d={`M286 ${28 + i * 6 + 5}l28 -5`} strokeWidth="1.2" />
          ))}
        </g>
        <Dim x1={352} y1={24} x2={352} y2={188} label={lab(f.length1, 'L1')} offset={-8} ext={[[314, 24, 356, 24], [314, 188, 356, 188]]} />
        <Dim x1={130} y1={208} x2={314} y2={208} label={lab(f.length2, 'L2')} offset={-6} ext={[[130, 188, 130, 212], [314, 188, 314, 212]]} />
        <Dim x1={252} y1={24} x2={252} y2={24 + th * 140} label={lab(f.thread1, 'T')} offset={-8} ext={[[286, 24, 248, 24], [286, 24 + th * 140, 248, 24 + th * 140]]} />
      </svg>
    )
  }

  const noHead = kind === 'anchorRod'
  const x0 = noHead ? 60 : 110
  const x1 = 360
  const len = x1 - x0
  const dia = Math.min(Math.max(d ? 22 + d * 22 : 40, 26), 64)
  const cy = 90
  const top = cy - dia / 2
  const t1 = ratio(f.thread1, l1, noHead ? 0.45 : 0.95)
  const t2 = ratio(f.thread2, l1, 0.45)

  return (
    <svg className="tool-drawing" viewBox="0 0 440 220" role="img" aria-label="Bolt drawing with dimensions">
      <DimDefs />
      <g fill="var(--ink-900)" stroke="var(--blue-300)" strokeWidth="1.8" strokeLinejoin="round">
        {!noHead && kind !== 'timber' && kind !== 'carriage' && (
          <g>
            <rect x={60} y={cy - dia * 0.9} width={50} height={dia * 1.8} />
            <path d={`M60 ${cy - dia * 0.45}h50M60 ${cy + dia * 0.45}h50`} strokeWidth="1.2" />
          </g>
        )}
        {(kind === 'timber' || kind === 'carriage') && (
          <path d={`M110 ${cy - dia * 0.95}C70 ${cy - dia * 0.95} 56 ${cy - dia * 0.4} 56 ${cy}s14 ${dia * 0.95} 54 ${dia * 0.95}z`} />
        )}
        <rect x={x0} y={top} width={len} height={dia} />
        <g strokeWidth="1.2">
          {Array.from({ length: Math.round((t1 * len) / 7) }, (_, i) => (
            <path key={`a${i}`} d={`M${x1 - t1 * len + i * 7} ${top + dia}l5 ${-dia}`} />
          ))}
          {noHead &&
            Array.from({ length: Math.round((t2 * len) / 7) }, (_, i) => (
              <path key={`b${i}`} d={`M${x0 + i * 7} ${top + dia}l5 ${-dia}`} />
            ))}
        </g>
      </g>
      <Dim x1={x0} y1={152} x2={x1} y2={152} label={lab(f.length1, 'L')} offset={-8} ext={[[x0, top + dia, x0, 156], [x1, top + dia, x1, 156]]} />
      <Dim x1={x1 - t1 * len} y1={184} x2={x1} y2={184} label={lab(f.thread1, noHead ? 'T1' : 'T')} offset={-8} ext={[[x1 - t1 * len, top + dia, x1 - t1 * len, 188]]} />
      {noHead && <Dim x1={x0} y1={204} x2={x0 + t2 * len} y2={204} label={lab(f.thread2, 'T2')} offset={-8} ext={[[x0 + t2 * len, top + dia, x0 + t2 * len, 208]]} />}
      <Dim x1={392} y1={top} x2={392} y2={top + dia} label={lab(f.diameter, 'D')} offset={-8} ext={[[x1, top, 396, top], [x1, top + dia, 396, top + dia]]} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function BoltWeight() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('bolts')
  const [choice, setChoice] = useState<Choice | null>(null)
  const [f, setF] = useState<Fields>(EMPTY)
  const [tally, setTally] = useState<TallyRow[]>(loadTally)
  const [editing, setEditing] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(tally))
    } catch {
      /* private mode: the tally just won't persist */
    }
  }, [tally])

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => setF((s) => ({ ...s, [k]: v }))
  const text = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => set(k, e.target.value as never)

  const pick = (c: Choice) => {
    setChoice(c)
    setEditing(null)
  }

  const num = (s: string) => (s.trim() ? parseDimension(s) : undefined)
  const bad = (s: string) => s.trim() !== '' && parseDimension(s) === null

  /** Build the item from the form, or explain what is missing. */
  const built = useMemo((): { item: ItemSpec; qty: number } | { error: string } | null => {
    if (!choice) return null
    const d = num(f.diameter)
    const qty = num(f.quantity)
    if (d === undefined) return { error: 'Enter a diameter.' }
    if (d === null || bad(f.length1) || bad(f.length2) || bad(f.thread1) || bad(f.thread2) || qty === null) {
      return { error: 'Use numbers or fractions, like 3/4 or 1-1/2.' }
    }
    if (qty === undefined || qty <= 0) return { error: 'Enter a quantity.' }

    if (choice.tab === 'nuts') return { item: { category: 'nut', kind: choice.kind, diameter: d, finish: f.finish }, qty }
    if (choice.tab === 'washers') return { item: { category: 'washer', kind: choice.kind, diameter: d, finish: f.finish }, qty }

    const length1 = num(f.length1)
    if (!length1) return { error: choice.kind === 'anchor90' ? 'Enter the length (L1).' : 'Enter a length.' }
    const bolt = {
      kind: choice.kind,
      diameter: d,
      length1,
      length2: num(f.length2) ?? undefined,
      thread1: num(f.thread1) ?? 0,
      thread2: num(f.thread2) ?? 0,
      threadType: f.threadType,
    }
    const problem = validateBolt(bolt)
    if (problem) return { error: problem }
    const nc = Number(f.nutCount)
    const wc = Number(f.washerCount)
    return {
      qty,
      item: {
        category: 'bolt',
        bolt,
        finish: f.finish,
        hardware: {
          nuts: f.nutsOn && nc > 0 ? { kind: f.nutKind, count: nc } : undefined,
          washers: f.washersOn && wc > 0 ? { kind: f.washerKind, count: wc } : undefined,
        },
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice, f])

  const ok = built && 'item' in built ? built : null
  const weight = ok ? itemWeight(ok.item, ok.qty) : null
  const totalLb = tally.reduce((sum, r) => sum + itemWeight(r.item, r.qty).totalExact, 0)

  const add = () => {
    if (!ok) return
    const row: TallyRow = { id: editing ?? `${Date.now()}-${Math.round(Math.random() * 1e4)}`, qty: ok.qty, item: ok.item }
    setTally((t) => (editing ? t.map((r) => (r.id === editing ? row : r)) : [...t, row]))
    setEditing(null)
  }

  const reset = () => {
    setF(EMPTY)
    setEditing(null)
  }

  const edit = (row: TallyRow) => {
    const { item } = row
    const n = (v?: number) => (v ? String(v) : '')
    setEditing(row.id)
    if (item.category === 'bolt') {
      setTab('bolts')
      setChoice({ tab: 'bolts', kind: item.bolt.kind })
      setF({
        ...EMPTY,
        diameter: n(item.bolt.diameter), length1: n(item.bolt.length1), length2: n(item.bolt.length2),
        thread1: n(item.bolt.thread1), thread2: n(item.bolt.thread2), threadType: item.bolt.threadType ?? 'cut',
        finish: item.finish, quantity: String(row.qty),
        nutsOn: !!item.hardware.nuts, nutKind: item.hardware.nuts?.kind ?? 'hex', nutCount: String(item.hardware.nuts?.count ?? 1),
        washersOn: !!item.hardware.washers, washerKind: item.hardware.washers?.kind ?? 'standard', washerCount: String(item.hardware.washers?.count ?? 1),
      })
    } else {
      setTab(item.category === 'nut' ? 'nuts' : 'washers')
      setChoice({ tab: item.category === 'nut' ? 'nuts' : 'washers', kind: item.kind } as Choice)
      setF({ ...EMPTY, diameter: n(item.diameter), finish: item.finish, quantity: String(row.qty) })
    }
    document.getElementById('bw-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const setQty = (id: string, q: number) => setTally((t) => t.map((r) => (r.id === id ? { ...r, qty: Math.max(1, q) } : r)))

  const toQuote = () => {
    try {
      sessionStorage.setItem(
        'fw-quote-items',
        JSON.stringify(tally.map((r) => ({ qty: r.qty, text: describeItem(r.item), lbs: roundTo(itemWeight(r.item, r.qty).totalExact, 1) }))),
      )
    } catch {
      /* ignore */
    }
    navigate('/quick-quote')
  }

  const kind = choice?.tab === 'bolts' ? choice.kind : null
  const isBolt = choice?.tab === 'bolts'
  const showLength = isBolt
  const showThread = isBolt
  const tiles = tab === 'bolts' ? BOLT_TILES : tab === 'nuts' ? NUT_TILES : WASHER_TILES
  const labelOf = (t: Tab, k: string) => (t === 'bolts' ? BOLT_LABELS[k as BoltKind] : t === 'nuts' ? NUT_LABELS[k as NutKind] : WASHER_LABELS[k as WasherKind])

  const field = (k: keyof Fields, label: string, opts: { suffix?: string; hint?: string; id?: string } = {}) => (
    <div className="field" key={k}>
      <label htmlFor={`bw-${k}`}>{label}</label>
      <div className="input-wrap">
        <input
          id={`bw-${k}`}
          className={`input ${opts.suffix ? 'has-suffix' : ''}`}
          inputMode="decimal"
          autoComplete="off"
          placeholder={opts.hint}
          value={f[k] as string}
          onChange={text(k)}
          aria-invalid={k !== 'quantity' && bad(f[k] as string) ? true : undefined}
        />
        {opts.suffix && <span className="input-suffix">{opts.suffix}</span>}
      </div>
    </div>
  )

  return (
    <>
      <PageHero
        title="Bolt Weight Calculator"
        eyebrow="Tools & info"
        trail={[{ label: 'Tools & Info', to: '/technical' }, { label: 'Calculators', to: '/technical/tools' }, { label: 'Bolt Weight' }]}
        lede="Shipping weights for bolts, nuts and washers. Build an order line by line and the tally keeps the running total."
      />
      <section className="section tool-section">
        <div className="wrap tool-layout tool-layout--wide">
          <div className="tool-main" id="bw-builder">
            <div className="tool-panel card">
              <p className="mark step-label">1 · What are we weighing?</p>
              <div className="tabs" role="tablist" aria-label="Fastener family">
                {(['bolts', 'nuts', 'washers'] as Tab[]).map((t) => (
                  <button key={t} type="button" role="tab" aria-selected={tab === t} className={`tabs__tab ${tab === t ? 'is-on' : ''}`} onClick={() => { setTab(t); setChoice(null) }}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="type-tiles" role="radiogroup" aria-label="Type">
                {tiles.map((t) => {
                  const on = choice?.tab === tab && choice.kind === t.kind
                  return (
                    <label key={t.kind} className={`type-tile ${on ? 'is-on' : ''}`}>
                      <input type="radio" name="bw-type" checked={on} onChange={() => pick({ tab, kind: t.kind } as Choice)} />
                      <Glyph kind={t.glyph} className="type-tile__glyph" />
                      <span>{labelOf(tab, t.kind)}s</span>
                    </label>
                  )
                })}
              </div>

              {!choice && <p className="field-hint" style={{ marginTop: 16 }}>Select a bolt, nut or washer to begin.</p>}

              {choice && (
                <>
                  <p className="mark step-label">2 · With what dimensions? <span style={{ color: 'var(--steel-500)' }}>(inches)</span></p>
                  <div className="field-grid">
                    {field('diameter', 'Diameter (D)', { suffix: 'in.', hint: '1' })}
                    {showLength && field('length1', kind === 'anchor90' ? 'Length (L1)' : 'Length (L)', { suffix: 'in.', hint: '6' })}
                    {kind === 'anchor90' && field('length2', 'Hook (L2)', { suffix: 'in.', hint: '4' })}
                    {showThread && field('thread1', kind === 'anchorRod' ? 'Thread, end 1 (T1)' : 'Thread length (T)', { suffix: 'in.', hint: '3' })}
                    {kind === 'anchorRod' && field('thread2', 'Thread, end 2 (T2)', { suffix: 'in.', hint: '3' })}
                    {isBolt && (
                      <div className="field">
                        <label htmlFor="bw-tt">Thread type</label>
                        <select id="bw-tt" className="select" value={f.threadType} onChange={(e) => set('threadType', e.target.value as ThreadType)}>
                          <option value="cut">Cut</option>
                          <option value="rolled">Rolled</option>
                        </select>
                      </div>
                    )}
                    <div className="field">
                      <label htmlFor="bw-fin">Finish</label>
                      <select id="bw-fin" className="select" value={f.finish} onChange={(e) => set('finish', e.target.value as Finish)}>
                        <option value="black">Plain (black)</option>
                        <option value="galvanized">Hot-dip galvanized</option>
                      </select>
                    </div>
                  </div>

                  {isBolt && (
                    <>
                      <p className="mark step-label">3 · Include hardware with each bolt?</p>
                      <div className="hardware">
                        <div className={`hardware__card ${f.nutsOn ? 'is-on' : ''}`}>
                          <button type="button" className="btn btn--sm btn--ghost" aria-pressed={f.nutsOn} onClick={() => set('nutsOn', !f.nutsOn)}>
                            {f.nutsOn ? '– Nuts' : '+ Nuts'}
                          </button>
                          {f.nutsOn && (
                            <div className="hardware__fields">
                              <div className="field">
                                <label htmlFor="bw-nk">Nut type</label>
                                <select id="bw-nk" className="select" value={f.nutKind} onChange={(e) => set('nutKind', e.target.value as NutKind)}>
                                  {(Object.keys(NUT_LABELS) as NutKind[]).map((k) => <option key={k} value={k}>{NUT_LABELS[k]}</option>)}
                                </select>
                              </div>
                              {field('nutCount', 'Per bolt')}
                            </div>
                          )}
                        </div>
                        <div className={`hardware__card ${f.washersOn ? 'is-on' : ''}`}>
                          <button type="button" className="btn btn--sm btn--ghost" aria-pressed={f.washersOn} onClick={() => set('washersOn', !f.washersOn)}>
                            {f.washersOn ? '– Washers' : '+ Washers'}
                          </button>
                          {f.washersOn && (
                            <div className="hardware__fields">
                              <div className="field">
                                <label htmlFor="bw-wk">Washer type</label>
                                <select id="bw-wk" className="select" value={f.washerKind} onChange={(e) => set('washerKind', e.target.value as WasherKind)}>
                                  {(Object.keys(WASHER_LABELS) as WasherKind[]).map((k) => <option key={k} value={k}>{WASHER_LABELS[k]}</option>)}
                                </select>
                              </div>
                              {field('washerCount', 'Per bolt')}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <p className="mark step-label">{isBolt ? '4' : '3'} · And the total weight for how many?</p>
                  <div className="field-grid field-grid--narrow">{field('quantity', 'Quantity', { hint: '100' })}</div>

                  <div className="readout" aria-live="polite">
                    <div className="readout__cell">
                      <span className="mark">Weight per each</span>
                      <output className="readout__value">{weight ? weight.each.toFixed(2) : '—'}</output>
                      <span className="mark readout__unit">lbs</span>
                    </div>
                    <div className="readout__cell readout__cell--main">
                      <span className="mark">Total weight</span>
                      <output className="readout__value">{weight ? weight.total.toFixed(1) : '—'}</output>
                      <span className="mark readout__unit">lbs</span>
                    </div>
                  </div>
                  {built && 'error' in built && (f.diameter || f.length1 || f.quantity) && <p className="field-error" role="alert">{built.error}</p>}

                  <div className="btn-row tool-actions">
                    <button type="button" className="btn" disabled={!ok} onClick={add}>{editing ? 'Update tally' : 'Calculate & add to tally'}</button>
                    <button type="button" className="btn btn--ghost" onClick={reset}>Reset</button>
                  </div>
                </>
              )}
              <p className="field-hint disclaimer">
                Estimates only. Actual weights vary with manufacturing tolerances, thread type and coating. For sizes that aren’t made, dimensions are extrapolated from the standard size charts.
              </p>
            </div>

            <figure className="tool-figure on-dark grid-bg">
              <BoltDrawing choice={choice} f={f} />
              <figcaption className="mark">{choice ? `${labelOf(choice.tab, choice.kind)} · live drawing` : 'Pick a fastener to see its drawing'}</figcaption>
            </figure>
          </div>

          <aside className="tool-aside tool-aside--sticky">
            <div className="tally card" id="tally">
              <div className="tally__head">
                <h3>Calculation history</h3>
                <button type="button" className="btn btn--link" onClick={() => window.print()} disabled={!tally.length}>Print</button>
              </div>
              {tally.length === 0 ? (
                <p className="tally__empty">Your tally will show here once you have added an item.</p>
              ) : (
                <ul className="tally__rows">
                  {tally.map((r) => {
                    const w = itemWeight(r.item, r.qty)
                    return (
                      <li key={r.id} className={editing === r.id ? 'is-editing' : ''}>
                        <input
                          className="tally__qty"
                          type="number"
                          min={1}
                          value={r.qty}
                          aria-label="Quantity"
                          onChange={(e) => setQty(r.id, Number(e.target.value) || 1)}
                        />
                        <span className="tally__desc">{describeItem(r.item)}</span>
                        <span className="tally__lbs">{w.total.toFixed(1)}</span>
                        <span className="tally__tools">
                          <button type="button" aria-label="Edit" title="Edit" onClick={() => edit(r)}>✎</button>
                          <button type="button" aria-label="Delete" title="Delete" onClick={() => setTally((t) => t.filter((x) => x.id !== r.id))}>✕</button>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
              <div className="tally__total">
                <span className="mark">Total weight</span>
                <strong>{roundTo(totalLb, 1).toLocaleString('en-US', { minimumFractionDigits: 1 })}</strong>
                <span className="mark">lbs</span>
              </div>
              {tally.length > 0 && (
                <div className="btn-row">
                  <button type="button" className="btn btn--sm" onClick={toQuote}>Get a quick quote</button>
                  <button type="button" className="btn btn--link" onClick={() => setTally([])}>Clear all</button>
                </div>
              )}
            </div>

            <div className="card">
              <h3>How does it work?</h3>
              <p>Head, shank and thread volumes are built from standard ASME dimensions and steel at 0.2833 lb/in³. Galvanized weights add a typical zinc coating.</p>
              <p>The per-piece weight shown is rounded. The total uses the unrounded figure, so each × quantity can differ a little from the total.</p>
            </div>
            <div className="card">
              <h3>Other tools</h3>
              <ul className="link-list">
                <li><Link to="/technical/tools/tie-rod-calculator">Tie rod calculator</Link></li>
                <li><Link to="/technical/tools/plate-weight-calculator">Plate weight calculator</Link></li>
                <li><Link to="/technical/nut-weight-chart">Nut weight chart</Link></li>
                <li><Link to="/technical/structural-bolt-weight-chart">Structural bolt weight chart</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <QuoteBand title="Need a custom fastener quote?" />
    </>
  )
}
