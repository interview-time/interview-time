using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.ViewModel;

namespace CafApi.Services
{
    public interface ITemplateService
    {
        Task<List<Template>> GetMyTemplates(string userId);

        Task<Template> GetTemplate(string userId, string templateId);

        Task<Template> CreateTemplate(string userId, TemplateRequest template, bool isDemo = false);

        Task ShareTemplate(string userId, string templateId, bool share);

        Task UpdateTemplate(string userId, TemplateRequest template);

        Task DeleteTemplate(string userId, string templateId);

        Task<Library> GetLibraryTemplate(string libraryId);

        Task<List<Library>> GetTemplatesLibrary();

        Task<Library> GetLibraryTemplate(string userId, string templateId);

        Task<Library> CreateLibraryTemplate(string userId, TemplateRequest newTemplate);

        Task<Library> UpdateLibraryTemplate(string userId, TemplateRequest updatedTemplate);

        Task DeleteLibraryTemplate(string userId, string libraryId);

        Task<Template> CloneTemplate(string fromUserId, string fromTemplateId, string toUserId);

        Task<Template> GetSharedTemplate(string token);

        Task<Template> AddToSharedWithMe(string userId, string token);

        Task<List<Template>> GetSharedWithMe(string userId);
    }
}