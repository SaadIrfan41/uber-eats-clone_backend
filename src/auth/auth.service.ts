import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  generateToken(userId: string) {
    const token = this.jwtService.signAsync(
      { id: userId },
      { secret: this.config.get('JWT_SECRET'), expiresIn: '1hr' },
    );

    return token;
  }
}
