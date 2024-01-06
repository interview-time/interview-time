using System;
using System.Collections.Generic;
using System.Linq;
using CafApi.Common;
using CafApi.Models;

namespace CafApi.Services.Demo
{
    public static class DemoData
    {
        public static Stage GetscreeningStage(string templateId, string candidateId = null)
        {
            return new Stage
            {
                StageId = Guid.NewGuid().ToString(),
                Title = "Screening",
                Description = "",
                Colour = "#0693E3",
                TemplateId = templateId,
                Type = JobStageType.Interview.ToString(),
                CreatedDate = DateTime.UtcNow,
                Candidates = candidateId != null ? new List<StageCandidate>
                {
                    new StageCandidate
                    {
                        CandidateId = candidateId,
                        MovedToStage = DateTime.UtcNow,
                        OriginallyAdded= DateTime.UtcNow
                    }
                } : null
            };
        }

        public static Stage GetTechStage(string templateId, List<string> candidateIds)
        {
            return new Stage
            {
                StageId = Guid.NewGuid().ToString(),
                Title = "Tech Interview",
                Description = "",
                Colour = "#08c7e0",
                Type = JobStageType.Interview.ToString(),
                TemplateId = templateId,
                CreatedDate = DateTime.UtcNow,
                Candidates = candidateIds.Select(cId =>
                            new StageCandidate
                            {
                                CandidateId = cId,
                                MovedToStage = DateTime.UtcNow,
                                OriginallyAdded = DateTime.UtcNow
                            })
                            .ToList()
            };
        }

        public static Stage GetCulturalStage(string templateId, string candidateId = null)
        {
            return new Stage
            {
                StageId = Guid.NewGuid().ToString(),
                Title = "Cultural Interview",
                Description = "",
                Colour = "#fe01fc",
                TemplateId = templateId,
                Type = JobStageType.Interview.ToString(),
                CreatedDate = DateTime.UtcNow,
                Candidates = candidateId != null ? new List<StageCandidate>
                {
                    new StageCandidate
                    {
                        CandidateId = candidateId,
                        MovedToStage = DateTime.UtcNow,
                        OriginallyAdded= DateTime.UtcNow
                    }
                } : null
            };
        }

        public static Job GetDefaultJob(string jobId, string userId, string teamId, List<Stage> stages)
        {
            var lastStages = new List<Stage>
                {
                    new Stage
                    {
                        StageId = Guid.NewGuid().ToString(),
                        Title = "Rejected",
                        Description = "",
                        Colour = "#f42d2d",
                        Type = JobStageType.Regular.ToString(),
                        CreatedDate = DateTime.UtcNow
                    },
                    new Stage
                    {
                        StageId = Guid.NewGuid().ToString(),
                        Title = "Hired",
                        Description = "",
                        Colour = "#1cb854",
                        Type = JobStageType.Regular.ToString(),
                        CreatedDate = DateTime.UtcNow
                    }
                };

            stages.AddRange(lastStages);

            return new Job
            {
                TeamId = teamId,
                JobId = jobId,
                Title = "Software Engineer",
                Location = "Remote",
                Department = "Engineering",
                Tags = new List<string> { "remote", "urgent", "javascript" },
                Description = "",
                Owner = userId,
                CreatedDate = DateTime.UtcNow,
                Status = JobStatus.OPEN.ToString(),
                Pipeline = stages
            };
        }

        public static Candidate GetBenCandidate(string userId, string teamId, string jobId)
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
                CreatedDate = DateTime.UtcNow,
                JobId = jobId
            };
        }

        public static Candidate GetJohnCandidate(string userId, string teamId, string jobId)
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
                CreatedDate = DateTime.UtcNow,
                JobId = jobId
            };
        }

        public static Candidate GetSamiCandidate(string userId, string teamId, string jobId)
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
                CreatedDate = DateTime.UtcNow,
                JobId = jobId
            };
        }
    }
};
