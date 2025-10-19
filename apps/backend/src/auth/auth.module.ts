import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret:
        'bff4f886ec71c1c15d44ae1f66354a6388d10c9682cacfe9f2f4360acb2a18c381f1721540a82374646de58e251a3121fde4df6db198b6b7a9b5faf9e630b349',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, AuthModule],
})
export class AuthModule {}
