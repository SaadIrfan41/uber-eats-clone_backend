import { GqlExecutionContext } from '@nestjs/graphql';

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CookieOptions } from 'express';

const cookieOptions: CookieOptions = {
  httpOnly: false,
  sameSite: 'none',
  secure: true,
};
@Injectable()
export class GlobalAuthInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // console.log('Interceptor is called');
    const ctx = GqlExecutionContext.create(context);
    const { req, res } = ctx.getContext();
    if ('authorization' in req.headers) {
      const token = req.headers['authorization'].split(' ')[1];

      res.cookie('token', token, cookieOptions);
      // ctx['user'] = req['user'];
      // console.log(ctx);
    }
    return next.handle();
  }
}
