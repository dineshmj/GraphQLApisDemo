import { Inject }                         from '@nestjs/common';
import { Resolver, Subscription }         from '@nestjs/graphql';
import { PubSub }                         from 'graphql-subscriptions';
import { Product }                        from '../../models/product.model';
import { PUB_SUB }                        from '../../pubsub.provider';
import { PRODUCT_ADDED_TOPIC }            from '../mutations/mutation.resolver';

@Resolver()
export class SubscriptionResolver {
  constructor(@Inject(PUB_SUB) private readonly pubSub: PubSub) {}

  @Subscription(() => Product)
  onProductAdded(): AsyncIterator<{ onProductAdded: Product }> {
    return this.pubSub.asyncIterator<{ onProductAdded: Product }>(PRODUCT_ADDED_TOPIC);
  }
}