# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Weather (Next.js 16)

A weather dashboard backed by the OpenWeatherMap API. Currently in early scaffolding — `src/app/page.tsx` still renders the default `create-next-app` template, and the API client layer is in place but not yet wired into the UI.

## Critical: This is NOT the Next.js you know

`AGENTS.md` (in this repo) and the bundled hint in `node_modules/next/dist/docs/index.md` both warn: **Next.js 16.2.7 has breaking changes** vs. earlier versions. Conventions, APIs, and file structure may all differ from your training data.

- **Before writing any code**, read the relevant guide in `node_modules/next/dist/docs/` (App Router sections under `01-app/`, plus `04-glossary.md`).
- The docs index has an `{/* AI agent hint: ... */}` comment block at the top — read those hints; they override defaults.
- Watch for deprecation notices in those bundled docs.

## Commands

| Task                       | Command                                           |
| -------------------------- | ------------------------------------------------- |
| Dev server                 | `npm run dev`                                     |
| Production build           | `npm run build`                                   |
| Start production server    | `npm start`                                       |
| Lint (ESLint, flat config) | `npm run lint`                                    |
| Format (Prettier, write)   | `npm run formate` (note: typo in the script name) |
| Format check (CI)          | `npm run formate:check`                           |

There is no test runner configured. ESLint is configured via `eslint.config.mjs` using the flat-config format (`defineConfig` + `globalIgnores`), pulling in `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. Prettier integrates via `eslint-plugin-prettier` (config in `.prettierrc`).

## Environment

- `OPEN_WEATHER_API_KEY` is read from `.env` (which is git-ignored — do not commit). The `.env` currently contains a real key; rotate it before pushing to a public remote. The API client modules read it via `process.env.OPEN_WEATHER_API_KEY`.

## Architecture

### Stack

- **Next.js 16.2.7** with the **App Router** (under `src/app/`).
- **React 19.2.4**.
- **TypeScript 5** (strict mode on, `bundler` module resolution).
- **Tailwind CSS v4** via `@tailwindcss/postcss` (see `postcss.config.mjs` and `src/app/globals.css`).
- **Geist + Geist Mono** fonts wired in `src/app/layout.tsx` via `next/font/google`.

### Path alias

`@/*` → `./src/*` (set in `tsconfig.json`). Use `@/lib/...` for all imports under `src/lib`.

### Directory layout (the parts that matter)

- `src/app/` — App Router entry. `layout.tsx` is the root layout; `page.tsx` is the home route (still boilerplate). No other routes exist yet.
- `src/lib/api/` — Server-side API client functions. Each module is a default-exported async function that calls an OpenWeatherMap endpoint and returns a typed response:
  - `weather.ts` — `fetchWeather(lat, lon)` → current conditions.
  - `forecast.ts` — `fetchForecast(lat, lon)` → 5-day / 3-hour forecast.
  - `air-pollution.ts` — `fetchAirPollution(lat, lon)` → current AQI + pollutants.
  - `geocoding.ts` — `fetchGeocode(location_name, limit)` → search for coordinates by name.
- `src/lib/types/` — Per-endpoint TypeScript response types, one file per API. `weather.types.ts` is the base; `forecast.types.ts` and `air-pollution.types.ts` re-export shared primitives (`Coord`, `WeatherCondition`, `Clouds`, `Wind`, `Precipitation`) and add their own. `geocoding.types.ts` is standalone. `air-pollution.types.ts` also exports an `AQI_LABELS` constant map.
- `public/` — Static assets (the default `create-next-app` SVGs).

### API client conventions

- All API functions are **async server functions** (default-exported) intended to be called from Server Components or Route Handlers — they read `process.env` directly.
- They use Next's extended `fetch` with `next: { revalidate: 600 }` (10-minute ISR) for weather/forecast/air-pollution. `geocoding.ts` does **not** set revalidate — it defaults to no-store; intentional, since search results should be fresh.
- `weather.ts` currently has leftover `console.log` debug statements (API key + lat) — remove these before shipping.
- Errors throw a plain `Error` with the status code and status text; there is no retry/circuit-breaker layer.
- Temperature is in **Kelvin by default** (OpenWeatherMap default — the `units` query param is not passed anywhere).

### Things to be aware of

- The home page is the unmodified `create-next-app` boilerplate — it's the first thing to replace when wiring the UI to the API layer.
- ESLint flat config is in use, **not** legacy `.eslintrc`. Add new ignores via `globalIgnores(...)` in `eslint.config.mjs`.
- `next.config.ts` is currently empty.
- The `.prettierignore` has some duplicated globs (`**/.git`, `**/.svn`, `**/.hg` each appear twice) — harmless but worth a tidy if touching it.
