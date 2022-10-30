using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services.User;
using MediatR;

namespace CafApi.Command
{
    public class DeleteCandidateCommand : IRequest
    {
        public string UserId { get; set; }

        public string TeamId { get; set; }

        public string CandidateId { get; set; }
    }

    public class DeleteCandidateCommandHandler : IRequestHandler<DeleteCandidateCommand>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly IInterviewRepository _interviewRepository;
        private readonly DynamoDBContext _context;

        public DeleteCandidateCommandHandler(
            IPermissionsService permissionsService,
            IInterviewRepository interviewRepository,
            IAmazonDynamoDB dynamoDbClient)
        {
            _permissionsService = permissionsService;
            _interviewRepository = interviewRepository;
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Unit> Handle(DeleteCandidateCommand command, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanUpdateOrDeleteOrArchiveCandidate(command.UserId, command.TeamId))
            {
                throw new AuthorizationException($"User ({command.UserId}) doesn't have permissions to delete candidate {command.CandidateId}");
            }

            var interviews = await _interviewRepository.GetInterviewsByCandidate(command.CandidateId);

            // Delete candidate interviews
            if (interviews != null && interviews.Any())
            {
                var interviewBatch = _context.CreateBatchWrite<Interview>();
                interviewBatch.AddDeleteItems(interviews);
                await interviewBatch.ExecuteAsync();
            }

            await _context.DeleteAsync<Candidate>(command.TeamId, command.CandidateId);

            return Unit.Value;
        }
    }
}
