# BillionaireMatrix

Modern productivity & analysis matrix application built with a full TypeScript stack (Express + React + Drizzle ORM + Radix UI + Tailwind). This README documents architecture, setup, development workflow, and deployment.

## Table of Contents
1. Overview
2. Core Features
3. Tech Stack
4. Architecture
5. Directory Structure
6. Getting Started
7. Environment Variables
8. Database & Migrations
9. Development Scripts
10. Building & Deployment (Netlify)
11. Data Flow & State Management
12. UI Component System
13. Suggestion Engine
14. Performance Notes
15. Roadmap
16. Troubleshooting

---

## 1. Overview
BillionaireMatrix provides a matrix-style interface to organize, analyze, and interact with structured data, leveraging a responsive dark-themed UI. The project separates server (API + static asset serving) and client (Vite React SPA) for clear development ergonomics.

## 2. Core Features
- Dark / light theme support via `next-themes` & custom provider.
- Modular UI primitives built on Radix + Tailwind.
- Real-time / interactive panels (carousel, charts, dialogs, command palette).
- Form validation using `react-hook-form` + `zod` + `drizzle-zod`.
- Persisted data layer with Drizzle ORM targeting Postgres (Neon / local).
- Query caching + async interactions via TanStack Query.
- Session management (Express + `express-session` + PG store).
- Toast & notification system (`sonner`).

## 3. Tech Stack
- Language: TypeScript (client + server).
- Client: React 19, Vite 7, Tailwind CSS 4.
- Server: Express 4, WS (websocket), Session middleware.
- Database: Postgres (Neon recommended) via Drizzle ORM.
- Auth: Passport Local (extensible).
- Build tooling: `tsx` runner, Vite for client bundling.
- Deployment: Netlify (client build) + Node server (if separated) or unified static serving.

## 4. Architecture
The server currently handles API routes, session management, and serves the built client from `dist/public`. The client is a SPA consuming REST endpoints and managing its own routing (`wouter`). State queries use TanStack Query with a shared `queryClient` abstraction. Shared schema definitions live in `shared/` to ensure type consistency (e.g., validation + DB mappings).

## 5. Directory Structure (Key Paths)
```
client/
	src/
		pages/             # Page-level React components
		components/ui/     # Design system primitives
		components/ui-custom/ # App-specific composites
		hooks/             # Reusable hooks (e.g., mobile, toast)
		lib/               # Utilities (store, suggestion engine, query client)
server/
	index.ts            # Entry point
	routes.ts           # API routes
	storage.ts          # Persistence/session store helpers
shared/
	schema.ts           # Drizzle + Zod schema definitions
script/               # Build scripts
```

## 6. Getting Started
### Prerequisites
- Node.js 20+
- Postgres instance (local or Neon) if using DB features.

### Installation
```bash
npm install --legacy-peer-deps
```

### Development (Concurrent Client + Server)
```bash
npm run dev:all
```
Server only:
```bash
npm run dev
```
Client only:
```bash
npm run dev:client
```

## 7. Environment Variables
Create a `.env` file at project root (not committed). Suggested keys:
```
DATABASE_URL=postgres://user:pass@host:port/dbname
SESSION_SECRET=change_me
NODE_ENV=development
PORT=3000
```
If deploying serverless or adapting to Netlify Functions, some variables may move to the platform dashboard.

## 8. Database & Migrations
Schemas defined in `shared/schema.ts` drive Drizzle migrations.
Push schema changes:
```bash
npm run db:push
```
Ensure `drizzle.config.ts` points to your `DATABASE_URL`.

## 9. Development Scripts
- `dev:client`: Start Vite dev server on port 5000.
- `dev`: Run Express server with live TS via `tsx`.
- `dev:all`: Concurrent client + server.
- `build:client`: Produce production client assets.
- `build`: Full build (server + client) using `script/build.ts` + `script/build-client.ts`.
- `check`: Type-check with `tsc`.
- `db:push`: Drizzle schema push.

## 10. Building & Deployment (Netlify)
Netlify uses `netlify.toml`:
- Build command: `npm run build:client` (outputs `dist/public`).
- SPA fallback redirect configured (`/*` -> `/index.html`).
For a full backend you can:
1. Deploy client on Netlify.
2. Deploy server separately (e.g., Render, Fly.io, Railway) pointing API base URL env var in client.
Or adapt server to serverless functions (not yet implemented).

## 11. Data Flow & State Management
- Global lightweight state via `zustand` in `store.ts`.
- Server-sourced data cached through TanStack Query; invalidations triggered on mutations.
- Forms: Controlled or uncontrolled strategies via `react-hook-form` + schema validation.

## 12. UI Component System
`components/ui/` wraps Radix building blocks with Tailwind design tokens. Composition patterns:
- Variants via `class-variance-authority`.
- Utility merges via `tailwind-merge`.
- Animations powered by `tailwindcss-animate` + `framer-motion` (where needed).

## 13. Suggestion Engine
`lib/suggestionEngine.ts` contains logic for contextual suggestions inside matrix interactions (e.g., auto-complete or pattern hints). Extensible by injecting new strategies; keep pure for testability.

## 14. Performance Notes
- Vite dev for fast HMR.
- Code-splitting achievable via dynamic `import()` in route-level components.
- Radix primitives reduce custom logic footprint.
- For large matrix datasets consider virtualization (`react-virtual` or similar) – not yet integrated.

## 15. Roadmap (Proposed)
- Add authentication flows (register / login UI).
- Integrate virtualization for large grids.
- Export/import matrix data (CSV / JSON).
- Optional AI-assisted insight panel.
- Serverless function adaptation for unified Netlify deployment.
- Add test harness (Vitest + React Testing Library).

## 16. Troubleshooting
- Port conflicts: Change client port in `dev:client` script (`--port`).
- Missing DB tables: Run `npm run db:push` after updating schema.
- Session issues: Confirm `SESSION_SECRET` and that Postgres session store table exists.
- Type errors: Run `npm run check` for more detail.

## 17. API Routes (Current State & Plan)
`server/routes.ts` does not yet declare concrete endpoints. The storage layer (`storage.ts`) exposes preliminary user operations you can surface via REST.

### Proposed Endpoints
| Method | Path | Description | Body | Success Response |
|--------|------|-------------|------|------------------|
| POST | `/api/users` | Create a user | `{ username, password }` | `201 { id, username }` |
| GET | `/api/users/:id` | Fetch user by id | — | `200 { id, username }` |
| GET | `/api/users/by-username/:username` | Fetch user by username | — | `200 { id, username }` or `404` |

### Sample Implementation Snippet
```ts
// server/routes.ts
app.post('/api/users', async (req, res) => {
	const parsed = insertUserSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	const user = await storage.createUser(parsed.data);
	res.status(201).json({ id: user.id, username: user.username });
});

app.get('/api/users/:id', async (req, res) => {
	const user = await storage.getUser(req.params.id);
	if (!user) return res.status(404).end();
	res.json({ id: user.id, username: user.username });
});

app.get('/api/users/by-username/:username', async (req, res) => {
	const user = await storage.getUserByUsername(req.params.username);
	if (!user) return res.status(404).end();
	res.json({ id: user.id, username: user.username });
});
```

### Notes
- Replace in-memory `MemStorage` with a Drizzle-backed implementation to persist users.
- Hash passwords before storing (e.g. `bcrypt`).
- Add authentication & session tie-in once Passport strategies are configured.

## Contributing
Open to improvements. Please propose architectural changes with rationale (performance, maintainability, DX). Follow existing patterns in component styling and keep logic typed strictly.

## License
MIT (see package metadata).

---
Feel free to request additional docs (API spec, ER diagrams, component guidelines) and they can be added here.
=======
# BillionaireMatrix

