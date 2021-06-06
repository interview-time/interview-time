using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Models;
using CafApi.ViewModel;

namespace CafApi.Services
{
    public class TemplateService : ITemplateService
    {
        private readonly DynamoDBContext _context;

        private readonly IInterviewService _interviewService;

        public TemplateService(IAmazonDynamoDB dynamoDbClient, IInterviewService interviewService)
        {
            _context = new DynamoDBContext(dynamoDbClient);
            _interviewService = interviewService;
        }

        public async Task<List<Template>> GetMyTemplates(string userId)
        {
            var config = new DynamoDBOperationConfig();

            var templates = await _context.QueryAsync<Template>(userId, config).GetRemainingAsync();
            foreach (var template in templates)
            {
                var interviews = await _interviewService.GetInterviewsByTemplate(template.TemplateId);
                template.TotalInterviews = interviews.Count();
            }

            return templates;
        }

        public async Task<Template> GetTemplate(string userId, string templateId)
        {
            return await _context.LoadAsync<Template>(userId, templateId);
        }

        public async Task<Template> CreateTemplate(string userId, TemplateRequest newTemplate)
        {
            var template = new Template
            {
                UserId = userId,
                TemplateId = Guid.NewGuid().ToString(),
                Title = newTemplate.Title,
                Type = newTemplate.Type,
                Description = newTemplate.Description,
                Structure = newTemplate.Structure,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
            };

            // assign ids to groups if missing
            if (template.Structure != null && template.Structure.Groups != null)
            {
                foreach (var group in template.Structure.Groups)
                {
                    group.GroupId = Guid.NewGuid().ToString();
                }
            }

            await _context.SaveAsync(template);

            return template;
        }

        public async Task UpdateTemplate(string userId, TemplateRequest updatedTemplate)
        {
            var template = await GetTemplate(userId, updatedTemplate.TemplateId);
            template.Title = updatedTemplate.Title;
            template.Type = updatedTemplate.Type;
            template.Description = updatedTemplate.Description;
            template.Structure = updatedTemplate.Structure;
            template.ModifiedDate = DateTime.UtcNow;

            // assign ids to groups if missing
            if (template.Structure != null && template.Structure.Groups != null)
            {
                foreach (var group in template.Structure.Groups)
                {
                    if (string.IsNullOrWhiteSpace(group.GroupId))
                    {
                        group.GroupId = Guid.NewGuid().ToString();
                    }
                }
            }

            await _context.SaveAsync(template);
        }

        public async Task DeleteTemplate(string userId, string templateId)
        {
            await _context.DeleteAsync<Template>(userId, templateId);
        }

        public async Task<List<Library>> GetTemplatesLibrary()
        {
            var conditions = new List<ScanCondition>();

            return await _context.ScanAsync<Library>(conditions).GetRemainingAsync();
        }
    }
}