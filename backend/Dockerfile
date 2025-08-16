# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (including dev for building)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Generate Prisma Client and build NestJS
RUN npx prisma generate
RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy production build output, prisma schema, node_modules, and sources needed for seeding
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /app/nest-cli.json ./nest-cli.json
# Make sure package.json is available for npm scripts (seed)
COPY --from=builder /app/package*.json ./

# Ensure data directory for SQLite exists
RUN mkdir -p /data

EXPOSE 4000

# Run database migrations, seed data on first run only, then start the app
CMD ["sh", "-c", "npx prisma migrate deploy && if [ ! -f /data/.seeded ]; then npm run seed && touch /data/.seeded; fi; node dist/src/main.js"]
