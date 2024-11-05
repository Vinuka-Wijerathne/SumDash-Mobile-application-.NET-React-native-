using BackendAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        // Get user profile
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserProfile(string id)
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            return Ok(user);
        }

        // Update user details
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserProfile(string id, [FromBody] User model)
        {
            if (model == null)
            {
                return BadRequest("Invalid request body.");
            }

            var user = await _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Only update fields if provided
            if (!string.IsNullOrEmpty(model.Username))
            {
                user.Username = model.Username;
            }

            if (model.Points > 0) // Assuming 0 is not valid for points
            {
                user.Points = model.Points;
            }

            if (!string.IsNullOrEmpty(model.ProfilePictureUrl))
            {
                user.ProfilePictureUrl = model.ProfilePictureUrl;
            }

            await _userService.UpdateUser(id, user);

            return Ok("User profile updated successfully.");
        }
    }
}
