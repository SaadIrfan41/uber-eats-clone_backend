import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from '../entities/category.entity';

@ObjectType()
export class SingleCategoryOutput {
  @Field(() => Category, { nullable: true })
  category?: Category;

  @Field(() => Int, { nullable: true })
  totalPages: number;
}
