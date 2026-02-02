using Microsoft.EntityFrameworkCore;

using GraphQLTraining.Api.Data;
using GraphQLTraining.Api.Models;

namespace GraphQLTraining.Api.GraphQL.DataLoaders;

public sealed class ProductByIdDataLoader
    : BatchDataLoader<int, Product>
{
    private readonly IDbContextFactory<AppDbContext> _dbFactory;

    public ProductByIdDataLoader(
        IBatchScheduler scheduler,
        IDbContextFactory<AppDbContext> dbFactory,
        DataLoaderOptions? options = null)
            : base(scheduler, options)
    {
        _dbFactory = dbFactory;
    }

    protected override async Task<IReadOnlyDictionary<int, Product>> LoadBatchAsync(
        IReadOnlyList<int> keys,
        CancellationToken cancellationToken)
    {
        var db = await _dbFactory.CreateDbContextAsync(cancellationToken);

        return
            await db.Products
                .Where(p => keys.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id, cancellationToken);
    }
}