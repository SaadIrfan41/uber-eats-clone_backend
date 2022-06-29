import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dto/login-user.input';
import { plainToClass } from 'class-transformer';

import { User } from './entities/user.entity';

import { AuthService } from 'src/auth/auth.service';

// import { CreateUserInput } from './dto/create-user.input';
// import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}
  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async create(createUserInput: Prisma.UserCreateInput) {
    try {
      const hashedPassword = await this.hashData(createUserInput.password);
      const user = await this.prisma.user.create({
        data: {
          ...createUserInput,
          password: hashedPassword,
        },
      });

      return plainToClass(User, user);
    } catch (err) {
      // console.log(err.message);

      if (err.code === 'P2002' && err.meta.target === 'User_email_key') {
        throw new ConflictException('Email Already Taken');
      }
      if (err.code === 'P2002' && err.meta.target === 'User_username_key') {
        throw new ConflictException('UserName Already Taken');
      }
      throw new Error(err.message);
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    return users.map((user) => plainToClass(User, user));
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) throw new ConflictException('Invalid User ID');
      return plainToClass(User, user);
    } catch (err) {
      if (err.code === 'P2023') {
        throw new ConflictException('Invalid User ID');
      }
    }
  }

  async loginUser(LoginUserInput: LoginUserInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: LoginUserInput.email,
      },
    });
    if (!user) throw new UnauthorizedException('Invalid Email OR Password');
    const passwordCheck = await bcrypt.compare(
      LoginUserInput.password,
      user.password,
    );
    if (!passwordCheck)
      throw new UnauthorizedException('Invalid Email OR Password');
    // console.log(await this.authService.generateToken(user.id));
    const accessToken = await this.authService.generateToken(user.id);
    // console.log(accessToken);
    if (!accessToken) throw new ForbiddenException('TOKEN NOT FOUND');

    return { accessToken };
  }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
