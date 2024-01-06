using System;
using System.Threading.Tasks;

namespace CafApi.Services
{
    public interface IChallengeService
    {
        (string, DateTime) GetChallengeUploadSignedUrl(string teamId, string challengeId, string filename);

        (string, DateTime) GetChallengeDownloadSignedUrl(string teamId, string challengeId, string filename);

        Task<string> GetChallengeDirectUrl(string token);
    }
}