import { Controller, Post, Query, Res } from '@nestjs/common';
import { Response }                      from 'express';
import { AuthService }                   from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*
   * POST /auth/token?username=alice
   *
   * Returns  200 { token, role }   — on success
   * Returns  401 { error }         — when username is unknown
   *
   */
  @Post('token')
  login(@Query('username') username: string, @Res() res: Response): void {
    const result = this.authService.generateToken(username ?? '');

    if (!result) {
      res.status(401).json({ error: 'Invalid username. Access denied.' });
      return;
    }

    res.status(200).json(result);
  }
}