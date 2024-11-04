using MongoDB.Driver;
using System.Threading.Tasks;

public class UserService
{
    private readonly IMongoCollection<User> _users;

    public UserService(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("Users");
    }

    public async Task CreateUser(User user)
    {
        await _users.InsertOneAsync(user);
    }

    public async Task<User> GetUserByUsername(string username)
    {
        return await _users.Find(user => user.Username == username).FirstOrDefaultAsync();
    }

    public async Task<User> GetUserByEmail(string email)
    {
        return await _users.Find(user => user.Email == email).FirstOrDefaultAsync();
    }
}
