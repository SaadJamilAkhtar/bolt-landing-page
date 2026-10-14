import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CATALOG } from '../data/catalog'
import { COMPANY, INDUSTRIES, LOCATIONS, MANUFACTURING } from '../data/site'
import { Brand } from './Logo'

type MenuId = 'products' | 'manufacturing' | 'industries' | 'tools' | 'locations' | 'about'

const TOOL_LINKS = [
  { to: '/technical/tools/bolt-weight-calculator', label: 'Bolt Weight Calculator', sub: 'Bolts, nuts and washers' },
  { to: '/technical/tools/tie-rod-calculator', label: 'Tie Rod Calculator', sub: 'Rod length from pin-to-pin' },
  { to: '/technical/tools/plate-weight-calculator', label: 'Plate Weight Calculator', sub: 'Square and round plate' },
]
const CHART_LINKS = [
  { to: '/technical/bolt-torque-chart', label: 'Bolt Torque Chart' },
  { to: '/technical/thread-pitch-chart', label: 'Thread Pitch Chart' },
  { to: '/technical/strength-requirements-by-grade', label: 'Strength by Grade' },
  { to: '/technical/nut-compatibility-chart', label: 'Nut Compatibility' },
  { to: '/technical/structural-bolt-weight-chart', label: 'Structural Bolt Weights' },
  { to: '/technical/nut-weight-chart', label: 'Nut Weights' },
  { to: '/technical/aashto-to-astm-conversions', label: 'AASHTO ↔ ASTM' },
  { to: '/technical/bolt-glossary', label: 'Glossary' },
]
const ABOUT_LINKS = [
  { to: '/about', label: 'About Us', sub: 'Since 1912' },
  { to: '/about/history', label: 'History', sub: 'From a livery stable to four plants' },
  { to: '/about/projects', label: 'Projects', sub: 'Bridges, stadiums, power, marine' },
  { to: '/about/contact', label: 'Contact', sub: 'Phone, email and quotes' },
]

export function Header() {
  const [open, setOpen] = useState<MenuId | null>(null)
  const [mobile, setMobile] = useState(false)
  const location = useLocation()
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setOpen(null)
    setMobile(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null)
        setMobile(false)
      }
    }
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : ''
    if (mobile && headerRef.current) {
      const bottom = headerRef.current.getBoundingClientRect().bottom
      headerRef.current.style.setProperty('--header-bottom', `${Math.max(bottom, 0)}px`)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobile])

  const toggle = (id: MenuId) => setOpen((cur) => (cur === id ? null : id))

  // Render function rather than an inner component, so the button isn't remounted on every state change.
  const trigger = (id: MenuId, label: string) => (
    <button
      type="button"
      className="nav-link"
      aria-expanded={open === id}
      aria-controls={`menu-${id}`}
      onClick={() => toggle(id)}
    >
      {label}
      <svg className="chev" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </button>
  )

  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <div className="utility">
        <div className="wrap">
          <span className="utility__status">
            <i className="utility__dot" /> East &amp; West Coast plants running rush work
          </span>
          <span className="utility__links">
            <Link to="/email-us">Email us</Link>
            <Link to="/quick-quote">Get a quote</Link>
            <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
          </span>
        </div>
      </div>

      <header className="site-header" ref={headerRef}>
        <div className="wrap">
          <Link to="/" className="brand" aria-label={`${COMPANY.name} home`}>
            <Brand />
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={mobile}
            aria-controls="primary-nav"
            aria-label="Menu"
            onClick={() => setMobile((m) => !m)}
          >
            <span />
          </button>

          <nav id="primary-nav" className={`primary-nav ${mobile ? 'open' : ''}`} aria-label="Primary">
            <ul>
              <li className="has-menu">
                {trigger('products', 'Products')}
                <div id="menu-products" className={`menu-panel ${open === 'products' ? 'open' : ''}`}>
                  <div className="wrap">
                    <div className="mega-cols">
                      {CATALOG.map((c) => (
                        <div className="mega-col" key={c.slug}>
                          <h4><Link to={`/products/${c.slug}`}>{c.name}</Link></h4>
                          <ul>
                            {c.items.slice(0, 7).map((p) => (
                              <li key={p.slug}><Link to={`/products/${c.slug}/${p.slug}`}>{p.name}</Link></li>
                            ))}
                            {c.items.length > 7 && (
                              <li><Link to={`/products/${c.slug}`}>+ {c.items.length - 7} more</Link></li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </li>

              <li className="has-menu">
                {trigger('manufacturing', 'Manufacturing')}
                <div id="menu-manufacturing" className={`menu-panel menu-panel--simple ${open === 'manufacturing' ? 'open' : ''}`}>
                  <div className="wrap">
                    {[0, 1, 2].map((col) => (
                      <ul className="menu-list" key={col}>
                        {MANUFACTURING.filter((_, i) => i % 3 === col).map((m) => (
                          <li key={m.slug}><Link to={`/about/manufacturing/${m.slug}`}>{m.name}</Link></li>
                        ))}
                      </ul>
                    ))}
                  </div>
                </div>
              </li>

              <li className="has-menu">
                {trigger('industries', 'Industries')}
                <div id="menu-industries" className={`menu-panel menu-panel--simple ${open === 'industries' ? 'open' : ''}`}>
                  <div className="wrap">
                    {[0, 1, 2].map((col) => (
                      <ul className="menu-list" key={col}>
                        {INDUSTRIES.filter((_, i) => i % 3 === col).map((ind) => (
                          <li key={ind.slug}><Link to={`/about/industries/${ind.slug}`}>{ind.name}</Link></li>
                        ))}
                      </ul>
                    ))}
                  </div>
                </div>
              </li>

              <li className="has-menu">
                {trigger('tools', 'Tools & Info')}
                <div id="menu-tools" className={`menu-panel menu-panel--simple ${open === 'tools' ? 'open' : ''}`}>
                  <div className="wrap">
                    <ul className="menu-list">
                      {TOOL_LINKS.map((t) => (
                        <li key={t.to}><Link to={t.to}>{t.label}<small>{t.sub}</small></Link></li>
                      ))}
                    </ul>
                    <ul className="menu-list">
                      {CHART_LINKS.map((t) => (
                        <li key={t.to}><Link to={t.to}>{t.label}</Link></li>
                      ))}
                    </ul>
                    <div className="menu-aside">
                      <h4 style={{ color: 'var(--white)' }}>Tools &amp; Info</h4>
                      <p>Calculators, charts, specifications and a database of construction fastener FAQs.</p>
                      <Link className="arrow-link" style={{ color: 'var(--forge-500)' }} to="/technical">Open the toolbox</Link>
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <NavLink className="nav-link" to="/technical/faqs">FAQs</NavLink>
              </li>

              <li className="has-menu">
                {trigger('locations', 'Locations')}
                <div id="menu-locations" className={`menu-panel menu-panel--simple ${open === 'locations' ? 'open' : ''}`}>
                  <div className="wrap">
                    <ul className="menu-list">
                      {LOCATIONS.map((l) => (
                        <li key={l.slug}><Link to={`/locations/${l.slug}`}>{l.name}<small>{l.city}, {l.state}</small></Link></li>
                      ))}
                    </ul>
                    <div />
                    <div className="menu-aside">
                      <h4 style={{ color: 'var(--white)' }}>Four plants, one phone number</h4>
                      <p>{COMPANY.phone}. Calls route to whichever plant can ship fastest.</p>
                      <Link className="arrow-link" style={{ color: 'var(--forge-500)' }} to="/locations">All locations</Link>
                    </div>
                  </div>
                </div>
              </li>

              <li className="has-menu">
                {trigger('about', 'About')}
                <div id="menu-about" className={`menu-panel menu-panel--simple ${open === 'about' ? 'open' : ''}`}>
                  <div className="wrap">
                    <ul className="menu-list">
                      {ABOUT_LINKS.map((a) => (
                        <li key={a.to}><Link to={a.to}>{a.label}<small>{a.sub}</small></Link></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
            <Link to="/quick-quote" className="btn btn--sm nav-cta">Get a quote</Link>
          </nav>
        </div>
      </header>
    </>
  )
}
