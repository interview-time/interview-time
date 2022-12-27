using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CafApi.Common;
using CafApi.Repository;
using CafApi.Services.User;
using MediatR;

namespace CafApi.Query
{
    public class JobsQuery : IRequest<JobsQueryResult>
    {
        public string UserId { get; set; }

        public string TeamId { get; set; }
    }

    public class JobsQueryResult
    {
        public List<JobItem> Jobs { get; set; }
    }

    public class JobItem
    {
        public string JobId { get; set; }

        public string Title { get; set; }

        public string Location { get; set; }

        public string Department { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Status { get; set; }

        public int TotalCandidates { get; set; }

        public int NewlyAddedCandidates { get; set; }
    }

    public class JobsQueryHandler : IRequestHandler<JobsQuery, JobsQueryResult>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly IJobRepository _jobRepository;

        public JobsQueryHandler(
            IPermissionsService permissionsService,
            IJobRepository jobRepository)
        {
            _permissionsService = permissionsService;
            _jobRepository = jobRepository;
        }

        public async Task<JobsQueryResult> Handle(JobsQuery query, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanViewJobs(query.UserId, query.TeamId))
            {
                throw new AuthorizationException($"User ({query.UserId}) doesn't have permissions to view jobs.");
            }

            var jobs = await _jobRepository.GetAllJobs(query.TeamId);

            return new JobsQueryResult
            {
                Jobs = jobs.Select(j => new JobItem
                {
                    JobId = j.JobId,
                    Title = j.Title,
                    Location = j.Location,
                    Department = j.Department,
                    CreatedDate = j.CreatedDate,
                    Status = j.Status,
                    TotalCandidates = j.Pipeline
                        .Where(p => p.Candidates != null)
                        .SelectMany(p => p.Candidates)
                        .Count(),
                    NewlyAddedCandidates = j.Pipeline
                        .Where(p => p.Candidates != null)
                        .SelectMany(p => p.Candidates)
                        .Where(c => c.OriginallyAdded != null && c.OriginallyAdded > DateTime.UtcNow.AddDays(-7))
                        .Count()
                }).ToList()
            };
        }
    }
}
