import { Module }                    from '@nestjs/common';
import { GraphQLModule }             from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule }              from '@nestjs/config';
import { AuthModule }                from './auth/auth.module';
import { DataModule }                from './data/data.module';
import { QueryResolver }             from './graphql/queries/query.resolver';
import { MutationResolver }          from './graphql/mutations/mutation.resolver';
import { SubscriptionResolver }      from './graphql/subscriptions/subscription.resolver';
import { PubSubProvider }            from './pubsub.provider';

@Module({
  imports: [
    // ---------------------------------------------------------------
    // Load .env into process.env (mirrors hard-coded values in Config.cs)
    // ---------------------------------------------------------------
    ConfigModule.forRoot({
      isGlobal:  true,
      envFilePath: '.env',
    }),

    // ---------------------------------------------------------------
    // Apollo / GraphQL  — code-first, subscriptions enabled
    // ---------------------------------------------------------------
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver:        ApolloDriver,
      autoSchemaFile: true,            // generates schema.graphql at runtime
      installSubscriptionHandlers: true, // enables WebSocket-based subscriptions
    }),

    // ---------------------------------------------------------------
    // Feature modules
    // ---------------------------------------------------------------
    AuthModule,
    DataModule,
  ],

  providers: [
    PubSubProvider,               // singleton PubSub available app-wide
    QueryResolver,
    MutationResolver,
    SubscriptionResolver,
  ],
})
export class AppModule {}