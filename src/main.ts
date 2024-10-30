import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';

dotenv.config(); // Load environment variables from .env

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //TODO replace client origin
  app.enableCors({
    origin: 'http://192.168.31.81:8081', // Replace with your client’s URL 
    credentials: true, // Include this if your client needs to send cookies or other credentials
  });
  app.use(
    session({
      secret: 'your_secret_key', // Replace with a strong secret
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Set to true if using HTTPS
    }),
  );
  await app.listen(3000);
}
bootstrap();