# GIMEK's Boutique website

Single-page site for GIMEK's Boutique, Rue de Kondengui, Yaoundé.
Plain HTML / CSS / JS. No build step, no dependencies, no framework.

```
index.html      markup, icon sprite, SEO metadata, LocalBusiness structured data
styles.css      the whole design system (tokens, dark + light)
script.js       nav, menu, theme, lightbox, reveals, opening status, image slots
robots.txt      crawler policy + sitemap pointer
sitemap.xml     one URL, this page
_headers        security headers (Netlify / Cloudflare Pages)
assets/         photos and logo files, see assets/README.md
```

## Running it

Open `index.html` in a browser. That's it.
(For a local server: `python -m http.server 8000` in this folder. Note that on
Windows this server truncates files over ~64 KB, which makes the logo look
broken — that is the server, not the site. Open the file directly instead.)

## Deploying

Upload `index.html`, `styles.css`, `script.js`, `robots.txt`, `sitemap.xml`,
`_headers` and `assets/` to any static host: Netlify, Vercel, Cloudflare Pages,
GitHub Pages, or ordinary shared hosting. Nothing needs to be compiled.

Before going live, replace `https://gimeksboutique.cm` with the real domain. It
appears in three files: `index.html` (canonical + `og:` tags), `robots.txt`, and
`sitemap.xml`.

## Content Security Policy

The policy is written twice, on purpose:

- **`_headers`** — the real HTTP header. Netlify and Cloudflare Pages read this
  file as-is. This is the version that counts, and the only one that can carry
  `frame-ancestors` (browsers ignore that directive in a meta tag).
- **`<meta http-equiv>` at the top of `index.html`** — the fallback, for hosts
  where headers cannot be set (GitHub Pages, ordinary shared hosting) and for
  opening `index.html` straight off disk.

**Edit both together.** Where both are delivered the browser enforces both, so a
permission added to only one is still blocked by the other.

What the policy allows, and why each entry has to be there:

| Directive | Why |
|---|---|
| `script-src 'self' 'sha256-…'` | `script.js`, plus the one inline theme script |
| `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` | `styles.css`, the Google Fonts stylesheet, and the eight `style="--d:…"` attributes in the hero |
| `font-src https://fonts.gstatic.com` | the Fraunces and Space Grotesk files |
| `img-src 'self' data:` | photos in `assets/`, plus the inline SVG noise texture in `styles.css` |
| `frame-src https://www.google.com https://maps.google.com` | the map embed in the Visit section |
| `connect-src 'none'` | the site makes no network calls at all |

`'unsafe-inline'` in `style-src` is the single relaxation. Removing it means
moving those eight animation-delay attributes into CSS classes; nothing else
depends on it. Inline **scripts** are not relaxed — they are pinned by hash.

### Recomputing the script hash

`script-src` pins the pre-paint theme script inlined in `index.html` by SHA-256.
Change that script by so much as a space and the hash no longer matches: the
browser silently refuses to run it, and light-mode visitors get a dark flash on
every page load. Nothing else breaks, which is exactly what makes it easy to
miss. After editing it, recompute:

```
python -c "import re,hashlib,base64,io; b=re.search(r'<script>(.*?)</script>',io.open('index.html',encoding='utf-8',newline='').read(),re.S).group(1); print('sha256-'+base64.b64encode(hashlib.sha256(b.encode()).digest()).decode())"
```

Paste the result into **both** `index.html` and `_headers`. To confirm it took,
load the page and check the browser console: a mismatch logs `Executing inline
script violates the following Content Security Policy directive`.

### Other hosts

`_headers` is Netlify/Cloudflare Pages syntax. Same headers elsewhere:

- **Vercel** — a `headers` array in `vercel.json`.
- **Apache / shared hosting** — `Header set Content-Security-Policy "…"` in
  `.htaccess`.
- **nginx** — `add_header Content-Security-Policy "…" always;` in the server block.
- **GitHub Pages** — cannot set headers at all; the meta tag is doing the work,
  and `frame-ancestors` and HSTS simply do not apply.

`_headers` also sets `X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy`, `X-Frame-Options` and HSTS. HSTS is **active**, and it is
the one header you cannot casually take back — once a browser has seen it, it
refuses plain HTTP to the domain for two years. Every host listed above serves
HTTPS by default, so it is safe there; delete that line before deploying to a
domain that still has to answer on plain HTTP.

## Adding photos

Drop correctly-named files into `assets/` and the page picks them up with no code
changes. Names and recommended shapes are listed in `assets/README.md`.
Until then, each image position shows a designed placeholder rather than a
broken image.

## Design notes

- **Type**: **Fraunces** (display) + **Space Grotesk** (UI and body), from Google
  Fonts with local serif / sans fallbacks. Fraunces replaced Bodoni Moda, which
  was the wrong tool for this job: a Didone's thin strokes are hairlines by
  design, so the headings got *less* legible the smaller the screen, which is
  exactly backwards for a site most people reach from Instagram on a phone.
  Fraunces carries far more weight in the thin strokes and holds up at any size.
  Headings are set at weight 300 with `font-optical-sizing: auto` — do **not**
  re-pin `font-variation-settings: "opsz"`, because Fraunces' optical axis runs
  9..144 and the automatic mapping from font-size is what stops the small
  headings inheriting a display cut. Emphasis inside a headline is Fraunces'
  *italic* in crimson — the same family, never a third typeface. Space Grotesk
  carries eyebrows, buttons and labels in wide-tracked caps.
- **Line balancing**: Fraunces sets wider than the Bodoni it replaced, which left
  a single stranded word on the last line of several headings ("can", "Style").
  `text-wrap: balance` on `.h2` and `.hero__h1 span` fixes all of them at once.
  Browsers without it fall back to the ordinary ragged break.
- **A note on `Fashion.ttf`**: a font by that name was trialled for the headings
  and rejected. It is caps-only (no true lowercase), it has no `'`, no `é` and no
  `&`, so "GIMEK's" and "Yaoundé" both break, it has no italic, and its own
  `fsType` bits are set to *Preview & Print only*, which does not permit web
  embedding. It must not be committed or referenced.
- **Palette**: the reds are sampled from the logo files and are **not** tuned to
  the palette, because the logo is not being reworked: `#E8442F` is the exact red
  in `assets/logo-dark.png` and `#941004` the exact red in `assets/logo.png`.
  Everything around them is warm. Dark, the default, is a **plum-black**
  (`#141011`) rather than a neutral near-black; light is **blush and ivory**
  (`#FBF8F6` ground, `#2B2224` plum-brown ink). They are the same warmth at
  opposite ends of the lightness range.
  The softness comes from the ground and from **restraint**, never from
  desaturating the brand: the glow tokens are half what they were, the aurora is
  pulled back, and `text-shadow` survives on only the two largest headings.
  Crimson stopped being ambient light spilling over the page and went back to
  being an accent. One accent, no second colour. All colours are semantic CSS
  variables at the top of `styles.css`.
- **`theme-color` lives in two files.** The meta tag in `index.html` and the two
  literals in `paint()` in `script.js` must both equal `--bg` for their theme, or
  the browser chrome desyncs from the page.
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
- The real domain, in `index.html`, `robots.txt` and `sitemap.xml`. This is the
  one remaining launch blocker: until it is done the canonical URL, the `og:`
  tags, the structured data and the sitemap all point at a domain that does not
  resolve, so shared links show no preview card and the sitemap is rejected.
- A photographic `assets/og-image.jpg`. There is one there now, generated from
  the logo on the brand ground at exactly 1200 x 630, so the social card is not
  broken; replace it with a real photograph when you have one.

## Accessibility notes

Both overlays — the mobile menu and the gallery lightbox — set `inert` on the
rest of the page while they are open, so Tab cannot walk out of the overlay and
into content the visitor cannot see. The lightbox additionally wraps Tab across
its own three buttons **in DOM order** (prev, next, close). Listing them in any
other order puts the wrap-around on the wrong end and focus escapes on the first
Tab.

`[hidden]` is forced to `display: none` with `!important` near the top of
`styles.css`. The script hides the lightbox arrows with `.hidden = true` when
there is only one photo, and `.lb__btn` sets `display: grid`; an author rule
beats the browser's own `[hidden]` rule regardless of specificity, so without
that line the arrows stayed visible and clickable.

The opening-hours pill ships as a neutral "Monday to Saturday, 8 AM to 10 PM"
with the `is-idle` class. `initStatus()` replaces it with the live Open/Closed
state. It used to ship asserting "Open now", which was a false statement to
anyone whose JavaScript had not run, at any hour of any day.
