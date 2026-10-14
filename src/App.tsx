import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Page'
import { AnchorBoltsPage, CategoryPage, ProductPage, ProductsIndex } from './pages/Catalog'
import {
  About,
  History,
  IndustriesIndex,
  IndustryPage,
  LocationPage,
  LocationsIndex,
  ManufacturingIndex,
  ManufacturingPage,
  NotFound,
  Projects,
} from './pages/Content'
import Home from './pages/Home'
import Quote from './pages/Quote'
import { ChartRouter, FaqPage, TechnicalHub, ToolsIndex } from './pages/Technical'

// Calculators are the heaviest screens, so they load on demand.
const BoltWeight = lazy(() => import('./pages/tools/BoltWeight'))
const TieRod = lazy(() => import('./pages/tools/TieRod'))
const PlateWeight = lazy(() => import('./pages/tools/PlateWeight'))

const Loading = () => <div className="wrap" style={{ padding: '120px 0' }} role="status">Loading calculator…</div>

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="products" element={<ProductsIndex />} />
          <Route path="products/:category" element={<CategoryPage />} />
          <Route path="products/:category/:slug" element={<ProductPage />} />
          <Route path="anchor-bolts" element={<AnchorBoltsPage />} />

          <Route path="technical" element={<TechnicalHub />} />
          <Route path="technical/tools" element={<ToolsIndex />} />
          <Route path="technical/tools/bolt-weight-calculator" element={<BoltWeight />} />
          <Route path="technical/tools/tie-rod-calculator" element={<TieRod />} />
          <Route path="technical/tools/plate-weight-calculator" element={<PlateWeight />} />
          <Route path="technical/faqs" element={<FaqPage />} />
          <Route path="technical/:chart" element={<ChartRouter />} />

          <Route path="about" element={<About />} />
          <Route path="about/history" element={<History />} />
          <Route path="about/projects" element={<Projects />} />
          <Route path="about/contact" element={<Quote mode="contact" />} />
          <Route path="about/industries" element={<IndustriesIndex />} />
          <Route path="about/industries/:slug" element={<IndustryPage />} />
          <Route path="about/manufacturing" element={<ManufacturingIndex />} />
          <Route path="about/manufacturing/:slug" element={<ManufacturingPage />} />

          <Route path="locations" element={<LocationsIndex />} />
          <Route path="locations/:slug" element={<LocationPage />} />

          <Route path="quick-quote" element={<Quote />} />
          <Route path="email-us" element={<Quote mode="contact" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
