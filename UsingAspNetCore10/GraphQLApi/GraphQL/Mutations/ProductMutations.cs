using Microsoft.EntityFrameworkCore;

using HotChocolate.Authorization;
using HotChocolate.Subscriptions;

using GraphQLTraining.Api.Data;
using GraphQLTraining.Api.Models;

namespace GraphQLTraining.Api.GraphQL.Mutations;

[ExtendObjectType(typeof(MutationRoot))]
public sealed class ProductMutations
{
    [Authorize(Roles = [Config.ROLE_ADMIN])]
    public async Task<Product> AddProduct(
        string name,
        decimal price,
        int categoryId,
        IDbContextFactory<AppDbContext> dbFactory,
        ITopicEventSender sender)
    {
        var db = await dbFactory.CreateDbContextAsync();

        var product = new Product
        {
            Name = name,
            Price = price,
            CategoryId = categoryId
        };

        db.Products.Add(product);
        await db.SaveChangesAsync();

        // Publish subscription event
        await sender.SendAsync("PRODUCT_ADDED", product);

        return product;
    }
}