using GraphQLTraining.Api.GraphQL.DataLoaders;
using GraphQLTraining.Api.Models;

namespace GraphQLTraining.Api.GraphQL.Types;

public sealed class ProductType
    : ObjectType<Product>
{
    protected override void Configure(IObjectTypeDescriptor<Product> descriptor)
    {
        descriptor
            .Field(p => p.Category)
            .Resolve(async (ctx, ct) => {
                var product = ctx.Parent<Product>();
                var loader = ctx.DataLoader<CategoryByIdDataLoader>();

                return
                    await loader.LoadAsync(product.CategoryId, ct);
            });
    }
}