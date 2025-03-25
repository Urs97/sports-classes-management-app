# 🛠️ Stage 1: Build the app
FROM node:22-slim AS builder

# Install dependencies for native builds (optional: build-essential - if you need to compile native modules like bcrypt)
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential procps && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
    
WORKDIR /app

# Copy only package files first (for better layer caching)
COPY package*.json ./

# Install ALL dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Compile TypeScript
RUN npm run build

# 🚀 Stage 2: Production-ready image
FROM node:22-slim

WORKDIR /app

# Only install production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy built app and runtime deps from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main.js"]
