using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services
{
    public interface IUserService
    {
         Task<Profile> GetProfile(string userId);

         Task<Profile> CreateProfile(string userId, string name, string email, int timezoneOffset);
    }
}