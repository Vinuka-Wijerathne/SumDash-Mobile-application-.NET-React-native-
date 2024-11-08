using BackendAPI.Models;

using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;

namespace BackendAPI.Controllers
{
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
    if (newUser == null)
    {
        return BadRequest("Invalid request body.");
    }

    // Additional validation checks
    if (string.IsNullOrEmpty(newUser.Username) || 
        string.IsNullOrEmpty(newUser.Email) || 
        string.IsNullOrEmpty(newUser.PasswordHash))
    {
        return BadRequest("Username, Email, and Password are required.");
    }

    // Check if the user already exists
    var existingUser = await _userService.GetUserByUsername(newUser.Username);
    if (existingUser != null)
    {
        return BadRequest("User already exists.");
    }

    // Hash password before saving to the database
    newUser.PasswordHash = PasswordHasher.Hash(newUser.PasswordHash);
    
    // Create new user in MongoDB
    await _userService.CreateUser(newUser);

    return Ok("User created successfully.");
}

[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
{
    if (loginModel == null || string.IsNullOrEmpty(loginModel.Email) || string.IsNullOrEmpty(loginModel.PasswordHash))
    {
        return BadRequest("Email and Password are required.");
    }

    // Retrieve user by email
    var user = await _userService.GetUserByEmail(loginModel.Email);
    if (user == null || !PasswordHasher.Verify(loginModel.PasswordHash, user.PasswordHash))
    {
        return Unauthorized("Invalid credentials.");
    }

    /// Generate JWT token
    var token = GenerateJwtToken(user);

    // Return the token along with user details (Email, Username, Id, ProfilePictureUrl)
    return Ok(new 
    {
        Token = token,
        User = new 
        {
            user.Email,
            user.Username,
            user.Id,
            user.ProfilePictureUrl // Optionally include profile picture URL
        }
    });
}

private string GenerateJwtToken(User user)
{
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);

    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[] 
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),  // Unique identifier for user
            new Claim(ClaimTypes.Name, user.Username)                 // User's username
        }),
        Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
        Issuer = _jwtSettings.Issuer,
        Audience = _jwtSettings.Audience
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
}
}}