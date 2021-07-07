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

        public async Task<Template> CreateTemplate(string userId, TemplateRequest newTemplate, bool isDemo = false)
        {
            var template = new Template
            {
                UserId = userId,
                TemplateId = Guid.NewGuid().ToString(),
                Title = newTemplate.Title,
                Type = newTemplate.Type,
                Description = newTemplate.Description,
                Structure = newTemplate.Structure,
                IsDemo = isDemo,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
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

        public async Task DeleteTemplate(string userId, string templateId)
        {
            await _context.DeleteAsync<Template>(userId, templateId);
        }

        public async Task<List<Library>> GetTemplatesLibrary()
        {
            var conditions = new List<ScanCondition>();

            return await _context.ScanAsync<Library>(conditions).GetRemainingAsync();
        }

        public async Task<Library> GetLibraryTemplate(string userId, string libraryId)
        {
            return await _context.LoadAsync<Library>(userId, libraryId);
        }

        public async Task<Library> CreateLibraryTemplate(string userId, TemplateRequest newTemplate)
        {
            var libraryTemplate = new Library
            {
                UserId = userId,
                LibraryId = Guid.NewGuid().ToString(),
                Title = newTemplate.Title,
                Type = newTemplate.Type,
                Image = newTemplate.Image,
                Description = newTemplate.Description,
                Structure = newTemplate.Structure,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
            };

            // assign ids to groups if missing
            if (libraryTemplate.Structure != null && libraryTemplate.Structure.Groups != null)
            {
                foreach (var group in libraryTemplate.Structure.Groups)
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

            await _context.SaveAsync(libraryTemplate);

            return libraryTemplate;
        }

        public async Task<Library> UpdateLibraryTemplate(string userId, TemplateRequest updatedTemplate)
        {
            var libraryTemplate = await GetLibraryTemplate(userId, updatedTemplate.TemplateId);
            libraryTemplate.Title = updatedTemplate.Title;
            libraryTemplate.Type = updatedTemplate.Type;
            libraryTemplate.Description = updatedTemplate.Description;
            libraryTemplate.Image = updatedTemplate.Image;
            libraryTemplate.Structure = updatedTemplate.Structure;
            libraryTemplate.ModifiedDate = DateTime.UtcNow;

            // assign ids to groups if missing
            if (libraryTemplate.Structure != null && libraryTemplate.Structure.Groups != null)
            {
                foreach (var group in libraryTemplate.Structure.Groups)
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

            await _context.SaveAsync(libraryTemplate);

            return libraryTemplate;
        }

        public async Task DeleteLibraryTemplate(string userId, string libraryId)
        {
            await _context.DeleteAsync<Library>(userId, libraryId);
        }

        public async Task<Template> CloneTemplate(string fromUserId, string fromTemplateId, string toUserId)
        {
            var fromTemplate = await GetTemplate(fromUserId, fromTemplateId);

            fromTemplate.UserId = toUserId;
            fromTemplate.TemplateId = Guid.NewGuid().ToString();
            fromTemplate.CreatedDate = DateTime.UtcNow;
            fromTemplate.ModifiedDate = DateTime.UtcNow;

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
    }
}