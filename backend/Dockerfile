FROM node:18-alpine AS runtime

WORKDIR /app

# Copia apenas os arquivos necessários
COPY package*.json ./

# Instala as dependências de produção
RUN npm ci --only=production

# Copia o restante dos arquivos
COPY . .

COPY prisma ./prisma
RUN npx prisma generate

# Configura a porta onde o Node.js irá rodar
ENV PORT=3333

EXPOSE 3333

# Altera o usuário para 'node' para rodar com menos privilégios
USER node

# Inicia o servidor Node.js
CMD ["npm", "start"]
