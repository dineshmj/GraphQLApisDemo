using Microsoft.EntityFrameworkCore;

using GraphQLTraining.Api.Data;
using GraphQLTraining.Api.Models;

namespace GraphQLTraining.Api.GraphQL.Queries;

[ExtendObjectType(typeof(QueryRoot))]
public sealed class CategoryQueries
{
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public async Task<IQueryable<Category>> GetCategories(IDbContextFactory<AppDbContext> dbFactory)
    {
        var db = await dbFactory.CreateDbContextAsync();
        return db.Categories;
    }
}