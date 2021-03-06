using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extentions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await _context.Users
                .Where(x => x.UserName == username)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = _context.Users.AsQueryable();

            query = query.Where(u => u.UserName != userParams.CurrentUserName);
            //query = query.Where(u => u.Gender == userParams.Gender);

            var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

            query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            
            if(!string.IsNullOrEmpty(userParams.KnownAs))
                query = query.Where(u => u.KnownAs == userParams.KnownAs);

            query = userParams.OrderBy switch 
            {
                "created" => query.OrderByDescending(u => u.Created), 
                _ => query.OrderByDescending(u => u.LastActive)
            };

            return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(_mapper
                .ConfigurationProvider).AsNoTracking(),
                    userParams.PageNumber, userParams.PageSize);
        }
        public async Task<IEnumerable<BatchMateDto>> GetMembersByBatch(string username,string batchName)
        {
            var users = _context.Users
                .Where(u => u.UserName != username && u.Batch == batchName)
                .AsQueryable();

            return await users.Select(user => new BatchMateDto{
                Username = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                City = user.City,
                Id = user.Id,
                Batch = user.Batch
            }).ToListAsync();    
        }

        public async Task<IEnumerable<AppUser>> GetUserAsync()
        {
            return await _context.Users
                .Include(p => p.Photos)
                .Include(b => b.Blogs)
                .ToListAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(p => p.Photos)
                .Include(b => b.Blogs)
                .SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
        public async Task<bool> BlogUpdate(int blogId, BlogDto blogDto)
        {
            var dbBlogs = _context.Blogs.FirstOrDefault(s => s.Id.Equals(blogId));

            dbBlogs.Title = blogDto.Title;
            dbBlogs.Description = blogDto.Description;

            return await _context.SaveChangesAsync() > 0;
        }
    }
}