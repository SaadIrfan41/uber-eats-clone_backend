import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class UpdateRestaurantInput {
  @Field()
  @IsNotEmpty()
  restaurantId: string;

  @Field({ nullable: true })
  @IsOptional()
  coverImage: string;

  @Field({ nullable: true })
  @IsOptional()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  address: string;

  @Field({ nullable: true })
  @IsOptional()
  categoryName: string;
}
