import { NestFactory } from '@nestjs/core';
import { AppModule } from './favorites.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({
      origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        'http://172.19.0.4:4173/',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    await app.listen(3001);
  } catch (e) {
    const error = e as Error;
    const errorMsg = `Cannot start favorite-microsevice. ${error.name}: ${error.message}`;
    console.error(errorMsg);
  }
}
bootstrap();
