# Estágio de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos de package para instalar dependências
COPY package*.json ./
RUN npm ci

# Copia o código-fonte
COPY . .

# Gera os artefatos do Prisma
COPY prisma ./prisma
RUN npx prisma generate

# Compila o código (ajuste conforme sua aplicação)
RUN npm run build

# Estágio de runtime
FROM node:18-alpine AS runtime

WORKDIR /app

# Copia apenas o necessário do estágio de build
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Configurações de ambiente
ENV PORT=3333
ENV NODE_ENV=production

EXPOSE 3333

# Configura permissões e usuário
RUN chown -R node:node /app
USER node

# Inicia a aplicação
CMD ["npm", "start"]
