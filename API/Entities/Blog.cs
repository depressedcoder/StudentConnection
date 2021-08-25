using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Blogs")]
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime BlogCreated { get; set; } = DateTime.Now;
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
    }
}