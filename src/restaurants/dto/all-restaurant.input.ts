import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class AllRestaurantInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsNumber()
  page: number;
}

@ObjectType()
export class AllRestaurantOutput {
  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];

  @Field(() => Int, { nullable: true })
  totalPages: number;
}
