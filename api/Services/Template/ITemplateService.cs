using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services
{
    public interface ITemplateService
    {
        Task<List<Template>> GetMyTemplates(string userId);

        Task<List<Template>> GetTeamTemplates(string userId, string teamId);

        Task<Template> GetTemplate(string userId, string templateId);

        Task ShareTemplate(string userId, string templateId, bool share);

        Task DeleteTemplate(string userId, string templateId);        

        Task<Template> GetSharedTemplate(string token);        

        Task<List<Template>> GetSharedWithMe(string userId);       
    }
}
