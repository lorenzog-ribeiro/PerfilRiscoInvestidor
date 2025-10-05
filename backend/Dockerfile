# Stage 1: Build
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm exec prisma generate

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine AS runtime

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory
WORKDIR /usr/src/app

# Add permissions to the working directory for the 'node' user
RUN chown -R node:node /usr/src/app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN pnpm exec prisma generate

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Configure the port where Node.js will run
ENV PORT=3333

EXPOSE 3333

# Switch to 'node' user for security
USER node

# Start the Node.js server
CMD ["node", "dist/main"]
