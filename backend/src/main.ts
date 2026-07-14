import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // Remove campos não declarados nos DTOs (impede mass assignment) e
  // converte tipos conforme as anotações class-validator/class-transformer.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Aceitar múltiplas origens
  const allowedOrigins = [
    'http://localhost:3000', // Dev local
    'http://localhost:3001', // Dev local (frontend)
    'https://devsof.duodevs.com.br', // Produção frontend
    'https://perfilderiscosof.duodevs.com.br',
    'https://perfil.spaceorion.com.br',
    'https://perfilderisco.duodevs.com.br',
    process.env.FRONTEND_URL, // Dinâmico
  ].filter(Boolean); // Remove undefined

  app.enableCors({
    origin: (origin, callback) => {
      // Sem Origin (curl/health-check) não é um pedido cross-site do browser:
      // libera, mas continua sem credenciais úteis pois não há cookie de origem.
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Não vaza detalhe do CORS; apenas nega a origem.
        callback(null, false);
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  await app.listen(process.env.PORT ?? 3333);

  console.log(
    `🚀 Backend rodando em: http://localhost:${process.env.PORT ?? 3333}`,
  );
  console.log(`✅ CORS habilitado para:`, allowedOrigins);
}
bootstrap();
