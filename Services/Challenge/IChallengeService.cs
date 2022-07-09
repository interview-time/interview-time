using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.ViewModel;

namespace CafApi.Services
{
    public interface IChallengeService
    {
        Task<List<Challenge>> GetChallenges(string teamId, List<string> challengeIds);

        Task CreateChallenge(string userId, string teamId, CreateChallengeRequest request);

        Task<bool> UpdateChallenge(string userId, string teamId, string challengeId, UpdateChallengeRequest request);

        (string, DateTime) GetChallengeUploadSignedUrl(string teamId, string challengeId, string filename);

        (string, DateTime) GetChallengeDownloadSignedUrl(string teamId, string challengeId, string filename);

        Task<string> GenerateOneTimeToken(string userId, string teamId, string challengeId, string interviewId);

        Task<string> UseOneTimeToken(string token);
    }
}