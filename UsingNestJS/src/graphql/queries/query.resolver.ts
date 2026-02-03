import { UseGuards }                    from '@nestjs/common';
import { Resolver, Query }              from '@nestjs/graphql';
import { Category }                     from '../../models/category.model';
import { Product }                      from '../../models/product.model';
import { Order }                        from '../../models/order.model';
import { DataService }                  from '../../data/data.service';
import { Roles }                        from '../../auth/roles.decorator';
import { RolesGuard }                   from '../../auth/roles.guard';
import { ROLE_ADMIN, ROLE_ORDER_QUERY } from '../../config';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';

@Resolver()
export class QueryResolver {
  constructor(private readonly dataService: DataService) {}

  // -------------------------------
  // Products  — open (no @Roles)
  // -------------------------------
  @Query(() => [Product])
  products(): Product[] {
    return this.dataService.findAllProducts().map(p => ({
      ...p,
      // eager-resolve the Category navigation property
      category: this.dataService.findCategoryById(p.categoryId),
    }));
  }

  // -------------------------------
  // Categories — open (no @Roles)
  // -------------------------------
  @Query(() => [Category])
  categories(): Category[] {
    return this.dataService.findAllCategories().map(c => ({
      ...c,
      products: this.dataService.findAllProducts().filter(p => p.categoryId === c.id),
    }));
  }

  // -----------------------------------------------------------------
  // Orders — RESTRICTED to Admin + OrderQuery roles.
  //
  //   GqlAuthGuard      → runs JwtStrategy.validate()  → populates req.user
  //   RolesGuard        → reads @Roles metadata        → compares req.user.role
  // -----------------------------------------------------------------
  @Query(() => [Order])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(ROLE_ADMIN, ROLE_ORDER_QUERY)
  orders(): Order[] {
    return this.dataService.findAllOrders().map(order => ({
      ...order,
      items: this.dataService.findOrderItemsByOrderId(order.id).map(oi => ({
        ...oi,
        product: this.dataService.findProductById(oi.productId),
        order,
      })),
    }));
  }
}