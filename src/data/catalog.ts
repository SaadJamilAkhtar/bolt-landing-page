/**
 * Product catalog. Structure mirrors the live site's information architecture
 * (same categories, same product types, same URL slugs). Copy is original.
 */

export type GlyphKind =
  // headed bolts
  | 'hexBolt' | 'heavyHexBolt' | 'structuralBolt' | 'squareBolt' | 'timberBolt' | 'headedAnchor'
  | 'lag' | 'squareLag' | 'carriage' | 'spike' | 'machine' | 'washerHead' | 'roundHead'
  | 'tcBolt' | 'countersunk' | 'stepBolt' | 'customHead' | 'guardrail'
  // rods
  | 'anchorRod' | 'allThread' | 'tieRod' | 'driftPin' | 'swedged' | 'rebar'
  // bent
  | 'lBolt' | 'uRound' | 'uSquare' | 'eyeClosed' | 'eyeOpen' | 'hookRound' | 'hookSquare'
  | 'jBolt' | 'customHook'
  // nuts
  | 'nutHex' | 'nutHeavy' | 'nutSquare' | 'nutJam' | 'nutLock' | 'nutCoupling' | 'nutSleeve'
  | 'nutRecessed'
  // washers
  | 'washerFlat' | 'washerHard' | 'washerLock' | 'washerMalleable' | 'washerRound' | 'washerSquare'
  | 'washerOgee' | 'washerBevel' | 'washerDti' | 'washerRosette' | 'washerHillside' | 'washerClipped'
  // others
  | 'plate' | 'turnbuckle' | 'clevis' | 'barrierPin' | 'sleeve' | 'shearPlate' | 'tool'
  | 'splitRing' | 'boatSpike' | 'spikeGrid'

export interface Product {
  slug: string
  name: string
  glyph: GlyphKind
  blurb: string
  /** Typical governing specifications. */
  standards?: string[]
  /** Anything worth knowing before you order. */
  note?: string
  /** Calculator that applies to this product, if any. */
  tool?: 'bolt' | 'tie' | 'plate'
}

export type CategorySlug = 'bolts' | 'rods' | 'bent' | 'nuts' | 'washers' | 'others'

export interface Category {
  slug: CategorySlug
  name: string
  short: string
  glyph: GlyphKind
  tagline: string
  /** One line of capability, shown on cards and the category header. */
  range: string
  intro: string
  items: Product[]
}

export const FINISHES = [
  { name: 'Plain (black)', detail: 'Mill finish as produced. The default for indoor and painted work.' },
  { name: 'Hot-dip galvanized', detail: 'Zinc coating for outdoor, marine and highway use. Threads on nuts are overtapped to suit.' },
  { name: 'Other coatings', detail: 'Ask us about mechanical galvanizing, zinc plating or stainless alternatives for special service.' },
]

export const CATALOG: Category[] = [
  {
    slug: 'bolts',
    name: 'Headed Bolts',
    short: 'Headed',
    glyph: 'hexBolt',
    tagline: 'Forged heads, cut or rolled threads, any length you can draw.',
    range: '1/2" – 2-1/2" dia. · up to 40 ft long',
    intro:
      'Hot forging lets us form hex, square, round and countersunk heads on large-diameter stock, then thread to your print. Standard patterns ship from stock; anything else is made to order on short lead times.',
    items: [
      { slug: 'hex', name: 'Hex Bolts', glyph: 'hexBolt', blurb: 'The general-purpose bolt: hex head, plain shank, cut or rolled threads, in any grade and length.', standards: ['ASTM A307 Gr A/B', 'ASTM A449', 'SAE J429 Gr 5'], tool: 'bolt' },
      { slug: 'heavy-hex', name: 'Heavy Hex Bolts', glyph: 'heavyHexBolt', blurb: 'A wider head across the flats for more bearing area where the joint is loaded hard.', standards: ['ASTM A449', 'ASTM A354 Gr BD', 'ASTM A193 B7'], tool: 'bolt' },
      { slug: 'structural', name: 'Structural Bolts', glyph: 'structuralBolt', blurb: 'High-strength bolts for steel-to-steel connections, supplied with matching nuts and washers and full certification.', standards: ['ASTM F3125 A325', 'ASTM F3125 A490'], note: 'A490 bolts should not be hot-dip galvanized because of hydrogen-embrittlement risk.', tool: 'bolt' },
      { slug: 'square-head', name: 'Square Head Bolts', glyph: 'squareBolt', blurb: 'A square head that resists turning against timber or a slot, common in heritage and timber work.', standards: ['ASTM A307 Gr A'], tool: 'bolt' },
      { slug: 'timber', name: 'Timber Bolts', glyph: 'timberBolt', blurb: 'Low-profile heads sized for wood connections, made to the lengths timber framing actually needs.', standards: ['ASTM A307 Gr A'], tool: 'bolt' },
      { slug: 'headed-anchor', name: 'Headed Anchor Bolts', glyph: 'headedAnchor', blurb: 'A forged head at the embedded end gives concrete something to bear against. Threaded at the exposed end.', standards: ['ASTM F1554 Gr 36', 'ASTM F1554 Gr 55', 'ASTM F1554 Gr 105'], tool: 'bolt' },
      { slug: 'hex-lag', name: 'Hex Lag Screws', glyph: 'lag', blurb: 'Coarse-threaded screws with a hex head, driven into timber with a wrench rather than nutted.', standards: ['ASME B18.2.1'] },
      { slug: 'square-lag', name: 'Square Lag Screws', glyph: 'squareLag', blurb: 'The square-head version of the lag screw for timber and masonry-anchor applications.', standards: ['ASME B18.2.1'] },
      { slug: 'carriage', name: 'Carriage Bolts', glyph: 'carriage', blurb: 'A domed head over a square neck that bites into wood so the bolt tightens from one side.', standards: ['ASTM A307 Gr A', 'ASME B18.5'], tool: 'bolt' },
      { slug: 'timber-spikes', name: 'Timber Spikes', glyph: 'spike', blurb: 'Heavy drive spikes for railroad, marine and landscape timbers.' },
      { slug: 'machine', name: 'Machine Bolts', glyph: 'machine', blurb: 'Square or hex head bolts used with a nut in machinery, brackets and general assemblies.', standards: ['ASTM A307'] },
      { slug: 'washer-head', name: 'Washer Head Bolts', glyph: 'washerHead', blurb: 'An integral flange under the head spreads the clamp load without a separate washer.' },
      { slug: 'round-head', name: 'Round Head Bolts', glyph: 'roundHead', blurb: 'Smooth domed heads for finished surfaces, fences and guards.' },
      { slug: 'tension-control-bolts', name: 'Tension Control Bolts', glyph: 'tcBolt', blurb: 'Twist-off bolts: a splined tip shears at a preset torque so installers can see the pretension is right.', standards: ['ASTM F3125 F1852', 'ASTM F3125 F2280'] },
      { slug: 'countersunk', name: 'Countersunk Bolts', glyph: 'countersunk', blurb: 'Flat conical heads that sit flush with the surface.' },
      { slug: 'step', name: 'Step Bolts', glyph: 'stepBolt', blurb: 'Bolts with a projecting step for climbing poles, manholes and towers.' },
      { slug: 'custom-heading', name: 'Custom Heading', glyph: 'customHead', blurb: 'Not on any chart? Send a print. We upset the head to your shape and thread to suit.' },
      { slug: 'guardrail-bolts', name: 'Guardrail Bolts', glyph: 'guardrail', blurb: 'Button-head splice and post bolts for highway guardrail systems.', standards: ['AASHTO M180', 'ASTM A307'] },
    ],
  },
  {
    slug: 'rods',
    name: 'Rods',
    short: 'Rods',
    glyph: 'anchorRod',
    tagline: 'Straight stock, threaded exactly where you need it.',
    range: 'Cut thread 1/2" – 6" dia. · rolled 1/2" – 1" · up to 40 ft',
    intro:
      'Straight rods are cut to length and threaded one end, both ends or full length. Reduced-body rolled thread rod is available in the smaller diameters when weight or fatigue life matters.',
    items: [
      { slug: 'anchor-rods', name: 'Anchor Rods', glyph: 'anchorRod', blurb: 'Straight rods threaded at one or both ends, used with plate washers and nuts to anchor columns and equipment to concrete.', standards: ['ASTM F1554 Gr 36/55/105', 'ASTM A193 B7'], tool: 'bolt' },
      { slug: 'all-thread-rod', name: 'All Thread Rods', glyph: 'allThread', blurb: 'Threaded over the full length so it can be cut and nutted anywhere along its run.', standards: ['ASTM A307', 'ASTM A193 B7', 'ASTM A449'] },
      { slug: 'tie-rods', name: 'Tie Rods', glyph: 'tieRod', blurb: 'Rods with clevis, turnbuckle or upset ends to hold structures in tension. Lengths worked out from pin-to-pin dimensions.', standards: ['ASTM A36', 'ASTM A572', 'ASTM A193 B7'], tool: 'tie' },
      { slug: 'drift-pins', name: 'Drift Pins', glyph: 'driftPin', blurb: 'Plain round pins driven into pre-bored timbers to pin joints without a nut.' },
      { slug: 'swedged-rods', name: 'Swedged Rods', glyph: 'swedged', blurb: 'Rod ends swaged down so the thread can be cut without losing section to the thread root.' },
      { slug: 'threaded-rebar-bolts', name: 'Threaded Rebar Bolts', glyph: 'rebar', blurb: 'Deformed reinforcing bar threaded at the ends for post-tensioning-style anchorage and concrete connections.', standards: ['ASTM A615 Gr 60/75'] },
    ],
  },
  {
    slug: 'bent',
    name: 'Bent Bolts',
    short: 'Bent',
    glyph: 'lBolt',
    tagline: 'L, J, U, eye or hook. Bent hot or cold to your print.',
    range: 'Cut thread 1/2" – 4-1/2" dia. · rolled 1/2" – 1"',
    intro:
      'Bent bolts are the backbone of concrete anchorage. We bend to the radius your drawing calls out and thread the straight end, then galvanize the whole piece if the job needs it.',
    items: [
      { slug: 'anchor-bolts', name: '90° Anchor Bolts', glyph: 'lBolt', blurb: 'The classic L-bolt: a hooked embedded end and a threaded projection. The bend gives mechanical bond in the pour.', standards: ['ASTM F1554 Gr 36/55/105'], tool: 'bolt' },
      { slug: 'round-u-bolts', name: 'Round U-Bolts', glyph: 'uRound', blurb: 'Bent in a half-circle to clamp pipe, tube and round members.' },
      { slug: 'square-u-bolts', name: 'Square U-Bolts', glyph: 'uSquare', blurb: 'Square-cornered U-bolts for beams, channels and flat-sided members.' },
      { slug: 'closed-eye', name: 'Closed Eye Bolts', glyph: 'eyeClosed', blurb: 'A welded or forged closed loop for rigging and lifting points.' },
      { slug: 'open-eye', name: 'Open Eye Bolts', glyph: 'eyeOpen', blurb: 'An open loop for hooking in cable, chain or another bolt.' },
      { slug: 'round-hook', name: 'Round Hook Bolts', glyph: 'hookRound', blurb: 'A rounded hook end for hanging and tie-back applications.' },
      { slug: 'square-hook', name: 'Square Hook Bolts', glyph: 'hookSquare', blurb: 'A squared hook that seats against a flange or edge.' },
      { slug: 'j-bolts', name: 'J-Bolts', glyph: 'jBolt', blurb: 'A long-radius J bend for hooking around steel and embedding in concrete.' },
      { slug: 'custom-hook', name: 'Custom Hook Bolts', glyph: 'customHook', blurb: 'Any bend geometry you can dimension. Send the print.' },
    ],
  },
  {
    slug: 'nuts',
    name: 'Nuts',
    short: 'Nuts',
    glyph: 'nutHex',
    tagline: 'Matched to the bolt, in plain or galvanized finish.',
    range: 'Domestic and import stock · plain or hot-dip galvanized',
    intro:
      'A nut has to match the strength of the bolt it carries. We stock domestic and import nuts across the common grades, and galvanized nuts are tapped oversize so they run onto galvanized threads.',
    items: [
      { slug: 'double-recessed-nuts', name: 'Double Recessed Nuts', glyph: 'nutRecessed', blurb: 'Recessed on both faces so the bolt end can sit below the nut surface.' },
      { slug: 'hex-nuts', name: 'Hex Nuts', glyph: 'nutHex', blurb: 'Standard finished hex nuts for general fastening.', standards: ['ASTM A563 Gr A/C', 'ASME B18.2.2'] },
      { slug: 'heavy-hex-nut', name: 'Heavy Hex Nuts', glyph: 'nutHeavy', blurb: 'Thicker and wider than a regular hex nut, for high-strength bolts and structural joints.', standards: ['ASTM A563 Gr DH', 'ASTM A194 Gr 2H'] },
      { slug: 'square-nut', name: 'Square Nuts', glyph: 'nutSquare', blurb: 'Square nuts for timber, slots and traditional applications.' },
      { slug: 'hex-jam', name: 'Hex Jam Nuts', glyph: 'nutJam', blurb: 'Thin nuts tightened against a standard nut to lock it in place.' },
      { slug: 'heavy-hex-jam', name: 'Heavy Hex Jam Nuts', glyph: 'nutJam', blurb: 'The heavy-pattern jam nut for large-diameter anchor rods.' },
      { slug: 'lock-nuts', name: 'Lock Nuts', glyph: 'nutLock', blurb: 'Prevailing-torque nuts that resist loosening under vibration.' },
      { slug: 'hex-coupling', name: 'Hex Coupling Nuts', glyph: 'nutCoupling', blurb: 'Long hex nuts that join two threaded rods end to end.' },
      { slug: 'sleeve', name: 'Sleeve Nuts', glyph: 'nutSleeve', blurb: 'Tubular nuts threaded both ends, used to adjust and join tie rods.' },
    ],
  },
  {
    slug: 'washers',
    name: 'Washers',
    short: 'Washers',
    glyph: 'washerFlat',
    tagline: 'Flat, hardened, beveled, plate or cast.',
    range: 'Compatible with every fastener we make or stock',
    intro:
      'The washer decides how a clamp load spreads. From hardened structural washers to heavy plate washers cut for anchor rods, we carry what the connection needs and fabricate the rest.',
    items: [
      { slug: 'dti-washers', name: 'DTI Washers', glyph: 'washerDti', blurb: 'Direct tension indicating washers: protrusions flatten as the bolt tightens, giving a feeler-gauge check of pretension.', standards: ['ASTM F959'] },
      { slug: 'standard-flat', name: 'Standard Flat Washers', glyph: 'washerFlat', blurb: 'Plain flat washers in USS and SAE patterns.', standards: ['ASME B18.22.1', 'ASTM F844'], tool: 'bolt' },
      { slug: 'hardened-round', name: 'Hardened Round Washers', glyph: 'washerHard', blurb: 'Through-hardened washers used with structural and high-strength bolts.', standards: ['ASTM F436'], tool: 'bolt' },
      { slug: 'lock', name: 'Lock Washers', glyph: 'washerLock', blurb: 'Split spring washers that keep tension on a nut.', standards: ['ASME B18.21.1'] },
      { slug: 'malleable-iron', name: 'Malleable Iron Washers', glyph: 'washerMalleable', blurb: 'Cast washers with generous bearing area for timber work.' },
      { slug: 'round-plate', name: 'Round Plate Washers', glyph: 'washerRound', blurb: 'Thick round plate washers cut and drilled for large anchor rods.', tool: 'plate' },
      { slug: 'square-plate', name: 'Square Plate Washers', glyph: 'washerSquare', blurb: 'Square plate washers, any thickness, with holes sized to your rod.', tool: 'plate' },
      { slug: 'ogee', name: 'Ogee Washers', glyph: 'washerOgee', blurb: 'Cast ogee-profile washers that bear well on timber.', tool: 'bolt' },
      { slug: 'beveled', name: 'Beveled Washers', glyph: 'washerBevel', blurb: 'Tapered washers that square up a nut on sloped flanges.' },
      { slug: 'hardened-beveled', name: 'Hardened Beveled Washers', glyph: 'washerBevel', blurb: 'Hardened beveled washers for tapered structural steel.', standards: ['ASTM F436'] },
      { slug: 'clipped-hardened', name: 'Clipped Hardened Washers', glyph: 'washerClipped', blurb: 'Hardened washers with one edge clipped to clear a flange fillet.', standards: ['ASTM F436'] },
      { slug: 'rosette', name: 'Rosette Washers', glyph: 'washerRosette', blurb: 'Decorative cast washers for exposed historic timber framing.' },
      { slug: 'hillside', name: 'Hillside Washers', glyph: 'washerHillside', blurb: 'Washers with an angled seat for bolts entering a sloped surface.' },
    ],
  },
  {
    slug: 'others',
    name: 'Other Products',
    short: 'Other',
    glyph: 'plate',
    tagline: 'Plates, pins, hardware and tools for construction and OEM work.',
    range: 'Specialty items for construction and OEM applications',
    intro:
      'The rest of the connection: plate, pins, turnbuckles, clevises and timber-connector hardware, fabricated or sourced alongside your fasteners so it ships in one order.',
    items: [
      { slug: 'highway-barrier-pins', name: 'Highway Barrier Pins', glyph: 'barrierPin', blurb: 'Connecting pins and hardware for precast concrete barrier and temporary roadway systems.' },
      { slug: 'plates', name: 'Plates', glyph: 'plate', blurb: 'Fabricated steel plate: cut, drilled, bored and galvanized to print.', tool: 'plate' },
      { slug: 'turnbuckles', name: 'Turnbuckles', glyph: 'turnbuckle', blurb: 'Adjustable turnbuckles for tie-rod assemblies and bracing.', tool: 'tie' },
      { slug: 'clevises', name: 'Clevises', glyph: 'clevis', blurb: 'Forged clevis ends that give a tie rod a pin connection.', tool: 'tie' },
      { slug: 'anchor-sleeves', name: 'Anchor Sleeves', glyph: 'sleeve', blurb: 'Sleeves that isolate an anchor rod in the pour and leave room for adjustment.' },
      { slug: 'shear-plates', name: 'Shear Plates', glyph: 'shearPlate', blurb: 'Timber connectors that carry shear between wood and steel members.' },
      { slug: 'dapping-tools', name: 'Dapping Tools', glyph: 'tool', blurb: 'Cutters for preparing timber to receive connectors.' },
      { slug: 'split-rings', name: 'Split Rings', glyph: 'splitRing', blurb: 'Split-ring timber connectors that spread load between joined members.' },
      { slug: 'grooving-tools', name: 'Grooving Tools', glyph: 'tool', blurb: 'Tools that cut the ring groove for split-ring connectors.' },
      { slug: 'boat-spikes', name: 'Boat Spikes', glyph: 'boatSpike', blurb: 'Chisel-point galvanized spikes for marine and dock timber.' },
      { slug: 'spike-grids', name: 'Spike Grids', glyph: 'spikeGrid', blurb: 'Pressed grids with spikes both sides that tie timbers face to face.' },
    ],
  },
]

export const categoryBySlug = (slug: string | undefined) => CATALOG.find((c) => c.slug === slug)

export const productBySlug = (cat: string | undefined, slug: string | undefined) =>
  categoryBySlug(cat)?.items.find((p) => p.slug === slug)

export const TOTAL_PRODUCTS = CATALOG.reduce((n, c) => n + c.items.length, 0)
