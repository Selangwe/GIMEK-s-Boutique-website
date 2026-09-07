# GIMEK's Boutique website

Single-page site for GIMEK's Boutique, Rue de Kondengui, Yaoundé.
Plain HTML / CSS / JS. No build step, no dependencies, no framework.

```
index.html      markup, icon sprite, SEO metadata, LocalBusiness structured data
styles.css      the whole design system (tokens, dark + light)
script.js       nav, menu, theme, lightbox, reveals, opening status, image slots
robots.txt      crawler policy + sitemap pointer
sitemap.xml     one URL, this page
assets/         photos and logo files, see assets/README.md
```

## Running it

Open `index.html` in a browser. That's it.
(For a local server: `python -m http.server 8000` in this folder. Note that on
Windows this server truncates files over ~64 KB, which makes the logo look
broken — that is the server, not the site. Open the file directly instead.)

## Deploying

Upload `index.html`, `styles.css`, `script.js`, `robots.txt`, `sitemap.xml` and
`assets/` to any static host: Netlify, Vercel, Cloudflare Pages, GitHub Pages, or
ordinary shared hosting. Nothing needs to be compiled.

Before going live, replace `https://gimeksboutique.cm` with the real domain. It
appears in three files: `index.html` (canonical + `og:` tags), `robots.txt`, and
`sitemap.xml`.

## Adding photos

Drop correctly-named files into `assets/` and the page picks them up with no code
changes. Names and recommended shapes are listed in `assets/README.md`.
Until then, each image position shows a designed placeholder rather than a
broken image.

## Design notes

- **Type**: **Bodoni Moda** (display) + **Space Grotesk** (UI and body), from
  Google Fonts with local serif / sans fallbacks. Bodoni is a high-contrast
  fashion serif whose hairlines only survive at large optical sizes, which is
  exactly where it is set (`opsz` 96 on headlines). Emphasis inside a headline is
  Bodoni's *italic* in crimson — the same family, never a third typeface. Space
  Grotesk carries eyebrows, buttons and labels in wide-tracked caps, which is
  where the "2026" register comes from.
- **Palette**: taken from `assets/logo.png`, sampled rather than guessed. Crimson
  `#941004`, pure black, warm white. The site is **dark-first**: on a near-black
  ground crimson stops being ink and becomes light, so it glows, rim-lights the
  photo frames, and draws the hairlines. One accent, no second colour. All
  colours are semantic CSS variables at the top of `styles.css`.
- **Dark by default, light on request**. Dark is the brand, so it is the default
  for every visitor regardless of their OS setting — `prefers-color-scheme` is
  deliberately *not* used to pick the theme. The nav toggle switches to a paper
  version (`[data-theme="light"]`, one block of token overrides) and the choice
  is remembered in `localStorage`. A small script in `<head>` applies the stored
  choice before first paint, so light-mode visitors never see a dark flash.
- **Icons**: Phosphor Icons (regular, MIT), inlined verbatim as an SVG sprite at
  the top of `index.html` rather than loaded from a CDN, to keep the
  no-dependency promise. One family, one grid.
- **Motion**: a staggered page-load reveal, IntersectionObserver scroll reveals,
  two slow crimson "aurora" light sources behind the dark sections, and a scroll
  progress hairline. The progress bar uses a native CSS `scroll()` timeline where
  the browser has one and falls back to a passive rAF listener elsewhere. There
  are no other scroll listeners. Everything is disabled under
  `prefers-reduced-motion`.
- **Gallery lightbox**: tiles are buttons; the viewer supports arrow keys,
  Escape, backdrop click, and keeps focus inside itself while open. Tiles with no
  photo yet are disabled so it never opens onto a placeholder.
- **Mobile**: fixed bottom bar with Call / WhatsApp / Directions, since most
  visitors will arrive from Instagram or TikTok on a phone.

### One CSS trap worth knowing about

In the collection grid, `.cat:nth-child(4)` and `(5)` set `grid-column: span 4`.
That selector out-specifies a plain `.cat` override, and a `span` wider than the
declared track count **does not clamp** — CSS Grid quietly invents implicit
columns instead, which collapses the row. Every breakpoint that changes
`grid-template-columns` therefore has to restate those two children. There is a
comment in `styles.css` at the rule.

## Content rules honoured

No invented products, prices, reviews, awards, or partnerships. Opening hours
(Mon to Sat, 8 AM to 10 PM) come from the owner and are declared once in the
JSON-LD, once in the Visit ledger, and once in the footer. The live "Open now /
Closed" pill is computed by `initStatus()` in `script.js` against the boutique's
own clock (West Africa Time, UTC+1), so a visitor abroad still sees whether the
door is actually open. The collection section is a **showcase**, not a shop.

## Things to add when you have them

- Real photography. 16 slots are still empty and showing placeholders; the
  filenames, shapes and shooting guidance are in `assets/README.md`. Note the
  shapes for Accessories and Beauty changed to landscape in this build.
- `assets/og-image.jpg` at exactly 1200 x 630, for the social-share card.
- The real domain, in `index.html`, `robots.txt` and `sitemap.xml`.
