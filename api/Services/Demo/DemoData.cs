using System;
using CafApi.Models;

namespace CafApi.Services.Demo
{
    public static class DemoData
    {
        public static Candidate GetBenCandidate(string userId, string teamId)
        {
            return new Candidate
            {
                CandidateId = Guid.NewGuid().ToString(),
                TeamId = teamId,
                Owner = userId,
                FirstName = "Ben",
                LastName = "Petersen",
                CandidateName = "Ben Petersen",
                Location = "Perth, Australia",
                Email = "ben.petersen@company.com",
                Phone = "333-222-444",
                LinkedIn = "https://www.linkedin.com/",
                GitHub = "https://github.com/",
                IsDemo = true,
                Status = CandidateStatus.NEW.ToString(),
                CreatedDate = DateTime.UtcNow
            };
        }

        public static Candidate GetJohnCandidate(string userId, string teamId)
        {
            return new Candidate
            {
                CandidateId = Guid.NewGuid().ToString(),
                TeamId = teamId,
                Owner = userId,
                FirstName = "John",
                LastName = "Smith",
                CandidateName = "John Smith",
                Location = "Sydney, Australia",
                Email = "john.smith@company.com",
                Phone = "555-222-444",
                LinkedIn = "https://www.linkedin.com/",
                GitHub = "https://github.com/",
                IsDemo = true,
                Status = CandidateStatus.NEW.ToString(),
                CreatedDate = DateTime.UtcNow
            };
        }

        public static Candidate GetSamiCandidate(string userId, string teamId)
        {
            return new Candidate
            {
                CandidateId = Guid.NewGuid().ToString(),
                TeamId = teamId,
                Owner = userId,
                FirstName = "Sami",
                LastName = "Yao",
                CandidateName = "Sami Yao",
                Location = "Sydney, Australia",
                Email = "sami.yao@company.com",
                Phone = "444-224-888",
                LinkedIn = "https://www.linkedin.com/",
                GitHub = "https://github.com/",
                IsDemo = true,
                Status = CandidateStatus.NEW.ToString(),
                CreatedDate = DateTime.UtcNow
            };
        }
    }
};
