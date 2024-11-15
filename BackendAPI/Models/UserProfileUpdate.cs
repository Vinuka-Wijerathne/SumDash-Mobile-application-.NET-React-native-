using System.ComponentModel.DataAnnotations;

public class UserProfileUpdate
{
    // Username is optional for the update
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters.")]
    public string? Username { get; set; }

    // Profile picture URL is optional and has validation for the URL format
    [Url(ErrorMessage = "Invalid URL format.")]
    public string? ProfilePictureUrl { get; set; }  // Allow null values for optional profile picture
}
