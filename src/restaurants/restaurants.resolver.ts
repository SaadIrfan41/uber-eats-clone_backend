import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantInput } from './dto/create-restaurant.input';
import { UpdateRestaurantInput } from './dto/update-restaurant.input';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';

import { Roles } from 'src/auth/decorator/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { DeleteRestaurantInput } from './dto/delete-restaurant.input';
import { Category } from './entities/category.entity';
import { SingleCategoryInput } from './dto/single-category.input';
import { SingleCategoryOutput } from './dto/single-category.output';
import {
  AllRestaurantInput,
  AllRestaurantOutput,
} from './dto/all-restaurant.input';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dto/search-restaurant.input';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Mutation(() => String)
  @Roles('restaurantOwner')
  createRestaurant(
    @CurrentUser() currentUser: User,
    @Args('createRestaurantInput') createRestaurantInput: CreateRestaurantInput,
  ) {
    return this.restaurantsService.createRestaurant(
      createRestaurantInput,
      currentUser,
    );
  }

  @Query(() => AllRestaurantOutput, { name: 'restaurants' })
  findAll(
    @Args('AllRestaurantInput') allRestaurantInput: AllRestaurantInput,
  ): Promise<any> {
    return this.restaurantsService.findAllRestaurants(allRestaurantInput);
  }
  @Query(() => SearchRestaurantOutput, { name: 'searchRestaurant' })
  searchRestaurant(
    @Args('AllRestaurantInput') searchRestaurantInput: SearchRestaurantInput,
  ) {
    return this.restaurantsService.searchRestaurantByName(
      searchRestaurantInput,
    );
  }

  @Query(() => Restaurant, { name: 'restaurant' })
  findOne(@Args('id') id: string) {
    return this.restaurantsService.findSingleRestaurant(id);
  }

  @Mutation(() => String)
  @Roles('restaurantOwner')
  updateRestaurant(
    @CurrentUser() currentUser: User,
    @Args('updateRestaurantInput')
    updateRestaurantInput: UpdateRestaurantInput,
  ) {
    return this.restaurantsService.update(currentUser, updateRestaurantInput);
  }

  @Mutation(() => String)
  @Roles('restaurantOwner')
  removeRestaurant(
    @CurrentUser() currentUser: User,
    @Args('deleteRestaurantInput') deleteRestaurantInput: DeleteRestaurantInput,
  ) {
    return this.restaurantsService.remove(deleteRestaurantInput, currentUser);
  }
}

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @ResolveField(() => Int)
  async restaurantCount(@Parent() category: any) {
    return await this.restaurantsService.totalRestaurantsCount(category);
  }

  @Query(() => [Category], { name: 'Categories' })
  findAll() {
    return this.restaurantsService.findAllCategories();
  }
  @Query(() => SingleCategoryOutput, { name: 'Category' })
  // @Roles('Any')
  findOne(
    @Args('findSingleCategory') singleCategoryInput: SingleCategoryInput,
  ): Promise<SingleCategoryOutput> {
    return this.restaurantsService.findSingleCategory(singleCategoryInput);
  }
}
