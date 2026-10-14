import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHero } from '../components/Page'
import { COMPANY } from '../data/site'

interface TallyLine {
  qty: number
  text: string
  lbs: number
}

function loadLines(): TallyLine[] {
  try {
    const raw = sessionStorage.getItem('fw-quote-items')
    return raw ? (JSON.parse(raw) as TallyLine[]) : []
  } catch {
    return []
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Quote({ mode = 'quote' }: { mode?: 'quote' | 'contact' }) {
  const [params] = useSearchParams()
  const [lines] = useState(loadLines)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [v, setV] = useState({
    name: '', company: '', email: '', phone: '', needBy: '',
    details: params.get('item') ? `${params.get('item')}: ` : '',
  })
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((s) => ({ ...s, [k]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (!v.name.trim()) err.name = 'Tell us who to reply to.'
    if (!EMAIL.test(v.email)) err.email = 'Enter a valid email address.'
    if (!v.details.trim() && lines.length === 0) err.details = 'Describe what you need, or add items with the bolt weight calculator.'
    setErrors(err)
    if (Object.keys(err).length === 0) setSent(true)
  }

  const title = mode === 'quote' ? 'Request a quote' : 'Email us'

  return (
    <>
      <PageHero
        title={title}
        eyebrow={mode === 'quote' ? 'Estimators reply within the business day' : 'Questions, drawings, anything'}
        trail={[{ label: title }]}
        lede="A dimensioned sketch is enough: diameter, length, thread, head or bend, grade and finish. If you only know the application, describe it."
      />
      <section className="section">
        <div className="wrap quote-layout">
          {sent ? (
            <div className="card quote-sent" role="status">
              <h2>Thanks, {v.name.split(' ')[0]}.</h2>
              <p>
                This is a design concept, so nothing was actually sent. In production this form would reach an estimator, who would reply to <strong>{v.email}</strong> within the business day.
              </p>
              <div className="btn-row">
                <Link className="btn" to="/products">Keep browsing</Link>
                <a className="btn btn--ghost" href={COMPANY.phoneHref}>Or call {COMPANY.phone}</a>
              </div>
            </div>
          ) : (
            <form className="card quote-form" onSubmit={submit} noValidate>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="q-name">Name</label>
                  <input id="q-name" className="input" value={v.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name || undefined} />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="field">
                  <label htmlFor="q-company">Company</label>
                  <input id="q-company" className="input" value={v.company} onChange={set('company')} autoComplete="organization" />
                </div>
                <div className="field">
                  <label htmlFor="q-email">Email</label>
                  <input id="q-email" className="input" type="email" value={v.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email || undefined} />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="field">
                  <label htmlFor="q-phone">Phone</label>
                  <input id="q-phone" className="input" type="tel" value={v.phone} onChange={set('phone')} autoComplete="tel" />
                </div>
                {mode === 'quote' && (
                  <div className="field">
                    <label htmlFor="q-need">Needed by</label>
                    <input id="q-need" className="input" type="date" value={v.needBy} onChange={set('needBy')} />
                  </div>
                )}
              </div>

              <div className="field" style={{ marginTop: 20 }}>
                <label htmlFor="q-details">{mode === 'quote' ? 'What do you need?' : 'Message'}</label>
                <textarea id="q-details" className="textarea" rows={6} value={v.details} onChange={set('details')} aria-invalid={!!errors.details || undefined}
                  placeholder="1-1/2 x 36 F1554 Gr 55 anchor bolts, 8 of thread, hot-dip galvanized, qty 40…" />
                {errors.details && <span className="field-error">{errors.details}</span>}
              </div>

              {lines.length > 0 && (
                <div className="quote-lines">
                  <h3>From your calculator tally</h3>
                  <ul>
                    {lines.map((l, i) => (
                      <li key={i}><strong>{l.qty}×</strong> {l.text} <span className="mark">{l.lbs} lbs</span></li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="btn-row" style={{ marginTop: 28 }}>
                <button type="submit" className="btn">{mode === 'quote' ? 'Send request' : 'Send message'}</button>
                <span className="field-hint">Or call <a href={COMPANY.phoneHref}>{COMPANY.phone}</a></span>
              </div>
            </form>
          )}

          <aside className="quote-aside">
            <div className="card">
              <h3>Helpful to include</h3>
              <ul className="dot-list">
                <li>Diameter and overall length</li>
                <li>Thread length and type</li>
                <li>Head style or bend, with a sketch</li>
                <li>Grade or specification</li>
                <li>Plain or galvanized</li>
                <li>Quantity and needed-by date</li>
              </ul>
            </div>
            <div className="card">
              <h3>Rush work</h3>
              <p>East and West Coast plants specialise in emergency orders. Mention the date and we will tell you honestly whether we can make it.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
