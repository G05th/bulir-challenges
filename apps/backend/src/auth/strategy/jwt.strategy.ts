// src/auth/strategy/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Role, User } from '@prisma/client';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
interface JwtPayload {
  email: string;
  sub: number;
  role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken() as (
      req: unknown,
    ) => string | null;
    const options: StrategyOptions = {
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey:
        'bff4f886ec71c1c15d44ae1f66354a6388d10c9682cacfe9f2f4360acb2a18c381f1721540a82374646de58e251a3121fde4df6db198b6b7a9b5faf9e630b349',
    };
    super(options);
  }

  async validate(payload: JwtPayload): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Token inválido ou usuário não existe.');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      balance: user.balance,
    };
  }
}
