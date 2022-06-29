import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class SearchRestaurantInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsNumber()
  page: number;

  @Field({ nullable: true })
  @IsString()
  name: string;
}
@ObjectType()
export class SearchRestaurantOutput {
  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
  @Field(() => Int, { nullable: true })
  totalPages: number;
  @Field(() => Int, { nullable: true })
  totalRestaurants: number;
}
