import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class SingleCategoryInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsNumber()
  page: number;

  @Field()
  @IsString()
  slug: string;
  @Field(() => Int, { nullable: true })
  totalPages: number;
}
