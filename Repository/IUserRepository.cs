using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Repository
{
    public interface IUserRepository
    {
        Task<List<Profile>> GetUserProfiles(List<string> userIds);
    }
}