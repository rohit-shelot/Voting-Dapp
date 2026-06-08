# ── Stage 1: Build ──────────────────────────────────────────────
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build args → Vite env vars (set these in Render dashboard)
ARG VITE_CONTRACT_ADDRESS
ARG VITE_CHAIN_ID=0x5752035

ENV VITE_CONTRACT_ADDRESS=$VITE_CONTRACT_ADDRESS
ENV VITE_CHAIN_ID=$VITE_CHAIN_ID

# Build the production bundle
RUN npm run build

# ── Stage 2: Serve ──────────────────────────────────────────────
FROM nginx:stable-alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Render uses the PORT env variable
EXPOSE 10000

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
