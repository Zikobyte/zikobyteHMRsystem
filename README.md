<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# ZMC Hospital Management System

The application uses one Node.js server for the backend API, middleware, WebSocket connection, and React frontend. This keeps every department and dashboard connected through the same `/api` and `/ws` origin.

## Project structure

- `server.ts`: application composition entrypoint
- `src/backend/config`: environment configuration
- `src/backend/database`: PostgreSQL and local cache repository
- `src/backend/middleware`: request authentication and authorization middleware
- `src/backend/routes`: department and feature API routes
- `src/backend/utils`: backend utilities, including WebSocket clients
- `src/components`: React department views and dashboard components
- `src/utils/api.ts`: frontend API and WebSocket client

## Run locally

Prerequisite: Node.js 20 or newer.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the PostgreSQL variables in `.env`:

   ```env
   PGHOST=your-postgres-host
   PGPORT=5432
   PGDATABASE=your-database
   PGUSER=your-database-user
   PGPASSWORD=your-database-password
   JWT_SECRET=your-development-secret
   ```

3. Start the complete system:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000.

`npm run dev` starts Express, mounts all backend routes, initializes PostgreSQL, mounts Vite for the React interface, and serves WebSockets from the same origin. Do not use `node server.ts`; Node does not execute TypeScript directly. `npm run dev:backend` is an explicit alias for the same complete server.

## Production

Build the React frontend and backend bundle, then start the production server:

```bash
npm run build
npm run start:production
```

The production server serves the built frontend and the same backend API from http://localhost:3000. Keep `.env` out of source control and use a strong persistent `JWT_SECRET` in production.

## Netlify frontend deployment

Netlify can host the Vite frontend, but it cannot run this long-lived Express/WebSocket server as a static site. Deploy the backend to Render, Railway, Fly.io, or another Node host.

Set these variables in Netlify Site configuration before rebuilding:

```env
VITE_API_BASE_URL=https://your-backend-host.example.com/api
VITE_WS_URL=wss://your-backend-host.example.com
```

Set these variables on the backend host:

```env
NODE_ENV=production
PGHOST=your-postgres-host
PGPORT=5432
PGDATABASE=your-database
PGUSER=your-database-user
PGPASSWORD=your-database-password
JWT_SECRET=your-persistent-production-secret
```

Backend build and start commands:

```bash
npm install
npm run build
npm run start:production
```

After changing `NEXT_PUBLIC_API_BASE_URL` or `NEXT_PUBLIC_WS_URL`, trigger a new deploy. These values are embedded into the frontend at build time; changing them does not affect an already published build.
