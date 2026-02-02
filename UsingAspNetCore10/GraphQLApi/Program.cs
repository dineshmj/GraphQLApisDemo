using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using GraphQLTraining.Api;
using GraphQLTraining.Api.Data;
using GraphQLTraining.Api.GraphQL.DataLoaders;
using GraphQLTraining.Api.GraphQL.Mutations;
using GraphQLTraining.Api.GraphQL.Queries;
using GraphQLTraining.Api.GraphQL.Subscriptions;
using GraphQLTraining.Api.GraphQL.Types;

var builder = WebApplication.CreateBuilder(args);

// SQL Server LocalDB Configuration - Windows Authentication (no username/password needed)
var connectionString = "Server=(localdb)\\MSSQLLocalDB;Database=GraphQLTrainingDb;Trusted_Connection=True;";

builder.Services.AddPooledDbContextFactory<AppDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});


// JWT Authentication (Training Purposes Only)
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "training",

            ValidateAudience = true,
            ValidAudience = "training-client",

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Config.JWT_SIGNING_KEY)),

            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization();

// GraphQL Server Configuration (HotChocolate)
builder.Services
    .AddGraphQLServer()

    .AddQueryType<QueryRoot> ()
        .AddTypeExtension<ProductQueries>()
        .AddTypeExtension<CategoryQueries>()
        .AddTypeExtension<OrderQueries>()

    .AddMutationType<MutationRoot>()
        .AddTypeExtension<ProductMutations>()
        .AddTypeExtension<OrderMutations>()

    .AddSubscriptionType<SubscriptionRoot>()

    .AddType<ProductType>()
    .AddType<OrderItemType>()

    .AddAuthorization ()                    // Add this, despite having ASP.NET Core AddAuthorization () above. This extension method is from `HotChocolate.AspNetCore.Authorization`

    .AddFiltering()
    .AddSorting()
    .AddProjections()

    .AddInMemorySubscriptions()

    .AddDataLoader<CategoryByIdDataLoader>()
    .AddDataLoader<ProductByIdDataLoader> ();

// Controllers (for AuthController)
builder.Services.AddControllers();

// Build the WebApplication
var app = builder.Build();

app.UseWebSockets();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// GraphQL endpoint
app.MapGraphQL("/graphql");

app.Run();