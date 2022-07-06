using System;
using System.Threading.Tasks;

namespace CafApi.Services
{
    public interface IChallengeService
    {
        Task<(string, DateTime)?> GetChallengeUploadSignedUrl(string userId, string teamId, string challengeId, string filename);

        Task<(string, DateTime)?> GetChallengeDownloadSignedUrl(string userId, string teamId, string challengeId, string filename);
    }
}