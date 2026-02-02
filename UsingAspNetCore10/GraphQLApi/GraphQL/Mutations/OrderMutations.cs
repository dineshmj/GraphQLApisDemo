using Microsoft.EntityFrameworkCore;

using HotChocolate.Authorization;

using GraphQLTraining.Api.Data;
using GraphQLTraining.Api.Models;

namespace GraphQLTraining.Api.GraphQL.Mutations;

[ExtendObjectType(typeof(MutationRoot))]
public sealed class OrderMutations
{
    [Authorize(Roles = [Config.ROLE_ADMIN])]
    public async Task<Order> CreateOrder(
        string customerName,
        List<int> productIds,
        IDbContextFactory<AppDbContext> dbFactory)
    {
        var db = await dbFactory.CreateDbContextAsync();

        var order = new Order { CustomerName = customerName };
        db.Orders.Add(order);

        await db.SaveChangesAsync();

        foreach (var pid in productIds) {
            db.OrderItems.Add(new OrderItem {
                OrderId = order.Id,
                ProductId = pid,
                Quantity = 1
            });
        }

        await db.SaveChangesAsync();
        return order;
    }
}