// src/auth/decorators/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request as ExpressRequest } from 'express';

export type SafeUser = Omit<User, 'password'>;

export const GetUser = createParamDecorator(
  (
    data: keyof SafeUser | undefined,
    ctx: ExecutionContext,
  ): SafeUser | SafeUser[keyof SafeUser] | null => {
    const request = ctx
      .switchToHttp()
      .getRequest<ExpressRequest & { user?: SafeUser }>();
    const user = request.user ?? null;

    if (!user) return null;

    if (data) {
      return user[data];
    }

    return user;
  },
);
