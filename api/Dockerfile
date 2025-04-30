FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de produção
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app . 
EXPOSE 3000
CMD ["npm", "start"]
