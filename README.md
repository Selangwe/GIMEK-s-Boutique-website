# GIMEK's Boutique — website

Single-page site for GIMEK's Boutique, Rue de Kondengui, Yaoundé.
Plain HTML / CSS / JS. No build step, no dependencies, no framework.

```
index.html      markup + SEO metadata + LocalBusiness structured data
styles.css      the whole design system
script.js       nav, mobile menu, scroll reveals, image-slot handling
assets/         photos go here — see assets/README.md
```

## Running it

Open `index.html` in a browser. That's it.
(For a local server: `python -m http.server 8000` in this folder.)

## Deploying

Upload the four items (`index.html`, `styles.css`, `script.js`, `assets/`) to any
static host — Netlify, Vercel, Cloudflare Pages, GitHub Pages, or ordinary shared
hosting. Nothing needs to be compiled.

Before going live, update `<link rel="canonical">` and `og:image` in `index.html`
to the real domain.

## Adding photos

Drop correctly-named files into `assets/` — the page picks them up with no code
changes. Names and recommended shapes are listed in `assets/README.md`.
Until then, each image position shows a designed placeholder rather than a
broken image.

## Design notes

- **Type**: Fraunces (display, italic accents) + Jost (UI and body), loaded from
  Google Fonts with local serif/sans fallbacks.
- **Palette**: ivory paper `#FBF6EE`, warm charcoal `#14100D`, ember `#C4571C`,
  champagne `#B08A4E` — all defined as CSS variables at the top of `styles.css`.
- **Motion**: one staggered page-load reveal plus IntersectionObserver
  scroll reveals. Everything is disabled under `prefers-reduced-motion`.
- **Mobile**: fixed bottom bar with Call / WhatsApp / Directions, since most
  visitors will arrive from Instagram or TikTok on a phone.

## Content rules honoured

No invented products, prices, reviews, awards, partnerships, or opening hours.
Only "Open · Closes 10 PM" is stated, because that is the only hours information
provided. The collection section is presented as a **showcase**, not a shop, and
says so in the copy.

## Things to add when you have them

- Real photography (see `assets/README.md`)
- Full weekly opening hours — then add an `openingHoursSpecification` block to
  the JSON-LD in `index.html` for better Google visibility
- An embedded Google Map, if you'd rather have that than the location photo
