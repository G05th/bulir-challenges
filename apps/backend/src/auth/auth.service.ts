import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { nif: data.nif }],
      },
    });

    if (existingUser) {
      throw new ConflictException('NIF ou Email já estão em uso');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        password: passwordHash,
        balance: 0.0,
      },
      select: { id: true, fullName: true, email: true, balance: true },
    });
    return newUser;
  }

  async validateUser(email: string, pass: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) return null;

    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  loginToken(user: SafeUser) {
    const payload = {
      email: user.email,
      role: user.role,
      userId: user.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        balance: user.balance,
      },
    };
  }
}
