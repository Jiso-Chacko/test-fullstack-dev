import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import {AuthGuard} from "./common/guards/auth.guard";
import { GlobalExceptionFilter } from "./common/exceptions/global-exceptions.filter";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
  }));

  app.useGlobalFilters(new GlobalExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
      .setTitle('Nricher API')
      .setDescription(`Project and Analysis API with role based access control
      
      ## Authentication
      This API uses simplified header-based authentication. You can authenticate using either:
      - x-user-id: Provide a user ID (1, 2, 3, 4, 5)
      - x-user-email: Provide a user email (superadmin@test.com, admin1@test.com, etc.)
      
      ## Test Users
      - Super Admin: x-user-id: 1 or x-user-email: superadmin@test.com
      - Admin 1: x-user-id: 2 or x-user-email: admin1@test.com  
      - Admin 2: x-user-id: 3 or x-user-email: admin2@test.com
      - User 1: x-user-id: 4 or x-user-email: user1@test.com (has access to Admin1's project)
      - User 2: x-user-id: 5 or x-user-email: user2@test.com
      
      ## Access Rules
      - Super Admin: Full access to all projects and analyses
      - Admin: Can create projects, manage own projects, create analyses in own projects
      - User: Read-only access to projects/analyses they've been granted access to
      
      `)
    .setVersion('1.0')
      .addSecurity('x-user-id', {
          type: 'apiKey',
          in: 'header',
          name: 'x-user-id',
      })
      .addSecurity('x-user-email', {
          type: 'apiKey',
          in: 'header',
          name: 'x-user-email',
      })
      // Apply security globally to all endpoints
      .addGlobalParameters({
          name: 'x-user-id',
          in: 'header',
          required: false,
          description: 'User ID for authentication',
      },{
          name: 'x-user-email',
          in: 'header',
          required: false,
          description: 'User email for authentication',
      })
      .addTag('projects', 'Project management endpoints')
      .addTag('analyses', 'Analysis management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
    console.log(`API Doucmentation: http://localhost:3000/api-docs`);
}
bootstrap();
