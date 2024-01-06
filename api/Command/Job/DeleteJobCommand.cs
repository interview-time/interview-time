using System.Threading;
using System.Threading.Tasks;
using CafApi.Common;
using CafApi.Repository;
using CafApi.Services.User;
using MediatR;

namespace CafApi.Command
{
    public class DeleteJobCommand : IRequest
    {
        internal string TeamId { get; set; }

        internal string UserId { get; set; }

        internal string JobId { get; set; }
    }

    public class DeleteJobCommandHandler : IRequestHandler<DeleteJobCommand>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly IJobRepository _jobRepository;

        public DeleteJobCommandHandler(IPermissionsService permissionsService, IJobRepository jobRepository)
        {
            _permissionsService = permissionsService;
            _jobRepository = jobRepository;
        }

        public async Task<Unit> Handle(DeleteJobCommand command, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanManageJobs(command.UserId, command.TeamId))
            {
                throw new AuthorizationException($"User ({command.UserId}) doesn't have permissions to delete a job.");
            }

            await _jobRepository.DeleteJob(command.TeamId, command.JobId);

            return Unit.Value;
        }
    }
}
