import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
// import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
// import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { LoginUserInput } from './dto/login-user.input';
import { LoggedUserOutput } from './dto/loggedIn-user.output';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { CurrentUser } from './decorator/current-user.decorator';
// import { UseGuards } from '@nestjs/common';
// import { GqlAuthGuard } from './guards/gql-jwt-auth.guard';
// import { AuthGuard } from './guards/gql-auth.guard';
// import { CurrentUser } from './decorator/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  // @UseGuards(GqlAuthGuard)
  // @UseGuards(JwtAuthGuard)
  @Roles('Any')
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }

  // @Query(() => User, { name: 'user' })
  // loginUser(@Args('id', { type: () => String }) id: string) {
  //   return this.usersService.findOne(id);
  // }
  @Query(() => LoggedUserOutput, { name: 'LoginUser' })
  loginUser(@Args('LoginUserInput') loginUserInput: LoginUserInput) {
    return this.usersService.loginUser(loginUserInput);
  }
  @Query(() => User)
  // @UseGuards(AuthGuard)
  @Roles('Any')
  currentUser(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.usersService.update(updateUserInput.id, updateUserInput);
  // }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
