using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using CafApi.Common;
using CafApi.Models;
using CafApi.Services.User;
using CafApi.ViewModel;

namespace CafApi.Services
{
    public class TemplateService : ITemplateService
    {
        private readonly DynamoDBContext _context;
        private readonly IInterviewService _interviewService;
        private readonly IPermissionsService _permissionsService;
        private readonly IChallengeService _challengeService;

        public TemplateService(IAmazonDynamoDB dynamoDbClient,
            IInterviewService interviewService,
            IPermissionsService permissionsService,
            IChallengeService challengeService)
        {
            _context = new DynamoDBContext(dynamoDbClient);
            _interviewService = interviewService;
            _permissionsService = permissionsService;
            _challengeService = challengeService;
        }

        public async Task<List<Template>> GetMyTemplates(string userId)
        {
            var config = new DynamoDBOperationConfig();

            var templates = await _context.QueryAsync<Template>(userId, config).GetRemainingAsync();
            templates = templates.Where(t => string.IsNullOrWhiteSpace(t.TeamId)).ToList();

            foreach (var template in templates)
            {
                var interviews = await _interviewService.GetInterviewsByTemplate(template.TemplateId);
                template.TotalInterviews = interviews.Count();

                if (string.IsNullOrWhiteSpace(template.Token))
                {
                    template.Token = StringHelper.GenerateToken();
                    await _context.SaveAsync(template);
                }
            }

            return templates;
        }

        public async Task<List<Template>> GetTeamTemplates(string userId, string teamId)
        {
            var search = _context.FromQueryAsync<Template>(new QueryOperationConfig()
            {
                IndexName = "TeamId-index",
                Filter = new QueryFilter(nameof(Template.TeamId), QueryOperator.Equal, teamId)
            });

            var templates = await search.GetRemainingAsync();

            var challenegIds = templates
                .Where(t => t.ChallengeIds != null && t.ChallengeIds.Any())
                .SelectMany(t => t.ChallengeIds)
                .Distinct()
                .ToList();
                
            var challenges = await _challengeService.GetChallenges(teamId, challenegIds);

            foreach (var template in templates)
            {
                if (template.ChallengeIds != null && template.ChallengeIds.Any())
                {
                    template.Challenges = challenges.Where(c => template.ChallengeIds.Contains(c.ChallengeId)).ToList();
                }
            }

            return templates;
        }

        public async Task<Template> GetTemplate(string userId, string templateId)
        {
            return await _context.LoadAsync<Template>(userId, templateId);
        }

        public async Task<Template> GetTemplate(string templateId)
        {
            var search = _context.FromQueryAsync<Template>(new QueryOperationConfig()
            {
                IndexName = "TemplateId-index",
                Filter = new QueryFilter(nameof(Template.TemplateId), QueryOperator.Equal, templateId)
            });
            var templates = await search.GetRemainingAsync();

            return templates.FirstOrDefault();
        }

        public async Task<Template> CreateTemplate(string userId, TemplateRequest newTemplate, bool isDemo = false)
        {
            var template = new Template
            {
                UserId = userId,
                TemplateId = Guid.NewGuid().ToString(),
                Title = newTemplate.Title,
                Type = newTemplate.Type,
                InterviewType = newTemplate.InterviewType ?? InterviewType.INTERVIEW.ToString(),
                Description = newTemplate.Description,
                Structure = newTemplate.Structure,
                IsDemo = isDemo,
                TeamId = newTemplate.TeamId,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
                Token = StringHelper.GenerateToken()
            };

            // assign ids to groups if missing
            if (template.Structure != null && template.Structure.Groups != null)
            {
                foreach (var group in template.Structure.Groups)
                {
                    group.GroupId = Guid.NewGuid().ToString();

                    if (group.Questions != null)
                    {
                        foreach (var question in group.Questions)
                        {
                            question.QuestionId = Guid.NewGuid().ToString();
                        }
                    }
                }
            }

            await _context.SaveAsync(template);

            return template;
        }

        public async Task UpdateTemplate(string userId, TemplateRequest updatedTemplate)
        {
            var isBelongInTeam = await _permissionsService.IsBelongInTeam(userId, updatedTemplate.TeamId);
            if (isBelongInTeam)
            {
                var template = await GetTemplate(updatedTemplate.TemplateId);

                template.Title = updatedTemplate.Title;
                template.Type = updatedTemplate.Type;
                template.Description = updatedTemplate.Description;
                template.Structure = updatedTemplate.Structure;
                template.ChallengeIds = updatedTemplate.ChallengeIds;
                template.ModifiedDate = DateTime.UtcNow;

                if (string.IsNullOrWhiteSpace(template.Token))
                {
                    template.Token = StringHelper.GenerateToken();
                }

                // assign ids to groups if missing
                if (template.Structure != null && template.Structure.Groups != null)
                {
                    foreach (var group in template.Structure.Groups)
                    {
                        if (string.IsNullOrWhiteSpace(group.GroupId))
                        {
                            group.GroupId = Guid.NewGuid().ToString();
                        }

                        if (group.Questions != null)
                        {
                            foreach (var question in group.Questions)
                            {
                                if (string.IsNullOrWhiteSpace(question.QuestionId))
                                {
                                    question.QuestionId = Guid.NewGuid().ToString();
                                }
                            }
                        }
                    }
                }

                await _context.SaveAsync(template);
            }
        }

        public async Task DeleteTemplate(string userId, string templateId)
        {
            await _context.DeleteAsync<Template>(userId, templateId);
        }

        public async Task<Template> CloneTemplate(string fromUserId, string fromTemplateId, string toUserId, string toTeamId)
        {
            var fromTemplate = await GetTemplate(fromUserId, fromTemplateId);

            fromTemplate.UserId = toUserId;
            fromTemplate.TeamId = toTeamId;
            fromTemplate.TemplateId = Guid.NewGuid().ToString();
            fromTemplate.CreatedDate = DateTime.UtcNow;
            fromTemplate.ModifiedDate = DateTime.UtcNow;
            fromTemplate.Token = StringHelper.GenerateToken();

            // assign new ids to groups
            if (fromTemplate.Structure != null && fromTemplate.Structure.Groups != null)
            {
                foreach (var group in fromTemplate.Structure.Groups)
                {
                    group.GroupId = Guid.NewGuid().ToString();
                }
            }

            await _context.SaveAsync(fromTemplate);

            return fromTemplate;
        }

        public async Task ShareTemplate(string userId, string templateId, bool share)
        {
            var template = await GetTemplate(userId, templateId);
            template.IsShared = share;
            await _context.SaveAsync(template);
        }

        public async Task<Template> GetSharedTemplate(string token)
        {
            var search = _context.FromQueryAsync<Template>(new QueryOperationConfig()
            {
                IndexName = "Token-Index",
                Filter = new QueryFilter(nameof(Template.Token), QueryOperator.Equal, token)
            });
            var templates = await search.GetRemainingAsync();
            var sharedTemplate = templates.FirstOrDefault(t => t.IsShared);

            if (sharedTemplate != null)
            {
                var templateOwner = await _context.LoadAsync<Profile>(sharedTemplate.UserId);
                sharedTemplate.Owner = templateOwner.Name;
            }

            return sharedTemplate;
        }

        public async Task<Template> AddToSharedWithMe(string userId, string token)
        {
            var sharedTemplate = await GetSharedTemplate(token);

            if (sharedTemplate != null)
            {
                var sharedWithMe = new SharedWithMe
                {
                    UserId = userId,
                    TemplateId = sharedTemplate.TemplateId,
                    TemplateOwnerId = sharedTemplate.UserId,
                    ModifiedDate = DateTime.UtcNow,
                    CreatedDate = DateTime.UtcNow,
                };

                await _context.SaveAsync(sharedWithMe);
            }

            return sharedTemplate;
        }

        public async Task<List<Template>> GetSharedWithMe(string userId)
        {
            var sharedWithMe = new List<Template>();

            var config = new DynamoDBOperationConfig();

            var sharedTemplates = await _context.QueryAsync<SharedWithMe>(userId, config).GetRemainingAsync();
            foreach (var sharedTemplate in sharedTemplates)
            {
                var template = await GetTemplate(sharedTemplate.TemplateOwnerId, sharedTemplate.TemplateId);
                if (template != null && template.IsShared)
                {
                    var templateOwner = await _context.LoadAsync<Profile>(sharedTemplate.TemplateOwnerId);
                    template.Owner = templateOwner.Name;

                    sharedWithMe.Add(template);
                }
            }

            return sharedWithMe;
        }
    }
}