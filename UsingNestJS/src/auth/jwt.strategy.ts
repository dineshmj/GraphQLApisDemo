import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy }                  from '@nestjs/passport';
import { Strategy, ExtractJwt }              from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Where to pull the token from the incoming HTTP request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,
      secretOrKey:      process.env.JWT_SECRET!,
      issuer:           process.env.JWT_ISSUER   ?? 'training',
      audience:         process.env.JWT_AUDIENCE  ?? 'training-client',
    });
  }

  /*
   * Called after passport-jwt has verified the signature and standard claims.
   * The returned object becomes `req.user` downstream.
   */
  validate(payload: { sub: string; role: string }) {
    if (!payload.sub || !payload.role) {
      throw new UnauthorizedException('Token payload is incomplete.');
    }
    return { username: payload.sub, role: payload.role };
  }
}