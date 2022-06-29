import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CategoryResolver, RestaurantsResolver } from './restaurants.resolver';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [
    RestaurantsResolver,
    RestaurantsService,
    PrismaService,
    CategoryResolver,
  ],
})
export class RestaurantsModule {}
