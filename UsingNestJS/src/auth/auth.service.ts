import { Injectable }          from '@nestjs/common';
import * as jwt                from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { USER_ROLE_MAP }       from '../config';

@Injectable()
export class AuthService {
  /*
   * Given a username, produce a signed JWT — or null when the user
   * is not in the dummy roster.
   *
   * Token structure:
   *   claims  → sub  (username)
   *   claims  → role (Admin | OrderQuery | GenericQuery)
   *   issuer  → "training"
   *   audience→ "training-client"
   *   expiry  → 1 h
   */
  generateToken(username: string): { token: string; role: string } | null {
    
    const role = USER_ROLE_MAP[username.toLowerCase()];
    if (!role) return null;                         // unknown user

    const secret  = process.env.JWT_SECRET!;
    const issuer  = process.env.JWT_ISSUER  ?? 'training';
    const audience= process.env.JWT_AUDIENCE ?? 'training-client';
    const expiresIn = (process.env.JWT_EXPIRES_IN ?? '1h') as any;

    const options: SignOptions = { issuer, audience, expiresIn };

    const token = jwt.sign(
      { sub: username, role },             // payload
      secret,
      options
    );

    return { token, role };
  }
}