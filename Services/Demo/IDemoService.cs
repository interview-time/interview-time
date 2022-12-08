using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services.Demo
{
    public interface IDemoService
    {
        Task<List<Candidate>> CreateDemoCandidates(string userId, string teamId);

        Task<List<Template>> CreateDemoTemplates(string userId, string teamId);

        Task<Interview> CreateDemoInterview(string userId, string teamId, string candidateId, Template template, string timezone);
    }
}
