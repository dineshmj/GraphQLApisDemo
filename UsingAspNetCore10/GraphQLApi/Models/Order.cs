namespace GraphQLTraining.Api.Models;

public sealed class Order
{
    public int Id { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public ICollection<OrderItem> Items { get; set; } = [];
}