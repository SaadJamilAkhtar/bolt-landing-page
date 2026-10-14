import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CoastRuler, HeroDrawing, ProjectArt } from '../components/HomeArt'
import { Glyph } from '../components/Glyph'
import { QuoteBand, SectionHead } from '../components/Page'
import { useTitle } from '../lib/useTitle'
import { CATALOG, TOTAL_PRODUCTS } from '../data/catalog'
import { COMPANY, INDUSTRIES, LOCATIONS, PROJECTS } from '../data/site'

const STANDARDS = ['ASTM F1554', 'A307', 'A325', 'A490', 'A449', 'A193 B7', 'A354', 'A615', 'AASHTO M164 / M253', 'ASTM A153 / F2329']

const TOOLS = [
  { to: '/technical/tools/bolt-weight-calculator', title: 'Bolt weight', text: 'Shipping weights for bolts, nuts and washers, with a running tally for the whole order.', glyph: 'hexBolt' as const },
  { to: '/technical/tools/tie-rod-calculator', title: 'Tie rod length', text: 'Turn a pin-to-pin dimension into the rod lengths to order, with clevis and turnbuckle allowances.', glyph: 'tieRod' as const },
  { to: '/technical/tools/plate-weight-calculator', title: 'Plate weight', text: 'Square or round plate, with or without a hole, weighed in a couple of keystrokes.', glyph: 'plate' as const },
]

const CAPABILITIES = [
  { name: 'Headed bolts', method: 'Hot forged', dia: '1/2" – 2-1/2"', length: 'to 40 ft', note: 'Hex, square, round, countersunk and custom heads' },
  { name: 'Straight rods', method: 'Cut thread', dia: '1/2" – 6"', length: 'to 40 ft', note: 'Reduced-body rolled thread 1/2" – 1"' },
  { name: 'Bent bolts', method: 'Cut thread', dia: '1/2" – 4-1/2"', length: 'bent to print', note: 'Reduced-body rolled thread 1/2" – 1"' },
]

/** Animate "10,129" / "7.09M" / "137K" up from zero once on screen. */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const m = value.match(/^([\d,.]+)(\D*)$/)
    if (!m) return
    const target = parseFloat(m[1].replace(/,/g, ''))
    const decimals = (m[1].split('.')[1] ?? '').length
    const fmt = (n: number) =>
      n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + m[2]
    setShown(fmt(0))
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - t0) / 1400, 1)
          setShown(fmt(target * (1 - Math.pow(1 - p, 3))))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])

  return <span ref={ref}>{shown}</span>
}

export default function Home() {
  useTitle('')
  const [active, setActive] = useState(0)
  const industry = INDUSTRIES[active]

  return (
    <>
      {/* HERO */}
      <section className="hero on-dark grid-bg">
        <div className="wrap hero__inner">
          <div className="hero__copy">
            <span className="eyebrow mark">Est. {COMPANY.founded} · Portland, Oregon</span>
            <h1>
              Anchor bolts &amp; construction fasteners, <em>made here.</em>
            </h1>
            <p className="lede">
              Hot-forged, threaded, bent and galvanized under one roof. {COMPANY.sqft} square feet across four plants, built for the non-standard order and the rush job.
            </p>
            <div className="btn-row">
              <Link className="btn" to="/quick-quote">Request a quote</Link>
              <Link className="btn btn--ghost" to="/products">Browse {TOTAL_PRODUCTS} product types</Link>
            </div>
          </div>
          <div className="hero__art">
            <HeroDrawing />
          </div>
        </div>
        <div className="hero__ticker" aria-label="Specifications supplied">
          <div className="hero__ticker-track mark">
            {[...STANDARDS, ...STANDARDS].map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS RAIL */}
      <section className="tools-rail">
        <div className="wrap tools-rail__grid">
          {TOOLS.map((t) => (
            <Link key={t.to} to={t.to} className="card card--reg tool-card">
              <Glyph kind={t.glyph} className="tool-card__glyph" />
              <div>
                <span className="mark tool-card__tag">Free calculator</span>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
                <span className="arrow-link">Open</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="01 / Capabilities" title="Sized for the work that doesn’t come off a shelf" split>
            <p className="lede">
              Most fastener plants stop at standard lengths. Ours forge to 2-1/2 inches in diameter and thread bar up to forty feet long, then bend and galvanize it in the same building.
            </p>
          </SectionHead>
          <div className="spec-sheet" role="table" aria-label="Manufacturing range">
            <div className="spec-sheet__head mark" role="row">
              <span role="columnheader">Product</span>
              <span role="columnheader">Process</span>
              <span role="columnheader">Diameter</span>
              <span role="columnheader">Length</span>
              <span role="columnheader">Notes</span>
            </div>
            {CAPABILITIES.map((c) => (
              <div className="spec-sheet__row" role="row" key={c.name}>
                <h3 role="cell">{c.name}</h3>
                <span role="cell" className="mark">{c.method}</span>
                <span role="cell" className="spec-sheet__big">{c.dia}</span>
                <span role="cell" className="spec-sheet__big">{c.length}</span>
                <span role="cell" className="spec-sheet__note">{c.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="section section--white">
        <div className="wrap">
          <SectionHead eyebrow="02 / Products" title="Six families, one order" split>
            <p className="lede">
              Headed bolts, rods, bent bolts, nuts, washers and the plate and hardware that finish the connection. Order the whole set from one plant.
            </p>
          </SectionHead>
          <div className="category-grid">
            {CATALOG.map((c, i) => (
              <Link key={c.slug} to={`/products/${c.slug}`} className="card card--reg category-card">
                <span className="mark category-card__no">{String(i + 1).padStart(2, '0')} · {c.items.length} types</span>
                <Glyph kind={c.glyph} className="category-card__glyph" />
                <h3>{c.name}</h3>
                <p className="mark category-card__range">{c.range}</p>
                <span className="arrow-link">View {c.short.toLowerCase()}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RUSH */}
      <section className="rush on-dark">
        <div className="wrap rush__inner">
          <div>
            <span className="eyebrow mark">Short lead times</span>
            <h2>We put the <em>fast</em> in fastener.</h2>
          </div>
          <div>
            <p className="lede">
              Forging, threading and galvanizing are all in-house, and the East and West Coast plants both specialise in emergency work. Standard sizes ship from stock the same day.
            </p>
            <Link className="btn" to="/quick-quote">Start a rush quote</Link>
          </div>
        </div>
        <div className="thread-rule" />
      </section>

      {/* INDUSTRIES */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="03 / Industries" title="Built into the structures around you" split>
            <p className="lede">
              Since {COMPANY.founded}, one stop for the fasteners behind data centers, docks, bridges, timber frames and substations.
            </p>
          </SectionHead>
          <div className="industry-index">
            <ol className="industry-index__list">
              {INDUSTRIES.map((ind, i) => (
                <li key={ind.slug}>
                  <Link
                    to={`/about/industries/${ind.slug}`}
                    className={i === active ? 'is-active' : ''}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                  >
                    <span className="mark">{String(i + 1).padStart(2, '0')}</span>
                    <span className="industry-index__name">{ind.name}</span>
                    <span className="industry-index__arrow" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ol>
            <aside className="industry-index__detail card card--reg" aria-live="polite">
              <span className="mark eyebrow">{String(active + 1).padStart(2, '0')} / {String(INDUSTRIES.length).padStart(2, '0')}</span>
              <h3>{industry.name}</h3>
              <p>{industry.blurb}</p>
              <ul className="tag-list">
                {industry.uses.map((u) => (
                  <li key={u} className="tag">{u}</li>
                ))}
              </ul>
              <Link className="arrow-link" to={`/about/industries/${industry.slug}`}>Industry page</Link>
            </aside>
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="stats on-dark">
        <div className="wrap">
          <div className="stats__grid">
            {COMPANY.stats.map((s) => (
              <div key={s.label} className="stat">
                <div className="stat__value"><CountUp value={s.value} /></div>
                <div className="mark stat__label">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="mark stats__note">{COMPANY.statsNote}</p>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section section--white">
        <div className="wrap">
          <SectionHead eyebrow="04 / Featured projects" title="Specified by engineers, installed on the hard jobs" split>
            <p className="lede">
              Bridges, stadiums, power plants and piers. Where a failed bolt is not an option, the paperwork and the parts both have to hold up.
            </p>
          </SectionHead>
          <div className="project-grid">
            {PROJECTS.map((p) => (
              <Link key={p.slug} to="/about/projects" className="card card--reg project-card">
                <ProjectArt kind={p.kind} />
                <span className="mark">{p.code}</span>
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="section section--dark">
        <div className="wrap">
          <SectionHead eyebrow="05 / Locations" title="Coast to coast, plant to plant" split>
            <p className="lede">
              The flagship in Portland, Oregon is joined by Southeast and Northeast plants and a bolting-technology sister company, so orders ship from the nearest floor.
            </p>
          </SectionHead>
          <CoastRuler locations={LOCATIONS} />
          <div className="location-row">
            {LOCATIONS.map((l) => (
              <Link key={l.slug} to={`/locations/${l.slug}`} className="location-chip">
                <span className="mark">{l.role}</span>
                <strong>{l.city}, {l.state}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section className="section history">
        <div className="wrap history__inner">
          <div className="history__year" aria-hidden="true">1912</div>
          <div>
            <span className="eyebrow mark">Established {COMPANY.founded}</span>
            <h2>From a 6,000 sq ft livery stable to North America’s leading anchor bolt maker</h2>
            <p className="lede">More than a century of making what the catalog doesn’t list.</p>
            <Link className="arrow-link" to="/about/history">Read the history</Link>
          </div>
        </div>
      </section>

      <QuoteBand />
    </>
  )
}
