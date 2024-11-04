using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id { get; set; }

    [BsonRequired]
    public required string Username { get; set; }

    [BsonRequired]
    public required string Email { get; set; }

    [BsonRequired]
    public required string PasswordHash { get; set; }
}
