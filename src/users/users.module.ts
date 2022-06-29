import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    UsersResolver,
    UsersService,
    PrismaService,
    AuthService,
    JwtService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
