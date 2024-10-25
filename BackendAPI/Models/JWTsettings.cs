// Models/JwtSettings.cs
public class JwtSettings
{
    public string Secret { get; set; }
    public int ExpirationMinutes { get; set; }
    public string Issuer { get; set; }
    public string Audience { get; set; }
}
