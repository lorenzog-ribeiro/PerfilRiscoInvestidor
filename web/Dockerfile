FROM node:20-alpine AS build

RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copiar arquivos de ambiente
COPY .env.production .env.production
# ou criar diretamente:
RUN echo 'NEXT_PUBLIC_BASE_URL=https://backenddev.duodevs.com.br/' > .env.production

COPY . .

# IMPORTANTE: Definir a variável no build time
ENV NEXT_PUBLIC_BASE_URL=https://backenddev.duodevs.com.br/

RUN echo 'module.exports = { eslint: { ignoreDuringBuilds: true }, typescript: { ignoreBuildErrors: true }, output: "standalone" };' > next.config.js

RUN pnpm build

FROM node:20-alpine AS runtime

RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

ENV PORT=3001
ENV NODE_ENV=production
# Também no runtime (por garantia)
ENV NEXT_PUBLIC_BASE_URL=https://backenddev.duodevs.com.br/

EXPOSE 3001

USER node
CMD ["pnpm", "start", "--", "--port", "3001"]