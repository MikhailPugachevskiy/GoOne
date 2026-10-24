# Go One

**One app that combines every bike-sharing provider.**

Go One is a pitch website for a business idea from 2019 ("Build your own business"): a mobile app that shows nearby shared bikes from several providers on one map, compares prices and lets riders pay and unlock with a single account.

The site walks through the pitch chapter by chapter: market, problem, solution, product, business case and team. Two parts are interactive: a small demo of the app and a break-even calculator.

> **Status:** a pitch project from 2019. The figures come from the original pitch deck (see [Sources](#sources)), and dates such as "MVP at year-end" or "break-even in 2021" refer to that plan.

## Pages

| Page | What it shows |
| --- | --- |
| `landing.html` | The idea in one screen, key market figures, the team |
| `market.html` | Bike-sharing market: providers, bikes, growth, investment |
| `problem.html` | Customer pain points from our own survey (N = 104) |
| `solution.html` | The four features riders asked for, and why the closest bike is rarely "your" bike |
| `product.html` | The five steps from map to unlocked bike, plus an **interactive demo** |
| `business.html` | Customers, competition, timeline, funding, plus a **break-even calculator** |
| `team.html` | The four founders and their areas of responsibility |

`index.html` in the main folder forwards to `html/landing.html`.

## The two interactive parts

- **App demo** (on *How it works*): a stylised map with 16 sample bikes from four providers. Filter by provider or lowest price, pick a bike, choose a payment method and get a demo QR code and lock code. All bikes, prices and the QR code are made up and marked as sample data.
- **Break-even calculator** (on *Business*): three sliders (fee per ride, ride volume, costs) change the pitch plan and show break-even year, gross profit, the lowest year-end cash position after both funding rounds, a chart and a table. With the default values it reproduces the pitch: break-even in 2021.

  Revenue and fees come from the deck. **The deck does not state costs.** They are estimated from the gross-profit chart, as noted below the calculator.

## Technology

- **HTML and CSS:** semantic markup, one stylesheet per page with shared design tokens (CSS custom properties), Grid and Flexbox layouts, responsive down to phone width, visible keyboard focus, `prefers-reduced-motion` respected.
- **TypeScript:** mobile menu (keyboard accessible), scroll-in animation and count-up numbers using `IntersectionObserver` (`ts/nav.ts`, `ts/motion.ts`).
- **React with TypeScript:** app demo and calculator, each bundled into one plain script with [esbuild](https://esbuild.github.io/), so the pages also work when opened straight from disk. The calculator chart is drawn as SVG without a chart library.
- **Fonts:** Outfit and Source Sans 3 from Google Fonts.

## Project structure

```
GoOne/
├── index.html              forwards to html/landing.html
├── favicon.svg
├── tsconfig.json           for the TypeScript files in ts/
├── html/                   the seven pages
├── css/                    one stylesheet per page
├── ts/                     TypeScript sources and the compiled JavaScript
│   ├── nav.ts, motion.ts           shared menu and animation code
│   ├── landing.ts … team.ts        empty placeholders for page-specific code
│   ├── product-demo.js             bundled app demo (built from react/)
│   └── business-calculator.js      bundled calculator (built from react/)
└── react/                  source of the demo and the calculator
    ├── package.json, build.mjs, tsconfig.json
    └── src/
        ├── main.tsx, Demo.tsx, data.ts, …        app demo
        └── calculatorMain.tsx, calculator/       break-even calculator
```

The compiled and bundled files in `ts/` are committed on purpose, so the site works without any build step.

## Run it

Open `index.html` in a browser. No server and no installation needed.

## Build (only if you change React or TypeScript code)

You need [Node.js](https://nodejs.org/) 18 or newer.

```bash
cd react
npm install        # once
npm run build      # writes ts/product-demo.js and ts/business-calculator.js
npm run typecheck  # optional type check
```

If you change `ts/nav.ts` or `ts/motion.ts`, compile them from the main folder:

```bash
npx -p typescript tsc
```

## Sources

The figures on the site come from the pitch deck in this repository (`Go One_Build your own business_ JM_AA_MP_MZ_v2.pdf`), which cites:

- Roland Berger (2016): *Bike Sharing 4.0*; Roland Berger (2018): *Bike Sharing 5.0*
- Agora Verkehrswende (2019): *Bikesharing im Blickpunkt*
- Nextbike (2018): *Original Bike Sharing* (company profile)
- European Bicycle Manufacturers Association (2019): *Bike Sharing in Europe*
- Manager Magazin (2018); Bullock, Brereton and Bailey (2017); Statista (2018)
- Our own survey of bike-sharing users (N = 104)

## How it was made

The project was built with the help of AI assistants (Cursor and Claude). The figures were checked against the pitch deck, and the team confirmed the descriptions of the founders' roles.

## Team

A. Ausma (CEO), J. Mörschel (CMO), M. Pugachevskiy (COO) and M. Zimmermann (CFO).

## Possible next steps

- Serve the fonts from the project instead of Google Fonts
- Add automated tests for the calculator model
- Replace the sample data in the demo with real provider data, if an interface to the providers exists
