using Microsoft.EntityFrameworkCore;

using GraphQLTraining.Api.Data;
using GraphQLTraining.Api.Models;

namespace GraphQLTraining.Api.GraphQL.DataLoaders;

public sealed class CategoryByIdDataLoader
    : BatchDataLoader<int, Category>
{
    private readonly IDbContextFactory<AppDbContext> _dbFactory;

    public CategoryByIdDataLoader(
        IBatchScheduler batchScheduler,
        IDbContextFactory<AppDbContext> dbFactory,
        DataLoaderOptions? options = null)
            : base(batchScheduler, options)
    {
        _dbFactory = dbFactory;
    }

    protected override async Task<IReadOnlyDictionary<int, Category>> LoadBatchAsync(
        IReadOnlyList<int> keys,
        CancellationToken cancellationToken)
    {
        var db = await _dbFactory.CreateDbContextAsync(cancellationToken);

        return
            await db.Categories
                .Where(c => keys.Contains(c.Id))
                .ToDictionaryAsync(c => c.Id, cancellationToken);
    }
}