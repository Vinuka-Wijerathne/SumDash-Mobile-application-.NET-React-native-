using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

public class User
{
    [BsonId] // MongoDB will automatically generate this field
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

    public int Points { get; set; } = 0;

    // ProfilePictureUrl is now optional
    public string? ProfilePictureUrl { get; set; }  // Nullable
}
