using BackendAPI.Models;
using MongoDB.Driver;

namespace BackendAPI.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IOptions<MongoDBSettings> mongoSettings)
        {
            var mongoClient = new MongoClient(mongoSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoSettings.Value.DatabaseName);
            _users = mongoDatabase.GetCollection<User>("Users");
        }

        public async Task<User> GetUserByUsername(string username)
        {
            return await _users.Find(user => user.Username == username).FirstOrDefaultAsync();
        }

        public async Task CreateUser(User newUser)
        {
            await _users.InsertOneAsync(newUser);
        }
    }
}
