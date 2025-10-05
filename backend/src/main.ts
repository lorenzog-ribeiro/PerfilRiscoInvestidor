import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // Aceitar múltiplas origens
  const allowedOrigins = [
    'http://localhost:3000', // Dev local
    'http://localhost:3001', // Dev local (frontend)
    'https://devsof.duodevs.com.br', // Produção frontend
    process.env.FRONTEND_URL, // Dinâmico
  ].filter(Boolean); // Remove undefined

  app.enableCors({
    origin: (origin, callback) => {
      // Permite requests sem origin (ex: Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
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
