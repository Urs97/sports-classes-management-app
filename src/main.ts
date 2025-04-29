import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { FrontendConfig, AppConfig } from './common/config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const frontendConfig = app.get(FrontendConfig);
  const appConfig = app.get(AppConfig);

  app.setGlobalPrefix('api/v1');

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use(helmet());

  app.enableCors({
    origin: frontendConfig.ORIGIN,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sports Program Management API')
    .setDescription(
      'REST API for managing users, sports, classes, and schedules in a sports complex. Features include user registration, role-based access, class enrollment, and admin tools for managing sports programs.'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication and token handling')
    .addTag('Users', 'User management (Admin only)')
    .addTag('Sports', 'Manage available sports')
    .addTag('Classes', 'Create and enroll in sports classes')
    .addTag('Schedules', 'Assign weekly class sessions (Admin only)')
    .addTag('Enrollments', 'Track and manage user enrollments')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(appConfig.PORT);
}

bootstrap();
