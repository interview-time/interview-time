using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Repository
{
    public interface IChallengeRepository
    {
        Task<Challenge> GetChallenge(string teamId, string challengeId);

        Task<List<OneTimeLink>> GetOneTimeLinks(string interviewId);

        Task<OneTimeLink> GetOneTimeLink(string token);

        Task<string> GenerateChallengeToken(string userId, string teamId, string challengeId, string interviewId, bool isOneTime = false);

        Task<List<Challenge>> GetChallenges(string teamId, List<string> challengeIds);

        Task BatchAddChallenges(List<Challenge> challenges);
    }
}
