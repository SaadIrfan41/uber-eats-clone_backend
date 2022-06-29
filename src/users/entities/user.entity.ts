import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

export enum Role {
  customer = 'customer',
  restaurantOwner = 'restaurantOwner',
}
registerEnumType(Role, { name: 'Role' });

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;
  @IsString()
  @Field()
  username: string;

  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @Field()
  profilePicUrl: string;

  @IsString()
  @Field()
  name: string;

  @Field(() => Role, { defaultValue: 'customer' })
  @IsString()
  role: Role;

  @Field(() => [Restaurant])
  restaurants: Restaurant[];

  @Field()
  @Exclude()
  @IsString()
  password: string;

  @Field()
  updatedAt: Date;
}
