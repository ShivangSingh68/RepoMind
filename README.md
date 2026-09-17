# RepoMind frontend

A React + Vite preview for a developer-focused version control workspace with AI-assisted issue resolution.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite. Run `npm run build` to produce a production bundle in `dist/`.

## What the preview includes

- Repository overview, file browser, issues, pull requests, and AI insights
- Repository search with `Ctrl/⌘ + K`, branch selection, and a clone-command copy button
- Issue creation that simulates asynchronous AI analysis and prepares a pull request after a short delay
- Maintainer review and merge action, with issue state saved in browser local storage
- Responsive layout for desktop and mobile screens

This is a frontend prototype. Repository data, context analysis, code patches, checks, and merges are represented by demo data and browser state. Connecting it to a Git service and AI worker will require backend APIs.
