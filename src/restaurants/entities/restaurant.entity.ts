import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Category } from './category.entity';

@ObjectType()
export class Restaurant {
  @Field(() => ID)
  id: string;

  @Field()
  @IsString()
  coverImage: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  address: string;

  @Field(() => Category, { nullable: true })
  category: Category;

  @Field(() => User)
  owner: User;

  @Field()
  updatedAt: Date;

  @Field()
  createdAt: Date;
}
