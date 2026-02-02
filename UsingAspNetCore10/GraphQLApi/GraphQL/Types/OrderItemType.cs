using GraphQLTraining.Api.GraphQL.DataLoaders;
using GraphQLTraining.Api.Models;

namespace GraphQLTraining.Api.GraphQL.Types;

public sealed class OrderItemType
    : ObjectType<OrderItem>
{
    protected override void Configure(IObjectTypeDescriptor<OrderItem> descriptor)
    {
        descriptor
            .Field(oi => oi.Product)
            .Resolve(async (ctx, ct) => {
                var orderItem = ctx.Parent<OrderItem>();
                var loader = ctx.DataLoader<ProductByIdDataLoader>();
                return
                    await loader.LoadAsync(orderItem.ProductId, ct);
            });
    }
}