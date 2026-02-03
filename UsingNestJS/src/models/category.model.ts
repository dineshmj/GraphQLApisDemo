import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from './product.model';

@ObjectType()
export class Category {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  // Navigation: resolved lazily in QueryResolver (avoids circular import issues)
  // GraphQL clients can request  category { products { … } }
  @Field(() => [Product], { nullable: true })
  products?: any[];
}