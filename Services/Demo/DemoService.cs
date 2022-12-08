using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Models;

namespace CafApi.Services.Demo
{
    public class DemoService : IDemoService
    {
        private readonly DynamoDBContext _context;
        private readonly Random _random;

        public DemoService(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
            _random = new Random();
        }

        public async Task<List<Candidate>> CreateDemoCandidates(string userId, string teamId)
        {
            var demoCandidates = new List<Candidate>();

            foreach (var candidate in DemoData.Candidates)
            {
                candidate.TeamId = teamId;
                candidate.Owner = userId;

                await _context.SaveAsync(candidate);

                demoCandidates.Add(candidate);
            }

            return demoCandidates;
        }

        public async Task<List<Template>> CreateDemoTemplates(string userId, string teamId)
        {
            var demoTemplates = new List<Template>();

            foreach (var template in DemoData.Templates)
            {
                template.UserId = userId;
                template.TeamId = teamId;

                await _context.SaveAsync(template);

                demoTemplates.Add(template);
            }

            return demoTemplates;
        }

        public async Task<Interview> CreateDemoInterview(string userId, string teamId, string candidateId, Template template, string timezone)
        {
            TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById(timezone);            

            var now = DateTime.UtcNow.AddDays(_random.Next(5, 10));

            var interviewStart = new DateTime(now.Year, now.Month, now.Day, 10, 00, 00);
            var interviewEnd = interviewStart.AddHours(1);

            var interview = new Interview
            {
                InterviewId = Guid.NewGuid().ToString(),
                IsDemo = true,
                UserId = userId,
                TeamId = teamId,
                CandidateId = candidateId,
                Interviewers = new List<string> { userId },
                LinkId = Guid.NewGuid().ToString(),
                Status = InterviewStatus.NEW.ToString(),
                InterviewDateTime = TimeZoneInfo.ConvertTimeToUtc(interviewStart, tzi),
                InterviewEndDateTime = TimeZoneInfo.ConvertTimeToUtc(interviewEnd, tzi),
                Structure = new InterviewStructure
                {
                    Header = template.Structure.Header,
                    Groups = template.Structure.Groups.Select(g => new InterviewGroup
                    {
                        GroupId = Guid.NewGuid().ToString(),
                        Name = g.Name,
                        Questions = g.Questions.Select(q => new InterviewQuestion
                        {
                            QuestionId = Guid.NewGuid().ToString(),
                            Question = q.Question,
                            Difficulty = q.Difficulty,
                            Tags = q.Tags
                        }).ToList()
                    }).ToList()
                },
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow
            };

            await _context.SaveAsync(interview);

            return interview;
        }
    }
}
