# Repository Guidelines

## Project Structure & Module Organization

- `src/app/` contains the Next.js App Router entry points (`layout.tsx`, `page.tsx`) and global styles (`globals.css`).
- `public/` holds static assets served as-is.
- Configuration lives at the root: `next.config.ts`, `open-next.config.ts`, `wrangler.jsonc`, `tsconfig.json`, `eslint.config.mjs`, and `postcss.config.mjs`.
- Build outputs are generated in `.next/` and `.open-next/` (do not edit by hand).

## Build, Test, and Development Commands

- `npm run dev`: Start the local Next.js dev server with Turbopack.
- `npm run build`: Create a production Next.js build.
- `npm run start`: Serve the production build locally.
- `npm run lint`: Run ESLint with the Next.js presets.
- `npm run preview`: Build and preview on the Cloudflare runtime.
- `npm run deploy`: Build and deploy to Cloudflare via OpenNext.
- `npm run upload`: Build and upload without deploying.
- `npm run cf-typegen`: Regenerate Cloudflare types into `cloudflare-env.d.ts`.

## Coding Style & Naming Conventions

- TypeScript/TSX is the default. Follow Next.js App Router naming (`page.tsx`, `layout.tsx`, `route.ts`).
- Preserve existing formatting per file (e.g., tabs in `package.json`, 2-space indentation in `tsconfig.json`).
- Use the `@/*` path alias for imports under `src/`.
- Styles are managed via `globals.css` and Tailwind (PostCSS plugin).

## Testing Guidelines

no need test , just do it

## Commit & Pull Request Guidelines

- Commit history is small and informal; examples include `ci: ...`, `initial`, and `Initialize ...`.
- Prefer short, imperative messages; use an optional conventional prefix (`feat:`, `fix:`, `ci:`) when helpful.
- PRs should include a concise summary, linked issue (if any), and screenshots for UI changes.
- Run `npm run lint` and `npm run build` before requesting review.

## Configuration & Deployment Tips

- Cloudflare settings are in `wrangler.jsonc`; secrets should be stored via `wrangler secret`.
- OpenNext uses `.open-next/worker.js` as the Worker entry point; keep bindings in sync with `wrangler.jsonc`.
