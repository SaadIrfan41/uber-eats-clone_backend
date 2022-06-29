import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const { req } = GqlExecutionContext.create(context).getContext();

    const user = req['user'];

    // const cookie = ctx;
    // console.log(cookie);
    return user;
  },
);
