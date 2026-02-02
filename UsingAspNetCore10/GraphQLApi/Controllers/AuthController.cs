using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace GraphQLTraining.Api.Controllers;

[ApiController]
[Route("auth")]
public sealed class AuthController
    : ControllerBase
{
    [HttpPost("token")]
    public IActionResult Token(string? username)
    {
        var role = username?.ToLower() switch
        {
            "alice" => Config.ROLE_ADMIN,
            "bob" => Config.ROLE_GENERIC_QUERY,
            "dave" => Config.ROLE_ORDER_QUERY,
            _ => null
        };

        if (role == null)
        {
            // Use does not exist - Return 401 Unauthorized
            return Unauthorized(new
            {
                error = "Invalid username. Access denied."
            });
        }

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Config.JWT_SIGNING_KEY));
        var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, username),
            new(ClaimTypes.Role, role)
        };

        var token
            = new JwtSecurityToken(
                issuer: "training",
                audience: "training-client",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: signingCredentials);

        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            role
        });
    }
}