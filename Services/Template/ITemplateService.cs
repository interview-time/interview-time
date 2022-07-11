using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.ViewModel;

namespace CafApi.Services
{
    public interface ITemplateService
    {
        Task<List<Template>> GetMyTemplates(string userId);

        Task<List<Template>> GetTeamTemplates(string userId, string teamId);

        Task<Template> GetTemplate(string userId, string templateId);

        Task<Template> GetTemplate(string templateId);

        Task<Template> CreateTemplate(string userId, TemplateRequest template, bool isDemo = false);

        Task ShareTemplate(string userId, string templateId, bool share);

        Task UpdateTemplate(string userId, TemplateRequest template);

        Task DeleteTemplate(string userId, string templateId);

        Task<Template> CloneTemplate(string fromUserId, string fromTemplateId, string toUserId, string toTeamId);

        Task<Template> GetSharedTemplate(string token);

        Task<Template> AddToSharedWithMe(string userId, string token);

        Task<List<Template>> GetSharedWithMe(string userId);       
    }
}