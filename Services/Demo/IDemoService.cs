using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services.Demo
{
    public interface IDemoService
    {
        Task<List<Candidate>> CreateDemoCandidates(string userId, string teamId);
    }
}
