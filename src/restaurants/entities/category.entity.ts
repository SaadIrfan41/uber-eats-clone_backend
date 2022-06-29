import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Restaurant } from './restaurant.entity';

@ObjectType()
export class Category {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @IsString()
  image: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  slug: string;

  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];

  @Field()
  updatedAt: Date;
  @Field()
  createdAt: Date;
}
