import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Order } from './order.model';
import { Product } from './product.model';

@ObjectType()
export class OrderItem {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  orderId!: number;

  @Field(() => Int)
  productId!: number;

  @Field(() => Int)
  quantity!: number;

  // Navigation properties — resolved in QueryResolver
  @Field(() => Order,   { nullable: true })
  order?: any;

  @Field(() => Product, { nullable: true })
  product?: any;
}