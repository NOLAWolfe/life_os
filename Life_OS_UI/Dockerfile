# --- Stage 1: Build Frontend ---
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies if any (none currently needed for basic build)
# RUN apt-get update && apt-get install -y ...

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy source code and build
COPY . .
# Generate Prisma Client
RUN npx prisma generate
RUN npm run build

# --- Stage 2: Production Server ---
FROM node:20-slim

WORKDIR /app

# Install openssl and other potential dependencies for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
# Copy backend server files
COPY server.js ./
COPY server/ ./server/
COPY prisma/ ./prisma/
COPY scripts/ ./scripts/
COPY entrypoint.sh ./

# Generate Prisma Client in the final stage
RUN npx prisma generate

# Set environment variables
ENV NODE_ENV=production
ENV APP_ENV=production
ENV PORT=4005
ENV DATABASE_URL="file:./dev.db"

# Expose the application port
EXPOSE 4005

# Make sure entrypoint is executable
RUN chmod +x entrypoint.sh

# Use entrypoint script to handle DB setup
ENTRYPOINT ["./entrypoint.sh"]
