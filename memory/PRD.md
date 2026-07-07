# Physiverse — UI Fix PRD

## Original Problem Statement
User reported: "sare pages ki UI bhut hi kharab h — card aur text alignment sab tuta hua h. Fix karke `ui-improves` branch par push karna h."
User choices: Only fix alignment/spacing (cards, text), keep existing theme unchanged. Push via "Save to GitHub".

## Project
- Location: `/app/physiverse-app` (Next.js 15 + Tailwind CSS v4 + framer-motion + three.js)
- Physics learning platform: Home, Learn, Simulations (10 engines), Virtual Labs, Formula Explorer, AI Tutor (Gemini), Community, Dashboard, Auth
- No backend/Mongo — pure Next.js app; AI tutor uses /api/tutor route (needs GEMINI_API_KEY, offline fallback exists)
- Dev server: `npx next dev --turbopack -p 3000 -H 0.0.0.0` (needs `yarn install --ignore-engines`, node 20 vs camera-controls wants 22)

## Root Cause Found (June 2026)
`src/app/globals.css` had an **unlayered** `* { margin: 0; padding: 0 }` reset. In Tailwind v4, utilities live in `@layer utilities`, and unlayered CSS beats ALL layered styles. Result: every padding/margin utility (`p-*`, `m-*`, `pt-36`, `mb-*`, `mx-auto`, `space-y-*`) was dead across all pages → headers under navbar, zero card padding, off-center subtitles. `gap-*` worked (not margin/padding), which masked the issue partially.

## What's Been Implemented (June 2026)
1. Wrapped base styles (`*`, `html`, `body`, `h1-h6`, `code`) in `@layer base` in globals.css; removed margin/padding zeroing (Tailwind preflight handles it). This single fix restored correct spacing/alignment on ALL pages.
2. Home pricing cards: added `flex flex-col` + `flex-1` on features list + `mt-auto` on CTA button → equal heights, aligned buttons.
3. Verified via screenshots (dark + light): home (hero, real-life, domains, sims, labs, formula, AI/community, pricing, CTA, footer), /learn, /learn/mechanics, /simulations, /simulations/pendulum, /virtual-labs, /formula-explorer, /ai-tutor, /community, /dashboard, /auth — all correct.
4. Note: Turbopack caches CSS aggressively — after globals.css edits, `rm -rf .next` + restart was required.

## Backlog / Next
- P1: User to push branch `ui-improves` via "Save to GitHub" feature (agent cannot git push)
- P2: Supabase auth wiring (auth page is UI-only), GEMINI_API_KEY for AI tutor
- P2: Supervisor config points to /app/frontend (doesn't exist) — frontend/backend supervisor entries FATAL; app runs via manual next dev
