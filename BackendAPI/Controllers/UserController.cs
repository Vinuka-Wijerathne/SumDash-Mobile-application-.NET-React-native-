using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Collections.Generic;
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

    // GET: Retrieve all users
 [HttpGet("User")]  // Add this route if needed
public async Task<ActionResult<List<User>>> GetAllUsers()
{
    var users = await _users.Find(_ => true).ToListAsync();
    return Ok(users);
}


    // PUT: Update username, password, or profile picture
    [HttpPut("{id}/updateProfile")]
    public async Task<IActionResult> UpdateProfile(string id, [FromBody] User userProfileUpdate)
    {
        var update = Builders<User>.Update
            .Set(u => u.Username, userProfileUpdate.Username)
            .Set(u => u.PasswordHash, userProfileUpdate.PasswordHash)
            .Set(u => u.ProfilePictureUrl, userProfileUpdate.ProfilePictureUrl);

        var result = await _users.UpdateOneAsync(u => u.Id == id, update);
        
        if (result.MatchedCount == 0)
            return NotFound("User not found.");

        return Ok("Profile updated successfully.");
    }

    // PUT: Update points and successful attempts
    [HttpPut("{id}/updatePoints")]
    public async Task<IActionResult> UpdatePoints(string id, [FromBody] User pointsUpdate)
    {
        var update = Builders<User>.Update
            .Inc(u => u.YellowPoints, pointsUpdate.YellowPoints)
            .Inc(u => u.SilverPoints, pointsUpdate.SilverPoints)
            .Inc(u => u.GoldPoints, pointsUpdate.GoldPoints)
            .Inc(u => u.SuccessfulAttempts, pointsUpdate.SuccessfulAttempts);

        var result = await _users.UpdateOneAsync(u => u.Id == id, update);
        
        if (result.MatchedCount == 0)
            return NotFound("User not found.");

        return Ok("Points updated successfully.");
    }
}
