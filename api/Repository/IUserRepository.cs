using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Repository
{
    public interface IUserRepository
    {
        Task<List<Profile>> GetUserProfiles(List<string> userIds);

        Task<Profile> GetProfile(string userId);

        Task<Profile> CreateProfile(string userId, string name, string email, int timezoneOffset, string timezone, string currentTeamId);

        Task UpdateProfile(string userId, string name, string position, int timezoneOffset, string timezone);

        Task UpdateCurrentTeam(string userId, string currentTeamId);
    }
}