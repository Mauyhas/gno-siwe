import { Logger, Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { SiweMessage } from 'siwe';

@Injectable()
export class AuthGuard implements CanActivate {

  private readonly logger = new Logger(AuthGuard.name);
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return await validateRequest(request);
  }
}

async function validateRequest(req): Promise<boolean> {
  try {
    
    const { message, signature } = req.body; // Assuming message and signature are in the request body
    const siweMessage = new SiweMessage(message);

    // Validate the nonce
    if (siweMessage.nonce !== req.session?.nonce) {
      this.logger.error('validateRequest fail', req)
      throw new HttpException('Invalid nonce', HttpStatus.UNAUTHORIZED);
    }

    // Verify the signature
    await siweMessage.verify({ signature });

    // Store the verified SIWE message in the session
    req.session.siwe = siweMessage;
    return true;

  } catch (error) {
    this.logger.errorr('Verification failed:', error);
    throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
  }
}
