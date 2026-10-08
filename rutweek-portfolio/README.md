# Rutweek Vaidya — Portfolio

Personal portfolio for Rutweek Vaidya, B.Tech CSE student and full-stack developer.
Built with Next.js 14, GSAP, Framer Motion, React Spring, Lenis smooth scroll,
a WebGL fluid hero background, and a light/dark theme toggle.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Edit your content

Everything personal lives in **one file**: [`data/profile.js`](data/profile.js)

- name, email, phone, LinkedIn / GitHub / LeetCode / CodeChef / Codeforces links
- About paragraphs and the four expertise cards
- Projects (set `href` to a URL to make a row clickable, or `null` for a plain row)
- Tech stack, education, achievements
- The big scroll-driven sentence in the middle of the page

## Add your photos (optional)

The site works without photos. Drop these files into `public/` and they appear automatically:

| File | Where it shows |
| --- | --- |
| `public/portrait.png` | Hero — a **transparent PNG cutout** of you, roughly 880×1100 px |
| `public/about-photo.jpg` | About card — portrait JPG, 3:4 ratio (replaces the initials card) |
| `public/logos/bal-vidya-mandir.png` | Education timeline — school logo (square PNG, transparent background) |
| `public/logos/mahatma-gandhi-jr-college.png` | Education timeline — school logo |
| `public/logos/ki-university.png` | Education timeline — university logo |

Without logo files, the timeline shows a clean initials badge for each school.

## Deploy

Vercel: import the repo and deploy — no configuration needed.
Netlify: build command `npm run build`, with the official Next.js runtime enabled.

## Credits & license

The layout, animations and styling are adapted from the open-source
[elfekky-portfolio](https://github.com/tefooh/elfekky-portfolio) template by
Mostafa Tarif (Mtarif), released under the MIT License. The original copyright
and license notice are kept in [`LICENSE`](LICENSE), as the license requires.
All personal content, links and copy in this repository belong to Rutweek Vaidya.
