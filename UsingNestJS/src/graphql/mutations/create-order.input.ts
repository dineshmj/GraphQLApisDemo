import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field()
  customerName!: string;

  @Field(() => [Int])
  productIds!: number[];
}