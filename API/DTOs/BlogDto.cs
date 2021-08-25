using System;

namespace API.DTOs
{
    public class BlogDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime BlogCreated { get; set; } 
    }
}