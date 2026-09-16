# 🐳 Docker Setup - Perfil Risco Investidor

Este guia explica como usar Docker e Docker Compose para executar o backend da aplicação.

## 📋 Pré-requisitos

- Docker (versão 20.10 ou superior)
- Docker Compose (versão 2.0 ou superior)
- Arquivo `.env` configurado (use `.env.example` como base)

## 🚀 Início Rápido

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e ajuste as variáveis:

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações.

### 2. Build e Execução com Docker Compose

Na raiz do projeto:

```bash
# Build e iniciar os containers
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Parar os containers
docker-compose down
```

### 3. Build Manual do Docker

Se preferir usar apenas Docker (sem compose):

```bash
cd backend

# Build da imagem
docker build -t perfil-risco-backend .

# Executar o container
docker run -d \
  --name perfil-risco-backend \
  -p 3333:3333 \
  -e DATABASE_URL="your_database_url" \
  -e FRONTEND_URL="http://localhost:3000" \
  perfil-risco-backend
```

## 🔧 Comandos Úteis

### Docker Compose

```bash
# Rebuild após mudanças no código
docker-compose up -d --build

# Ver logs em tempo real
docker-compose logs -f

# Parar containers
docker-compose stop

# Remover containers e volumes
docker-compose down -v

# Executar comandos dentro do container
docker-compose exec backend sh
```

### Docker

```bash
# Listar containers em execução
docker ps

# Ver logs do container
docker logs perfil-risco-backend

# Acessar shell do container
docker exec -it perfil-risco-backend sh

# Parar container
docker stop perfil-risco-backend

# Remover container
docker rm perfil-risco-backend

# Remover imagem
docker rmi perfil-risco-backend
```

## 🗄️ Prisma e Banco de Dados

### Executar Migrations

```bash
# Com docker-compose
docker-compose exec backend pnpm exec prisma migrate deploy

# Com docker
docker exec perfil-risco-backend pnpm exec prisma migrate deploy
```

### Gerar Prisma Client

```bash
# Com docker-compose
docker-compose exec backend pnpm exec prisma generate

# Com docker
docker exec perfil-risco-backend pnpm exec prisma generate
```

### Prisma Studio (GUI do banco)

```bash
# Com docker-compose
docker-compose exec backend pnpm exec prisma studio

# Com docker
docker exec -it perfil-risco-backend pnpm exec prisma studio
```

## 📦 Estrutura do Dockerfile

O Dockerfile usa **multi-stage build** para otimizar o tamanho da imagem:

1. **Stage 1 (builder)**: Instala todas as dependências e compila o código TypeScript
2. **Stage 2 (runtime)**: Copia apenas os arquivos necessários para produção

### Benefícios:

- ✅ Imagem final menor (apenas dependências de produção)
- ✅ Build mais rápido com cache de layers
- ✅ Usa pnpm para gerenciamento de pacotes
- ✅ Executa com usuário não-root (segurança)

## 🔒 Segurança

- Container executa com usuário `node` (não-root)
- Apenas porta 3333 é exposta
- Variáveis sensíveis via environment variables
- `.dockerignore` exclui arquivos desnecessários

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs backend

# Verificar se a porta está em uso
netstat -ano | findstr :3333  # Windows
lsof -i :3333                 # Linux/Mac
```

### Erro de conexão com banco de dados

- Verifique se `DATABASE_URL` está correto no `.env`
- Se usar PostgreSQL no docker-compose, descomente a seção do postgres
- Aguarde o banco inicializar completamente antes do backend

### Rebuild completo

```bash
# Remover tudo e reconstruir
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Monitoramento

### Verificar saúde do container

```bash
# Status dos containers
docker-compose ps

# Uso de recursos
docker stats perfil-risco-backend
```

### Logs estruturados

```bash
# Últimas 100 linhas
docker-compose logs --tail=100 backend

# Logs desde um horário específico
docker-compose logs --since 2024-01-01T00:00:00 backend
```

## 🌐 Variáveis de Ambiente

| Variável       | Descrição               | Exemplo                               |
| -------------- | ----------------------- | ------------------------------------- |
| `DATABASE_URL` | URL de conexão do banco | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV`     | Ambiente de execução    | `production`                          |
| `PORT`         | Porta do servidor       | `3333`                                |
| `FRONTEND_URL` | URL do frontend (CORS)  | `http://localhost:3000`               |

## 📝 Notas

- O Dockerfile está otimizado para produção
- Para desenvolvimento, considere usar `docker-compose.dev.yml` com volumes montados
- Prisma migrations são executadas automaticamente no build
- Cache de layers do Docker acelera builds subsequentes

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `docker-compose logs -f`
2. Confirme as variáveis de ambiente
3. Teste a conexão com o banco de dados
4. Verifique se as portas não estão em uso

---

**Desenvolvido com ❤️ usando NestJS, Prisma e pnpm**
