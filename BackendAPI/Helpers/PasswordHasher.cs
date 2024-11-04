using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

public static class PasswordHasher
{
    private const int SaltSize = 32; // 256 bits
    private const int HashSize = 32; // 256 bits
    private const int IterationCount = 100000; // Higher iteration count for security

    public static string Hash(string password)
    {
        if (string.IsNullOrEmpty(password))
            throw new ArgumentException("Password cannot be null or empty.", nameof(password));

        // Generate a 256-bit salt using a secure PRNG
        byte[] salt = new byte[SaltSize];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }

        // Hash the password with the salt using PBKDF2
        string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: IterationCount,
            numBytesRequested: HashSize));

        // Combine salt and hash as "salt.hash"
        return $"{Convert.ToBase64String(salt)}.{hashed}";
    }

    public static bool Verify(string password, string storedHash)
    {
        if (string.IsNullOrEmpty(password))
            throw new ArgumentException("Password cannot be null or empty.", nameof(password));
        
        if (string.IsNullOrEmpty(storedHash))
            throw new ArgumentException("Stored hash cannot be null or empty.", nameof(storedHash));

        // Split the stored hash into salt and hash components
        var parts = storedHash.Split('.');
        if (parts.Length != 2)
            throw new FormatException("Unexpected hash format. The stored hash should be in 'salt.hash' format.");

        byte[] salt = Convert.FromBase64String(parts[0]);
        string storedPasswordHash = parts[1];

        // Hash the provided password with the stored salt
        string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: IterationCount,
            numBytesRequested: HashSize));

        // Compare the hashes
        return storedPasswordHash == hashedPassword;
    }
}
