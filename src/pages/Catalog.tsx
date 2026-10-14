import { Link, Navigate, useParams } from 'react-router-dom'
import { Glyph } from '../components/Glyph'
import { HeroDrawing } from '../components/HomeArt'
import { PageHero, QuoteBand, SectionHead } from '../components/Page'
import { CATALOG, FINISHES, categoryBySlug, productBySlug, type Product } from '../data/catalog'

const TOOL_LINK = {
  bolt: { to: '/technical/tools/bolt-weight-calculator', label: 'Bolt weight calculator' },
  tie: { to: '/technical/tools/tie-rod-calculator', label: 'Tie rod calculator' },
  plate: { to: '/technical/tools/plate-weight-calculator', label: 'Plate weight calculator' },
}

const QUOTE_CHECKLIST: Record<string, string[]> = {
  bolts: ['Diameter and overall length', 'Thread length and type (cut or rolled)', 'Head style', 'Grade or specification', 'Finish: plain or galvanized', 'Quantity and required ship date'],
  rods: ['Diameter and overall length', 'Thread length at each end (or full thread)', 'Grade or specification', 'Finish: plain or galvanized', 'Nuts and washers to include', 'Quantity and required ship date'],
  bent: ['Diameter and the two leg lengths', 'Bend radius or a dimensioned sketch', 'Thread length and end', 'Grade (F1554 36 / 55 / 105 is typical)', 'Finish: plain or galvanized', 'Quantity and required ship date'],
  nuts: ['Diameter and thread series', 'Nut style', 'Grade to match the bolt', 'Finish: plain or galvanized (overtapped)', 'Quantity and required ship date'],
  washers: ['Bolt or rod diameter', 'Washer style and specification', 'Outside diameter and thickness, if non-standard', 'Finish: plain or galvanized', 'Quantity and required ship date'],
  others: ['A dimensioned sketch or drawing', 'Material and grade', 'Finish: plain or galvanized', 'Quantity and required ship date'],
}

function ProductTile({ cat, p }: { cat: string; p: Product }) {
  return (
    <Link to={`/products/${cat}/${p.slug}`} className="card card--reg product-tile">
      <Glyph kind={p.glyph} className="product-tile__glyph" />
      <h3>{p.name}</h3>
      <p>{p.blurb}</p>
    </Link>
  )
}

export function ProductsIndex() {
  return (
    <>
      <PageHero
        title="Products"
        eyebrow="Catalog"
        trail={[{ label: 'Products' }]}
        lede="Six families covering the headed, threaded, bent and plated hardware behind construction fastening. If it isn’t listed, it can usually be made."
      />
      <section className="section">
        <div className="wrap">
          {CATALOG.map((c, i) => (
            <div key={c.slug} className="catalog-block">
              <div className="catalog-block__head">
                <span className="mark catalog-block__no">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2><Link to={`/products/${c.slug}`}>{c.name}</Link></h2>
                  <p className="mark">{c.range}</p>
                </div>
                <Link className="arrow-link" to={`/products/${c.slug}`}>All {c.items.length}</Link>
              </div>
              <div className="product-grid product-grid--compact">
                {c.items.map((p) => (
                  <Link key={p.slug} to={`/products/${c.slug}/${p.slug}`} className="product-chip">
                    <Glyph kind={p.glyph} className="product-chip__glyph" />
                    <span>{p.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

export function CategoryPage() {
  const { category } = useParams()
  const cat = categoryBySlug(category)
  if (!cat) return <Navigate to="/products" replace />
  return (
    <>
      <PageHero
        title={cat.name}
        eyebrow={cat.range}
        trail={[{ label: 'Products', to: '/products' }, { label: cat.name }]}
        lede={cat.tagline}
        aside={<Glyph kind={cat.glyph} className="page-hero__glyph" />}
      />
      <section className="section">
        <div className="wrap">
          <p className="lede" style={{ marginBottom: 48 }}>{cat.intro}</p>
          <div className="product-grid">
            {cat.items.map((p) => (
              <ProductTile key={p.slug} cat={cat.slug} p={p} />
            ))}
          </div>
        </div>
      </section>
      <section className="section section--white">
        <div className="wrap finishes">
          <SectionHead eyebrow="Finishes" title="Plain or galvanized" />
          <div className="finishes__grid">
            {FINISHES.map((f) => (
              <div key={f.name} className="card">
                <h3>{f.name}</h3>
                <p>{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

export function ProductPage() {
  const { category, slug } = useParams()
  const cat = categoryBySlug(category)
  const product = productBySlug(category, slug)
  if (!cat || !product) return <Navigate to="/products" replace />
  const siblings = cat.items.filter((p) => p.slug !== product.slug)
  const tool = product.tool ? TOOL_LINK[product.tool] : null

  return (
    <>
      <PageHero
        title={product.name}
        eyebrow={cat.name}
        trail={[{ label: 'Products', to: '/products' }, { label: cat.name, to: `/products/${cat.slug}` }, { label: product.name }]}
        lede={product.blurb}
      >
        <div className="btn-row">
          <Link className="btn" to={`/quick-quote?item=${encodeURIComponent(product.name)}`}>Quote {product.name.toLowerCase()}</Link>
          {tool && <Link className="btn btn--ghost" to={tool.to}>{tool.label}</Link>}
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap product-detail">
          <figure className="product-detail__figure card card--reg grid-bg-light">
            <Glyph kind={product.glyph} className="product-detail__glyph" label={`${product.name} drawing`} />
            <figcaption className="mark">Illustration · not to scale</figcaption>
          </figure>

          <div className="product-detail__body">
            <h2>Specifications</h2>
            {product.standards ? (
              <ul className="tag-list">
                {product.standards.map((s) => (
                  <li key={s} className="tag tag--forge">{s}</li>
                ))}
              </ul>
            ) : (
              <p>Made to your drawing or the governing project specification. Tell us the grade and we will confirm availability.</p>
            )}
            {product.note && <div className="note" style={{ marginTop: 24 }}><p>{product.note}</p></div>}

            <h2 style={{ marginTop: 40 }}>Range</h2>
            <p>{cat.range}. Larger sizes and unusual lengths are quoted on request.</p>

            <h2 style={{ marginTop: 40 }}>Finishes</h2>
            <ul className="finish-list">
              {FINISHES.map((f) => (
                <li key={f.name}><strong>{f.name}.</strong> {f.detail}</li>
              ))}
            </ul>
          </div>

          <aside className="product-detail__quote card">
            <h3>What to send for a quote</h3>
            <ul className="checklist">
              {(QUOTE_CHECKLIST[cat.slug] ?? QUOTE_CHECKLIST.others).map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <Link className="btn btn--sm" to={`/quick-quote?item=${encodeURIComponent(product.name)}`}>Start a quote</Link>
          </aside>
        </div>
      </section>

      <section className="section section--white">
        <div className="wrap">
          <SectionHead eyebrow={cat.name} title={`Also in ${cat.name.toLowerCase()}`} />
          <div className="product-grid product-grid--compact">
            {siblings.slice(0, 12).map((p) => (
              <Link key={p.slug} to={`/products/${cat.slug}/${p.slug}`} className="product-chip">
                <Glyph kind={p.glyph} className="product-chip__glyph" />
                <span>{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

const F1554 = [
  { grade: '36', yield: '36', tensile: '58 – 80', elong: '23', note: 'Most common; weldable' },
  { grade: '55', yield: '55', tensile: '75 – 95', elong: '21', note: 'Weldable with supplementary requirement S1' },
  { grade: '105', yield: '105', tensile: '125 – 150', elong: '15', note: 'High strength; heavy hex nuts' },
]

export function AnchorBoltsPage() {
  return (
    <>
      <PageHero
        title="Anchor Bolts"
        eyebrow="Our specialty"
        trail={[{ label: 'Anchor Bolts' }]}
        lede="The connection between a steel structure and its foundation. Straight rods, L-bolts, J-bolts and headed bolts, threaded, bent and galvanized to your anchor bolt plan."
      >
        <div className="btn-row">
          <Link className="btn" to="/quick-quote?item=Anchor%20bolts">Quote anchor bolts</Link>
          <Link className="btn btn--ghost" to="/technical/tools/bolt-weight-calculator">Weigh a set</Link>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Anatomy" title="What the drawing is asking for" split>
            <p className="lede">Four dimensions and a grade define almost every anchor bolt: projection, embedment, thread length and the hook or head that locks it into the concrete.</p>
          </SectionHead>
          <div className="anatomy on-dark grid-bg">
            <HeroDrawing />
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="wrap">
          <SectionHead eyebrow="Styles" title="Pick the embedded end" />
          <div className="product-grid">
            {[
              { cat: 'bent', slug: 'anchor-bolts' },
              { cat: 'bent', slug: 'j-bolts' },
              { cat: 'bolts', slug: 'headed-anchor' },
              { cat: 'rods', slug: 'anchor-rods' },
            ].map(({ cat, slug }) => {
              const p = productBySlug(cat, slug)!
              return <ProductTile key={slug} cat={cat} p={p} />
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="ASTM F1554" title="Three grades, by yield strength" />
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr><th>Grade</th><th className="num">Min yield (ksi)</th><th className="num">Tensile (ksi)</th><th className="num">Min elongation (%)</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {F1554.map((g) => (
                  <tr key={g.grade}>
                    <th scope="row">Grade {g.grade}</th>
                    <td className="num">{g.yield}</td>
                    <td className="num">{g.tensile}</td>
                    <td className="num">{g.elong}</td>
                    <td>{g.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="field-hint" style={{ marginTop: 12 }}>Confirm figures against the current edition of ASTM F1554 and the project specification before ordering.</p>
        </div>
      </section>
      <QuoteBand />
    </>
  )
}
