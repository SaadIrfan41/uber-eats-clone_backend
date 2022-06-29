import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class SingleCategoryInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { nullable: true })
  totalPages: number;

  @Field()
  @IsString()
  slug: string;
}
