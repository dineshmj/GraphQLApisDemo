import { Category } from './category.model';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field(() => Float)
  price!: number;

  @Field(() => Int)
  categoryId!: number;

  // Navigation property — resolved in QueryResolver
  @Field(() => Category, { nullable: true })
  category?: Category;
}