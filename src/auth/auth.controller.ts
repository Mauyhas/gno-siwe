import { Controller, Get, Post, Body, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { generateNonce, SiweMessage } from 'siwe';
import { Logger } from '@nestjs/common';

@Controller()
export class AuthController {

  private readonly logger = new Logger(AuthController.name);

  @Get('nonce')
  getNonce(@Req() req: Request, @Res() res: Response): void {
    this.logger.log('nonce request', req);
    const nonce = generateNonce();
    req.session.nonce = nonce;
    res.setHeader('Content-Type', 'text/plain');
    res.send(nonce);
  }

  @Post('verify')
  async verify(@Req() req: Request, @Body() body: { message: string; signature: string }, @Res() res: Response): Promise<void> {
    this.logger.log('verify request', req);
    const { message, signature } = body;
    const siweMessage = new SiweMessage(message);
    try {
      if (siweMessage.nonce !== req.session.nonce) {
        this.logger.error('verify request fail: siweMessage.nonce !== req.session.nonce', siweMessage);
        throw new HttpException('Invalid nonce', HttpStatus.UNAUTHORIZED);
      }
      await siweMessage.verify({ signature });
      req.session.siwe = siweMessage; // Now TypeScript recognizes `siwe` property
      res.send(true);
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).send(false);
    }
  }
}
