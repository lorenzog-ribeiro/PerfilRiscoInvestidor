FROM node:20-alpine AS base

# Configuração de ambiente
ENV PORT=3001
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Instala dependências apenas para compilação
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Construção da aplicação
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Configura o next.config.js para output standalone se não existir
RUN if [ ! -f next.config.js ]; then \
    echo "/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  output: 'standalone',\n  reactStrictMode: true,\n  swcMinify: true,\n};\n\nmodule.exports = nextConfig;" > next.config.js; \
    elif ! grep -q "output.*standalone" next.config.js; then \
    sed -i "s/const nextConfig = {/const nextConfig = {\n  output: 'standalone',/" next.config.js; \
    fi

# Compila a aplicação
RUN npm run build

# Adiciona script para garantir que o servidor use a porta 3001
RUN echo 'process.env.PORT = process.env.PORT || 3001;' > server-port-config.js

# Produção
FROM base AS runner
WORKDIR /app

# Adiciona um usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Configura as permissões para o diretório
RUN mkdir -p /app/.next/cache && chown -R nextjs:nodejs /app

# Copia o código construído
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Altera para o usuário não-root
USER nextjs

# Expõe a porta
EXPOSE 3001

# Comando para iniciar a aplicação com configuração de porta correta
CMD ["node", "-r", "./server-port-config.js", "server.js"]