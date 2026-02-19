# Production Dockerfile for ZoneSport backend (server)

# 1) Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install build deps
COPY package*.json ./
RUN npm ci

# Copy server source
COPY . .

# Build the Nest app (assumes working directory is server when building image via context)
RUN npm run build

# 2) Run stage
FROM node:18-alpine
WORKDIR /app

# Copy built artifacts and node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main"]
