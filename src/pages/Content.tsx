import { Link, Navigate, useParams } from 'react-router-dom'
import { CoastRuler, ProjectArt } from '../components/HomeArt'
import { Glyph } from '../components/Glyph'
import { PageHero, QuoteBand, SectionHead } from '../components/Page'
import { CATALOG } from '../data/catalog'
import { COMPANY, INDUSTRIES, LOCATIONS, MANUFACTURING, PROJECTS } from '../data/site'

/* ---------------- industries ---------------- */

export function IndustriesIndex() {
  return (
    <>
      <PageHero
        title="Industries"
        eyebrow="Who we build for"
        trail={[{ label: 'Industries' }]}
        lede={`Since ${COMPANY.founded}, a one-stop source of fasteners, custom manufacturing and hot-dip galvanizing for every kind of structure.`}
      />
      <section className="section">
        <div className="wrap">
          <div className="industry-cards">
            {INDUSTRIES.map((ind, i) => (
              <Link key={ind.slug} to={`/about/industries/${ind.slug}`} className="card card--reg industry-card">
                <span className="mark">{String(i + 1).padStart(2, '0')}</span>
                <h3>{ind.name}</h3>
                <p>{ind.blurb}</p>
                <span className="arrow-link">Explore</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

export function IndustryPage() {
  const { slug } = useParams()
  const i = INDUSTRIES.findIndex((x) => x.slug === slug)
  if (i < 0) return <Navigate to="/about/industries" replace />
  const ind = INDUSTRIES[i]
  const related = CATALOG.flatMap((c) => c.items.slice(0, 2).map((p) => ({ cat: c.slug, p }))).slice(i % 4, (i % 4) + 6)
  return (
    <>
      <PageHero
        title={ind.name}
        eyebrow={`Industry ${String(i + 1).padStart(2, '0')} of ${INDUSTRIES.length}`}
        trail={[{ label: 'Industries', to: '/about/industries' }, { label: ind.name }]}
        lede={ind.blurb}
      >
        <div className="btn-row">
          <Link className="btn" to={`/quick-quote?item=${encodeURIComponent(ind.name + ' project')}`}>Quote a project</Link>
        </div>
      </PageHero>
      <section className="section">
        <div className="wrap two-col">
          <div>
            <SectionHead eyebrow="Typical supply" title="What we make for it" />
            <ul className="check-grid">
              {ind.uses.map((u) => <li key={u}>{u}</li>)}
            </ul>
            <p className="lede" style={{ marginTop: 32 }}>
              Domestic manufacture, certified material and in-house galvanizing mean the paperwork and the parts arrive together. If your drawing calls out something unusual, we make it.
            </p>
          </div>
          <div className="card">
            <h3>Related products</h3>
            <ul className="link-list">
              {related.map(({ cat, p }) => (
                <li key={`${cat}-${p.slug}`}><Link to={`/products/${cat}/${p.slug}`}>{p.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section section--white">
        <div className="wrap">
          <SectionHead eyebrow="More industries" title="Also serving" />
          <ul className="tag-list tag-list--big">
            {INDUSTRIES.filter((x) => x.slug !== ind.slug).map((x) => (
              <li key={x.slug}><Link className="tag" to={`/about/industries/${x.slug}`}>{x.name}</Link></li>
            ))}
          </ul>
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

/* ---------------- manufacturing ---------------- */

export function ManufacturingIndex() {
  return (
    <>
      <PageHero
        title="Manufacturing"
        eyebrow="Under one roof"
        trail={[{ label: 'Manufacturing' }]}
        lede="Heading, threading, bending, plate work and hot-dip galvanizing in the same building. That is how a custom order ships in days, not weeks."
      />
      <section className="section">
        <div className="wrap">
          <ol className="process-list">
            {MANUFACTURING.map((m, i) => (
              <li key={m.slug}>
                <Link to={`/about/manufacturing/${m.slug}`}>
                  <span className="hex">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{m.name}</h3>
                    <p>{m.blurb}</p>
                  </div>
                  <span className="arrow-link" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

export function ManufacturingPage() {
  const { slug } = useParams()
  const i = MANUFACTURING.findIndex((m) => m.slug === slug)
  if (i < 0) return <Navigate to="/about/manufacturing" replace />
  const m = MANUFACTURING[i]
  const next = MANUFACTURING[(i + 1) % MANUFACTURING.length]
  return (
    <>
      <PageHero
        title={m.name}
        eyebrow={`Process ${String(i + 1).padStart(2, '0')}`}
        trail={[{ label: 'Manufacturing', to: '/about/manufacturing' }, { label: m.name }]}
        lede={m.blurb}
      />
      <section className="section">
        <div className="wrap prose">
          <p className="lede">
            {m.name} is one of the steps that happens in-house, so quality, schedule and cost stay under our control from bar stock to finished, galvanized piece.
          </p>
          <p>
            Send a drawing with the diameter, length, thread, grade and finish. We confirm the process route, quote the job and keep you posted as it moves through the plant.
          </p>
          <div className="btn-row" style={{ marginTop: 32 }}>
            <Link className="btn" to="/quick-quote">Request a quote</Link>
            <Link className="btn btn--ghost" to={`/about/manufacturing/${next.slug}`}>Next: {next.name}</Link>
          </div>
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

/* ---------------- locations ---------------- */

export function LocationsIndex() {
  return (
    <>
      <PageHero
        title="Locations"
        eyebrow="Four plants, one phone number"
        trail={[{ label: 'Locations' }]}
        lede={`${COMPANY.sqft} square feet of manufacturing and distribution space across the country, with rush capability on both coasts.`}
      />
      <section className="section section--dark">
        <div className="wrap">
          <CoastRuler locations={LOCATIONS} />
        </div>
      </section>
      <section className="section">
        <div className="wrap location-cards">
          {LOCATIONS.map((l) => (
            <Link key={l.slug} to={`/locations/${l.slug}`} className="card card--reg location-card">
              <span className="mark">{l.role}</span>
              <h3>{l.name}</h3>
              <p className="mark">{l.city}, {l.state}</p>
              <p>{l.detail}</p>
              <span className="arrow-link">Details</span>
            </Link>
          ))}
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

export function LocationPage() {
  const { slug } = useParams()
  const l = LOCATIONS.find((x) => x.slug === slug)
  if (!l) return <Navigate to="/locations" replace />
  return (
    <>
      <PageHero
        title={l.name}
        eyebrow={`${l.city}, ${l.state} · ${l.role}`}
        trail={[{ label: 'Locations', to: '/locations' }, { label: l.name }]}
        lede={l.detail}
      >
        <div className="btn-row">
          <a className="btn" href={COMPANY.phoneHref}>Call {COMPANY.phone}</a>
          <Link className="btn btn--ghost" to="/quick-quote">Request a quote</Link>
        </div>
      </PageHero>
      <section className="section">
        <div className="wrap two-col">
          <div className="prose">
            <h2>What ships from here</h2>
            <p>Stocked fasteners, custom-made anchor bolts and rods, galvanizing and rush work, depending on the plant. One phone number reaches whichever location can ship your order fastest.</p>
            <p>Need the order split across plants, or a delivery to a jobsite on the other coast? Ask. Moving work between plants is routine.</p>
          </div>
          <div className="card">
            <h3>Other locations</h3>
            <ul className="link-list">
              {LOCATIONS.filter((x) => x.slug !== l.slug).map((x) => (
                <li key={x.slug}><Link to={`/locations/${x.slug}`}>{x.name} · {x.city}, {x.state}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

/* ---------------- about ---------------- */

export function About() {
  return (
    <>
      <PageHero
        title="About us"
        eyebrow={`Since ${COMPANY.founded}`}
        trail={[{ label: 'About' }]}
        lede="The leading anchor bolt and nonstandard construction fastener manufacturer in North America, and still a family of people who answer the phone."
      />
      <section className="section">
        <div className="wrap two-col">
          <div className="prose">
            <h2>Made in America, made to print</h2>
            <p>
              Our commitment is simple: the highest-quality fasteners, manufactured and distributed from {COMPANY.sqft} square feet of plant space across four facilities, including the 137,000 sq ft flagship in Portland, Oregon.
            </p>
            <p>
              Everything is proudly made in America, which makes us the natural fit for any job that requires domestic materials. And because we forge, thread, bend and galvanize in-house, we can say yes to the orders other suppliers turn down.
            </p>
            <div className="btn-row" style={{ marginTop: 24 }}>
              <Link className="btn" to="/about/history">Our history</Link>
              <Link className="btn btn--ghost" to="/locations">Our plants</Link>
            </div>
          </div>
          <div className="stat-stack">
            {COMPANY.stats.slice(0, 4).map((s) => (
              <div key={s.label} className="stat-stack__item">
                <strong>{s.value}</strong>
                <span className="mark">{s.label}</span>
              </div>
            ))}
            <p className="mark" style={{ color: 'var(--steel-500)' }}>{COMPANY.statsNote}</p>
          </div>
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

const TIMELINE = [
  { year: '1912', text: `${COMPANY.name} begins in a 6,000 square foot livery stable.` },
  { year: '1994', text: 'The company enters a new era of custom fastener manufacturing for construction.' },
  { year: '2000s', text: 'A hot-dip galvanizing line is added so coating happens in-house.' },
  { year: 'Later', text: 'Southeast and Northeast plants and Ferrowright Tensioning extend the reach coast to coast.' },
  { year: 'Today', text: `${COMPANY.sqft} sq ft across four facilities, shipping to ${COMPANY.stats[3].value} countries.` },
]

export function History() {
  return (
    <>
      <PageHero
        title="History"
        eyebrow="A century of bolts"
        trail={[{ label: 'About', to: '/about' }, { label: 'History' }]}
        lede="From a humble livery stable to the largest anchor bolt maker on the continent."
      />
      <section className="section">
        <div className="wrap">
          <ol className="timeline">
            {TIMELINE.map((t) => (
              <li key={t.year}>
                <span className="timeline__year">{t.year}</span>
                <p>{t.text}</p>
              </li>
            ))}
          </ol>
          <p className="field-hint" style={{ marginTop: 32 }}>Timeline entries between 1912 and today are condensed.</p>
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

export function Projects() {
  return (
    <>
      <PageHero
        title="Projects"
        eyebrow="Case files"
        trail={[{ label: 'About', to: '/about' }, { label: 'Projects' }]}
        lede="Bridges, stadiums, power plants, piers and plants. The places our bolts are quietly holding things up."
      />
      <section className="section">
        <div className="wrap">
          <div className="project-grid">
            {PROJECTS.map((p) => (
              <article key={p.slug} className="card card--reg project-card" style={{ cursor: 'default' }}>
                <ProjectArt kind={p.kind} />
                <span className="mark">{p.code}</span>
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

export function NotFound() {
  return (
    <>
      <PageHero title="Off the drawing" eyebrow="404" lede="That page isn’t in the catalog. Try the products, tools or a call to the plant." />
      <section className="section">
        <div className="wrap btn-row">
          <Link className="btn" to="/products">Browse products</Link>
          <Link className="btn btn--ghost" to="/technical">Tools & info</Link>
          <Glyph kind="hexBolt" className="notfound-glyph" />
        </div>
      </section>
    </>
  )
}
