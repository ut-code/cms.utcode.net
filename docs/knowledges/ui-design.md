# UI Design

団体要件: プライマリカラー = RGB(0,211,114) #00D372 CMYK(68%, 0, 72%, 0)

## Inspiration

- **Linear**: Typography, clarity, professional developer aesthetic
- **Vercel**: Minimal layout, generous whitespace, grid system
- **Stripe**: Precise spacing, component consistency, refined details
- **utcode.net**: Section variety, dark CTAs, organization info, activities showcase

## Theme

- **Base**: White background (#ffffff) with zinc-50 alternating sections
- **Text**: Zinc-900 (#18181b) for primary, Zinc-500 (#71717a) for secondary
- **Accent**: Lime green (#00D372) — ut.code(); brand color
- **Secondary accent**: Black (#0a0a0a) — used for contrast elements (nav CTA, featured cards, Join CTA)

## Typography

- **Body**: DM Sans — clean, modern, highly readable
- **Code/Mono**: JetBrains Mono — developer identity, used for logo, badges, tech tags, stats, section labels

## Principles

1. **Content-first**: Design serves readability, minimal decoration
2. **Developer identity**: Code blocks, monospace elements, terminal aesthetics in hero
3. **High contrast**: Clear visual hierarchy between sections
4. **Restrained color**: Accent color used sparingly for emphasis (CTAs, labels, hover states)
5. **Generous spacing**: Breathing room between sections (py-24), comfortable reading width (max-w-6xl)
6. **Visual variety**: Alternating section backgrounds (white, zinc-50, zinc-900 for CTAs)

## Component Patterns

| Component           | Style                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------- |
| Buttons (primary)   | bg-primary, rounded-lg, font-semibold, shadow-lg                                         |
| Buttons (secondary) | bg-zinc-900, text-white                                                                  |
| Cards               | bg-white/80, backdrop-blur-md, border border-zinc-200/50, rounded-2xl, hover:shadow      |
| Featured card       | bg-zinc-900, text-white (inverted)                                                       |
| Section labels      | Monospace, uppercase, tracking-widest, text-primary                                      |
| Tech tags           | Monospace, text-xs, bg-zinc-100/zinc-800, rounded-lg                                     |
| Page headers        | border-b, bg-zinc-50/50, py-16                                                           |
| Pagination          | `$lib/components/Pagination.svelte` - Reusable component with prev/next buttons, page numbers with ellipsis |

## Interaction Patterns

**Hover States (Standardized)**

All interactive card-like elements use the consistent hover pattern:
- `hover:bg-primary/5 hover:border-primary/30`
- With optional shadow effects: `hover:shadow-lg hover:shadow-primary/5` or `hover:shadow-md`
- For elements with text: add `hover:text-primary`

Applied to:
- Public site cards (articles, projects, members, activities)
- Admin dashboard cards (QuickActions, NeedsAttention, RecentActivity)
- List items (project members, member projects)
- Pagination buttons

## Layout

- Max width: 6xl (1152px)
- Grid: 2-column on desktop, single column on mobile
- Section padding: py-24 (6rem)
- Component gap: gap-6
- Card border radius: rounded-2xl
- List pages: Header section + content section pattern

## Navigation Structure

**Header Navigation** (Simple direct links)
- Articles
- Projects
- Members

**Footer Navigation** (Comprehensive links)
- About section: About, Activities, Join, Donation
- Content section: Articles, Projects, Members
- Social section: GitHub, Twitter

Mobile: Drawer menu mirrors header navigation (Articles, Projects, Members)

## Public Pages Structure

1. **Homepage**
   - Hero with gradient background, terminal code block, CTAs
   - Stats section (members, projects, articles, years)
   - Activities section (3 cards: Learn, Share, Develop)
   - Projects section (featured + grid)
   - Articles section (latest 3)
   - Join CTA (dark background, radial gradient decoration)
   - About section (organization info table)

2. **List pages** (Articles, Projects, Members)
   - Header section with title and description
   - Filter options (for projects)
   - Card grid with pagination

3. **Footer**
   - Two-column layout (branding + links)
   - Links and Social sections
   - Copyright
