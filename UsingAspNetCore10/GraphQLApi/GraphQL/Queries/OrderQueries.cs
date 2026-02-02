using Microsoft.EntityFrameworkCore;

using HotChocolate.Authorization;

using GraphQLTraining.Api.Data;
using GraphQLTraining.Api.Models;

namespace GraphQLTraining.Api.GraphQL.Queries;

[ExtendObjectType(typeof(QueryRoot))]
public sealed class OrderQueries
{
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    [Authorize(Roles = [Config.ROLE_ADMIN, Config.ROLE_ORDER_QUERY])]
    public async Task<IQueryable<Order>> GetOrders(IDbContextFactory<AppDbContext> dbFactory)
    {
        var db = await dbFactory.CreateDbContextAsync();
        return db.Orders;
    }
}