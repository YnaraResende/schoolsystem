import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupRedoc } from './shared/middlewares/reddoc.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('School System API')
    .setDescription('School System API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  setupRedoc(app);
  await app.listen(Number(process.env.PORT) || 3010);
}
bootstrap();
