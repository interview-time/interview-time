using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services.User;

namespace CafApi.Services
{
    public class TemplateService : ITemplateService
    {
        private readonly DynamoDBContext _context;
        private readonly IInterviewRepository _interviewRepository;
        private readonly IPermissionsService _permissionsService;
        private readonly IChallengeRepository _challengeRepository;

        public TemplateService(IAmazonDynamoDB dynamoDbClient,
            IInterviewRepository interviewRepository,
            IPermissionsService permissionsService,
            IChallengeRepository challengeRepository)
        {
            _context = new DynamoDBContext(dynamoDbClient);
            _interviewRepository = interviewRepository;
            _permissionsService = permissionsService;
            _challengeRepository = challengeRepository;
        }

        public async Task<List<Template>> GetMyTemplates(string userId)
        {
            var config = new DynamoDBOperationConfig();

            var templates = await _context.QueryAsync<Template>(userId, config).GetRemainingAsync();
            templates = templates.Where(t => string.IsNullOrWhiteSpace(t.TeamId)).ToList();

            foreach (var template in templates)
            {
                var interviews = await _interviewRepository.GetInterviewsByTemplate(template.TemplateId);
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

            var challenges = await _challengeRepository.GetChallenges(teamId, challenegIds);

            foreach (var template in templates)
            {
                if (template.ChallengeIds != null && template.ChallengeIds.Any())
                {
                    template.Challenges = challenges.Where(c => template.ChallengeIds.Contains(c.ChallengeId)).ToList();
                }
                if (string.IsNullOrWhiteSpace(template.InterviewType))
                {
                    template.InterviewType = InterviewType.INTERVIEW.ToString();
                }
            }

            return templates;
        }

        public async Task<Template> GetTemplate(string userId, string templateId)
        {
            return await _context.LoadAsync<Template>(userId, templateId);
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