import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  serveRoot(@Res() res: Response) {
    //mapping http://HOST:PORT to index
    res.sendFile(join(__dirname, '..', 'client', 'dist/index.html'));
  }
}
