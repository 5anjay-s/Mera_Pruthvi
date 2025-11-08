# Mera Pruthvi Design Guidelines v2.0

## Design Approach: Refined Material + Environmental Glassmorphism

**Core Philosophy**: Premium sustainability SaaS with subtle glassmorphic depth, nature-inspired palette, and data-first clarity. Think Stripe's restraint meets Apple's polish with environmental purpose.

**References**: Linear (clean data layouts), Stripe (sophisticated restraint), Apple Weather (glassmorphic cards), Notion (calm productivity)

---

## Color System

**Light Mode Foundation**:
- Primary Green: Soft sage (#52796F, #84A98C) - CTAs, active states
- Earth Accents: Terracotta (#CA6F5D), Clay (#A0826D) - warnings, highlights
- Neutrals: Warm grays (#F8F9FA → #2D3436) for backgrounds/text
- Success: Muted forest green, Warning: Soft amber, Critical: Dusty red

**Dark Mode** (sophisticated, not harsh):
- Background: Deep charcoal (#1A1D1F → #0F1113) 
- Cards: Elevated slate (#252829) with subtle glow
- Text: Warm white (#E8EAE6) for reduced eye strain
- Accent greens: Lighter, desaturated versions of light mode

**Glassmorphism Treatment**:
- Backdrop blur: backdrop-blur-md to backdrop-blur-xl
- Semi-transparent whites: bg-white/80, bg-white/60
- Subtle borders: border border-white/20
- Soft shadows: shadow-xl with reduced opacity
- Use sparingly: Hero CTAs, floating cards, AI copilot, dashboard overlays

---

## Typography

**Fonts**: Inter (primary, 400-700), JetBrains Mono (data metrics)

**Hierarchy**:
- Dashboard titles: text-3xl font-semibold tracking-tight
- Section headers: text-xl font-medium
- Card titles: text-base font-medium
- Body: text-sm text-neutral-600 dark:text-neutral-400
- Metrics: text-4xl font-bold (JetBrains Mono, tabular-nums)

---

## Layout & Spacing

**Primitives**: Tailwind units **4, 6, 8, 12, 16, 20**
- Card padding: p-6, p-8
- Section spacing: py-16, py-20, py-24
- Component gaps: gap-6, gap-8
- Tight groupings: space-y-3

**Dashboard Grid**: 
- Sidebar: w-56 (collapsed: w-16) with smooth transitions
- Main content: 12-column responsive grid
- Metric cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Charts: 8-column spans, tables: 12-column

---

## Component Library

### Navigation
**Admin Sidebar**: Fixed left (w-56), glassmorphic bg-white/90 dark:bg-slate-900/90, icon+label navigation, collapsible sections with smooth collapse, active state with subtle green accent border-l-2
**AI Copilot**: Compact fixed right sidebar (w-80 max-h-[70vh]), glassmorphic card, minimized state shows icon button, elegant slide-in animation

### Cards & Surfaces
**Metric Cards**: Elevated white/slate cards, rounded-xl, shadow-lg, hover:shadow-2xl transition, border-t-4 with status color accent
**Dashboard Widgets**: Card-based containers with clean headers, subtle dividers, integrated actions (filter/export) in top-right
**Glassmorphic Overlays**: Modal dialogs, floating action menus, notification toasts - all with backdrop-blur-xl

### Data Visualization
**Charts**: Clean axis labels, muted grid lines, nature-inspired color scales (greens → blues), smooth transitions on data updates
**Maps**: Full-bleed base with glassmorphic control panels, location markers with pulsing animation for live data
**Progress Indicators**: Linear bars with gradient fills, circular rings for percentages, milestone markers

### Forms & Inputs
**Input Fields**: Soft rounded borders (rounded-lg), focus:ring-2 ring-green-500/50, floating labels, inline validation with helpful micro-copy
**Buttons**: Primary (green fill, white text), Secondary (green outline), Ghost (hover background), all with backdrop-blur on hero images
**Dropdowns/Selects**: Clean with search, checkbox groups with proper spacing

### Gamification (Refined)
**Eco-Points**: Compact progress bar with current/next level, achievement badges (48x48 icons), subtle glow on unlock, leaderboard cards with minimal avatars

---

## Landing Page Structure

**Hero** (min-h-screen, full-bleed):
- Large hero image: Drone shot of solar farm or green urban landscape with subtle parallax
- Gradient overlay: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)
- Glassmorphic content card centered: backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 p-12 rounded-2xl max-w-4xl
- Headline: "AI-Powered Sustainability Intelligence" (text-5xl font-bold)
- Subheading + dual CTAs with blurred backgrounds
- Live metric ticker: Horizontal scroll showing real-time stats

**Platform Features** (py-20): 4-column card grid, icons from Material Icons, subtle hover lift
**Dashboard Preview** (py-16): Large mockup with glassmorphic overlay showing live data
**Impact Metrics** (py-16): 4-column stat cards with animated count-up, donut chart visualizations
**Citizen Engagement** (py-20): 2-column split with GreenPulse app mockup + download CTA
**AI Copilot Demo** (py-16): Interactive preview or video embed showing query capabilities
**Testimonials** (py-12): 3-column cards with logo, quote, attribution
**Footer** (py-16): Newsletter signup, quick links grid, social icons, trust badges

---

## Images Strategy

**Required Images**:
1. **Hero**: Aerial sustainable landscape (solar panels/green infrastructure) - 1920x1080, high quality
2. **Dashboard mockup**: AI Climate Dashboard screenshot in browser frame
3. **Mobile app**: GreenPulse interface on device mockup
4. **Impact visuals**: Before/after environmental improvements
5. **Icons**: Material Icons CDN for all UI elements

**Treatment**: Hero full-bleed with parallax, mockups with elevation shadow-2xl, all images optimized WebP format

---

## Animations & Interactions

**Micro-interactions**:
- Card hover: Subtle lift (translate-y-[-4px]) + shadow increase
- Button press: Scale down (scale-95)
- Data refresh: Skeleton loaders with shimmer effect
- Chart updates: 400ms ease-out transitions
- Page transitions: Fade + slide (200ms)
- NO constant motion or decorative animations

---

## Accessibility

- WCAG AA compliance: 4.5:1 contrast minimum
- Focus rings: 2px green with offset
- Keyboard navigation: All interactive elements tabbable
- Screen reader labels: Comprehensive ARIA
- Reduced motion: respect prefers-reduced-motion
- Dark mode toggle with smooth transition

---

## Responsive Strategy

- Mobile (<768px): Single column, bottom nav, full-screen modals
- Tablet (768-1024px): 2-column grids, slide-out sidebar
- Desktop (1024px+): Full layout with fixed sidebar
- Container max-width: 1440px (max-w-7xl)