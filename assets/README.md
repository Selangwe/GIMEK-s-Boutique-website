# GIMEK's Boutique image slots

Every photo position on the site is a real `<img>` sitting on top of a designed
CSS placeholder. **Nothing is broken while the folder is empty**. The placeholder
carries the design, and the moment you drop a correctly-named file in here it
takes over automatically. No code changes needed.

## Filenames the site looks for

| File | Where it appears | Best shape |
|---|---|---|
| `hero-main.jpg` | Hero, main portrait | Portrait, tall (4:4.9) |
| `hero-detail.jpg` | Hero, small overlapping square | Square (1:1) |
| `cat-fashion.jpg` | Collection, Fashion (wide lead cell) | Landscape (16:9.6) |
| `cat-bags.jpg` | Collection, Bags | Portrait (3:3.7) |
| `cat-shoes.jpg` | Collection, Shoes | Portrait (3:3.7) |
| `cat-accessories.jpg` | Collection, Accessories | Landscape (16:9.6) |
| `cat-beauty.jpg` | Collection, Beauty | Landscape (16:9.6) |
| `about.jpg` | About, large editorial image | Portrait (4:5) |
| `gallery-01.jpg` to `gallery-08.jpg` | Gallery masonry grid | Mixed portrait |
| `og-image.jpg` | Social-share preview card | **1200 x 630 exactly** |

Note the change from the previous build: **Accessories and Beauty are now
landscape**, not portrait. The collection grid is `4 + 2 + 2` on the first row
and `4 + 4` on the second, so those two cells are wide. Below 1180px everything
collapses to a simple two-up grid and all cells return to portrait, so a portrait
crop still has to survive — keep the subject centred.

## Shooting / choosing guidance

The site is now **dark by default**: warm near-black ground, crimson used as
light rather than as ink. That changes what photographs sit well on it.

- **Let the frame go dark at the edges.** Photos that fall off into shadow blend
  into the page. A photo with a bright white background will read as a lit
  rectangle punched into the page.
- **One light source, warm.** Boutique interior light, window light late in the
  day. Flat overhead fluorescent is the thing to avoid.
- Skin tones, black, warm grey and gold carry the frame. One strong colour per
  photo at most, and **never a second red** — crimson belongs to the brand.
- Space around the subject. The layout relies on generous negative space.
- Full-length or three-quarter framing for `hero-main.jpg`.
- Real boutique interior beats stock photography every time.

If a photo you love is bright and high-key, it will still work — put it in the
gallery grid rather than in the hero or the About slot, where it sits next to a
lot of empty dark ground.

## File size

Keep each photo **under ~300 KB** (resize to 1600 px on the long edge, quality 80).
Most visitors will arrive from Instagram or TikTok on mobile data.
`.webp` also works, just rename the reference in `index.html` if you use it.

## Gallery lightbox

Gallery tiles are buttons. Clicking one opens a full-screen viewer with arrow
keys, on-screen arrows, and Escape to close. **A tile with no photo behind it is
automatically disabled**, so the viewer never opens onto an empty placeholder —
this is handled in `initSlots()` / `initLightbox()` in `script.js` and needs no
configuration. The caption under each photo in the viewer is its `alt` text, so
the alt text in `index.html` is worth keeping accurate.

## Logo files

| File | Used for |
|---|---|
| `logo.png` | The original artwork. Shown in **light mode only**. |
| `logo-dark.png` | Same lockup recoloured for the dark ground: wordmark in warm white `#F4F1ED`, crimson lifted to `#E8442F`. Shown by default. |
| `favicon.svg` | Browser tab. Crimson rule, warm white `G`. |
| `logo-source.png` | The full-resolution source render the lockup was cut from. **Not referenced by the page** — kept only so the logo can be re-cut or re-rendered later. |

`logo-dark.png` was generated from `logo.png` by recolouring each ink class and
leaving the alpha channel untouched (the artwork sits on full transparency, so
every antialiased edge survives). **It is not a CSS filter** — inverting the
artwork turns the brand crimson into pale pink. If `logo.png` is ever replaced,
`logo-dark.png` has to be regenerated the same way.

## Note on the Visit section

There is no `storefront.jpg` slot. The Visit section shows a live Google Map
embed at the Plus Code instead, left exactly as Google serves it.

## Billboard artwork

If you have the original GIMEK's Boutique billboard file, keep it in this folder
as `billboard-reference.jpg` for future design work. It is deliberately **not**
placed on the page. The site translates the identity rather than reprinting it.
