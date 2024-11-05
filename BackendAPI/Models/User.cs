using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public required string Id { get; set; }

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

    public string ProfilePictureUrl { get; set; }
}
