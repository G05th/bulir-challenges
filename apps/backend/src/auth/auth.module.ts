import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET')!;

        // Garante que o valor expiresIn é uma string e aplica o 'as any' para satisfazer o compilador
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN') as string;

        return {
          secret: secret,
          signOptions: {
            expiresIn: expiresIn as any, // Força a aceitação pelo compilador
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, AuthModule, PassportModule],
})
export class AuthModule {}
