import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { EnvVariables } from './config/env/env-variables.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  const options = new DocumentBuilder()
    .setTitle('Flights API')
    .setDescription('Scheduled flights')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: { filter: true },
  });

  await app.listen(configService.get(EnvVariables.APP_PORT) || 3000);
}
bootstrap();
