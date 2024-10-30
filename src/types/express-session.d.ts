import 'express-session';
import { SiweMessage } from 'siwe';

declare module 'express-session' {
  interface SessionData {
    nonce?: string;
    siwe?: SiweMessage; // Use SiweMessage as the type
  }
}