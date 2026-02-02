namespace GraphQLTraining.Api
{
    public static class Config
    {
        // Signing key
        public const string JWT_SIGNING_KEY = "this_is_a_very_long_training_secret_key_please_change_me_2024";

        // Roles
        public const string ROLE_ADMIN = "Admin";
        public const string ROLE_ORDER_QUERY = "OrderQuery";
        public const string ROLE_GENERIC_QUERY = "GenericQuery";
    }
}