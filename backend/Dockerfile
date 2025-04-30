FROM node:18-alpine AS runtime

WORKDIR /app

# Adiciona permissões ao diretório de trabalho para o usuário 'node'
RUN chown -R node:node /app

# Copia apenas os arquivos necessários
COPY package*.json ./

# Instala as dependências de produção
RUN npm ci --only=production

# Copia o restante dos arquivos para o diretório /app
COPY . .

# Copia o diretório do Prisma e gera os tipos necessários
COPY prisma ./prisma
RUN npx prisma generate

# Configura a porta onde o Node.js irá rodar
ENV PORT=3333

EXPOSE 3333

# Altera o usuário para 'node' para rodar com menos privilégios
USER node

# Inicia o servidor Node.js
CMD ["npm", "start"]
