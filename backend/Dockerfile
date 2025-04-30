FROM node:18-alpine AS runtime

WORKDIR /app

# Instala dependências de produção
COPY package*.json ./
RUN npm ci --only=production

# Adiciona permissões ao diretório de trabalho para o usuário 'node'
RUN chown -R node:node /app

# Copia o restante dos arquivos para o diretório /app
COPY . .

# Copia o diretório do Prisma e gera os tipos necessários
COPY prisma ./prisma
RUN npx prisma generate

# Instala os tipos para express e cors (se necessário)
RUN npm install --save-dev @types/express @types/cors

# Configura a porta onde o Node.js irá rodar
ENV PORT=3333

EXPOSE 3333

# Altera o usuário para 'node' para rodar com menos privilégios
USER node

# Inicia o servidor Node.js
CMD ["npm", "start"]
