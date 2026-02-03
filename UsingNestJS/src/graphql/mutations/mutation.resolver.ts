import { UseGuards, Inject }            from '@nestjs/common';
import { Resolver, Mutation, Args }     from '@nestjs/graphql';
import { Product }                      from '../../models/product.model';
import { Order }                        from '../../models/order.model';
import { DataService }                  from '../../data/data.service';
import { Roles }                        from '../../auth/roles.decorator';
import { RolesGuard }                   from '../../auth/roles.guard';
import { ROLE_ADMIN }                   from '../../config';
import { CreateOrderInput }             from './create-order.input';
import { PUB_SUB }                      from '../../pubsub.provider';
import { PubSub }                       from 'graphql-subscriptions';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';

export const PRODUCT_ADDED_TOPIC = 'PRODUCT_ADDED';

//
// Class-level guards apply to EVERY mutation inside.
//
@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard)
@Roles(ROLE_ADMIN)
export class MutationResolver {
  constructor(
    private readonly dataService: DataService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  // -----------------
  // addProduct ()
  // -----------------
  @Mutation(() => Product)
  addProduct(
    @Args('name')              name: string,
    @Args('price')             price: number,
    @Args('categoryId')        categoryId: number,
  ): Product {
    const product = this.dataService.addProduct(name, price, categoryId);

    // Publish the subscription event
    this.pubSub.publish(PRODUCT_ADDED_TOPIC, { onProductAdded: product });

    return {
      ...product,
      category: this.dataService.findCategoryById(categoryId),
    };
  }

  // -----------------
  // createOrder ()
  // -----------------
  @Mutation(() => Order)
  createOrder(@Args('input') input: CreateOrderInput): Order {
    const order = this.dataService.createOrder(
      input.customerName,
      input.productIds
    );
    return order;
  }
}