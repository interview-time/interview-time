using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services.User;
using MediatR;

namespace CafApi.Command
{
    public class CreateJobCommand : IRequest<Job>
    {
        public string TeamId { get; set; }

        public string UserId { get; set; }

        public string Title { get; set; }

        public string Location { get; set; }

        public string Department { get; set; }

        public DateTime? Deadline { get; set; }

        public List<string> Tags { get; set; }

        public string Description { get; set; }

        public List<JobStage> Pipeline { get; set; }
    }

    public class JobStage
    {
        public string Title { get; set; }

        public string Description { get; set; }

        public string Colour { get; set; }

        public string Type { get; set; }

        public string TemplateId { get; set; }
    }

    public class CreateJobCommandHandler : IRequestHandler<CreateJobCommand, Job>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly IJobRepository _jobRepository;

        public CreateJobCommandHandler(IPermissionsService permissionsService, IJobRepository jobRepository)
        {
            _permissionsService = permissionsService;
            _jobRepository = jobRepository;
        }

        public async Task<Job> Handle(CreateJobCommand command, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanManageJobs(command.UserId, command.TeamId))
            {
                throw new AuthorizationException($"User ({command.UserId}) doesn't have permissions to create a job.");
            }

            var job = new Job
            {
                TeamId = command.TeamId,
                JobId = Guid.NewGuid().ToString(),
                Title = command.Title,
                Location = command.Location,
                Department = command.Department,
                Deadline = command.Deadline,
                Tags = command.Tags,
                Description = command.Description,
                Owner = command.UserId,
                CreatedDate = DateTime.UtcNow,
                Status = JobStatus.OPEN.ToString(),
                Pipeline = command.Pipeline.Select(p => new Stage
                {
                    StageId = Guid.NewGuid().ToString(),
                    Title = p.Title,
                    Description = p.Description,
                    Colour = p.Colour,
                    Type = p.Type,
                    TemplateId = p.TemplateId,
                    CreatedDate = DateTime.UtcNow
                }).ToList()
            };

            await _jobRepository.SaveJob(job);

            return job;
        }
    }
}
