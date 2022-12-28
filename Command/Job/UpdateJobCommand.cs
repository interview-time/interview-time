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
    public class UpdateJobCommand : IRequest<Job>
    {
        internal string TeamId { get; set; }

        internal string UserId { get; set; }

        internal string JobId { get; set; }

        public string Title { get; set; }

        public string Location { get; set; }

        public string Department { get; set; }

        public DateTime? Deadline { get; set; }

        public List<string> Tags { get; set; }

        public string Description { get; set; }

        public List<UpdatedJobStage> Pipeline { get; set; }
    }

    public class UpdatedJobStage
    {
        public string StageId { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string Colour { get; set; }

        public string Type { get; set; }

        public string TemplateId { get; set; }
    }

    public class UpdateJobCommandHandler : IRequestHandler<UpdateJobCommand, Job>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly IJobRepository _jobRepository;

        public UpdateJobCommandHandler(IPermissionsService permissionsService, IJobRepository jobRepository)
        {
            _permissionsService = permissionsService;
            _jobRepository = jobRepository;
        }

        public async Task<Job> Handle(UpdateJobCommand command, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanManageJobs(command.UserId, command.TeamId))
            {
                throw new AuthorizationException($"User ({command.UserId}) doesn't have permissions to update a job.");
            }

            var job = await _jobRepository.GetJob(command.TeamId, command.JobId);
            if (job == null)
            {
                throw new ItemNotFoundException($"Job ({command.JobId}) not found");
            }

            job.Title = command.Title;
            job.Location = command.Location;
            job.Department = command.Department;
            job.Deadline = command.Deadline;
            job.Tags = command.Tags;
            job.Description = command.Description;
            job.ModifiedDate = DateTime.UtcNow;

            if (job.Pipeline == null)
            {
                job.Pipeline = new List<Stage>();
            }

            foreach (var updatedStage in command.Pipeline)
            {
                var stage = job.Pipeline.FirstOrDefault(s => updatedStage.StageId != null && s.StageId == updatedStage.StageId);
                if (stage != null)
                {
                    stage.Title = updatedStage.Title;
                    stage.Description = updatedStage.Description;
                    stage.Colour = updatedStage.Colour;
                    stage.Type = updatedStage.Type;
                    stage.TemplateId = updatedStage.TemplateId;
                    stage.ModifiedDate = DateTime.UtcNow;
                }
                else
                {
                    stage = new Stage
                    {
                        StageId = Guid.NewGuid().ToString(),
                        Title = updatedStage.Title,
                        Description = updatedStage.Description,
                        Colour = updatedStage.Colour,
                        Type = updatedStage.Type,
                        TemplateId = updatedStage.TemplateId,
                        CreatedDate = DateTime.UtcNow
                    };

                    job.Pipeline.Add(stage);
                }
            }

            await _jobRepository.SaveJob(job);

            return job;
        }
    }
}
