using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IMongoCollection<User> _users;

    public UserController(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("Users");
    }

    // GET: Retrieve all users (for admin or general purposes)
    [HttpGet("all")]
    public async Task<ActionResult<List<User>>> GetAllUsers()
    {
        var users = await _users.Find(_ => true).ToListAsync();
        return Ok(users);
    }

    // GET: Retrieve user information by user ID
    [Authorize]
    [HttpGet("{userId}")]
    public async Task<ActionResult<User>> GetUserById(string userId)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest("User ID is required.");
        }

        // Convert userId to ObjectId
        ObjectId objectId;
        try
        {
            objectId = ObjectId.Parse(userId);
        }
        catch
        {
            return BadRequest("Invalid user ID format.");
        }

        // Find the user by ID in MongoDB
        var user = await _users.Find(u => u.Id == objectId.ToString()).FirstOrDefaultAsync();
        if (user == null)
        {
            return NotFound("User not found.");
        }

        // Return user information without exposing the password hash
        return Ok(new
        {
            user.Id,
            user.Username,
            user.Email,
            user.YellowPoints,
            user.SilverPoints,
            user.GoldPoints,
            user.SuccessfulAttempts,
            user.ProfilePictureUrl
        });
    }

    // PUT: Update username, password, or profile picture by user ID
    [Authorize]
    [HttpPut("{userId}/updateProfile")]
    public async Task<IActionResult> UpdateProfile(string userId, [FromBody] User userProfileUpdate)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest("User ID is required.");
        }

        // Convert userId to ObjectId
        ObjectId objectId;
        try
        {
            objectId = ObjectId.Parse(userId);
        }
        catch
        {
            return BadRequest("Invalid user ID format.");
        }

        var update = Builders<User>.Update
            .Set(u => u.Username, userProfileUpdate.Username)
            .Set(u => u.PasswordHash, userProfileUpdate.PasswordHash)
            .Set(u => u.ProfilePictureUrl, userProfileUpdate.ProfilePictureUrl);

        var result = await _users.UpdateOneAsync(u => u.Id == objectId.ToString(), update);

        if (result.MatchedCount == 0)
            return NotFound("User not found.");

        return Ok("Profile updated successfully.");
    }

    // PUT: Update points and successful attempts by user ID
    [Authorize]
    [HttpPut("{userId}/updatePoints")]
    public async Task<IActionResult> UpdatePoints(string userId, [FromBody] User pointsUpdate)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest("User ID is required.");
        }

        // Convert userId to ObjectId
        ObjectId objectId;
        try
        {
            objectId = ObjectId.Parse(userId);
        }
        catch
        {
            return BadRequest("Invalid user ID format.");
        }

        var update = Builders<User>.Update
            .Inc(u => u.YellowPoints, pointsUpdate.YellowPoints)
            .Inc(u => u.SilverPoints, pointsUpdate.SilverPoints)
            .Inc(u => u.GoldPoints, pointsUpdate.GoldPoints)
            .Inc(u => u.SuccessfulAttempts, pointsUpdate.SuccessfulAttempts);

        var result = await _users.UpdateOneAsync(u => u.Id == objectId.ToString(), update);

        if (result.MatchedCount == 0)
            return NotFound("User not found.");

        return Ok("Points updated successfully.");
    }

    // DELETE: Delete user account by user ID
    [Authorize]
    [HttpDelete("{userId}")]
    public async Task<IActionResult> DeleteUser(string userId)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest("User ID is required.");
        }

        // Convert userId to ObjectId
        ObjectId objectId;
        try
        {
            objectId = ObjectId.Parse(userId);
        }
        catch
        {
            return BadRequest("Invalid user ID format.");
        }

        var result = await _users.DeleteOneAsync(u => u.Id == objectId.ToString());

        if (result.DeletedCount == 0)
            return NotFound("User not found.");

        return Ok("User deleted successfully.");
    }
}
