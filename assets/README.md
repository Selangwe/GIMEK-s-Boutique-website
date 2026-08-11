# GIMEK's Boutique — image slots

Every photo position on the site is a real `<img>` sitting on top of a designed
CSS placeholder. **Nothing is broken while the folder is empty** — the placeholder
carries the design, and the moment you drop a correctly-named file in here it
takes over automatically. No code changes needed.

## Filenames the site looks for

| File | Where it appears | Best shape |
|---|---|---|
| `hero-main.jpg` | Hero — main portrait | Portrait, tall (4:5) |
| `hero-detail.jpg` | Hero — small overlapping square | Square (1:1) |
| `cat-fashion.jpg` | Collection — Fashion (wide) | Landscape (16:10) |
| `cat-bags.jpg` | Collection — Bags | Portrait (3:3.7) |
| `cat-shoes.jpg` | Collection — Shoes | Portrait (3:3.7) |
| `cat-accessories.jpg` | Collection — Accessories | Portrait (3:3.7) |
| `cat-beauty.jpg` | Collection — Beauty & Cosmetics (wide) | Landscape (16:10) |
| `about.jpg` | About — large editorial image | Portrait (4:5) |
| `gallery-01.jpg` … `gallery-08.jpg` | Lookbook masonry grid | Mixed portrait |
| `storefront.jpg` | Visit Us — location image | Portrait (3:4) |
| `og-image.jpg` | Social-share preview card | **1200 × 630 exactly** |

## Shooting / choosing guidance

To stay true to the billboard identity:

- Warm light. Late-afternoon or warm indoor lighting, not cool white.
- Cream, beige, black and burnt-orange should dominate the frame.
- Space around the subject — the layout relies on generous negative space.
- Full-length or three-quarter framing for `hero-main.jpg`.
- Real boutique interior beats stock photography every time.

## File size

Keep each photo **under ~300 KB** (resize to 1600 px on the long edge, quality 80).
Most visitors will arrive from Instagram or TikTok on mobile data.
`.webp` also works — just rename the reference in `index.html` if you use it.

## Billboard artwork

If you have the original GIMEK's Boutique billboard file, keep it in this folder
as `billboard-reference.jpg` for future design work. It is deliberately **not**
placed on the page — the site translates its identity rather than reprinting it.
