import { useEffect, type ReactNode } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { COMPANY } from '../data/site'
import { useTitle } from '../lib/useTitle'
import { Footer } from './Footer'
import { Header } from './Header'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav className="crumbs mark" aria-label="Breadcrumb">
      <ol>
        <li><Link to="/">Home</Link></li>
        {trail.map((c, i) => (
          <li key={c.label} aria-current={i === trail.length - 1 ? 'page' : undefined}>
            {c.to ? <Link to={c.to}>{c.label}</Link> : c.label}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function PageHero({
  title,
  eyebrow,
  lede,
  trail,
  children,
  aside,
}: {
  title: string
  eyebrow?: string
  lede?: string
  trail?: Crumb[]
  children?: ReactNode
  aside?: ReactNode
}) {
  useTitle(title)
  return (
    <section className="page-hero on-dark grid-bg">
      <div className="wrap page-hero__inner">
        <div>
          {trail && <Breadcrumbs trail={trail} />}
          {eyebrow && <span className="eyebrow mark">{eyebrow}</span>}
          <h1>{title}</h1>
          {lede && <p className="lede">{lede}</p>}
          {children}
        </div>
        {aside && <div className="page-hero__aside">{aside}</div>}
      </div>
      <div className="thread-rule" />
    </section>
  )
}

export function SectionHead({
  eyebrow,
  title,
  children,
  split = false,
}: {
  eyebrow?: string
  title: string
  children?: ReactNode
  split?: boolean
}) {
  return (
    <div className={`section-head ${split ? 'section-head--split' : ''}`}>
      <div>
        {eyebrow && <span className="eyebrow mark">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {children && <div>{children}</div>}
    </div>
  )
}

export function QuoteBand({ title = 'Need it made to print?', text }: { title?: string; text?: string }) {
  return (
    <section className="quote-band on-dark">
      <div className="wrap quote-band__inner">
        <div>
          <h2>{title}</h2>
          <p className="lede">
            {text ?? 'Send a sketch or a drawing. Estimators reply within the business day, and rush work is what the East and West Coast plants are built for.'}
          </p>
        </div>
        <div className="btn-row">
          <Link className="btn" to="/quick-quote">Request a quote</Link>
          <a className="btn btn--ghost" href={COMPANY.phoneHref}>{COMPANY.phone}</a>
        </div>
      </div>
    </section>
  )
}
