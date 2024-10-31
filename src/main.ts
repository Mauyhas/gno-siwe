import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';

dotenv.config(); 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //TODO replace client origin
  app.enableCors({
    origin: 'http://192.168.31.81:8081', 
    credentials: true, // Include this if your client needs to send cookies or other credentials
  });
  app.use(
    session({
      secret: 'XYZ123-GYU457-FFF123-KOKOpp55-popo4545', 
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, 
    }),
  );
  await app.listen(3000);
}
bootstrap();