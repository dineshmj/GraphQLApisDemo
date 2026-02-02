using Microsoft.EntityFrameworkCore;

using GraphQLTraining.Api.Models;

namespace GraphQLTraining.Api.Data;

public sealed class AppDbContext
    : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> opts)
        : base(opts)
    {
    }

    public DbSet<Product> Products => Set<Product>();

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<Order> Orders => Set<Order>();

    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
}