using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Repository
{
    public interface ITemplateRepository
    {
        Task<Template> GetTemplate(string templateId);
    }
}