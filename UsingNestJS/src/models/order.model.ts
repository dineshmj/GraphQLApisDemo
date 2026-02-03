import { OrderItem } from './order-item.model';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field(() => Int)
  id!: number;

  @Field()
  customerName!: string;

  // Navigation property — resolved in QueryResolver
  @Field(() => [OrderItem], { nullable: true })
  items?: OrderItem[];
}