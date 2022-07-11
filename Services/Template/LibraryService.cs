using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using CafApi.Models;
using CafApi.ViewModel;

namespace CafApi.Services
{
    public class LibraryService : ILibraryService
    {
        private readonly DynamoDBContext _context;

        public LibraryService(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
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

        public async Task<Library> GetLibraryTemplate(string libraryId)
        {
            var search = _context.FromQueryAsync<Library>(new QueryOperationConfig()
            {
                IndexName = "LibraryId-Index",
                Filter = new QueryFilter(nameof(Library.LibraryId), QueryOperator.Equal, libraryId)
            });
            var templates = await search.GetRemainingAsync();

            return templates.FirstOrDefault();
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
    }
}
