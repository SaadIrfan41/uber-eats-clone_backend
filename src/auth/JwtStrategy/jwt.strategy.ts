import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      cache: true,
      rateLimit: true,
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
      handleSigningKeyError: (err) => console.error('JWT ERROR', err),
      // passReqToCallback: true,
    });
  }

  async validate(payload: any, req: Request) {
    try {
      const user = await this.usersService.findOne(payload.id);
      // console.log(user);
      if (!user) {
        throw new UnauthorizedException();
      }
      req['user'] = user;
      return user;
    } catch (error) {
      console.log(error.message);
    }
  }
}
