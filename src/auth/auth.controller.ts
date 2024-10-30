// src/auth/auth.controller.ts

import { Controller, Get, Post, Body, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { generateNonce, SiweMessage } from 'siwe';

@Controller()
export class AuthController {
  @Get('nonce')
  getNonce(@Req() req: Request, @Res() res: Response): void {
    const nonce = generateNonce();
    req.session.nonce = nonce; // Now TypeScript knows `nonce` exists
    res.setHeader('Content-Type', 'text/plain');
    res.send(nonce);
  }

  @Post('verify')
  async verify(@Req() req: Request, @Body() body: { message: string; signature: string }, @Res() res: Response): Promise<void> {
    const { message, signature } = body;
    const siweMessage = new SiweMessage(message);

    try {
      if (siweMessage.nonce !== req.session.nonce) {
        throw new HttpException('Invalid nonce', HttpStatus.UNAUTHORIZED);
      }

      await siweMessage.verify({ signature });
      req.session.siwe = siweMessage; // Now TypeScript recognizes `siwe` property
      res.send(true);
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).send(false);
    }
  }

  @Get('me')
  getMe(@Req() req: Request): any {
    if (req.session.siwe) {
      return { address: req.session.siwe.address };
    }
    throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
  }
}
