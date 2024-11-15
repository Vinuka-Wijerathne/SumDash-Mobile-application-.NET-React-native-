using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }  // MongoDB generates this

    [BsonRequired]
    [Required]
    public required string Username { get; set; }

    [BsonRequired]
    [EmailAddress]
    [Required]
    public required string Email { get; set; }

    [BsonRequired]
    [Required]
    public required string PasswordHash { get; set; }

    // Points system with three types of points
    public int YellowPoints { get; set; } = 0;
    public int SilverPoints { get; set; } = 0;
    public int GoldPoints { get; set; } = 0;

    // Tracks the number of successfully attempted questions
    public int SuccessfulAttempts { get; set; } = 0;

    // Profile picture URL, optional field
    public string? ProfilePictureUrl { get; set; }

    // Date the user joined (added field)[BsonElement("DateJoined")] [BsonElement("DateJoined")][BsonElement("DateJoined")]
    public DateTime DateJoined { get; set; } = DateTime.MinValue; // Default to avoid null issues
}