FROM node:20-alpine AS build

RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

RUN echo 'NEXT_PUBLIC_BASE_URL=https://backendcvm.spaceorion.com.br/' > .env.production

COPY . .

ENV NEXT_PUBLIC_BASE_URL=https://backendcvm.spaceorion.com.br/

RUN echo 'module.exports = { eslint: { ignoreDuringBuilds: true }, typescript: { ignoreBuildErrors: true }, output: "standalone" };' > next.config.js

RUN pnpm build

FROM node:20-alpine AS runtime

RUN corepack enable

# ✅ Instalar Chromium e dependências necessárias para Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# ✅ Configurar Puppeteer para usar o Chromium instalado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

ENV PORT=3001
ENV NODE_ENV=production
ENV NEXT_PUBLIC_BASE_URL=https://backendcvm.spaceorion.com.br/

EXPOSE 3001

# ✅ Criar usuário node se não existir e ajustar permissões
RUN addgroup -g 1001 -S nodejs || true
RUN adduser -S nextjs -u 1001 || true
RUN chown -R nextjs:nodejs /app

USER nextjs

CMD ["pnpm", "start", "--port", "3001"]