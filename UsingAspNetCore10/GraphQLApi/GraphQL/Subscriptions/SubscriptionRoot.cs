using GraphQLTraining.Api.Models;

namespace GraphQLTraining.Api.GraphQL.Subscriptions
{
    public sealed class SubscriptionRoot
    {
        [Subscribe]
        [Topic("PRODUCT_ADDED")]
        public Product OnProductAdded([EventMessage] Product product)
            => product;
    }
}