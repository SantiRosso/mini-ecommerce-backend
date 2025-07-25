import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  <T = any>(
    data: keyof T | undefined,
    ctx: ExecutionContext,
  ): T | T[keyof T] | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user: T = request.user;

    return data ? user?.[data] : user;
  },
);
