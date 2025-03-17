import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:29980'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger 설정
  const config = new DocumentBuilder().setTitle('PEEK API Documentation').setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      defaultModelsExpandDepth: -1,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
      supportedSubmitMethods: ['get', 'post', 'put', 'patch', 'delete'],
      locale: 'ko',
    },
  });
  // Swagger 설정 끝
  await app.listen(configService.get('SERVER_PORT') as string, () => {
    console.log(`Server is running on ${configService.get('SERVER_PORT')}`);
  });
}
bootstrap();
