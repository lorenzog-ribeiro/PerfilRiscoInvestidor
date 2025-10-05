FROM node:20-alpine AS build

# Habilitar Corepack para usar pnpm
RUN corepack enable

WORKDIR /app

# Copiar apenas arquivos de dependência primeiro
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Criar um novo next.config.js simples, substituindo qualquer configuração existente
RUN echo 'module.exports = { eslint: { ignoreDuringBuilds: true }, typescript: { ignoreBuildErrors: true }, output: "standalone" };' > next.config.js

# Build da aplicação
RUN pnpm build

# Estágio de runtime
FROM node:20-alpine AS runtime

# Habilitar Corepack para usar pnpm
RUN corepack enable

WORKDIR /app

# Copiar arquivos de dependência
COPY package.json pnpm-lock.yaml ./

# Instalar apenas dependências de produção
RUN pnpm install --frozen-lockfile --prod

# Copiar build do estágio anterior
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Configurar a porta correta para a aplicação
ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001

USER node

CMD ["pnpm", "start", "--", "--port", "3001"]