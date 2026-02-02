using HotChocolate.Authorization;

namespace GraphQLTraining.Api.GraphQL.Mutations
{
    [Authorize(Roles = [Config.ROLE_ADMIN])]
    public sealed class MutationRoot
    {
    }
}