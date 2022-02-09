using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services
{
    public interface IUserService
    {
        Task<Profile> GetProfile(string userId);

        Task<List<Profile>> GetUserProfiles(List<string> userIds);

        Task<Profile> CreateProfile(string userId, string name, string email, int timezoneOffset, string timezone);

        Task<bool> IsBelongInTeam(string userId, string teamId);
    }
}