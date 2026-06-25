# ─── Stage 1: Builder ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer-cached)
COPY package.json package-lock.json ./
RUN npm install

# Copy TypeScript config and source
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript to JavaScript
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

# Expose the application port (default 5000)
EXPOSE 5000

# Start the server
CMD ["node", "dist/index.js"]
