using Microsoft.EntityFrameworkCore;

using GraphQLTraining.Api.Data;
using GraphQLTraining.Api.Models;

namespace GraphQLTraining.Api.GraphQL.Queries
{
    [ExtendObjectType(typeof(QueryRoot))]
    public sealed class ProductQueries
    {
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public async Task<IQueryable<Product>> GetProducts(IDbContextFactory<AppDbContext> dbFactory)
        {
            var db = await dbFactory.CreateDbContextAsync();
            return db.Products;
        }
    }
}