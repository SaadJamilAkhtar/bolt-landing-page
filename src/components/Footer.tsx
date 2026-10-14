import { Link } from 'react-router-dom'
import { CATALOG } from '../data/catalog'
import { COMPANY, LOCATIONS } from '../data/site'
import { Brand } from './Logo'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="thread-rule" />
      <div className="wrap footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand" aria-label={`${COMPANY.name} home`}>
            <Brand />
          </Link>
          <p style={{ maxWidth: '38ch' }}>
            Anchor bolts and nonstandard construction fasteners, manufactured and galvanized in America since {COMPANY.founded}.
          </p>
          <a className="footer-phone" href={COMPANY.phoneHref}>{COMPANY.phone}</a>
          <div className="mark" style={{ color: 'var(--steel-500)' }}>Mon–Fri · quotes within the business day</div>
        </div>

        <div>
          <h4>Products</h4>
          <ul>
            {CATALOG.map((c) => (
              <li key={c.slug}><Link to={`/products/${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Tools</h4>
          <ul>
            <li><Link to="/technical/tools/bolt-weight-calculator">Bolt weight</Link></li>
            <li><Link to="/technical/tools/tie-rod-calculator">Tie rod length</Link></li>
            <li><Link to="/technical/tools/plate-weight-calculator">Plate weight</Link></li>
            <li><Link to="/technical/bolt-torque-chart">Torque chart</Link></li>
            <li><Link to="/technical/faqs">FAQs</Link></li>
          </ul>
        </div>

        <div>
          <h4>Locations</h4>
          <ul>
            {LOCATIONS.map((l) => (
              <li key={l.slug}><Link to={`/locations/${l.slug}`}>{l.city}, {l.state}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-fine">
        <div className="wrap mark">
          <span>© {YEAR} {COMPANY.name} · concept design, placeholder content</span>
          <span>Calculator figures are estimates and not certified values.</span>
        </div>
      </div>
    </footer>
  )
}
