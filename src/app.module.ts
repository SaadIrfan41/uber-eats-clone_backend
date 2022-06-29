import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalAuthInterceptor } from './global.interceptor';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').default('dev').required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: true,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      cors: { origin: ['https://studio.apollographql.com'], credentials: true },

      context: ({ res, req }) => ({
        user: req['user'],
        cookie: req['cookies'].token,
        res,
      }),
    }),
    UsersModule,
    AuthModule,
    RestaurantsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalAuthInterceptor,
    },
  ],
})
export class AppModule {}
