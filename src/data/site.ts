/** Company facts, industries, locations, projects. Placeholder brand and contact details; company facts are illustrative. */

export const COMPANY = {
  name: 'Ferrowright',
  lockup: ['Ferro', 'Wright'] as const,
  founded: 1912,
  phone: '(800) 555-0142',
  phoneHref: 'tel:8005550142',
  sqft: '270,000',
  stats: [
    { value: '10,129', label: 'Sales orders' },
    { value: '561', label: 'Rush orders processed' },
    { value: '7.09M', label: 'Pounds shipped' },
    { value: '28', label: 'Countries served' },
    { value: '137K', label: 'Sq ft flagship plant' },
  ],
  statsNote: 'Based on 2024 data from the Portland, OR plant',
}

export interface Industry {
  slug: string
  name: string
  blurb: string
  uses: string[]
}

export const INDUSTRIES: Industry[] = [
  { slug: 'data-centers', name: 'Data Centers', blurb: 'Anchor bolts, structural fasteners and custom hardware for hyperscale builds, with domestic manufacture and complete certification paperwork on every shipment.', uses: ['Anchor rods for equipment pads', 'Structural bolts', 'Seismic bracing hardware'] },
  { slug: 'marine', name: 'Marine Construction', blurb: 'Galvanized and stainless fasteners for piers, docks, bulkheads and fender systems, with a large galvanized inventory ready to ship.', uses: ['Float rods', 'Timber bolts', 'Bollard anchor bolts'] },
  { slug: 'steel-fabrication', name: 'Steel Fabrication', blurb: 'Anchor bolts, tie rod assemblies and structural bolts made for shops that need exact quantities and tight schedules.', uses: ['Column anchor bolts', 'Tie rod assemblies', 'Structural bolt sets'] },
  { slug: 'highway', name: 'Highway Construction', blurb: 'Domestic bolts, concrete barrier connecting pins and anchor bolts for state DOT and federal-aid projects.', uses: ['Barrier connecting pins', 'Sign and signal anchor bolts', 'Guardrail hardware'] },
  { slug: 'timber', name: 'Timber Construction', blurb: 'Non-standard bolts made for heavy timber: long, square-headed, galvanized, and sized to the framing.', uses: ['Timber bolts', 'Drift pins', 'Plate and ogee washers'] },
  { slug: 'power-and-energy', name: 'Power & Energy', blurb: 'Anchor bolt take-offs, shop drawings and on-schedule delivery for substations, transmission and generation projects.', uses: ['Transmission foundation bolts', 'Substation anchor bolts', 'Turbine hardware'] },
  { slug: 'concrete', name: 'Concrete', blurb: 'Embedded hardware for precast, tilt-up and cast-in-place work: anchor bolts, rods, sleeves and plates.', uses: ['Cast-in anchor bolts', 'Threaded rebar', 'Anchor sleeves'] },
  { slug: 'light-pole-and-traffic-signal', name: 'Light Pole & Traffic Signal', blurb: 'Bent anchor bolts and template-matched sets for light standards and signal poles.', uses: ['Pole anchor bolts', 'Templates and nuts', 'Galvanized sets'] },
  { slug: 'pole-line', name: 'Pole Line', blurb: 'Hardware for utility distribution: through-bolts, step bolts and double-arming bolts.', uses: ['Step bolts', 'Through bolts', 'Eye bolts'] },
  { slug: 'light-rail', name: 'Light Rail', blurb: 'Fasteners for transit guideway, stations and catenary support, to project-specific materials requirements.', uses: ['Catenary anchor bolts', 'Station steel', 'Track hardware'] },
  { slug: 'mining', name: 'Mining', blurb: 'Heavy fasteners for crushers, conveyors and structural steel in abrasive, high-load service.', uses: ['Large-diameter bolts', 'Liner bolts', 'Foundation anchors'] },
  { slug: 'oem', name: 'OEM', blurb: 'Custom headed and bent fasteners made repeatably for equipment manufacturers.', uses: ['Custom headings', 'Special bends', 'Blanket orders'] },
  { slug: 'engineers-and-architects', name: 'Engineers & Architects', blurb: 'Specification support, standards cross-references and the technical tools used to detail a connection.', uses: ['Spec review', 'Grade selection', 'Submittals'] },
  { slug: 'government-and-military', name: 'Government & Military', blurb: 'Domestic, certified fasteners for federal and military projects with full material traceability.', uses: ['Domestic-content hardware', 'Certified lots', 'Buy American support'] },
]

export interface Location {
  slug: string
  name: string
  city: string
  state: string
  role: string
  detail: string
  /** Rough lon/lat for the schematic map. */
  lon: number
  lat: number
}

export const LOCATIONS: Location[] = [
  { slug: 'ferrowright-northwest', name: 'Ferrowright Northwest', city: 'Portland', state: 'OR', role: 'Flagship', detail: 'The 137,000 sq ft home plant: hot forging, threading, bending, plate fabrication and a hot-dip galvanizing line, all under one roof.', lon: -122.68, lat: 45.52 },
  { slug: 'ferrowright-southeast', name: 'Ferrowright Southeast', city: 'North Augusta', state: 'SC', role: 'Southeast plant', detail: 'Expanded Southeast manufacturing and distribution, putting stocked fasteners and rush capability on the East Coast.', lon: -81.97, lat: 33.5 },
  { slug: 'ferrowright-northeast', name: 'Ferrowright Northeast', city: 'Jordan', state: 'NY', role: 'Northeast plant', detail: 'Northeast production and distribution serving New York, New England and the Mid-Atlantic.', lon: -76.47, lat: 43.07 },
  { slug: 'ferrowright-charlotte', name: 'Ferrowright Charlotte', city: 'Charlotte', state: 'NC', role: 'Distribution', detail: 'A Carolinas distribution point for stocked fasteners.', lon: -80.84, lat: 35.23 },
  { slug: 'ferrowright-tensioning', name: 'Ferrowright Tensioning', city: 'Bellows Falls', state: 'VT', role: 'Bolting technology', detail: 'Our sister operation, specialising in direct tension indicating (DTI) washers and bolt tensioning technology.', lon: -72.44, lat: 43.13 },
]

export interface Project {
  slug: string
  code: string
  name: string
  blurb: string
  kind: 'bridge' | 'marine' | 'stadium' | 'power' | 'industrial' | 'covered'
}

export const PROJECTS: Project[] = [
  { slug: 'covered-bridges', code: 'PRJ-01', name: 'Covered Bridges', kind: 'covered', blurb: 'Galvanized hex, square and timber bolts, tie rod assemblies and plates for restored and new covered bridges.' },
  { slug: 'marine', code: 'PRJ-02', name: 'Marine', kind: 'marine', blurb: 'Float rods, timber bolts, hex bolts, plates and bollard anchor bolts for waterfront work around the world.' },
  { slug: 'stadiums', code: 'PRJ-03', name: 'Stadiums', kind: 'stadium', blurb: 'Fasteners for retractable roofs, plus anchor bolts for columns, scoreboards and field lighting.' },
  { slug: 'power-and-energy', code: 'PRJ-04', name: 'Power & Energy', kind: 'power', blurb: 'Anchor bolt take-offs, shop drawings and on-schedule delivery for generation and transmission.' },
  { slug: 'industrial', code: 'PRJ-05', name: 'Industrial', kind: 'industrial', blurb: 'From ethanol plants to copper mines and refineries to dams: anchor bolts that keep tight schedules on track.' },
  { slug: 'bridges', code: 'PRJ-06', name: 'Bridges', kind: 'bridge', blurb: 'A hot-dip galvanizing line and domestically certified bolts mean DOT-approved product across North America.' },
]

export interface Faq {
  q: string
  a: string
  tag: string
}

export const FAQS: Faq[] = [
  { tag: 'Threads', q: 'What is the difference between rolled and cut threads?', a: 'Cut threads are machined out of full-diameter stock, so the thread root is smaller than the shank. Rolled threads are formed by displacing material, which work-hardens the thread and gives a smooth, strong profile; the bar is usually drawn down to about the pitch diameter first. Cut thread is the default for large diameters and for anchor rods. Rolled thread is common in smaller sizes and where fatigue matters.' },
  { tag: 'Galvanizing', q: 'Why are galvanized nuts tapped oversize?', a: 'Hot-dip galvanizing deposits a layer of zinc on external threads. If the nut were tapped to the standard size it would not run onto the coated bolt. Galvanized nuts are therefore overtapped by an allowance so the assembled thread fit still works after both parts are coated.' },
  { tag: 'Galvanizing', q: 'Can A490 bolts be hot-dip galvanized?', a: 'The usual guidance is no. A490 bolts are very high strength and are susceptible to hydrogen embrittlement, which the galvanizing process can aggravate. If a project needs corrosion protection on A490 bolts, other coatings are used instead.' },
  { tag: 'Anchor bolts', q: 'Which standard governs anchor bolts?', a: 'ASTM F1554 is the standard for anchor bolts in structural connections. It covers three strength grades: 36, 55 and 105 ksi minimum yield. Grade 36 is the most common and the easiest to weld; Grade 105 is the high-strength option.' },
  { tag: 'Anchor bolts', q: 'How much thread should an anchor bolt have?', a: 'The threaded length has to cover the grout, the base plate, the leveling nut and washer if used, the top nut, and still leave at least a couple of threads showing. The detailer\'s anchor bolt plan sets the projection; thread length is that projection plus the portion that must remain adjustable.' },
  { tag: 'Strength', q: 'What is the difference between A307 and A325 bolts?', a: 'A307 is a low-carbon steel bolt with a 60 ksi minimum tensile strength, used where loads are modest. A325 is a heat-treated structural bolt with a 120 ksi minimum tensile strength (for sizes up to 1 inch), used in steel-to-steel connections that may be pretensioned.' },
  { tag: 'Nuts', q: 'When do I need a heavy hex nut?', a: 'Heavy hex nuts are specified for high-strength bolts such as A325, A490 and A193 B7 so that the nut can develop the full strength of the bolt without stripping. They are also common on anchor rods because they are the standard pairing for F1554 Grade 105.' },
  { tag: 'Nuts', q: 'Can I use a plain nut on a galvanized bolt?', a: 'It will run on, but you lose the corrosion protection at the thread and the engagement is not what the standard assumes. Nuts on galvanized bolts should be galvanized and overtapped, then lubricated if the spec calls for it.' },
  { tag: 'Washers', q: 'What is a DTI washer?', a: 'A direct tension indicating washer has small protrusions on one face. As the bolt is tightened the protrusions flatten; measuring the remaining gap with a feeler gauge confirms the bolt has reached the required pretension.' },
  { tag: 'Ordering', q: 'Do you need a drawing to quote a custom bolt?', a: 'A dimensioned sketch is enough: diameter, overall length, thread length and type, head or bend style, grade and finish. If you only know the application, describe it and our estimators will help work out the rest.' },
  { tag: 'Ordering', q: 'Can I get material certifications?', a: 'Yes. Mill test reports can be supplied with domestically produced fasteners, and project-specific certification and testing can be arranged when the specification requires it.' },
  { tag: 'Tools', q: 'How accurate are the weight calculators?', a: 'They are estimators meant for planning shipping and delivery. Actual weights vary with manufacturing tolerances, thread type and coating, so treat the figures as close approximations and not as certified values.' },
]

export interface GlossaryEntry {
  term: string
  def: string
}

export const GLOSSARY: GlossaryEntry[] = [
  { term: 'Across flats', def: 'The distance between two opposite parallel faces of a hex or square head or nut. It sets the wrench size.' },
  { term: 'Anchor bolt', def: 'A bolt or rod embedded in concrete that connects a structure or equipment to its foundation.' },
  { term: 'Bearing surface', def: 'The face of a head or nut that contacts the part being clamped.' },
  { term: 'Clevis', def: 'A U-shaped fitting with a cross pin, used to give a rod a pivoting connection.' },
  { term: 'Cut thread', def: 'A thread machined from full-diameter stock, leaving the shank larger than the thread root.' },
  { term: 'Galvanizing', def: 'Coating steel with zinc, usually by hot dipping, to protect it from corrosion.' },
  { term: 'Grade', def: 'A designation for the mechanical properties of a fastener, set by standards such as ASTM or SAE.' },
  { term: 'Grip', def: 'The thickness of the material a bolt clamps, measured from under the head to the first full thread.' },
  { term: 'Heavy hex', def: 'A hex head or nut with larger across-flats than the regular pattern.' },
  { term: 'Hot forging', def: 'Heating bar stock until it is plastic, then upsetting it in a die to form a head.' },
  { term: 'Jam nut', def: 'A thin nut tightened against another to lock it in position.' },
  { term: 'Pitch', def: 'The distance between adjacent thread crests; for inch threads, 1 divided by threads per inch.' },
  { term: 'Pitch diameter', def: 'The diameter of the imaginary cylinder where the thread width equals the space between threads.' },
  { term: 'Proof load', def: 'The load a bolt must carry without permanent deformation during testing.' },
  { term: 'Rolled thread', def: 'A thread formed by displacing material with hardened dies rather than cutting it away.' },
  { term: 'Swage', def: 'To reduce the diameter of a rod end by forging so a thread can be cut without losing strength.' },
  { term: 'Tensile strength', def: 'The maximum stress a material withstands before it fractures.' },
  { term: 'Turnbuckle', def: 'A threaded fitting with opposite-hand threads that adjusts the tension in a rod when rotated.' },
  { term: 'Yield strength', def: 'The stress at which a material begins to deform permanently.' },
]

export const MANUFACTURING = [
  { slug: 'heading', name: 'Hot Forging & Heading', blurb: 'Large-diameter bar is heated and upset in dies to form hex, square and custom heads.' },
  { slug: 'threading', name: 'Threading', blurb: 'Cut and rolled threads in every pitch series, to the lengths on your drawing.' },
  { slug: 'cutting', name: 'Cutting', blurb: 'Saw and shear cutting of bar and plate to length and blank.' },
  { slug: 'bending', name: 'Bending', blurb: 'Hot and cold bending of anchor bolts, U-bolts, hooks and eyes to your radius.' },
  { slug: 'plate-fabrication', name: 'Plate Fabrication', blurb: 'Cutting, drilling and boring plate washers, base plates and custom plate.' },
  { slug: 'cnc-lathe', name: 'CNC Lathe', blurb: 'Turned parts and special features held to tight tolerances.' },
  { slug: 'galvanizing', name: 'Hot-Dip Galvanizing', blurb: 'An in-house galvanizing line cuts days off lead times and keeps coating quality under our control.' },
  { slug: 'miscellaneous', name: 'Miscellaneous', blurb: 'Welding, assembly and kitting to put complete sets in one box.' },
  { slug: 'shipping', name: 'Shipping', blurb: 'Packaged and palletized for the jobsite, with rush shipping from East and West Coast plants.' },
  { slug: 'certification-testing', name: 'Certification & Testing', blurb: 'Material test reports, mechanical testing and third-party certification on request.' },
  { slug: 'steel', name: 'Steel', blurb: 'Domestic bar and plate stock in the common specifications, held in inventory.' },
]
