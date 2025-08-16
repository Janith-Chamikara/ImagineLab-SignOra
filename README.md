# GovTech Monorepo (NestJS + Next.js)

Full-stack app with:

- Backend: NestJS + Prisma (SQLite), global prefix: `/be`, port: `3001`
- Frontend: Next.js (App Router), port: `3000`
- Optional Docker Compose to run both.

---

## Environment variables

Create these files with the following content (values shown are sample/dev and safe to use locally).

Backend (`backend/.env`):

```
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=development

# JWT / Tokens
JWT_SECRET=45ac78fa5c459c2c456a7390b26a8c0b
ACCESS_TOKEN_SECRET=45ac78fa5c459c2c456a7390b26a8c0b
REFRESH_TOKEN_SECRET=45ac78fa5c459c2c456a7390b26a8c0b
ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC=100
REFRESH_TOKEN_VALIDITY_DURATION_IN_SEC=432000

# Cloudinary
CLOUDINARY_CLOUD_NAME=dgkrcxt3p
CLOUDINARY_API_KEY=768998232622312
CLOUDINARY_API_SECRET=gnR7DwE0EVeQ121DhbiN9wE8sWA
CLOUDINARY_FOLDER=govTech
```

Frontend (`frontend/.env.local`):

```
NODE_ENV=development
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/be
NEXTAUTH_SECRET=45ac78fa5c459c2c456a7390b26a8c0b
NEXTAUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dgkrcxt3p
```

---

## Run locally (without Docker)

Prerequisites: Node.js 20.x and npm.

1. Backend

- In a new terminal:
  - cd backend
  - npm install
  - Ensure `backend/.env` exists (see above)
  - Initialize DB and migrations: `npx prisma migrate dev --name init`
  - (Optional) Seed data: `npm run seed`
  - Start dev server: `npm run start:dev`
  - Backend ready at http://localhost:3001/be

2. Frontend

- In another terminal:
  - cd frontend
  - npm install
  - Ensure `frontend/.env.local` exists (see above)
  - Start dev server: `npm run dev`
  - Frontend ready at http://localhost:3000

Seeded credentials (for quick testing):

- Admin: `admin@gov.lk` / `11111111`

Notes

- The backend serves under the `/be` prefix. Example: `GET http://localhost:3001/be` should return "Hello World!".
- CORS is configured for http://localhost:3000.

---

## Run with Docker Compose

Requirements: Docker Desktop.

1. Build and start:

- From repo root: `docker compose up -d --build`
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/be

2. What Compose does

- Builds multi-stage images for backend and frontend.
- Backend on start runs: `prisma migrate deploy` then `npm run seed` then starts Nest.
- A named volume persists SQLite at `/data/dev.db` inside the backend container.

3. Useful Docker commands

- Stop and remove: `docker compose down`
- Reset data (drops volume): `docker compose down -v`
- Tail backend logs: `docker logs -f govtech-backend`
- Tail frontend logs: `docker logs -f govtech-frontend`

Troubleshooting

- If you changed the Prisma schema but the container says "No migration found":
  - Generate a migration locally: `cd backend && npx prisma migrate dev --name <change>`
  - Rebuild: `docker compose up -d --build backend`
- Seeding runs on each backend start and may conflict with unique constraints on subsequent runs. If you see duplicate errors, reset data with `docker compose down -v` and start again. If desired, we can make the seed idempotent.

---

## Project structure (simplified)

- backend/ NestJS app, Prisma schema & seed
- frontend/ Next.js app (App Router)
- docker-compose.yml Orchestration for both apps

---

## Common scripts

Backend (`backend/package.json`):

- Build: `npm run build`
- Start dev: `npm run start:dev`
- Seed: `npm run seed`
- Prisma:
  - `npx prisma migrate dev --name init`
  - `npx prisma generate`

Frontend (`frontend/package.json`):

- Dev: `npm run dev`
- Build: `npm run build`
- Start (production): `npm start`

---

## API base URL

- All backend routes are under `/be` (e.g., `/be/auth/sign-in`, `/be/department/get-all`).
- The frontend uses `NEXT_PUBLIC_BACKEND_URL` to reach the backend.
