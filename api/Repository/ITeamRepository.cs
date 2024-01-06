using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Repository
{
    public interface ITeamRepository
    {
        Task<Team> GetTeam(string teamId);

        Task<Team> CreateTeam(string userId, string name);

        Task<bool> AddToTeam(string userId, string teamId, string role = null);
    }
}
