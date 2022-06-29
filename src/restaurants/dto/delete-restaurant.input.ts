import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteRestaurantInput {
  @Field()
  @IsNotEmpty()
  restaurantId: string;
}
