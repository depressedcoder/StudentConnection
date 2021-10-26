namespace API.Helpers
{
    public class UserParams : PaginationParams
    {
        public string CurrentUserName { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; } = 20;
        public int MaxAge { get; set; } = 150;
        public string KnownAs { get; set; }
        public string OrderBy { get; set; } = "lastActive";
    }
}