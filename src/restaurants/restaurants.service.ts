import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User } from 'src/users/entities/user.entity';
import {
  AllRestaurantInput,
  AllRestaurantOutput,
} from './dto/all-restaurant.input';
import { CreateRestaurantInput } from './dto/create-restaurant.input';
import { DeleteRestaurantInput } from './dto/delete-restaurant.input';
import { SearchRestaurantInput } from './dto/search-restaurant.input';
import { SingleCategoryInput } from './dto/single-category.input';
import { SingleCategoryOutput } from './dto/single-category.output';
import { UpdateRestaurantInput } from './dto/update-restaurant.input';
import { Category } from './entities/category.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly prisma: PrismaService, // private readonly authService: AuthService,
  ) {}

  async getRestaurantData(restaurantId: string, ownerId: string) {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: {
          id: restaurantId,
        },
      });
      if (!restaurant) throw new ConflictException('Restaurant Not Found');
      if (restaurant.ownerId !== ownerId)
        throw new ConflictException('You are not the Owner of this restaurant');
      return restaurant;
    } catch (err) {
      if (err.code === 'P2023') {
        throw new ConflictException('Invalid Restaurant ID');
      }
    }
  }

  async createRestaurant(
    createRestaurantInput: CreateRestaurantInput,
    owner: User,
  ) {
    const duplicateRestaurant = await this.prisma.restaurant.findUnique({
      where: {
        name: createRestaurantInput.name,
      },
    });
    if (duplicateRestaurant)
      throw new ConflictException(
        `Restaurant Name ${createRestaurantInput.name} already exists`,
      );
    const categoryName = createRestaurantInput.category.trim().toLowerCase();
    // console.log('Owner', owner);
    const categorySlug = categoryName.replace(/ /g, '-');
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          slug: categorySlug,
        },
      });
      if (!category) {
        const newCategory = await this.prisma.category.create({
          data: {
            name: categoryName,
            slug: categorySlug,
          },
        });

        await this.prisma.restaurant.create({
          data: {
            name: createRestaurantInput.name,
            address: createRestaurantInput.address,
            coverImage: createRestaurantInput.coverImage,
            categoryId: newCategory.id,
            ownerId: owner.id,
          },
        });
        return `Restaurant ${createRestaurantInput.name} Created Successfully `;
      }
      await this.prisma.restaurant.create({
        data: {
          name: createRestaurantInput.name,
          address: createRestaurantInput.address,
          coverImage: createRestaurantInput.coverImage,
          categoryId: category.id,
          ownerId: owner.id,
        },
      });
      // console.log(newRestaurant);
      return `Restaurant ${createRestaurantInput.name} Created Successfully `;
    } catch (error) {
      console.log(error);
      // if (error.code === 'P2002' && error.meta.target === 'User_email_key') {
      //   throw new ConflictException(`A Restaurant with the  name ${createRestaurantInput.name} already exists`);
      // }
    }
  }

  async findAllRestaurants(allRestaurantInput: AllRestaurantInput) {
    try {
      const [totalRestaurants, restaurants] = await this.prisma.$transaction([
        this.prisma.restaurant.count(),

        this.prisma.restaurant.findMany({
          take: 3,
          skip: (allRestaurantInput.page - 1) * 3,
          orderBy: [
            {
              createdAt: 'desc',
            },
          ],
          include: {
            // Category: true,
            Category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
      ]);

      console.log(restaurants);
      return {
        restaurants,
        totalPages: Math.ceil(totalRestaurants / 3),
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findSingleRestaurant(id: string) {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: {
          id,
        },
      });
      if (!restaurant) throw new ConflictException('Restaurant Not Found');
      return restaurant;
    } catch (error) {
      console.log(error);
    }
  }
  async searchRestaurantByName({ name, page }: SearchRestaurantInput) {
    try {
      const [totalRestaurants, restaurants] = await this.prisma.$transaction([
        this.prisma.restaurant.count({
          where: {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          },
        }),

        this.prisma.restaurant.findMany({
          take: 3,
          skip: (page - 1) * 3,
          where: {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          },
          // include: {
          //   _count: {
          //     select: ,
          //   },
          // },
        }),
      ]);

      if (!restaurants) throw new ConflictException('Restaurant Not Found');
      // console.log(restaurants);
      // console.log('totalPages:', Math.ceil(totalRestaurants / 3));
      // console.log('totalRestaurants:', totalRestaurants);
      return {
        restaurants,
        totalPages: Math.ceil(totalRestaurants / 3),
        totalRestaurants,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    currentUser: User,
    updateRestaurantInput: UpdateRestaurantInput,
  ) {
    try {
      const restaurant = await this.getRestaurantData(
        updateRestaurantInput.restaurantId,
        currentUser.id,
      );
      let category: Category = null;
      if (updateRestaurantInput.categoryName) {
        const categoryName = updateRestaurantInput.categoryName
          .trim()
          .toLowerCase();

        const categorySlug = categoryName.replace(/ /g, '-');
        category = await this.prisma.category.findUnique({
          where: {
            slug: categorySlug,
          },
        });
        if (!category) {
          const newCategory = await this.prisma.category.create({
            data: {
              name: categoryName,
              slug: categorySlug,
            },
          });

          await this.prisma.restaurant.update({
            data: {
              name: updateRestaurantInput.name,
              address: updateRestaurantInput.address,
              coverImage: updateRestaurantInput.coverImage,
              categoryId: newCategory.id,
              ownerId: currentUser.id,
            },
            where: {
              id: updateRestaurantInput.restaurantId,
            },
          });
          return `Restaurant Updated Successfully `;
        }
      }
      console.log(category);

      await this.prisma.restaurant.update({
        data: {
          name: updateRestaurantInput.name,
          address: updateRestaurantInput.address,
          coverImage: updateRestaurantInput.coverImage,
          categoryId: category ? category.id : restaurant.categoryId,
          ownerId: currentUser.id,
        },
        where: {
          id: updateRestaurantInput.restaurantId,
        },
      });
      return `Restaurant Updated Successfully `;
    } catch (error) {
      console.log('THIS ERROR', error);
    }
  }

  async remove(deleteRestaurantInput: DeleteRestaurantInput, owner: User) {
    try {
      const restaurant = await this.getRestaurantData(
        deleteRestaurantInput.restaurantId,
        owner.id,
      );
      await this.prisma.restaurant.delete({
        where: {
          id: restaurant.id,
        },
      });

      return `${restaurant.name} Restaurant deleted Successfully`;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAllCategories() {
    try {
      const categories = await this.prisma.category.findMany({
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        include: {
          _count: {
            select: { restaurants: true },
          },
          restaurants: true,
        },
      });

      return categories;
    } catch (error) {
      console.log(error);
    }
  }
  async findSingleCategory(
    singleCategoryInput: SingleCategoryInput,
  ): Promise<SingleCategoryOutput> {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          slug: singleCategoryInput.slug,
        },

        include: {
          _count: {
            select: { restaurants: true },
          },
        },
      });

      if (!category) throw new ConflictException('Category Not Found');
      const restaurants = await this.prisma.restaurant.findMany({
        where: {
          categoryId: category.id,
        },
        take: 3,
        skip: (singleCategoryInput.page - 1) * 3,
      });
      // console.log(category);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      category.restaurants = restaurants;
      const totalRestaurantsCount = await this.totalRestaurantsCount(category);
      console.log(category);
      return { category, totalPages: Math.ceil(totalRestaurantsCount / 3) };
    } catch (err) {
      if (err.code === 'P2023') {
        throw new ConflictException('Invalid category Name');
      }
    }
  }

  async totalRestaurantsCount(category: any) {
    return category._count.restaurants;
  }
}
