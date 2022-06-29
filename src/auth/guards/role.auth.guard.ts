import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Role } from '@prisma/client';
import { Observable } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<Role>('roles', context.getHandler());
    // console.log('ROLE', role);
    // console.log('Can Activate called');
    if (!role) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context).getContext().req;
    const user: User = ctx['user'];

    if (!user) {
      return false;
    }
    if (role.includes('Any')) {
      return true;
    }
    return role.includes(user.role);
  }
}
