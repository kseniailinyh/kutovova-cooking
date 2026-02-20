# Kutovova Cooking

Small React + Vite (TypeScript) app that indexes markdown recipes and ingredients from local folders:

- `recipes/`
- `ingredients/`
- `photos/` (optional, untouched)

The app reads a generated JSON index from `public/generated/index.json`.

## Quick start in Cursor (no terminal)

1. In Cursor, run `Tasks: Run Task` and choose `Dev (build index + vite)`.
2. Or open `Run and Debug` and start `Dev Server`.
3. If tasks report missing Node/npm: install Node LTS from https://nodejs.org, restart Cursor, then run again.

## Install

```bash
npm install
```

## Build markdown index

```bash
npm run build:index
```

This scans `recipes/` and `ingredients/` and writes:

- `public/generated/index.json`

## Run development server

```bash
npm run dev
```

## Rebuild after adding/changing markdown files

Any time you add or edit files in `recipes/` or `ingredients/`:

```bash
npm run build:index
```

Then refresh the app (or restart dev server if needed).

## Routes

- `/recipes`
- `/recipes/:id`
- `/ingredients`
- `/ingredients/:id`
- `/` redirects to `/recipes`

## Deploy to GitHub Pages

Production deploy is configured for the repository path `kutovova-cooking`.

1. Build locally for Pages:

```bash
npm run build:pages
```

2. Push to `main` to trigger `.github/workflows/deploy-pages.yml`.
3. In GitHub repository settings, set **Pages** source to **GitHub Actions**.

Site URL pattern:

`https://<username>.github.io/kutovova-cooking/`
