# SGD Professional Tree Felling — website

Static site. No build step, no framework, no dependencies to install. Five HTML
pages sharing one stylesheet and one script.

```
website/
├── index.html          Home
├── services.html       The nine services in detail
├── gallery.html        Photo gallery with lightbox
├── about.html          About, safety & cover, how a job runs
├── contact.html        Contact details + quote form
├── css/styles.css      All styling
├── js/main.js          Nav, scroll reveal, lightbox, quote form
└── assets/img/         Logo, favicon and photographs
```

## Viewing it locally

Double-clicking `index.html` works. To serve it properly (recommended, and
closer to how it will behave live):

```bash
python -m http.server 5173 --directory website
```

Then open <http://localhost:5173>.

## Publishing it

Upload the whole `website` folder to any host — cPanel/FTP shared hosting,
Netlify, Cloudflare Pages, GitHub Pages. Nothing server-side is required.

If the files land in a subfolder, everything still works: all links and asset
paths are relative.

## Business details used throughout

These appear in the header, footer, contact page and structured data. Search and
replace across all five HTML files if any of them change:

| Detail | Value |
| --- | --- |
| Phone / WhatsApp | `064 129 4129` (links use `tel:+27641294129` and `wa.me/27641294129`) |
| Email | `matthew.sgd.treefelling@gmail.com` |
| Facebook | `https://www.facebook.com/share/18xreDXuV8/` |
| Instagram | `https://www.instagram.com/sgdtreefelling/` |
| Service area | Mossel Bay, Hartenbos, Great Brak, George, Wilderness, Sedgefield, Knysna, Plettenberg Bay |

## The quote form

`contact.html` has no back end. On submit, `js/main.js` builds a `mailto:` link
and opens the visitor's mail app with the enquiry already written out.

To move it to a hosted form service (Formspree, Basin, Netlify Forms) later:

1. Give the `<form>` a real `action` and `method="post"`.
2. Remove the `data-mail-form` attribute — that switch alone disables the
   mailto handler in `js/main.js`.

## Adding photos to the gallery

Copy the image into `assets/img/work/`, then duplicate one `<button
class="work-card">` block in `gallery.html` and change the `src`, `alt`,
`data-caption` and the two lines of the caption overlay. The lightbox picks up
new cards automatically.

Layout note: the gallery grid is three columns. `work-card--wide` spans all
three, `work-card--tall` spans two rows. Keep the counts so the rows fill
evenly — currently one wide, one tall, four standard, one wide.

## Notes

- Fonts (Archivo + Source Sans 3) load from Google Fonts, so the page needs an
  internet connection to look exactly right. Sensible system fallbacks are set.
- Icons are inline SVG symbols defined at the top of each page's `<body>` — no
  icon font, no external sprite, so the pages work from a plain folder.
- Colours live as custom properties at the top of `css/styles.css`, sampled from
  the SGD logo and the printed flyers.
- Animations are disabled automatically for visitors who have "reduce motion"
  turned on, and the page content stays visible with JavaScript switched off.
