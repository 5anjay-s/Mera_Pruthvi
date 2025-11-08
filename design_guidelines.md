# Mera Pruthvi (GaiaMind) Design Guidelines

## Design Approach: Hybrid Material Design + Environmental Focus

**Rationale**: This data-intensive platform requires Material Design's robust component system for dashboards and data visualization, while incorporating nature-inspired elements to reinforce the sustainability mission.

**Key References**: 
- Google Earth Engine for geospatial interfaces
- Nest (Google) for environmental data displays
- Linear for clean, data-forward layouts
- Duolingo for gamification patterns

## Core Design Principles

1. **Data Clarity First**: Environmental metrics must be instantly comprehensible
2. **Progressive Disclosure**: Complex data revealed hierarchically
3. **Action-Oriented**: Every insight leads to clear next steps
4. **Inclusive Design**: Accessible to government officials and citizens alike

---

## Typography

**Font System**: Google Fonts via CDN

- **Primary**: Inter (400, 500, 600, 700)
  - Dashboard headings: 600/700 weight
  - Body text: 400 weight
  - Data labels: 500 weight
  
- **Accent/Data**: JetBrains Mono (for metrics, numerical data)
  - Large metrics: 700 weight, tracking-tight
  - Data tables: 400 weight

**Type Scale**:
- Hero/Dashboard Title: text-4xl to text-5xl (mobile: text-3xl)
- Section Headers: text-2xl to text-3xl
- Card Titles: text-lg to text-xl
- Body: text-base
- Captions/Labels: text-sm
- Micro-data: text-xs

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 8, 12, 16**
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20
- Card gaps: gap-4, gap-6, gap-8
- Tight elements: space-y-2

**Grid Structure**:
- Dashboard: 12-column grid (lg:grid-cols-12)
- Metric cards: 2-4 columns (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Data tables: Full-width with horizontal scroll
- Mobile: Single column stack

**Container Strategy**:
- Full-bleed dashboards: w-full with inner max-w-7xl px-4
- Citizen app sections: max-w-6xl mx-auto
- Landing hero: Full viewport height (min-h-screen)

---

## Component Library

### Navigation
- **Admin Dashboard**: Fixed sidebar (w-64) with collapsible sections, icon + label navigation
- **Citizen App**: Bottom tab bar (mobile) with 4-5 primary actions
- **Top Bar**: Global search, notifications, user profile, context-aware breadcrumbs

### Data Display Components

**Metric Cards**: 
- Elevated cards with shadow-lg
- Large numerical display (text-4xl, JetBrains Mono)
- Trend indicators (↑↓ with percentage change)
- Sparkline charts for historical context
- Status badges (Good/Warning/Critical)

**Dashboard Widgets**:
- Map view: Full-bleed interactive map with overlays
- Chart containers: aspect-video ratio for consistency
- Real-time indicators: Pulsing dot animations for live data
- Data tables: Sticky headers, zebra striping, sortable columns

**Environmental Visualizations**:
- Heat maps: Gradient overlays on geographic regions
- Air quality indicators: Circular progress rings with AQI values
- Waste overflow alerts: Pin markers with severity levels
- Carbon footprint: Donut charts with category breakdowns

### Forms & Inputs

**Citizen Reporting**:
- Large image upload zones (min-h-48) with drag-drop
- Location picker with map preview
- Category chips for issue types
- Rich text description (max 500 chars)

**Data Entry**:
- Grouped input fields with clear labels
- Inline validation with helpful error messages
- Auto-save indicators
- Submit with loading states

### Gamification Elements

**Eco-Points System**:
- Progress bars with milestone markers
- Achievement badges (circular icons, 64x64px)
- Leaderboard cards with rank, avatar, points
- Level indicators with animated transitions

### AI Copilot Interface

**Chat Window**:
- Fixed bottom-right on desktop (w-96, max-h-[600px])
- Full screen modal on mobile
- Message bubbles: User (right-aligned), AI (left-aligned)
- Suggested actions as clickable chips
- Chart/report embeds directly in conversation

---

## Landing Page Structure

**Hero Section** (min-h-screen):
- **Large hero image**: Full-bleed satellite imagery of Earth or urban sustainability (green infrastructure, solar panels, clean city)
- Overlay: Semi-transparent gradient for text legibility
- Headline: "AI-Powered Intelligence for a Sustainable Planet"
- Subheading: Platform value proposition (1-2 sentences)
- Dual CTAs: "Request Demo" (primary), "Explore Dashboard" (secondary) with backdrop-blur-lg backgrounds
- Live metric ticker: Scrolling stats (CO₂ Reduced, Cities Monitored, Issues Resolved)

**Platform Features** (py-20):
- 4-column grid showcasing core modules
- Icon (64x64) + Title + Description per card
- Hover: Subtle lift effect (translate-y-1)

**Use Case Showcase** (py-16):
- 2-column alternating layout
- Left: Screenshot/mockup of dashboard in action
- Right: Use case description + metrics
- Reverse layout for each row

**Impact Metrics** (py-12):
- 4-column stat display
- Large numbers with units
- Icon representations
- Animated count-up on scroll

**Citizen Engagement CTA** (py-16):
- Split section: GreenPulse app preview (left) + download CTA (right)
- App store badges
- QR code for quick mobile access

**AI Copilot Demo** (py-20):
- Interactive chat preview or video demo
- Sample queries showing AI capabilities
- "Try the Copilot" CTA

**Social Proof** (py-12):
- 3-column testimonials from cities/organizations
- Logo wall of partners/clients
- Case study cards with measurable outcomes

**Footer** (py-16):
- Newsletter signup: "Get Sustainability Insights"
- Quick links: Platform, Resources, API Docs, Contact
- Social media links
- Trust indicators: Certifications, compliance badges

---

## Images Strategy

**Required Images**:
1. **Hero**: High-res satellite/drone imagery of sustainable urban landscape (1920x1080+)
2. **Dashboard mockups**: Screenshots of AI Climate Dashboard, Waste Management UI
3. **GreenPulse app**: Mobile app interface showing citizen reporting
4. **Team/About**: Optional authentic photos of team or partner cities
5. **Impact visuals**: Before/after environmental improvements
6. **Icons**: Material Icons via CDN for consistency

**Image Treatment**:
- Hero: Full-bleed with subtle parallax scroll
- Dashboard mockups: Browser/device frames with slight elevation
- Maps: Use Google Maps/Earth Engine APIs for real data visualization

---

## Accessibility & Performance

- WCAG 2.1 AA compliance minimum
- High contrast for data visualizations
- Keyboard navigation for all dashboards
- Screen reader labels for metrics and charts
- Loading skeletons for data-heavy components
- Lazy load images and charts below fold
- Progressive enhancement for map interactions

---

## Animation Philosophy

**Minimal & Purposeful**:
- Metric count-up animations on initial load
- Smooth chart transitions (300ms ease-out)
- Map pan/zoom with easing
- Notification slide-ins for alerts
- **NO**: Constant motion, decorative animations, distracting effects

---

## Responsive Breakpoints

- Mobile: < 768px (single column, bottom nav)
- Tablet: 768px - 1024px (2-column grids)
- Desktop: 1024px+ (full dashboard layouts, sidebars)
- Large screens: 1440px+ (max-w-7xl containers)