using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using BackendAPI.Models;  // Ensure this is included
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

    // GET: Retrieve all users (for admin or general purposes)
    [HttpGet("all")]
    public async Task<ActionResult<List<User>>> GetAllUsers()
    {
        var users = await _users.Find(_ => true).ToListAsync();
        return Ok(users);
    }

    // GET: Retrieve user information by user ID
    [Authorize]
    [HttpGet("{userId:length(24)}")] // Ensure userId is 24 characters for ObjectId
    public async Task<ActionResult<User>> GetUserById(string userId)
    {
        if (!ObjectId.TryParse(userId, out var objectId))
            return BadRequest("Invalid user ID format.");

        var user = await _users.Find(u => u.Id == objectId.ToString()).FirstOrDefaultAsync();
        if (user == null)
            return NotFound("User not found.");

        return Ok(new
        {
            user.Id,
            user.Username,
            user.Email,
            user.YellowPoints,
            user.SilverPoints,
            user.GoldPoints,
            user.SuccessfulAttempts,
            user.ProfilePictureUrl,
            user.DateJoined
        });
    }

[Authorize]
[HttpPut("{userId:length(24)}/updateProfile")]
public async Task<IActionResult> UpdateProfile(string userId, [FromBody] UserProfileUpdate userProfileUpdate)
{
    // Validate the userId format
    if (!ObjectId.TryParse(userId, out var objectId))
        return BadRequest("Invalid user ID format.");

    // Initialize the update definition builder
    var updateDefinition = Builders<User>.Update;

    // Start with an empty update definition
    var update = new List<UpdateDefinition<User>>();

    // Conditionally add the fields to the update list
    if (!string.IsNullOrEmpty(userProfileUpdate.Username))
    {
        update.Add(updateDefinition.Set(u => u.Username, userProfileUpdate.Username));
    }

    if (!string.IsNullOrEmpty(userProfileUpdate.ProfilePictureUrl))
    {
        update.Add(updateDefinition.Set(u => u.ProfilePictureUrl, userProfileUpdate.ProfilePictureUrl));
    }

    // Combine the update definitions (if any were added)
    var combinedUpdate = Builders<User>.Update.Combine(update);

    // Perform the update in MongoDB
    var result = await _users.UpdateOneAsync(u => u.Id == objectId.ToString(), combinedUpdate);

    // Handle the case where no matching user is found
    if (result.MatchedCount == 0)
        return NotFound("User not found.");

    // Return success message
    return Ok("Profile updated successfully.");
}




    // PUT: Update points by user ID
    [Authorize]
    [HttpPut("{userId:length(24)}/updatePoints")]
    public async Task<IActionResult> UpdatePoints(string userId, [FromBody] UpdatePointsRequest requestBody)
    {
        if (!ObjectId.TryParse(userId, out var objectId))
            return BadRequest("Invalid user ID format.");

        var pointsUpdate = requestBody?.PointsUpdate;

        if (pointsUpdate == null)
            return BadRequest("PointsUpdate is required.");

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
    [HttpDelete("{userId:length(24)}")]
    public async Task<IActionResult> DeleteUser(string userId)
    {
        if (!ObjectId.TryParse(userId, out var objectId))
            return BadRequest("Invalid user ID format.");

        var result = await _users.DeleteOneAsync(u => u.Id == objectId.ToString());

        if (result.DeletedCount == 0)
            return NotFound("User not found.");

        return Ok("User deleted successfully.");
    }
}
