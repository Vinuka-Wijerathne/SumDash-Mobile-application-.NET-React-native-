using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;


[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;
    private readonly JwtSettings _jwtSettings;

    public AuthController(UserService userService, IOptions<JwtSettings> jwtSettings)
    {
        _userService = userService;
        _jwtSettings = jwtSettings.Value;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp([FromBody] User newUser)
    {
        var existingUser = await _userService.GetUserByUsername(newUser.Username);
        if (existingUser != null)
            return BadRequest("User already exists");

        // Hash password (you would implement PasswordHasher)
        newUser.PasswordHash = PasswordHasher.Hash(newUser.PasswordHash);

        await _userService.CreateUser(newUser);

        return Ok("User created successfully");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User loginModel)
    {
        var user = await _userService.GetUserByUsername(loginModel.Username);
        if (user == null || !PasswordHasher.Verify(loginModel.PasswordHash, user.PasswordHash))
            return Unauthorized("Invalid credentials");

        // Generate JWT token
        var token = GenerateJwtToken(user);
        return Ok(new { Token = token });
    }

    private string GenerateJwtToken(User user)
{
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret); // Use Secret instead of Key

    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.Username)
        }),
        Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes), // Use ExpirationMinutes instead of DurationInMinutes
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
        Issuer = _jwtSettings.Issuer,
        Audience = _jwtSettings.Audience
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
}
}