import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateRestaurantInput {
  @Field()
  @IsString()
  coverImage: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  address: string;

  @Field()
  @IsString()
  category: string;

  @Field(() => ID)
  @IsString()
  owner: string;
}

// type Prisma.RestaurantCreateInput = {
//     id?: string;
//     name: string;
//     coverImage: string;
//     address: string;
//     createdAt?: string | Date;
//     updatedAt?: string | Date;
//     Category?: Prisma.CategoryCreateNestedOneWithoutRestaurantsInput;
//     User: Prisma.UserCreateNestedOneWithoutRestaurantsInput;
// }
