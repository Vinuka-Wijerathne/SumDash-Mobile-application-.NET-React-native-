namespace BackendAPI.Models
{
    public class PointsUpdate
    {
        public int YellowPoints { get; set; }
        public int SilverPoints { get; set; }
        public int GoldPoints { get; set; }
        public int SuccessfulAttempts { get; set; }
    }

    public class UpdatePointsRequest
    {
        public required PointsUpdate PointsUpdate { get; set; }
    }
}
