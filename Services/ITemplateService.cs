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

        Task<Template> CreateTemplate(string userId, TemplateRequest template);

        Task UpdateTemplate(string userId, TemplateRequest template);

        Task DeleteTemplate(string userId, string templateId);

        Task<List<Library>> GetTemplatesLibrary();
    }
}