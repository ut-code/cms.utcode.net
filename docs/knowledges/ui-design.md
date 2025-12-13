# UI Design

## Inspiration

- **Linear**: Typography, clarity, professional developer aesthetic
- **Vercel**: Minimal layout, generous whitespace, grid system
- **Stripe**: Precise spacing, component consistency, refined details

## Theme

- **Base**: White background (#ffffff)
- **Text**: Zinc-900 (#18181b) for primary, Zinc-500 (#71717a) for secondary
- **Accent**: Lime green (#00D372) — ut.code(); brand color
- **Secondary accent**: Black (#0a0a0a) — used for contrast elements (nav CTA, featured cards)

## Typography

- **Body**: DM Sans — clean, modern, highly readable
- **Code/Mono**: JetBrains Mono — developer identity, used for logo, badges, tech tags, stats

## Principles

1. **Content-first**: Design serves readability, minimal decoration
2. **Developer identity**: Code blocks, monospace elements, terminal aesthetics in hero
3. **High contrast**: Clear visual hierarchy between sections
4. **Restrained color**: Accent color used sparingly for emphasis (CTAs, labels, hover states)
5. **Generous spacing**: Breathing room between sections (py-24), comfortable reading width (max-w-6xl)

## Component Patterns

| Component           | Style                                                      |
| ------------------- | ---------------------------------------------------------- |
| Buttons (primary)   | bg-[#00D372], rounded-lg, font-semibold                    |
| Buttons (secondary) | bg-zinc-900, text-white                                    |
| Cards               | bg-zinc-50 or bg-white, border border-zinc-200, rounded-xl |
| Featured card       | bg-zinc-900, text-white (inverted)                         |
| Section labels      | Monospace, uppercase, tracking-widest, text-[#00D372]      |
| Tech tags           | Monospace, text-xs, bg-zinc-100/zinc-800                   |

## Layout

- Max width: 6xl (1152px)
- Grid: 2-column on desktop, single column on mobile
- Section padding: py-24 (6rem)
- Component gap: gap-4 to gap-6
