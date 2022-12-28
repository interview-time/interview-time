using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Repository
{
    public interface IJobRepository
    {
        Task<List<Job>> GetAllJobs(string teamId);

        Task<Job> GetJob(string teamId, string jobId);

        Task SaveJob(Job job);

        Task DeleteJob(string teamId, string jobId);
    }
}
