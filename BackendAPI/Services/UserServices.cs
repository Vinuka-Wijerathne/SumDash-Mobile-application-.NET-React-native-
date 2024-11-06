using MongoDB.Driver;
using System.Threading.Tasks;

public class UserService
{
    private readonly IMongoCollection<User> _users;

    public UserService(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("Users");
    }

      public async Task<User> CreateUser(User newUser)
    {
        await _users.InsertOneAsync(newUser);
        return newUser;  // MongoDB will automatically assign an ObjectId to the user
    }
    public async Task<User> GetUserById(string id)
    {
        return await _users.Find(user => user.Id == id).FirstOrDefaultAsync();
    }

    public async Task<User> GetUserByUsername(string username)
    {
        return await _users.Find(user => user.Username == username).FirstOrDefaultAsync();
    }

    public async Task<User> GetUserByEmail(string email)
    {
        return await _users.Find(user => user.Email == email).FirstOrDefaultAsync();
    }

    public async Task UpdateUser(string id, User updatedUser)
    {
        await _users.ReplaceOneAsync(user => user.Id == id, updatedUser);
    }
}
