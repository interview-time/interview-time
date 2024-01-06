using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.ViewModel;

namespace CafApi.Services
{
    public interface ILibraryService
    {
        Task<Library> GetLibraryTemplate(string libraryId);

        Task<List<Library>> GetTemplatesLibrary();

        Task<Library> GetLibraryTemplate(string userId, string templateId);

        Task<Library> CreateLibraryTemplate(string userId, TemplateRequest newTemplate);

        Task<Library> UpdateLibraryTemplate(string userId, TemplateRequest updatedTemplate);

        Task DeleteLibraryTemplate(string userId, string libraryId);
    }
}