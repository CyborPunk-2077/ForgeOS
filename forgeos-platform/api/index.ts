import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

let cached: express.Express | null = null;

async function createApp(): Promise<express.Express> {
  if (cached) return cached;

  const server = express();
  server.get('/', (_req, res) => res.redirect('/docs'));

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ForgeOS API')
    .setDescription('ForgeOS enterprise platform API: authentication, users, organizations, RBAC and API keys.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.init();
  cached = server;
  return server;
}

export default async function handler(req: express.Request, res: express.Response) {
  const server = await createApp();
  return server(req, res);
}
